'use client'

type Stats = {
  accuracyPct: number
  clearedBossCount: number
  totalMinutes: number
  streakDays: number
}

type Props = {
  stats: Stats
  greeting?: string
}

export function ProgressBanner({ stats, greeting }: Props) {
  const h = Math.floor(stats.totalMinutes / 60)
  const m = stats.totalMinutes % 60
  const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m`

  return (
    <section style={{ padding: '28px 20px 24px', borderBottom: '1px solid var(--rule)' }}>
      {greeting && (
        <div className="mono-kicker" style={{ marginBottom: 12 }}>{greeting}</div>
      )}
      <div className="mono-kicker">§01 / TODAY'S WORK</div>

      <h1
        className="display"
        style={{ marginTop: 10, fontSize: 38, lineHeight: 1.05, color: 'var(--ink)', fontVariationSettings: '"opsz" 144' }}
      >
        Read what <em className="display-italic">matters.</em>
        <br />
        Skip the rest.
      </h1>

      <div className="font-mincho" style={{ marginTop: 14, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-2)' }}>
        設問から読み、本文は戻り読み。
        <br />
        これだけで共通テスト英語は、静かに終わる。
      </div>

      <div
        style={{
          marginTop: 22,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid var(--rule)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <Stat label="ACCURACY" value={`${stats.accuracyPct}`} unit="%" />
        <Stat label="CLEARED" value={`${stats.clearedBossCount}`} unit="/ 8" />
        <Stat label="TIME" value={timeStr} />
        <Stat label="STREAK" value={`${stats.streakDays}`} unit="d" />
      </div>
    </section>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div style={{ padding: '14px 12px', borderRight: '1px solid var(--rule-soft)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.05em' }}>{label}</div>
      <div className="display tabular" style={{ marginTop: 6, fontSize: 22, color: 'var(--ink)', lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: 13, color: 'var(--ink-3)', marginLeft: 3 }}>{unit}</span>}
      </div>
    </div>
  )
}
