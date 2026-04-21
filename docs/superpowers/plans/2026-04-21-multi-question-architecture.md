# Multi-Question Architecture + Font Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the problem data model so each passage has multiple questions (matching actual 共通テスト format), add exam-style font styling, and remove personal references.

**Architecture:** Replace the single `questionText/choices/correctLabel/explanation` fields in `GeneratedProblem` with a `questions: Question[]` array plus a `scenario: string` intro sentence. The DB `sample_problems` table loses four columns and gains two. UI components (ProblemPanel, AnswerReveal, step2, master) all get updated for the multi-question flow.

**Tech Stack:** Next.js 15 App Router, TypeScript, Supabase PostgreSQL, Claude Sonnet API, Tailwind CSS v4

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/types.ts` | Modify | Add `Question` interface; rewrite `GeneratedProblem`; add `questionCount` to `BossConfig` |
| `lib/boss-data.ts` | Modify | Add `questionCount` to each of 8 boss configs |
| `supabase/migrations/007_multi_question_schema.sql` | Create | Alter `sample_problems` table |
| `lib/claude.ts` | Modify | New multi-question prompt format |
| `app/api/sample-problem/route.ts` | Modify | Map new DB columns to `GeneratedProblem` |
| `components/boss/ProblemPanel.tsx` | Rewrite | Multi-question UI with per-question selection |
| `components/boss/AnswerReveal.tsx` | Rewrite | Score display + per-question result panels |
| `app/boss/[type]/step2/page.tsx` | Modify | Multi-question `selectedLabels` state |
| `app/master/[type]/page.tsx` | Rewrite | Multi-question submit, parallel highlight fetches, score |
| `app/wakaranai/page.tsx` | Modify | Accept `questionIndex` URL param |
| `scripts/seed-problems.ts` | Modify | New multi-question prompt format |
| `app/globals.css` | Modify | Font CSS variables |
| `app/layout.tsx` | Modify | Add Japanese serif font |
| `components/boss/ProblemPanel.tsx` | (same rewrite) | Apply serif to English passage |
| `app/boss/[type]/step2/page.tsx` | (same modify) | Exam header with section/points/time, gothic font |
| `app/login/page.tsx` | Modify | Remove personal references |
| `app/onboarding/page.tsx` | Modify | Remove personal references |
| `app/layout.tsx` | (same modify) | Title already updated in previous session |
| `components/map/ProgressBanner.tsx` | Modify | Remove personal references |
| `app/page.tsx` | Modify | Remove personal references |

---

## Task 1: Update `lib/types.ts`

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Read the current file**

```bash
cat lib/types.ts
```

- [ ] **Step 2: Replace with new types**

Replace the entire file with:

```typescript
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

export interface BossConfig {
  type: BossType
  name: string
  section: number
  points: number
  questionCount: number
  timeLimit: number  // seconds
  trick: string
  trickSteps: string[]
  example?: { en: string; ja: string }
  themes: ProblemTheme[]
}
```

- [ ] **Step 3: Verify TypeScript compiles (expect errors in boss-data.ts — that's fine for now)**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 4: Commit**

```bash
cd /Users/horota/Claude/private/daughter-study-app
git add lib/types.ts
git commit -m "feat: add Question interface and multi-question GeneratedProblem"
```

---

## Task 2: Update `lib/boss-data.ts`

**Files:**
- Modify: `lib/boss-data.ts`

- [ ] **Step 1: Add `questionCount` to each boss config**

Add `questionCount` after `points` in each of the 8 bosses. Values:
- `short_text`: 2
- `survey_blog`: 4
- `short_story`: 3
- `essay_edit`: 4
- `multi_doc`: 4
- `long_story`: 4
- `article_slides`: 4
- `essay_synthesis`: 4

Read the file first, then add `questionCount: N,` after `points: N,` for each boss.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | grep "boss-data"
```

Expected: no errors for boss-data.ts.

- [ ] **Step 3: Commit**

```bash
git add lib/boss-data.ts
git commit -m "feat: add questionCount to all 8 boss configs"
```

---

## Task 3: Create DB migration `supabase/migrations/007_multi_question_schema.sql`

**Files:**
- Create: `supabase/migrations/007_multi_question_schema.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- 007_multi_question_schema.sql
-- Replace single-question columns with multi-question structure

alter table sample_problems
  drop column if exists question_text,
  drop column if exists choices,
  drop column if exists correct_label,
  drop column if exists explanation,
  add column if not exists scenario text not null default '',
  add column if not exists questions jsonb not null default '[]'::jsonb;

-- Remove the default after migration (new rows must supply values)
alter table sample_problems
  alter column scenario drop default,
  alter column questions drop default;
```

- [ ] **Step 2: Run in Supabase Dashboard SQL Editor**

