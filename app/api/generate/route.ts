import { NextRequest, NextResponse } from 'next/server'
import { generateProblem } from '@/lib/claude'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { BossType, ProblemTheme, ProblemMode } from '@/lib/types'

const VALID_BOSS_TYPES = ['outline', 'email'] as const
const VALID_THEMES = ['travel', 'technology', 'environment', 'community', 'daily_life', 'business'] as const
const VALID_MODES = ['answer_first', 'challenge'] as const

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { bossType, difficulty, theme, mode } = body

  if (
    !VALID_BOSS_TYPES.includes(bossType) ||
    !VALID_THEMES.includes(theme) ||
    !VALID_MODES.includes(mode) ||
    typeof difficulty !== 'number' ||
    difficulty < 1 ||
    difficulty > 5
  ) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  try {
    const problemData = await generateProblem({
      bossType: bossType as BossType,
      difficulty,
      theme: theme as ProblemTheme,
      mode: mode as ProblemMode,
    })

    const problem = {
      id: crypto.randomUUID(),
      bossType,
      theme,
      difficulty,
      mode,
      ...problemData,
    }

    return NextResponse.json(problem)
  } catch (error) {
    console.error('Problem generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate problem' },
      { status: 500 }
    )
  }
}
