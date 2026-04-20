import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { BossType, ProblemTheme, ProblemMode, SessionResult, WakaranaiCause, GeneratedProblem } from '@/lib/types'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    bossType: BossType
    difficulty: number
    theme: ProblemTheme
    mode: ProblemMode
    generatedQuestion: GeneratedProblem
    result: SessionResult
    wakaranaiCause?: WakaranaiCause
    resolved?: boolean
  }

  const { error, data } = await supabase.from('sessions').insert({
    user_id: user.id,
    boss_type: body.bossType,
    difficulty: body.difficulty,
    theme: body.theme,
    mode: body.mode,
    generated_question: body.generatedQuestion,
    result: body.result,
    wakaranai_cause: body.wakaranaiCause ?? null,
    resolved: body.resolved ?? false,
  }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // マスターコースでclearedなら攻略状態を更新
  if (body.mode === 'challenge' && body.result === 'cleared') {
    await supabase.from('mastery').upsert({
      user_id: user.id,
      boss_type: body.bossType,
      status: 'cleared',
      cleared_at: new Date().toISOString(),
    }, { onConflict: 'user_id,boss_type' })
  } else {
    // 初回プレイ時はin_progressにする（既にclearedなら更新しない）
    const { data: existing } = await supabase
      .from('mastery')
      .select('status')
      .eq('user_id', user.id)
      .eq('boss_type', body.bossType)
      .single()

    if (!existing || existing.status === 'untouched') {
      await supabase.from('mastery').upsert({
        user_id: user.id,
        boss_type: body.bossType,
        status: 'in_progress',
      }, { onConflict: 'user_id,boss_type' })
    }
  }

  return NextResponse.json(data)
}
