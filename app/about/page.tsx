'use client'

import Link from 'next/link'
import { BOSS_CONFIGS } from '@/lib/boss-data'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

const BOSS_TABLE = Object.values(BOSS_CONFIGS).sort((a, b) => a.section - b.section)

export default function AboutPage() {
  return (
    <main style={{ flex: 1 }}>
      <Breadcrumb crumbs={[{ label: 'MAP', href: '/' }, { label: 'ABOUT' }]} />
      <div style={{ padding: '20px 20px 24px', borderBottom: '1px solid var(--rule)' }}>
        <div className="mono-kicker">ABOUT</div>
        <h1
          className="display"
          style={{ marginTop: 10, fontSize: 34, lineHeight: 1.1, color: 'var(--ink)', fontVariationSettings: '"opsz" 144' }}
        >
          英語は80分・100点。
          <br />
          <em className="display-italic">どこで取るか</em>で合否が変わる。
        </h1>
      </div>

      {/* section 1: 構成表 */}
      <section style={{ padding: '28px 20px', borderBottom: '1px solid var(--rule)' }}>
        <div className="mono-kicker" style={{ marginBottom: 14 }}>§01 / 共通テスト英語の構成</div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--sans)', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                {['問', '問題タイプ', '配点', '目標時間'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.05em', color: 'var(--ink-3)', textAlign: 'left', fontWeight: 'normal' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOSS_TABLE.map((boss) => {
                const isBig = boss.points >= 16
                const timeLimitMin = Math.ceil(boss.timeLimit / 60)
                return (
                  <tr key={boss.type} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td style={{ padding: '12px 10px', fontFamily: 'var(--mono)', fontSize: 12, color: isBig ? 'var(--accent)' : 'var(--ink-3)', fontWeight: isBig ? 'bold' : 'normal' }}>
                      第{boss.section}問
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--ink)', lineHeight: 1.4 }}>
                      <Link href={`/boss/${boss.type}`} style={{ color: 'inherit', textDecoration: 'none' }}>{boss.name}</Link>
                    </td>
                    <td className="tabular" style={{ padding: '12px 10px', fontFamily: 'var(--display)', fontSize: isBig ? 18 : 14, color: isBig ? 'var(--ink)' : 'var(--ink-2)', fontWeight: isBig ? '500' : 'normal' }}>
                      {boss.points}
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)', marginLeft: 2 }}>pts</span>
                    </td>
                    <td className="tabular" style={{ padding: '12px 10px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>
                      {timeLimitMin}m
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* section 2: なぜ第8問から */}
      <section style={{ padding: '28px 20px', borderBottom: '1px solid var(--rule)' }}>
        <div className="mono-kicker" style={{ marginBottom: 14 }}>§02 / なぜ第8問から？</div>
        <h2
          className="display"
          style={{ fontSize: 26, lineHeight: 1.2, color: 'var(--ink)', fontVariationSettings: '"opsz" 144' }}
        >
          17点。英語で<em className="display-italic">一番大きな</em>1問。
        </h2>
        <div className="font-mincho" style={{ marginTop: 16, fontSize: 15, lineHeight: 1.85, color: 'var(--ink-2)' }}>
          共通テスト英語は100点満点。そのうち17点が第8問1つに集まっている。
          <br /><br />
          しかも、第8問には「解き方のパターン」がある。難しそうに見えるが、手順を知っていれば必ず解ける構造になっている。
          <br /><br />
          だからこのアプリは第8問から始める。「一番点数が取れる問題」を「一番最初に攻略する」のが最短ルート。
        </div>

        {/* accent stat */}
        <div style={{ marginTop: 22, padding: '16px 18px', borderLeft: '3px solid var(--accent)', background: 'var(--surface)' }}>
          <div className="mono-kicker" style={{ marginBottom: 6 }}>2025年 正答率</div>
          <div className="display tabular" style={{ fontSize: 36, color: 'var(--ink)', lineHeight: 1, fontVariationSettings: '"opsz" 144' }}>
            47.1
            <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink-3)', marginLeft: 4 }}>%</span>
          </div>
          <div className="font-mincho" style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-2)' }}>
            半分以上が落としている。手順を知れば、差がつく。
          </div>
        </div>
      </section>

      {/* section 3: 学び方 */}
      <section style={{ padding: '28px 20px', borderBottom: '1px solid var(--rule)' }}>
        <div className="mono-kicker" style={{ marginBottom: 14 }}>§03 / このアプリの学び方</div>
        <h2
          className="display"
          style={{ fontSize: 26, lineHeight: 1.2, color: 'var(--ink)', fontVariationSettings: '"opsz" 144' }}
        >
          答えを先に見ていい。
          <br />
          <em className="display-italic">それがコツ。</em>
        </h2>
        <div className="font-mincho" style={{ marginTop: 16, fontSize: 14, lineHeight: 1.85, color: 'var(--ink-2)' }}>
          解き方を知らない状態で悩んでも、時間がかかるだけで身につかない。「答えを先に見ること」はズルじゃなく、正しい学習の手順。
        </div>

        {/* 3 steps */}
        <ol style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', borderTop: '1px solid var(--rule)' }}>
          {[
            { label: 'STEP 1', title: 'コツを読む', body: '「この問題はこうやって解く」を先に知る' },
            { label: 'STEP 2', title: 'ヒントありで練習', body: 'WHISPERを見ながら問題を解く。答え合わせは即座に' },
            { label: 'STEP 3', title: 'ひとりでやってみる', body: 'ヒントなし。全問正解でクリア' },
          ].map((s, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 14, alignItems: 'baseline', padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
              <span className="mono-kicker" style={{ color: 'var(--accent)' }}>{s.label}</span>
              <div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{s.title}</div>
                <div className="font-mincho" style={{ marginTop: 4, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* section 4: FAQ */}
      <section style={{ padding: '28px 20px', borderBottom: '1px solid var(--rule)' }}>
        <div className="mono-kicker" style={{ marginBottom: 14 }}>§04 / よくある疑問</div>
        {[
          { q: '全部の問をやらないといけないの？', a: '好きな問からでいい。点数が大きい順（第8→第7→第5→第2）から攻めると効率がいい。' },
          { q: '難しくて解けない時は？', a: 'STEP 2ではWHISPERというヒントが出る。全部使っていい。' },
          { q: '同じ問を何回もやっていいの？', a: 'むしろやった方がいい。アクセスするたびに違う問題が出てくる。' },
        ].map((faq, i) => (
          <div key={i} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--rule-soft)' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{faq.q}</div>
            <div className="font-mincho" style={{ marginTop: 6, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.75 }}>{faq.a}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <div style={{ padding: '28px 20px 48px' }}>
        <Link href="/" className="hy-btn full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
          <span>問題マップへ戻る</span>
          <span className="arr">→</span>
        </Link>
      </div>
    </main>
  )
}
