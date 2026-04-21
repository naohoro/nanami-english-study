import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { MapCard } from '@/components/map/MapCard'
import { ProgressBanner } from '@/components/map/ProgressBanner'
import type { Mastery, BossType } from '@/lib/types'

async function getMasteries(): Promise<{ masteries: Mastery[]; onboardingDone: boolean }> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const onboardingDone = !!user.user_metadata?.onboarding_done

  const { data } = await supabase
    .from('mastery')
    .select('*')
    .eq('user_id', user.id)

  const allBossTypes = Object.keys(BOSS_CONFIGS) as BossType[]
  const masteryMap = new Map(data?.map((r: { boss_type: string; status: string; cleared_at: string | null; attempt_count: number }) => [r.boss_type, r]) ?? [])

  const masteries = allBossTypes.map((bossType) => {
    const row = masteryMap.get(bossType)
    return {
      userId: user.id,
      bossType,
      status: (row?.status ?? 'untouched') as Mastery['status'],
      clearedAt: row?.cleared_at ?? null,
      attemptCount: row?.attempt_count ?? 0,
    }
  })

  return { masteries, onboardingDone }
}

export default async function MapPage() {
  const { masteries, onboardingDone } = await getMasteries()

  if (!onboardingDone) redirect('/onboarding')

  const masteryMap = new Map(masteries.map((m) => [m.bossType, m.status]))

  return (
    <main className="flex-1 p-4 space-y-4">
      <div className="pt-6 pb-2">
        <p className="text-xs font-bold tracking-widest mb-1" style={{ color: 'var(--burgundy)' }}>共通テスト英語 完全対策</p>
        <h1 className="text-2xl font-black" style={{ color: '#1A1A1A' }}>どの型の問題を攻略する？</h1>
        <p className="text-sm mt-1" style={{ color: '#787878' }}>配点が大きい順に並んでいるよ</p>
      </div>

      <ProgressBanner masteries={masteries} />

      <div className="space-y-3">
        {Object.values(BOSS_CONFIGS).map((boss) => (
          <MapCard
            key={boss.type}
            boss={boss}
            status={masteryMap.get(boss.type) ?? 'untouched'}
          />
        ))}
      </div>
    </main>
  )
}
