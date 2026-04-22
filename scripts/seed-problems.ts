/**
 * One-time seed script: generates sample problems via Claude API and inserts to Supabase.
 *
 * Run all:        npx tsx scripts/seed-problems.ts
 * Run one type:   BOSS_TYPE=short_text npx tsx scripts/seed-problems.ts
 * Preview 1 prob: BOSS_TYPE=short_text PREVIEW=1 npx tsx scripts/seed-problems.ts
 *
 * Required env vars (from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

import { createClient } from '@supabase/supabase-js'
import { generateProblem } from '../lib/claude'
import type { BossType, ProblemTheme } from '../lib/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BOSS_THEMES: Record<BossType, ProblemTheme[]> = {
  short_text:      ['education', 'technology', 'environment', 'health_food'],
  survey_blog:     ['technology', 'environment', 'health_food', 'education'],
  short_story:     ['health_food', 'education', 'technology', 'environment'],
  essay_edit:      ['environment', 'health_food', 'education', 'technology'],
  multi_doc:       ['technology', 'education', 'health_food', 'environment'],
  long_story:      ['education', 'health_food', 'environment', 'technology'],
  article_slides:  ['technology', 'environment', 'education', 'health_food'],
  essay_synthesis: ['environment', 'technology', 'health_food', 'education'],
}

const VARIANTS = 2

async function generateOne(bossType: BossType, difficulty: number, theme: ProblemTheme) {
  return await generateProblem({
    bossType,
    difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
    theme,
    mode: 'answer_first',
  })
}

async function seed() {
  const filterBossType = (process.env.BOSS_TYPE ?? null) as BossType | null
  const isPreview = process.env.PREVIEW === '1'

  if (isPreview) {
    const bossType = filterBossType ?? 'short_text'
    const theme = BOSS_THEMES[bossType][0]
    console.log(`PREVIEW: ${bossType}/${theme}/d3\n`)
    const p = await generateOne(bossType, 3, theme)
    console.log(JSON.stringify(p, null, 2))
    return
  }

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
            const p = await generateOne(bossType as BossType, difficulty, theme as ProblemTheme)
            const { error } = await supabase.from('sample_problems').insert({
              boss_type: bossType,
              theme,
              difficulty,
              scenario: p.scenario,
              passage_html: p.passageHtml,
              questions: p.questions,
              trick_hint: p.trickHint,
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
