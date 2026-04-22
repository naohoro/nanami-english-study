'use client'

import { useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { TrickPanel } from '@/components/boss/TrickPanel'
import { BottomButton } from '@/components/ui/BottomButton'
import type { BossType } from '@/lib/types'

const RATIONALE: Record<string, string> = {
  essay_synthesis: '配点17点 = 英語全体の17%がこの1問に集中。\n2025年度全受験生の正答率：47.1%（半分以上が落としてる）。\nでも「ステップ通りに解く」だけで正答率が激上がりする。\nだからこのアプリは第8問から始める。',
  article_slides: '配点16点。スライドと本文の「対応」を見つけるだけでほぼ全問取れる。\n全部読もうとするから時間が足りなくなる——パズルとして解くのが正解。',
  multi_doc: '配点16点。3種類の文書が一気に出て混乱する——でも「設問→どの文書？」の順で読むだけで難易度が激減。\n全部読もうとするのが最大の罠。',
  long_story: '配点12点。2025年度正答率：41.8%（全8問中ワースト1位）。\n感情語（worried / relieved）だけマークすれば、全訳しなくても解ける。',
  essay_edit: '配点12点。先生のコメント＝答えのヒントがそのまま書いてある。\nコメントを読んで、コメントに合う選択肢を選ぶだけ。英語を全部理解しなくていい。',
  short_story: '配点9点。時間を表す英語（yesterday / two days later）だけ探せば解ける。\n本文を全部読まなくても正解できることすらある。',
  survey_blog: '配点12点。英語のブログは「段落の最初の文＝結論」が鉄則。\n最初の文だけ読んで進む——全部読むのは時間の無駄。',
  short_text: '配点6点。チラシ・告知文は「日時・場所・条件」の3つだけ探せば全問解ける。\n最初に片付けて、難しい問題への時間を確保する。',
}

export default function Step1Page() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  const [showRationale, setShowRationale] = useState(searchParams.get('rationale') === 'open')

  if (!boss) {
    return (
      <main className="flex-1 p-4 flex items-center justify-center">
        <p style={{ color: '#E53935' }}>問題タイプが見つかりません</p>
      </main>
    )
  }

  const rationale = RATIONALE[bossType]

  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <div className="pt-6">
        <button onClick={() => router.push('/')} className="text-sm mb-4 px-3 py-1.5 rounded-lg border active:opacity-60 font-medium" style={{ color: 'var(--burgundy)', borderColor: 'var(--burgundy)' }}>
          ← 問題リストに戻る
        </button>
        <p className="text-xs font-bold tracking-wide" style={{ color: 'var(--burgundy)' }}>STEP 1 — コツを読む</p>
        <h1 className="text-xl font-black mt-1" style={{ color: '#1A1A1A' }}>{boss.name}</h1>
        <p className="text-sm mt-1" style={{ color: '#787878' }}>まずコツを読んでから問題を見よう</p>
      </div>

      <TrickPanel trick={boss.trick} steps={boss.trickSteps} example={boss.example} />

      {rationale && (
        <div>
          <button
            onClick={() => setShowRationale(v => !v)}
            className="w-full text-sm font-bold py-2.5 px-4 rounded-xl active:opacity-60 flex items-center justify-between"
            style={{ background: '#1A1A1A', color: '#FFD700' }}
          >
            <span>⚡ なんでか見る</span>
            <span style={{ fontSize: '10px' }}>{showRationale ? '▲ 閉じる' : '▼ 開く'}</span>
          </button>
          {showRationale && (
            <div className="mt-2 rounded-xl p-4" style={{ background: '#1A1A1A', border: '1px solid #333' }}>
              <p className="text-sm leading-relaxed whitespace-pre-line font-mincho" style={{ color: '#F5F5F5' }}>
                {rationale}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto pt-4">
        <BottomButton
          label="わかった！問題を見る →"
          onClick={() => router.push(`/boss/${bossType}/step2`)}
        />
      </div>
    </main>
  )
}
