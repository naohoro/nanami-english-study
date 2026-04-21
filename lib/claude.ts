import Anthropic from '@anthropic-ai/sdk'
import type { BossType, ProblemTheme, ProblemMode, GeneratedProblem, WakaranaiCause } from './types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

function buildProblemPrompt(
  bossType: BossType,
  difficulty: number,
  theme: ProblemTheme,
  mode: ProblemMode
): string {
  const themeMap: Record<ProblemTheme, string> = {
    travel: '旅行・予約',
    technology: 'テクノロジー',
    environment: '環境・自然',
    community: '地域コミュニティ',
    daily_life: '日常生活',
    business: 'ビジネス・買い物',
  }

  const difficultyDesc = ['', '易しい', '標準以下', '標準', '標準以上', '難しい'][difficulty]

  const typeInstructions: Record<BossType, string> = {
    short_text: `
問題タイプ：共通テスト第1問型（短い実用文）
- チラシ・告知・グループチャット・メモのいずれか1種類
- 150語以内の短い実用文
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 設問：本文の目的・条件・日時・場所に関する事実確認（4択）
- 正解：本文に明記されている事実のみ
- 誤答：本文に書いていないが「良さそう」に見える選択肢を1つ含める
- passageHtml形式（チラシ例）：<p><strong>[タイトル]</strong></p><p>[本文]</p>
- passageHtml形式（チャット例）：<p><strong>Group Chat: [グループ名]</strong></p><p>[名前1]: [発言]</p><p>[名前2]: [発言]</p>
`,
    survey_blog: `
問題タイプ：共通テスト第2問型（ブログ記事またはアンケート＋コメント）
- 形式A（ブログ）：200〜250語の段落構成ブログ記事（筆者の意見＋根拠＋具体例）
- 形式B（アンケート）：アンケート結果の数値表＋回答者のコメント3〜4件
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 設問：筆者の意見・根拠・アンケート結果の事実確認（4択）
- passageHtml形式（ブログ）：<p>段落1</p><p>段落2</p><p>段落3</p>
- passageHtml形式（アンケート）：<p><strong>[タイトル]</strong></p><table border="1" style="border-collapse:collapse;width:100%;font-size:0.9em"><tr><th>項目</th><th>回答(%)</th></tr>...</table><p><strong>コメント</strong></p><p>[名前A]: [コメント]</p>
`,
    short_story: `
問題タイプ：共通テスト第3問型（短編物語・時系列）
- 200〜280語の短編物語（主人公が複数のイベントを経験する）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 時間・順序を示す表現を4〜5つ含める（yesterday, two days later, the following week 等）
- 設問：本文中の出来事の正しい順序を選ぶ（4択）
- 正解：本文の時間表現を正しく並べた選択肢
- 誤答：出来事の順序が1〜2つ入れ替わっている選択肢を3つ
- passageHtml：<p>タグで段落区切り（3〜4段落）
- questionText例：「本文中の出来事を起きた順に並べたものとして最も適切なものを選べ」
- choicesは (1)→(2)→(3)→(4) の形式で出来事を並べた選択肢（A〜D）
`,
    essay_edit: `
問題タイプ：共通テスト第4問型（エッセイ添削）
- 生徒が書いたエッセイ（150〜200語、空所1か所）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 先生のコメント1〜2件（「具体例を追加」「理由を述べる」「対策を提案」等）
- 設問：先生のコメントに基づき空所に入る最適な文を選ぶ（4択）
- 正解：コメントの要求を正確に満たす文
- 誤答：コメントに言及のない情報を含む文
- passageHtml形式：<p><strong>Student Essay</strong></p><p>[エッセイ本文（空所は _____ ）]</p><p><strong>Teacher's Comments</strong></p><p>Comment 1: [コメント]</p>
`,
    multi_doc: `
問題タイプ：共通テスト第5問型（複数文書）
- 文書1（80〜120語）：チラシ・案内・告知のいずれか
- 文書2（80〜120語）：申込フォーム・返信メール・補足情報のいずれか
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 必ず具体的な数字（日付・料金・条件・定員等）を各文書に含める
- 設問：両文書の情報を照合しないと解けない事実確認（4択）
- 正解：文書1＋文書2の情報を組み合わせた結論
- 誤答：片方の文書だけで導ける「半正解」選択肢を1つ含める
- passageHtml形式：<p><strong>Document 1: [タイトル]</strong></p><p>[文書1本文]</p><p><strong>Document 2: [タイトル]</strong></p><p>[文書2本文]</p>
`,
    long_story: `
問題タイプ：共通テスト第6問型（長編物語）
- 300〜380語の物語文（明確な感情変化のある主人公）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 感情語（worried / relieved / disappointed / proud / frustrated / grateful 等）を最低3つ含める
- 感情の変化が明確な転換点を1か所以上含める
- 設問：登場人物の心情・行動の理由を問う問題（4択）
- 正解：本文の感情語・行動描写に直接根拠がある選択肢
- 誤答：感情は近いが本文に根拠がない選択肢を1〜2つ含める
- passageHtml：<p>タグで段落区切り（4〜5段落）
`,
    article_slides: `
問題タイプ：共通テスト第7問型（説明文＋スライド）
- 説明文（400〜500語、5〜6段落）：科学・社会・テクノロジー等のテーマ
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 発表スライド（空所1か所）：説明文の要点を整理したもの
- 設問：スライドの空所に入る最適な語句・文を選ぶ（4択）
- 正解：説明文の対応する段落から直接導ける内容
- 誤答：本文に無い情報または別段落の情報
- passageHtml形式：
  <p>[段落1]</p><p>[段落2]</p><p>[段落3]</p><p>[段落4]</p><p>[段落5]</p>
  <p><strong>Presentation Slides</strong></p>
  <p>Slide 1: [見出し1]<br>Slide 2: [見出し2] — [ ]<br>Slide 3: [見出し3]<br>Slide 4: [見出し4]</p>
  （スライドの空所は " — [ ]" で表す）
`,
    essay_synthesis: `
問題タイプ：共通テスト第8問型（複数意見→立場表明→アウトライン）
- 異なる立場の意見文4件（各60〜100語）
- 追加資料（説明文1件 100〜150語）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 設問1：提示された立場を支持する意見を4件中2件選ぶ（4択）
- 設問2（メインの設問）：追加資料を読んでアウトラインの空所に入る最適な文を選ぶ（4択）
- 正解（設問2）：立場の論理的帰結のみ
- 誤答：感情的に正しそうだが論理的でない選択肢を1つ必ず含める
- passageHtml形式：
  <p><strong>▶ Opinions</strong></p>
  <p><strong>[名前1] ([属性])</strong><br>[意見1本文]</p>
  <p><strong>[名前2] ([属性])</strong><br>[意見2本文]</p>
  <p><strong>[名前3] ([属性])</strong><br>[意見3本文]</p>
  <p><strong>[名前4] ([属性])</strong><br>[意見4本文]</p>
  <p><strong>▶ Position: [立場の文]</strong></p>
  <p><strong>▶ Additional Source</strong></p><p>[追加資料本文]</p>
  <p><strong>▶ Essay Outline</strong></p>
  <p>Introduction: [前提]<br>Body: Reason 1: [確定内容] / Reason 2: [ ]<br>Conclusion: [結論]</p>
`,
  }

  const explanationInstruction = mode === 'answer_first'
    ? '"explanation": "正解の根拠を日本語で3〜4文で説明する（どこに答えがあったか、なぜ他の選択肢が違うか）"'
    : '"explanation": null'

  const questionCountForType: Record<BossType, number> = {
    short_text: 2,
    survey_blog: 4,
    short_story: 3,
    essay_edit: 4,
    multi_doc: 4,
    long_story: 4,
    article_slides: 4,
    essay_synthesis: 4,
  }
  const qCount = questionCountForType[bossType]

  return `あなたは日本の共通テスト英語問題の専門家です。以下の仕様に厳密に従って問題を生成してください。

テーマ：${themeMap[theme]}
難易度：${difficultyDesc}（${difficulty}/5）
設問数：${qCount}問（必ず${qCount}問すべて生成すること）
${typeInstructions[bossType]}

出力は必ず以下のJSON形式のみで返してください。説明文や前置きは不要です：

{
  "scenario": "You are [状況設定の1文。例: a student looking at a notice / reading a blog about technology].",
  "passageHtml": "問題の本文HTML（<p>タグ使用可）",
  "questions": [
    {
      "number": 1,
      "questionText": "設問文（日本語可）",
      "choices": [
        {"label": "A", "text": "選択肢A"},
        {"label": "B", "text": "選択肢B"},
        {"label": "C", "text": "選択肢C"},
        {"label": "D", "text": "選択肢D"}
      ],
      "correctLabel": "A",
      ${explanationInstruction}
    }
  ],
  "trickHint": "この問題で使える裏技のポイントを1文で（日本語）"
}`
}

