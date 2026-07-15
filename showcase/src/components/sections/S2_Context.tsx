import { motion } from 'framer-motion';
import { SectionMeta } from '../ui/SectionMeta';
import { Finding } from '../ui/Finding';

const ANOMALIES = [
  {
    id: 1,
    title: 'Retail Dominance & Short-Horizon Reversals',
    color: 'var(--teal)',
    body: 'Retail participants account for the majority of daily trading volume in Shanghai A-shares. This produces pronounced short-horizon price reversals driven by retail order-flow imbalances and overreaction — exploitable at 1–20 day horizons.',
    stat: '~80%',
    statLabel: 'retail share of daily volume',
    factors: ['REV_1', 'REV_3', 'REV_5', 'REV_10', 'REV_20'],
  },
  {
    id: 2,
    title: 'Lottery-Seeking Behavior',
    color: 'var(--amber)',
    body: 'Positively-skewed stocks are structurally overpriced by gambling-like retail demand. As prices converge toward fundamentals, the anti-lottery premium mean-reverts. This creates a persistent negative skewness signal.',
    stat: 'SKEW_60',
    statLabel: 'captures lottery preference',
    factors: ['SKEW_60', 'RANGE_PCT'],
  },
  {
    id: 3,
    title: 'Informative Order Flow',
    color: 'var(--cyan)',
    body: 'Intraday signed order-flow imbalance and spread dynamics from the 10-level limit order book carry short-horizon predictive content for price movements, largely orthogonal to price-based signals.',
    stat: '11',
    statLabel: 'daily LOB factors extracted',
    factors: ['OFI_D', 'DWI_D', 'SPR_D', 'DWI_AFT_MORN'],
  },
  {
    id: 4,
    title: 'Long-Only Constraint & Low-Vol Anomaly',
    color: 'var(--blue)',
    body: 'Low-idiosyncratic-volatility stocks earn superior risk-adjusted returns, attributable partly to leverage constraints and partly to retail preference for high-beta names. This is especially pronounced under T+1 settlement.',
    stat: 'T+1',
    statLabel: 'settlement rule amplifies the effect',
    factors: ['LOWVOL', 'RANGE_PCT', 'OVNT'],
  },
];

const CONTRIBUTIONS = [
  'Multi-theme factor composite with IC-IR screening, sign-stability tests, and family cap (≤2 per theme)',
  'Value through decorrelated ensembling: a weak walk-forward Ridge sleeve improves portfolio performance via diversification, not stronger prediction',
  'Eleven daily factors derived from 10-minute, 10-level LOB snapshots, providing information largely orthogonal to the price-based factor family',
  'Three risk management overlays calibrated to the competition scoring axes: CAGR, Sharpe, and −MaxDD',
];

export function S2_Context() {
  return (
    <section id="context" className="py-28 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">

        <SectionMeta
          num="§ 1.  Research Context"
          question="What makes Shanghai A-shares an exploitable market?"
          lead={
            <>
              Four structural anomalies define the A-share trading environment. Traditional IC-maximization
              alone is insufficient — a good strategy must harvest all four complementary sources simultaneously,
              without generating excessive turnover or sector concentrations.
            </>
          }
        />

        {/* Four anomalies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {ANOMALIES.map((a, i) => (
            <motion.div
              key={a.id}
              className="card-research p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-[0.62rem] text-[var(--text-3)] tracking-wider">ANOMALY {a.id}</span>
                <div className="text-right">
                  <p className="font-mono font-semibold text-sm" style={{ color: a.color }}>{a.stat}</p>
                  <p className="font-mono text-[0.6rem] text-[var(--text-3)]">{a.statLabel}</p>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2 leading-snug">{a.title}</h3>
              <p className="text-[0.8rem] text-[var(--text-2)] leading-relaxed mb-3">{a.body}</p>
              <div className="flex flex-wrap gap-1.5">
                {a.factors.map(f => (
                  <span key={f} className="font-mono text-[0.62rem] px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)]"
                    style={{ color: a.color }}>{f}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Central hypothesis */}
        <div className="border-t border-[var(--border)] pt-14 mb-14">
          <div className="max-w-prose mx-auto text-center">
            <motion.p
              className="section-num mb-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Core Hypothesis
            </motion.p>
            <motion.h2
              className="font-serif text-3xl md:text-4xl mb-6 leading-tight"
              style={{ fontFamily: 'EB Garamond, Georgia, serif', color: 'var(--text)' }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              "Breadth of information, rather than the strength of any single predictor,
              is the primary source of improvement."
            </motion.h2>
            <motion.p
              className="text-[var(--text-2)] text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Rather than stacking correlated factors to maximize raw IC, the strategy blends a weak but
              decorrelated machine learning signal into a robust base composite — seeking
              complementary information rather than raw predictive power.
            </motion.p>
          </div>
        </div>

        <Finding label="The Central Bet">
          Weak + Decorrelated Signals outperform Strong + Correlated Signals. A Ridge sleeve
          with CAGR +1.49% and Sharpe 0.18 — terrible in isolation — lifts the ensemble CAGR
          from +12.41% to +17.26% through diversification alone.
        </Finding>

        {/* Four contributions */}
        <div className="mt-14">
          <p className="section-num mb-6">Four Contributions</p>
          <div className="space-y-3">
            {CONTRIBUTIONS.map((c, i) => (
              <motion.div
                key={i}
                className="flex gap-4 items-start"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="font-mono text-[0.7rem] text-[var(--blue)] mt-0.5 flex-shrink-0">{i + 1}.</span>
                <p className="text-[0.83rem] text-[var(--text-2)] leading-relaxed">{c}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data summary */}
        <div className="mt-14 grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { v: '2,270', l: 'unique assets', c: 'var(--blue)' },
            { v: '484',   l: 'IS trading days', c: 'var(--blue)' },
            { v: '242',   l: 'OOS trading days', c: 'var(--teal)' },
            { v: '1.06M', l: 'IS asset-day obs.', c: 'var(--text-2)' },
            { v: '11.2%', l: 'eligible per day', c: 'var(--text-2)' },
            { v: '10-lvl', l: 'LOB depth', c: 'var(--cyan)' },
          ].map(m => (
            <div key={m.l} className="card-research p-3 text-center">
              <p className="font-mono font-semibold text-base" style={{ color: m.c }}>{m.v}</p>
              <p className="font-mono text-[0.6rem] text-[var(--text-3)] mt-0.5 leading-tight">{m.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
