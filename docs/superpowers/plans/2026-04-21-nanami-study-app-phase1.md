# 七海の共通テスト英語攻略アプリ — Phase 1 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 攻略マップ画面 + ボスA（アウトライン・第8問）+ ボスB（メール・第5問）の基本フロー（STEP1裏技→STEP2答え付き→わからない原因選択→マスターコース→攻略！）を動かす

**Architecture:** Next.js 15 App Router のスマホ最適化Webアプリ。Claude API（Sonnet）がセッション毎に問題を動的生成。Supabase（PostgreSQL + Auth）で進捗を永続化。状態管理はReact Server Components + Server Actions + 最小限のuseState。

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth), Claude API (claude-sonnet-4-6 for problems, claude-haiku-4-5 for dialogue), Vercel

---

## ファイル構成

```
daughter-study-app/
├── app/
│   ├── layout.tsx                    # ルートレイアウト（スマホ最適化）
│   ├── page.tsx                      # 攻略マップ（トップページ）
│   ├── boss/[type]/
│   │   ├── page.tsx                  # STEP1: 裏技表示
│   │   └── step2/page.tsx            # STEP2: 答え付き問題
│   ├── wakaranai/
│   │   └── page.tsx                  # わからない原因選択（A〜E）
│   ├── master/[type]/
│   │   └── page.tsx                  # マスターコース（ヒントなし）
│   ├── cleared/
│   │   └── page.tsx                  # 攻略！お祝い画面
│   └── api/
│       ├── generate/route.ts         # Claude API 問題生成
│       ├── session/route.ts          # セッション保存
│       └── mastery/route.ts          # 攻略状態取得・更新
├── lib/
│   ├── claude.ts                     # Claude API クライアント
│   ├── supabase.ts                   # Supabase クライアント（server/client両用）
│   ├── types.ts                      # 全型定義
│   └── boss-data.ts                  # ボス設定（裏技テキスト、攻略ステップ）
├── components/
│   ├── map/MapCard.tsx               # 攻略マップのボスカード1枚
│   ├── map/ProgressBanner.tsx        # ポジティブ進捗表示
│   ├── boss/TrickPanel.tsx           # 裏技（STEP1）表示コンポーネント
│   ├── boss/ProblemPanel.tsx         # 問題文表示（STEP2・マスター共用）
│   ├── boss/AnswerReveal.tsx         # 答え＋解説（STEP2のみ）
│   ├── boss/WakaranaiButton.tsx      # わからないボタン
│   ├── wakaranai/CauseSelector.tsx   # 原因A〜E選択肢
│   └── ui/
│       ├── BottomButton.tsx          # 画面下部固定ボタン
│       └── LoadingSpinner.tsx        # ローディング表示
├── supabase/
│   └── migrations/
│       ├── 001_sessions.sql
│       ├── 002_mastery.sql
│       └── 003_difficulty_state.sql
└── middleware.ts                     # Supabase Auth セッション更新
```

---

## Task 1: プロジェクト初期化

**Files:**
- Create: `daughter-study-app/` (Next.js プロジェクト全体)
- Create: `.env.local`
- Create: `middleware.ts`

- [ ] **Step 1: Next.js 15プロジェクトを作成する**

```bash
cd /Users/horota/Claude/private/daughter-study-app
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

Expected: Next.js 15がインストールされ、`package.json`, `app/`, `tailwind.config.ts`などが生成される

- [ ] **Step 2: Supabase・Anthropic SDKをインストールする**

```bash
npm install @supabase/supabase-js @supabase/ssr @anthropic-ai/sdk
```

Expected: `node_modules`にパッケージが追加される

- [ ] **Step 3: .env.localを作成する**

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
EOF
```

Supabase ダッシュボード（supabase.com）でプロジェクト作成後、Settings > API から取得。Anthropic APIキーは console.anthropic.com から取得。

- [ ] **Step 4: Supabase Auth用middlewareを作成する**

`middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 5: コミットする**

```bash
git init
git add -A
git commit -m "feat: initialize Next.js 15 project with Supabase + Anthropic SDK"
```

---

## Task 1.5: ログインページ（七海用・シンプルパスワード認証）

**Files:**
- Create: `app/login/page.tsx`
- Modify: `app/page.tsx`（未認証リダイレクト追加）

- [ ] **Step 1: ログインページを作成する**

`app/login/page.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { BottomButton } from '@/components/ui/BottomButton'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('メールアドレスかパスワードが違います')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
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

      <BottomButton
        label={loading ? 'ログイン中...' : 'ログイン'}
        onClick={handleLogin}
        disabled={loading || !email || !password}
      />
    </main>
  )
}
```

- [ ] **Step 2: Supabaseダッシュボードで七海のアカウントを作成する**

Supabase Dashboard > Authentication > Users > Invite User
- Email: 七海のメールアドレス（または仮のアドレス）
- パスワードは「Add user」で手動設定する

- [ ] **Step 3: 未認証時にログインページへリダイレクトする**

`app/page.tsx` の `getMasteries()` 関数の先頭に追加：
```typescript
import { redirect } from 'next/navigation'

