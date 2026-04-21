'use client'

import { useState, useEffect, useRef } from 'react'

interface ProblemTimerProps {
  limitSeconds: number
  running?: boolean
}

export function ProblemTimer({ limitSeconds, running = true }: ProblemTimerProps) {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const remaining = Math.max(0, limitSeconds - elapsed)
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const display = `${mins}:${String(secs).padStart(2, '0')}`
  const pct = remaining / limitSeconds

  let color = '#4CAF50'
  if (pct <= 0.5) color = '#FF9800'
  if (pct <= 0.25) color = '#E53935'
  const isOver = elapsed > limitSeconds

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: isOver ? '#E53935' : color }}
      />
      <span
        className="text-sm font-bold tabular-nums"
        style={{ color: isOver ? '#E53935' : color }}
      >
        {isOver ? `+${Math.floor((elapsed - limitSeconds) / 60)}:${String((elapsed - limitSeconds) % 60).padStart(2, '0')}` : display}
      </span>
      <span className="text-xs" style={{ color: '#787878' }}>
        {isOver ? '超過中' : `/ ${Math.floor(limitSeconds / 60)}:${String(limitSeconds % 60).padStart(2, '0')}`}
      </span>
    </div>
  )
}
