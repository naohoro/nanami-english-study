import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { LESSON_CATEGORIES, LESSON_TOTAL } from '@/lib/lesson-data'
import { AiTeacherChat } from '@/components/ai-teacher/AiTeacherChat'
import { LevelAccordion } from '@/components/lesson/LevelAccordion'

async function getLessonProgress(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id, category_id, understood')
    .eq('user_id', userId)
  return data ?? []
}

export default async function LessonPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const progress = await getLessonProgress(user.id)

  // Build per-category stats
  const understood = new Set(
    progress.filter(p => p.understood).map(p => p.lesson_id)
  )
  const retried = new Set(
    progress.filter(p => !p.understood).map(p => p.lesson_id)
  )

  const categoryStats = LESSON_CATEGORIES.map(cat => {
    const done = cat.cards.filter(c => understood.has(c.id)).length
    const failed = cat.cards.filter(c => retried.has(c.id) && !understood.has(c.id)).length
    const isWeak = failed > 0 && (failed / cat.cards.length) > 0.3
    return { ...cat, done, isWeak }
  })

  const allDone = categoryStats.reduce((s, c) => s + c.done, 0)
  const pct = LESSON_TOTAL > 0 ? Math.round((allDone / LESSON_TOTAL) * 100) : 0
  const weakCount = categoryStats.filter(c => c.isWeak).length

  const weak = categoryStats.filter(c => c.isWeak)

  // Group non-weak categories by level
  const maxLevel = Math.max(...categoryStats.map(c => c.level ?? 1))
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1)

  // Per-level completion stats for unlock system
  const levelStatMap = new Map<number, { done: number; total: number; isComplete: boolean }>()
  for (const lv of levels) {
    const cats = categoryStats.filter(c => (c.level ?? 1) === lv)
    const total = cats.reduce((s, c) => s + c.cards.length, 0)
    const done = cats.reduce((s, c) => s + c.done, 0)
    levelStatMap.set(lv, { done, total, isComplete: total > 0 && done >= total })
  }
  // Active level = lowest level with incomplete cards
  let activeLv = maxLevel
  for (const lv of levels) {
    if (!levelStatMap.get(lv)!.isComplete) { activeLv = lv; break }
  }

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Bar */}
      <div className="hy-bar">
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--ink-3)' }}>← MAP</Link>
        <div className="c">LESSON</div>
        <div className="r" style={{ color: 'var(--ink)' }}>
          <em style={{ fontStyle: 'normal', fontWeight: 500 }}>{allDone}</em> / {LESSON_TOTAL}
        </div>
      </div>

      {/* Hero */}
      <div className="hy-hero">
        <div className="eye">Lesson · snack-sized, 30 seconds each</div>
        <div className="hy-hd">
          気づきを<br /><em>積む。</em>
        </div>
        <div className="hy-sub">
          文法用語は使わない。<b>意味</b>と<b>役割</b>で覚える語彙と表現。<br />
          全体の進捗 <b>{pct}%</b>{weakCount > 0 ? <> · 弱点 <b>{weakCount} 領域</b></> : null}。
        </div>
        <div style={{ marginTop: 18, height: 4, background: 'var(--ink-4)', opacity: 0.3, position: 'relative', borderRadius: 2 }}>
          <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: '#8B1A2E', borderRadius: 2 }} />
        </div>
      </div>

      {/* Weak section */}
      {weak.length > 0 && (
        <>
          <div className="hy-section">
            <div className="idx">⚑</div>
            <div className="t">要復習 · 弱点領域</div>
            <div className="meta">{weak.length} cat.</div>
          </div>
          {weak.map(c => (
            <CategoryRow key={c.id} cat={c} isWeak />
          ))}
        </>
      )}

      {/* Level sections — unlock system */}
      {levels.map(lv => {
        const stat = levelStatMap.get(lv)!
        const cats = categoryStats.filter(c => (c.level ?? 1) === lv && !c.isWeak)
        const isActive = lv === activeLv
        const isCompleted = stat.isComplete && !isActive
        const isLocked = lv > activeLv

        if (isCompleted) {
          return (
            <LevelAccordion key={lv} level={lv} done={stat.done} total={stat.total}>
              {cats.map(c => <CategoryRow key={c.id} cat={c} isWeak={false} />)}
            </LevelAccordion>
          )
        }

        if (isLocked) {
          return (
            <div key={lv} className="hy-section" style={{ opacity: 0.25 }}>
              <div className="idx" style={{ fontStyle: 'normal' }}>—</div>
              <div className="t">Level {lv}</div>
              <div className="meta">LOCKED</div>
            </div>
          )
        }

        // Active level — show categories
        if (cats.length === 0) return null
        return (
          <div key={lv}>
            <div className="hy-section">
              <div className="idx" style={{ fontStyle: 'normal' }}>Lv.{lv}</div>
              <div className="t">Level {lv}</div>
              <div className="meta">{stat.done}/{stat.total}</div>
            </div>
            {cats.map(c => (
              <CategoryRow key={c.id} cat={c} isWeak={false} />
            ))}
          </div>
        )
      })}

      <div style={{
        padding: '20px 20px 16px',
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.6,
      }}>
        各カードは30秒。<br />
        苦手は自動で上に並びます。
      </div>

      <div className="px-4 pb-6">
        <AiTeacherChat context={{ pageType: 'lesson' }} />
      </div>
    </main>
  )
}

function CategoryRow({ cat, isWeak }: {
  cat: { id: string; title: string; words: string; done: number; cards: { id: string }[] }
  isWeak: boolean
}) {
  const p = cat.cards.length > 0 ? Math.round((cat.done / cat.cards.length) * 100) : 0
  return (
    <Link
      href={`/lesson/${cat.id}`}
      style={{
        display: 'block',
        width: '100%',
        textDecoration: 'none',
        background: 'transparent',
        padding: '16px 20px',
        borderBottom: '1px solid var(--rule-soft)',
      }}
    >
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', gap: 12, marginBottom: 8,
      }}>
        <div style={{
          fontFamily: 'var(--display)', fontWeight: 500, fontSize: 16,
          color: 'var(--ink)', letterSpacing: '-0.015em',
        }}>
          {cat.title}
        </div>
        {isWeak
          ? <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-2)',
              padding: '2px 6px', border: '1px solid var(--rule-soft)',
            }}>要復習</span>
          : <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>
              <em style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 500 }}>{cat.done}</em> / {cat.cards.length}
            </span>
        }
      </div>
      <div style={{
        fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12.5,
        color: 'var(--ink-3)', letterSpacing: '-0.005em', marginBottom: 10,
      }}>
        {cat.words}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
        <div style={{ height: 2, background: 'var(--ink-4)', opacity: 0.3, position: 'relative', borderRadius: 1 }}>
          <div style={{
            position: 'absolute', inset: 0, width: `${p}%`,
            background: '#8B1A2E', borderRadius: 1,
          }} />
        </div>
        {isWeak && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>
            <em style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 500 }}>{cat.done}</em> / {cat.cards.length}
          </span>
        )}
      </div>
    </Link>
  )
}
