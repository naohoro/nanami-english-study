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
    <main className="flex-1 p-6 flex flex-col items-center justify-center gap-6 text-center">
      <div className="text-7xl">🎉</div>
      <div>
        <h1 className="text-3xl font-black" style={{ color: '#1A1A1A' }}>できた！</h1>
        <p className="text-xl font-bold mt-2" style={{ color: 'var(--burgundy)' }}>{boss?.name ?? '問題'}</p>
        <p className="text-sm mt-3" style={{ color: '#787878' }}>コツが使いこなせたね。</p>
      </div>

      <div className="w-full space-y-3 mt-6">
        <BottomButton
          label="他の問題に挑戦する →"
          onClick={() => router.push('/')}
        />
        <button
          onClick={() => router.push(`/boss/${bossType}?rationale=open`)}
          className="w-full text-sm font-bold py-2.5 px-4 rounded-xl active:opacity-60 flex items-center justify-center gap-2"
          style={{ background: '#1A1A1A', color: '#FFD700' }}
        >
          ⚡ この問題の裏技を確認する
        </button>
        <BottomButton
          label="もう一度やってみる"
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
