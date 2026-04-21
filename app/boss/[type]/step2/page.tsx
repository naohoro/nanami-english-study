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
        <button onClick={() => router.push(`/boss/${bossType}`)} className="text-sm mb-4 px-3 py-1.5 rounded-lg border active:opacity-60 font-medium" style={{ color: 'var(--burgundy)', borderColor: 'var(--burgundy)' }}>
          ← 解説に戻る
        </button>

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
