'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { ProblemPanel } from '@/components/boss/ProblemPanel'
import { AnswerReveal } from '@/components/boss/AnswerReveal'
import { WakaranaiButton } from '@/components/boss/WakaranaiButton'
import { BottomButton } from '@/components/ui/BottomButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { BossType, GeneratedProblem } from '@/lib/types'

export default function Step2Page() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  const [problem, setProblem] = useState<GeneratedProblem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function generate() {
      if (!boss) return
      setLoading(true)
      try {
        const themes = boss.themes
        const theme = themes[Math.floor(Math.random() * themes.length)]
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bossType,
            difficulty: 2,
            theme,
            mode: 'answer_first',
          }),
        })
        if (!res.ok) throw new Error('生成失敗')
        const data = await res.json()
        setProblem(data)
      } catch {
        setError('問題の生成に失敗しました。もう一度試してください。')
      } finally {
        setLoading(false)
      }
    }
    generate()
  }, [bossType, boss])

  if (!boss) {
    return (
      <main className="flex-1 p-4 flex items-center justify-center">
        <p className="text-red-400">ボスが見つかりません</p>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </main>
    )
  }

  if (error || !problem) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error ?? '問題を取得できませんでした'}</p>
          <BottomButton label="もう一度試す" onClick={() => window.location.reload()} />
        </div>
      </main>
    )
  }

  function handleGoToMaster() {
    router.push(
      `/master/${bossType}?problemData=${encodeURIComponent(JSON.stringify(problem))}`
    )
  }

  function handleWakaranai() {
    router.push(
      `/wakaranai?bossType=${bossType}&problemData=${encodeURIComponent(JSON.stringify(problem))}`
    )
  }

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <p className="text-xs text-yellow-400 font-bold">STEP 2 — 答えを確認しながら読む</p>
        <h1 className="text-xl font-black mt-1">{boss.name}</h1>
      </div>

      <ProblemPanel
        problem={problem}
        revealAnswer={true}
      />

      <AnswerReveal problem={problem} />

      <div className="mt-auto space-y-3 pt-4">
        <WakaranaiButton onClick={handleWakaranai} />
        <BottomButton
          label="ぜんぶわかった！マスターコースへ →"
          onClick={handleGoToMaster}
        />
      </div>
    </main>
  )
}
