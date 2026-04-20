import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default async function HomePage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <h1 className="text-2xl font-black tracking-tight">攻略マップ</h1>
        <p className="text-gray-400 text-sm mt-1">どのボスに挑む？</p>
        <p className="text-gray-600 text-xs mt-2">（ボスは次のタスクで追加されます）</p>
      </div>
    </main>
  )
}
