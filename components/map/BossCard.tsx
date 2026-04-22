'use client'

import Link from 'next/link'
import type { BossType } from '@/lib/types'

export type BossStatus = 'locked' | 'available' | 'in-progress' | 'cleared'

type Props = {
  index: number
  type: BossType
  name: string
  points: number
  trickSummary: string
  status: BossStatus
  level?: number
}

export function BossCard({ index, type, name, points, trickSummary, status, level = 1 }: Props) {
  const isLocked = status === 'locked'
  const isCleared = status === 'cleared'

  const inner = (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: '64px 1fr auto',
        alignItems: 'center',
        padding: '18px 20px',
        borderBottom: '1px solid var(--rule-soft)',
        opacity: isLocked ? 0.45 : 1,
        cursor: isLocked ? 'not-allowed' : 'pointer',
        transition: 'background 160ms ease',
      }}
      onMouseEnter={(e) => {
        if (!isLocked) (e.currentTarget.style.background = 'var(--surface)')
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      <div
        className="display"
        style={{
          fontSize: 34,
          color: isCleared ? 'var(--accent)' : 'var(--ink-3)',
          lineHeight: 1,
          fontVariationSettings: '"opsz" 144',
        }}
      >
        §{String(index).padStart(2, '0')}
      </div>

      <div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
          {name}
        </div>
        <div style={{ marginTop: 3, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>
          {trickSummary.toUpperCase()}
        </div>
      </div>

      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="tabular" style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>
            {points} pts
          </div>
          <div style={{
            padding: '2px 7px',
            border: `1px solid ${level >= 5 ? 'var(--accent)' : 'var(--rule)'}`,
            background: level >= 5 ? 'var(--accent)' : 'transparent',
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.06em', color: level >= 5 ? 'var(--paper)' : 'var(--ink-2)' }}>
              LVL {level}{level >= 5 ? ' MAX' : ''}
            </span>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.06em', color: statusColor(status), textTransform: 'uppercase' }}>
          {statusLabel(status)}
        </div>
      </div>
    </article>
  )

  if (isLocked) return inner
  return <Link href={`/boss/${type}`} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link>
}

function statusColor(s: BossStatus): string {
  switch (s) {
    case 'cleared': return 'var(--ok)'
    case 'in-progress': return 'var(--accent)'
    case 'available': return 'var(--ink-2)'
    case 'locked': return 'var(--ink-4)'
  }
}

function statusLabel(s: BossStatus): string {
  switch (s) {
    case 'cleared': return '✓ CLEARED'
    case 'in-progress': return '... IN PROGRESS'
    case 'available': return '→ START'
    case 'locked': return '— LOCKED'
  }
}
