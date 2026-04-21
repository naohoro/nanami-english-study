'use client'

import { useState } from 'react'
import type { GeneratedProblem } from '@/lib/types'

interface ProblemPanelProps {
  problem: GeneratedProblem
  selectedLabels?: Record<number, 'A' | 'B' | 'C' | 'D' | null>
  onSelect?: (questionNumber: number, label: 'A' | 'B' | 'C' | 'D') => void
  revealAnswer?: boolean
  highlightMap?: Record<number, { keyText: string; keyJapanese: string }>
}

function injectHighlight(html: string, text: string, color: 'green' | 'pink' | 'yellow'): string {
  if (!text) return html
  const bg = color === 'green' ? '#BBFFD4' : color === 'pink' ? '#FFD0D0' : '#FFF176'
  const idx = html.indexOf(text)
  if (idx === -1) return html
  return (
    html.slice(0, idx) +
    `<mark style="background:${bg};border-radius:2px;padding:1px 2px">${text}</mark>` +
    html.slice(idx + text.length)
  )
}

export function ProblemPanel({
  problem,
  selectedLabels = {},
  onSelect,
  revealAnswer = false,
  highlightMap = {},
}: ProblemPanelProps) {
  const [showJapanese, setShowJapanese] = useState(false)
  const [japanese, setJapanese] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)
  const [peekedQuestions, setPeekedQuestions] = useState<Set<number>>(new Set())

  // Per-question translation state
  type QTranslation = { questionText: string; choices: Record<string, string> }
  const [qTranslations, setQTranslations] = useState<Record<number, QTranslation>>({})
  const [qShowJa, setQShowJa] = useState<Set<number>>(new Set())
  const [qTranslating, setQTranslating] = useState<Set<number>>(new Set())

  async function handleTranslateQuestion(qNum: number, questionText: string, choices: { label: string; text: string }[]) {
    if (qTranslations[qNum]) {
      setQShowJa(prev => {
        const next = new Set(prev)
        prev.has(qNum) ? next.delete(qNum) : next.add(qNum)
        return next
      })
      return
    }
    setQTranslating(prev => new Set([...prev, qNum]))
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passageHtml: questionText, choices }),
      })
      const data = await res.json()
      setQTranslations(prev => ({
        ...prev,
        [qNum]: { questionText: data.japanese ?? questionText, choices: data.choices ?? {} },
      }))
      setQShowJa(prev => new Set([...prev, qNum]))
    } finally {
      setQTranslating(prev => { const next = new Set(prev); next.delete(qNum); return next })
    }
  }

  // Per-question hint state
  type HintData = { keyText: string; keyJapanese: string }
  const [hintMap, setHintMap] = useState<Record<number, HintData>>({})
  const [hintLoading, setHintLoading] = useState<Set<number>>(new Set())
  const [activeHints, setActiveHints] = useState<Set<number>>(new Set())

  async function handleHint(qNum: number, questionText: string, correctLabel: string, choices: { label: string; text: string }[]) {
    if (hintMap[qNum]) {
      setActiveHints(prev => { const next = new Set(prev); prev.has(qNum) ? next.delete(qNum) : next.add(qNum); return next })
      return
    }
    setHintLoading(prev => new Set([...prev, qNum]))
    try {
      const res = await fetch('/api/highlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passageHtml: problem.passageHtml, questionText, correctLabel, choices }),
      })
      const data = await res.json()
      setHintMap(prev => ({ ...prev, [qNum]: data }))
      setActiveHints(prev => new Set([...prev, qNum]))
    } finally {
      setHintLoading(prev => { const next = new Set(prev); next.delete(qNum); return next })
    }
  }

  async function handleTranslate() {
    if (japanese) { setShowJapanese(!showJapanese); return }
    setTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passageHtml: problem.passageHtml }),
      })
      const data = await res.json()
      setJapanese(data.japanese)
      setShowJapanese(true)
    } finally {
      setTranslating(false)
    }
  }

  // Apply all highlights to the passage
  let displayHtml = problem.passageHtml
  // Hint highlights (yellow) — shown whenever hint is active
  for (const qNum of activeHints) {
    const hint = hintMap[qNum]
    if (hint?.keyText) displayHtml = injectHighlight(displayHtml, hint.keyText, 'yellow')
  }
  // Answer highlights (green/pink) — shown after global reveal
  if (revealAnswer && Object.keys(highlightMap).length > 0) {
    for (const [qNumStr, highlight] of Object.entries(highlightMap)) {
      const qNum = Number(qNumStr)
      const q = problem.questions.find(q => q.number === qNum)
      if (!q || !highlight.keyText) continue
      const selected = selectedLabels[qNum]
      const correct = selected === q.correctLabel
      displayHtml = injectHighlight(displayHtml, highlight.keyText, correct ? 'green' : 'pink')
    }
  }

  return (
    <div className="space-y-4">
      {/* シナリオ */}
      {problem.scenario && (
        <p className="text-sm leading-relaxed font-mincho" style={{ color: '#1A1A1A' }}>
          {problem.scenario}
        </p>
      )}

      {/* 問題文 */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid var(--border)', background: '#F5F5F5' }}>
          <p className="text-xs font-bold" style={{ color: '#787878' }}>問題文</p>
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="text-xs font-bold px-3 py-1 rounded-full transition-opacity active:opacity-60 disabled:opacity-40"
            style={{ background: 'var(--burgundy-light)', color: 'var(--burgundy)' }}
          >
            {translating ? '翻訳中...' : showJapanese ? '英語で読む' : '日本語で読む'}
          </button>
        </div>

        {showJapanese && japanese ? (
          <div className="p-4 text-sm leading-relaxed whitespace-pre-line font-mincho" style={{ color: '#1A1A1A' }}>
            {japanese}
          </div>
        ) : (
          <div
            className="p-4 text-sm passage-english"
            style={{ color: '#1A1A1A' }}
            dangerouslySetInnerHTML={{ __html: displayHtml }}
          />
        )}
      </div>

      {/* 設問一覧 */}
      <div className="space-y-5">
        {problem.questions.map((q) => {
          const selectedLabel = selectedLabels[q.number] ?? null
          const isPeeked = peekedQuestions.has(q.number)
          const showReveal = revealAnswer || isPeeked

          const isQTranslating = qTranslating.has(q.number)
          const isQShowJa = qShowJa.has(q.number)
          const qTrans = qTranslations[q.number]

          return (
            <div key={q.number} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold font-mincho flex-1" style={{ color: '#1A1A1A' }}>
                  問{q.number}　{isQShowJa && qTrans ? qTrans.questionText : q.questionText}
                </p>
                <button
                  onClick={() => handleTranslateQuestion(q.number, q.questionText, q.choices)}
                  disabled={isQTranslating}
                  className="shrink-0 text-xs font-bold px-2 py-1 rounded-full active:opacity-60 disabled:opacity-40"
                  style={{ background: 'var(--burgundy-light)', color: 'var(--burgundy)' }}
                >
                  {isQTranslating ? '翻訳中' : isQShowJa ? 'EN' : 'JP'}
                </button>
              </div>
              <div className="space-y-2">
                {q.choices.map((choice) => {
                  const isSelected = selectedLabel === choice.label
                  const isCorrect = choice.label === q.correctLabel
                  const choiceText = isQShowJa && qTrans?.choices[choice.label] ? qTrans.choices[choice.label] : choice.text

                  let borderColor = 'var(--border)'
                  let bg = '#fff'

                  if (showReveal && isCorrect) { borderColor = '#4CAF50'; bg = '#F0FBF0' }
                  else if (showReveal && isSelected && !isCorrect) { borderColor = '#E57373'; bg = '#FFF0F0' }
                  else if (isSelected) { borderColor = 'var(--burgundy)'; bg = 'var(--burgundy-light)' }

                  return (
                    <button
                      key={choice.label}
                      onClick={() => onSelect?.(q.number, choice.label)}
                      disabled={revealAnswer}
                      className="w-full text-left rounded-xl p-3 text-sm transition-colors disabled:cursor-default"
                      style={{ border: `2px solid ${borderColor}`, background: bg }}
                    >
                      <span className="font-bold mr-2" style={{ color: 'var(--burgundy)' }}>{choice.label}.</span>
                      <span style={{ color: '#1A1A1A' }}>{choiceText}</span>
                    </button>
                  )
                })}
              </div>

              {/* ヒントボタン */}
              {(() => {
                const isHintLoading = hintLoading.has(q.number)
                const isHintActive = activeHints.has(q.number)
                const hint = hintMap[q.number]
                return (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleHint(q.number, q.questionText, q.correctLabel, q.choices)}
                      disabled={isHintLoading}
                      className="w-full text-sm font-bold py-2 rounded-xl active:opacity-60 disabled:opacity-40"
                      style={{ background: '#FFFDE7', color: '#F57F17', border: '1px solid #FFF176' }}
                    >
                      {isHintLoading ? '探してるよ...' : isHintActive ? 'ヒントを隠す' : '💡 ヒント（本文のどこに答えがある？）'}
                    </button>
                    {isHintActive && hint && (
                      <div className="rounded-xl p-3 space-y-1" style={{ background: '#FFFDE7', border: '1px solid #FFF176' }}>
                        <p className="text-xs font-bold" style={{ color: '#F57F17' }}>↑ 本文の黄色い部分を読んでみて！</p>
                        {hint.keyJapanese && (
                          <p className="text-xs leading-relaxed font-mincho" style={{ color: '#787878' }}>
                            （{hint.keyJapanese}）
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* 答えを先に見るボタン / 解説表示 */}
              {!showReveal ? (
                <button
                  onClick={() => setPeekedQuestions(prev => new Set([...prev, q.number]))}
                  className="w-full text-sm font-bold py-2.5 rounded-xl active:opacity-60"
                  style={{ background: 'var(--gold-light)', color: 'var(--gold)', border: '1px solid #E8D5A3' }}
                >
                  先に答えを見て考える
                </button>
              ) : (
                <div className="rounded-xl p-3 space-y-1" style={{ background: '#F0FBF0', border: '1px solid #4CAF50' }}>
                  <p className="text-xs font-bold" style={{ color: '#2E7D32' }}>
                    正解：{q.correctLabel}
                  </p>
                  {q.explanation && (
                    <p className="text-xs leading-relaxed font-mincho" style={{ color: '#1A1A1A' }}>
                      {q.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
