export function daysUntilExam(examDate: string): number {
  const exam = new Date(examDate + 'T00:00:00')
  const now = new Date()
  const diff = Math.ceil((exam.getTime() - now.getTime()) / 86400000)
  return Math.max(0, diff)
}

export function daysSinceStart(studyStartedAt: string): number {
  const start = new Date(studyStartedAt)
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return Math.max(1, diff + 1)
}

export function formatDayCounter(studyStartedAt: string, examDate: string): string {
  const n = daysSinceStart(studyStartedAt)
  const remaining = daysUntilExam(examDate)
  const total = n + remaining
  return `DAY ${String(n).padStart(3, '0')} / ${total}`
}

export function formatRemainingDays(examDate: string): string {
  const d = daysUntilExam(examDate)
  if (d === 0) return '試験当日'
  if (d === 1) return '試験まで 1 日'
  return `試験まで ${d} 日`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  const romans = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii']
  return `${days[d.getDay()]}. ${d.getDate()}.${romans[d.getMonth() + 1]}.${d.getFullYear()}`
}
