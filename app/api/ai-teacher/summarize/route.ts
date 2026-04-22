import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { AiTeacherContext, ChatMessage } from '@/lib/types'

const VALID_PAGE_TYPES = ['problem', 'map', 'general'] as const

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { messages, context }: { messages: ChatMessage[]; context: AiTeacherContext } = body

  if (!messages || messages.length < 2 || !context || !VALID_PAGE_TYPES.includes(context.pageType)) {
    return NextResponse.json({ ok: true })
  }

  const transcript = messages
    .map(m => `${m.role === 'user' ? '生徒' : 'AI先生'}: ${m.content}`)
    .join('\n')

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      system: '以下の会話を1〜2文の日本語で要約してください。生徒が何を理解できたか・何がまだ難しいかを中心に。',
      messages: [{ role: 'user', content: transcript }],
    })

    const summary = response.content[0].type === 'text' ? response.content[0].text : ''
    if (!summary) return NextResponse.json({ ok: true })

    await supabase.from('ai_teacher_logs').insert({
      user_id: user.id,
      page_type: context.pageType,
      boss_type: context.bossType ?? null,
      summary,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
