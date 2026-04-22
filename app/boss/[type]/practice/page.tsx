'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { BossType, GeneratedProblem } from '@/lib/types'

type QState = { selected: 'A' | 'B' | 'C' | 'D' | null; revealed: boolean }

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
      {/* header */}
      <div style={{ padding: '20px 20px 0' }}>
        <button onClick={() => router.push(`/boss/${bossType}`)} style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.05em', marginBottom: 14 }}>
          ← STEP 1
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="mono-kicker">STEP 2 / 3 — PRACTICE</div>
          <div className="mono-kicker tabular" style={{ color: 'var(--ink-3)' }}>Q{qIdx + 1} / {totalQ}</div>
        </div>
      </div>

      {/* passage */}
      <div style={{ margin: '18px 20px 0', padding: '16px 18px', background: 'var(--surface)', borderLeft: '2px solid var(--rule)', fontFamily: 'var(--serif-en)', fontSize: 15, lineHeight: 1.75, color: 'var(--ink)' }}
        dangerouslySetInnerHTML={{ __html: problem.passageHtml }}
      />

      {/* question */}
      <div style={{ padding: '20px 20px 0' }}>
        <h2 className="display" style={{ fontSize: 19, lineHeight: 1.3, color: 'var(--ink)', letterSpacing: '-0.01em', fontVariationSettings: '"opsz" 144' }}>
          {q.questionText}
        </h2>

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
            return (
              <button
                key={c.label}
                onClick={() => select(c.label)}
                className={`hy-choice${isSel && !qs.revealed ? ' selected' : ''}${isCorrectChoice ? ' correct' : ''}${isWrong ? ' wrong' : ''}`}
              >
                <span className="display-italic" style={{ fontSize: 16, color: 'var(--accent)', textAlign: 'right' }}>{c.label.toLowerCase()}.</span>
                <span>{c.text}</span>
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
        <div style={{ padding: '20px 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
