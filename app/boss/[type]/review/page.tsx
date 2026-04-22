'use client'

import { useParams, useRouter } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { TrickSteps } from '@/components/boss/TrickSteps'
import { RationaleReveal } from '@/components/boss/RationaleReveal'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import type { BossType } from '@/lib/types'

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  if (!boss) return (
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--danger)' }}>問題タイプが見つかりません</p>
    </main>
  )

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Breadcrumb crumbs={[{ label: 'MAP', href: '/' }, { label: 'CLEARED', href: `/boss/${bossType}/cleared` }, { label: 'REVIEW' }]} />
      <div style={{ padding: '20px 20px 16px' }}>
        <div className="mono-kicker">TRICK REVIEW</div>
        <h1
          className="display"
          style={{ marginTop: 10, fontSize: 26, lineHeight: 1.15, color: 'var(--ink)', fontVariationSettings: '"opsz" 144' }}
        >
          {boss.name}
          <br />
          <em className="display-italic" style={{ fontSize: 20 }}>の落とし穴</em>
        </h1>
      </div>

      {boss.rationale && (
        <RationaleReveal rationale={boss.rationale} bossIndex={boss.section} />
      )}

      <TrickSteps steps={boss.trickSteps} />

      {boss.example && (
        <div style={{ margin: '0 20px 20px', padding: '16px 18px', background: 'var(--surface)', borderLeft: '2px solid var(--accent-2)' }}>
          <div className="mono-kicker" style={{ marginBottom: 8 }}>EXAMPLE</div>
          <p className="passage-english" style={{ fontSize: 14, color: 'var(--ink)' }}>{boss.example.en}</p>
          <p className="font-mincho" style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>{boss.example.ja}</p>
        </div>
      )}

      <div style={{ padding: '8px 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => router.push(`/boss/${bossType}/practice`)} className="hy-btn full">
          <span>もう一度練習する</span>
          <span className="arr">→</span>
        </button>
        <button
          onClick={() => router.push('/')}
          style={{ padding: '14px 18px', border: '1px solid var(--rule)', background: 'transparent', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14, cursor: 'pointer' }}
        >
          MAP に戻る
        </button>
      </div>
    </main>
  )
}
