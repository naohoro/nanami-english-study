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

  const [selectedLabel, setSelectedLabel] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [highlightInfo, setHighlightInfo] = useState<HighlightInfo | null>(null)
  const [loadingHighlight, setLoadingHighlight] = useState(false)

  if (!boss || !problem) {
    return (
      <main className="flex-1 p-4 flex items-center justify-center">
        <p style={{ color: '#E53935' }}>問題データがありません</p>
      </main>
    )
  }

  const challengeProblem: GeneratedProblem = { ...problem, explanation: null }
  const isCorrect = submitted && selectedLabel === challengeProblem.correctLabel

  async function handleSubmit() {
    if (!selectedLabel) return
    setSaving(true)
    setLoadingHighlight(true)
    const correct = selectedLabel === challengeProblem.correctLabel

    const [, highlightRes] = await Promise.all([
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
      fetch('/api/highlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passageHtml: challengeProblem.passageHtml,
          questionText: challengeProblem.questionText,
          correctLabel: challengeProblem.correctLabel,
          choices: challengeProblem.choices,
        }),
      }),
    ])

    const highlightData = await highlightRes.json()
    setHighlightInfo(highlightData)
    setSubmitted(true)
    setSaving(false)
    setLoadingHighlight(false)
  }

  function handleRetry() {
    setSelectedLabel(null)
    setSubmitted(false)
    setHighlightInfo(null)
  }

  function handleWakaranai() {
    router.push(`/wakaranai?bossType=${bossType}`)
  }

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <button onClick={() => router.push(`/boss/${bossType}/step2`)} className="text-sm mb-4 active:opacity-60" style={{ color: 'var(--burgundy)' }}>
          ← 答えに戻る
        </button>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide" style={{ color: '#E53935' }}>ひとりでやってみる — ヒントなし</p>
            <h1 className="text-xl font-black mt-1" style={{ color: '#1A1A1A' }}>{boss.name}</h1>
          </div>
          <ProblemTimer limitSeconds={boss.timeLimit} running={!submitted} />
        </div>
      </div>

      <ProblemPanel
        problem={challengeProblem}
        selectedLabel={selectedLabel}
        onSelect={submitted ? undefined : setSelectedLabel}
        revealAnswer={submitted}
        highlightText={submitted && highlightInfo?.keyText ? highlightInfo.keyText : undefined}
        highlightColor={isCorrect ? 'green' : 'pink'}
      />

      {loadingHighlight && (
        <div className="flex items-center gap-2 py-2">
          <LoadingSpinner />
          <p className="text-xs" style={{ color: '#787878' }}>根拠の文を確認中...</p>
        </div>
      )}

      {submitted && !loadingHighlight && highlightInfo?.keyText && (
        <div
          className="rounded-2xl p-4"
          style={{
            background: isCorrect ? '#F0FBF0' : '#FFF5F5',
            border: `1.5px solid ${isCorrect ? '#4CAF50' : '#E57373'}`,
          }}
        >
          {isCorrect ? (
            <>
              <p className="font-black text-base mb-2" style={{ color: '#2E7D32' }}>✨ 正解！</p>
              <p className="text-xs font-bold mb-1" style={{ color: '#787878' }}>答えの根拠はこの文：</p>
              <p className="text-sm italic leading-relaxed mb-2" style={{ color: '#1A1A1A' }}>{highlightInfo.keyText}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#787878' }}>（{highlightInfo.keyJapanese}）</p>
              {problem.explanation && (
                <p className="text-sm mt-3 pt-3 leading-relaxed whitespace-pre-wrap" style={{ color: '#1A1A1A', borderTop: '1px solid #C8E6C9' }}>{problem.explanation}</p>
              )}
            </>
          ) : (
            <>
              <p className="font-black text-base mb-2" style={{ color: '#C62828' }}>惜しい！正解は {challengeProblem.correctLabel} だったよ。</p>
              <p className="text-xs font-bold mb-1" style={{ color: '#787878' }}>答えの根拠はこの文：</p>
              <p className="text-sm italic leading-relaxed mb-2" style={{ color: '#1A1A1A' }}>{highlightInfo.keyText}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#787878' }}>（{highlightInfo.keyJapanese}）</p>
              {problem.explanation && (
                <p className="text-sm mt-3 pt-3 leading-relaxed whitespace-pre-wrap" style={{ color: '#1A1A1A', borderTop: '1px solid #FFCDD2' }}>{problem.explanation}</p>
              )}
            </>
          )}
        </div>
      )}

      {submitted && !loadingHighlight && !highlightInfo?.keyText && !isCorrect && (
        <div className="rounded-2xl p-4" style={{ background: '#FFF0F0', border: '1.5px solid #E57373' }}>
          <p className="text-sm font-bold" style={{ color: '#C62828' }}>惜しい！正解は {challengeProblem.correctLabel} だったよ。</p>
          {problem.explanation && (
            <p className="text-sm mt-2 leading-relaxed whitespace-pre-wrap" style={{ color: '#1A1A1A' }}>{problem.explanation}</p>
          )}
        </div>
      )}

      <div className="space-y-3 pt-2 pb-4">
        {!submitted ? (
          <BottomButton
            label={saving ? '確認中...' : 'これが答え！'}
            onClick={handleSubmit}
            disabled={!selectedLabel || saving}
          />
        ) : isCorrect ? (
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
