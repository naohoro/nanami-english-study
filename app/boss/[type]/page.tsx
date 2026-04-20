'use client'

import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { TrickPanel } from '@/components/boss/TrickPanel'
import { BottomButton } from '@/components/ui/BottomButton'
import type { BossType } from '@/lib/types'

export default function Step1Page() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  if (!boss) {
    return (
      <main className="flex-1 p-4 flex items-center justify-center">
        <p className="text-red-400">ボスが見つかりません</p>
      </main>
    )
  }

  function handleNext() {
    router.push(`/boss/${bossType}/step2`)
  }

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <p className="text-xs text-gray-400">第{boss.section}問型</p>
        <h1 className="text-2xl font-black mt-1">{boss.name}</h1>
        <p className="text-yellow-400 text-sm mt-1">まず攻略法を見よう</p>
      </div>

      <TrickPanel trick={boss.trick} steps={boss.trickSteps} />

      <div className="mt-auto pt-4">
        <BottomButton
          label="わかった！問題を見る →"
          onClick={handleNext}
        />
      </div>
    </main>
  )
}
