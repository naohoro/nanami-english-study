'use client'

import { useState, useRef, useEffect } from 'react'
import type { AiTeacherContext, ChatMessage } from '@/lib/types'

interface AiTeacherChatProps {
  context: AiTeacherContext
}

export function AiTeacherChat({ context }: AiTeacherChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function handleClose() {
    if (messages.length >= 2) {
      fetch('/api/ai-teacher/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, context }),
      }).catch(() => {})
    }
    setOpen(false)
    setMessages([])
    setInput('')
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, context }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'すみません、うまく答えられませんでした。もう一度試してみてください。' }])
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #3D2B00 100%)',
          border: '2px solid #C8922A',
          padding: '0.75rem 1.25rem',
          color: '#F5DFA0',
          fontFamily: 'var(--sans)',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '0.04em',
          boxShadow: '0 2px 12px rgba(200,146,42,0.25)',
          borderRadius: 0,
        }}
      >
        <span style={{ fontSize: 16 }}>✦</span>
        AI先生に質問する
        <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>→</span>
      </button>
    )
  }

  return (
    <div style={{ border: '1px solid var(--ink)', padding: '1rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--ink)', fontFamily: 'var(--sans)' }}>
          <span style={{ color: 'var(--accent)' }}>✦</span> AI先生
        </span>
        <button
          onClick={handleClose}
          className="text-xs transition-opacity active:opacity-60"
          style={{ color: 'var(--ink-3)', fontFamily: 'var(--sans)' }}
        >
          ▲ 閉じる
        </button>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-4" style={{ maxHeight: '240px', overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="text-sm leading-relaxed"
              style={{
                maxWidth: '85%',
                padding: '0.5rem 0.75rem',
                background: msg.role === 'assistant' ? 'var(--paper-2)' : 'var(--ink)',
                color: msg.role === 'assistant' ? 'var(--ink)' : 'var(--paper)',
                fontFamily: 'var(--mincho)',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="text-sm" style={{ padding: '0.5rem 0.75rem', background: 'var(--paper-2)', color: 'var(--ink-3)', fontFamily: 'var(--mincho)' }}>
              考えています...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="なにが分からない？"
          disabled={loading}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{
            borderBottom: '1px solid var(--ink)',
            paddingBottom: '0.25rem',
            color: 'var(--ink)',
            fontFamily: 'var(--mincho)',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="flex items-center justify-center transition-opacity active:opacity-60 disabled:opacity-30"
          style={{
            width: '28px',
            height: '28px',
            background: 'var(--ink)',
            color: 'var(--paper)',
            flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