Go to Supabase Dashboard → SQL Editor → paste the migration → click Run.

Expected result: "Success. No rows returned."

- [ ] **Step 3: Verify the schema change**

In Supabase SQL Editor:
```sql
select column_name, data_type
from information_schema.columns
where table_name = 'sample_problems'
order by ordinal_position;
```

Expected: columns include `scenario` (text), `questions` (jsonb). Old columns `question_text`, `choices`, `correct_label`, `explanation` should be gone.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/007_multi_question_schema.sql
git commit -m "feat: migrate sample_problems to multi-question schema"
```

---

## Task 4: Update `lib/claude.ts`

**Files:**
- Modify: `lib/claude.ts`

- [ ] **Step 1: Replace `buildProblemPrompt` return string**

The JSON output section (currently returning `passageHtml`, `questionText`, `choices`, `correctLabel`, `explanation`, `trickHint`) must change to:

```json
{
  "scenario": "You are [context sentence — e.g., 'a student planning a trip' or 'reading an article']...",
  "passageHtml": "...",
  "questions": [
    {
      "number": 1,
      "questionText": "設問文（日本語）",
      "choices": [
        {"label": "A", "text": "..."},
        {"label": "B", "text": "..."},
        {"label": "C", "text": "..."},
        {"label": "D", "text": "..."}
      ],
      "correctLabel": "A",
      "explanation": "正解の根拠を日本語で3〜4文"
    },
    {
      "number": 2,
      ...
    }
  ],
  "trickHint": "1文の裏技ポイント"
}
```

The `explanation` should be `null` for each question when `mode === 'challenge'`, non-null for `'answer_first'`.

- [ ] **Step 2: Replace the full `buildProblemPrompt` function**

Read the current `lib/claude.ts` then apply this replacement for the return string (lines 130–150 in original):

```typescript
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
設問数：${qCount}問
${typeInstructions[bossType]}

出力は必ず以下のJSON形式のみで返してください。説明文や前置きは不要です：

{
  "scenario": "You are [状況設定の1文。例：a student looking at a notice board / reading a blog about technology].",
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
```

Note: the `questions` array in the prompt example shows 1 item — Claude will generate `qCount` items because we tell it the count in the instructions.

- [ ] **Step 3: Update `generateProblem` return type and parsing**

Change the return type and implementation:

```typescript
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

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response')
  }

  return JSON.parse(jsonMatch[0])
}
```

Note: `max_tokens` increased to 4096 (multi-question responses are longer).

- [ ] **Step 4: Update `getSupportMessage` to accept `questionText: string | undefined`**

The signature already accepts `questionText: string`, no change needed. The caller (wakaranai page) will pass the correct question's text.

- [ ] **Step 5: Verify TypeScript**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | grep "claude.ts"
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/claude.ts
git commit -m "feat: update Claude prompt for multi-question format"
```

---

## Task 5: Update `app/api/sample-problem/route.ts`

**Files:**
- Modify: `app/api/sample-problem/route.ts`

- [ ] **Step 1: Replace the `problem` mapping (lines 40–54 in original)**

Old mapping:
```typescript
const problem: GeneratedProblem = {
  id: row.id,
  bossType: row.boss_type,
  theme: row.theme,
  difficulty: row.difficulty,
  mode: 'answer_first',
  passageHtml: row.passage_html,
  questionText: row.question_text,
  choices: row.choices,
  correctLabel: row.correct_label,
  explanation: row.explanation ?? null,
  trickHint: row.trick_hint ?? null,
}
```

New mapping:
```typescript
const problem: GeneratedProblem = {
  id: row.id,
  bossType: row.boss_type,
  theme: row.theme,
  difficulty: row.difficulty,
  mode: 'answer_first',
  scenario: row.scenario,
  passageHtml: row.passage_html,
  questions: row.questions,
  trickHint: row.trick_hint ?? null,
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | grep "sample-problem"
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/sample-problem/route.ts
git commit -m "feat: update sample-problem API route for multi-question format"
```

---

## Task 6: Rewrite `components/boss/ProblemPanel.tsx`

**Files:**
- Modify: `components/boss/ProblemPanel.tsx`

- [ ] **Step 1: Write the new component**

