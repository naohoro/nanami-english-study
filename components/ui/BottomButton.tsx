'use client'

interface BottomButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

export function BottomButton({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}: BottomButtonProps) {
  const variantStyles = {
    primary: 'text-white active:opacity-80',
    secondary: 'text-[#8C1A4B] active:opacity-80',
    danger: 'bg-red-500 text-white active:bg-red-600',
  }

  const bgStyles = {
    primary: { background: 'var(--burgundy)' },
    secondary: { background: 'var(--burgundy-light)', border: '1px solid var(--border)' },
    danger: {},
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={bgStyles[variant]}
      className={`
        w-full py-4 rounded-2xl text-base font-bold transition-opacity
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]}
      `}
    >
      {label}
    </button>
  )
}