export async function generateProblem(params: {
  bossType: BossType
  difficulty: number
  theme: ProblemTheme
  mode: ProblemMode
}): Promise<Omit<GeneratedProblem, 'id' | 'bossType' | 'theme' | 'difficulty' | 'mode'>> {
  const { bossType, difficulty, theme, mode } = params

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: buildProblemPrompt(bossType, difficulty, theme, mode),
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  // JSON部分のみ抽出（マークダウンコードブロック対応）
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response')
  }

  return JSON.parse(jsonMatch[0])
}

export async function getSupportMessage(params: {
  cause: WakaranaiCause
  passageHtml: string
  questionText: string
}): Promise<string> {
  const { cause, passageHtml, questionText } = params

  const causePrompts: Record<WakaranaiCause, string> = {
    vocabulary: '問題文中の難しい単語を3〜5個取り上げ、意味と言い換え表現（パラフレーズ）をセットで日本語で説明してください。',
    structure: '問題文の主要な英文を1〜2文選んで、主語・動詞・目的語・修飾語に分解し、日本語訳と構造の解説をしてください。',
    background: 'この問題のテーマについて、共通テストに出る程度の背景知識を日本語で3〜4文で解説してください。',
    question: '設問が何を聞いているかを、簡単な日本語で言い換えてください。どこに答えのヒントがあるかも教えてください。',
    unknown: 'この問題を解くために、まず何から読み始めればよいかを、ステップバイステップで日本語でやさしく説明してください。',
  }

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `以下の問題について、${causePrompts[cause]}

問題文：
${passageHtml.replace(/<[^>]+>/g, '')}

設問：${questionText}

回答は300文字以内の日本語で、やさしく・短く・具体的に。
マークダウン記法（#・##・**・---・- など）は絶対に使わないこと。改行だけで段落を区切ること。`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  return content.text
}
