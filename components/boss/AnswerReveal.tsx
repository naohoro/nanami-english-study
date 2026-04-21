import type { GeneratedProblem } from '@/lib/types'

interface AnswerRevealProps {
  problem: GeneratedProblem
  selectedLabels: Record<number, 'A' | 'B' | 'C' | 'D' | null>
}

export function AnswerReveal({ problem, selectedLabels }: AnswerRevealProps) {
  const total = problem.questions.length
  const correctCount = problem.questions.filter(
    q => selectedLabels[q.number] === q.correctLabel
  ).length

  const allCorrect = correctCount === total

  return (
    <div className="space-y-3">
      {/* スコア */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: allCorrect ? '#F0FBF0' : '#FFF5F5',
          border: `1.5px solid ${allCorrect ? '#4CAF50' : '#E57373'}`,
        }}
      >
        <p className="font-black text-base" style={{ color: allCorrect ? '#2E7D32' : '#C62828' }}>
          {allCorrect ? '✨ 全問正解！' : `${correctCount} / ${total} 問正解`}
        </p>
      </div>

      {/* 各問の解説 */}
      {problem.questions.map((q) => {
        const selected = selectedLabels[q.number] ?? null
        const correct = selected === q.correctLabel

        return (
          <div
            key={q.number}
            className="rounded-2xl p-4 space-y-2"
            style={{
              background: correct ? '#F0FBF0' : '#FFF0F0',
              border: `1.5px solid ${correct ? '#4CAF50' : '#E57373'}`,
            }}
          >
            <p className="text-sm font-bold" style={{ color: correct ? '#2E7D32' : '#C62828' }}>
              問{q.number}　{correct ? '✅ 正解' : `✗ 正解：${q.correctLabel}`}
            </p>
            {q.explanation && (
              <p className="text-sm leading-relaxed font-mincho" style={{ color: '#1A1A1A' }}>
                {q.explanation}
              </p>
            )}
          </div>
        )
      })}

      {/* 裏技ヒント */}
      {problem.trickHint && (
        <p className="text-xs font-medium" style={{ color: 'var(--gold)' }}>
          💡 {problem.trickHint}
        </p>
      )}
    </div>
  )
}
