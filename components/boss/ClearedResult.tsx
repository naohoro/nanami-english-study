'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/study-dates'

type Props = {
  bossIndex: number
  bossName: string
  accuracy: number
  timeSpentSec: number
  trickReviewHref: string
  nextHref?: string
}

export function ClearedResult({ bossIndex, bossName, accuracy, timeSpentSec, trickReviewHref, nextHref }: Props) {
  const today = formatDate(new Date().toISOString().slice(0, 10))

  return (
    <div style={{ padding: '64px 24px 40px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div className="mono-kicker" style={{ color: 'var(--ok)' }}>
        §{String(bossIndex).padStart(2, '0')} / CLEARED
      </div>

      <h1
        className="display"
        style={{ marginTop: 18, fontSize: 56, lineHeight: 1, color: 'var(--ink)', letterSpacing: '-0.03em', fontVariationSettings: '"opsz" 144' }}
      >
        Cleared<span className="display-italic" style={{ color: 'var(--accent)' }}>.</span>
      </h1>

      <div className="font-mincho" style={{ marginTop: 20, fontSize: 15, lineHeight: 1.7, color: 'var(--ink-2)' }}>
        {bossName} — 全問正解。
        <br />
        この大問は、もう落とさない。
      </div>

      <div
        style={{
          marginTop: 32,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid var(--rule)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <Stat label="ACCURACY" value={`${accuracy}`} unit="%" />
        <Stat label="TIME" value={formatTime(timeSpentSec)} />
        <Stat label="DATE" value={today} tiny />
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link
          href={trickReviewHref}
          className="hy-btn full"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}
        >
          <span>落とし穴をもう一度見る</span>
          <span className="arr">→</span>
        </Link>
        {nextHref && (
          <Link
            href={nextHref}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 18px', border: '1px solid var(--rule)', background: 'transparent',
              color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14, textDecoration: 'none',
            }}
          >
            <span>次の大問へ</span>
            <span style={{ fontFamily: 'var(--mono)' }}>→</span>
          </Link>
        )}
        <Link
          href="/"
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '12px 18px', background: 'transparent',
            color: 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: 10, textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          ← MAP に戻る
        </Link>
      </div>
    </div>
  )
}

function Stat({ label, value, unit, tiny }: { label: string; value: string; unit?: string; tiny?: boolean }) {
  return (
    <div style={{ padding: '14px 10px', borderRight: '1px solid var(--rule-soft)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.05em' }}>{label}</div>
      <div
        className="display tabular"
        style={{ marginTop: 6, fontSize: tiny ? 14 : 22, color: 'var(--ink)', lineHeight: 1, fontFamily: tiny ? 'var(--mono)' : 'var(--display)' }}
      >
        {value}
        {unit && <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 2 }}>{unit}</span>}
      </div>
    </div>
  )
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${String(s).padStart(2, '0')}s`
}