async function getMasteries(): Promise<Mastery[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')  // ← この行を追加

  // ...以降は同じ
```

- [ ] **Step 4: コミットする**

```bash
git add app/login/ app/page.tsx
git commit -m "feat: add simple email/password login page for Nanami"
```

---

## Task 2: 型定義とボスデータ定義

**Files:**
- Create: `lib/types.ts`
- Create: `lib/boss-data.ts`

- [ ] **Step 1: 型定義ファイルを作成する**

`lib/types.ts`:
```typescript
export type BossType = 'outline' | 'email'

export type ProblemTheme =
  | 'travel'
  | 'technology'
  | 'environment'
  | 'community'
  | 'daily_life'
  | 'business'

export type ProblemMode = 'answer_first' | 'challenge'

export type WakaranaiCause =
  | 'vocabulary'
  | 'structure'
  | 'background'
  | 'question'
  | 'unknown'

export type SessionResult = 'cleared' | 'wakaranai' | 'pending'

export type MasteryStatus = 'untouched' | 'in_progress' | 'cleared'

// Claude APIが返す問題データ
export interface GeneratedProblem {
  id: string // クライアント側でuuidv4生成
  bossType: BossType
  theme: ProblemTheme
  difficulty: 1 | 2 | 3 | 4 | 5
  mode: ProblemMode
  // 問題本文（資料テキスト・メール本文など）
  passageHtml: string
  // 設問文
  questionText: string
  // 選択肢 (A〜D)
  choices: { label: 'A' | 'B' | 'C' | 'D'; text: string }[]
  // 正解ラベル
  correctLabel: 'A' | 'B' | 'C' | 'D'
  // 解説（answer_firstモードのみ返す、challengeではnull）
  explanation: string | null
  // 裏技のどのポイントが使えるか（任意）
  trickHint: string | null
}

export interface Session {
  id: string
  userId: string
  bossType: BossType
  difficulty: number
  theme: ProblemTheme
  mode: ProblemMode
  generatedQuestion: GeneratedProblem
  result: SessionResult
  wakaranaiCause: WakaranaiCause | null
  resolved: boolean
  createdAt: string
}

export interface Mastery {
  userId: string
  bossType: BossType
  status: MasteryStatus
  clearedAt: string | null
  attemptCount: number
}

export interface DifficultyState {
  userId: string
  bossType: BossType
  currentDifficulty: 1 | 2 | 3 | 4 | 5
  consecutiveFailures: number
}

export interface BossConfig {
  type: BossType
  name: string
  section: number
  points: number
  trick: string
  trickSteps: string[]
  themes: ProblemTheme[]
}
```

- [ ] **Step 2: ボス設定データを作成する**

`lib/boss-data.ts`:
```typescript
import type { BossConfig } from './types'

export const BOSS_CONFIGS: Record<string, BossConfig> = {
  outline: {
    type: 'outline',
    name: 'アウトライン作成',
    section: 8,
    points: 17,
    trick: `資料1の"問題点"＋資料2の"解決策"→ 答えは"その論理的帰結"。
感情的に正しそうな選択肢が1つ混じってる。それが罠。冷静に"論理だけ"で選べ。`,
    trickSteps: [
      '資料1の「問題」を1行でまとめる',
      '資料2の「解決策」を1行でまとめる',
      '「だから〜になる」という文を作る → それに最も近い選択肢を選ぶ',
    ],
    themes: ['technology', 'environment', 'community', 'daily_life'],
  },
  email: {
    type: 'email',
    name: 'メール読解',
    section: 5,
    points: 16,
    trick: `メールで読むのは2つだけ：①最後の一文（結論）②数字（日付・時間・金額）。
その2つを照合すれば答えが出る。本文全部読もうとするな。`,
    trickSteps: [
      'メール最後の一文を読む（結論）',
      '数字・日付・金額だけをピックアップする',
      '設問の選択肢と照合する',
    ],
    themes: ['travel', 'business', 'daily_life', 'community'],
  },
}

export const WAKARANAI_CAUSES = [
  {
    key: 'vocabulary' as const,
    label: 'A. 単語がわからない',
    support: '該当する単語の意味と言い換え例を見せるよ',
  },
  {
    key: 'structure' as const,
    label: 'B. 文の構造がわからない',
    support: '主語・動詞・目的語に分解して日本語で見せるよ',
  },
  {
    key: 'background' as const,
    label: 'C. このテーマを知らない',
    support: 'このテーマを30秒で日本語解説するよ',
  },
  {
    key: 'question' as const,
    label: 'D. 何を聞かれているかわからない',
    support: '設問を日本語で言い換えるよ',
  },
  {
    key: 'unknown' as const,
    label: 'E. ぜんぶよくわからない',
    support: 'いっしょに考えよう。何から見てみる？',
  },
]
```

- [ ] **Step 3: コミットする**

```bash
git add lib/types.ts lib/boss-data.ts
git commit -m "feat: add type definitions and boss configuration data"
```

---

## Task 3: Supabaseクライアントとデータベースマイグレーション

**Files:**
- Create: `lib/supabase.ts`
- Create: `supabase/migrations/001_sessions.sql`
- Create: `supabase/migrations/002_mastery.sql`
- Create: `supabase/migrations/003_difficulty_state.sql`

- [ ] **Step 1: Supabaseクライアントを作成する**

`lib/supabase.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// クライアントコンポーネント用
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// サーバーコンポーネント・API Route用
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
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
          } catch {
            // Server Componentからのread-only cookie操作は無視
          }
        },
      },
    }
  )
}

