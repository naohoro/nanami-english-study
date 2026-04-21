'use client'

import { useState } from 'react'
import { MapCard } from './MapCard'
import type { BossConfig, MasteryStatus } from '@/lib/types'

type SortKey = 'points_desc' | 'points_asc' | 'time_asc'

interface MapListProps {
  bosses: BossConfig[]
  masteryMap: Record<string, MasteryStatus>
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'points_desc', label: '配点が高い順' },
  { key: 'points_asc',  label: '易しい問題から' },
  { key: 'time_asc',    label: '短時間順' },
]

export function MapList({ bosses, masteryMap }: MapListProps) {
  const [sort, setSort] = useState<SortKey>('points_desc')

  const sorted = [...bosses].sort((a, b) => {
    if (sort === 'points_desc') return b.points - a.points
    if (sort === 'points_asc')  return a.points - b.points
    if (sort === 'time_asc')    return a.timeLimit - b.timeLimit
    return 0
  })

  return (
    <>
      {/* ソートボタン */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SORT_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-opacity active:opacity-60"
            style={
              sort === key
                ? { background: 'var(--burgundy)', color: '#fff' }
                : { background: '#F5F5F5', color: '#787878', border: '1px solid var(--border)' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* 問題カード一覧 */}
      <div className="space-y-3">
        {sorted.map((boss) => (
          <MapCard
            key={boss.type}
            boss={boss}
            status={masteryMap[boss.type] ?? 'untouched'}
          />
        ))}
      </div>
    </>
  )
}
