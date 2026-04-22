'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('メールアドレスかパスワードが違います')
      } else {
        router.push('/')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col justify-between" style={{ padding: '3rem 1.75rem 2rem' }}>
      {/* Top label */}
      <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--accent)', fontFamily: 'var(--sans)', letterSpacing: '0.12em' }}>
        共通テスト英語 · 完全対策
      </p>

      {/* Hero headline */}
      <div style={{ marginTop: '2.5rem' }}>
        <h1 className="display" style={{ fontSize: 'clamp(2rem, 8vw, 2.75rem)', lineHeight: 1.15, color: 'var(--ink)' }}>
          Begin with <em style={{ color: 'var(--accent)' }}>a whisper,</em>
          <br />not a shout.
        </h1>
        <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--ink-3)', fontFamily: 'var(--mincho)' }}>
          共通テスト英語を、最短で静かに攻略する。<br />
          メールアドレスとパスワードで、すぐ始められる。
        </p>
      </div>

      {/* Form */}
      <div style={{ marginTop: '3rem', flex: 1 }}>
        <div style={{ borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem', marginBottom: '1.75rem' }}>
          <label className="text-xs tracking-widest uppercase" style={{ color: 'var(--ink-3)', letterSpacing: '0.1em' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nao@example.com"
            className="w-full outline-none bg-transparent text-base mt-1"
            style={{ color: 'var(--ink)', fontFamily: 'var(--sans)' }}
          />
        </div>

        <div style={{ borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
          <label className="text-xs tracking-widest uppercase" style={{ color: 'var(--ink-3)', letterSpacing: '0.1em' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            className="w-full outline-none bg-transparent text-base mt-1"
            style={{ color: 'var(--ink)', fontFamily: 'var(--sans)' }}
          />
        </div>

        <div className="flex justify-end">
          <span className="text-xs" style={{ color: 'var(--ink-4)' }}>Supabase · secure</span>
        </div>

        {error && <p className="text-sm mt-3" style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>

      {/* CTA */}
      <button
        onClick={handleLogin}
        disabled={loading || !email || !password}
        className="w-full flex items-center justify-between transition-opacity active:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          marginTop: '3rem',
          background: 'var(--ink)',
          color: 'var(--paper)',
          padding: '1.1rem 1.5rem',
          fontFamily: 'var(--sans)',
          fontSize: '1rem',
          letterSpacing: '0.01em',
        }}
      >
        <span>{loading ? 'ログイン中...' : 'はじめる'}</span>
        <span style={{ fontSize: '1.25rem' }}>→</span>
      </button>
    </main>
  )
}
