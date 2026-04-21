/**
 * One-time seed script: generates sample problems via Claude API and inserts to Supabase.
 *
 * Run:
 *   npx tsx scripts/seed-problems.ts
 *
 * Required env vars (from .env.local or set inline):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local from project root
config({ path: resolve(__dirname, '../.env.local') })

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BOSS_THEMES: Record<string, string[]> = {
  outline: ['technology', 'environment', 'community', 'daily_life'],
  email: ['travel', 'business', 'daily_life', 'community'],
}

const DIFFICULTY_LABELS = ['', '易しい', '標準以下', '標準', '標準以上', '難しい']

const VARIANTS = 2

function buildPrompt(bossType: string, difficulty: number, theme: string): string {
  const themeMap: Record<string, string> = {
    travel: '旅行・予約', technology: 'テクノロジー', environment: '環境・自然',
    community: '地域コミュニティ', daily_life: '日常生活', business: 'ビジネス・買い物',
  }

  const typeInstructions: Record<string, string> = {
    outline: `
問題タイプ：共通テスト第8問型（複数資料→アウトライン完成）
- 資料1（150〜200語）：問題・状況を描写する文章
- 資料2（150〜200語）：解決策・提案を描写する文章
- アウトライン（穴埋め形式）：資料1と2を統合した論理的帰結
- 設問：アウトラインの空欄に入る最適な選択肢を選ぶ（4択）
- 正解：資料1の問題＋資料2の解決策の論理的帰結
- 誤答：「感情的に正しそうだが論理的でない」選択肢を1つ以上含める`,
    email: `
問題タイプ：共通テスト第5問型（メールのやり取り）
- メール1（100〜150語）：依頼・質問・状況報告のいずれか
- メール2（100〜150語）：メール1への返信
- 必ず具体的な数字（日付・時間・金額・数量のいずれか）を含める
- 設問：メールの内容に基づく事実確認問題（4択）
- 正解：メールの最後の一文または数字情報から直接導ける答え
- 誤答：本文中の別の情報と紛らわしい選択肢を含める`,
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
  let total = 0
  let failed = 0

  for (const [bossType, themes] of Object.entries(BOSS_THEMES)) {
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
  if (failed > 0) console.log(`${failed} failed — re-run to retry (duplicate inserts are safe).`)
}

seed().catch(console.error)
