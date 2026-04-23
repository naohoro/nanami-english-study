import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { AiTeacherContext, ChatMessage } from '@/lib/types'

const VALID_PAGE_TYPES = ['problem', 'map', 'general', 'lesson'] as const

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const EXAM_FORMAT = `【共通テスト英語リーディングの出題形式（2021〜2026年度）】
発音・アクセント問題はセンター試験の形式であり、共通テストには存在しない。
第1問（short_text）: お知らせ・チラシ・メモなどの短い実用文。設問は内容一致や目的把握。
第2問（survey_blog）: Webアンケート・ブログ・複数の短文。情報を比較・整理する問題。
第3問（short_story）: 出来事の順序・因果関係を問う短い物語。
第4問（essay_edit）: 英文エッセイの図表・要約・穴埋め。
第5問（multi_doc）: 複数の文書を読み比べる問題。
第6問（long_story）: 長めの物語・エッセイ。
第7問（article_slides）: 記事とスライドの組み合わせ。スライドの空欄補充が中心。
第8問（essay_synthesis）: 複数の意見文を統合して自分の意見を判断する最高難度の大問。`

function buildSystemPrompt(context: AiTeacherContext, recentLogs: string[]): string {
  const base = `あなたは「AI先生」です。共通テスト英語を勉強している高校生をサポートします。
必ず日本語で答えてください。250文字以内で簡潔に答えてください。
答えを直接教えるのではなく、考え方のヒントを与えてください。
【絶対禁止】マークダウン記法（**太字**・番号リスト・箇条書き・見出し等）は使わない。絵文字も使わない。名前で呼びかけない。普通の会話文で書く。

${EXAM_FORMAT}`

  const logSection = recentLogs.length > 0
    ? `\n\nこの生徒の最近の学習メモ:\n${recentLogs.map(l => `- ${l}`).join('\n')}`
    : ''

  if (context.pageType === 'problem' && context.passageHtml) {
    const passage = stripHtml(context.passageHtml)
    const question = context.questionText ? `\n設問: ${context.questionText}` : ''
    const section = context.bossType ? `\n取り組んでいる大問: ${context.bossType}` : ''
    return `${base}${logSection}${section}\n\n今取り組んでいる問題:\n本文: ${passage.slice(0, 800)}${question}`
  }

  if (context.pageType === 'problem' && context.bossType) {
    return `${base}${logSection}\n\n今学習している大問: ${context.bossType}。この大問の解き方や特徴について質問に答えてください。`
  }

  if (context.pageType === 'lesson') {
    const catInfo = context.categoryTitle
      ? `「${context.categoryTitle}」カテゴリ`
      : 'LESSSONカード'
    return `${base}${logSection}\n\n今は${catInfo}で語彙・表現を学んでいます。単語の意味・使い方・共通テストでの出題パターンについて答えてください。`
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
