import { motion } from 'framer-motion';

const BADGES = [
  {
    label: 'Research Report',
    desc: 'Full 11-page report covering methodology, empirical analysis, and limitations',
    icon: '📄',
  },
  {
    label: 'Strategy Implementation',
    desc: 'Production-grade Python notebooks with Polars, scikit-learn, and NumPy',
    icon: '⚙️',
  },
  {
    label: 'Walk-Forward Backtesting',
    desc: 'Identical simulation engine applied in-sample and out-of-sample without modification',
    icon: '🔁',
  },
  {
    label: '27-Factor Library',
    desc: '16 price-based factors + 11 LOB microstructure factors, all defined and reproducible',
    icon: '📊',
  },
  {
    label: 'Independent Replay Verified',
    desc: 'Official-rules replay reproduces strategy NAV with max|reldiff| = 3.2×10⁻¹⁶',
    icon: '✅',
  },
];

export function Reproducibility() {
  return (
    <section id="reproducibility" className="py-32 px-6 border-t border-[var(--border)]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label">Reproducibility</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fully Reproducible
          </h2>
          <p className="text-[var(--text-2)] text-base max-w-xl mx-auto leading-relaxed">
            All reported results are fully reproducible from the provided notebooks and data files.
            Every hyperparameter was selected in-sample and frozen before out-of-sample evaluation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 text-left group hover:border-emerald-500/20 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{b.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <p className="text-sm font-semibold text-white">{b.label}</p>
                  </div>
                  <p className="text-[0.78rem] text-[var(--text-2)] leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Central quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="card p-8"
        >
          <p className="text-xl font-semibold text-white mb-3">
            "All stochastic steps use fixed random seeds, and pinned package versions match
            the environment used to produce the reported results."
          </p>
          <p className="mono text-[0.65rem] text-[var(--text-3)] tracking-wider">
            — Research Report, Reproducibility Section
          </p>
        </motion.div>
      </div>
    </section>
  );
}