// Service Role用（APIルートのみ）
export function createServiceClient() {
  const { createClient: createAdminClient } = require('@supabase/supabase-js')
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

- [ ] **Step 2: sessionsテーブルのマイグレーションSQLを作成する**

`supabase/migrations/001_sessions.sql`:
```sql
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  boss_type text not null check (boss_type in ('outline', 'email')),
  difficulty integer not null check (difficulty between 1 and 5),
  theme text not null,
  mode text not null check (mode in ('answer_first', 'challenge')),
  generated_question jsonb not null,
  result text not null default 'pending'
    check (result in ('cleared', 'wakaranai', 'pending')),
  wakaranai_cause text
    check (wakaranai_cause in ('vocabulary', 'structure', 'background', 'question', 'unknown')),
  resolved boolean not null default false,
  ai_conversation jsonb,
  created_at timestamptz not null default now()
);

alter table sessions enable row level security;

create policy "Users can access own sessions"
  on sessions for all
  using (auth.uid() = user_id);
```

- [ ] **Step 3: masteryテーブルのマイグレーションSQLを作成する**

`supabase/migrations/002_mastery.sql`:
```sql
create table if not exists mastery (
  user_id uuid references auth.users(id) on delete cascade not null,
  boss_type text not null check (boss_type in ('outline', 'email')),
  status text not null default 'untouched'
    check (status in ('untouched', 'in_progress', 'cleared')),
  cleared_at timestamptz,
  attempt_count integer not null default 0,
  primary key (user_id, boss_type)
);

alter table mastery enable row level security;

create policy "Users can access own mastery"
  on mastery for all
  using (auth.uid() = user_id);
```

- [ ] **Step 4: difficulty_stateテーブルのマイグレーションSQLを作成する**

`supabase/migrations/003_difficulty_state.sql`:
```sql
create table if not exists difficulty_state (
  user_id uuid references auth.users(id) on delete cascade not null,
  boss_type text not null check (boss_type in ('outline', 'email')),
  current_difficulty integer not null default 2
    check (current_difficulty between 1 and 5),
  consecutive_failures integer not null default 0,
  primary key (user_id, boss_type)
);

alter table difficulty_state enable row level security;

create policy "Users can access own difficulty state"
  on difficulty_state for all
  using (auth.uid() = user_id);
```

- [ ] **Step 5: Supabaseダッシュボードでマイグレーションを実行する**

Supabase Dashboard > SQL Editor で上記3つのSQLを順番に実行する（001 → 002 → 003）。
実行後、Table Editor で3テーブルが存在することを確認する。

- [ ] **Step 6: コミットする**

```bash
git add lib/supabase.ts supabase/
git commit -m "feat: add Supabase client and database migrations"
```

---

## Task 4: Claude API 問題生成エンドポイント

**Files:**
- Create: `lib/claude.ts`
- Create: `app/api/generate/route.ts`

- [ ] **Step 1: Claudeクライアントとプロンプトビルダーを作成する**

`lib/claude.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { BossType, ProblemTheme, ProblemMode, GeneratedProblem } from './types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

function buildProblemPrompt(
  bossType: BossType,
  difficulty: number,
  theme: ProblemTheme,
  mode: ProblemMode
): string {
  const themeMap: Record<ProblemTheme, string> = {
    travel: '旅行・予約',
    technology: 'テクノロジー',
    environment: '環境・自然',
    community: '地域コミュニティ',
    daily_life: '日常生活',
    business: 'ビジネス・買い物',
  }

  const difficultyDesc = ['', '易しい', '標準以下', '標準', '標準以上', '難しい'][difficulty]

  const typeInstructions: Record<BossType, string> = {
    outline: `
問題タイプ：共通テスト第8問型（複数資料→アウトライン完成）
- 資料1（150〜200語）：問題・状況を描写する文章
- 資料2（150〜200語）：解決策・提案を描写する文章
- アウトライン（穴埋め形式）：資料1と2を統合した論理的帰結
- 設問：アウトラインの空欄に入る最適な選択肢を選ぶ（4択）
- 正解：資料1の問題＋資料2の解決策の論理的帰結
- 誤答：「感情的に正しそうだが論理的でない」選択肢を1つ以上含める
`,
    email: `
問題タイプ：共通テスト第5問型（メールのやり取り）
- メール1（100〜150語）：依頼・質問・状況報告のいずれか
- メール2（100〜150語）：メール1への返信
- 必ず具体的な数字（日付・時間・金額・数量のいずれか）を含める
- 設問：メールの内容に基づく事実確認問題（4択）
- 正解：メールの最後の一文または数字情報から直接導ける答え
- 誤答：本文中の別の情報と紛らわしい選択肢を含める
`,
  }

  const explanationInstruction = mode === 'answer_first'
    ? '- explanation: 正解の根拠を日本語で3〜4文で説明する（どこに答えがあったか、なぜ他の選択肢が違うか）'
    : '- explanation: null（challengeモードでは解説を返さない）'

  return `あなたは日本の共通テスト英語問題の専門家です。以下の仕様に厳密に従って問題を生成してください。

テーマ：${themeMap[theme]}
難易度：${difficultyDesc}（${difficulty}/5）
${typeInstructions[bossType]}

出力は必ず以下のJSON形式のみで返してください。説明文や前置きは不要です：

{
  "passageHtml": "問題の本文HTML（<p>タグ使用可）",
  "questionText": "設問文（日本語可）",
  "choices": [
    {"label": "A", "text": "選択肢A"},
    {"label": "B", "text": "選択肢B"},
    {"label": "C", "text": "選択肢C"},
    {"label": "D", "text": "選択肢D"}
  ],
  "correctLabel": "A",
  ${explanationInstruction.replace('- explanation:', '"explanation":')},
  "trickHint": "この問題で使える裏技のポイントを1文で（日本語）"
}`
}

export async function generateProblem(params: {
  bossType: BossType
  difficulty: number
  theme: ProblemTheme
  mode: ProblemMode
}): Promise<Omit<GeneratedProblem, 'id' | 'bossType' | 'theme' | 'difficulty' | 'mode'>> {
  const { bossType, difficulty, theme, mode } = params

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: buildProblemPrompt(bossType, difficulty, theme, mode),
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  // JSON部分のみ抽出（マークダウンコードブロック対応）
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response')
  }

  return JSON.parse(jsonMatch[0])
}

export async function getSupportMessage(params: {
  cause: string
  passageHtml: string
  questionText: string
}): Promise<string> {
  const { cause, passageHtml, questionText } = params

  const causePrompts: Record<string, string> = {
    vocabulary: '問題文中の難しい単語を3〜5個取り上げ、意味と言い換え表現（パラフレーズ）をセットで日本語で説明してください。',
    structure: '問題文の主要な英文を1〜2文選んで、主語・動詞・目的語・修飾語に分解し、日本語訳と構造の解説をしてください。',
    background: 'この問題のテーマについて、共通テストに出る程度の背景知識を日本語で3〜4文で解説してください。',
    question: '設問が何を聞いているかを、簡単な日本語で言い換えてください。どこに答えのヒントがあるかも教えてください。',
    unknown: 'この問題を解くために、まず何から読み始めればよいかを、ステップバイステップで日本語でやさしく説明してください。',
  }

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `以下の問題について、${causePrompts[cause]}

問題文：
${passageHtml.replace(/<[^>]+>/g, '')}

設問：${questionText}

回答は200文字以内の日本語で、やさしく・短く・具体的に。`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  return content.text
}
```

- [ ] **Step 2: 問題生成APIルートを作成する**

`app/api/generate/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { generateProblem } from '@/lib/claude'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { BossType, ProblemTheme, ProblemMode } from '@/lib/types'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { bossType, difficulty, theme, mode } = body as {
    bossType: BossType
    difficulty: number
    theme: ProblemTheme
    mode: ProblemMode
  }

  try {
    const problemData = await generateProblem({ bossType, difficulty, theme, mode })

    const problem = {
      id: crypto.randomUUID(),
      bossType,
      theme,
      difficulty,
      mode,
      ...problemData,
    }

    return NextResponse.json(problem)
  } catch (error) {
    console.error('Problem generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate problem' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 3: コミットする**

```bash
git add lib/claude.ts app/api/generate/
git commit -m "feat: add Claude API problem generation endpoint"
```

---

## Task 5: セッション保存と攻略状態APIルート

**Files:**
- Create: `app/api/session/route.ts`
- Create: `app/api/mastery/route.ts`

- [ ] **Step 1: セッション保存APIルートを作成する**

`app/api/session/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { BossType, ProblemTheme, ProblemMode, SessionResult, WakaranaiCause, GeneratedProblem } from '@/lib/types'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    bossType: BossType
    difficulty: number
    theme: ProblemTheme
    mode: ProblemMode
    generatedQuestion: GeneratedProblem
    result: SessionResult
    wakaranaiCause?: WakaranaiCause
    resolved?: boolean
  }

  const { error, data } = await supabase.from('sessions').insert({
    user_id: user.id,
    boss_type: body.bossType,
    difficulty: body.difficulty,
    theme: body.theme,
    mode: body.mode,
    generated_question: body.generatedQuestion,
    result: body.result,
    wakaranai_cause: body.wakaranaiCause ?? null,
    resolved: body.resolved ?? false,
  }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // マスターコースでclearedなら攻略状態を更新
  if (body.mode === 'challenge' && body.result === 'cleared') {
    await supabase.from('mastery').upsert({
      user_id: user.id,
      boss_type: body.bossType,
      status: 'cleared',
      cleared_at: new Date().toISOString(),
    }, { onConflict: 'user_id,boss_type' })
  } else {
    // 初回プレイ時はin_progressにする
    await supabase.from('mastery').upsert({
      user_id: user.id,
      boss_type: body.bossType,
      status: 'in_progress',
    }, { onConflict: 'user_id,boss_type', ignoreDuplicates: true })
  }

  return NextResponse.json(data)
}
```

- [ ] **Step 2: 攻略状態取得APIルートを作成する**

`app/api/mastery/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import type { Mastery, BossType } from '@/lib/types'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: masteryRows } = await supabase
    .from('mastery')
    .select('*')
    .eq('user_id', user.id)

  // 全ボスに対してステータスをマージ（DBにない = untouched）
  const allBossTypes = Object.keys(BOSS_CONFIGS) as BossType[]
  const masteryMap = new Map(masteryRows?.map((r) => [r.boss_type, r]) ?? [])

  const result: Mastery[] = allBossTypes.map((bossType) => {
    const row = masteryMap.get(bossType)
    return {
      userId: user.id,
      bossType,
      status: row?.status ?? 'untouched',
      clearedAt: row?.cleared_at ?? null,
      attemptCount: row?.attempt_count ?? 0,
    }
  })

  return NextResponse.json(result)
}
```

- [ ] **Step 3: コミットする**

```bash
git add app/api/session/ app/api/mastery/
git commit -m "feat: add session save and mastery status API routes"
```

---

## Task 6: UIコンポーネント基盤

**Files:**
- Create: `components/ui/BottomButton.tsx`
- Create: `components/ui/LoadingSpinner.tsx`
- Create: `app/layout.tsx`（更新）

- [ ] **Step 1: ルートレイアウトをスマホ最適化する**

`app/layout.tsx`:
```typescript
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '共通テスト英語 攻略アプリ',
  description: '七海の共通テスト英語攻略アプリ',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${geist.className} bg-gray-950 text-white min-h-screen`}>
        <div className="max-w-md mx-auto min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: BottomButtonコンポーネントを作成する**

`components/ui/BottomButton.tsx`:
```typescript
'use client'

