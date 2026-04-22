export type BossType =
  | 'short_text'
  | 'survey_blog'
  | 'short_story'
  | 'essay_edit'
  | 'multi_doc'
  | 'long_story'
  | 'article_slides'
  | 'essay_synthesis'

export type ProblemTheme =
  | 'travel'
  | 'technology'
  | 'environment'
  | 'community'
  | 'daily_life'
  | 'business'
  | 'health_food'
  | 'education'

export type ProblemMode = 'answer_first' | 'challenge'

export type WakaranaiCause =
  | 'vocabulary'
  | 'structure'
  | 'background'
  | 'question'
  | 'unknown'

export type SessionResult = 'cleared' | 'wakaranai' | 'pending'

export type MasteryStatus = 'untouched' | 'in_progress' | 'cleared'

export interface Question {
  number: number
  questionText: string
  choices: { label: 'A' | 'B' | 'C' | 'D'; text: string }[]
  correctLabel: 'A' | 'B' | 'C' | 'D'
  explanation: string | null
}

// Claude APIが返す問題データ
export interface GeneratedProblem {
  id: string
  bossType: BossType
  theme: ProblemTheme
  difficulty: 1 | 2 | 3 | 4 | 5
  mode: ProblemMode
  scenario: string
  passageHtml: string
  questions: Question[]
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

export interface BossRationale {
  points: number
  totalShare: number
  accuracyPct2025: number
  growthPotential: 'low' | 'medium' | 'high'
  headline: string
  rationale: string
}

export interface BossConfig {
  type: BossType
  name: string
  section: number
  points: number
  questionCount: number
  timeLimit: number  // seconds
  trick: string
  trickSteps: string[]
  example?: { scenario: string; en: string; questionJa: string; ja: string }
  themes: ProblemTheme[]
  rationale?: BossRationale
}

export interface Profile {
  id: string
  userId: string
  examDate: string | null
  studyStartedAt: string
  createdAt: string
}

export interface UserStats {
  totalSessions: number
  clearedCount: number
  accuracyPct: number
  studyDays: number
}

export type AiTeacherPageType = 'problem' | 'map' | 'general'

export interface AiTeacherContext {
  pageType: AiTeacherPageType
  bossType?: BossType
  passageHtml?: string
  questionText?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
