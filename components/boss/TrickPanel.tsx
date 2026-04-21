interface TrickPanelProps {
  trick: string
  steps: string[]
  example?: { en: string; ja: string }
}

export function TrickPanel({ trick, steps, example }: TrickPanelProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4" style={{ background: 'var(--gold-light)', border: '1px solid #E8D5A3' }}>
        <p className="text-xs font-bold mb-2" style={{ color: 'var(--gold)' }}>💡 コツ</p>
        <p className="text-sm leading-relaxed" style={{ color: '#1A1A1A' }}>{trick}</p>
      </div>

      <div className="rounded-2xl p-4 space-y-3" style={{ background: '#fff', border: '1px solid var(--border)' }}>
        <p className="text-xs font-bold" style={{ color: '#787878' }}>3ステップで解く</p>
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white" style={{ background: 'var(--burgundy)' }}>{i + 1}</span>
            <p className="text-sm" style={{ color: '#1A1A1A' }}>{step}</p>
          </div>
        ))}
      </div>

      {example && (
        <div className="rounded-2xl p-4 space-y-2" style={{ background: 'var(--burgundy-light)', border: '1px solid #D4A0B8' }}>
          <p className="text-xs font-bold" style={{ color: 'var(--burgundy)' }}>📖 例</p>
          <p className="text-xs leading-relaxed font-mono" style={{ color: '#3A3A3A' }}>{example.en}</p>
          <p className="text-xs leading-relaxed" style={{ color: '#787878' }}>→ {example.ja}</p>
        </div>
      )}
    </div>
  )
}
