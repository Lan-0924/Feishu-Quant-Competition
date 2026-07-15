import { motion } from 'framer-motion';

const base = import.meta.env.BASE_URL;

const ABSTRACT = `We propose and evaluate a long-only quantitative strategy for the Shanghai A-share market, designed to extract return predictability from a combination of price-based and order book signals. The market context shapes the design: strong short-horizon reversals, retail-driven order flow, and informative intraday book dynamics make this setting well suited to microstructure-augmented factor composites.

The approach combines two components. The first is a factor composite built from a diversified library of daily and limit order book signals, weighted by predictive stability and partially neutralized against estimated sector exposures. The second is a walk-forward Ridge regression sleeve, trained on all candidate factors without look-ahead. The key design principle is ensembling for diversification: rather than stacking correlated factors to maximize raw predictive correlation, we blend a weak but decorrelated machine learning signal into a robust base composite, seeking breadth of information as the primary source of improvement.

In-sample (≈1.9 years), the strategy delivers CAGR of +17.3% and a Sharpe ratio of 1.42. Out-of-sample (≈1 year), it achieves CAGR of +17.6% and a Sharpe ratio of 1.00.`;

export function PaperSection() {
  return (
    <section id="paper" className="py-32 px-6 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">Research Report</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">The Paper</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* PDF Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="card p-8 flex flex-col items-center text-center gap-6">
              {/* PDF thumbnail placeholder */}
              <div className="w-full max-w-[180px] aspect-[3/4] rounded-xl border border-[var(--border-2)] bg-[var(--bg-2)] flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent" />
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <div className="px-3 space-y-1.5">
                  <div className="h-1.5 bg-white/10 rounded w-full" />
                  <div className="h-1.5 bg-white/10 rounded w-4/5 mx-auto" />
                  <div className="h-1.5 bg-white/8 rounded w-full" />
                  <div className="h-1.5 bg-white/8 rounded w-3/4 mx-auto" />
                </div>
                <span className="mono text-[0.55rem] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">PDF · 11 pages</span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  A Defensive Short-Horizon Reversal Strategy with Order-Book Microstructure
                </h3>
                <p className="mono text-[0.65rem] text-[var(--text-3)]">
                  Feishu Quant Competition 2026 · Team T025 · June 2026
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <a href={`${base}Research_report.pdf`} target="_blank" rel="noopener noreferrer"
                  className="btn-primary justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Read PDF
                </a>
                <a href={`${base}Research_report.pdf`} download="Finalpha_Research_Report.pdf"
                  className="btn-outline justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
          </motion.div>

          {/* Abstract */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <p className="mono text-[0.65rem] text-[var(--text-3)] tracking-widest uppercase mb-4">Abstract</p>
            <div className="space-y-4">
              {ABSTRACT.split('\n\n').map((para, i) => (
                <p key={i} className="text-[var(--text-2)] text-[0.9rem] leading-[1.75]">{para}</p>
              ))}
            </div>

            {/* Key metadata */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { k: 'Market',     v: 'Shanghai A-Shares' },
                { k: 'Style',      v: 'Long-Only · T+1'  },
                { k: 'Universe',   v: '2,270 Stocks'     },
                { k: 'IS Period',  v: 'D080–D484 (≈1.9y)'},
                { k: 'OOS Period', v: 'D485–D726 (≈1y)'  },
                { k: 'Execution',  v: 'Sell-at-Open'     },
              ].map(p => (
                <div key={p.k} className="bg-[var(--bg-1)] rounded-lg p-3 border border-[var(--border)]">
                  <p className="mono text-[0.58rem] text-[var(--text-3)] uppercase tracking-widest mb-1">{p.k}</p>
                  <p className="mono text-xs text-white">{p.v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
