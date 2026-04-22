import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { lessonId, categoryId, understood } = await req.json()
    if (!lessonId || !categoryId || understood === undefined) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    await supabase.from('lesson_progress').insert({
      user_id: user.id,
      lesson_id: lessonId,
      category_id: categoryId,
      understood,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
