import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { BossType, GeneratedProblem } from '@/lib/types'

const VALID_BOSS_TYPES = ['short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'] as const

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bossType = new URL(request.url).searchParams.get('bossType') as BossType | null
  if (!bossType || !(VALID_BOSS_TYPES as readonly string[]).includes(bossType)) {
    return NextResponse.json({ error: 'Invalid bossType' }, { status: 400 })
  }

  // Read user's current adaptive difficulty (default 3 = standard)
  const { data: diffState } = await supabase
    .from('difficulty_state')
    .select('current_difficulty')
    .eq('user_id', user.id)
    .eq('boss_type', bossType)
    .single()

  const difficulty = diffState?.current_difficulty ?? 3

  // Fetch all matching sample problems, pick one at random
  const { data: problems, error } = await supabase
    .from('sample_problems')
    .select('*')
    .eq('boss_type', bossType)
    .eq('difficulty', difficulty)

  if (error || !problems?.length) {
    return NextResponse.json({ error: 'No sample problems found for this difficulty' }, { status: 404 })
  }

  const row = problems[Math.floor(Math.random() * problems.length)]

  const problem: GeneratedProblem = {
    id: row.id,
    bossType: row.boss_type,
    theme: row.theme,
    difficulty: row.difficulty,
    mode: 'answer_first',
    passageHtml: row.passage_html,
    questionText: row.question_text,
    choices: row.choices,
    correctLabel: row.correct_label,
    explanation: row.explanation ?? null,
    trickHint: row.trick_hint ?? null,
  }

  return NextResponse.json(problem)
}
