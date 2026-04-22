import type { BossConfig, BossRationale } from './types'

export const BOSS_CONFIGS: Record<string, BossConfig> = {
  short_text: {
    type: 'short_text',
    name: '短い実用文（第1問）',
    section: 1,
    points: 6,
    questionCount: 2,
    timeLimit: 90,
    trick: `**タイトルと設問だけ先に読む。本文は全部読まない。**
設問のキーワードが出てくる部分だけを探す。
チラシや告知文は「**日時・場所・条件**」の3つを探すと答えが出ることが多い。`,
    trickSteps: [
      '**設問を先に全部読む**（何を探すか確認）',
      '本文から**キーワードと同じ単語・数字**を探す',
      '本文に書いてある**事実だけ**で選ぶ（「良さそう」に見えるだけの選択肢は罠）',
    ],
    example: {
      scenario: 'イベントのお知らせチラシが出題される。目的を問う設問が多い。',
      en: 'Q: "What is the main purpose of this notice?"',
      questionJa: '→ このお知らせの主な目的は何か？',
      ja: '→ チラシの見出しか最初の文を読む。"to inform / to announce / to remind" など目的語が正解の根拠。',
    },
    themes: ['travel', 'daily_life', 'community', 'business'],
    rationale: {
      points: 6, totalShare: 6, accuracyPct2025: 78, growthPotential: 'low',
      headline: '取り逃がしが最大の損失。',
      rationale: `第1問は配点6点、2025年正答率78%と取りやすい。\nしかし油断して1問落とせば3点を失う。配点単価で見ると軽くない。\n「設問先読み → 数字と日付だけ照合」を徹底すれば、安定して満点が狙える。`,
    },
  },
  survey_blog: {
    type: 'survey_blog',
    name: 'ブログ・アンケート（第2問）',
    section: 2,
    points: 12,
    questionCount: 4,
    timeLimit: 150,
    trick: `**設問を先に全部読んでから**本文を読む。
ブログなら段落ごとの「**テーマ文（最初の文）だけ**」追う。
アンケートなら**数字・割合とコメントの対応**を探す。
筆者の**意見（I think / should）と事実（数字・データ）を分けて**読む。`,
    trickSteps: [
      '**設問を先に全部読む**',
      'ブログ：各段落の**最初の文だけ**を読む（主張がある）',
      'アンケート：**数字・割合**と関連するコメントを照合する',
    ],
    example: {
      scenario: 'アンケート結果を含むブログ記事が出題される。数字と意見の対応を問う設問が多い。',
      en: '"60% of students said they enjoyed the event." → Q: What did most students think?',
      questionJa: '→ 生徒のほとんどはイベントについてどう思ったか？',
      ja: '→ 60% ≒ "most"（大部分）と言い換えられる。数字が選択肢でどう表現されるかに注意。',
    },
    themes: ['technology', 'environment', 'daily_life', 'community'],
    rationale: {
      points: 12, totalShare: 12, accuracyPct2025: 65, growthPotential: 'medium',
      headline: '段落の最初の文だけで、7割解ける。',
      rationale: `第2問は配点12点、正答率65%。アンケートは数字と割合の照合、ブログは各段落の主張文だけを追う。\n本文を全部読む必要はない。言い換え(60% ≒ most / nearly all)に注意する。\nステップを守れば8割以上は取れる。`,
    },
  },
  short_story: {
    type: 'short_story',
    name: '短編物語・時系列（第3問）',
    section: 3,
    points: 9,
    questionCount: 3,
    timeLimit: 180,
    trick: `**時間を表す言葉だけをマーク**：yesterday / two days ago / last night / the next day / the following week。
これを順に並べると**時系列が完成する**。
「正しい順番」問題はこれだけで解ける。`,
    trickSteps: [
      '**時間・順序を示す単語**を全てマーク',
      '登場人物の行動を時系列で�条書きにする',
      '設問の選択肢と**時系列を照合**する',
    ],
    example: {
      scenario: '登場人物の出来事を時系列で追う短編物語。出来事の順番を問う設問が必ず出る。',
      en: '"She met him at the festival. Two days later, she received a letter."',
      questionJa: '→ 彼女はまつりで彼に会い、2日後に手紙を受け取った。',
      ja: '→ "Two days later" が時系列のカギ。festival → letter の順序がここで確定する。',
    },
    themes: ['daily_life', 'community', 'travel', 'environment'],
    rationale: {
      points: 9, totalShare: 9, accuracyPct2025: 71, growthPotential: 'medium',
      headline: '時間の順序を掴めば、物語は解ける。',
      rationale: `第3問は配点9点、正答率71%。"yesterday / two days later" のような時間語だけをマークする。\n登場人物の行動を時系列に並べれば、「正しい順番を選ぶ」設問はそれだけで解ける。\n感情語は後回しで良い。`,
    },
  },
  essay_edit: {
    type: 'essay_edit',
    name: 'エッセイ添削（第4問）',
    section: 4,
    points: 12,
    questionCount: 4,
    timeLimit: 180,
    trick: `**先生のコメントを先に全部読む。**コメントが「**答えのヒント**」そのもの。
英文を直すんじゃなく、コメントの内容と選択肢をマッチングするゲームだ。
**コメントにない情報を追加する選択肢は全部罠。**`,
    trickSteps: [
      '**先生のコメントを先に全部読む**',
      '各コメントが「**何を求めているか**」を1語でメモする（例：具体例・理由・対策）',
      '**そのコメントを満たす選択肢だけ**を選ぶ（本文は後から確認）',
    ],
    example: {
      scenario: '生徒が書いた英文エッセイに先生がコメントをつけた問題。コメントに合う文を選ぶ。',
      en: 'Teacher\'s comment: "Add a specific example here."',
      questionJa: '→ 先生のコメント：「ここに具体的な例を追加してください」',
      ja: '→ 「具体例＝数字・固有名詞」と覚える。コメントにない情報を足す選択肢はすべて罠。',
    },
    themes: ['technology', 'environment', 'business', 'community'],
    rationale: {
      points: 12, totalShare: 12, accuracyPct2025: 58, growthPotential: 'high',
      headline: 'コメントを読めば、答えが書いてある。',
      rationale: `第4問は配点12点、正答率58%。半数近くが落としている。\n先生のコメントそのものが答えのヒント。\n「具体例を追加せよ」とあれば、数字や固有名詞のある選択肢が正解。コメントにない情報を足す選択肢は罠。`,
    },
  },
  multi_doc: {
    type: 'multi_doc',
    name: '複数文書を読む問題（第5問）',
    section: 5,
    points: 16,
    questionCount: 4,
    timeLimit: 240,
    trick: `チラシ・フォーム・メール、**どれを読むか設問で先に決める**。
設問のキーワードが出てくる文書だけを読む。
**数字（日付・料金・条件）**が正解の根拠になることが多い。
**複数の文書を組み合わせ**ないと解けない設問が必ず1つある。`,
    trickSteps: [
      '設問を先に全部読む',
      '各設問に関係する文書を特定する（チラシ？フォーム？メール？）',
      '**複数文書を組み合わせる設問**を最後に読む（一番難しいので後回し）',
    ],
    example: {
      scenario: 'チラシ・フォーム・メールなど複数の文書を読み比べる問題。文書をまたいだ情報の照合が必要。',
      en: 'Leaflet: "Open Mon–Fri only." / Form submitted: Saturday',
      questionJa: '→ このフォームの提出は、チラシの規則を満たしているか？',
      ja: '→ チラシ（月〜金のみ）とフォーム（土曜提出）を照合する。1つの文書だけでは解けない設問がこのボスの本質。',
    },
    themes: ['travel', 'business', 'daily_life', 'community'],
    rationale: {
      points: 16, totalShare: 16, accuracyPct2025: 52, growthPotential: 'high',
      headline: '数字だけ見ればいい、は根拠のある近道。',
      rationale: `第5問は配点16点、2025年正答率52%。半分近くが落としている。\nステップ通りに「日付・時間・金額・条件」だけをマークし、複数文書の数字を照合する。\nこれだけで7割は確保できる。本文全体を読む必要はない。`,
    },
  },
  long_story: {
    type: 'long_story',
    name: '長編物語・読解（第6問）',
    section: 6,
    points: 12,
    questionCount: 4,
    timeLimit: 300,
    trick: `**第1段落と最終段落を先に読む。**登場人物の**感情語（worried / relieved / disappointed / proud 等）を全てマーク**。
心情・行動の理由を問う設問の答えは、**その感情語の前後**に必ずある。`,
    trickSteps: [
      '**第1段落**：誰が・どんな状況かをつかむ',
      '**最終段落**：どう変わったか（解決・未解決）を確認',
      '**感情・心情を表す単語をマーク**しながら本文を読む',
    ],
    example: {
      scenario: '登場人物の心情変化を追う長編物語。感情がどう変わったかを問う設問が必ず出る。',
      en: '"She had been nervous, but now she felt relieved."',
      questionJa: '→ 彼女はずっと緊張していたが、今は安心していた。',
      ja: '→ nervous（緊張）→ relieved（安心）の変化がここで示されている。「なぜ変わったか」の理由がこの文の前後にある。',
    },
    themes: ['daily_life', 'community', 'travel', 'environment'],
    rationale: {
      points: 12, totalShare: 12, accuracyPct2025: 55, growthPotential: 'medium',
      headline: '感情の変化だけ追えば、長編は短くなる。',
      rationale: `第6問は配点12点、正答率55%。\n第1段落と最終段落だけ先に読み、"nervous → relieved" のような感情の変化をマークする。\n心情の理由を問う設問は、その感情語の前後に必ず答えがある。`,
    },
  },
  article_slides: {
    type: 'article_slides',
    name: '説明文＋スライド（第7問）',
    section: 7,
    points: 16,
    questionCount: 4,
    timeLimit: 360,
    trick: `**スライドの空欄を先に全部確認。**空欄のテーマが本文の何段落目かを予測してから読む。
筆者の主張は**最初か最後の段落**、具体例は中間段落にある。
スライドと本文の「**対応**」を探すパズルだ。`,
    trickSteps: [
      '**スライドの空欄を先に全部読む**（何を探すか確認）',
      '各空欄に**対応する本文の段落を特定**する',
      '段落の最初の文だけ読んで、空欄に合うかを確認する',
    ],
    example: {
      scenario: '説明文の記事とプレゼンスライドがセットで出題される。スライドの空欄を記事から補う。',
      en: 'Slide: "Benefit 1: [ 32 ]" / Article: "One benefit is that it saves time."',
      questionJa: '→ スライド「メリット1：〔　〕」の空欄に入る語句は何か？',
      ja: '→ スライドの "Benefit 1" と記事の "One benefit is..." が対応している。空欄テーマを先に確認して読む場所を絞る。',
    },
    themes: ['technology', 'environment', 'business', 'community'],
    rationale: {
      points: 16, totalShare: 16, accuracyPct2025: 49, growthPotential: 'high',
      headline: 'スライドが、本文の地図になる。',
      rationale: `第7問は配点16点、正答率49%。半分以上が落としている。\nスライドの空欄を先に全部読み、対応する本文段落を特定する。\n「空欄のテーマ = 段落の最初の文」で対応関係を作れば、本文は読む場所が絞られる。`,
    },
  },
  essay_synthesis: {
    type: 'essay_synthesis',
    name: '意見を読んでまとめる（第8問）',
    section: 8,
    points: 17,
    questionCount: 4,
    timeLimit: 420,
    trick: `**ステップを飛ばさない。**①意見を読む→②**立場を選ぶ**→③その立場を支持する**意見を2つ探す**→④追加資料でアウトラインを完成させる。
アウトラインの答えは「**選んだ立場の論理的帰結**」。感情的に正しそうな選択肢が罠。`,
    trickSteps: [
      '各意見を読んで「**賛成派・反対派**」をメモする（30秒）',
      '選んだ立場を支持する意見2つの「**共通点**」を探す',
      '追加資料は**アウトラインの空欄に直接対応する部分だけ**を読む',
    ],
    example: {
      scenario: '複数の人物が異なる意見を述べる文章を読み、アウトラインを完成させる問題。',
      en: 'Jack: "Technology improves sports." / Tamara: "I agree that technology helps athletes."',
      questionJa: '→ JackとTamaraの共通の主張は何か？',
      ja: '→ 2人とも「技術がスポーツ・選手を向上させる」と言っている。この共通点がアウトラインの空欄に入る。感情的に正しそうな選択肢が罠。',
    },
    themes: ['technology', 'environment', 'business', 'community'],
    rationale: {
      points: 17, totalShare: 17, accuracyPct2025: 47, growthPotential: 'high',
      headline: '17点、正答率47.1%。ここで勝負が決まる。',
      rationale: `第8問は配点17点で英語全体の17%、2025年正答率47.1% — 半分以上が落としている。\nこの1問を取れるかで合否が分かれる最重要ボス。\nステップ通りに「立場選定 → 根拠2点 → 資料で補完」を回せば、正答率は大きく跳ね上がる。\nだからこのアプリは第8問から始めることを薦める。`,
    },
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
