import Link from 'next/link'

interface LessonEntryCardProps {
  done: number
  total: number
  needsReview: boolean
}

export function LessonEntryCard({ done, total, needsReview }: LessonEntryCardProps) {
  const pct = Math.round((done / total) * 100)
  return (
    <Link
      href="/lesson"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 14,
        padding: '18px 20px',
        background: 'var(--paper)',
        borderBottom: '1px solid var(--rule)',
        textDecoration: 'none',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            Lesson
          </span>
          {needsReview && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-2)',
              padding: '2px 6px', border: '1px solid var(--rule-soft)',
              letterSpacing: '0.02em',
            }}>
              要復習
            </span>
          )}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>
            <em style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 500 }}>{done}</em> / {total}
          </span>
        </div>

        <div style={{
          fontFamily: 'var(--display)', fontStyle: 'italic', fontWeight: 400,
          fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 10,
        }}>
          語彙と表現を、<span style={{ color: 'var(--accent)' }}>静かに</span>積む。
        </div>

        <div style={{ height: 3, background: 'var(--ink-4)', opacity: 0.45, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'var(--ink)', opacity: 1 }} />
        </div>
        <div style={{ marginTop: 6, fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--ink-3)' }}>
          30秒 / 1枚 · スキマで完結
        </div>
      </div>

      <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 22, color: 'var(--accent)', paddingLeft: 4 }}>
        →
      </span>
    </Link>
  )
}
