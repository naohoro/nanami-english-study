interface TrickPanelProps {
  trick: string
  steps: string[]
  example?: { en: string; ja: string }
}

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v']

export function TrickPanel({ trick, steps, example }: TrickPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* trick */}
      <div style={{ padding: '18px 0 20px', borderBottom: '1px solid var(--rule)' }}>
        <div className="mono-kicker" style={{ marginBottom: 10, color: 'var(--accent)' }}>THE TRICK</div>
        <p className="font-mincho" style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--ink)' }}>{trick}</p>
      </div>

      {/* steps */}
      <div style={{ padding: '20px 0', borderBottom: example ? '1px solid var(--rule)' : undefined }}>
        <div className="mono-kicker" style={{ marginBottom: 14 }}>HOW TO SOLVE</div>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((step, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 8, padding: '10px 0', borderBottom: i < steps.length - 1 ? '1px solid var(--rule-soft)' : undefined }}>
              <span className="display-italic" style={{ fontSize: 16, color: 'var(--accent)', paddingTop: 1 }}>{ROMAN[i]}.</span>
              <p className="font-mincho" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-2)', margin: 0 }}>{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* example */}
      {example && (
        <div style={{ padding: '20px 0' }}>
          <div className="mono-kicker" style={{ marginBottom: 12 }}>EXAMPLE</div>
          <p className="passage-english" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.7 }}>{example.en}</p>
          <p className="font-mincho" style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.65 }}>→ {example.ja}</p>
        </div>
      )}
    </div>
  )
}
