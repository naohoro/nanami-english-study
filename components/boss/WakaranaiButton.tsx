'use client'

interface WakaranaiButtonProps {
  onClick: () => void
}

export function WakaranaiButton({ onClick }: WakaranaiButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 text-sm active:bg-gray-800 transition-colors"
    >
      わからない部分がある
    </button>
  )
}