```typescript
'use client'

import { useState } from 'react'
import type { GeneratedProblem } from '@/lib/types'

interface ProblemPanelProps {
  problem: GeneratedProblem
  selectedLabels?: Record<number, 'A' | 'B' | 'C' | 'D' | null>
  onSelect?: (questionNumber: number, label: 'A' | 'B' | 'C' | 'D') => void
  revealAnswer?: boolean
  highlightMap?: Record<number, { keyText: string; keyJapanese: string }>
}

function injectHighlight(html: string, text: string, color: 'green' | 'pink'): string {
  if (!text) return html
  const bg = color === 'green' ? '#BBFFD4' : '#FFD0D0'
  const idx = html.indexOf(text)
  if (idx === -1) return html
  return (
    html.slice(0, idx) +
    `<mark style="background:${bg};border-radius:2px;padding:1px 2px">${text}</mark>` +
    html.slice(idx + text.length)
  )
}

export function ProblemPanel({
  problem,
  selectedLabels = {},
  onSelect,
  revealAnswer = false,
  highlightMap = {},
}: ProblemPanelProps) {
  const [showJapanese, setShowJapanese] = useState(false)
  const [japanese, setJapanese] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)

  async function handleTranslate() {
    if (japanese) { setShowJapanese(!showJapanese); return }
    setTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passageHtml: problem.passageHtml }),
      })
      const data = await res.json()
      setJapanese(data.japanese)
      setShowJapanese(true)
    } finally {
      setTranslating(false)
    }
  }

  // Build passage HTML with all highlights applied
  let displayHtml = problem.passageHtml
  if (revealAnswer && Object.keys(highlightMap).length > 0) {
    // Apply highlights for wrong answers in pink, correct in green
    for (const [qNumStr, highlight] of Object.entries(highlightMap)) {
      const qNum = Number(qNumStr)
      const q = problem.questions.find(q => q.number === qNum)
      if (!q || !highlight.keyText) continue
      const selected = selectedLabels[qNum]
      const correct = selected === q.correctLabel
      displayHtml = injectHighlight(displayHtml, highlight.keyText, correct ? 'green' : 'pink')
    }
  }

  return (
    <div className="space-y-4">
      {/* シナリオ */}
      {problem.scenario && (
        <p className="text-sm leading-relaxed font-mincho" style={{ color: '#1A1A1A' }}>
          {problem.scenario}
        </p>
      )}

      {/* 問題文 */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid var(--border)', background: '#F5F5F5' }}>
          <p className="text-xs font-bold" style={{ color: '#787878' }}>問題文</p>
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="text-xs font-bold px-3 py-1 rounded-full transition-opacity active:opacity-60 disabled:opacity-40"
            style={{ background: 'var(--burgundy-light)', color: 'var(--burgundy)' }}
          >
            {translating ? '翻訳中...' : showJapanese ? '英語で読む' : '日本語で読む'}
          </button>
        </div>

        {showJapanese && japanese ? (
          <div className="p-4 text-sm leading-relaxed whitespace-pre-line font-mincho" style={{ color: '#1A1A1A' }}>
            {japanese}
          </div>
        ) : (
          <div
            className="p-4 text-sm leading-relaxed passage-english"
            style={{ color: '#1A1A1A' }}
            dangerouslySetInnerHTML={{ __html: displayHtml }}
          />
        )}
      </div>

      {/* 設問一覧 */}
      <div className="space-y-5">
        {problem.questions.map((q) => {
          const selectedLabel = selectedLabels[q.number] ?? null

          return (
            <div key={q.number} className="space-y-2">
              <p className="text-sm font-bold font-mincho" style={{ color: '#1A1A1A' }}>
                問{q.number}　{q.questionText}
              </p>
              <div className="space-y-2">
                {q.choices.map((choice) => {
                  const isSelected = selectedLabel === choice.label
                  const isCorrect = choice.label === q.correctLabel

                  let borderColor = 'var(--border)'
                  let bg = '#fff'

                  if (revealAnswer && isCorrect) { borderColor = '#4CAF50'; bg = '#F0FBF0' }
                  else if (revealAnswer && isSelected && !isCorrect) { borderColor = '#E57373'; bg = '#FFF0F0' }
                  else if (isSelected) { borderColor = 'var(--burgundy)'; bg = 'var(--burgundy-light)' }

                  return (
                    <button
                      key={choice.label}
                      onClick={() => onSelect?.(q.number, choice.label)}
                      disabled={revealAnswer}
                      className="w-full text-left rounded-xl p-3 text-sm transition-colors disabled:cursor-default"
                      style={{ border: `2px solid ${borderColor}`, background: bg }}
                    >
                      <span className="font-bold mr-2" style={{ color: 'var(--burgundy)' }}>{choice.label}.</span>
                      <span style={{ color: '#1A1A1A' }}>{choice.text}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | grep "ProblemPanel"
```

- [ ] **Step 3: Commit**

```bash
git add components/boss/ProblemPanel.tsx
git commit -m "feat: rewrite ProblemPanel for multi-question format"
```

---

## Task 7: Rewrite `components/boss/AnswerReveal.tsx`

**Files:**
- Modify: `components/boss/AnswerReveal.tsx`

- [ ] **Step 1: Write the new component**