interface BottomButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

export function BottomButton({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}: BottomButtonProps) {
  const variantStyles = {
    primary: 'bg-yellow-400 text-gray-900 active:bg-yellow-500',
    secondary: 'bg-gray-700 text-white active:bg-gray-600',
    danger: 'bg-red-500 text-white active:bg-red-600',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 rounded-2xl text-lg font-bold transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]}
      `}
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 3: LoadingSpinnerを作成する**

`components/ui/LoadingSpinner.tsx`:
```typescript
export function LoadingSpinner({ label = '問題を生成中...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
}
```

- [ ] **Step 4: コミットする**

```bash
git add app/layout.tsx components/
git commit -m "feat: add base UI components and mobile-optimized layout"
```

---

## Task 7: 攻略マップ（トップページ）

**Files:**
- Create: `components/map/MapCard.tsx`
- Create: `components/map/ProgressBanner.tsx`
- Create: `app/page.tsx`

- [ ] **Step 1: MapCardコンポーネントを作成する**

`components/map/MapCard.tsx`:
```typescript
'use client'

import Link from 'next/link'
import type { MasteryStatus, BossConfig } from '@/lib/types'

interface MapCardProps {
  boss: BossConfig
  status: MasteryStatus
}

const statusConfig: Record<MasteryStatus, { icon: string; label: string; border: string }> = {
  cleared: { icon: '✅', label: '攻略済み', border: 'border-green-500' },
  in_progress: { icon: '🔥', label: '挑戦中', border: 'border-yellow-400' },
  untouched: { icon: '⚔️', label: '未挑戦', border: 'border-gray-600' },
}

export function MapCard({ boss, status }: MapCardProps) {
  const { icon, label, border } = statusConfig[status]

  return (
    <Link href={`/boss/${boss.type}`}>
      <div className={`border-2 ${border} rounded-2xl p-4 bg-gray-900 active:bg-gray-800 transition-colors`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl mb-1">{icon}</div>
            <h2 className="text-lg font-bold">{boss.name}</h2>
            <p className="text-gray-400 text-sm">第{boss.section}問型 / {boss.points}点</p>
          </div>
          <span className="text-xs text-gray-500 mt-1">{label}</span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: ProgressBannerコンポーネントを作成する**

`components/map/ProgressBanner.tsx`:
```typescript
import type { Mastery } from '@/lib/types'

interface ProgressBannerProps {
  masteries: Mastery[]
}

export function ProgressBanner({ masteries }: ProgressBannerProps) {
  const cleared = masteries.filter((m) => m.status === 'cleared')
  const inProgress = masteries.filter((m) => m.status === 'in_progress')

  if (cleared.length === 0 && inProgress.length === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl p-4">
        <p className="text-gray-400 text-sm">最初のボスに挑戦しよう！</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-2">
      <p className="text-xs text-gray-500 font-mono">📊 七海の攻略状況</p>
      {cleared.length > 0 && (
        <div>
          <p className="text-xs text-green-400 mb-1">🏆 攻略済み</p>
          {cleared.map((m) => (
            <p key={m.bossType} className="text-sm">✅ {m.bossType}</p>
          ))}
        </div>
      )}
      {inProgress.length > 0 && (
        <div>
          <p className="text-xs text-yellow-400 mb-1">🔥 挑戦中</p>
          {inProgress.map((m) => (
            <p key={m.bossType} className="text-sm">🔥 {m.bossType}</p>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 攻略マップページを作成する**

`app/page.tsx`:
```typescript
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { createServerSupabaseClient } from '@/lib/supabase'
import { MapCard } from '@/components/map/MapCard'
import { ProgressBanner } from '@/components/map/ProgressBanner'
import type { Mastery, BossType } from '@/lib/types'

async function getMasteries(): Promise<Mastery[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('mastery')
    .select('*')
    .eq('user_id', user.id)

  const allBossTypes = Object.keys(BOSS_CONFIGS) as BossType[]
  const masteryMap = new Map(data?.map((r) => [r.boss_type, r]) ?? [])

  return allBossTypes.map((bossType) => {
    const row = masteryMap.get(bossType)
    return {
      userId: user.id,
      bossType,
      status: row?.status ?? 'untouched',
      clearedAt: row?.cleared_at ?? null,
      attemptCount: row?.attempt_count ?? 0,
    }
  })
}

export default async function MapPage() {
  const masteries = await getMasteries()
  const masteryMap = new Map(masteries.map((m) => [m.bossType, m.status]))

  return (
    <main className="flex-1 p-4 space-y-4">
      <div className="pt-6">
        <h1 className="text-2xl font-black tracking-tight">攻略マップ</h1>
        <p className="text-gray-400 text-sm mt-1">どのボスに挑む？</p>
      </div>

      <ProgressBanner masteries={masteries} />

      <div className="space-y-3">
        {Object.values(BOSS_CONFIGS).map((boss) => (
          <MapCard
            key={boss.type}
            boss={boss}
            status={masteryMap.get(boss.type) ?? 'untouched'}
          />
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 4: コミットする**

```bash
git add components/map/ app/page.tsx
git commit -m "feat: add attack map with boss cards and positive progress banner"
```

---

## Task 8: STEP1（裏技表示）画面

**Files:**
- Create: `components/boss/TrickPanel.tsx`
- Create: `app/boss/[type]/page.tsx`

- [ ] **Step 1: TrickPanelコンポーネントを作成する**

`components/boss/TrickPanel.tsx`:
```typescript
interface TrickPanelProps {
  trick: string
  steps: string[]
}

export function TrickPanel({ trick, steps }: TrickPanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-4">
        <p className="text-xs text-yellow-400 font-bold mb-2">⚡ 攻略の裏技</p>
        <p className="text-white leading-relaxed whitespace-pre-line">{trick}</p>
      </div>

      <div className="bg-gray-900 rounded-2xl p-4 space-y-2">
        <p className="text-xs text-gray-400 font-bold">攻略3ステップ</p>
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-yellow-400 font-bold text-sm shrink-0">{i + 1}.</span>
            <p className="text-sm text-gray-200">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: STEP1ページを作成する**

`app/boss/[type]/page.tsx`:
```typescript
'use client'

import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { TrickPanel } from '@/components/boss/TrickPanel'
import { BottomButton } from '@/components/ui/BottomButton'
import type { BossType } from '@/lib/types'

export default function Step1Page() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  if (!boss) {
    return <div className="p-4 text-red-400">ボスが見つかりません</div>
  }

  function handleNext() {
    router.push(`/boss/${bossType}/step2`)
  }

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <p className="text-xs text-gray-400">ボス {boss.section}問型</p>
        <h1 className="text-2xl font-black mt-1">{boss.name}</h1>
        <p className="text-yellow-400 text-sm mt-1">まず攻略法を見よう</p>
      </div>

      <TrickPanel trick={boss.trick} steps={boss.trickSteps} />

      <div className="mt-auto pt-4">
        <BottomButton
          label="わかった！問題を見る →"
          onClick={handleNext}
        />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: コミットする**

```bash
git add components/boss/TrickPanel.tsx app/boss/
git commit -m "feat: add STEP1 trick display page"
```

---

## Task 9: STEP2（答え付き問題）画面

**Files:**
- Create: `components/boss/ProblemPanel.tsx`
- Create: `components/boss/AnswerReveal.tsx`
- Create: `components/boss/WakaranaiButton.tsx`
- Create: `app/boss/[type]/step2/page.tsx`

- [ ] **Step 1: ProblemPanelコンポーネントを作成する**

`components/boss/ProblemPanel.tsx`:
```typescript
import type { GeneratedProblem } from '@/lib/types'

interface ProblemPanelProps {
  problem: GeneratedProblem
  selectedLabel?: 'A' | 'B' | 'C' | 'D' | null
  onSelect?: (label: 'A' | 'B' | 'C' | 'D') => void
  revealAnswer?: boolean
}

export function ProblemPanel({
  problem,
  selectedLabel,
  onSelect,
  revealAnswer = false,
}: ProblemPanelProps) {
  return (
    <div className="space-y-4">
      {/* 問題文 */}
      <div
        className="bg-gray-900 rounded-2xl p-4 text-sm leading-relaxed text-gray-200"
        dangerouslySetInnerHTML={{ __html: problem.passageHtml }}
      />

      {/* 設問 */}
      <p className="text-sm font-bold">{problem.questionText}</p>

      {/* 選択肢 */}
      <div className="space-y-2">
        {problem.choices.map((choice) => {
          const isSelected = selectedLabel === choice.label
          const isCorrect = choice.label === problem.correctLabel
          let borderClass = 'border-gray-700'

          if (revealAnswer && isCorrect) borderClass = 'border-green-500 bg-green-500/10'
          else if (revealAnswer && isSelected && !isCorrect) borderClass = 'border-red-500 bg-red-500/10'
          else if (isSelected) borderClass = 'border-yellow-400'

          return (
            <button
              key={choice.label}
              onClick={() => onSelect?.(choice.label)}
              disabled={revealAnswer}
              className={`w-full text-left border-2 ${borderClass} rounded-xl p-3 text-sm transition-colors`}
            >
              <span className="font-bold mr-2">{choice.label}.</span>
              {choice.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: AnswerRevealコンポーネントを作成する**

`components/boss/AnswerReveal.tsx`:
```typescript
import type { GeneratedProblem } from '@/lib/types'

interface AnswerRevealProps {
  problem: GeneratedProblem
}

export function AnswerReveal({ problem }: AnswerRevealProps) {
  return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 space-y-2">
      <p className="text-xs text-green-400 font-bold">✅ 正解：{problem.correctLabel}</p>
      {problem.explanation && (
        <p className="text-sm text-gray-200 leading-relaxed">{problem.explanation}</p>
      )}
      {problem.trickHint && (
        <p className="text-xs text-yellow-400 mt-2">⚡ {problem.trickHint}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: WakaranaiButtonを作成する**

`components/boss/WakaranaiButton.tsx`:
```typescript
'use client'

interface WakaranaiButtonProps {
  onClick: () => void
}

export function WakaranaiButton({ onClick }: WakaranaiButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 text-sm active:bg-gray-800 transition-colors"
    >
      わからない部分がある
    </button>
  )
}
```

- [ ] **Step 4: STEP2ページを作成する**

`app/boss/[type]/step2/page.tsx`:
```typescript
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { ProblemPanel } from '@/components/boss/ProblemPanel'
import { AnswerReveal } from '@/components/boss/AnswerReveal'
import { WakaranaiButton } from '@/components/boss/WakaranaiButton'
import { BottomButton } from '@/components/ui/BottomButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { BossType, GeneratedProblem } from '@/lib/types'

export default function Step2Page() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  const [problem, setProblem] = useState<GeneratedProblem | null>(null)
  const [selectedLabel, setSelectedLabel] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function generate() {
      setLoading(true)
      try {
        const themes = boss.themes
        const theme = themes[Math.floor(Math.random() * themes.length)]
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bossType,
            difficulty: 2,
            theme,
            mode: 'answer_first',
          }),
        })
        if (!res.ok) throw new Error('生成失敗')
        const data = await res.json()
        setProblem(data)
      } catch {
        setError('問題の生成に失敗しました。もう一度試してください。')
      } finally {
        setLoading(false)
      }
    }
    generate()
  }, [bossType, boss.themes])

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>
  if (error) return <div className="flex-1 flex items-center justify-center p-4"><p className="text-red-400 text-center">{error}</p></div>
  if (!problem) return null

  function handleGoToMaster() {
    router.push(`/master/${bossType}?problemId=${problem!.id}&problemData=${encodeURIComponent(JSON.stringify(problem))}`)
  }

  function handleWakaranai() {
    router.push(`/wakaranai?bossType=${bossType}&problemData=${encodeURIComponent(JSON.stringify(problem))}`)
  }

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <p className="text-xs text-yellow-400 font-bold">STEP 2 — 答えを確認しながら読む</p>
        <h1 className="text-xl font-black mt-1">{boss.name}</h1>
      </div>

      <ProblemPanel
        problem={problem}
        selectedLabel={selectedLabel}
        onSelect={setSelectedLabel}
        revealAnswer={true}
      />

      <AnswerReveal problem={problem} />

      <div className="mt-auto space-y-3 pt-4">
        <WakaranaiButton onClick={handleWakaranai} />
        <BottomButton
          label="ぜんぶわかった！マスターコースへ →"
          onClick={handleGoToMaster}
        />
      </div>
    </main>
  )
}
```

- [ ] **Step 5: コミットする**

```bash
git add components/boss/ app/boss/
git commit -m "feat: add STEP2 answer-first problem page with reveal"
```

---

## Task 10: わからない原因選択画面

**Files:**
- Create: `components/wakaranai/CauseSelector.tsx`
- Create: `app/wakaranai/page.tsx`

- [ ] **Step 1: CauseSelectorコンポーネントを作成する**

`components/wakaranai/CauseSelector.tsx`:
```typescript
'use client'

import { WAKARANAI_CAUSES } from '@/lib/boss-data'
import type { WakaranaiCause } from '@/lib/types'

interface CauseSelectorProps {
  selectedCause: WakaranaiCause | null
  onSelect: (cause: WakaranaiCause) => void
}

export function CauseSelector({ selectedCause, onSelect }: CauseSelectorProps) {
  return (
    <div className="space-y-2">
      {WAKARANAI_CAUSES.map((cause) => (
        <button
          key={cause.key}
          onClick={() => onSelect(cause.key)}
          className={`
            w-full text-left border-2 rounded-xl p-4 transition-colors
            ${selectedCause === cause.key
              ? 'border-yellow-400 bg-yellow-400/10'
              : 'border-gray-700 bg-gray-900 active:bg-gray-800'
            }
          `}
        >
          <p className="font-bold text-sm">{cause.label}</p>
          <p className="text-xs text-gray-400 mt-1">{cause.support}</p>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: わからない原因選択ページを作成する**

`app/wakaranai/page.tsx`:
```typescript
'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CauseSelector } from '@/components/wakaranai/CauseSelector'
import { BottomButton } from '@/components/ui/BottomButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { WakaranaiCause, GeneratedProblem, BossType } from '@/lib/types'

function WakaranaiContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bossType = searchParams.get('bossType') as BossType
  const problemData = searchParams.get('problemData')
  const problem: GeneratedProblem | null = problemData
    ? JSON.parse(decodeURIComponent(problemData))
    : null

  const [selectedCause, setSelectedCause] = useState<WakaranaiCause | null>(null)
  const [supportMessage, setSupportMessage] = useState<string | null>(null)
  const [loadingSupport, setLoadingSupport] = useState(false)

  async function handleGetSupport() {
    if (!selectedCause || !problem) return
    setLoadingSupport(true)
    try {
      const res = await fetch('/api/generate/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cause: selectedCause,
          passageHtml: problem.passageHtml,
          questionText: problem.questionText,
        }),
      })
      const data = await res.json()
      setSupportMessage(data.message)
    } finally {
      setLoadingSupport(false)
    }
  }

  function handleNattoku() {
    // 問題ページに戻る（Step2）
    router.push(`/boss/${bossType}/step2`)
  }

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <h1 className="text-xl font-black">どこがわからない？</h1>
        <p className="text-gray-400 text-sm mt-1">理由を1つ選んでね</p>
      </div>

      <CauseSelector selectedCause={selectedCause} onSelect={setSelectedCause} />

      {selectedCause && !supportMessage && (
        <BottomButton
          label="サポートを見る"
          onClick={handleGetSupport}
          disabled={loadingSupport}
        />
      )}

      {loadingSupport && <LoadingSpinner label="考えてるよ..." />}

      {supportMessage && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-sm text-gray-200 leading-relaxed">{supportMessage}</p>
        </div>
      )}

      {supportMessage && (
        <div className="mt-auto pt-4">
          <BottomButton label="納得した！問題に戻る" onClick={handleNattoku} />
        </div>
      )}
    </main>
  )
}

export default function WakaranaiPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>}>
      <WakaranaiContent />
    </Suspense>
  )
}
```

- [ ] **Step 3: サポートメッセージAPIルートを追加する**

`app/api/generate/support/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getSupportMessage } from '@/lib/claude'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { cause, passageHtml, questionText } = body

  try {
    const message = await getSupportMessage({ cause, passageHtml, questionText })
    return NextResponse.json({ message })
  } catch {
    return NextResponse.json({ error: 'サポートの取得に失敗しました' }, { status: 500 })
  }
}
```

- [ ] **Step 4: コミットする**

```bash
git add components/wakaranai/ app/wakaranai/ app/api/generate/support/
git commit -m "feat: add wakaranai cause selection page with Claude Haiku support"
```

---

## Task 11: マスターコース（ヒントなし挑戦）画面

**Files:**
- Create: `app/master/[type]/page.tsx`

- [ ] **Step 1: マスターコースページを作成する**

`app/master/[type]/page.tsx`:
```typescript
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { ProblemPanel } from '@/components/boss/ProblemPanel'
import { BottomButton } from '@/components/ui/BottomButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { BossType, GeneratedProblem } from '@/lib/types'

function MasterContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  // STEP2で使った問題を再利用（またはnewで新規生成）
  const problemDataParam = searchParams.get('problemData')
  const [problem, setProblem] = useState<GeneratedProblem | null>(
    problemDataParam ? JSON.parse(decodeURIComponent(problemDataParam)) : null
  )
  const [selectedLabel, setSelectedLabel] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(!problem)

  useEffect(() => {
    if (problem) return
    async function generate() {
      const themes = boss.themes
      const theme = themes[Math.floor(Math.random() * themes.length)]
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bossType,
          difficulty: 2,
          theme,
          mode: 'challenge',
        }),
      })
      const data = await res.json()
      setProblem({ ...data, explanation: null })
      setLoading(false)
    }
    generate()
  }, [bossType, boss.themes, problem])

  async function handleSubmit() {
    if (!selectedLabel || !problem) return
    setSubmitted(true)

    const isCorrect = selectedLabel === problem.correctLabel

    // セッション保存
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bossType,
        difficulty: problem.difficulty,
        theme: problem.theme,
        mode: 'challenge',
        generatedQuestion: problem,
        result: isCorrect ? 'cleared' : 'wakaranai',
      }),
    })

    if (isCorrect) {
      router.push(`/cleared?bossType=${bossType}`)
    }
  }

  if (loading || !problem) {
    return <div className="flex-1 flex items-center justify-center"><LoadingSpinner label="本番問題を生成中..." /></div>
  }

  const isCorrect = submitted && selectedLabel === problem.correctLabel
  const isWrong = submitted && selectedLabel !== problem.correctLabel

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <p className="text-xs text-red-400 font-bold">⚔️ マスターコース — ヒントなし本番</p>
        <h1 className="text-xl font-black mt-1">{boss.name}</h1>
      </div>

      <ProblemPanel
        problem={problem}
        selectedLabel={selectedLabel}
        onSelect={!submitted ? setSelectedLabel : undefined}
        revealAnswer={submitted}
      />

      {isWrong && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
          <p className="text-sm text-red-300">惜しい！正解は {problem.correctLabel} だったよ。</p>
          <p className="text-xs text-gray-400 mt-1">もう一度チャレンジしてみる？</p>
        </div>
      )}

      <div className="mt-auto space-y-3 pt-4">
        {!submitted ? (
          <BottomButton
            label="これが答え！"
            onClick={handleSubmit}
            disabled={!selectedLabel}
          />
        ) : isWrong ? (
          <>
            <BottomButton
              label="もう一度挑戦する"
              onClick={() => {
                setSelectedLabel(null)
                setSubmitted(false)
              }}
            />
            <BottomButton
              label="マップに戻る"
              onClick={() => router.push('/')}
              variant="secondary"
            />
          </>
        ) : null}
      </div>
    </main>
  )
}

