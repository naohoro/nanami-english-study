export type BossType =
  | 'vocab'
  | 'grammar'
  | 'conversation'
  | 'chart'
  | 'email'
  | 'story'
  | 'multi_source'
  | 'outline'

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
  id: string
  bossType: BossType
  theme: ProblemTheme
  difficulty: 1 | 2 | 3 | 4 | 5
  mode: ProblemMode
  passageHtml: string
  questionText: string
  choices: { label: 'A' | 'B' | 'C' | 'D'; text: string }[]
  correctLabel: 'A' | 'B' | 'C' | 'D'
  explanation: string | null
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
  timeLimit: number  // seconds
  trick: string
  trickSteps: string[]
  example?: { en: string; ja: string }
  themes: ProblemTheme[]
}
