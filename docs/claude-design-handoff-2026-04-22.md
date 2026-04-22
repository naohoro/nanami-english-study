# Claude Design Handoff — 2026-04-22

> このドキュメントは Claude Design 向けの最新実装スナップショットです。
> GitHub（naohoro/nanami-english-study）への移管以降、Claude Code が追加・変更した内容を網羅しています。

---

## 1. アプリ概要

**名前：** 共通テスト英語 完全対策
**目的：** 答えファースト学習法で共通テスト英語を最短攻略
**ターゲット：** 日本の高校生（特にADHDフレンドリーな設計）
**デバイス：** スマートフォン専用（max-width: 448px / 672px / 768px で中央揃え）

---

## 2. デザイントークン（globals.css より）

```css
--cream:          #FAF7F4   /* 背景色 */
--burgundy:       #8C1A4B   /* プライマリ（ボタン・見出し） */
--burgundy-dark:  #6E1239   /* ホバー等 */
--burgundy-light: #F8EDF4   /* バーガンディの薄い背景 */
--gold:           #B8922E   /* セカンダリ（コツ・ヒント） */
--gold-light:     #FBF5E6   /* ゴールドの薄い背景 */
--border:         #E8DDD5   /* 区切り線 */
```

**フォント：**
- UI全体：Geist（Google Fonts / sans-serif）
- 日本語読み物：`.font-mincho`（Hiragino Mincho Pro / Yu Mincho / Noto Serif JP）
- 英語本文：`.passage-english`（Georgia / Times New Roman、line-height: 1.8）

**背景色：** `#FAF7F4`（クリーム）
**本文色：** `#1A1A1A`
**サブテキスト：** `#787878`

---

## 3. ページ構成（全ルート）

| URL | 役割 | 種別 |
|---|---|---|
| `/login` | メールアドレス認証（Supabase Auth） | static |
| `/onboarding` | 初回のみ。3枚スライド説明 | static |
| `/` | マップ（問題タイプ一覧） | dynamic |
| `/boss/[type]` | STEP 1：コツを読む | dynamic |
| `/boss/[type]/step2` | STEP 2：答えを確認しながら解く | dynamic |
| `/master/[type]` | STEP 3：一人でやってみる | dynamic |
| `/wakaranai` | どこがわからない？（つまずきサポート） | static |
| `/cleared` | クリア画面 | static |
| `/about` | **未実装**（フェーズ2予定） | — |

---

## 4. ユーザーフロー（全体）

```
ログイン → オンボーディング（初回のみ）
         ↓
      マップ（/）
      ├─ ガチの裏技情報バナー → /about（未実装）
      └─ 問題カードをタップ
              ↓
         STEP 1：コツページ（/boss/[type]）
         ├─ TrickPanel（コツ・3ステップ・例）
         ├─ 「なんでか見る」折りたたみ（配点データ・攻略根拠）  ← NEW
         └─ 「わかった！問題を見る →」
              ↓
         STEP 2：練習（/boss/[type]/step2）
         ├─ 難易度セレクター（1〜5）
         ├─ trickHint（金色ボックス）
         ├─ ProblemPanel
         │   ├─ 問題文（英語 / 日本語切替）
         │   └─ 各問ごとに：
         │       ├─ 選択肢（A/B/C/D）
         │       ├─ JP/EN翻訳ボタン
         │       ├─ 💡ヒント（本文ハイライト）
         │       └─ 先に答えを見て考えるボタン
         ├─ 「回答を見る →」（全問選択後に有効）
         └─ 正解表示後：
             ├─ 「どこがわからない？」→ /wakaranai
             └─ 「わかった！ひとりでやってみる →」
                      ↓
              STEP 3：マスター（/master/[type]）
              ├─ ノーヒントで解く（同形式）
              ├─ 全問正解 → /cleared?bossType=...
              └─ 間違い → もう一度
                      ↓
              クリア画面（/cleared）
              ├─ 🎉 できた！
              ├─ 他の問題に挑戦する →
              ├─ ⚡ この問題の裏技を確認する  ← NEW
              └─ もう一度やってみる
```

---

