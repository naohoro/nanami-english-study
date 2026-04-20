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
    outline: `
問題タイプ：共通テスト第8問型（複数資料→アウトライン完成）
- 資料1（150〜200語）：問題・状況を描写する文章
- 資料2（150〜200語）：解決策・提案を描写する文章
- アウトライン（穴埋め形式）：資料1と2を統合した論理的帰結
- 設問：アウトラインの空欄に入る最適な選択肢を選ぶ（4択）
- 正解：資料1の問題＋資料2の解決策の論理的帰結
- 誤答：「感情的に正しそうだが論理的でない」選択肢を1つ以上含める
`,
    email: `
問題タイプ：共通テスト第5問型（メールのやり取り）
- メール1（100〜150語）：依頼・質問・状況報告のいずれか
- メール2（100〜150語）：メール1への返信
- 必ず具体的な数字（日付・時間・金額・数量のいずれか）を含める
- 設問：メールの内容に基づく事実確認問題（4択）
- 正解：メールの最後の一文または数字情報から直接導ける答え
- 誤答：本文中の別の情報と紛らわしい選択肢を含める
`,
  }

  const explanationInstruction = mode === 'answer_first'
    ? '"explanation": "正解の根拠を日本語で3〜4文で説明する（どこに答えがあったか、なぜ他の選択肢が違うか）"'
    : '"explanation": null'

  return `あなたは日本の共通テスト英語問題の専門家です。以下の仕様に厳密に従って問題を生成してください。

テーマ：${themeMap[theme]}
難易度：${difficultyDesc}（${difficulty}/5）
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
  ${explanationInstruction},
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
    max_tokens: 2048,
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

回答は200文字以内の日本語で、やさしく・短く・具体的に。`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  return content.text
}
