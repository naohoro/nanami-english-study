import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase'
import { LESSON_CATEGORIES, LESSON_TOTAL } from '@/lib/lesson-data'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import type { BossConfig } from '@/lib/types'

interface LessonRow { lesson_id: string; category_id: string; understood: boolean; completed_at: string | null }
interface SessionRow { boss_type: string; result: string; created_at: string | null; difficulty: number }
interface MasteryRow { boss_type: string; status: string; cleared_at: string | null; attempt_count: number }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!ADMIN_EMAILS.includes(user.email ?? '')) redirect('/')

  const service = createServiceClient()

  const [lessonRes, sessionRes, masteryRes] = await Promise.all([
    service.from('lesson_progress').select('lesson_id, category_id, understood, completed_at').order('completed_at', { ascending: false }),
    service.from('sessions').select('boss_type, result, created_at, difficulty').order('created_at', { ascending: false }),
    service.from('mastery').select('boss_type, status, cleared_at, attempt_count'),
  ])

  const lessonRows: LessonRow[] = (lessonRes.data ?? []) as LessonRow[]
  const sessionRows: SessionRow[] = (sessionRes.data ?? []) as SessionRow[]
  const masteryRows: MasteryRow[] = (masteryRes.data ?? []) as MasteryRow[]

  // Lesson stats
  const understoodIds = new Set(lessonRows.filter(r => r.understood).map(r => r.lesson_id))
  const failedIds = new Set(lessonRows.filter(r => !r.understood).map(r => r.lesson_id))
  const lessonDone = understoodIds.size
  const lessonPct = LESSON_TOTAL > 0 ? Math.round((lessonDone / LESSON_TOTAL) * 100) : 0

  const categoryStats = LESSON_CATEGORIES.map(cat => {
    const done = cat.cards.filter(c => understoodIds.has(c.id)).length
    const failed = cat.cards.filter(c => failedIds.has(c.id) && !understoodIds.has(c.id)).length
    const isWeak = failed > 0 && (failed / cat.cards.length) > 0.3
    return { ...cat, done, failed, isWeak }
  })

  const maxLevel = Math.max(...categoryStats.map(c => c.level ?? 1), 1)

  // Weak cards: specific cards that were failed and not yet understood
  const weakCards = LESSON_CATEGORIES.flatMap(cat =>
    cat.cards
      .filter(c => failedIds.has(c.id) && !understoodIds.has(c.id))
      .map(c => ({ ...c, categoryTitle: cat.title, level: cat.level ?? 1 }))
  )

  // Study timing from lesson_progress.completed_at
  const lastLessonAt = lessonRows[0]?.completed_at ?? null
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lessonThisWeek = lessonRows.filter(r => r.completed_at && new Date(r.completed_at) >= weekAgo).length
  const studyDays = new Set(
    lessonRows.filter(r => r.completed_at).map(r => new Date(r.completed_at!).toDateString())
  ).size

  // Session stats
  const totalSessions = sessionRows.length
  const clearedSessions = sessionRows.filter(s => s.result === 'cleared').length
  const accuracyPct = totalSessions > 0 ? Math.round((clearedSessions / totalSessions) * 100) : 0
  const recentSessions = sessionRows.slice(0, 8)

  // Most recent activity (lesson or session)
  const lastActivityAt = (() => {
    const a = lastLessonAt ? new Date(lastLessonAt).getTime() : 0
    const b = sessionRows[0]?.created_at ? new Date(sessionRows[0].created_at).getTime() : 0
    const t = Math.max(a, b)
    return t > 0 ? new Date(t).toISOString() : null
  })()

  // Mastery stats
  const masteryMap = new Map(masteryRows.map(m => [m.boss_type, m]))
  const clearedBosses = masteryRows.filter(m => m.status === 'cleared').length
  const totalBosses = Object.keys(BOSS_CONFIGS).length

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Bar */}
      <div className="hy-bar">
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--ink-3)' }}>← HOME</Link>
        <div className="c">ADMIN</div>
        <div className="r" style={{ color: 'var(--ink-4)', fontSize: 9 }}>管理者専用</div>
      </div>

      {/* Hero */}
      <div className="hy-hero">
        <div className="eye">Admin Dashboard · 七海の学習ログ</div>
        <div className="hy-hd">
          学習<br /><em>状況。</em>
        </div>
        <div className="hy-sub">
          Lesson <b>{lessonDone}/{LESSON_TOTAL}</b> ({lessonPct}%) ·{' '}
          Boss <b>{clearedBosses}/{totalBosses}</b> 攻略 ·{' '}
          <b>{totalSessions}</b> セッション
          {lastActivityAt && <> · 最終学習 <b>{fmtDate(lastActivityAt)}</b></>}
        </div>
        <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>
          累計学習日数 <b style={{ color: 'var(--ink)' }}>{studyDays}日</b> ·{' '}
          今週のレッスン <b style={{ color: 'var(--ink)' }}>{lessonThisWeek}枚</b>
        </div>
        <div style={{ marginTop: 14, height: 4, background: 'rgba(0,0,0,0.1)', position: 'relative', borderRadius: 2 }}>
          <div style={{ position: 'absolute', inset: 0, width: `${lessonPct}%`, background: '#8B1A2E', borderRadius: 2 }} />
        </div>
      </div>

      {/* ── 00 苦手カード ───────────────────────────── */}
      {weakCards.length > 0 && (
        <>
          <div className="hy-section">
            <div className="idx">⚑</div>
            <div className="t">苦手カード</div>
            <div className="meta">{weakCards.length} 件</div>
          </div>
          {weakCards.map(card => (
            <div key={card.id} style={{
              padding: '10px 20px',
              borderBottom: '1px solid var(--rule-soft)',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 12,
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
                  {card.word}
                </div>
                <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                  {card.meaningJa}
                </div>
              </div>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)',
                padding: '2px 6px', border: '1px solid var(--rule-soft)', whiteSpace: 'nowrap',
              }}>
                Lv.{card.level} · {card.categoryTitle}
              </span>
            </div>
          ))}
        </>
      )}

      {/* ── 01 Lesson ───────────────────────────────── */}
      <div className="hy-section">
        <div className="idx">01</div>
        <div className="t">Lesson 進捗</div>
        <div className="meta">{lessonDone}/{LESSON_TOTAL} · {lessonPct}%</div>
      </div>

      {Array.from({ length: maxLevel }, (_, i) => i + 1).map(lv => {
        const cats = categoryStats.filter(c => (c.level ?? 1) === lv)
        if (cats.length === 0) return null
        const lvDone = cats.reduce((s, c) => s + c.done, 0)
        const lvTotal = cats.reduce((s, c) => s + c.cards.length, 0)
        // Most recent completed_at for this level
        const lvCardIds = new Set(cats.flatMap(c => c.cards.map(card => card.id)))
        const lvLastAt = lessonRows.find(r => lvCardIds.has(r.lesson_id) && r.completed_at)?.completed_at ?? null
        return (
          <div key={lv}>
            <div style={{
              padding: '7px 20px',
              background: 'var(--paper-2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>
                LEVEL {lv}
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>
                {lvDone}/{lvTotal}{lvLastAt ? ` · ${fmtDate(lvLastAt)}` : ''}
              </span>
            </div>
            {cats.map(cat => {
              const pct = cat.cards.length > 0 ? Math.round((cat.done / cat.cards.length) * 100) : 0
              return (
                <div key={cat.id} style={{
                  padding: '11px 20px',
                  borderBottom: '1px solid var(--rule-soft)',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: 12,
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 14, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                      {cat.title}
                    </div>
                    <div style={{ marginTop: 6, height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 1, position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: '#8B1A2E', borderRadius: 1 }} />
                    </div>
                  </div>
                  {cat.isWeak && (
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-2)', padding: '2px 5px', border: '1px solid var(--rule-soft)' }}>
                      要復習
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
                    <em style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 500 }}>{cat.done}</em>/{cat.cards.length}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}

      {/* ── 02 Boss ─────────────────────────────────── */}
      <div className="hy-section">
        <div className="idx">02</div>
        <div className="t">Boss 攻略状況</div>
        <div className="meta">{clearedBosses}/{totalBosses} · 正解率 {accuracyPct}%</div>
      </div>

      {(Object.values(BOSS_CONFIGS) as BossConfig[]).map(boss => {
        const m = masteryMap.get(boss.type)
        const status = m?.status ?? 'untouched'
        const label = status === 'cleared' ? '✓ 攻略済' : status === 'in_progress' ? '進行中' : '未挑戦'
        const color = status === 'cleared' ? 'var(--ok)' : status === 'in_progress' ? 'var(--accent-2)' : 'var(--ink-4)'
        return (
          <div key={boss.type} style={{
            padding: '11px 20px',
            borderBottom: '1px solid var(--rule-soft)',
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: 12,
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 14, color: 'var(--ink)' }}>{boss.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-4)', marginTop: 2 }}>
                Section {boss.section} · {boss.points}点
              </div>
            </div>
            {m?.cleared_at && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)' }}>
                {fmtDate(m.cleared_at)}
              </span>
            )}
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color, minWidth: 52, textAlign: 'right' }}>
              {label}
            </span>
          </div>
        )
      })}

      {/* ── 03 Recent Sessions ──────────────────────── */}
      <div className="hy-section">
        <div className="idx">03</div>
        <div className="t">直近のセッション</div>
        <div className="meta">直近 {recentSessions.length} 件</div>
      </div>

      {recentSessions.length === 0 ? (
        <div style={{ padding: '16px 20px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-4)' }}>
          セッション記録なし
        </div>
      ) : recentSessions.map((s, i) => {
        const bossName = BOSS_CONFIGS[s.boss_type]?.name ?? s.boss_type
        const isCleared = s.result === 'cleared'
        return (
          <div key={i} style={{
            padding: '10px 20px',
            borderBottom: '1px solid var(--rule-soft)',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 12,
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink)' }}>{bossName}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-4)', marginTop: 2 }}>
                Lv.{s.difficulty} · {s.created_at ? fmtDate(s.created_at) : '—'}
              </div>
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: isCleared ? 'var(--ok)' : 'var(--danger)' }}>
              {isCleared ? '✓ CLEAR' : '✗ FAIL'}
            </span>
          </div>
        )
      })}

      <div style={{ padding: '20px 20px 48px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.6 }}>
        このページは ADMIN_EMAILS に登録されたアカウントのみ閲覧できます。
      </div>
    </main>
  )
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
