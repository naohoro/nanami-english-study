import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { passageHtml, questionText, correctLabel, choices } = await req.json()
  const correctChoice = choices?.find((c: { label: string; text: string }) => c.label === correctLabel)
  const correctText = correctChoice?.text ?? ''

  const Anthropic = require('@anthropic-ai/sdk')
  const client = new Anthropic.default()

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `以下の英語問題文を読んで、設問の正解の根拠となる文（1〜2文）を特定してください。

問題文：
${passageHtml}

設問：${questionText}
正解：${correctLabel}. ${correctText}

以下のJSON形式のみで返してください：
{
  "keyText": "問題文中の根拠となる文の完全な英文（HTMLタグなし・改行なし・問題文に出てくる通りの文字列）",
  "keyJapanese": "その文の自然な日本語訳"
}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch?.[0] ?? '{}')
    return NextResponse.json({
      keyText: parsed.keyText ?? '',
      keyJapanese: parsed.keyJapanese ?? '',
    })
  } catch {
    return NextResponse.json({ keyText: '', keyJapanese: '' })
  }
}
