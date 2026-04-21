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

  const totalCount = problem.questions.length
  const correctCount = submitted
    ? problem.questions.filter(q => selectedLabels[q.number] === q.correctLabel).length
    : 0
  const allCorrect = correctCount === totalCount
  const allAnswered = problem.questions.every(q => selectedLabels[q.number] != null)

  function handleSelect(questionNumber: number, label: 'A' | 'B' | 'C' | 'D') {
    setSelectedLabels(prev => ({ ...prev, [questionNumber]: label }))
  }

  async function handleSubmit() {
    if (!allAnswered) return
    setSaving(true)
    setLoadingHighlight(true)

    const correct = problem!.questions.every(q => selectedLabels[q.number] === q.correctLabel)

    const highlightPromises = problem!.questions.map(q =>
      fetch('/api/highlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passageHtml: problem!.passageHtml,
          questionText: q.questionText,
          correctLabel: q.correctLabel,
          choices: q.choices,
        }),
      }).then(r => r.json()).then((data: HighlightInfo) => ({ qNum: q.number, data }))
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
      const highlightResults = results.slice(1) as { qNum: number; data: HighlightInfo }[]
      highlightResults.forEach(r => {
        newHighlightMap[r.qNum] = r.data
      })
      setHighlightMap(newHighlightMap)
    })

    setSubmitted(true)
    setSaving(false)
    setLoadingHighlight(false)
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
          {Object.keys(highlightMap).length > 0 && (
            <div className="mt-3 space-y-3">
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
