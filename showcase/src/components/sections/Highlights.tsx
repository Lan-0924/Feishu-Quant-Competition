import { motion } from 'framer-motion';

const CARDS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    label: 'Diversified Alpha Ensemble',
    desc: 'A weak but decorrelated Ridge regression sleeve lifts portfolio CAGR by +4.85pp and Sharpe by +0.42, purely through signal independence — not stronger prediction.',
    stat: '+4.85pp CAGR lift',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3h18v18H3z M7 7h10M7 12h10M7 17h10"/>
      </svg>
    ),
    label: 'Order-Book Microstructure',
    desc: '11 daily LOB factors derived from 10-minute, 10-level order book snapshots at 24 intraday time points — providing signals largely orthogonal to the price-based factor family.',
    stat: '11 LOB factors',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: 'Strict Anti-Leakage Framework',
    desc: '5 explicit controls: 1-day factor lag, IS-only fitting, frozen sector map (D080–D240), 12-day purge gap, no OOS retraining. Replay error: max|reldiff| = 3.2×10⁻¹⁶.',
    stat: '5 leakage controls',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    label: 'Out-of-Sample Generalization',
    desc: 'OOS CAGR +17.64% exceeds IS CAGR +17.26%. MaxDD improves from −12.32% to −10.18%. Growth does not decay from in-sample to out-of-sample.',
    stat: 'Generalization confirmed',
  },
];

export function Highlights() {
  return (
    <section id="highlights" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">Research Contributions</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Four Key Innovations
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card group p-7 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/15 group-hover:border-blue-500/30 transition-colors">
                  {c.icon}
                </div>
                <span className="mono text-[0.65rem] text-blue-400/70 tracking-wide border border-blue-500/20 rounded px-2 py-1">
                  {c.stat}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">{c.label}</h3>
              <p className="text-[0.85rem] text-[var(--text-2)] leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
