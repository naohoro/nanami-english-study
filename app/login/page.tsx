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
    <main className="flex-1 p-6 flex flex-col justify-center gap-6">
      <div>
        <h1 className="text-2xl font-black">七海の英語攻略アプリ</h1>
        <p className="text-gray-400 text-sm mt-1">ログインしてね</p>
      </div>

      <div className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-400"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <button
        onClick={handleLogin}
        disabled={loading || !email || !password}
        className="w-full py-4 rounded-2xl text-lg font-bold bg-yellow-400 text-gray-900 active:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>
    </main>
  )
}
