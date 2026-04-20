interface TrickPanelProps {
  trick: string
  steps: string[]
}

export function TrickPanel({ trick, steps }: TrickPanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-4">
        <p className="text-xs text-yellow-400 font-bold mb-2">⚡ 攻略の裏技</p>
        <p className="text-white leading-relaxed whitespace-pre-line">{trick}</p>
      </div>

      <div className="bg-gray-900 rounded-2xl p-4 space-y-2">
        <p className="text-xs text-gray-400 font-bold">攻略3ステップ</p>
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-yellow-400 font-bold text-sm shrink-0">{i + 1}.</span>
            <p className="text-sm text-gray-200">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
