import { NextRequest, NextResponse } from 'next/server'
import { getSupportMessage } from '@/lib/claude'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { WakaranaiCause } from '@/lib/types'

const VALID_CAUSES = ['vocabulary', 'structure', 'background', 'question', 'unknown'] as const

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { cause, passageHtml, questionText } = body

  if (!VALID_CAUSES.includes(cause) || typeof passageHtml !== 'string' || typeof questionText !== 'string') {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  try {
    const message = await getSupportMessage({
      cause: cause as WakaranaiCause,
      passageHtml,
      questionText,
    })
    return NextResponse.json({ message })
  } catch {
    return NextResponse.json({ error: 'サポートの取得に失敗しました' }, { status: 500 })
  }
}
