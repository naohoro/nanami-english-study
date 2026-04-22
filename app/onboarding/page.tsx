'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const slides = [
  {
    stepLabel: 'WELCOME, STEP I OF III',
    headingA: 'Answer ',
    headingAItalic: 'first.',
    headingB: 'Understand ',
    headingBItalic: 'second.',
    body: 'このアプリは「答えを先に見る」学習法。\n暗記や単語帳ではなく、答えから逆算して「なぜそうなのか」を理解する。\n\n共通テスト英語は、型を知れば6割は取れる。',
    bold: ['答えから逆算して', '型を知れば'],
  },
  {
    stepLabel: 'STEP II OF III',
    headingA: 'High-value\n',
    headingAItalic: 'questions first.',
    headingB: '',
    headingBItalic: '',
    body: '第8問は17点。ここを確実に取れると英語全体の点数が大きく変わる。\n\nだから、このアプリは点数の大きな問題から始める。効率が違う。',
    bold: [],
  },
  {
    stepLabel: 'STEP III OF III',
    headingA: 'Simple.\n',
    headingAItalic: 'Three steps.',
    headingB: '',
    headingBItalic: '',
    steps: ['答えと解説を先に見る', '「なるほど！」と思えたら', '自力でやってみる'],
    body: 'できた、という体験が積み重なる。\nそれだけ。',
    bold: [],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [finishing, setFinishing] = useState(false)

  const slide = slides[current]
  const isLast = current === slides.length - 1

  async function handleNext() {
    if (!isLast) {
      setCurrent(current + 1)
      return
    }
    setFinishing(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      await Promise.all([
        supabase.auth.updateUser({ data: { onboarding_done: true } }),
        user && supabase.from('profiles').upsert({
          user_id: user.id,
          exam_date: '2027-01-16',
          study_started_at: new Date().toISOString(),
          onboarding_done: true,
        }, { onConflict: 'user_id' }),
      ])
    } finally {
      router.push('/')
    }
  }

  return (
    <main className="flex-1 flex flex-col justify-between" style={{ padding: '2rem 1.75rem 2rem' }}>
      {/* Progress bar */}
      <div className="flex gap-1.5">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 transition-all"
            style={{ background: i <= current ? 'var(--ink)' : 'var(--rule-soft)' }}
          />
        ))}
      </div>

      {/* Step label */}
      <p className="text-xs tracking-widest mt-6" style={{ color: 'var(--accent)', letterSpacing: '0.12em', fontFamily: 'var(--sans)' }}>
        {slide.stepLabel}
      </p>

      {/* Headline */}
      <div style={{ marginTop: '1.25rem', flex: 1 }}>
        <h1 className="display" style={{ fontSize: 'clamp(1.9rem, 8vw, 2.6rem)', lineHeight: 1.15, color: 'var(--ink)', whiteSpace: 'pre-line' }}>
          {slide.headingA}<em style={{ color: 'var(--accent)' }}>{slide.headingAItalic}</em>
          {slide.headingB && <>{'\n'}{slide.headingB}<em style={{ color: 'var(--accent)' }}>{slide.headingBItalic}</em></>}
        </h1>

        {'steps' in slide && slide.steps && (
          <div className="mt-6 space-y-3">
            {slide.steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-xs tracking-widest shrink-0 mt-0.5" style={{ color: 'var(--accent)', fontFamily: 'var(--sans)', minWidth: '1.25rem' }}>
                  {['I', 'II', 'III'][i]}
                </span>
                <p className="text-base leading-snug" style={{ color: 'var(--ink)', fontFamily: 'var(--mincho)' }}>{step}</p>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm leading-relaxed mt-6 whitespace-pre-line" style={{ color: 'var(--ink-3)', fontFamily: 'var(--mincho)' }}>
          {slide.body}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleNext}
        disabled={finishing}
        className="w-full flex items-center justify-between transition-opacity active:opacity-70 disabled:opacity-30"
        style={{
          marginTop: '2.5rem',
          background: 'var(--ink)',
          color: 'var(--paper)',
          padding: '1.1rem 1.5rem',
          fontFamily: 'var(--sans)',
          fontSize: '1rem',
        }}
      >
        <span>{finishing ? '準備中...' : isLast ? 'はじめる' : 'Continue'}</span>
        <span style={{ fontSize: '1.25rem' }}>→</span>
      </button>
    </main>
  )
}
