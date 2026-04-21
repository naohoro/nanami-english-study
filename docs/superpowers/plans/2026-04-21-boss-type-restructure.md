# Boss Type Restructure — 2025/2026 共通テスト対応

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 8 boss types (vocab/grammar/conversation/chart/email/story/multi_source/outline) with 8 types that match the actual 2025/2026 共通テスト English Reading format (short_text/survey_blog/short_story/essay_edit/multi_doc/long_story/article_slides/essay_synthesis).

**Architecture:** Update TypeScript types → update boss config data → update Claude prompt templates → update API route validators → update seed script → run Supabase migration → reseed DB → build + deploy.

**Tech Stack:** Next.js App Router, TypeScript, Supabase PostgreSQL, Anthropic Claude API (sonnet-4-6 for seeds), Vercel

---

## Type Mapping (old → new)

| Old type | New type | 問 | Points | Time |
|---|---|---|---|---|
| vocab | → DELETED | — | — | — |
| grammar | → DELETED | — | — | — |
| conversation | → short_story | 第3問 | 9 | 180s |
| chart | → essay_edit | 第4問 | 12 | 180s |
| email | → multi_doc | 第5問 | 16 | 240s |
| story | → long_story | 第6問 | 12 | 300s |
| multi_source | → article_slides | 第7問 | 16 | 360s |
| outline | → essay_synthesis | 第8問 | 17 | 420s |
| — (new) | short_text | 第1問 | 6 | 90s |
| — (new) | survey_blog | 第2問 | 12 | 150s |

---

## File Map

| File | Action |
|---|---|
| `lib/types.ts` | Modify: Replace BossType union (8 old → 8 new) |
| `lib/boss-data.ts` | Rewrite: All 8 BOSS_CONFIGS entries |
| `lib/claude.ts` | Modify: Replace typeInstructions Record for all 8 new types |
| `app/api/sample-problem/route.ts` | Modify: Update VALID_BOSS_TYPES const |
| `app/api/difficulty/route.ts` | Modify: Update VALID_BOSS_TYPES const |
| `scripts/seed-problems.ts` | Rewrite: BOSS_THEMES + typeInstructions for 8 new types |
| `supabase/migrations/006_restructure_boss_types.sql` | Create: Drop old constraints, delete old records, add new constraints |

---

## Task 1: Update BossType union in lib/types.ts

**Files:**
- Modify: `lib/types.ts:1-9`

- [ ] **Step 1: Replace BossType**

Replace lines 1–9 in `lib/types.ts` with:

```typescript
export type BossType =
  | 'short_text'
  | 'survey_blog'
  | 'short_story'
  | 'essay_edit'
  | 'multi_doc'
  | 'long_story'
  | 'article_slides'
  | 'essay_synthesis'
```

Everything else in `lib/types.ts` (ProblemTheme, ProblemMode, GeneratedProblem, etc.) stays unchanged.

