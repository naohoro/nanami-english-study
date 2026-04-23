'use client'

import { useState } from 'react'

export function LevelAccordion({
  level,
  done,
  total,
  children,
}: {
  level: number
  done: number
  total: number
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '32px 1fr auto auto',
          gap: 0,
          alignItems: 'center',
          padding: '10px 20px',
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--rule-soft)',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'var(--display)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--ink-4)',
        }}>✓</span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10,
          color: 'var(--ink-4)', letterSpacing: '0.04em',
        }}>
          Level {level} — 完了
        </span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10,
          color: 'var(--ink-4)', marginRight: 12,
        }}>{done}/{total}</span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9,
          color: 'var(--ink-4)',
        }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div style={{ opacity: 0.6 }}>{children}</div>}
    </div>
  )
}
