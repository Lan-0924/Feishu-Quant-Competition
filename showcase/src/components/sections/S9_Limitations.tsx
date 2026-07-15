import { motion } from 'framer-motion';
import { SectionMeta } from '../ui/SectionMeta';
import { ResearchNote } from '../ui/ResearchNote';

const LIMITATIONS = [
  {
    id: 'capacity',
    heading: 'Limited Capacity',
    severity: 'Structural',
    color: 'var(--red)',
    body: 'The strategy is designed for the competition\'s ¥50M mandate. The concentrated 12-name book (average position ≈¥4M) will face meaningful market impact at larger AUM. No market-impact model was estimated, so the capacity boundary is unknown.',
    mitigant: 'An Almgren-Chriss or empirical square-root-law impact model could quantify the capacity frontier.',
  },
  {
    id: 'regime',
    heading: 'Single Market Regime',
    severity: 'Critical',
    color: 'var(--red)',
    body: 'The IS+OOS evaluation spans 726 trading days (≈2.9 years) within a single market environment. The strategy has not been tested in a sustained bear market, a liquidity crisis, or a structural policy shift (e.g., circuit breaker activation, stamp duty increase).',
    mitigant: 'Regime-aware signal blending or regime-conditional sizing could improve robustness to market state transitions.',
  },
  {
    id: 'execution',
    heading: 'Idealized Execution Assumptions',
    severity: 'Moderate',
    color: 'var(--amber)',
    body: 'The backtest assumes full fills at VWAP 09:30–09:35 and opening prices, with no market impact. In practice, the concentrated 12-name book may move the market at the open, particularly in less-liquid names. Commission and stamp duty are modeled but slippage is not.',
    mitigant: 'Empirical slippage estimation from level-2 trade data would close this gap.',
  },
  {
    id: 'oos',
    heading: 'Short OOS Window',
    severity: 'Informational',
    color: 'var(--amber)',
    body: 'The OOS period spans only ≈1 year (242 trading days). While the results are favorable (CAGR exceeds IS), the sample is too short to distinguish skill from luck at conventional statistical confidence levels. A longer OOS evaluation would provide stronger evidence of genuine generalization.',
    mitigant: 'More OOS data (as the competition releases more trading days) would narrow the confidence interval on the OOS Sharpe.',
  },
  {
    id: 'ridge',
    heading: 'Ridge Model Risk',
    severity: 'Informational',
    color: 'var(--purple)',
    body: 'The Ridge sleeve is a linear regularized regression on all 27 z-factors, retrained every 30 days. It may fit to spurious factor interaction patterns that exist in-sample. The 12-day purge and walk-forward validation reduce but do not eliminate this risk.',
    mitigant: 'SHAP-based attribution, cross-validation across multiple IS sub-windows, or LightGBM with regularization could provide stronger guarantees.',
  },
  {
    id: 'sector',
    heading: 'Statistical Sector Map',
    severity: 'Design Choice',
    color: 'var(--text-3)',
    body: 'Because GICS sector labels were not provided, statistical sectors were estimated from return co-movement. The 10-cluster map may not correspond to economic sectors, and the clusters could be unstable across different market periods.',
    mitigant: 'GICS labels (if available) would provide a more stable and economically interpretable sector residualization.',
  },
];

const FUTURE = [
  {
    title: 'Regime-Aware Blending',
    desc: 'Dynamically adjust the Ridge weight (currently fixed at 20%) based on detected market regime — momentum vs. mean-reversion, high vs. low volatility. The ensemble weight could be a learnable function of market state.',
    effort: 'High',
  },
  {
    title: 'Gradient Boosting Sleeve',
    desc: 'Replace Ridge with LightGBM to capture non-linear factor interactions. SHAP values provide interpretability consistent with the paper\'s explainability standards.',
    effort: 'Medium',
  },
  {
    title: 'Capacity Modeling',
    desc: 'Almgren-Chriss or empirical square-root-law impact model to quantify the AUM frontier at which trading costs erode the alpha advantage.',
    effort: 'Medium',
  },
  {
    title: 'Covariance Shrinkage Risk Model',
    desc: 'Ledoit-Wolf or factor-model covariance estimator to replace inverse-vol sizing with a proper minimum-variance optimizer, improving tail-risk management.',
    effort: 'High',
  },
];

