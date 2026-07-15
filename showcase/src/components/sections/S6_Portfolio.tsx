import { motion } from 'framer-motion';
import { SectionMeta } from '../ui/SectionMeta';
import { Formula } from '../ui/Formula';
import { ResearchNote } from '../ui/ResearchNote';

const OVERLAYS = [
  {
    name: 'Volatility Targeting',
    target: 'σ_ann = 18%',
    bounds: 'gross ∈ [0.90, 1.10]',
    obj: '↑ CAGR',
    color: 'var(--blue)',
    desc: 'Scales gross exposure toward 18% annualized portfolio volatility using trailing 20-day realized returns. When realized vol is low, exposure increases (targeting higher return); when vol spikes, exposure decreases (preserving capital).',
  },
  {
    name: 'Breadth Gross-Up',
    target: 'Trigger: breadth > 55%',
    bounds: 'ceil raises to 1.20×',
    obj: '↑ Sharpe',
    color: 'var(--teal)',
    desc: 'When more than 55% of eligible stocks are above their 20-day MA (broad market breadth), the gross-exposure ceiling raises to 1.20×. This allows the portfolio to lean into momentum regimes when market-wide conditions are supportive.',
  },
  {
    name: 'Drawdown Breaker',
    target: 'Trigger: NAV < peak − 5%',
    bounds: 'floor: 0.50× for 3 days',
    obj: '↓ MaxDD',
    color: 'var(--red)',
    desc: 'When the portfolio NAV falls more than 5% below its recent peak, gross exposure is immediately cut to a 0.50× floor. Over the following 3 days, exposure is linearly ramped back toward the vol-target level. Directly defends the MaxDD scoring axis.',
  },
];

const EXECUTION_STEPS = [
  { step: 1, label: 'Compute Finalpha', desc: 'Cross-sectional z-score for each eligible stock.' },
  { step: 2, label: 'Select Top 12',        desc: 'Top N=12 by alpha rank. Floor ≥10, cap 9%/name. Sticky top-50 retained.' },
  { step: 3, label: 'Size Weights',          desc: '50% inverse-vol + 50% alpha-rank blend, renormalized.' },
  { step: 4, label: 'Apply Risk Overlays',   desc: 'Scale gross by vol target × breadth gross-up × DD breaker.' },
  { step: 5, label: 'Sell at Open',          desc: 'Liquidate exits at opening price (T+1 sell-at-open).' },
  { step: 6, label: 'Buy at VWAP 09:30–35',  desc: 'Fill buys at 09:30–09:35 VWAP. Fees: 1bp buy, 6bp sell (+5bp stamp).' },
];

export function S6_Portfolio() {
  return (
    <section id="portfolio" className="py-28 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <SectionMeta
          num="§ 5.  Portfolio Construction"
          question="How does a signal become a portfolio?"
          lead={
            <>
              The signal is converted to orders by a single deterministic engine applied identically
              in-sample and out-of-sample. Three risk overlays each target a distinct dimension of
              the scoring function.
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {/* Execution steps */}
          <div>
            <p className="section-num mb-5">Execution Pipeline</p>
            <div className="space-y-0">
              {EXECUTION_STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border border-[var(--blue)] flex items-center justify-center">
                      <span className="font-mono text-[0.6rem] text-[var(--blue)]">{s.step}</span>
                    </div>
                    {i < EXECUTION_STEPS.length - 1 && <div className="w-px flex-1 bg-[var(--border)] my-1" />}
                  </div>
                  <div className="pb-5">
                    <p className="text-[0.83rem] font-semibold text-[var(--text)] leading-snug">{s.label}</p>
                    <p className="text-[0.77rem] text-[var(--text-2)] leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Risk overlays */}
          <div>
            <p className="section-num mb-5">Three Risk Overlays</p>
            <div className="space-y-3">
              {OVERLAYS.map((o, i) => (
                <motion.div
                  key={o.name}
                  className="card-research p-4"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[0.83rem] font-semibold text-[var(--text)]">{o.name}</p>
                    <span className="font-mono text-[0.62rem] px-2 py-0.5 rounded" style={{ background: `${o.color}18`, color: o.color }}>{o.obj}</span>
                  </div>
                  <div className="flex gap-3 mb-2">
                    <span className="font-mono text-[0.65rem] text-[var(--text-3)]">{o.target}</span>
                    <span className="text-[var(--border)]">·</span>
                    <span className="font-mono text-[0.65rem] text-[var(--text-3)]">{o.bounds}</span>
                  </div>
                  <p className="text-[0.77rem] text-[var(--text-2)] leading-relaxed">{o.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulas */}
        <div className="mb-10 grid md:grid-cols-2 gap-4">
          <Formula label="Portfolio sizing (Eq. 8)">
{`w_i ∝ 0.5 · (1/σᵢ)/Σ(1/σⱼ) + 0.5 · rank(αᵢ)/Σrank(αⱼ)

Capped at 9%, renormalized.
Inverse-vol dampens volatile names.
Alpha-rank tilts toward high-conviction.`}
          </Formula>
          <div className="space-y-3">
            {[
              { k: 'Target holdings',   v: 'N = 12' },
              { k: 'Holdings floor',    v: 'N ≥ 10' },
              { k: 'Per-name cap',      v: '9%' },
              { k: 'Sticky top-K',      v: 'K = 50' },
              { k: 'Rebalance freq.',   v: 'Every 10 days' },
              { k: 'Vol target',        v: '18% annual' },
              { k: 'DD trigger',        v: '−5% from peak' },
              { k: 'Settlement',        v: 'T+1 (sell-at-open)' },
              { k: 'Min trade unit',    v: '100 shares' },
              { k: 'Commission',        v: 'max(1bp, ¥5) + 5bp stamp' },
            ].map(p => (
              <div key={p.k} className="flex justify-between items-center border-b border-[var(--border-dim)] pb-1">
                <span className="font-mono text-[0.7rem] text-[var(--text-3)]">{p.k}</span>
                <span className="font-mono text-[0.7rem] text-[var(--text)]">{p.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <ResearchNote label="Why N=12 holdings?">
            <p>12 was chosen in-sample as the balance between concentration (higher conviction → higher CAGR)
            and diversification (lower idiosyncratic risk → lower MaxDD). The 10-holding floor is the
            competition's minimum diversification requirement. The 9% per-name cap bounds single-stock
            gap risk in a concentrated book.</p>
          </ResearchNote>
          <ResearchNote label="Why is the portfolio rebalanced every 10 days?">
            <p>The reversal signals (REV_10, REV_20) have their main predictive horizon at 2–4 weeks.
            Rebalancing every 10 trading days captures this signal while limiting transaction costs.
            Average daily turnover is 4.35%, annual turnover 10.96×. Sticky top-50 retains incumbent
            positions if still within the top-50 alpha rank, reducing unnecessary churn.</p>
          </ResearchNote>
        </div>
      </div>
    </section>
  );
}
