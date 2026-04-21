import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { passageHtml, choices } = await req.json()
  if (!passageHtml || typeof passageHtml !== 'string') {
    return NextResponse.json({ error: 'passageHtml required' }, { status: 400 })
  }

  const Anthropic = require('@anthropic-ai/sdk')
  const client = new Anthropic.default()

  const choicesText = choices
    ? `\n\n選択肢も日本語に訳してください：\n${choices.map((c: { label: string; text: string }) => `${c.label}. ${c.text}`).join('\n')}`
    : ''

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `以下を高校3年生にわかりやすい日本語に翻訳してください。
HTMLタグは取り除いて段落ごとに改行してください。説明や前置きは不要です。
必ず以下のJSON形式のみで返してください：

{
  "japanese": "本文の日本語訳（段落ごとに改行）",
  "choices": {"A": "Aの訳", "B": "Bの訳", "C": "Cの訳", "D": "Dの訳"}
}

本文：
${passageHtml}${choicesText}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch?.[0] ?? '{}')
    return NextResponse.json({
      japanese: parsed.japanese ?? '',
      choices: parsed.choices ?? null,
    })
  } catch {
    return NextResponse.json({ japanese: text, choices: null })
  }
}
