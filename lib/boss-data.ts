import type { BossConfig } from './types'

export const BOSS_CONFIGS: Record<string, BossConfig> = {
  outline: {
    type: 'outline',
    name: 'アウトライン作成',
    section: 8,
    points: 17,
    trick: `資料1の"問題点"＋資料2の"解決策"→ 答えは"その論理的帰結"。
感情的に正しそうな選択肢が1つ混じってる。それが罠。冷静に"論理だけ"で選べ。`,
    trickSteps: [
      '資料1の「問題」を1行でまとめる',
      '資料2の「解決策」を1行でまとめる',
      '「だから〜になる」という文を作る → それに最も近い選択肢を選ぶ',
    ],
    themes: ['technology', 'environment', 'community', 'daily_life'],
  },
  email: {
    type: 'email',
    name: 'メール読解',
    section: 5,
    points: 16,
    trick: `メールで読むのは2つだけ：①最後の一文（結論）②数字（日付・時間・金額）。
その2つを照合すれば答えが出る。本文全部読もうとするな。`,
    trickSteps: [
      'メール最後の一文を読む（結論）',
      '数字・日付・金額だけをピックアップする',
      '設問の選択肢と照合する',
    ],
    themes: ['travel', 'business', 'daily_life', 'community'],
  },
}

export const WAKARANAI_CAUSES = [
  {
    key: 'vocabulary' as const,
    label: 'A. 単語がわからない',
    support: '該当する単語の意味と言い換え例を見せるよ',
  },
  {
    key: 'structure' as const,
    label: 'B. 文の構造がわからない',
    support: '主語・動詞・目的語に分解して日本語で見せるよ',
  },
  {
    key: 'background' as const,
    label: 'C. このテーマを知らない',
    support: 'このテーマを30秒で日本語解説するよ',
  },
  {
    key: 'question' as const,
    label: 'D. 何を聞かれているかわからない',
    support: '設問を日本語で言い換えるよ',
  },
  {
    key: 'unknown' as const,
    label: 'E. ぜんぶよくわからない',
    support: 'いっしょに考えよう。何から見てみる？',
  },
]
