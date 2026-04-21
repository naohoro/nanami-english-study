import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { BossType } from '@/lib/types'

const VALID_BOSS_TYPES = ['outline', 'email'] as const

export async function PATCH(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bossType, difficulty } = await req.json()

  if (!bossType || !(VALID_BOSS_TYPES as readonly string[]).includes(bossType)) {
    return NextResponse.json({ error: 'Invalid bossType' }, { status: 400 })
  }
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
    return NextResponse.json({ error: 'difficulty must be 1–5' }, { status: 400 })
  }

  const { error } = await supabase
    .from('difficulty_state')
    .upsert(
      { user_id: user.id, boss_type: bossType as BossType, current_difficulty: difficulty, consecutive_failures: 0 },
      { onConflict: 'user_id,boss_type' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ difficulty })
}
