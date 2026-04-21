import type { GeneratedProblem } from '@/lib/types'

interface AnswerRevealProps {
  problem: GeneratedProblem
}

export function AnswerReveal({ problem }: AnswerRevealProps) {
  return (
    <div className="rounded-2xl p-4 space-y-2" style={{ background: '#F0FBF0', border: '1.5px solid #4CAF50' }}>
      <p className="text-sm font-bold" style={{ color: '#2E7D32' }}>✅ 正解：{problem.correctLabel}</p>
      {problem.explanation && (
        <p className="text-sm leading-relaxed" style={{ color: '#1A1A1A' }}>{problem.explanation}</p>
      )}
      {problem.trickHint && (
        <p className="text-xs mt-2 font-medium" style={{ color: 'var(--gold)' }}>💡 {problem.trickHint}</p>
      )}
    </div>
  )
}
