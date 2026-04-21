'use client'

interface WakaranaiButtonProps {
  onClick: () => void
}

export function WakaranaiButton({ onClick }: WakaranaiButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl text-sm font-medium active:opacity-60 transition-opacity"
      style={{ border: '1.5px solid var(--border)', color: '#787878', background: '#fff' }}
    >
      わからない部分がある
    </button>
  )
}
