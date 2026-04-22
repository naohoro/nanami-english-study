'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { ClearedResult } from '@/components/boss/ClearedResult'
import type { BossType } from '@/lib/types'

const BOSS_ORDER: BossType[] = [
  'short_text', 'survey_blog', 'short_story', 'essay_edit',
  'multi_doc', 'long_story', 'article_slides', 'essay_synthesis',
]

export default function ClearedPage() {
  const params = useParams()
  const bossType = params.type as BossType
  const boss = BOSS_CONFIGS[bossType]

  const [meta, setMeta] = useState<{ accuracy: number; timeSpentSec: number } | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('clearedMeta')
    if (raw) {
      const data = JSON.parse(raw)
      setMeta({ accuracy: data.accuracy ?? 100, timeSpentSec: data.timeSpentSec ?? 0 })
    } else {
      setMeta({ accuracy: 100, timeSpentSec: 0 })
    }
  }, [])

  if (!boss || !meta) return null

  const currentIdx = BOSS_ORDER.indexOf(bossType)
  const nextType = currentIdx >= 0 && currentIdx < BOSS_ORDER.length - 1 ? BOSS_ORDER[currentIdx + 1] : undefined

  return (
    <ClearedResult
      bossIndex={boss.section}
      bossName={boss.name}
      accuracy={meta.accuracy}
      timeSpentSec={meta.timeSpentSec}
      trickReviewHref={`/boss/${bossType}/review`}
      nextHref={nextType ? `/boss/${nextType}` : undefined}
    />
  )
}
