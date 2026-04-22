# AI先生チャット — 設計仕様書

## 概要

共通テスト英語アプリ全ページに、Claude Haiku 4.5 を使ったインラインチャットウィジェットを追加する。七海さんが問題を解きながら、または学習中にいつでも「なにが分からない？」と聞ける仕組み。会話履歴は自動要約してSupabaseに蓄積し、将来の1ポイントレッスン生成に活用する。

---

## UI設計

### ボタン（閉じた状態）
- テキスト: `✦ AI先生に質問する`
- スタイル: `border: 1px solid var(--ink)` のアウトラインボタン（Quiet Luxe スタイル）
- 配置:
  - **問題ページ** (practice/step2): `ProblemPanel` 内、問題文の下
  - **Mapページ / その他全ページ**: ページ下部（コンテンツ末尾）

### チャットパネル（開いた状態）
- ボタンがその場でインライン展開（ボトムシートではなくB案）
- 構成（上から）:
  - ヘッダー: `✦ AI先生` （左）、`▲ 閉じる` （右）
  - メッセージ一覧: AIの返答はベージュ背景バブル、ユーザーは右寄せ
  - 入力欄: アンダーライン形式、プレースホルダー「なにが分からない？」
  - 送信ボタン: `↑` アイコン（インク色）
- フォント: `var(--mincho)` で日本語読みやすく
- 閉じる時: 会話を自動要約してDBに保存

---

## コンテキスト（ページ別）

| ページ | AIに渡す情報 |
|--------|------------|
| practice / step2 | 問題文HTML・設問テキスト・boss_type |
| Map / その他 | 「共通テスト英語の学習中」のみ |

---

## APIエンドポイント

### `POST /api/ai-teacher`
チャット返答を生成する。

**リクエスト:**
```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "context": {
    "pageType": "problem" | "map" | "general",
    "bossType": "short_text" | null,
    "passageHtml": "<p>...</p>" | null,
    "questionText": "..." | null
  }
}
```

**処理:**
- モデル: `claude-haiku-4-5-20251001`
- max_tokens: 512
- システムプロンプト: 七海さん（高校生）に合わせた優しい日本語、300文字以内
- passageHtml から HTML タグを除去してから渡す

**レスポンス:**
```json
{ "reply": "..." }
```

---

### `POST /api/ai-teacher/summarize`
会話終了時（チャットを閉じる時）に呼ばれ、要約をDBに保存する。

**リクエスト:**
```json
{
  "messages": [{ "role": "user"|"assistant", "content": "..." }],
  "context": {
    "pageType": "problem" | "map" | "general",
    "bossType": "short_text" | null
  }
}
```

**処理:**
- Haiku で会話を1〜2文に要約
- `ai_teacher_logs` テーブルに保存

---

## データベース

### 新テーブル: `ai_teacher_logs`

```sql
-- supabase/migrations/010_ai_teacher_logs.sql
CREATE TABLE ai_teacher_logs (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  page_type   text NOT NULL CHECK (page_type IN ('problem', 'map', 'general')),
  boss_type   text,
  summary     text NOT NULL
);

CREATE INDEX ON ai_teacher_logs (user_id, created_at DESC);
```

### 直近ログの活用
チャット起動時、`ai_teacher_logs` から直近5件の要約を取得し、システムプロンプトに注入する。

```
この生徒の最近の学習メモ:
- essay_edit: 修飾語の位置が分からなかった
- short_text: "availability" の意味を聞いた
```

---

## ファイル構成

```
components/ai-teacher/
  AiTeacherChat.tsx       # メインチャットUI（ボタン+インライン展開）

app/api/ai-teacher/
  route.ts                # チャット返答 API
  summarize/
    route.ts              # 要約+DB保存 API

supabase/migrations/
  010_ai_teacher_logs.sql # 新テーブル

lib/types.ts              # AiTeacherContext 型を追加
```

---

## 実装順序

1. `010_ai_teacher_logs.sql` migration 作成
2. `AiTeacherContext` 型を `lib/types.ts` に追加
3. `/api/ai-teacher` エンドポイント実装
4. `/api/ai-teacher/summarize` エンドポイント実装
5. `AiTeacherChat.tsx` コンポーネント実装
6. `ProblemPanel.tsx` にボタン追加（問題コンテキスト付き）
7. `app/page.tsx`（Map）にボタン追加（一般コンテキスト）
8. その他ページ（about, wakaranai 等）にボタン追加

---

## コスト見積もり

- Haiku 4.5: 入力 $0.80/MTok、出力 $4.00/MTok
- 1回の質問: 約500トークン入力 + 200トークン出力 → 約$0.0012
- 七海さんが1日10回使っても約$0.012/日 → 月$0.36程度
