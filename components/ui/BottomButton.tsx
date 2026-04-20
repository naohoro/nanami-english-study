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
    primary: 'bg-yellow-400 text-gray-900 active:bg-yellow-500',
    secondary: 'bg-gray-700 text-white active:bg-gray-600',
    danger: 'bg-red-500 text-white active:bg-red-600',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 rounded-2xl text-lg font-bold transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]}
      `}
    >
      {label}
    </button>
  )
}
