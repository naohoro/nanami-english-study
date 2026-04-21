'use client'

import Link from 'next/link'
import type { MasteryStatus, BossConfig } from '@/lib/types'

interface MapCardProps {
  boss: BossConfig
  status: MasteryStatus
}

const statusConfig: Record<MasteryStatus, { icon: string; label: string }> = {
  cleared:    { icon: '✅', label: 'クリア済み' },
  in_progress:{ icon: '🔥', label: '練習中' },
  untouched:  { icon: '○', label: 'まだやってない' },
}

export function MapCard({ boss, status }: MapCardProps) {
  const { icon, label } = statusConfig[status]
  const isCleared = status === 'cleared'

  return (
    <Link href={`/boss/${boss.type}`}>
      <div
        className="rounded-2xl p-5 transition-opacity active:opacity-70"
        style={{
          background: isCleared ? 'var(--burgundy-light)' : '#fff',
          border: `1.5px solid ${isCleared ? '#D4A0B8' : 'var(--border)'}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-base font-bold" style={{ color: '#1A1A1A' }}>{boss.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: '#787878' }}>配点 {boss.points}点</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl">{icon}</div>
            <p className="text-xs mt-0.5" style={{ color: isCleared ? 'var(--burgundy)' : '#787878' }}>{label}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
