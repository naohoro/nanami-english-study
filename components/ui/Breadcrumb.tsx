'use client'

import { useRouter } from 'next/navigation'

type Crumb = { label: string; href?: string }

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  const router = useRouter()

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid var(--rule-soft)',
        background: 'var(--paper)',
        overflowX: 'auto',
        gap: 4,
      }}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {i > 0 && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-4)' }}>›</span>
            )}
            {isLast ? (
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em',
                padding: '5px 10px',
                background: 'var(--ink)', color: 'var(--paper)',
              }}>
                {crumb.label}
              </span>
            ) : (
              <button
                onClick={() => crumb.href && router.push(crumb.href)}
                style={{
                  fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em',
                  padding: '5px 10px',
                  background: 'var(--paper-2)', color: 'var(--ink-2)',
                  border: '1px solid var(--rule-soft)',
                  cursor: 'pointer', lineHeight: 1,
                }}
              >
                {crumb.label}
              </button>
            )}
          </div>
        )
      })}
    </nav>
  )
}
