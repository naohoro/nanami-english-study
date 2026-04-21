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
      <div className="rounded-2xl p-4" style={{ background: 'var(--gold-light)', border: '1px solid #E8D5A3' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--gold)' }}>
          まずここから始めよう ✨
        </p>
        <p className="text-xs mt-1" style={{ color: '#787878' }}>
          配点が大きい問題から攻略するのが、点数アップへの近道。
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-4 space-y-2" style={{ background: 'var(--burgundy-light)', border: '1px solid #D4A0B8' }}>
      <p className="text-xs font-bold" style={{ color: 'var(--burgundy)' }}>あなたの進捗</p>
      {cleared.length > 0 && (
        <div>
          {cleared.map((m) => (
            <p key={m.bossType} className="text-sm">✅ {BOSS_CONFIGS[m.bossType]?.name ?? m.bossType}　クリア！</p>
          ))}
        </div>
      )}
      {inProgress.length > 0 && (
        <div>
          {inProgress.map((m) => (
            <p key={m.bossType} className="text-sm">🔥 {BOSS_CONFIGS[m.bossType]?.name ?? m.bossType}　練習中</p>
          ))}
        </div>
      )}
    </div>
  )
}
