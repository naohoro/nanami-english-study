export function LoadingSpinner({ label = '問題を生成中...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--burgundy)' }} />
      <p className="text-sm" style={{ color: '#787878' }}>{label}</p>
    </div>
  )
}
