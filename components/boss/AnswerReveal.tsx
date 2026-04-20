import type { GeneratedProblem } from '@/lib/types'

interface AnswerRevealProps {
  problem: GeneratedProblem
}

export function AnswerReveal({ problem }: AnswerRevealProps) {
  return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 space-y-2">
      <p className="text-xs text-green-400 font-bold">✅ 正解：{problem.correctLabel}</p>
      {problem.explanation && (
        <p className="text-sm text-gray-200 leading-relaxed">{problem.explanation}</p>
      )}
      {problem.trickHint && (
        <p className="text-xs text-yellow-400 mt-2">⚡ {problem.trickHint}</p>
      )}
    </div>
  )
}
