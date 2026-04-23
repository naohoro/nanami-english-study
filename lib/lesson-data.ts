import type { BossType } from './types'

export interface LessonOption {
  k: string
  label: string
  correct: boolean
}

export interface LessonCard {
  id: string
  categoryId: string
  word: string
  prompt: string
  options: LessonOption[]
  meaningJa: string
  core: string
  exampleEn: string
  exampleJa: string
  bossHint: string
  bossWhere: string
  nextWord?: string
  nextTeaser?: string
}

export interface LessonCategory {
  id: string
  bossType: BossType
  title: string
  words: string
  level: number
  cards: LessonCard[]
}

export const LESSON_CATEGORIES: LessonCategory[] = [
  {
    id: 'but',
    bossType: 'short_text',
    title: 'でも・しかし系の言葉',
    words: 'However, Yet, Although, Nevertheless',
    level: 1,
    cards: [
      {
        id: 'but-1',
        categoryId: 'but',
        word: 'However',
        prompt: 'この後に続く文は、前の文と比べてどんな内容？',
        options: [
          { k: 'A', label: '同じ方向のこと（だから〜）', correct: false },
          { k: 'B', label: '反対のこと（でも〜）', correct: true },
          { k: 'C', label: 'まったく別の話題', correct: false },
        ],
        meaningJa: 'でも・しかし・それでも',
        core: '前の文と逆のことが続くサイン。',
        exampleEn: '"It was raining. However, they went outside."',
        exampleJa: '「雨が降っていた。それでも、彼らは外に出た。」',
        bossHint: 'お知らせ文で however が出たら、前の文と逆の情報が来ます。',
        bossWhere: '第1問に出やすい',
        nextWord: 'Yet',
        nextTeaser: 'However と似ているようで、少し違う。',
      },
      {
        id: 'but-2',
        categoryId: 'but',
        word: 'Yet',
        prompt: 'この後に続く文は、前の文と比べてどんな内容？',
        options: [
          { k: 'A', label: '反対のこと（でも〜）', correct: true },
          { k: 'B', label: '同じ方向のこと（だから〜）', correct: false },
          { k: 'C', label: '追加の情報（さらに〜）', correct: false },
        ],
        meaningJa: 'それでも・しかし',
        core: 'however と同じく逆接。ただし「予想に反して」というニュアンスが強い。',
        exampleEn: '"She was tired. Yet, she kept working."',
        exampleJa: '「彼女は疲れていた。それでも働き続けた。」',
        bossHint: 'yet は文頭に来ることが多く、予想外の展開を示すサイン。',
        bossWhere: '第1問に出やすい',
        nextWord: 'Although',
        nextTeaser: '文の途中で逆接をつなぐ言葉。',
      },
      {
        id: 'but-3',
        categoryId: 'but',
        word: 'Although',
        prompt: '"Although it was cold, ___" — 空欄にくる内容は？',
        options: [
          { k: 'A', label: '寒さについての追加説明', correct: false },
          { k: 'B', label: '寒さと逆のこと（外に出た、など）', correct: true },
          { k: 'C', label: '寒さの原因', correct: false },
        ],
        meaningJa: '〜だけれども・〜にもかかわらず',
        core: '文の中で逆接をつなぐ。although 節の後に、予想と逆の内容が来る。',
        exampleEn: '"Although it was cold, they went for a walk."',
        exampleJa: '「寒かったけれど、彼らは散歩に出かけた。」',
        bossHint: 'although は文頭に来ることが多い。後半に「意外な行動」が来たら根拠になる。',
        bossWhere: '第1問・第3問に出やすい',
      },
    ],
  },
  {
    id: 'so',
    bossType: 'short_text',
    title: 'だから・なので系の言葉',
    words: 'Therefore, Thus, As a result, Hence',
    level: 1,
    cards: [
      {
        id: 'so-1',
        categoryId: 'so',
        word: 'Therefore',
        prompt: 'この後に続く文は、前の文と比べてどんな関係？',
        options: [
          { k: 'A', label: '前の文の結果・結論', correct: true },
          { k: 'B', label: '前の文と逆のこと', correct: false },
          { k: 'C', label: '前の文に関係ない話', correct: false },
        ],
        meaningJa: 'だから・それゆえ・したがって',
        core: '前の文が「理由」、therefore の後が「結論・結果」。',
        exampleEn: '"She studied hard. Therefore, she passed the exam."',
        exampleJa: '「彼女は懸命に勉強した。だから、試験に合格した。」',
        bossHint: 'therefore の後が設問の正解根拠になることが多い。',
        bossWhere: '第1問・第6問に出やすい',
      },
    ],
  },
  {
    id: 'feel',
    bossType: 'long_story',
    title: '気持ちを表す言葉',
    words: 'disappointed, relieved, frustrated, eager',
    level: 1,
    cards: [
      {
        id: 'feel-1',
        categoryId: 'feel',
        word: 'relieved',
        prompt: 'この人の気持ちに近いのはどれ？',
        options: [
          { k: 'A', label: 'ほっとした・安心した', correct: true },
          { k: 'B', label: 'がっかりした・失望した', correct: false },
          { k: 'C', label: 'いらいらした・もどかしい', correct: false },
        ],
        meaningJa: 'ほっとした・安心した',
        core: '心配していたことが解消されたときの「ほっとした」感覚。',
        exampleEn: '"She was relieved to hear the good news."',
        exampleJa: '「彼女はその良いニュースを聞いてほっとした。」',
        bossHint: '第7問（長い物語）では登場人物の感情変化が設問になる。relieved はネガティブ→ポジティブの転換点。',
        bossWhere: '第7問に出やすい',
      },
    ],
  },
  {
    id: 'compare',
    bossType: 'essay_synthesis',
    title: 'どちらが〜かを表す言葉',
    words: 'rather than, as ... as, unlike, compared',
    level: 1,
    cards: [
      {
        id: 'compare-1',
        categoryId: 'compare',
        word: 'rather than',
        prompt: '"She chose reading rather than watching TV" — この文の意味は？',
        options: [
          { k: 'A', label: 'テレビを見る代わりに本を読んだ', correct: true },
          { k: 'B', label: 'テレビを見ながら本も読んだ', correct: false },
          { k: 'C', label: '本を読むよりテレビが好き', correct: false },
        ],
        meaningJa: '〜よりもむしろ・〜の代わりに',
        core: '2つの選択肢を比べて、前者を選んだことを示す。',
        exampleEn: '"She chose reading rather than watching TV."',
        exampleJa: '「彼女はテレビを見る代わりに読書を選んだ。」',
        bossHint: '第8問（意見論述）でよく出る比較表現。筆者の主張がどちら寄りかを読み取るヒント。',
        bossWhere: '第8問に出やすい',
      },
    ],
  },
  {
    id: 'intent',
    bossType: 'survey_blog',
    title: '文書が何を伝えたいか',
    words: 'claim, suggest, argue, imply, conclude',
    level: 1,
    cards: [
      {
        id: 'intent-1',
        categoryId: 'intent',
        word: 'suggest',
        prompt: '"The data suggests that..." — 筆者はどのくらい確信を持って言っている？',
        options: [
          { k: 'A', label: '「〜かもしれない」くらいの弱い主張', correct: true },
          { k: 'B', label: '「絶対に〜だ」という強い断言', correct: false },
          { k: 'C', label: '誰かの意見を引用している', correct: false },
        ],
        meaningJa: '〜を示唆する・〜かもしれないと示す',
        core: 'suggest は断定ではなく「〜の可能性を示す」弱い表現。',
        exampleEn: '"The data suggests that exercise improves mood."',
        exampleJa: '「データは運動が気分を改善することを示唆している。」',
        bossHint: '第2問（調査・ブログ）では筆者の主張の強さを問う設問が出やすい。suggest ≠ prove（証明）。',
        bossWhere: '第2問に出やすい',
      },
    ],
  },
]

export function getLessonCategory(id: string): LessonCategory | undefined {
  return LESSON_CATEGORIES.find(c => c.id === id)
}

export function getLessonCard(categoryId: string, cardId: string): LessonCard | undefined {
  return getLessonCategory(categoryId)?.cards.find(c => c.id === cardId)
}

export const LESSON_TOTAL = LESSON_CATEGORIES.reduce((sum, c) => sum + c.cards.length, 0)