## 5. 移管後に追加した機能（Claude Code 追加分）

### 5-1. 「なんでか見る」折りたたみ（案A）

**場所：** `/boss/[type]` — TrickPanelの直下

**デザイン仕様：**
- トグルボタン：`background: #1A1A1A`、`color: #FFD700`（金）
- 展開エリア：`background: #1A1A1A`、テキスト `color: #F5F5F5`
- ラベル：`⚡ なんでか見る` ／ `▲ 閉じる`

**内容（各問ごとに異なる）：**
- 配点・2025年度正答率・攻略根拠の3要素をセットで表示
- 例（第8問）：「配点17点 = 英語全体の17%がこの1問に集中。2025年度全受験生の正答率：47.1%（半分以上が落としてる）。でも「ステップ通りに解く」だけで正答率が激上がりする。だからこのアプリは第8問から始める。」

**URL連動：** `/boss/[type]?rationale=open` でページ読み込み時に自動展開

---

### 5-2. 「ガチの裏技情報」バナー（案B）

**場所：** マップ（`/`） — ProgressBannerの直上

**デザイン仕様：**
- `background: #1A1A1A`、左テキスト `color: #FFD700`、右テキスト `color: #888`
- 左：`⚡ ガチの裏技情報`
- 右：`共通テストの攻略データを見る →`
- リンク先：`/about`（フェーズ2で実装予定、現在は404）

---

### 5-3. 「この問題の裏技を確認する」ボタン（案C）

**場所：** クリア画面（`/cleared`）

**デザイン仕様：**
- 「他の問題に挑戦する」（バーガンディ）の直下
- `background: #1A1A1A`、`color: #FFD700`
- ラベル：`⚡ この問題の裏技を確認する`
- 遷移先：`/boss/${bossType}?rationale=open`（rationale 自動展開）

---

## 6. 共通UIコンポーネント

| コンポーネント | 役割 | 主なスタイル |
|---|---|---|
| `BottomButton` | 主要CTA | バーガンディ or グレー（variant="secondary"） |
| `TrickPanel` | コツ・ステップ・例 | 金色ボックス / 白ボックス / バーガンディ薄ボックス |
| `ProblemPanel` | 問題文・設問 | 白背景、答え後は緑/赤フィードバック |
| `AnswerReveal` | 全体正解まとめ | 全問正解グリーン / 部分正解 |
| `WakaranaiButton` | つまずきサポート | グレー系 |
| `LoadingSpinner` | ローディング | バーガンディ系 |
| `ProblemTimer` | カウントアップタイマー | 目標時間超過で赤 |
| `ProgressBanner` | あなたの進捗 | クリア数表示 |
| `MapCard` | 問題カード | ステータス（untouched/in_progress/cleared）で色変化 |

---

## 7. フェーズ2 予定（未実装）

### `/about`ページ

Claude Design との相談を経て実装予定。コンテンツ骨格は `docs/about-page-content-draft.md` に存在。

**予定コンテンツ：**
1. 共通テスト英語の構成（第1〜8問・配点・時間配分テーブル）
2. なぜ第8問から？（17点の重さ・正答率データ・最短攻略の根拠）
3. 答えファーストとは？（学習法の説明）
4. このアプリの使い方（3ステップ）
5. よくある疑問（Q&A）

**マップとの接続案：**
- ガチの裏技情報バナー（実装済み）→ ここがエントリーポイント
- 初回ログイン後「先にこれを読む？」選択肢（強制しない）

---

## 8. 実装上の注意事項

- **Supabase Auth**：メール認証のみ。ユーザーメタデータに `onboarding_done: true` を持つ
- **難易度状態**：`difficulty_state` テーブルでユーザー × ボスタイプごとに管理（デフォルト：レベル1）
- **サンプル問題**：`sample_problems` テーブルに40問格納済み（8タイプ × 5難易度）
- **多問形式**：各問題は `questions[]`（4問）+ `passageHtml` + `scenario` の構造
- **sessionStorage**：step2 → master のデータ連携に使用（`currentProblem`）

---

> 最終更新：2026-04-22
> 作成：Claude Code（naohoro/nanami-english-study リポジトリ基準）
