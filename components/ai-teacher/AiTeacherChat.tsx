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
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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

  const hasMessages = messages.length > 0

  return (
    <div style={{
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
      background: '#FAFAF7',
    }}>
      {/* ダークヘッダー */}
      <div style={{
        background: '#1A1A1A',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: '#F5DFA0', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.03em' }}>
          ✦ AI先生
        </span>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            color: 'rgba(255,255,255,0.45)',
            fontFamily: 'var(--sans)',
            padding: 0,
            letterSpacing: '0.02em',
          }}
        >
          ▲ 閉じる
        </button>
      </div>

      {/* メッセージ履歴（あるときだけ表示） */}
      {hasMessages && (
        <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: msg.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                background: msg.role === 'user' ? '#B5EA4A' : '#F0F0EC',
                color: '#1A1A1A',
                fontFamily: 'var(--sans)',
                fontSize: 13,
                lineHeight: 1.75,
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '8px 12px',
                borderRadius: '14px 14px 14px 3px',
                background: '#F0F0EC',
                color: 'rgba(0,0,0,0.35)',
                fontFamily: 'var(--sans)',
                fontSize: 13,
              }}>
                考えています...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* 入力エリア */}
      <div style={{ padding: '10px 12px 12px', borderTop: hasMessages ? '1px solid rgba(0,0,0,0.07)' : 'none', marginTop: hasMessages ? 10 : 0 }}>
        <div style={{
          background: '#F5F5F0',
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.08)',
          padding: '10px 12px 8px',
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && handleSend()}
            placeholder="なにが分からない？"
            disabled={loading}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: '#1A1A1A',
              fontFamily: 'var(--sans)',
              lineHeight: 1.5,
              caretColor: '#1A1A1A',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 6 }}>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="transition-opacity active:opacity-70 disabled:opacity-25"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#1A1A1A',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
