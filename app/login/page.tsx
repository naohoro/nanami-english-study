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
    <main className="flex-1 p-6 flex flex-col justify-center gap-8">
      <div>
        <p className="text-xs font-bold tracking-widest mb-2" style={{ color: 'var(--burgundy)' }}>NANAMI&apos;S ENGLISH APP</p>
        <h1 className="text-2xl font-black" style={{ color: '#1A1A1A' }}>共通テスト英語<br />最短攻略アプリ</h1>
        <p className="text-sm mt-2" style={{ color: '#787878' }}>お父さんから七海への特別な勉強法</p>
      </div>

      <div className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: '#fff', border: '1.5px solid var(--border)', color: '#1A1A1A' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--burgundy)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: '#fff', border: '1.5px solid var(--border)', color: '#1A1A1A' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--burgundy)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
        {error && <p className="text-sm" style={{ color: '#E53935' }}>{error}</p>}
      </div>

      <button
        onClick={handleLogin}
        disabled={loading || !email || !password}
        className="w-full py-4 rounded-2xl text-base font-bold transition-opacity active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed text-white"
        style={{ background: 'var(--burgundy)' }}
      >
        {loading ? 'ログイン中...' : 'はじめる'}
      </button>
    </main>
  )
}
