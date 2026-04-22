'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import type { BossType, GeneratedProblem } from '@/lib/types'
import { AiTeacherChat } from '@/components/ai-teacher/AiTeacherChat'

type QState = { selected: 'A' | 'B' | 'C' | 'D' | null; revealed: boolean }
type QTranslation = { questionText: string; choices: Record<string, string> }

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  const [problem, setProblem] = useState<GeneratedProblem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qIdx, setQIdx] = useState(0) // 0-indexed
  const [qStates, setQStates] = useState<QState[]>([])

  // Translation state — passage
  const [passageJa, setPassageJa] = useState<string | null>(null)
  const [passageTranslating, setPassageTranslating] = useState(false)
  const [showPassageJa, setShowPassageJa] = useState(false)

  // Translation state — per question
  const [qTranslations, setQTranslations] = useState<Record<number, QTranslation>>({})
  const [qShowJa, setQShowJa] = useState<Set<number>>(new Set())
  const [qTranslating, setQTranslating] = useState<Set<number>>(new Set())

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/sample-problem?bossType=${bossType}`)
        if (!res.ok) throw new Error('取得失敗')
        const data: GeneratedProblem = await res.json()
        setProblem(data)
        setQStates(data.questions.map(() => ({ selected: null, revealed: false })))
      } catch {
        setError('問題の取得に失敗しました。')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [bossType]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!boss) return <NotFound />
  if (loading) return <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner label="問題を読み込み中..." /></main>
  if (error || !problem) return <Err msg={error} onRetry={() => { setError(null); setLoading(true) }} />

  const q = problem.questions[qIdx]
  const qs = qStates[qIdx]
  const totalQ = problem.questions.length
  const allDone = qStates.every(s => s.revealed)
  const whisper = boss.trickSteps[qIdx % boss.trickSteps.length]

  async function translatePassage() {
    if (passageJa) { setShowPassageJa(v => !v); return }
    if (!problem) return
    setPassageTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passageHtml: problem.passageHtml }),
      })
      const data = await res.json()
      setPassageJa(data.japanese)
      setShowPassageJa(true)
    } finally {
      setPassageTranslating(false)
    }
  }

  async function translateQuestion(qNum: number, questionText: string, choices: { label: string; text: string }[]) {
    if (qTranslations[qNum]) {
      setQShowJa(prev => { const next = new Set(prev); prev.has(qNum) ? next.delete(qNum) : next.add(qNum); return next })
      return
    }
    setQTranslating(prev => new Set([...prev, qNum]))
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passageHtml: questionText, choices }),
      })
      const data = await res.json()
      setQTranslations(prev => ({ ...prev, [qNum]: { questionText: data.japanese ?? questionText, choices: data.choices ?? {} } }))
      setQShowJa(prev => new Set([...prev, qNum]))
    } finally {
      setQTranslating(prev => { const next = new Set(prev); next.delete(qNum); return next })
    }
  }

  function select(label: 'A' | 'B' | 'C' | 'D') {
    if (qs.revealed) return
    setQStates(prev => prev.map((s, i) => i === qIdx ? { ...s, selected: label } : s))
  }

  function reveal() {
    setQStates(prev => prev.map((s, i) => i === qIdx ? { ...s, revealed: true } : s))
  }

  function goSolo() {
    sessionStorage.setItem('currentProblem', JSON.stringify(problem))
    router.push(`/boss/${bossType}/solo`)
  }

  const isCorrect = qs.selected === q.correctLabel

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <Breadcrumb crumbs={[{ label: 'MAP', href: '/' }, { label: 'STEP 1', href: `/boss/${bossType}` }, { label: 'STEP 2' }]} />
      <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="mono-kicker">STEP 2 / 3 — PRACTICE</div>
        <div className="mono-kicker tabular" style={{ color: 'var(--ink-3)' }}>Q{qIdx + 1} / {totalQ}</div>
      </div>

      {/* passage */}
      <div style={{ margin: '18px 20px 0', background: 'var(--surface)', borderLeft: '2px solid var(--rule)' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 10px 0' }}>
          <button
            onClick={translatePassage}
            disabled={passageTranslating}
            style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.05em', padding: '3px 10px', border: '1px solid var(--rule)', background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer', opacity: passageTranslating ? 0.4 : 1 }}
          >
            {passageTranslating ? '翻訳中...' : showPassageJa ? 'EN' : 'JP'}
          </button>
        </div>
        {showPassageJa && passageJa ? (
          <div style={{ padding: '10px 18px 16px', fontFamily: 'var(--mincho)', fontSize: 14, lineHeight: 1.85, color: 'var(--ink)', whiteSpace: 'pre-line' }}>{passageJa}</div>
        ) : (
          <div style={{ padding: '10px 18px 16px', fontFamily: 'var(--serif-en)', fontSize: 15, lineHeight: 1.75, color: 'var(--ink)' }} dangerouslySetInnerHTML={{ __html: problem.passageHtml }} />
        )}
      </div>

      {/* question */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <h2 className="display" style={{ flex: 1, fontSize: 19, lineHeight: 1.3, color: 'var(--ink)', letterSpacing: '-0.01em', fontVariationSettings: '"opsz" 144' }}>
            {qShowJa.has(q.number) && qTranslations[q.number] ? qTranslations[q.number].questionText : q.questionText}
          </h2>
          <button
            onClick={() => translateQuestion(q.number, q.questionText, q.choices)}
            disabled={qTranslating.has(q.number)}
            style={{ flexShrink: 0, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.05em', padding: '3px 10px', border: '1px solid var(--rule)', background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer', opacity: qTranslating.has(q.number) ? 0.4 : 1, marginTop: 3 }}
          >
            {qTranslating.has(q.number) ? '...' : qShowJa.has(q.number) ? 'EN' : 'JP'}
          </button>
        </div>

        {/* whisper */}
        <aside style={{ marginTop: 12, padding: '10px 14px', borderLeft: '2px solid var(--accent)', background: 'transparent' }}>
          <div className="mono-kicker" style={{ marginBottom: 2 }}>WHISPER</div>
          <div className="font-mincho" style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>{whisper}</div>
        </aside>

        {/* choices */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {q.choices.map((c) => {
            const isSel = qs.selected === c.label
            const isCorrectChoice = qs.revealed && c.label === q.correctLabel
            const isWrong = qs.revealed && isSel && !isCorrect
            const choiceText = qShowJa.has(q.number) && qTranslations[q.number]?.choices[c.label]
              ? qTranslations[q.number].choices[c.label]
              : c.text
            return (
              <button
                key={c.label}
                onClick={() => select(c.label)}
                className={`hy-choice${isSel && !qs.revealed ? ' selected' : ''}${isCorrectChoice ? ' correct' : ''}${isWrong ? ' wrong' : ''}`}
              >
                <span className="display-italic" style={{ fontSize: 16, color: 'var(--accent)', textAlign: 'right' }}>{c.label.toLowerCase()}.</span>
                <span>{choiceText}</span>
                <span>{isCorrectChoice ? '✓' : ''}</span>
              </button>
            )
          })}
        </div>

        {/* explain */}
        {qs.revealed && q.explanation && (
          <div className="hy-explain" style={{ marginTop: 0 }}>
            <div className="mono-kicker" style={{ marginBottom: 8, color: 'var(--paper)', opacity: 0.6 }}>EXPLANATION</div>
            <p className="font-mincho" style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--paper)' }}>{q.explanation}</p>
          </div>
        )}

        {/* actions */}
        <div style={{ padding: '20px 0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!qs.revealed ? (
            <button
              onClick={reveal}
              disabled={!qs.selected}
              className="hy-btn full"
              style={{ opacity: qs.selected ? 1 : 0.4 }}
            >
              <span>答えを確認する</span>
              <span className="arr">→</span>
            </button>
          ) : allDone ? (
            <button onClick={goSolo} className="hy-btn full">
              <span>本番へ — ひとりでやってみる</span>
              <span className="arr">→</span>
            </button>
          ) : (
            <button onClick={() => setQIdx(i => i + 1)} className="hy-btn full">
              <span>次の問題へ</span>
              <span className="arr">→</span>
            </button>
          )}
        </div>

        {/* AI先生チャット */}
        <div style={{ paddingBottom: 32 }}>
          <AiTeacherChat
            context={{
              pageType: 'problem',
              bossType,
              passageHtml: problem.passageHtml,
              questionText: q.questionText,
            }}
          />
        </div>
      </div>
    </main>
  )
}

function NotFound() {
  return <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--danger)' }}>問題タイプが見つかりません</p></main>
}

function Err({ msg, onRetry }: { msg: string | null; onRetry: () => void }) {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
      <p style={{ color: 'var(--danger)', fontFamily: 'var(--sans)', fontSize: 14 }}>{msg ?? '問題を取得できませんでした'}</p>
      <button onClick={onRetry} className="hy-btn">もう一度試す <span className="arr">→</span></button>
    </main>
  )
}
