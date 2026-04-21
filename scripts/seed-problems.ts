/**
 * One-time seed script: generates sample problems via Claude API and inserts to Supabase.
 *
 * Run all:        npx tsx scripts/seed-problems.ts
 * Run one type:   BOSS_TYPE=vocab npx tsx scripts/seed-problems.ts
 *
 * Required env vars (from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BOSS_THEMES: Record<string, string[]> = {
  vocab:        ['daily_life', 'technology', 'community', 'environment'],
  grammar:      ['business', 'daily_life', 'technology', 'community'],
  conversation: ['daily_life', 'travel', 'community', 'business'],
  chart:        ['technology', 'environment', 'business', 'community'],
  email:        ['travel', 'business', 'daily_life', 'community'],
  story:        ['daily_life', 'community', 'travel', 'environment'],
  multi_source: ['technology', 'environment', 'business', 'community'],
  outline:      ['technology', 'environment', 'community', 'daily_life'],
}

const DIFFICULTY_LABELS = ['', '易しい', '標準以下', '標準', '標準以上', '難しい']
const VARIANTS = 2

const themeMap: Record<string, string> = {
  travel: '旅行・予約', technology: 'テクノロジー', environment: '環境・自然',
  community: '地域コミュニティ', daily_life: '日常生活', business: 'ビジネス・買い物',
}

function buildPrompt(bossType: string, difficulty: number, theme: string): string {
  const typeInstructions: Record<string, string> = {
    vocab: `
問題タイプ：共通テスト第1問型（発音・アクセント）
以下のどちらかの形式で作成してください（交互に使ってください）：
形式A（発音）：4つの単語の下線部の発音が他と異なるものを1つ選ぶ
形式B（アクセント）：4つの単語のうち強勢の位置が他と異なるものを1つ選ぶ

passageHtml形式（形式A）：
<p>Select the word whose underlined part is pronounced differently from the others.</p>
<p>A.&nbsp;<u>発音記号の部分</u>rest &nbsp; B.&nbsp;<u>e</u>very &nbsp; C.&nbsp;<u>e</u>ight &nbsp; D.&nbsp;<u>e</u>at</p>

passageHtml形式（形式B）：
<p>Select the word whose stress (accent) is placed differently from the others.</p>
<p>A.&nbsp;de-SIGN &nbsp; B.&nbsp;mo-MENT &nbsp; C.&nbsp;na-TION &nbsp; D.&nbsp;stu-DENT</p>

choicesは A/B/C/D に単語のみ（下線や音節区切りなし）
- 正解は発音・アクセントのルールに基づき1つだけ正しいこと（確実に正解が明確）
- trickHint：そのルール（例：-tion の前の音節にアクセントが来る）を1文で`,

    grammar: `
問題タイプ：共通テスト第2問型（文法・語法の空所補充）
- 空所のある英文1〜2文。空所に入る最適な語句を4択で選ぶ
- 空所は①動詞の形（時制・態・不定詞・動名詞）②前置詞 ③接続詞・関係詞 のいずれか
- passageHtmlは空所付き英文（空所は _____ で表す）
- 誤答：品詞は正しいが時制・格・語法が間違うもの
- questionText：「空所に入る最も適切なものを選べ」`,

    conversation: `
問題タイプ：共通テスト第3問型（会話文読解）
- 4〜6往復の会話文。空所1か所に入る発言を4択で選ぶ
- 空所は会話の自然な流れを妨げない位置に設定
- passageHtml形式：
  <p>A: "発言1"</p>
  <p>B: "発言2"</p>
  <p>A: "[&nbsp;&nbsp;&nbsp;&nbsp;]"</p>
  <p>B: "続きの発言"</p>
- 誤答：文脈に合わない返し・話題がズレる返し
- questionText：「空所に入る最も適切なものを選べ」`,

    chart: `
問題タイプ：共通テスト第4問型（図表・グラフ読み取り）
- HTML形式の表（<table>タグ使用）または棒グラフを文字で表現した資料
- 具体的な数値・割合・順位を含む
- 設問：表の数値や傾向について事実確認する問題（4択）
- 誤答：表内の別の数値と混同しやすい選択肢を含める
- passageHtml形式（テーブル例）：
  <p><strong>[タイトル]</strong></p>
  <table border="1" style="border-collapse:collapse;width:100%;font-size:0.9em">
    <tr><th>項目</th><th>2022年</th><th>2023年</th><th>2024年</th></tr>
    <tr><td>A</td><td>45%</td><td>52%</td><td>61%</td></tr>
    <tr><td>B</td><td>30%</td><td>28%</td><td>25%</td></tr>
  </table>
  <p>出典：[架空の調査名]</p>`,

    email: `
問題タイプ：共通テスト第5問型（メールのやり取り）
- メール1（100〜150語）：依頼・質問・状況報告のいずれか
- メール2（100〜150語）：メール1への返信
- 必ず具体的な数字（日付・時間・金額・数量のいずれか）を含める
- 設問：メールの内容に基づく事実確認問題（4択）
- 正解：メールの最後の一文または数字情報から直接導ける答え
- 誤答：本文中の別の情報と紛らわしい選択肢を含める

passageHtmlの形式（必ずこの形式でメール1とメール2の両方を含めること）：
<p><strong>Email 1</strong></p><p>From: [送信者]<br>To: [宛先]<br>Subject: [件名]</p><p>[メール1本文]</p><p><strong>Email 2</strong></p><p>From: [送信者]<br>To: [宛先]<br>Subject: [件名]</p><p>[メール2本文]</p>`,

    story: `
問題タイプ：共通テスト第6問型（物語・長文読解）
- 250〜350語の物語文または日記・ブログ形式のエッセイ
- 登場人物の感情変化・行動の理由が明確に描かれていること
- 感情語（worried / relieved / disappointed / surprised / proud 等）を最低2つ含める
- 設問：登場人物の心情・行動の理由を問う問題（4択）
- 誤答：感情は近いが本文に根拠がない選択肢を含める
- passageHtml：<p>タグで段落区切り（4〜5段落）`,

    multi_source: `
問題タイプ：共通テスト第7問型（複数資料の統合）
- 資料1（100〜150語）：ウェブページ・パンフレット・案内文のいずれか
- 資料2（100〜150語）：資料1に関連するが別視点の情報（FAQ・レビュー・補足案内等）
- 必ず両方の資料を参照しないと解けない設問にすること
- 設問：両資料を統合して答える事実確認問題（4択）
- 正解：資料1＋資料2の情報を組み合わせた結論
- 誤答：資料1のみ・資料2のみで導ける「半正解」選択肢を含める

passageHtml形式：
<p><strong>Resource 1: [タイトル]</strong></p><p>[資料1本文]</p><p><strong>Resource 2: [タイトル]</strong></p><p>[資料2本文]</p>`,

    outline: `
問題タイプ：共通テスト第8問型（複数資料→アウトライン完成）
- 資料1（150〜200語）：問題・状況を描写する文章
- 資料2（150〜200語）：解決策・提案を描写する文章
- アウトライン（穴埋め形式）：資料1と2を統合した論理的帰結
- 設問：アウトラインの空欄に入る最適な選択肢を選ぶ（4択）
- 正解：資料1の問題＋資料2の解決策の論理的帰結
- 誤答：「感情的に正しそうだが論理的でない」選択肢を1つ以上含める`,
  }

  return `あなたは日本の共通テスト英語問題の専門家です。以下の仕様に厳密に従って問題を生成してください。

テーマ：${themeMap[theme]}
難易度：${DIFFICULTY_LABELS[difficulty]}（${difficulty}/5）
${typeInstructions[bossType]}

出力は必ず以下のJSON形式のみで返してください。説明文や前置きは不要です：

{
  "passageHtml": "問題の本文HTML（<p>タグ使用可）",
  "questionText": "設問文（日本語可）",
  "choices": [
    {"label": "A", "text": "選択肢A"},
    {"label": "B", "text": "選択肢B"},
    {"label": "C", "text": "選択肢C"},
    {"label": "D", "text": "選択肢D"}
  ],
  "correctLabel": "A",
  "explanation": "正解の根拠を日本語で3〜4文で説明する（どこに答えがあったか、なぜ他の選択肢が違うか）",
  "trickHint": "この問題で使える裏技のポイントを1文で（日本語）"
}`
}

async function generateOne(bossType: string, difficulty: number, theme: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: buildPrompt(bossType, difficulty, theme) }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')

  return JSON.parse(jsonMatch[0])
}

async function seed() {
  const filterBossType = process.env.BOSS_TYPE ?? null
  const bossesToRun = filterBossType
    ? { [filterBossType]: BOSS_THEMES[filterBossType] }
    : BOSS_THEMES

  if (filterBossType) {
    console.log(`Deleting existing records for boss_type='${filterBossType}'...`)
    const { error } = await supabase.from('sample_problems').delete().eq('boss_type', filterBossType)
    if (error) { console.error(`Delete failed: ${error.message}`); process.exit(1) }
    console.log('Deleted. Starting re-seed...\n')
  }

  let total = 0
  let failed = 0

  for (const [bossType, themes] of Object.entries(bossesToRun)) {
    for (const theme of themes) {
      for (let difficulty = 1; difficulty <= 5; difficulty++) {
        for (let i = 0; i < VARIANTS; i++) {
          total++
          const label = `${bossType}/${theme}/d${difficulty} [${i + 1}/${VARIANTS}]`
          process.stdout.write(`Generating ${label} ... `)
          try {
            const p = await generateOne(bossType, difficulty, theme)
            const { error } = await supabase.from('sample_problems').insert({
              boss_type: bossType,
              theme,
              difficulty,
              passage_html: p.passageHtml,
              question_text: p.questionText,
              choices: p.choices,
              correct_label: p.correctLabel,
              explanation: p.explanation ?? null,
              trick_hint: p.trickHint ?? null,
            })
            if (error) {
              console.log(`DB ERROR: ${error.message}`)
              failed++
            } else {
              console.log('✓')
            }
          } catch (err) {
            console.log(`FAILED: ${err}`)
            failed++
          }
          await new Promise(r => setTimeout(r, 800))
        }
      }
    }
  }

  console.log(`\nDone. ${total - failed}/${total} inserted.`)
  if (failed > 0) console.log(`${failed} failed — re-run with BOSS_TYPE=<type> to retry.`)
}

seed().catch(console.error)
