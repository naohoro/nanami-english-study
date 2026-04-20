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
      {WAKARANAI_CAUSES.map((cause) => (
        <button
          key={cause.key}
          onClick={() => onSelect(cause.key)}
          className={`
            w-full text-left border-2 rounded-xl p-4 transition-colors
            ${selectedCause === cause.key
              ? 'border-yellow-400 bg-yellow-400/10'
              : 'border-gray-700 bg-gray-900 active:bg-gray-800'
            }
          `}
        >
          <p className="font-bold text-sm">{cause.label}</p>
          <p className="text-xs text-gray-400 mt-1">{cause.support}</p>
        </button>
      ))}
    </div>
  )
}
