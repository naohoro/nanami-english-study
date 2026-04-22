'use client'

import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { TrickPanel } from '@/components/boss/TrickPanel'
import { RationaleReveal } from '@/components/boss/RationaleReveal'
import { BottomButton } from '@/components/ui/BottomButton'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
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
      <Breadcrumb crumbs={[{ label: 'MAP', href: '/' }, { label: 'STEP 1' }]} />
      <div style={{ padding: '20px 20px 16px' }}>
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
          onClick={() => router.push(`/boss/${bossType}/practice`)}
        />
      </div>
    </main>
  )
}
