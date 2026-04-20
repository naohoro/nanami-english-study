import { NextRequest, NextResponse } from 'next/server'
import { generateProblem } from '@/lib/claude'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { BossType, ProblemTheme, ProblemMode } from '@/lib/types'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { bossType, difficulty, theme, mode } = body as {
    bossType: BossType
    difficulty: number
    theme: ProblemTheme
    mode: ProblemMode
  }

  try {
    const problemData = await generateProblem({ bossType, difficulty, theme, mode })

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
