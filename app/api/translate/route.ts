import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getSupportMessage } from '@/lib/claude'

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { passageHtml } = await req.json()
  if (!passageHtml || typeof passageHtml !== 'string') {
    return NextResponse.json({ error: 'passageHtml required' }, { status: 400 })
  }

  const Anthropic = require('@anthropic-ai/sdk')
  const client = new Anthropic.default()

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `以下の英語の文章を、高校3年生にわかりやすい日本語に翻訳してください。
HTMLタグは取り除いて、段落ごとに改行して出力してください。翻訳のみを出力し、説明や前置きは不要です。

${passageHtml}`,
      },
    ],
  })

  const japanese = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ japanese })
}
