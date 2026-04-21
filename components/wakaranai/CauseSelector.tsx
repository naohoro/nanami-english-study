'use client'

import { WAKARANAI_CAUSES } from '@/lib/boss-data'
import type { WakaranaiCause } from '@/lib/types'

interface CauseSelectorProps {
  selectedCause: WakaranaiCause | null
  onSelect: (cause: WakaranaiCause) => void
}

export function CauseSelector({ selectedCause, onSelect }: CauseSelectorProps) {
  return (
    <div className="space-y-2">
      {WAKARANAI_CAUSES.map((cause) => {
        const isSelected = selectedCause === cause.key
        return (
          <button
            key={cause.key}
            onClick={() => onSelect(cause.key)}
            className="w-full text-left rounded-xl p-4 transition-colors active:opacity-70"
            style={{
              border: `2px solid ${isSelected ? 'var(--burgundy)' : 'var(--border)'}`,
              background: isSelected ? 'var(--burgundy-light)' : '#fff',
            }}
          >
            <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>{cause.label}</p>
            <p className="text-xs mt-1" style={{ color: '#787878' }}>{cause.support}</p>
          </button>
        )
      })}
    </div>
  )
}