export default function MasterPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>}>
      <MasterContent />
    </Suspense>
  )
}
```

- [ ] **Step 2: コミットする**

```bash
git add app/master/
git commit -m "feat: add master course challenge mode with session saving"
```

---

## Task 12: 攻略！お祝い画面

**Files:**
- Create: `app/cleared/page.tsx`

- [ ] **Step 1: 攻略！画面を作成する**

`app/cleared/page.tsx`:
```typescript
'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { BottomButton } from '@/components/ui/BottomButton'
import type { BossType } from '@/lib/types'

function ClearedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bossType = searchParams.get('bossType') as BossType
  const boss = BOSS_CONFIGS[bossType]

  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-center gap-6 text-center">
      <div className="text-7xl">🎉</div>
      <div>
        <h1 className="text-3xl font-black">攻略！</h1>
        <p className="text-yellow-400 text-xl font-bold mt-2">{boss?.name}</p>
        <p className="text-gray-400 text-sm mt-3">裏技が使いこなせたね。</p>
      </div>

      <div className="w-full space-y-3 mt-8">
        <BottomButton
          label="次のボスに挑む"
          onClick={() => router.push('/')}
        />
        <BottomButton
          label="もう一度このボスを倒す"
          onClick={() => router.push(`/boss/${bossType}`)}
          variant="secondary"
        />
      </div>
    </main>
  )
}

