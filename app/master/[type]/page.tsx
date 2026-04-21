'use client'

import { useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { ProblemPanel } from '@/components/boss/ProblemPanel'
import { BottomButton } from '@/components/ui/BottomButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { BossType, GeneratedProblem } from '@/lib/types'

function MasterContent() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  const raw = typeof window !== 'undefined' ? sessionStorage.getItem('currentProblem') : null
  const problem: GeneratedProblem | null = raw ? JSON.parse(raw) : null

  const [selectedLabel, setSelectedLabel] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!boss || !problem) {
    return (
      <main className="flex-1 p-4 flex items-center justify-center">
        <p className="text-red-400">問題データがありません</p>
      </main>
    )
  }

  // Ensure no answer reveal in challenge mode
  const challengeProblem: GeneratedProblem = { ...problem, explanation: null }

  const isCorrect = submitted && selectedLabel === challengeProblem.correctLabel

  async function handleSubmit() {
    if (!selectedLabel) return
    setSaving(true)
    const correct = selectedLabel === challengeProblem.correctLabel

    await fetch('/api/session', {
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
    })

    setSubmitted(true)
    setSaving(false)

    if (correct) {
      router.push(`/cleared?bossType=${bossType}`)
    }
  }

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <p className="text-xs text-red-400 font-bold">⚔️ マスターコース — ヒントなし本番</p>
        <h1 className="text-xl font-black mt-1">{boss.name}</h1>
      </div>

      <ProblemPanel
        problem={challengeProblem}
        selectedLabel={selectedLabel}
        onSelect={submitted ? undefined : setSelectedLabel}
        revealAnswer={submitted}
      />

      {submitted && !isCorrect && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
          <p className="text-sm text-red-300">惜しい！正解は {challengeProblem.correctLabel} だったよ。</p>
          <p className="text-xs text-gray-400 mt-1">もう一度チャレンジしてみる？</p>
        </div>
      )}

      <div className="mt-auto space-y-3 pt-4">
        {!submitted ? (
          <BottomButton
            label={saving ? '保存中...' : 'これが答え！'}
            onClick={handleSubmit}
            disabled={!selectedLabel || saving}
          />
        ) : !isCorrect ? (
          <>
            <BottomButton
              label="もう一度挑戦する"
              onClick={() => {
                setSelectedLabel(null)
                setSubmitted(false)
              }}
            />
            <BottomButton
              label="マップに戻る"
              onClick={() => router.push('/')}
              variant="secondary"
            />
          </>
        ) : null}
      </div>
    </main>
  )
}

export default function MasterPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner label="本番問題を準備中..." />
      </div>
    }>
      <MasterContent />
    </Suspense>
  )
}
