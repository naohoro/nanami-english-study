import type { ReactNode } from 'react'

interface TrickPanelProps {
  trick: string
  steps: string[]
  example?: { scenario: string; en: string; questionJa: string; ja: string }
}

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v']

function hl(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <mark key={i} style={{ background: 'none', color: 'var(--ink)', fontWeight: 700, borderBottom: '2px solid var(--accent)', paddingBottom: 1 }}>{part}</mark>
      : part
  )
}

export function TrickPanel({ trick, steps, example }: TrickPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* trick */}
      <div style={{ padding: '18px 0 20px', borderBottom: '1px solid var(--rule)' }}>
        <div className="mono-kicker" style={{ marginBottom: 10, color: 'var(--accent)' }}>THE TRICK</div>
        <p className="font-mincho" style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--ink)', whiteSpace: 'pre-line' }}>{hl(trick)}</p>
      </div>

      {/* steps */}
      <div style={{ padding: '20px 0', borderBottom: example ? '1px solid var(--rule)' : undefined }}>
        <div className="mono-kicker" style={{ marginBottom: 14 }}>HOW TO SOLVE</div>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((step, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 8, padding: '10px 0', borderBottom: i < steps.length - 1 ? '1px solid var(--rule-soft)' : undefined }}>
              <span className="display-italic" style={{ fontSize: 16, color: 'var(--accent)', paddingTop: 1 }}>{ROMAN[i]}.</span>
              <p className="font-mincho" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-2)', margin: 0 }}>{hl(step)}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* example */}
      {example && (
        <div style={{ padding: '20px 0' }}>
          <div className="mono-kicker" style={{ marginBottom: 12 }}>EXAMPLE</div>
          <p className="font-mincho" style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 10, lineHeight: 1.6 }}>{example.scenario}</p>
          <div style={{ background: 'var(--surface)', borderLeft: '2px solid var(--rule)', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p className="passage-english" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.7 }}>{example.en}</p>
            <p className="font-mincho" style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65 }}>{example.questionJa}</p>
          </div>
          <p className="font-mincho" style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.65 }}>{example.ja}</p>
        </div>
      )}
    </div>
  )
}
