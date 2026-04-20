import type { Mastery } from '@/lib/types'
import { BOSS_CONFIGS } from '@/lib/boss-data'

interface ProgressBannerProps {
  masteries: Mastery[]
}

export function ProgressBanner({ masteries }: ProgressBannerProps) {
  const cleared = masteries.filter((m) => m.status === 'cleared')
  const inProgress = masteries.filter((m) => m.status === 'in_progress')

  if (cleared.length === 0 && inProgress.length === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl p-4">
        <p className="text-gray-400 text-sm">最初のボスに挑戦しよう！</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-2">
      <p className="text-xs text-gray-500 font-mono">📊 七海の攻略状況</p>
      {cleared.length > 0 && (
        <div>
          <p className="text-xs text-green-400 mb-1">🏆 攻略済み</p>
          {cleared.map((m) => (
            <p key={m.bossType} className="text-sm">✅ {BOSS_CONFIGS[m.bossType]?.name ?? m.bossType}</p>
          ))}
        </div>
      )}
      {inProgress.length > 0 && (
        <div>
          <p className="text-xs text-yellow-400 mb-1">🔥 挑戦中</p>
          {inProgress.map((m) => (
            <p key={m.bossType} className="text-sm">🔥 {BOSS_CONFIGS[m.bossType]?.name ?? m.bossType}</p>
          ))}
        </div>
      )}
    </div>
  )
}
