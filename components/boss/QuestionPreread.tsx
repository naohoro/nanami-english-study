'use client'

const CIRCLE_NUMS = ['①', '②', '③', '④', '⑤']

type Props = {
  questions: { number: number; questionText: string }[]
  stepLabel: string
  onStart: () => void
}

export function QuestionPreread({ questions, stepLabel, onStart }: Props) {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 0' }}>
        <div className="mono-kicker">{stepLabel}</div>
      </div>

      <div style={{ padding: '24px 20px 0' }}>
        <h1
          className="display"
          style={{
            fontSize: 28,
            lineHeight: 1.15,
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
            fontVariationSettings: '"opsz" 144',
          }}
        >
          先読みフェーズ
        </h1>

        <p
          className="font-mincho"
          style={{
            marginTop: 12,
            fontSize: 14,
            lineHeight: 1.75,
            color: 'var(--ink-2)',
          }}
        >
          本文を読む前に、まず問題文を全部読もう。{'\n'}
          何を探すかを把握してから本文を読むと、解答スピードが大幅に上がる。
        </p>
      </div>

      <div style={{ margin: '24px 20px 0', borderTop: '1px solid var(--rule-soft)' }}>
        {questions.map((q, i) => (
          <div
            key={q.number}
            style={{
              padding: '14px 0',
              borderBottom: '1px solid var(--rule-soft)',
              display: 'grid',
              gridTemplateColumns: '24px 1fr',
              gap: 10,
              alignItems: 'start',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 14,
                color: 'var(--accent)',
                lineHeight: 1.4,
                paddingTop: 1,
              }}
            >
              {CIRCLE_NUMS[i] ?? `${i + 1}.`}
            </span>
            <p
              style={{
                fontFamily: 'var(--serif-en)',
                fontSize: 15,
                lineHeight: 1.6,
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              {q.questionText}
            </p>
          </div>
        ))}
      </div>

      <div style={{ padding: '24px 20px 40px', marginTop: 'auto' }}>
        <button onClick={onStart} className="hy-btn full">
          <span>本文・問題へ進む</span>
          <span className="arr">→</span>
        </button>
      </div>
    </main>
  )
}
