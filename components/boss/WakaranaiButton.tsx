'use client'

interface WakaranaiButtonProps {
  onClick: () => void
}

export function WakaranaiButton({ onClick }: WakaranaiButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl text-sm font-medium active:opacity-60 transition-opacity"
      style={{ border: '2px solid var(--burgundy)', color: 'var(--burgundy)', background: 'var(--burgundy-light)' }}
    >
      わからない部分がある
    </button>
  )
}
