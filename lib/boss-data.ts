import type { BossConfig } from './types'

export const BOSS_CONFIGS: Record<string, BossConfig> = {
  vocab: {
    type: 'vocab',
    name: '語彙・発音問題',
    section: 1,
    points: 8,
    timeLimit: 90,
    trick: `発音問題は「母音」だけ見る。a/e/i/o/u の読み方が違うものが正解。
アクセント問題は「動詞は後ろ・名詞は前」のルールが多い。
4つ中3つが同じグループ、1つだけ仲間外れ。`,
    trickSteps: [
      '各単語の母音（a/e/i/o/u）の発音を声に出して確認',
      'アクセント問題は動詞か名詞かで振り分ける',
      '3つが同じグループに入る → 残りが正解',
    ],
    example: {
      en: 'A. w-o-rk  B. w-o-rd  C. w-o-man  D. w-o-rld → A/B/D は "ər" 、C は "ʊ"',
      ja: '→ Cが仲間外れ。母音の音が違うから。',
    },
    themes: ['daily_life', 'technology', 'community', 'environment'],
  },
  grammar: {
    type: 'grammar',
    name: '文法・語法問題',
    section: 2,
    points: 20,
    timeLimit: 120,
    trick: `空所の前後だけ見る。全文を読まない。
パターンは3つ：①動詞の形（時制・態）②前置詞 ③接続詞・関係詞。
空所の直前が名詞なら関係詞、動詞なら副詞、前置詞なら名詞形を選べ。`,
    trickSteps: [
      '空所の直前の語を見る（品詞のヒントがある）',
      '空所の直後の語を見る（動詞か名詞か確認）',
      '文の主語と時制を確認して形を決める',
    ],
    example: {
      en: '"The report ___ by the team last week." → "was written" (受動態+過去時制)',
      ja: '→ last week → 過去、by the team → 受動態と見抜けば一発。',
    },
    themes: ['business', 'daily_life', 'technology', 'community'],
  },
  conversation: {
    type: 'conversation',
    name: '会話文読解',
    section: 3,
    points: 15,
    timeLimit: 180,
    trick: `空所の「直前の発言」と「直後の発言」だけ読む。
会話の流れ：質問→答え、依頼→承諾/断り、感謝→反応。
「え？本当に？」などの驚きに続く選択肢は理由か情報。`,
    trickSteps: [
      '空所の直前の発言：何を求めているか（質問/依頼/感謝）',
      '空所の直後の発言：それへの反応は自然か確認',
      '会話の「返し」として最も自然なものを選ぶ',
    ],
    example: {
      en: 'A: "Could you help me with this?" B: [  ] A: "That\'s great, thank you!"',
      ja: '→ AがThanksと言っているからBは承諾。拒否の選択肢は即除外。',
    },
    themes: ['daily_life', 'travel', 'community', 'business'],
  },
  chart: {
    type: 'chart',
    name: '図表・グラフ読み取り',
    section: 4,
    points: 12,
    timeLimit: 210,
    trick: `タイトルと軸のラベルだけ先に読む。グラフを全部読まない。
設問の数字・順位・割合に関係するデータだけを探す。
選択肢の「最大・最小・増加・減少」という言葉と図表を照合する。`,
    trickSteps: [
      'グラフのタイトル・縦軸・横軸のラベルを確認',
      '設問のキーワード（最も多い/増えている/減っている）を抽出',
      '選択肢の数値・比較表現とグラフのデータを照合',
    ],
    example: {
      en: 'Q: "Which year showed the largest increase?" → Find the steepest upward slope.',
      ja: '→ 全年のデータを読まなくていい。増加幅が一番急なところだけ見る。',
    },
    themes: ['technology', 'environment', 'business', 'community'],
  },
  email: {
    type: 'email',
    name: 'メールを読んで答える問題',
    section: 5,
    points: 16,
    timeLimit: 240,
    trick: `メールで読むのは2つだけ：①最後の一文（結論）②数字（日付・時間・金額）。
この2つを見つければ答えが出る。本文を全部読もうとしない。`,
    trickSteps: [
      'メールの最後の1文だけ読む（そこに結論がある）',
      '数字・日付・金額だけをさっと拾う',
      '選択肢と照合する',
    ],
    example: {
      en: '"Please reply by Friday, April 25." → Q: When is the deadline?',
      ja: '→ 数字「April 25」を見つければ即答できる。本文全部読む必要なし。',
    },
    themes: ['travel', 'business', 'daily_life', 'community'],
  },
  story: {
    type: 'story',
    name: '物語・長文読解',
    section: 6,
    points: 24,
    timeLimit: 480,
    trick: `第1段落と最終段落を先に読む。登場人物の「変化」を追う。
感情語（worried / relieved / disappointed / surprised）を全てマークする。
設問の答えは「感情の変化」か「行動の理由」のどちらか。`,
    trickSteps: [
      '第1段落：誰が・どんな状況かをつかむ',
      '最終段落：どう変わったか（解決・未解決）を確認',
      '感情・心情を表す単語をマークしながら本文を読む',
    ],
    example: {
      en: '"She had been nervous, but now she felt relieved." → Change: nervous → relieved',
      ja: '→ 感情の変化を問う設問はここが正解の根拠。',
    },
    themes: ['daily_life', 'community', 'travel', 'environment'],
  },
  multi_source: {
    type: 'multi_source',
    name: '複数資料の統合問題',
    section: 7,
    points: 30,
    timeLimit: 540,
    trick: `3〜4つ資料があっても設問と関係する資料は1〜2つだけ。
設問を先に全部読んで、必要な資料だけを読む。
「資料Aと資料Bの両方に書かれている」ことが正解になることが多い。`,
    trickSteps: [
      '設問を先に全部読む（何を聞かれているか把握）',
      '設問のキーワードが出てくる資料だけを探す',
      '複数資料に共通して書かれている内容が正解のポイント',
    ],
    example: {
      en: 'Resource A says "open 9-5", Resource B says "closed on Sundays" → Q: When can you visit?',
      ja: '→ 両方の情報を合わせて「日曜以外の9〜17時」が正解。',
    },
    themes: ['technology', 'environment', 'business', 'community'],
  },
  outline: {
    type: 'outline',
    name: '資料を読んでまとめる問題',
    section: 8,
    points: 17,
    timeLimit: 360,
    trick: `資料1の「問題」＋資料2の「解決策」→ 答えは「だからこうなる」という選択肢。
「良さそう」に見えるけど文章に書いていない選択肢が必ず1つ混じってる。それが罠。
文章に書いてあることだけで選べ。`,
    trickSteps: [
      '資料1の「困っていること」を1行でまとめる',
      '資料2の「その解決方法」を1行でまとめる',
      '「だから〜になる」という文を作る → それに一番近い選択肢を選ぶ',
    ],
    example: {
      en: 'Resource 1: Cities have too much waste. Resource 2: Monthly reports helped people reduce waste by 20%.',
      ja: '→ 正解は「ゴミが減った」系の選択肢。「住民が幸せになった」は文章にないから罠。',
    },
    themes: ['technology', 'environment', 'community', 'daily_life'],
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