export default function ClearedPage() {
  return (
    <Suspense fallback={null}>
      <ClearedContent />
    </Suspense>
  )
}
```

- [ ] **Step 2: コミットする**

```bash
git add app/cleared/
git commit -m "feat: add attack cleared celebration page"
```

---

## Task 13: Vercelデプロイと動作確認

**Files:**
- 既存ファイルの確認のみ

- [ ] **Step 1: ビルドエラーがないか確認する**

```bash
npm run build
```

Expected: エラーなくビルド完了。`Route (app)` のリスト表示。

- [ ] **Step 2: ローカルで動作確認する**

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開き、以下のフローを確認：
1. 攻略マップ表示 → ボスカードが2枚表示される
2. 「アウトライン作成」をタップ → STEP1裏技画面
3. 「わかった！問題を見る」 → STEP2（問題生成中...表示後、問題表示）
4. 問題を読む → 答え表示確認 → 「ぜんぶわかった！マスターコースへ」
5. マスターコース → 選択肢を選ぶ → 「これが答え！」
6. 正解した場合 → 攻略！画面
7. 「わからない部分がある」を押す → 原因選択 → サポートメッセージ表示

- [ ] **Step 3: Vercelにデプロイする**

```bash
# Vercel CLIがなければインストール
npm i -g vercel
vercel
```

対話式プロンプトで：
- Set up and deploy: `y`
- Which scope: 自分のアカウントを選択
- Link to existing project: `n`
- Project name: `nanami-study-app`
- Directory: `./`（デフォルト）

デプロイ後、Vercel ダッシュボードで環境変数（.env.local の内容）を追加する。

- [ ] **Step 4: 最終コミット**

```bash
git add -A
git commit -m "feat: phase 1 complete - attack map + boss A/B + full learning flow"
```

---

## Phase 1 完成チェックリスト

- [ ] 攻略マップ（ボスA・ボスBの2枚カード）
- [ ] STEP1：裏技表示
- [ ] STEP2：Claude APIが答え付きで問題を生成
- [ ] 「わからない」→原因選択（A〜E）→サポートメッセージ（Haiku）
- [ ] 「納得した」→STEP2に戻る
- [ ] マスターコース：答えなしで問題
- [ ] 正解 → セッション保存 → 攻略！画面
- [ ] 不正解 → 再挑戦またはマップに戻る
- [ ] 進捗（攻略済み・挑戦中）がマップに表示される
- [ ] Vercelにデプロイ済み

---

## 次のフェーズ（Phase 2以降）

- Phase 2: 難易度バランスアルゴリズム（20/70/10%分割）+ 連続失敗時の問題差し替え
- Phase 3: 全ボス追加（C〜E）+ 基礎スキル（言い換え・事実/意見）
- Phase 4: リスニング + 音声対応
