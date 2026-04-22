import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { HybridBar } from '@/components/map/HybridBar'
import { ProgressBanner } from '@/components/map/ProgressBanner'
import { BossCard } from '@/components/map/BossCard'
import type { BossType, MasteryStatus } from '@/lib/types'

async function getPageData() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (!user.user_metadata?.onboarding_done) redirect('/onboarding')

  const [masteryResult, profileResult, sessionResult] = await Promise.all([
    supabase.from('mastery').select('*').eq('user_id', user.id),
    supabase.from('profiles').select('exam_date, study_started_at').eq('user_id', user.id).single(),
    supabase.from('sessions').select('result').eq('user_id', user.id),
  ])

  const masteryMap = new Map(
    masteryResult.data?.map((r: { boss_type: string; status: string }) => [r.boss_type, r.status]) ?? []
  )

  const sessions = sessionResult.data ?? []
  const cleared = sessions.filter((s: { result: string }) => s.result === 'cleared').length
  const total = sessions.length
  const accuracyPct = total > 0 ? Math.round((cleared / total) * 100) : 0
  const clearedBossCount = [...masteryMap.values()].filter((v) => v === 'cleared').length

  return {
    masteryMap,
    examDate: profileResult.data?.exam_date ?? null,
    studyStartedAt: profileResult.data?.study_started_at ?? user.created_at,
    stats: { accuracyPct, clearedBossCount, totalMinutes: 0, streakDays: 1 },
  }
}

export default async function MapPage() {
  const { masteryMap, examDate, studyStartedAt, stats } = await getPageData()

  const bosses = Object.values(BOSS_CONFIGS)

  return (
    <>
      <HybridBar studyStartedAt={studyStartedAt} examDate={examDate ?? undefined} />
      <main className="flex-1">
        <ProgressBanner stats={stats} />

        <div style={{ borderTop: '1px solid var(--rule)' }}>
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
              />
            )
          })}
        </div>

        {/* about footer link */}
        <div style={{ borderTop: '1px solid var(--rule-soft)', padding: '16px 20px', display: 'flex', justifyContent: 'center' }}>
          <Link
            href="/about"
            style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', textDecoration: 'none', letterSpacing: '0.05em' }}
          >
            共通テストについて → ABOUT
          </Link>
        </div>
      </main>
    </>
  )
}
