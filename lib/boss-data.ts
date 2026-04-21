import type { BossConfig } from './types'

export const BOSS_CONFIGS: Record<string, BossConfig> = {
  short_text: {
    type: 'short_text',
    name: '短い実用文（第1問）',
    section: 1,
    points: 6,
    questionCount: 2,
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
    questionCount: 4,
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
    questionCount: 3,
    timeLimit: 180,
    trick: `時間を表す言葉だけをマーク：yesterday / two days ago / last night / the next day / the following week。
これを順に並べると時系列が完成する。
「正しい順番」問題はこれだけで解ける。`,
    trickSteps: [
      '時間・順序を示す単語を全てマーク',
      '登場人物の行動を時系列で�条書きにする',
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
    questionCount: 4,
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
    questionCount: 4,
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
    questionCount: 4,
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
    questionCount: 4,
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
    questionCount: 4,
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
