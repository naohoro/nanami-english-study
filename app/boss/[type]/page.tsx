'use client'

import { useState, useEffect } from 'react'
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
  const [level, setLevel] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/difficulty?bossType=${bossType}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.level) setLevel(d.level) })
      .catch(() => null)
  }, [bossType])

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
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="mono-kicker">STEP 1 / 3 — READ THE TRICK</div>
          <h1
            className="display"
            style={{ marginTop: 10, fontSize: 28, lineHeight: 1.15, color: 'var(--ink)', fontVariationSettings: '"opsz" 144' }}
          >
            {boss.name}
          </h1>
        </div>
        {level !== null && (
          <div style={{ textAlign: 'center', padding: '6px 14px', border: '1px solid var(--rule)', background: level >= 5 ? 'var(--accent)' : 'var(--surface)', flexShrink: 0, marginTop: 2 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.1em', color: level >= 5 ? 'var(--paper)' : 'var(--ink-3)' }}>LEVEL</div>
            <div className="display tabular" style={{ fontSize: 28, lineHeight: 1, color: level >= 5 ? 'var(--paper)' : 'var(--accent)', fontVariationSettings: '"opsz" 144' }}>
              {level}
            </div>
            {level >= 5 && <div style={{ fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: '0.08em', color: 'var(--paper)', marginTop: 2, opacity: 0.8 }}>MAX</div>}
          </div>
        )}
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
