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
        <p style={{ color: '#E53935' }}>問題タイプが見つかりません</p>
      </main>
    )
  }

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <button onClick={() => router.push('/')} className="text-sm mb-4 active:opacity-60" style={{ color: 'var(--burgundy)' }}>
          ← もどる
        </button>
        <p className="text-xs font-bold tracking-wide" style={{ color: 'var(--burgundy)' }}>STEP 1 — コツを読む</p>
        <h1 className="text-xl font-black mt-1" style={{ color: '#1A1A1A' }}>{boss.name}</h1>
        <p className="text-sm mt-1" style={{ color: '#787878' }}>まずコツを読んでから問題を見よう</p>
      </div>

      <TrickPanel trick={boss.trick} steps={boss.trickSteps} example={boss.example} />

      <div className="mt-auto pt-4">
        <BottomButton
          label="わかった！問題を見る →"
          onClick={() => router.push(`/boss/${bossType}/step2`)}
        />
      </div>
    </main>
  )
}
