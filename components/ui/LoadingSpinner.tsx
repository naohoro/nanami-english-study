export function LoadingSpinner({ label = '問題を生成中...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
}
