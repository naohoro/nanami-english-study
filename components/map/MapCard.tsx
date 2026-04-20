'use client'

import Link from 'next/link'
import type { MasteryStatus, BossConfig } from '@/lib/types'

interface MapCardProps {
  boss: BossConfig
  status: MasteryStatus
}

const statusConfig: Record<MasteryStatus, { icon: string; label: string; border: string }> = {
  cleared: { icon: '✅', label: '攻略済み', border: 'border-green-500' },
  in_progress: { icon: '🔥', label: '挑戦中', border: 'border-yellow-400' },
  untouched: { icon: '⚔️', label: '未挑戦', border: 'border-gray-600' },
}

export function MapCard({ boss, status }: MapCardProps) {
  const { icon, label, border } = statusConfig[status]

  return (
    <Link href={`/boss/${boss.type}`}>
      <div className={`border-2 ${border} rounded-2xl p-4 bg-gray-900 active:bg-gray-800 transition-colors`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl mb-1">{icon}</div>
            <h2 className="text-lg font-bold">{boss.name}</h2>
            <p className="text-gray-400 text-sm">第{boss.section}問型 / {boss.points}点</p>
          </div>
          <span className="text-xs text-gray-500 mt-1">{label}</span>
        </div>
      </div>
    </Link>
  )
}
