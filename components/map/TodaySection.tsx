import Link from 'next/link'

type Props = {
  todayCount: number
  streakDays: number
  mission: { label: string; sub: string; href: string }
}

export function TodaySection({ todayCount, streakDays, mission }: Props) {
  return (
    <div style={{ borderBottom: '1px solid var(--rule)' }}>
      {/* バッジ行 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: 'var(--paper-2)',
        borderBottom: '1px solid var(--rule-soft)',
      }}>
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: todayCount > 0 ? 'var(--ok)' : 'var(--ink-4)',
        }}>
          {todayCount > 0 ? `今日 ${todayCount}枚やった！` : 'まだ今日は0枚'}
        </span>
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: streakDays > 1 ? 'var(--accent-2)' : 'var(--ink-4)',
        }}>
          {streakDays > 1 ? `🔥 ${streakDays}日連続` : '今日からスタート'}
        </span>
      </div>

      {/* ミッションカード */}
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 9,
          color: 'var(--ink-4)',
          letterSpacing: '0.08em',
          marginBottom: 8,
        }}>
          TODAY&apos;S MISSION
        </div>
        <div style={{
          fontFamily: 'var(--display)',
          fontSize: 22,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          {mission.label}
        </div>
        {mission.sub && (
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: 'var(--ink-3)',
            marginTop: 5,
          }}>
            {mission.sub}
          </div>
        )}
        <Link
          href={mission.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 14,
            padding: '13px 16px',
            background: 'var(--ink)',
            color: 'var(--paper)',
            textDecoration: 'none',
            fontFamily: 'var(--sans)',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          1問だけやってみる
          <span style={{
            fontFamily: 'var(--display)',
            fontStyle: 'italic',
            fontSize: 18,
            color: 'var(--accent-2)',
          }}>→</span>
        </Link>
      </div>
    </div>
  )
}
