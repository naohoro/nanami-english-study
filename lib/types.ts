export type BossType = 'outline' | 'email'

export type ProblemTheme =
  | 'travel'
  | 'technology'
  | 'environment'
  | 'community'
  | 'daily_life'
  | 'business'

export type ProblemMode = 'answer_first' | 'challenge'

export type WakaranaiCause =
  | 'vocabulary'
  | 'structure'
  | 'background'
  | 'question'
  | 'unknown'

export type SessionResult = 'cleared' | 'wakaranai' | 'pending'

export type MasteryStatus = 'untouched' | 'in_progress' | 'cleared'

// Claude APIが返す問題データ
export interface GeneratedProblem {
  id: string // クライアント側でuuidv4生成
  bossType: BossType
  theme: ProblemTheme
  difficulty: 1 | 2 | 3 | 4 | 5
  mode: ProblemMode
  // 問題本文（資料テキスト・メール本文など）
  passageHtml: string
  // 設問文
  questionText: string
  // 選択肢 (A〜D)
  choices: { label: 'A' | 'B' | 'C' | 'D'; text: string }[]
  // 正解ラベル
  correctLabel: 'A' | 'B' | 'C' | 'D'
  // 解説（answer_firstモードのみ返す、challengeではnull）
  explanation: string | null
  // 裏技のどのポイントが使えるか（任意）
  trickHint: string | null
}

export interface Session {
  id: string
  userId: string
  bossType: BossType
  difficulty: number
  theme: ProblemTheme
  mode: ProblemMode
  generatedQuestion: GeneratedProblem
  result: SessionResult
  wakaranaiCause: WakaranaiCause | null
  resolved: boolean
  createdAt: string
}

export interface Mastery {
  userId: string
  bossType: BossType
  status: MasteryStatus
  clearedAt: string | null
  attemptCount: number
}

export interface DifficultyState {
  userId: string
  bossType: BossType
  currentDifficulty: 1 | 2 | 3 | 4 | 5
  consecutiveFailures: number
}

export interface BossConfig {
  type: BossType
  name: string
  section: number
  points: number
  trick: string
  trickSteps: string[]
  themes: ProblemTheme[]
}
