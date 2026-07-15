import { motion } from 'framer-motion';

const STAGES = [
  {
    num: '01',
    title: 'Raw Market Data',
    desc: '2,270 Shanghai A-share stocks · 726 trading days · 10-min, 10-level LOB snapshots at 24 intraday points',
    accent: '#3B82F6',
  },
  {
    num: '02',
    title: 'Feature Engineering',
    desc: '27 standardized z-scores: 16 price factors (reversal, low-vol, anti-lottery, intraday, liquidity) + 11 LOB factors',
    accent: '#3B82F6',
  },
  {
    num: '03',
    title: 'IC-IR Screening (4 Gates)',
    desc: 'IC gate |IC|≥0.01 · Sign stability across IS halves · Redundancy filter (pairwise corr≤0.65) · Family cap ≤2 per theme',
    accent: '#60A5FA',
  },
  {
    num: '04',
    title: 'BaseAlpha Construction',
    desc: 'Top-8 by |ICIR| · Weights = sign(IC)×|ICIR|/Σ|ICIR| · Partial sector residualization (λ=0.5) · ICIR 0.674 → 0.815',
    accent: '#60A5FA',
  },
  {
    num: '05',
    title: 'Ridge Sleeve (Walk-Forward ML)',
    desc: 'Ridge(α=10) on 27 z-factors · 5d forward rank target · Retrain every 30d · 12-day purge gap · IC=0.0945, ICIR=0.619',
    accent: '#818CF8',
  },
  {
    num: '06',
    title: 'Finalpha Ensemble',
    desc: '0.8 × z(BaseAlpha_res) + 0.2 × z(ridge5d) · IC=0.0980 > both components · Diversification, not stronger prediction',
    accent: '#34D399',
  },
  {
    num: '07',
    title: 'Portfolio Construction',
    desc: 'Top N=12 · 0.5×inv-vol + 0.5×alpha-rank sizing · 9% per-name cap · Sticky top-50 · Rebalance every 10 days',
    accent: '#34D399',
  },
  {
    num: '08',
    title: 'Three Risk Overlays',
    desc: 'Volatility targeting (18% annual) · Breadth gross-up (×1.20 when >55% stocks up) · Drawdown breaker (−5% trigger)',
    accent: '#FBBF24',
  },
  {
    num: '09',
    title: 'T+1 Execution & Evaluation',
    desc: 'Sell at open price · Buy at 09:30–09:35 VWAP · Commission max(1bp, ¥5) · 5bp stamp duty · No leverage',
    accent: '#F87171',
  },
];

export function Pipeline() {
  return (
    <section id="pipeline" className="py-32 px-6 border-t border-[var(--border)]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="section-label">Methodology</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Research Pipeline</h2>
        </motion.div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-blue-600/40 via-blue-500/20 to-transparent" />

          <div className="space-y-0">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative flex gap-6 group"
              >
                {/* Node */}
                <div className="flex-shrink-0 relative z-10 mt-6">
                  <div
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ borderColor: s.accent + '60', background: s.accent + '15' }}
                  >
                    <span className="mono text-[0.6rem] font-semibold" style={{ color: s.accent }}>{s.num}</span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex-1 card p-5 mb-4 group-hover:border-blue-500/20 transition-all duration-300"
                  style={{ borderLeftColor: s.accent + '30', borderLeftWidth: '2px' }}
                >
                  <p className="font-semibold text-white text-sm mb-1.5">{s.title}</p>
                  <p className="text-[0.8rem] text-[var(--text-2)] leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
