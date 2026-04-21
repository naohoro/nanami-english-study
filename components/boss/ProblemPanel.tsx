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

function injectHighlight(html: string, text: string, color: 'green' | 'pink'): string {
  if (!text) return html
  const bg = color === 'green' ? '#BBFFD4' : '#FFD0D0'
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

          return (
            <div key={q.number} className="space-y-2">
              <p className="text-sm font-bold font-mincho" style={{ color: '#1A1A1A' }}>
                問{q.number}　{q.questionText}
              </p>
              <div className="space-y-2">
                {q.choices.map((choice) => {
                  const isSelected = selectedLabel === choice.label
                  const isCorrect = choice.label === q.correctLabel

                  let borderColor = 'var(--border)'
                  let bg = '#fff'

                  if (revealAnswer && isCorrect) { borderColor = '#4CAF50'; bg = '#F0FBF0' }
                  else if (revealAnswer && isSelected && !isCorrect) { borderColor = '#E57373'; bg = '#FFF0F0' }
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
                      <span style={{ color: '#1A1A1A' }}>{choice.text}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
