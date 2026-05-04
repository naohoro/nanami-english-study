import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { LESSON_TOTAL } from '@/lib/lesson-data'
import { HybridBar } from '@/components/map/HybridBar'
import { TodaySection } from '@/components/map/TodaySection'
import { BossCard } from '@/components/map/BossCard'
import { AiTeacherChat } from '@/components/ai-teacher/AiTeacherChat'
import type { BossType } from '@/lib/types'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)

type LessonRow = { lesson_id: string; understood: boolean; completed_at: string | null }
type Mission = { label: string; sub: string; href: string }

async function getPageData() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (!user.user_metadata?.onboarding_done) redirect('/onboarding')
  if (ADMIN_EMAILS.includes(user.email ?? '')) redirect('/admin')

  const [masteryResult, profileResult, difficultyResult, lessonResult] = await Promise.all([
    supabase.from('mastery').select('*').eq('user_id', user.id),
    supabase.from('profiles').select('exam_date, study_started_at').eq('user_id', user.id).single(),
    supabase.from('difficulty_state').select('boss_type, current_difficulty').eq('user_id', user.id),
    supabase.from('lesson_progress').select('lesson_id, understood, completed_at').eq('user_id', user.id),
  ])

  const masteryMap = new Map(
    masteryResult.data?.map((r: { boss_type: string; status: string }) => [r.boss_type, r.status]) ?? []
  )
  const levelMap = new Map(
    difficultyResult.data?.map((r: { boss_type: string; current_difficulty: number }) => [r.boss_type, r.current_difficulty]) ?? []
  )

  const lessonRows: LessonRow[] = lessonResult.data ?? []

  // 今日の枚数
  const todayStr = new Date().toDateString()
  const todayLessonCount = lessonRows.filter(r =>
    r.completed_at && new Date(r.completed_at).toDateString() === todayStr
  ).length

  // 連続学習日数
  const studyDays = [...new Set(
    lessonRows.filter(r => r.completed_at).map(r => new Date(r.completed_at!).toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  const now = new Date()
  let streakDays = 0
  for (let i = 0; i < studyDays.length; i++) {
    const expected = new Date(now)
    expected.setDate(now.getDate() - i)
    if (studyDays[i] === expected.toDateString()) streakDays++
    else break
  }

  // 苦手カード
  const understoodIds = new Set(lessonRows.filter(r => r.understood).map(r => r.lesson_id))
  const failedIds = new Set(lessonRows.filter(r => !r.understood).map(r => r.lesson_id))
  const weakCardCount = [...failedIds].filter(id => !understoodIds.has(id)).length
  const lessonDone = understoodIds.size

  // 今日のミッション（優先度順に1つ）
  let todayMission: Mission
  if (weakCardCount > 0) {
    todayMission = { label: '苦手カードを復習しよう', sub: `${weakCardCount}枚の苦手カードあり`, href: '/lesson' }
  } else {
    const inProgressBoss = Object.values(BOSS_CONFIGS).find(b => masteryMap.get(b.type) === 'in_progress')
    if (inProgressBoss) {
      todayMission = { label: `${inProgressBoss.name}を続けよう`, sub: '途中のボス戦', href: `/boss/${inProgressBoss.type}` }
    } else if (lessonDone < LESSON_TOTAL) {
      todayMission = { label: 'レッスンを続けよう', sub: `${lessonDone}/${LESSON_TOTAL}枚完了`, href: '/lesson' }
    } else {
      const nextBoss = Object.values(BOSS_CONFIGS).find(b => {
        const s = masteryMap.get(b.type)
        return !s || s === 'untouched'
      })
      todayMission = nextBoss
        ? { label: `${nextBoss.name}に挑戦！`, sub: '次のボス戦', href: `/boss/${nextBoss.type}` }
        : { label: 'レッスンを続けよう', sub: '', href: '/lesson' }
    }
  }

  // ボスを status 優先でソート: in_progress → available → cleared
  const statusOrder = (s: string | undefined) => s === 'in_progress' ? 0 : s === 'cleared' ? 2 : 1
  const sortedBosses = Object.values(BOSS_CONFIGS).slice().sort((a, b) =>
    statusOrder(masteryMap.get(a.type)) - statusOrder(masteryMap.get(b.type))
  )

  return {
    masteryMap,
    levelMap,
    examDate: profileResult.data?.exam_date ?? null,
    studyStartedAt: profileResult.data?.study_started_at ?? user.created_at,
    todayLessonCount,
    streakDays,
    todayMission,
    sortedBosses,
  }
}

export default async function MapPage() {
  const { masteryMap, levelMap, examDate, studyStartedAt, todayLessonCount, streakDays, todayMission, sortedBosses } =
    await getPageData()

  return (
    <>
      <HybridBar studyStartedAt={studyStartedAt} examDate={examDate ?? undefined} />
      <main className="flex-1">
        <TodaySection
          todayCount={todayLessonCount}
          streakDays={streakDays}
          mission={todayMission}
        />

        <div>
          {sortedBosses.map((boss) => {
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

        <div className="px-4 pb-6 mt-2">
          <AiTeacherChat context={{ pageType: 'map' }} />
        </div>
      </main>
    </>
  )
}
