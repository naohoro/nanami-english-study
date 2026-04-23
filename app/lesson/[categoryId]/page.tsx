'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LESSON_CATEGORIES } from '@/lib/lesson-data'
import type { LessonCard } from '@/lib/lesson-data'
import { AiTeacherChat } from '@/components/ai-teacher/AiTeacherChat'

function withUnderline(text: string, word: string) {
  const idx = text.indexOf(word)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ borderBottom: '1.5px solid currentColor', paddingBottom: 1 }}>{word}</span>
      {text.slice(idx + word.length)}
    </>
  )
}

export default function LessonCardPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const router = useRouter()
  const cat = LESSON_CATEGORIES.find(c => c.id === categoryId)

  const [cardIndex, setCardIndex] = useState(0)
  const [phase, setPhase] = useState<'quiz' | 'reveal' | 'done'>('quiz')
  const [picked, setPicked] = useState<number | null>(null)
  const [doneCount, setDoneCount] = useState(0)

  if (!cat || cat.cards.length === 0) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: 12 }}>
          カードが見つかりません
        </p>
      </main>
    )
  }

  const card: LessonCard = cat.cards[cardIndex]
  const totalCards = cat.cards.length

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    setTimeout(() => setPhase('reveal'), 700)
  }

  const retry = () => {
    setPicked(null)
    setPhase('quiz')
  }

  const understand = async () => {
    setDoneCount(prev => prev + 1)
    await fetch('/api/lesson/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: card.id, categoryId: cat.id, understood: true }),
    }).catch(() => {})
    setPhase('done')
  }

  const nextCard = () => {
    if (cardIndex + 1 < totalCards) {
      setCardIndex(prev => prev + 1)
      setPicked(null)
      setPhase('quiz')
    } else {
      router.push('/lesson')
    }
  }

  const dots = Array.from({ length: Math.min(totalCards, 5) })

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto',
        gap: 12, alignItems: 'center',
        padding: '12px 20px', borderBottom: '1px solid var(--rule)',
        fontFamily: 'var(--mono)', fontSize: 10,
      }}>
        <button
          onClick={() => router.push('/lesson')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 10, padding: 0 }}
        >
          ← LESSON
        </button>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {dots.map((_, i) => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: 999,
              background: i < cardIndex ? 'var(--ink-3)' : i === cardIndex ? 'var(--ink)' : 'var(--ink-4)',
            }} />
          ))}
        </div>
        <div style={{ color: 'var(--ink-4)' }}>{card.bossWhere}</div>
      </div>

      {/* QUIZ PHASE */}
      {phase === 'quiz' && (
        <>
          <div style={{ padding: '28px 20px 8px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {cat.title}
          </div>
          <div style={{
            padding: '0 20px 22px',
            fontFamily: 'Georgia, "Iowan Old Style", serif',
            fontSize: 46, lineHeight: 1.05, color: 'var(--ink)',
            fontStyle: 'italic', fontWeight: 400, letterSpacing: '-0.02em',
          }}>
            "{card.word}"
          </div>

          <div style={{
            padding: '16px 20px 10px',
            fontFamily: 'var(--display)', fontSize: 18, lineHeight: 1.45,
            color: 'var(--ink)', letterSpacing: '-0.015em',
            borderTop: '1px solid var(--rule-soft)',
          }}>
            {card.prompt}
          </div>

          <div style={{ padding: '6px 20px 10px', fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            選んでください
          </div>

          {card.options.map((o, i) => {
            const isPicked = picked === i
            const revealed = picked !== null
            const isCorrect = revealed && o.correct
            const isWrong = revealed && isPicked && !o.correct
            return (
              <button
                key={o.k}
                onClick={() => pick(i)}
                disabled={picked !== null}
                style={{
                  width: '100%', textAlign: 'left', cursor: picked === null ? 'pointer' : 'default',
                  background: isCorrect ? '#F0F3EC' : 'transparent',
                  border: 0, borderTop: '1px solid var(--rule-soft)',
                  padding: '16px 20px',
                  display: 'grid', gridTemplateColumns: '28px 1fr 20px',
                  gap: 14, alignItems: 'center',
                  opacity: revealed && !o.correct && !isPicked ? 0.45 : 1,
                  transition: 'background 160ms ease, opacity 160ms ease',
                }}
              >
                <span style={{
                  fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 20,
                  color: isCorrect ? 'var(--ok)' : isWrong ? 'var(--ink-3)' : 'var(--accent)',
                  lineHeight: 1,
                }}>
                  {o.k}
                </span>
                <span style={{ fontFamily: 'var(--display)', fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.45, letterSpacing: '-0.005em' }}>
                  {o.label}
                </span>
                <span style={{
                  justifySelf: 'end',
                  width: 14, height: 14, borderRadius: 999,
                  border: `1px solid ${isCorrect ? 'var(--ok)' : isPicked ? 'var(--ink)' : 'var(--ink-4)'}`,
                  background: isCorrect ? 'var(--ok)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 9, fontWeight: 700,
                }}>
                  {isCorrect ? '✓' : ''}
                </span>
              </button>
            )
          })}
          <div style={{ borderBottom: '1px solid var(--rule-soft)' }} />
        </>
      )}

      {/* REVEAL PHASE */}
      {phase === 'reveal' && (
        <>
          <div style={{ padding: '26px 20px 4px' }}>
            <div style={{
              fontFamily: 'Georgia, "Iowan Old Style", serif', fontStyle: 'italic',
              fontSize: 32, lineHeight: 1.05, color: 'var(--ink)', letterSpacing: '-0.015em',
              fontWeight: 700, display: 'inline-block',
              borderBottom: '1.5px solid var(--ink-2)', paddingBottom: 2,
            }}>
              "{card.word}"
            </div>
            <div style={{ marginTop: 14, fontFamily: 'var(--display)', fontSize: 18, color: 'var(--ink-2)', letterSpacing: '-0.01em' }}>
              {card.meaningJa}
            </div>
            <div style={{ marginTop: 4, fontFamily: 'var(--display)', fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>
              {card.core}
            </div>
          </div>

          <div style={{ margin: '18px 20px 0', borderTop: '1px solid var(--rule-soft)' }} />

          <div style={{ padding: '16px 20px 6px', fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            文の中での使われ方
          </div>
          <div style={{ padding: '0 20px', fontFamily: 'Georgia, serif', fontSize: 16, lineHeight: 1.6, color: 'var(--ink)' }}>
            {withUnderline(card.exampleEn, card.word)}
          </div>
          <div style={{ padding: '4px 20px 18px', display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.04em', flexShrink: 0 }}>訳</span>
            <span style={{ fontFamily: 'var(--display)', fontSize: 16, color: 'var(--ink-3)', lineHeight: 1.55 }}>
              {withUnderline(card.exampleJa, card.meaningJa.split('・')[0])}
            </span>
          </div>

          {/* Boss link box */}
          <div style={{ margin: '0 20px', background: 'var(--surface)', border: '1px solid var(--rule-soft)', padding: '12px 14px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              {card.bossWhere}
            </div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink-2)' }}>
              {card.bossHint}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '22px 20px 10px' }}>
            <button className="hy-btn ghost" onClick={retry} style={{ width: '100%', justifyContent: 'center' }}>もう一度</button>
            <button className="hy-btn" onClick={understand} style={{ width: '100%', justifyContent: 'center' }}>
              わかった <span className="arr">→</span>
            </button>
          </div>
        </>
      )}

      {/* DONE PHASE */}
      {phase === 'done' && (
        <div style={{ padding: '40px 20px 0', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ width: 40, height: 1, background: 'var(--ink-3)', marginBottom: 22 }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              このカテゴリ
            </div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 42, lineHeight: 1, color: 'var(--ink)', letterSpacing: '-0.03em' }}>
              {doneCount}<span style={{ color: 'var(--ink-4)' }}> / {totalCards}</span>
            </div>
            <div style={{ marginTop: 6, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 14, color: 'var(--accent)' }}>
              完了
            </div>
          </div>

          {card.nextWord && (
            <div style={{ borderTop: '1px solid var(--rule-soft)', borderBottom: '1px solid var(--rule-soft)', padding: '16px 0' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                次のカード
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 26, color: 'var(--ink)', lineHeight: 1.1 }}>
                "{card.nextWord}"
              </div>
              {card.nextTeaser && (
                <div style={{ marginTop: 6, fontFamily: 'var(--display)', fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                  {card.nextTeaser}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gap: 10 }}>
            <button className="hy-btn full" onClick={nextCard}>
              {cardIndex + 1 < totalCards ? <>次へ <span className="arr">→</span></> : 'カテゴリ一覧へ'}
            </button>
            <button className="hy-btn ghost full" onClick={() => router.push('/lesson')} style={{ justifyContent: 'center' }}>
              カテゴリに戻る
            </button>
          </div>
        </div>
      )}

      <div className="px-4 pb-6 mt-2">
        <AiTeacherChat context={{ pageType: 'lesson', categoryId: cat.id, categoryTitle: cat.title }} />
      </div>
    </main>
  )
}