```typescript
import type { GeneratedProblem } from '@/lib/types'

interface AnswerRevealProps {
  problem: GeneratedProblem
  selectedLabels: Record<number, 'A' | 'B' | 'C' | 'D' | null>
}

export function AnswerReveal({ problem, selectedLabels }: AnswerRevealProps) {
  const total = problem.questions.length
  const correctCount = problem.questions.filter(
    q => selectedLabels[q.number] === q.correctLabel
  ).length

  const allCorrect = correctCount === total

  return (
    <div className="space-y-3">
      {/* スコア */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: allCorrect ? '#F0FBF0' : '#FFF5F5',
          border: `1.5px solid ${allCorrect ? '#4CAF50' : '#E57373'}`,
        }}
      >
        <p className="font-black text-base" style={{ color: allCorrect ? '#2E7D32' : '#C62828' }}>
          {allCorrect ? '✨ 全問正解！' : `${correctCount} / ${total} 問正解`}
        </p>
      </div>

      {/* 各問の解説 */}
      {problem.questions.map((q) => {
        const selected = selectedLabels[q.number] ?? null
        const correct = selected === q.correctLabel

        return (
          <div
            key={q.number}
            className="rounded-2xl p-4 space-y-2"
            style={{
              background: correct ? '#F0FBF0' : '#FFF0F0',
              border: `1.5px solid ${correct ? '#4CAF50' : '#E57373'}`,
            }}
          >
            <p className="text-sm font-bold" style={{ color: correct ? '#2E7D32' : '#C62828' }}>
              問{q.number}　{correct ? '✅ 正解' : `✗ 正解：${q.correctLabel}`}
            </p>
            {q.explanation && (
              <p className="text-sm leading-relaxed font-mincho" style={{ color: '#1A1A1A' }}>
                {q.explanation}
              </p>
            )}
          </div>
        )
      })}

      {/* 裏技ヒント */}
      {problem.trickHint && (
        <p className="text-xs font-medium" style={{ color: 'var(--gold)' }}>
          💡 {problem.trickHint}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | grep "AnswerReveal"
```

- [ ] **Step 3: Commit**

```bash
git add components/boss/AnswerReveal.tsx
git commit -m "feat: rewrite AnswerReveal for multi-question with score display"
```

---

## Task 8: Update `app/boss/[type]/step2/page.tsx`

**Files:**
- Modify: `app/boss/[type]/step2/page.tsx`

- [ ] **Step 1: Replace `revealed` state logic and `ProblemPanel`/`AnswerReveal` usage**

Key changes:
1. Remove single `selectedLabel` state
2. Add `selectedLabels: Record<number, 'A'|'B'|'C'|'D' | null>` state (initialized to `{}`)
3. Update `ProblemPanel` props
4. Update `AnswerReveal` props
5. Add exam header (第X問、配点、目標時間) using gothic font
6. "回答を見る" button shows only when all questions answered: `Object.keys(selectedLabels).length === problem.questions.length`

Full new file:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { ProblemPanel } from '@/components/boss/ProblemPanel'
import { AnswerReveal } from '@/components/boss/AnswerReveal'
import { WakaranaiButton } from '@/components/boss/WakaranaiButton'
import { BottomButton } from '@/components/ui/BottomButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ProblemTimer } from '@/components/ui/ProblemTimer'
import type { BossType, GeneratedProblem } from '@/lib/types'

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'かんたん',
  2: 'やや易しい',
  3: '標準',
  4: 'やや難しい',
  5: 'むずかしい',
}

