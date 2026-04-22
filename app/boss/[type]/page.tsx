'use client'

import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { TrickPanel } from '@/components/boss/TrickPanel'
import { RationaleReveal } from '@/components/boss/RationaleReveal'
import { BottomButton } from '@/components/ui/BottomButton'
import type { BossType } from '@/lib/types'

export default function Step1Page() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  if (!boss) {
    return (
      <main style={{ flex: 1, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--danger)' }}>問題タイプが見つかりません</p>
      </main>
    )
  }

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '28px 20px 20px' }}>
        <button
          onClick={() => router.push('/')}
          style={{
            marginBottom: 16,
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: 'var(--ink-3)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            letterSpacing: '0.05em',
          }}
        >
          ← MAP
        </button>
        <div className="mono-kicker">STEP 1 / 3 — READ THE TRICK</div>
        <h1
          className="display"
          style={{ marginTop: 10, fontSize: 28, lineHeight: 1.15, color: 'var(--ink)', fontVariationSettings: '"opsz" 144' }}
        >
          {boss.name}
        </h1>
      </div>

      {boss.rationale && (
        <RationaleReveal rationale={boss.rationale} bossIndex={boss.section} />
      )}

      <div style={{ padding: '0 20px' }}>
        <TrickPanel trick={boss.trick} steps={boss.trickSteps} example={boss.example} />
      </div>

      <div style={{ marginTop: 'auto', padding: '16px 20px 32px' }}>
        <BottomButton
          label="わかった！問題を見る →"
          onClick={() => router.push(`/boss/${bossType}/step2`)}
        />
      </div>
    </main>
  )
}
