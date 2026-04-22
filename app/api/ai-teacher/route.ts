import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { AiTeacherContext, ChatMessage } from '@/lib/types'

const VALID_PAGE_TYPES = ['problem', 'map', 'general'] as const

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function buildSystemPrompt(context: AiTeacherContext, recentLogs: string[]): string {
  const base = `あなたは「AI先生」です。共通テスト英語を勉強している高校生をサポートします。
必ず日本語で答えてください。250文字以内で簡潔に答えてください。
答えを直接教えるのではなく、考え方のヒントを与えてください。
【絶対禁止】マークダウン記法（**太字**・番号リスト・箇条書き・見出し等）は使わない。絵文字も使わない。名前で呼びかけない。普通の会話文で書く。`

  const logSection = recentLogs.length > 0
    ? `\n\nこの生徒の最近の学習メモ:\n${recentLogs.map(l => `- ${l}`).join('\n')}`
    : ''

  if (context.pageType === 'problem' && context.passageHtml) {
    const passage = stripHtml(context.passageHtml)
    const question = context.questionText ? `\n設問: ${context.questionText}` : ''
    return `${base}${logSection}\n\n今取り組んでいる問題:\n本文: ${passage.slice(0, 800)}${question}`
  }

  return `${base}${logSection}\n\n今は共通テスト英語の学習マップページにいます。共通テスト英語全般について答えてください。`
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { messages, context }: { messages: ChatMessage[]; context: AiTeacherContext } = body

  if (!messages || !Array.isArray(messages) || !context || !VALID_PAGE_TYPES.includes(context.pageType)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  const { data: logs } = await supabase
    .from('ai_teacher_logs')
    .select('summary, boss_type')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const recentLogs = (logs ?? []).map((l: { summary: string; boss_type: string | null }) =>
    l.boss_type ? `${l.boss_type}: ${l.summary}` : l.summary
  )

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: buildSystemPrompt(context, recentLogs),
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: 'AI先生の応答に失敗しました' }, { status: 500 })
  }
}
