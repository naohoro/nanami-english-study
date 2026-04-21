import type { BossConfig } from './types'

export const BOSS_CONFIGS: Record<string, BossConfig> = {
  outline: {
    type: 'outline',
    name: '資料を読んでまとめる問題',
    section: 8,
    points: 17,
    trick: `資料1の「問題」＋資料2の「解決策」→ 答えは「だからこうなる」という選択肢。
「良さそう」に見えるけど文章に書いていない選択肢が必ず1つ混じってる。それが罠。
文章に書いてあることだけで選べ。`,
    trickSteps: [
      '資料1の「困っていること」を1行でまとめる',
      '資料2の「その解決方法」を1行でまとめる',
      '「だから〜になる」という文を作る → それに一番近い選択肢を選ぶ',
    ],
    example: {
      en: 'Resource 1: Cities have too much waste. Resource 2: Monthly reports helped people reduce waste by 20%.',
      ja: '→ 正解は「ゴミが減った」系の選択肢。「住民が幸せになった」は文章にないから罠。',
    },
    themes: ['technology', 'environment', 'community', 'daily_life'],
  },
  email: {
    type: 'email',
    name: 'メールを読んで答える問題',
    section: 5,
    points: 16,
    trick: `メールで読むのは2つだけ：①最後の一文（結論）②数字（日付・時間・金額）。
この2つを見つければ答えが出る。本文を全部読もうとしない。`,
    trickSteps: [
      'メールの最後の1文だけ読む（そこに結論がある）',
      '数字・日付・金額だけをさっと拾う',
      '選択肢と照合する',
    ],
    example: {
      en: '"Please reply by Friday, April 25." → Q: When is the deadline?',
      ja: '→ 数字「April 25」を見つければ即答できる。本文全部読む必要なし。',
    },
    themes: ['travel', 'business', 'daily_life', 'community'],
  },
}

export const WAKARANAI_CAUSES = [
  {
    key: 'vocabulary' as const,
    label: '単語がわからない',
    support: '該当する単語の意味と言い換え例を見せるよ',
  },
  {
    key: 'structure' as const,
    label: '文の構造がわからない',
    support: '主語・動詞・目的語に分解して日本語で見せるよ',
  },
  {
    key: 'background' as const,
    label: 'このテーマを知らない',
    support: 'このテーマを30秒で日本語解説するよ',
  },
  {
    key: 'question' as const,
    label: '何を聞かれているかわからない',
    support: '設問を日本語で言い換えるよ',
  },
  {
    key: 'unknown' as const,
    label: 'ぜんぶよくわからない',
    support: 'いっしょに考えよう。何から見てみる？',
  },
]
