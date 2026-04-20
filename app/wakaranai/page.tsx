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
  const problemDataRaw = searchParams.get('problemData')
  const problem: GeneratedProblem | null = problemDataRaw
    ? JSON.parse(decodeURIComponent(problemDataRaw))
    : null

  const [selectedCause, setSelectedCause] = useState<WakaranaiCause | null>(null)
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
        <h1 className="text-xl font-black">どこがわからない？</h1>
        <p className="text-gray-400 text-sm mt-1">理由を1つ選んでね</p>
      </div>

      <CauseSelector selectedCause={selectedCause} onSelect={setSelectedCause} />

      {selectedCause && !supportMessage && !loadingSupport && (
        <BottomButton
          label="サポートを見る"
          onClick={handleGetSupport}
        />
      )}

      {loadingSupport && <LoadingSpinner label="考えてるよ..." />}

      {supportMessage && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-sm text-gray-200 leading-relaxed">{supportMessage}</p>
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
