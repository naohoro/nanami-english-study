'use client'

import Link from 'next/link'
import type { MasteryStatus, BossConfig } from '@/lib/types'

interface MapCardProps {
  boss: BossConfig
  status: MasteryStatus
}

const statusConfig: Record<MasteryStatus, { icon: string; label: string }> = {
  cleared:     { icon: '✅', label: 'クリア済み' },
  in_progress: { icon: '🔥', label: '練習中' },
  untouched:   { icon: '○', label: 'まだやってない' },
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s === 0 ? `${m}分` : `${m}分${s}秒`
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
            <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--burgundy)' }}>第{boss.section}問</p>
            <h2 className="text-base font-bold" style={{ color: '#1A1A1A' }}>{boss.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs" style={{ color: '#787878' }}>配点 <strong style={{ color: '#1A1A1A' }}>{boss.points}点</strong></span>
              <span className="text-xs" style={{ color: '#787878' }}>目安 <strong style={{ color: '#1A1A1A' }}>{formatTime(boss.timeLimit)}</strong></span>
            </div>
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
