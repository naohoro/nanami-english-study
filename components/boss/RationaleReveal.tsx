'use client'

import { useState } from 'react'
import type { BossRationale } from '@/lib/types'

type Props = { rationale: BossRationale; bossIndex: number }

export function RationaleReveal({ rationale, bossIndex }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <section style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '18px 20px' }}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontSize: 13,
            color: 'var(--ink-2)',
          }}
        >
          <span>
            <span className="display-italic" style={{ fontSize: 15, marginRight: 8 }}>Points</span>
            第{bossIndex}問に関する情報を確認する
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>OPEN ↓</span>
        </button>
      )}

      {open && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="mono-kicker">§0{bossIndex} / RATIONALE</div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', cursor: 'pointer', padding: 0 }}
            >
              CLOSE ↑
            </button>
          </div>

          <h2
            className="display"
            style={{ marginTop: 14, fontSize: 24, lineHeight: 1.2, color: 'var(--ink)', letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 144' }}
          >
            {rationale.headline}
          </h2>

          <div
            style={{
              marginTop: 18,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              borderTop: '1px solid var(--rule)',
              borderBottom: '1px solid var(--rule)',
            }}
          >
            <Stat label="POINTS" value={`${rationale.points}`} unit="/ 100" />
            <Stat label="ACCURACY" value={`${rationale.accuracyPct2025}`} unit="%" />
            <Stat label="GROWTH" value={growthLabel(rationale.growthPotential)} />
          </div>

          <p
            className="font-mincho"
            style={{ marginTop: 16, fontSize: 14, lineHeight: 1.8, color: 'var(--ink-2)', whiteSpace: 'pre-line' }}
          >
            {rationale.rationale}
          </p>

          <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-4)' }}>
            Source — 独立行政法人 大学入試センター 2025年度公表データ
          </div>
        </div>
      )}
    </section>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div style={{ padding: '12px 8px 12px 0', borderRight: '1px solid var(--rule-soft)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.05em' }}>{label}</div>
      <div className="display tabular" style={{ marginTop: 4, fontSize: 22, color: 'var(--ink)', lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 3 }}>{unit}</span>}
      </div>
    </div>
  )
}

function growthLabel(g: 'low' | 'medium' | 'high'): string {
  return g === 'high' ? 'HIGH' : g === 'medium' ? 'MID' : 'LOW'
}
