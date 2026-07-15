import { motion } from 'framer-motion';
import { OOS_METRICS, TEAM, COMPETITION } from '../../data/strategyData';

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3B82F6" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse-slow"/>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}/>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}/>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400/25"
          style={{ left: `${5 + (i * 5.1) % 90}%`, top: `${10 + (i * 7.3) % 80}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function TickerLine() {
  const items = [
    'CAGR +17.64%', 'Sharpe 1.00', 'MaxDD −10.18%', 'Final NAV ¥58.44M',
    'IC +0.098', 'ICIR +0.795', '8 Selected Factors', 'N=12 Holdings',
    'T+1 Sell-at-Open', 'Walk-Forward Ridge', 'Sector-Residualized', 'No OOS Retraining',
    '484 IS Days', '242 OOS Days', 'Total OOS PnL +16.89%',
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden border-t border-white/5 bg-black/20">
      <motion.div
        className="flex gap-10 items-center h-full whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-xs mono text-gray-500 flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-blue-500/60 inline-block"/>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pb-10">
      <AnimatedGrid/>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500"/>
          <span className="text-xs mono text-blue-400 uppercase tracking-[0.3em] font-medium">
            {COMPETITION} · {TEAM}
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500"/>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-gradient-blue">Final</span>
          <span className="text-white"> Alpha</span>
        </motion.h1>

        {/* Paper title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-3 leading-relaxed"
        >
          A Defensive Short-Horizon Reversal Strategy<br/>
          with Order-Book Microstructure for Long-Only A-Share Portfolios
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-gray-600 text-sm mono mb-10"
        >
          Shanghai Stock Exchange · Long-Only · Sell-at-Open · T+1
        </motion.p>

        {/* Core equation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="inline-block glass-card rounded-2xl px-8 py-4 mb-14 glow-blue"
        >
          <p className="mono text-sm md:text-base text-gray-300">
            <span className="text-accent-green font-semibold">Finalpha</span>
            <span className="text-gray-500"> = </span>
            <span className="text-blue-400">0.8</span>
            <span className="text-gray-400"> × </span>
            <span className="text-blue-300">z(BaseAlpha_res)</span>
            <span className="text-gray-600 mx-2">+</span>
            <span className="text-purple-400">0.2</span>
            <span className="text-gray-400"> × </span>
            <span className="text-purple-300">z(ridge5d)</span>
          </p>
        </motion.div>

        {/* Metric cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-6"
        >
          {[
            { label: 'OOS CAGR', value: `+${OOS_METRICS.cagr.toFixed(2)}%`, sub: '≈1 year', positive: true },
            { label: 'Sharpe Ratio', value: OOS_METRICS.sharpe.toFixed(2), sub: 'Out-of-Sample', positive: true },
            { label: 'Max Drawdown', value: `${OOS_METRICS.maxDD.toFixed(2)}%`, sub: 'OOS period', negative: true },
            { label: 'Final NAV', value: `¥${OOS_METRICS.finalNAV}M`, sub: `+${OOS_METRICS.totalPnL}% total`, positive: true },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.05 + i * 0.1 }}
              className="glass-card rounded-xl p-4 text-center"
            >
              <p className="text-xs text-gray-500 mono uppercase tracking-widest mb-2">{m.label}</p>
              <p className={`text-2xl font-bold mono ${m.positive ? 'text-accent-green' : m.negative ? 'text-accent-red' : 'text-white'}`}>
                {m.value}
              </p>
              <p className="text-xs text-gray-600 mono mt-1">{m.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* IS/OOS context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center gap-6 text-xs mono text-gray-600 mb-12"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500/60 inline-block"/>
            IS (≈1.9y) · CAGR +17.26% · SR 1.42
          </span>
          <span className="text-gray-700">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500/60 inline-block"/>
            OOS (≈1y) · CAGR +17.64% · SR 1.00
          </span>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="flex flex-col items-center gap-2 text-gray-600"
        >
          <p className="text-xs mono uppercase tracking-widest">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-blue-500"/>
          </motion.div>
        </motion.div>
      </div>

      <TickerLine/>
    </section>
  );
}
