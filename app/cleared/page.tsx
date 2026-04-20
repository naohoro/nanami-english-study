'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { BottomButton } from '@/components/ui/BottomButton'
import type { BossType } from '@/lib/types'

function ClearedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bossType = searchParams.get('bossType') as BossType
  const boss = BOSS_CONFIGS[bossType]

  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-center gap-6 text-center">
      <div className="text-7xl">🎉</div>
      <div>
        <h1 className="text-3xl font-black">攻略！</h1>
        <p className="text-yellow-400 text-xl font-bold mt-2">{boss?.name ?? 'ボス'}</p>
        <p className="text-gray-400 text-sm mt-3">裏技が使いこなせたね。</p>
      </div>

      <div className="w-full space-y-3 mt-8">
        <BottomButton
          label="次のボスに挑む"
          onClick={() => router.push('/')}
        />
        <BottomButton
          label="もう一度このボスを倒す"
          onClick={() => router.push(`/boss/${bossType}`)}
          variant="secondary"
        />
      </div>
    </main>
  )
}

export default function ClearedPage() {
  return (
    <Suspense fallback={null}>
      <ClearedContent />
    </Suspense>
  )
}