export function S9_Limitations() {
  return (
    <section id="limitations" className="py-28 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <SectionMeta
          num="§ 8.  Innovation & Limitations"
          question="What are the strategy's honest limitations?"
          lead={
            <>
              The main innovation is the use of ensembling as a source of diversification rather than
              a means of amplifying any single predictor. The limitations below reflect the current
              scope of the competition mandate.
            </>
          }
        />

        {/* Innovation restatement */}
        <div className="mb-14 card-research p-6 border-l-4" style={{ borderLeftColor: 'var(--teal)' }}>
          <p className="section-num mb-3" style={{ color: 'var(--teal)' }}>Main Innovation — §6.1</p>
          <p className="text-[0.87rem] text-[var(--text-2)] leading-relaxed">
            The use of ensembling as a source of diversification rather than a means of amplifying any
            single predictor. Instead of stacking correlated factors to maximize raw IC, value is added
            by blending a decorrelated and individually weak ML sleeve into a robust composite. The
            IC-IR screening with family cap enforces breadth at the factor level; the Ridge sleeve
            enforces breadth at the signal level.
          </p>
        </div>

        {/* Limitations */}
        <div className="space-y-3 mb-14">
          <p className="section-num mb-5">Known Limitations</p>
          {LIMITATIONS.map((lim, i) => (
            <motion.div
              key={lim.id}
              className="card-research p-5"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="font-semibold text-[0.87rem] text-[var(--text)]">{lim.heading}</p>
                <span
                  className="font-mono text-[0.6rem] px-2 py-0.5 rounded flex-shrink-0"
                  style={{ background: `${lim.color}14`, color: lim.color }}
                >
                  {lim.severity}
                </span>
              </div>
              <p className="text-[0.8rem] text-[var(--text-2)] leading-relaxed mb-2">{lim.body}</p>
              <p className="font-mono text-[0.68rem] text-[var(--text-3)]">
                <span style={{ color: lim.color }}>→ </span>{lim.mitigant}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Future research */}
        <div className="mb-14">
          <p className="section-num mb-5">Research Extensions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FUTURE.map((f, i) => (
              <motion.div
                key={f.title}
                className="card-research p-5"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[0.85rem] text-[var(--text)]">{f.title}</p>
                  <span className="font-mono text-[0.58rem] px-1.5 py-0.5 rounded bg-[var(--bg)] text-[var(--text-3)]">
                    {f.effort} effort
                  </span>
                </div>
                <p className="text-[0.78rem] text-[var(--text-2)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="border-t border-[var(--border)] pt-12 text-center max-w-prose mx-auto">
          <motion.p
            className="font-serif text-xl text-[var(--text-2)] leading-relaxed mb-4"
            style={{ fontFamily: 'EB Garamond, Georgia, serif' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            "The strategy is designed for the competition's ¥50M mandate and has not been tested
            in a sustained bear market or liquidity crisis."
          </motion.p>
          <p className="font-mono text-[0.65rem] text-[var(--text-3)] tracking-wider">
            — Research Report, Abstract (June 2026)
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6 font-mono text-[0.7rem]">
            <span className="text-[var(--text-3)]">OOS CAGR <span className="text-[var(--teal)]">+17.64%</span></span>
            <span className="text-[var(--text-3)]">Sharpe <span className="text-[var(--blue)]">1.00</span></span>
            <span className="text-[var(--text-3)]">MaxDD <span className="text-[var(--red)]">−10.18%</span></span>
            <span className="text-[var(--text-3)]">Final NAV <span className="text-[var(--teal)]">¥58.44M</span></span>
            <span className="text-[var(--text-3)]">Fitness <span className="text-[var(--text)]">0.13</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
