import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import type { Mastery, BossType } from '@/lib/types'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: masteryRows } = await supabase
    .from('mastery')
    .select('*')
    .eq('user_id', user.id)

  // 全ボスに対してステータスをマージ（DBにない = untouched）
  const allBossTypes = Object.keys(BOSS_CONFIGS) as BossType[]
  const masteryMap = new Map(masteryRows?.map((r) => [r.boss_type, r]) ?? [])

  const result: Mastery[] = allBossTypes.map((bossType) => {
    const row = masteryMap.get(bossType)
    return {
      userId: user.id,
      bossType,
      status: row?.status ?? 'untouched',
      clearedAt: row?.cleared_at ?? null,
      attemptCount: row?.attempt_count ?? 0,
    }
  })

  return NextResponse.json(result)
}
