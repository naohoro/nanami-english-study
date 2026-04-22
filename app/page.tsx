import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { HybridBar } from '@/components/map/HybridBar'
import { ProgressBanner } from '@/components/map/ProgressBanner'
import { BossCard } from '@/components/map/BossCard'
import { AiTeacherChat } from '@/components/ai-teacher/AiTeacherChat'
import { LessonEntryCard } from '@/components/lesson/LessonEntryCard'
import { LESSON_CATEGORIES } from '@/lib/lesson-data'
import type { BossType, MasteryStatus } from '@/lib/types'

async function getPageData() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (!user.user_metadata?.onboarding_done) redirect('/onboarding')

  const [masteryResult, profileResult, sessionResult, difficultyResult, lessonResult] = await Promise.all([
    supabase.from('mastery').select('*').eq('user_id', user.id),
    supabase.from('profiles').select('exam_date, study_started_at').eq('user_id', user.id).single(),
    supabase.from('sessions').select('result').eq('user_id', user.id),
    supabase.from('difficulty_state').select('boss_type, current_difficulty').eq('user_id', user.id),
    supabase.from('lesson_progress').select('lesson_id, understood').eq('user_id', user.id),
  ])

  const masteryMap = new Map(
    masteryResult.data?.map((r: { boss_type: string; status: string }) => [r.boss_type, r.status]) ?? []
  )

  const levelMap = new Map(
    difficultyResult.data?.map((r: { boss_type: string; current_difficulty: number }) => [r.boss_type, r.current_difficulty]) ?? []
  )

  const sessions = sessionResult.data ?? []
  const cleared = sessions.filter((s: { result: string }) => s.result === 'cleared').length
  const total = sessions.length
  const accuracyPct = total > 0 ? Math.round((cleared / total) * 100) : 0
  const clearedBossCount = [...masteryMap.values()].filter((v) => v === 'cleared').length

  const lessonRows = lessonResult.data ?? []
  const understoodIds = new Set(lessonRows.filter(r => r.understood).map(r => r.lesson_id))
  const failedIds = new Set(lessonRows.filter(r => !r.understood).map(r => r.lesson_id))
  const lessonDone = understoodIds.size
  const lessonNeedsReview = [...failedIds].some(id => !understoodIds.has(id))

  return {
    masteryMap,
    levelMap,
    examDate: profileResult.data?.exam_date ?? null,
    studyStartedAt: profileResult.data?.study_started_at ?? user.created_at,
    stats: { accuracyPct, clearedBossCount, totalMinutes: 0, streakDays: 1 },
    lessonDone,
    lessonNeedsReview,
  }
}

export default async function MapPage() {
  const { masteryMap, levelMap, examDate, studyStartedAt, stats, lessonDone, lessonNeedsReview } = await getPageData()

  const bosses = Object.values(BOSS_CONFIGS)

  return (
    <>
      <HybridBar studyStartedAt={studyStartedAt} examDate={examDate ?? undefined} />
      <main className="flex-1">
        <ProgressBanner stats={stats} />

        {/* about strip */}
        <Link
          href="/about"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)',
            background: 'var(--ink)',
            color: 'var(--paper)',
            textDecoration: 'none',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.06em' }}>ABOUT THIS APP</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, marginTop: 3 }}>共通テスト英語の攻略データを見る</div>
          </div>
          <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 18, color: 'var(--accent-2)' }}>→</span>
        </Link>

        <LessonEntryCard done={lessonDone} total={LESSON_CATEGORIES.reduce((s, c) => s + c.cards.length, 0)} needsReview={lessonNeedsReview} />

        <div>
          {bosses.map((boss) => {
            const raw = masteryMap.get(boss.type)
            const status =
              raw === 'cleared' ? 'cleared'
              : raw === 'in_progress' ? 'in-progress'
              : 'available'

            return (
              <BossCard
                key={boss.type}
                index={boss.section}
                type={boss.type as BossType}
                name={boss.name}
                points={boss.points}
                trickSummary={boss.trickSteps[0] ?? ''}
                status={status}
                level={levelMap.get(boss.type) ?? 1}
              />
            )
          })}
        </div>

        {/* AI先生チャット — Map全般の質問用 */}
        <div className="px-4 pb-6 mt-2">
          <AiTeacherChat context={{ pageType: 'map' }} />
        </div>
      </main>
    </>
  )
}
