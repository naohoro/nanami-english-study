import type { GeneratedProblem } from '@/lib/types'

interface ProblemPanelProps {
  problem: GeneratedProblem
  selectedLabel?: 'A' | 'B' | 'C' | 'D' | null
  onSelect?: (label: 'A' | 'B' | 'C' | 'D') => void
  revealAnswer?: boolean
}

export function ProblemPanel({
  problem,
  selectedLabel,
  onSelect,
  revealAnswer = false,
}: ProblemPanelProps) {
  return (
    <div className="space-y-4">
      {/* 問題文 */}
      <div
        className="bg-gray-900 rounded-2xl p-4 text-sm leading-relaxed text-gray-200"
        dangerouslySetInnerHTML={{ __html: problem.passageHtml }}
      />

      {/* 設問 */}
      <p className="text-sm font-bold">{problem.questionText}</p>

      {/* 選択肢 */}
      <div className="space-y-2">
        {problem.choices.map((choice) => {
          const isSelected = selectedLabel === choice.label
          const isCorrect = choice.label === problem.correctLabel
          let borderClass = 'border-gray-700'

          if (revealAnswer && isCorrect) borderClass = 'border-green-500 bg-green-500/10'
          else if (revealAnswer && isSelected && !isCorrect) borderClass = 'border-red-500 bg-red-500/10'
          else if (isSelected) borderClass = 'border-yellow-400'

          return (
            <button
              key={choice.label}
              onClick={() => onSelect?.(choice.label)}
              disabled={revealAnswer}
              className={`w-full text-left border-2 ${borderClass} rounded-xl p-3 text-sm transition-colors disabled:cursor-default`}
            >
              <span className="font-bold mr-2">{choice.label}.</span>
              {choice.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
