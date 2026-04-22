'use client'

import { formatDayCounter, formatRemainingDays } from '@/lib/study-dates'

type Props = {
  version?: string
  studyStartedAt?: string
  examDate?: string
}

export function HybridBar({ version = '0.5.0', studyStartedAt, examDate }: Props) {
  const day =
    studyStartedAt && examDate
      ? formatDayCounter(studyStartedAt, examDate)
      : 'DAY — / —'

  const remaining = examDate ? formatRemainingDays(examDate) : '—'

  return (
    <div
      className="hy-bar safe-top"
      style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--paper)' }}
    >
      <div>NANAMI — {version}</div>
      <div className="c tabular">{day}</div>
      <div className="r tabular">{remaining}</div>
    </div>
  )
}
