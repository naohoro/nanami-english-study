'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CauseSelector } from '@/components/wakaranai/CauseSelector'
import { BottomButton } from '@/components/ui/BottomButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { WakaranaiCause, GeneratedProblem, BossType } from '@/lib/types'

function WakaranaiContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bossType = searchParams.get('bossType') as BossType
  const raw = typeof window !== 'undefined' ? sessionStorage.getItem('currentProblem') : null
  const problem: GeneratedProblem | null = raw ? JSON.parse(raw) : null

  const [selectedCause, setSelectedCause] = useState<WakaranaiCause | null>(null)

  function handleSelectCause(cause: WakaranaiCause) {
    setSelectedCause(cause)
    setSupportMessage(null)
  }
  const [supportMessage, setSupportMessage] = useState<string | null>(null)
  const [loadingSupport, setLoadingSupport] = useState(false)

  async function handleGetSupport() {
    if (!selectedCause || !problem) return
    setLoadingSupport(true)
    try {
      const res = await fetch('/api/generate/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cause: selectedCause,
          passageHtml: problem.passageHtml,
          questionText: problem.questionText,
        }),
      })
      const data = await res.json()
      setSupportMessage(data.message)
    } finally {
      setLoadingSupport(false)
    }
  }

  function handleNattoku() {
    router.push(`/boss/${bossType}/step2`)
  }

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <button onClick={() => router.back()} className="text-sm mb-4 active:opacity-60" style={{ color: 'var(--burgundy)' }}>
          ← もどる
        </button>
        <h1 className="text-xl font-black" style={{ color: '#1A1A1A' }}>どこがわからない？</h1>
        <p className="text-sm mt-1" style={{ color: '#787878' }}>理由を1つ選んでね</p>
      </div>

      <CauseSelector selectedCause={selectedCause} onSelect={handleSelectCause} />

      {selectedCause && !supportMessage && !loadingSupport && (
        <BottomButton label="サポートを見る" onClick={handleGetSupport} />
      )}

      {loadingSupport && <LoadingSpinner label="考えてるよ..." />}

      {supportMessage && (
        <div className="rounded-2xl p-4" style={{ background: '#EFF8FF', border: '1px solid #93C5FD' }}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#1A1A1A' }}>{supportMessage}</p>
        </div>
      )}

      {supportMessage && (
        <div className="mt-auto pt-4">
          <BottomButton label="納得した！問題に戻る" onClick={handleNattoku} />
        </div>
      )}
    </main>
  )
}

export default function WakaranaiPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <WakaranaiContent />
    </Suspense>
  )
}