- [ ] **Step 2: Verify build compiles (expect errors — that's fine at this stage)**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npm run build 2>&1 | head -40
```

Expected: TypeScript errors in boss-data.ts, claude.ts, API routes — these will all be fixed in subsequent tasks. Confirm the error messages reference those files.

---

## Task 2: Rewrite BOSS_CONFIGS in lib/boss-data.ts

**Files:**
- Modify: `lib/boss-data.ts` (full rewrite of BOSS_CONFIGS)

- [ ] **Step 1: Replace the entire BOSS_CONFIGS object**

Replace `lib/boss-data.ts` with the following (keep WAKARANAI_CAUSES unchanged at the bottom):

```typescript
import type { BossConfig } from './types'

export const BOSS_CONFIGS: Record<string, BossConfig> = {
  short_text: {
    type: 'short_text',
    name: '短い実用文（第1問）',
    section: 1,
    points: 6,
    timeLimit: 90,
    trick: `タイトルと設問だけ先に読む。本文は全部読まない。
設問のキーワードが出てくる部分だけを探す。
チラシや告知文は「日時・場所・条件」の3つを探すと答えが出ることが多い。`,
    trickSteps: [
      '設問を先に全部読む（何を探すか確認）',
      '本文からキーワードと同じ単語・数字を探す',
      '本文に書いてある事実だけで選ぶ（「良さそう」に見えるだけの選択肢は罠）',
    ],
    example: {
      en: 'Q: "What is the main purpose of this notice?" → Check the first sentence of the text.',
      ja: '→ 最初の文が目的を述べていることがほとんど。タイトルも重要なヒント。',
    },
    themes: ['travel', 'daily_life', 'community', 'business'],
  },
  survey_blog: {
    type: 'survey_blog',
    name: 'ブログ・アンケート（第2問）',
    section: 2,
    points: 12,
    timeLimit: 150,
    trick: `設問を先に全部読んでから本文を読む。
ブログなら段落ごとの「テーマ文（最初の文）」だけ追う。
アンケートなら数字・割合とコメントの対応を探す。
筆者の意見（I think / should）と事実（数字・データ）を分けて読む。`,
    trickSteps: [
      '設問を先に全部読む',
      'ブログ：各段落の最初の文だけを読む（主張がある）',
      'アンケート：数字・割合と関連するコメントを照合する',
    ],
    example: {
      en: '"60% of students said they enjoyed the event." → Q: What did most students think?',
      ja: '→ 60% = "most"。数字が言い換えられることに注意。',
    },
    themes: ['technology', 'environment', 'daily_life', 'community'],
  },
  short_story: {
    type: 'short_story',
    name: '短編物語・時系列（第3問）',
    section: 3,
    points: 9,
    timeLimit: 180,
    trick: `時間を表す言葉だけをマーク：yesterday / two days ago / last night / the next day / the following week。
これを順に並べると時系列が完成する。
「正しい順番」問題はこれだけで解ける。`,
    trickSteps: [
      '時間・順序を示す単語を全てマーク',
      '登場人物の行動を時系列で箇条書きにする',
      '設問の選択肢と時系列を照合する',
    ],
    example: {
      en: '"She met him at the festival. Two days later, she received a letter."',
      ja: '→ "Two days later" を見つければ festival → letter の順序が決まる。',
    },
    themes: ['daily_life', 'community', 'travel', 'environment'],
  },
  essay_edit: {
    type: 'essay_edit',
    name: 'エッセイ添削（第4問）',
    section: 4,
    points: 12,
    timeLimit: 180,
    trick: `先生のコメントを先に全部読む。コメントが「答えのヒント」そのもの。
英文を直すんじゃなく、コメントの内容と選択肢をマッチングするゲームだ。
コメントにない情報を追加する選択肢は全部罠。`,
    trickSteps: [
      '先生のコメントを先に全部読む',
      '各コメントが「何を求めているか」を1語でメモする（例：具体例・理由・対策）',
      'そのコメントを満たす選択肢だけを選ぶ（本文は後から確認）',
    ],
    example: {
      en: 'Comment: "Add a specific example here." → Choose the option with a concrete number or name.',
      ja: '→ 「具体例」を求めているなら、数字や固有名詞が入っている選択肢を選ぶ。',
    },
    themes: ['technology', 'environment', 'business', 'community'],
  },
  multi_doc: {
    type: 'multi_doc',
    name: '複数文書を読む問題（第5問）',
    section: 5,
    points: 16,
    timeLimit: 240,
    trick: `チラシ・フォーム・メール、どれを読むか設問で先に決める。
設問のキーワードが出てくる文書だけを読む。
数字（日付・料金・条件）が正解の根拠になることが多い。
複数の文書を組み合わせないと解けない設問が必ず1つある。`,
    trickSteps: [
      '設問を先に全部読む',
      '各設問に関係する文書を特定する（チラシ？フォーム？メール？）',
      '複数文書を組み合わせる設問を最後に読む（一番難しいので後回し）',
    ],
    example: {
      en: 'Leaflet says "open Mon-Fri". Form says "submitted on Saturday" → Q: Was the form submitted on time?',
      ja: '→ 2つの文書を組み合わせて初めて答えが出る。',
    },
    themes: ['travel', 'business', 'daily_life', 'community'],
  },
  long_story: {
    type: 'long_story',
    name: '長編物語・読解（第6問）',
    section: 6,
    points: 12,
    timeLimit: 300,
    trick: `第1段落と最終段落を先に読む。登場人物の感情語（worried / relieved / disappointed / proud 等）を全てマーク。
心情・行動の理由を問う設問の答えは、その感情語の前後に必ずある。`,
    trickSteps: [
      '第1段落：誰が・どんな状況かをつかむ',
      '最終段落：どう変わったか（解決・未解決）を確認',
      '感情・心情を表す単語をマークしながら本文を読む',
    ],
    example: {
      en: '"She had been nervous, but now she felt relieved."',
      ja: '→ 感情の変化を問う設問はここが正解の根拠。nervous → relieved の変化を確認。',
    },
    themes: ['daily_life', 'community', 'travel', 'environment'],
  },
  article_slides: {
    type: 'article_slides',
    name: '説明文＋スライド（第7問）',
    section: 7,
    points: 16,
    timeLimit: 360,
    trick: `スライドの空欄を先に全部確認。空欄のテーマが本文の何段落目かを予測してから読む。
筆者の主張は最初か最後の段落、具体例は中間段落にある。
スライドと本文の「対応」を探すパズルだ。`,
    trickSteps: [
      'スライドの空欄を先に全部読む（何を探すか確認）',
      '各空欄に対応する本文の段落を特定する',
      '段落の最初の文だけ読んで、空欄に合うかを確認する',
    ],
    example: {
      en: 'Slide: "Benefit 1: [ 32 ]" → Find the paragraph that starts "One benefit is..."',
      ja: '→ スライドの見出しと本文の段落テーマが対応している。',
    },
    themes: ['technology', 'environment', 'business', 'community'],
  },
  essay_synthesis: {
    type: 'essay_synthesis',
    name: '意見を読んでまとめる（第8問）',
    section: 8,
    points: 17,
    timeLimit: 420,
    trick: `ステップを飛ばさない。①意見を読む→②立場を選ぶ→③その立場を支持する意見を2つ探す→④追加資料でアウトラインを完成させる。
アウトラインの答えは「選んだ立場の論理的帰結」。感情的に正しそうな選択肢が罠。`,
    trickSteps: [
      '各意見を読んで「賛成派・反対派」をメモする（30秒）',
      '選んだ立場を支持する意見2つの「共通点」を探す',
      '追加資料はアウトラインの空欄に直接対応する部分だけを読む',
    ],
    example: {
      en: 'Step 2: "Jack and Tamara both support accepting technology in sports."',
      ja: '→ 共通点は「技術はスポーツを向上させる」。その論理的帰結がアウトラインの答え。',
    },
    themes: ['technology', 'environment', 'business', 'community'],
  },
}

export const WAKARANAI_CAUSES = [
  {
    key: 'vocabulary' as const,
    label: '単語がわからない',
    support: '該当する単語の意味と言い換え例を見せるよ',
  },
  {
    key: 'structure' as const,
    label: '文の構造がわからない',
    support: '主語・動詞・目的語に分解して日本語で見せるよ',
  },
  {
    key: 'background' as const,
    label: 'このテーマを知らない',
    support: 'このテーマを30秒で日本語解説するよ',
  },
  {
    key: 'question' as const,
    label: '何を聞かれているかわからない',
    support: '設問を日本語で言い換えるよ',
  },
  {
    key: 'unknown' as const,
    label: 'ぜんぶよくわからない',
    support: 'いっしょに考えよう。何から見てみる？',
  },
]
```

- [ ] **Step 2: Run build (still expect errors in claude.ts)**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npm run build 2>&1 | head -40
```

Expected: boss-data.ts errors should be gone. Remaining errors should be in `lib/claude.ts` and the two API routes.

---

## Task 3: Update typeInstructions in lib/claude.ts

**Files:**
- Modify: `lib/claude.ts:25-90` (the typeInstructions Record inside buildProblemPrompt)

- [ ] **Step 1: Replace typeInstructions in buildProblemPrompt**

In `lib/claude.ts`, replace the `typeInstructions` Record (lines 25–90) with:

```typescript
  const typeInstructions: Record<BossType, string> = {
    short_text: `
問題タイプ：共通テスト第1問型（短い実用文）
- チラシ・告知・グループチャット・メモのいずれか1種類
- 150語以内の短い実用文
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 設問：本文の目的・条件・日時・場所に関する事実確認（4択）
- 正解：本文に明記されている事実のみ
- 誤答：本文に書いていないが「良さそう」に見える選択肢を1つ含める
- passageHtml形式（チラシ例）：<p><strong>[タイトル]</strong></p><p>[本文]</p>
- passageHtml形式（チャット例）：<p><strong>Group Chat: [グループ名]</strong></p><p>[名前1]: [発言]</p><p>[名前2]: [発言]</p>
`,
    survey_blog: `
問題タイプ：共通テスト第2問型（ブログ記事またはアンケート＋コメント）
- 形式A（ブログ）：200〜250語の段落構成ブログ記事（筆者の意見＋根拠＋具体例）
- 形式B（アンケート）：アンケート結果の数値表＋回答者のコメント3〜4件
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 設問：筆者の意見・根拠・アンケート結果の事実確認（4択）
- passageHtml形式（ブログ）：<p>段落1</p><p>段落2</p><p>段落3</p>
- passageHtml形式（アンケート）：<p><strong>[タイトル]</strong></p><table border="1" style="border-collapse:collapse;width:100%;font-size:0.9em"><tr><th>項目</th><th>回答(%)</th></tr>...</table><p><strong>コメント</strong></p><p>[名前A]: [コメント]</p>
`,
    short_story: `
問題タイプ：共通テスト第3問型（短編物語・時系列）
- 200〜280語の短編物語（主人公が複数のイベントを経験する）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 時間・順序を示す表現を4〜5つ含める（yesterday, two days later, the following week 等）
- 設問：本文中の出来事の正しい順序を4選択肢の中から選ぶ（4択）
- 正解：本文の時間表現を正しく並べた選択肢
- 誤答：出来事の順序が1〜2つ入れ替わっている選択肢を3つ
- passageHtml：<p>タグで段落区切り（3〜4段落）
- questionText例：「本文中の出来事を起きた順に並べたものとして最も適切なものを選べ」
`,
    essay_edit: `
問題タイプ：共通テスト第4問型（エッセイ添削）
- 生徒が書いたエッセイ（150〜200語、空所3か所）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 先生のコメント2〜3件（各コメントは「具体例を追加」「理由を述べる」「対策を提案」等）
- 設問：先生のコメントに基づき空所に入る最適な文を選ぶ（4択）
- 正解：コメントの要求を正確に満たす文
- 誤答：コメントに言及のない情報を含む文、または要求と別方向の文
- passageHtml形式：<p><strong>Student Essay</strong></p><p>[エッセイ本文（空所は _____ ）]</p><p><strong>Teacher\'s Comments</strong></p><p>Comment 1: [コメント]</p><p>Comment 2: [コメント]</p>
`,
    multi_doc: `
問題タイプ：共通テスト第5問型（複数文書）
- 文書1（80〜120語）：チラシ・案内・告知のいずれか
- 文書2（80〜120語）：申込フォーム・返信メール・補足情報のいずれか
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 必ず具体的な数字（日付・料金・条件・定員等）を各文書に含める
- 設問：両文書の情報を照合しないと解けない事実確認（4択）
- 正解：文書1＋文書2の情報を組み合わせた結論
- 誤答：片方の文書だけで導ける「半正解」選択肢を1つ含める
- passageHtml形式：<p><strong>Document 1: [タイトル]</strong></p><p>[文書1本文]</p><p><strong>Document 2: [タイトル]</strong></p><p>[文書2本文]</p>
`,
    long_story: `
問題タイプ：共通テスト第6問型（長編物語）
- 300〜380語の物語文（明確な感情変化のある主人公）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 感情語（worried / relieved / disappointed / proud / frustrated / grateful 等）を最低3つ含める
- 感情の変化が明確な転換点を1か所以上含める
- 設問：登場人物の心情・行動の理由を問う問題（4択）
- 正解：本文の感情語・行動描写に直接根拠がある選択肢
- 誤答：感情は近いが本文に根拠がない選択肢を1〜2つ含める
- passageHtml：<p>タグで段落区切り（4〜5段落）
`,
    article_slides: `
問題タイプ：共通テスト第7問型（説明文＋スライド）
- 説明文（400〜500語、5〜6段落構成）：科学・社会・テクノロジー等のテーマ
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 発表スライド（空所4〜5か所）：説明文の要点を整理したもの
- 設問：スライドの空所に入る最適な語句・文を選ぶ（4択、各空所1問）
- 正解：説明文の対応する段落から直接導ける内容
- 誤答：本文に無い情報、または別段落の情報
- passageHtml形式：
  <p>[説明文 段落1]</p><p>[段落2]</p><p>[段落3]</p><p>[段落4]</p><p>[段落5]</p>
  <p><strong>Presentation Slides</strong></p>
  <p>[タイトルスライド]<br>Slide 1: [見出し] — [ 1 ]<br>Slide 2: [見出し] — [ 2 ]</p>
- questionText例：「スライドの空所 [ 1 ] に入る最も適切なものを選べ」（空所ごとに1問）
`,
    essay_synthesis: `
問題タイプ：共通テスト第8問型（複数意見→立場表明→アウトライン）
- Step 1：異なる立場の意見文4〜5件（各80〜120語）
- Step 2：立場選択（提示された立場を支持する意見2件を選ぶ、共通点を特定）
- Step 3：追加資料（説明文1件 100〜150語 ＋ グラフデータ3〜4行）を読んでアウトライン完成
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 設問：Step2は「立場を支持する意見2つ + 共通点」（各4択）、Step3は「アウトライン空所」（各4択）
- 正解（Step3）：立場の論理的帰結のみ。感情的に正しそうだが論理的でない選択肢を1つ混ぜる
- passageHtml形式：
  <p><strong>▶ Step 1: Read a range of opinions</strong></p>
  <p><strong>[名前] ([職業])</strong><br>[意見本文]</p>
  （4〜5件繰り返し）
  <p><strong>▶ Step 2: Take a position</strong></p>
  <p>POSITION: [立場の文]</p>
  <p><strong>▶ Step 3: Create an outline</strong></p>
  <p>Introduction: [前提]<br>Body: REASON 1: [ A ] REASON 2: [ B ]<br>Conclusion: [結論]</p>
  <p><strong>Source A</strong></p><p>[追加資料本文]</p>
  <p><strong>Source B (Data)</strong></p><p>[グラフ説明]</p>
`,
  }
```

- [ ] **Step 2: Run build — should now only show errors in API routes**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npm run build 2>&1 | head -40
```

Expected: Only VALID_BOSS_TYPES type errors in `app/api/sample-problem/route.ts` and `app/api/difficulty/route.ts`.

---

## Task 4: Update VALID_BOSS_TYPES in API routes

**Files:**
- Modify: `app/api/sample-problem/route.ts:5`
- Modify: `app/api/difficulty/route.ts:5`

- [ ] **Step 1: Update sample-problem route**

In `app/api/sample-problem/route.ts`, replace line 5:

```typescript
const VALID_BOSS_TYPES = ['short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'] as const
```

- [ ] **Step 2: Update difficulty route**

In `app/api/difficulty/route.ts`, replace line 5:

```typescript
const VALID_BOSS_TYPES = ['short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'] as const
```

- [ ] **Step 3: Run build — should now be clean**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` or similar. Zero TypeScript errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/horota/Claude/private/daughter-study-app && git add lib/types.ts lib/boss-data.ts lib/claude.ts app/api/sample-problem/route.ts app/api/difficulty/route.ts && git commit -m "refactor: restructure 8 boss types to match 2025/2026 共通テスト format"
```

---

## Task 5: Rewrite scripts/seed-problems.ts

**Files:**
- Modify: `scripts/seed-problems.ts` (full rewrite of BOSS_THEMES and typeInstructions)

- [ ] **Step 1: Replace BOSS_THEMES and typeInstructions in seed script**

Replace `scripts/seed-problems.ts` with the following:

```typescript
/**
 * One-time seed script: generates sample problems via Claude API and inserts to Supabase.
 *
 * Run all:        npx tsx scripts/seed-problems.ts
 * Run one type:   BOSS_TYPE=short_text npx tsx scripts/seed-problems.ts
 *
 * Required env vars (from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BOSS_THEMES: Record<string, string[]> = {
  short_text:      ['travel', 'daily_life', 'community', 'business'],
  survey_blog:     ['technology', 'environment', 'daily_life', 'community'],
  short_story:     ['daily_life', 'community', 'travel', 'environment'],
  essay_edit:      ['technology', 'environment', 'business', 'community'],
  multi_doc:       ['travel', 'business', 'daily_life', 'community'],
  long_story:      ['daily_life', 'community', 'travel', 'environment'],
  article_slides:  ['technology', 'environment', 'business', 'community'],
  essay_synthesis: ['technology', 'environment', 'business', 'community'],
}

const DIFFICULTY_LABELS = ['', '易しい', '標準以下', '標準', '標準以上', '難しい']
const VARIANTS = 2

const themeMap: Record<string, string> = {
  travel: '旅行・予約', technology: 'テクノロジー', environment: '環境・自然',
  community: '地域コミュニティ', daily_life: '日常生活', business: 'ビジネス・買い物',
}

function buildPrompt(bossType: string, difficulty: number, theme: string): string {
  const typeInstructions: Record<string, string> = {
    short_text: `
問題タイプ：共通テスト第1問型（短い実用文）
- チラシ・告知・グループチャット・メモのいずれか1種類
- 150語以内の短い実用文
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 設問：本文の目的・条件・日時・場所に関する事実確認（4択）
- 正解：本文に明記されている事実のみ
- 誤答：本文に書いていないが「良さそう」に見える選択肢を1つ含める
passageHtml形式（チラシ例）：<p><strong>[タイトル]</strong></p><p>[本文]</p>
passageHtml形式（チャット例）：<p><strong>Group Chat: [グループ名]</strong></p><p>[名前1]: [発言]</p><p>[名前2]: [発言]</p>`,

    survey_blog: `
問題タイプ：共通テスト第2問型（ブログ記事またはアンケート＋コメント）
- 形式A（ブログ）：200〜250語の段落構成ブログ記事（筆者の意見＋根拠＋具体例）
- 形式B（アンケート）：アンケート結果の数値＋回答者のコメント3〜4件
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 設問：筆者の意見・根拠・アンケート結果の事実確認（4択）
passageHtml形式（ブログ）：<p>段落1</p><p>段落2</p><p>段落3</p>
passageHtml形式（アンケート）：<p><strong>[タイトル]</strong></p><table border="1" style="border-collapse:collapse;width:100%;font-size:0.9em"><tr><th>項目</th><th>回答(%)</th></tr>...</table><p><strong>コメント</strong></p><p>[名前A]: [コメント]</p>`,

    short_story: `
問題タイプ：共通テスト第3問型（短編物語・時系列）
- 200〜280語の短編物語（主人公が複数のイベントを経験する）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 時間・順序を示す表現を4〜5つ含める（yesterday, two days later, the following week 等）
- 設問：本文中の出来事の正しい順序を選ぶ（4択）
- 正解：本文の時間表現を正しく並べた選択肢
- 誤答：出来事の順序が1〜2つ入れ替わっている選択肢を3つ
passageHtml：<p>タグで段落区切り（3〜4段落）
questionText例：「本文中の出来事を起きた順に並べたものとして最も適切なものを選べ」
choicesは (1)→(2)→(3)→(4) の形式で出来事を並べた選択肢（A〜D）`,

    essay_edit: `
問題タイプ：共通テスト第4問型（エッセイ添削）
- 生徒が書いたエッセイ（150〜200語、空所1か所）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 先生のコメント1〜2件（「具体例を追加」「理由を述べる」「対策を提案」等）
- 設問：先生のコメントに基づき空所に入る最適な文を選ぶ（4択）
- 正解：コメントの要求を正確に満たす文
- 誤答：コメントに言及のない情報を含む文
passageHtml形式：<p><strong>Student Essay</strong></p><p>[エッセイ本文（空所は _____ ）]</p><p><strong>Teacher's Comments</strong></p><p>Comment 1: [コメント]</p>`,

    multi_doc: `
問題タイプ：共通テスト第5問型（複数文書）
- 文書1（80〜120語）：チラシ・案内・告知のいずれか
- 文書2（80〜120語）：申込フォーム・返信メール・補足情報のいずれか
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 必ず具体的な数字（日付・料金・条件・定員等）を各文書に含める
- 設問：両文書の情報を照合しないと解けない事実確認（4択）
- 正解：文書1＋文書2の情報を組み合わせた結論
- 誤答：片方の文書だけで導ける「半正解」選択肢を1つ含める
passageHtml形式：<p><strong>Document 1: [タイトル]</strong></p><p>[文書1本文]</p><p><strong>Document 2: [タイトル]</strong></p><p>[文書2本文]</p>`,

    long_story: `
問題タイプ：共通テスト第6問型（長編物語）
- 300〜380語の物語文（明確な感情変化のある主人公）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 感情語（worried / relieved / disappointed / proud / frustrated / grateful 等）を最低3つ含める
- 感情の変化が明確な転換点を1か所以上含める
- 設問：登場人物の心情・行動の理由を問う問題（4択）
- 正解：本文の感情語・行動描写に直接根拠がある選択肢
- 誤答：感情は近いが本文に根拠がない選択肢を1〜2つ含める
passageHtml：<p>タグで段落区切り（4〜5段落）`,

    article_slides: `
問題タイプ：共通テスト第7問型（説明文＋スライド）
- 説明文（400〜500語、5〜6段落）：科学・社会・テクノロジー等のテーマ
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 発表スライド（空所1か所）：説明文の要点を整理したもの
- 設問：スライドの空所に入る最適な語句・文を選ぶ（4択）
- 正解：説明文の対応する段落から直接導ける内容
- 誤答：本文に無い情報または別段落の情報
passageHtml形式：
<p>[段落1]</p><p>[段落2]</p><p>[段落3]</p><p>[段落4]</p><p>[段落5]</p>
<p><strong>Presentation Slides</strong></p>
<p>Slide 1: [見出し1]<br>Slide 2: [見出し2] — [ ]<br>Slide 3: [見出し3]<br>Slide 4: [見出し4]</p>
（スライドの空所は " — [ ]" で表す）`,

    essay_synthesis: `
問題タイプ：共通テスト第8問型（複数意見→立場表明→アウトライン）
- 異なる立場の意見文4件（各60〜100語）
- 追加資料（説明文1件 100〜150語）
- 語彙レベル：高校3年生相当（CEFR A2〜B1が基本、B2単語は文脈ヒント付き）
- 設問1：提示された立場を支持する意見を4件中2件選ぶ（4択）
- 設問2（メインの設問）：追加資料を読んでアウトラインの空所に入る最適な文を選ぶ（4択）
- 正解（設問2）：立場の論理的帰結のみ
- 誤答：感情的に正しそうだが論理的でない選択肢を1つ必ず含める
passageHtml形式：
<p><strong>▶ Opinions</strong></p>
<p><strong>[名前1] ([属性])</strong><br>[意見1本文]</p>
<p><strong>[名前2] ([属性])</strong><br>[意見2本文]</p>
<p><strong>[名前3] ([属性])</strong><br>[意見3本文]</p>
<p><strong>[名前4] ([属性])</strong><br>[意見4本文]</p>
<p><strong>▶ Position: [立場の文]</strong></p>
<p><strong>▶ Additional Source</strong></p><p>[追加資料本文]</p>
<p><strong>▶ Essay Outline</strong></p>
<p>Introduction: [前提]<br>Body: Reason 1: [確定内容] / Reason 2: [ ]<br>Conclusion: [結論]</p>`,
  }

  return `あなたは日本の共通テスト英語問題の専門家です。以下の仕様に厳密に従って問題を生成してください。

テーマ：${themeMap[theme]}
難易度：${DIFFICULTY_LABELS[difficulty]}（${difficulty}/5）
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
  "explanation": "正解の根拠を日本語で3〜4文で説明する（どこに答えがあったか、なぜ他の選択肢が違うか）",
  "trickHint": "この問題で使える裏技のポイントを1文で（日本語）"
}`
}

async function generateOne(bossType: string, difficulty: number, theme: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: buildPrompt(bossType, difficulty, theme) }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')

  return JSON.parse(jsonMatch[0])
}

async function seed() {
  const filterBossType = process.env.BOSS_TYPE ?? null
  const bossesToRun = filterBossType
    ? { [filterBossType]: BOSS_THEMES[filterBossType] }
    : BOSS_THEMES

  if (filterBossType) {
    console.log(`Deleting existing records for boss_type='${filterBossType}'...`)
    const { error } = await supabase.from('sample_problems').delete().eq('boss_type', filterBossType)
    if (error) { console.error(`Delete failed: ${error.message}`); process.exit(1) }
    console.log('Deleted. Starting re-seed...\n')
  }

  let total = 0
  let failed = 0

  for (const [bossType, themes] of Object.entries(bossesToRun)) {
    for (const theme of themes) {
      for (let difficulty = 1; difficulty <= 5; difficulty++) {
        for (let i = 0; i < VARIANTS; i++) {
          total++
          const label = `${bossType}/${theme}/d${difficulty} [${i + 1}/${VARIANTS}]`
          process.stdout.write(`Generating ${label} ... `)
          try {
            const p = await generateOne(bossType, difficulty, theme)
            const { error } = await supabase.from('sample_problems').insert({
              boss_type: bossType,
              theme,
              difficulty,
              passage_html: p.passageHtml,
              question_text: p.questionText,
              choices: p.choices,
              correct_label: p.correctLabel,
              explanation: p.explanation ?? null,
              trick_hint: p.trickHint ?? null,
            })
            if (error) {
              console.log(`DB ERROR: ${error.message}`)
              failed++
            } else {
              console.log('✓')
            }
          } catch (err) {
            console.log(`FAILED: ${err}`)
            failed++
          }
          await new Promise(r => setTimeout(r, 800))
        }
      }
    }
  }

  console.log(`\nDone. ${total - failed}/${total} inserted.`)
  if (failed > 0) console.log(`${failed} failed — re-run with BOSS_TYPE=<type> to retry.`)
}

seed().catch(console.error)
```

- [ ] **Step 2: Commit**

```bash
cd /Users/horota/Claude/private/daughter-study-app && git add scripts/seed-problems.ts && git commit -m "refactor: update seed script for 8 new boss types"
```

---

## Task 6: Create Supabase migration SQL

**Files:**
- Create: `supabase/migrations/006_restructure_boss_types.sql`

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/006_restructure_boss_types.sql`:

```sql
-- 006: Restructure boss types to match 2025/2026 共通テスト format
-- Old types: vocab, grammar, conversation, chart, email, story, multi_source, outline
-- New types: short_text, survey_blog, short_story, essay_edit, multi_doc, long_story, article_slides, essay_synthesis

-- 1. Delete old sample problems (types being replaced)
delete from sample_problems
where boss_type in ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline');

-- 2. Delete old difficulty_state rows for removed types
delete from difficulty_state
where boss_type in ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline');

-- 3. Delete old mastery rows for removed types
delete from mastery
where boss_type in ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline');

-- 4. Delete old sessions rows for removed types (optional: keeps history clean)
delete from sessions
where boss_type in ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline');

-- 5. Update CHECK constraint on sample_problems
alter table sample_problems
  drop constraint if exists sample_problems_boss_type_check;

alter table sample_problems
  add constraint sample_problems_boss_type_check
  check (boss_type in ('short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'));

-- 6. Update CHECK constraint on difficulty_state
alter table difficulty_state
  drop constraint if exists difficulty_state_boss_type_check;

alter table difficulty_state
  add constraint difficulty_state_boss_type_check
  check (boss_type in ('short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'));

-- 7. Update CHECK constraint on mastery
alter table mastery
  drop constraint if exists mastery_boss_type_check;

alter table mastery
  add constraint mastery_boss_type_check
  check (boss_type in ('short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'));

-- 8. Update CHECK constraint on sessions
alter table sessions
  drop constraint if exists sessions_boss_type_check;

alter table sessions
  add constraint sessions_boss_type_check
  check (boss_type in ('short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'));
```

- [ ] **Step 2: Run migration in Supabase Dashboard**

Open: Supabase Dashboard → SQL Editor

Paste and run the entire contents of `supabase/migrations/006_restructure_boss_types.sql`.

Expected result: "Success. No rows returned."

- [ ] **Step 3: Verify constraints in Supabase**

Run this verification query in SQL Editor:

```sql
select boss_type, count(*) from sample_problems group by boss_type order by boss_type;
```

Expected: Empty result (all old records deleted, new ones not yet seeded).

- [ ] **Step 4: Commit migration file**

```bash
cd /Users/horota/Claude/private/daughter-study-app && git add supabase/migrations/006_restructure_boss_types.sql && git commit -m "db: migrate to 8 new boss types (drop old constraints, delete old records)"
```

---

## Task 7: Run seed script for all 8 new types

This seeds 8 types × 4 themes × 5 difficulties × 2 variants = **320 problems**.
Estimated time: ~7–8 minutes. Estimated cost: ~$0.50.

- [ ] **Step 1: Run the seed script**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx tsx scripts/seed-problems.ts
```

Watch the output. Each successful insert shows `✓`. Each failure shows `FAILED:` or `DB ERROR:`.

- [ ] **Step 2: Verify seed counts in Supabase**

Run in Supabase SQL Editor:

```sql
select boss_type, difficulty, count(*) 
from sample_problems 
group by boss_type, difficulty 
order by boss_type, difficulty;
```

Expected: Each boss_type at each difficulty should show count = 4 (4 themes × 1 variant... wait no — it's 4 themes × 2 variants = 8 per boss_type per difficulty). Actually it should be count = 2 per theme/difficulty combo. Let me recalculate:

Per boss_type: 4 themes × 5 difficulties × 2 variants = 40 rows
Total: 8 boss_types × 40 = 320 rows

Expected per `boss_type, difficulty` group: count = 8 (4 themes × 2 variants)

- [ ] **Step 3: If any type failed, reseed it**

```bash
# Example for a failed type:
BOSS_TYPE=article_slides npx tsx scripts/seed-problems.ts
```

---

## Task 8: Build and deploy

- [ ] **Step 1: Final build check**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 2: Deploy to Vercel**

```bash
cd /Users/horota/Claude/private/daughter-study-app && npx vercel --prod
```

- [ ] **Step 3: Smoke test in production**

Open the production URL and verify:
1. Home page shows 8 boss cards with correct names (第1問〜第8問)
2. Click on any boss → Step 1 (裏技) shows the new trick text
3. Click "問題を見る" → Step 2 loads a problem without error
4. Problem text is in readable high-school level English (not overly academic)
5. Difficulty selector still works (やさしく▼ / むずかしく▲)
6. Submit answer → feedback shows correctly
7. "ひとりでやってみる" → Master page loads without error

---

## Self-Review Checklist

- [x] lib/types.ts: BossType has exactly 8 new types
- [x] lib/boss-data.ts: All 8 BOSS_CONFIGS defined with type/name/section/points/timeLimit/trick/trickSteps/example/themes
- [x] lib/claude.ts: typeInstructions has all 8 new types (no old type references)
- [x] API routes: Both VALID_BOSS_TYPES arrays match the 8 new types
- [x] Seed script: BOSS_THEMES has all 8 types, typeInstructions has all 8 prompts with vocabulary level constraint
- [x] Migration: Deletes old records from all 4 tables before adding new constraints
- [x] Migration: Updates constraints on all 4 tables (sample_problems, difficulty_state, mastery, sessions)
- [x] No placeholder text in plan
- [x] Type names are consistent across all files (snake_case, e.g. `essay_synthesis` not `essaySynthesis`)
