'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { BossType, GeneratedProblem } from '@/lib/types'

export default function SoloPage() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  const [problem, setProblem] = useState<GeneratedProblem | null>(null)
  const [selected, setSelected] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({})
  const [qIdx, setQIdx] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const startRef = useRef<number>(Date.now())

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem('currentProblem') : null
    if (raw) {
      const p: GeneratedProblem = JSON.parse(raw)
      setProblem({ ...p, questions: p.questions.map(q => ({ ...q, explanation: null })) })
    }
    startRef.current = Date.now()
  }, [])

  if (!boss) return <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--danger)' }}>問題タイプが見つかりません</p></main>
  if (!problem) return <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner label="準備中..." /></main>

  const questions = problem.questions
  const q = questions[qIdx]
  const totalQ = questions.length
  const allAnswered = questions.every(q => selected[q.number] != null)

  async function handleSubmit() {
    if (!allAnswered || saving || !problem) return
    setSaving(true)

    const originalRaw = sessionStorage.getItem('currentProblem')
    const original: GeneratedProblem | null = originalRaw ? JSON.parse(originalRaw) : null
    const correctCount = (original?.questions ?? questions).filter(q => selected[q.number] === q.correctLabel).length
    const allCorrect = correctCount === totalQ
    const timeSpentSec = Math.round((Date.now() - startRef.current) / 1000)

    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bossType,
        difficulty: problem.difficulty,
        theme: problem.theme,
        mode: 'challenge',
        generatedQuestion: problem,
        result: allCorrect ? 'cleared' : 'wakaranai',
      }),
    })

    setSaving(false)
    setSubmitted(true)

    if (allCorrect) {
      sessionStorage.setItem('clearedMeta', JSON.stringify({
        bossType,
        accuracy: 100,
        timeSpentSec,
      }))
      router.push(`/boss/${bossType}/cleared`)
    }
  }

  function retry() {
    setSelected({})
    setQIdx(0)
    setSubmitted(false)
    startRef.current = Date.now()
  }

  const allCorrect = submitted && questions.every(q => selected[q.number] === q.correctLabel)

  // Show retry screen after submit if not all correct
  if (submitted && !allCorrect) {
    const correctCount = questions.filter(q => selected[q.number] === q.correctLabel).length
    return (
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 24px 40px' }}>
        <div className="mono-kicker" style={{ color: 'var(--danger)' }}>§{String(boss.section).padStart(2, '0')} / NOT YET</div>
        <h1 className="display" style={{ marginTop: 16, fontSize: 42, lineHeight: 1.1, color: 'var(--ink)', letterSpacing: '-0.03em', fontVariationSettings: '"opsz" 144' }}>
          {correctCount} / {totalQ}
          <span style={{ fontSize: 20, marginLeft: 8, color: 'var(--ink-3)' }}>正解</span>
        </h1>
        <p className="font-mincho" style={{ marginTop: 16, fontSize: 15, lineHeight: 1.7, color: 'var(--ink-2)' }}>
          全問正解でクリアです。もう一度、ひとりで挑戦してください。
        </p>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 32 }}>
          <button onClick={retry} className="hy-btn full">
            <span>もう一度挑戦する</span>
            <span className="arr">→</span>
          </button>
          <button onClick={() => router.push(`/boss/${bossType}/practice`)} style={{ padding: '14px 18px', border: '1px solid var(--rule)', background: 'transparent', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14, cursor: 'pointer' }}>
            ← STEP 2 に戻る
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* header */}
      <div style={{ padding: '20px 20px 0' }}>
        <button onClick={() => router.push(`/boss/${bossType}/practice`)} style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.05em', marginBottom: 14 }}>
          ← STEP 2
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="mono-kicker">STEP 3 / 3 — SOLO</div>
          <div className="mono-kicker tabular" style={{ color: 'var(--ink-3)' }}>Q{qIdx + 1} / {totalQ}</div>
        </div>
        <p className="font-mincho" style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>
          ヒントなし。全問正解でクリア。
        </p>
      </div>

      {/* passage */}
      <div
        style={{ margin: '18px 20px 0', padding: '16px 18px', background: 'var(--surface)', borderLeft: '2px solid var(--rule)', fontFamily: 'var(--serif-en)', fontSize: 15, lineHeight: 1.75, color: 'var(--ink)' }}
        dangerouslySetInnerHTML={{ __html: problem.passageHtml }}
      />

      {/* question */}
      <div style={{ padding: '20px 20px 0' }}>
        <h2 className="display" style={{ fontSize: 19, lineHeight: 1.3, color: 'var(--ink)', letterSpacing: '-0.01em', fontVariationSettings: '"opsz" 144' }}>
          {q.questionText}
        </h2>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {q.choices.map((c) => {
            const isSel = selected[q.number] === c.label
            return (
              <button
                key={c.label}
                onClick={() => !submitted && setSelected(prev => ({ ...prev, [q.number]: c.label }))}
                className={`hy-choice${isSel ? ' selected' : ''}`}
              >
                <span className="display-italic" style={{ fontSize: 16, color: 'var(--accent)', textAlign: 'right' }}>{c.label.toLowerCase()}.</span>
                <span>{c.text}</span>
                <span>{isSel ? '·' : ''}</span>
              </button>
            )
          })}
        </div>

        {/* actions */}
        <div style={{ padding: '20px 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {qIdx < totalQ - 1 ? (
            <button
              onClick={() => setQIdx(i => i + 1)}
              disabled={selected[q.number] == null}
              className="hy-btn full"
              style={{ opacity: selected[q.number] != null ? 1 : 0.4 }}
            >
              <span>次の問題へ</span>
              <span className="arr">→</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || saving}
              className="hy-btn full"
              style={{ opacity: allAnswered && !saving ? 1 : 0.4 }}
            >
              <span>{saving ? '確認中...' : '提出する'}</span>
              <span className="arr">→</span>
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