export default function Step2Page() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  const [problem, setProblem] = useState<GeneratedProblem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLabels, setSelectedLabels] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | null>>({})
  const [revealed, setRevealed] = useState(false)
  const [adjusting, setAdjusting] = useState(false)
  const [timerKey, setTimerKey] = useState(0)

  async function fetchSample() {
    if (!boss) return
    setLoading(true)
    setRevealed(false)
    setSelectedLabels({})
    setError(null)
    try {
      const res = await fetch(`/api/sample-problem?bossType=${bossType}`)
      if (!res.ok) throw new Error('取得失敗')
      const data = await res.json()
      setProblem(data)
      setTimerKey(k => k + 1)
    } catch {
      setError('問題の取得に失敗しました。もう一度試してください。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSample() }, [bossType]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDifficultyChange(delta: -1 | 1) {
    if (!problem || adjusting) return
    const next = Math.min(5, Math.max(1, problem.difficulty + delta))
    if (next === problem.difficulty) return
    setAdjusting(true)
    await fetch('/api/difficulty', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bossType, difficulty: next }),
    })
    await fetchSample()
    setAdjusting(false)
  }

  if (!boss) {
    return (
      <main className="flex-1 p-4 flex items-center justify-center">
        <p style={{ color: '#E53935' }}>問題タイプが見つかりません</p>
      </main>
    )
  }

  if (loading) {
    return <main className="flex-1 flex items-center justify-center"><LoadingSpinner /></main>
  }

  if (error || !problem) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p style={{ color: '#E53935' }}>{error ?? '問題を取得できませんでした'}</p>
          <BottomButton label="もう一度試す" onClick={fetchSample} />
        </div>
      </main>
    )
  }

  function handleSelect(questionNumber: number, label: 'A' | 'B' | 'C' | 'D') {
    setSelectedLabels(prev => ({ ...prev, [questionNumber]: label }))
  }

  function handleGoToMaster() {
    sessionStorage.setItem('currentProblem', JSON.stringify(problem))
    router.push(`/master/${bossType}`)
  }

  function handleWakaranai() {
    sessionStorage.setItem('currentProblem', JSON.stringify(problem))
    router.push(`/wakaranai?bossType=${bossType}&questionIndex=0`)
  }

  const level = problem.difficulty
  const allAnswered = problem.questions.every(q => selectedLabels[q.number] != null)
  const timeLimitMin = Math.ceil(boss.timeLimit / 60)

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <button onClick={() => router.push(`/boss/${bossType}`)} className="text-sm mb-4 active:opacity-60" style={{ color: 'var(--burgundy)' }}>
          ← コツに戻る
        </button>

        {/* 試験ヘッダー（ゴシック体） */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-bold tracking-wide" style={{ color: 'var(--burgundy)' }}>STEP 2 — 答えを確認しながら読む</p>
            <h1 className="text-xl font-black mt-0.5" style={{ color: '#1A1A1A' }}>{boss.name}</h1>
            <p className="text-xs mt-1" style={{ color: '#787878' }}>
              第{boss.section}問（配点　{boss.points}）　目標時間：{timeLimitMin}分
            </p>
          </div>
          <ProblemTimer key={timerKey} limitSeconds={boss.timeLimit} running={!revealed} />
        </div>
      </div>

      {/* 難易度セレクター */}
      <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: '#F5F5F5', border: '1px solid var(--border)' }}>
        <div className="flex flex-col">
          <span className="text-xs font-bold" style={{ color: '#787878' }}>難易度</span>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ color: i <= level ? 'var(--burgundy)' : '#D0D0D0', fontSize: '12px' }}>●</span>
              ))}
            </div>
            <span className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{DIFFICULTY_LABELS[level]}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleDifficultyChange(-1)}
            disabled={level <= 1 || adjusting}
            className="text-xs font-bold px-3 py-1.5 rounded-xl active:opacity-60 disabled:opacity-30"
            style={{ background: 'var(--burgundy-light)', color: 'var(--burgundy)' }}
          >
            やさしく▼
          </button>
          <button
            onClick={() => handleDifficultyChange(1)}
            disabled={level >= 5 || adjusting}
            className="text-xs font-bold px-3 py-1.5 rounded-xl active:opacity-60 disabled:opacity-30"
            style={{ background: 'var(--burgundy-light)', color: 'var(--burgundy)' }}
          >
            むずかしく▲
          </button>
        </div>
      </div>

      {problem.trickHint && (
        <div className="rounded-2xl p-4" style={{ background: 'var(--gold-light)', border: '1px solid #E8D5A3' }}>
          <p className="text-xs font-bold mb-1" style={{ color: 'var(--gold)' }}>💡 答えのヒント</p>
          <p className="text-sm leading-relaxed font-mincho" style={{ color: '#1A1A1A' }}>{problem.trickHint}</p>
        </div>
      )}

      <ProblemPanel
        problem={problem}
        selectedLabels={selectedLabels}
        onSelect={revealed ? undefined : handleSelect}
        revealAnswer={revealed}
      />

      {!revealed ? (
        <div className="mt-auto pt-4">
          <BottomButton
            label={allAnswered ? '回答を見る →' : `回答を選んでください（${Object.keys(selectedLabels).length}/${problem.questions.length}問）`}
            onClick={() => setRevealed(true)}
            disabled={!allAnswered}
          />
        </div>
      ) : (
        <>
          <AnswerReveal problem={problem} selectedLabels={selectedLabels} />
          <div className="space-y-3 pt-2 pb-4">
            <WakaranaiButton onClick={handleWakaranai} />
            <BottomButton label="わかった！ひとりでやってみる →" onClick={handleGoToMaster} />
          </div>
        </>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | grep "step2"
```

- [ ] **Step 3: Commit**

```bash
git add app/boss/\[type\]/step2/page.tsx
git commit -m "feat: update step2 for multi-question flow"
```

---

## Task 9: Rewrite `app/master/[type]/page.tsx`

**Files:**
- Modify: `app/master/[type]/page.tsx`

- [ ] **Step 1: Write the new master page**

Key changes from the original:
- `selectedLabels: Record<number, 'A'|'B'|'C'|'D' | null>` state
- After submit: fetch highlights in parallel for all questions
- `result: 'cleared'` only if ALL questions correct
- Show per-question result (via ProblemPanel `revealAnswer` + `highlightMap`)

```typescript
'use client'

import { useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { ProblemPanel } from '@/components/boss/ProblemPanel'
import { BottomButton } from '@/components/ui/BottomButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ProblemTimer } from '@/components/ui/ProblemTimer'
import type { BossType, GeneratedProblem } from '@/lib/types'

interface HighlightInfo {
  keyText: string
  keyJapanese: string
}

function MasterContent() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  const raw = typeof window !== 'undefined' ? sessionStorage.getItem('currentProblem') : null
  const problem: GeneratedProblem | null = raw ? JSON.parse(raw) : null

  const [selectedLabels, setSelectedLabels] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | null>>({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [highlightMap, setHighlightMap] = useState<Record<number, HighlightInfo>>({})
  const [loadingHighlight, setLoadingHighlight] = useState(false)

  if (!boss || !problem) {
    return (
      <main className="flex-1 p-4 flex items-center justify-center">
        <p style={{ color: '#E53935' }}>問題データがありません</p>
      </main>
    )
  }

  const challengeProblem: GeneratedProblem = {
    ...problem,
    questions: problem.questions.map(q => ({ ...q, explanation: null })),
  }

  const correctCount = submitted
    ? problem.questions.filter(q => selectedLabels[q.number] === q.correctLabel).length
    : 0
  const totalCount = problem.questions.length
  const allCorrect = correctCount === totalCount
  const allAnswered = problem.questions.every(q => selectedLabels[q.number] != null)

  async function handleSubmit() {
    if (!allAnswered) return
    setSaving(true)
    setLoadingHighlight(true)

    const correct = allCorrect

    // Fetch session + all highlights in parallel
    const highlightPromises = problem.questions.map(q =>
      fetch('/api/highlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passageHtml: problem.passageHtml,
          questionText: q.questionText,
          correctLabel: q.correctLabel,
          choices: q.choices,
        }),
      }).then(r => r.json()).then(data => ({ qNum: q.number, data }))
    )

    await Promise.all([
      fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bossType,
          difficulty: challengeProblem.difficulty,
          theme: challengeProblem.theme,
          mode: 'challenge',
          generatedQuestion: challengeProblem,
          result: correct ? 'cleared' : 'wakaranai',
        }),
      }),
      ...highlightPromises,
    ]).then(results => {
      const newHighlightMap: Record<number, HighlightInfo> = {}
      results.slice(1).forEach((r: { qNum: number; data: HighlightInfo }) => {
        newHighlightMap[r.qNum] = r.data
      })
      setHighlightMap(newHighlightMap)
    })

    setSubmitted(true)
    setSaving(false)
    setLoadingHighlight(false)
  }

  function handleSelect(questionNumber: number, label: 'A' | 'B' | 'C' | 'D') {
    setSelectedLabels(prev => ({ ...prev, [questionNumber]: label }))
  }

  function handleRetry() {
    setSelectedLabels({})
    setSubmitted(false)
    setHighlightMap({})
  }

  function handleWakaranai() {
    router.push(`/wakaranai?bossType=${bossType}&questionIndex=0`)
  }

  const timeLimitMin = Math.ceil(boss.timeLimit / 60)

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <button onClick={() => router.push(`/boss/${bossType}/step2`)} className="text-sm mb-4 active:opacity-60" style={{ color: 'var(--burgundy)' }}>
          ← 答えに戻る
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide" style={{ color: '#E53935' }}>ひとりでやってみる — ヒントなし</p>
            <h1 className="text-xl font-black mt-0.5" style={{ color: '#1A1A1A' }}>{boss.name}</h1>
            <p className="text-xs mt-1" style={{ color: '#787878' }}>
              第{boss.section}問（配点　{boss.points}）　目標時間：{timeLimitMin}分
            </p>
          </div>
          <ProblemTimer limitSeconds={boss.timeLimit} running={!submitted} />
        </div>
      </div>

      <ProblemPanel
        problem={challengeProblem}
        selectedLabels={selectedLabels}
        onSelect={submitted ? undefined : handleSelect}
        revealAnswer={submitted}
        highlightMap={submitted ? highlightMap : {}}
      />

      {loadingHighlight && (
        <div className="flex items-center gap-2 py-2">
          <LoadingSpinner />
          <p className="text-xs" style={{ color: '#787878' }}>根拠の文を確認中...</p>
        </div>
      )}

      {submitted && !loadingHighlight && (
        <div
          className="rounded-2xl p-4"
          style={{
            background: allCorrect ? '#F0FBF0' : '#FFF5F5',
            border: `1.5px solid ${allCorrect ? '#4CAF50' : '#E57373'}`,
          }}
        >
          <p className="font-black text-base" style={{ color: allCorrect ? '#2E7D32' : '#C62828' }}>
            {allCorrect ? '✨ 全問正解！' : `${correctCount} / ${totalCount} 問正解`}
          </p>
          {/* Per-question highlight results */}
          {Object.keys(highlightMap).length > 0 && (
            <div className="mt-3 space-y-2">
              {problem.questions.map(q => {
                const highlight = highlightMap[q.number]
                if (!highlight?.keyText) return null
                const correct = selectedLabels[q.number] === q.correctLabel
                return (
                  <div key={q.number}>
                    <p className="text-xs font-bold" style={{ color: correct ? '#2E7D32' : '#C62828' }}>
                      問{q.number} 根拠の文：
                    </p>
                    <p className="text-xs italic leading-relaxed font-mincho" style={{ color: '#1A1A1A' }}>{highlight.keyText}</p>
                    <p className="text-xs" style={{ color: '#787878' }}>（{highlight.keyJapanese}）</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 pt-2 pb-4">
        {!submitted ? (
          <BottomButton
            label={saving ? '確認中...' : allAnswered ? 'これが答え！' : `回答を選んでください（${Object.keys(selectedLabels).length}/${totalCount}問）`}
            onClick={handleSubmit}
            disabled={!allAnswered || saving}
          />
        ) : allCorrect ? (
          <>
            <BottomButton label="問題一覧に戻る →" onClick={() => router.push('/')} />
            <BottomButton label="もう一度練習する" onClick={() => router.push(`/boss/${bossType}/step2`)} variant="secondary" />
          </>
        ) : (
          <>
            <BottomButton label="もう一度挑戦する" onClick={handleRetry} />
            <BottomButton label="どこがわからないか確認する" onClick={handleWakaranai} variant="secondary" />
            <BottomButton label="問題一覧に戻る" onClick={() => router.push('/')} variant="secondary" />
          </>
        )}
      </div>
    </main>
  )
}

export default function MasterPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner label="準備中..." />
      </div>
    }>
      <MasterContent />
    </Suspense>
  )
}
```

**Note:** The `Promise.all` return value needs careful typing. The first element is the session `Response`, the rest are `{ qNum, data }` objects from highlights. Use `.then(results => {...})` on `Promise.all` — but since `fetch('/api/session')` returns a plain `Response`, we need to handle this carefully. An alternative is to run them separately:

```typescript
// Run session and highlights in parallel but handle results separately
const [, ...highlightResults] = await Promise.all([
  fetch('/api/session', { ... }),
  ...highlightPromises,
])
const newHighlightMap: Record<number, HighlightInfo> = {}
highlightResults.forEach((r: unknown) => {
  const result = r as { qNum: number; data: HighlightInfo }
  newHighlightMap[result.qNum] = result.data
})
setHighlightMap(newHighlightMap)
```

Use whichever compiles without TypeScript errors.

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | grep "master"
```

- [ ] **Step 3: Commit**

```bash
git add app/master/\[type\]/page.tsx
git commit -m "feat: rewrite master page for multi-question with score and highlights"
```

---

## Task 10: Update `app/wakaranai/page.tsx`

**Files:**
- Modify: `app/wakaranai/page.tsx`

- [ ] **Step 1: Read `questionIndex` from URL and pass correct question's text to the API**

Add `questionIndex` reading at the top of `WakaranaiContent`:

```typescript
const questionIndex = Number(searchParams.get('questionIndex') ?? '0')
const currentQuestion = problem?.questions[questionIndex] ?? problem?.questions[0]
```

Then replace `problem.questionText` with `currentQuestion?.questionText ?? ''` in the `handleGetSupport` POST body:

```typescript
body: JSON.stringify({
  cause: selectedCause,
  passageHtml: problem.passageHtml,
  questionText: currentQuestion?.questionText ?? '',
}),
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | grep "wakaranai"
```

- [ ] **Step 3: Commit**

```bash
git add app/wakaranai/page.tsx
git commit -m "feat: update wakaranai page to use per-question text"
```

---

## Task 11: Update `scripts/seed-problems.ts`

**Files:**
- Modify: `scripts/seed-problems.ts`

- [ ] **Step 1: Update the `insert` call to use new column names**

The seed script calls `generateProblem()` from `lib/claude.ts`. With the updated `generateProblem`, it now returns `{ scenario, passageHtml, questions, trickHint }`.

Update the `supabase.from('sample_problems').insert({...})` call:

Old:
```typescript
await supabase.from('sample_problems').insert({
  boss_type: bossType, theme, difficulty,
  passage_html: p.passageHtml, question_text: p.questionText,
  choices: p.choices, correct_label: p.correctLabel,
  explanation: p.explanation, trick_hint: p.trickHint,
})
```

New:
```typescript
await supabase.from('sample_problems').insert({
  boss_type: bossType, theme, difficulty,
  scenario: p.scenario,
  passage_html: p.passageHtml,
  questions: p.questions,
  trick_hint: p.trickHint,
})
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1 | grep "seed"
```

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-problems.ts
git commit -m "feat: update seed script for multi-question schema"
```

---

## Task 12: Font Styling

**Files:**
- Modify: `app/globals.css`

**Goal:** 
- 英文問題文（passageHtml内）→ セリフ体（Georgia）
- 日本語本文（scenario, questionText, explanation）→ 明朝体（Hiragino Mincho Pro系）
- 試験ヘッダー（第X問、配点、目標時間）→ ゴシック体（既存 Geist / sans-serif）

- [ ] **Step 1: Add font CSS to `app/globals.css`**

Append to `app/globals.css`:

```css
.font-mincho {
  font-family: 'Hiragino Mincho Pro', 'Yu Mincho', 'Noto Serif JP', Georgia, serif;
}

.passage-english {
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.8;
}
```

The `font-mincho` and `passage-english` classes are already referenced in the ProblemPanel and AnswerReveal rewrites above. No further changes needed to layout.tsx or component files — those were already included in Tasks 6 and 7.

- [ ] **Step 2: Verify CSS classes are used**

```bash
cd /Users/horota/Claude/private/daughter-study-app && grep -r "font-mincho\|passage-english" components/ app/
```

Expected: found in ProblemPanel.tsx, AnswerReveal.tsx.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add mincho and serif font classes for exam-style typography"
```

---

## Task 13: Remove Personal References

**Files:**
- Modify: `app/login/page.tsx` (line 40, 42)
- Modify: `app/onboarding/page.tsx` (line 11 approx)
- Modify: `components/map/ProgressBanner.tsx` (line 27 approx)
- Modify: `app/page.tsx` (line 48 approx)

- [ ] **Step 1: Update `app/login/page.tsx`**

Find and replace:
- `NANAMI'S ENGLISH APP` → `共通テスト英語 完全対策`
- `お父さんから七海への特別な勉強法` → `共通テスト英語を最短で攻略する特別な勉強法`

- [ ] **Step 2: Update `app/onboarding/page.tsx`**

Find and replace:
- `お父さんが作った特別な方法。` → `答えから逆算する特別な方法。`

- [ ] **Step 3: Update `components/map/ProgressBanner.tsx`**

Find and replace:
- `七海の進捗` → `あなたの進捗`

- [ ] **Step 4: Update `app/page.tsx`**

Find and replace:
- `NANAMI'S ENGLISH APP` → `共通テスト英語 完全対策`

- [ ] **Step 5: Verify no personal references remain**

```bash
cd /Users/horota/Claude/private/daughter-study-app && grep -r "七海\|お父さん\|NANAMI" app/ components/ --include="*.tsx"
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add app/login/page.tsx app/onboarding/page.tsx components/map/ProgressBanner.tsx app/page.tsx
git commit -m "feat: remove personal references, use generic product copy"
```

---

## Task 14: Build and Deploy

- [ ] **Step 1: Full TypeScript check — must be zero errors**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsc --noEmit 2>&1
```

Expected: no output (zero errors).

- [ ] **Step 2: Production build**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npm run build 2>&1
```

Expected: `✓ Compiled successfully` with no TypeScript or build errors.

- [ ] **Step 3: Deploy to Vercel**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx vercel --prod 2>&1
```

Expected: deployment URL.

- [ ] **Step 4: Smoke test on deployed URL**

Manually verify:
- Login page shows `共通テスト英語 完全対策` (no 七海/お父さん)
- Step2 page shows exam header `第X問（配点 Y）　目標時間：Z分`
- Problem panel shows multiple questions (問1, 問2, ...)
- Selecting all answers enables "回答を見る"
- Answer reveal shows score (X/Y 問正解) + per-question results
- English passage uses serif font
- Japanese text uses mincho font

---

## Verification

- All 8 boss types show multi-question problems on step2
- Master page shows correct/incorrect per question + overall score
- `cleared` status only when all questions correct
- No personal references in any page
- Fonts: serif English passage, mincho Japanese body, gothic headers
- `npx tsc --noEmit` → zero errors
- `npm run build` → zero errors
