'use client'

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']

type Props = { steps: string[] }

export function TrickSteps({ steps }: Props) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--rule)' }}>
      {steps.map((step, i) => (
        <li
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '44px 1fr',
            gap: 14,
            alignItems: 'baseline',
            padding: '16px 20px',
            borderBottom: '1px solid var(--rule-soft)',
          }}
        >
          <span className="display-italic" style={{ fontSize: 22, color: 'var(--accent)', textAlign: 'right' }}>
            {ROMAN[i]}.
          </span>
          <span className="font-mincho" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)' }}>
            {step}
          </span>
        </li>
      ))}
    </ol>
  )
}
