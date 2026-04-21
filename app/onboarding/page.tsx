'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const slides = [
  {
    emoji: '📚',
    title: '共通テスト英語を\n最短で攻略するアプリ',
    body: '英語が苦手でも大丈夫。\n答えを先に見てから学ぶ、\nお父さんが作った特別な方法。',
  },
  {
    emoji: '🎯',
    title: '点数が大きい問題から\nやるのが正解',
    body: '第8問は17点。\nここを確実に取れると英語全体の\n点数が大きく変わる。\nだから、この問題から始める。',
  },
  {
    emoji: '✨',
    title: '使い方はシンプル',
    steps: [
      '答えと解説を先に見る',
      '「なるほど！」と思えたら',
      '自力でやってみる',
    ],
    body: 'できた！という体験が積み重なる。\nそれだけ。',
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
      await supabase.auth.updateUser({ data: { onboarding_done: true } })
    } finally {
      router.push('/')
    }
  }

  return (
    <main className="flex-1 p-6 flex flex-col">
      {/* progress dots */}
      <div className="flex gap-2 pt-4 pb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === current ? '32px' : '8px',
              background: i === current ? 'var(--burgundy)' : 'var(--border)',
            }}
          />
        ))}
      </div>

      {/* slide content */}
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="text-6xl">{slide.emoji}</div>

        <h1 className="text-2xl font-black leading-snug whitespace-pre-line" style={{ color: '#1A1A1A' }}>
          {slide.title}
        </h1>

        {'steps' in slide && slide.steps && (
          <div className="space-y-3">
            {slide.steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-center">
                <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white shrink-0" style={{ background: 'var(--burgundy)' }}>
                  {i + 1}
                </span>
                <p className="text-base" style={{ color: '#1A1A1A' }}>{step}</p>
              </div>
            ))}
          </div>
        )}

        <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: '#787878' }}>
          {slide.body}
        </p>
      </div>

      {/* button */}
      <div className="pb-4">
        <button
          onClick={handleNext}
          disabled={finishing}
          className="w-full py-4 rounded-2xl text-base font-bold text-white transition-opacity active:opacity-70 disabled:opacity-40"
          style={{ background: 'var(--burgundy)' }}
        >
          {finishing ? '準備中...' : isLast ? 'はじめる →' : '次へ →'}
        </button>
      </div>
    </main>
  )
}
