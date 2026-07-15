import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Counting animation hook ──────────────────────────────────
function useCountUp(target: number, duration: number, triggered: boolean, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let startT: number;
    const step = (ts: number) => {
      if (!startT) startT = ts;
      const progress = Math.min((ts - startT) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const v = ease * target;
      setVal(decimals > 0 ? Math.round(v * 10 ** decimals) / 10 ** decimals : Math.round(v));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration, decimals]);
  return val;
}

const OOS = {
  cagr:   17.64,
  sharpe: 1.00,
  mdd:    10.18,
  nav:    58.44,
};
const IS = {
  cagr:   17.26,
  sharpe: 1.42,
  mdd:    12.32,
  nav:    67.88,
};

function Metric({ prefix = '', suffix = '', label, sub, target, positive, negative, duration = 1600, decimals = 0, triggered }: {
  prefix?: string; suffix?: string; label: string; sub?: string;
  target: number; positive?: boolean; negative?: boolean;
  duration?: number; decimals?: number; triggered: boolean;
}) {
  const val = useCountUp(target, duration, triggered, decimals);
  return (
    <div className="text-center group min-w-0">
      <p className="mono text-[0.62rem] text-[var(--text-3)] tracking-[0.2em] uppercase mb-3">{label}</p>
      <p className={`mono font-black leading-none mb-2 whitespace-nowrap tracking-tight ${positive ? 'text-emerald-400' : negative ? 'text-red-400' : 'text-white'}`}
        style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)' }}>
        {prefix}{val.toFixed(decimals)}{suffix}
      </p>
      {sub && <p className="text-[0.72rem] text-[var(--text-3)] leading-tight">{sub}</p>}
    </div>
  );
}

export function Results() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="results" ref={ref} className="py-32 px-6 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="section-label">Performance</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Key Results</h2>
        </motion.div>

        {/* Tab label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg-1)] border border-[var(--border)]">
            <span className="px-4 py-1.5 rounded-md bg-blue-600/20 text-blue-400 mono text-xs font-medium">Out-of-Sample</span>
            <span className="px-4 py-1.5 text-[var(--text-3)] mono text-xs">D485–D726 · Fresh ¥50M</span>
          </div>
        </motion.div>

        {/* OOS Metrics — main */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 p-10 card"
          style={{ background: 'linear-gradient(135deg, rgba(13,18,32,1), rgba(17,24,39,1))' }}
        >
          <Metric label="OOS CAGR"    prefix="+"  suffix="%" target={OOS.cagr}   positive decimals={2} triggered={inView} />
          <Metric label="Sharpe Ratio"             target={OOS.sharpe} positive decimals={2} triggered={inView} duration={1200} />
          <Metric label="Max Drawdown" prefix="−" suffix="%" target={OOS.mdd}    negative decimals={2} triggered={inView} duration={1400} />
          <Metric label="Final NAV"    prefix="¥" suffix="M" target={OOS.nav}    positive decimals={2} triggered={inView} duration={1800}
            sub="From ¥50M cold start" />
        </motion.div>

        {/* IS vs OOS comparison bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {[
            { m: 'CAGR', is: IS.cagr, oos: OOS.cagr, unit: '%', prefix: '+', note: 'OOS exceeds IS', good: true },
            { m: 'Sharpe', is: IS.sharpe, oos: OOS.sharpe, unit: '', prefix: '', note: 'Shorter OOS window (≈1y)', good: false },
            { m: 'Max Drawdown', is: IS.mdd, oos: OOS.mdd, unit: '%', prefix: '−', note: 'OOS shallower ✓', good: true },
          ].map((c, i) => (
            <motion.div key={c.m}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-5"
            >
              <p className="mono text-[0.65rem] text-[var(--text-3)] tracking-widest uppercase mb-3">{c.m}</p>
              <div className="flex gap-6 items-end mb-3">
                <div>
                  <p className="mono text-[0.62rem] text-blue-400 mb-1">In-Sample</p>
                  <p className="mono text-xl font-bold text-blue-300">{c.prefix}{c.is.toFixed(2)}{c.unit}</p>
                </div>
                <div className="text-right flex-1">
                  <p className="mono text-[0.62rem] text-emerald-400 mb-1">Out-of-Sample</p>
                  <p className="mono text-xl font-bold text-emerald-300">{c.prefix}{c.oos.toFixed(2)}{c.unit}</p>
                </div>
              </div>
              <p className={`mono text-[0.68rem] ${c.good ? 'text-emerald-500' : 'text-[var(--text-3)]'}`}>{c.note}</p>
            </motion.div>
          ))}
        </div>

        {/* Hero statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.08))' }}
        >
          <div className="absolute inset-0 border border-emerald-500/10 rounded-2xl" />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="mono text-[0.65rem] text-emerald-400 tracking-[0.2em] uppercase">Verified</span>
            </div>
            <p className="text-4xl md:text-5xl font-black text-white mb-4">Generalization Confirmed</p>
            <p className="text-[var(--text-2)] max-w-xl mx-auto text-base leading-relaxed">
              OOS CAGR (+17.64%) modestly exceeds IS CAGR (+17.26%). MaxDD improves from −12.32% to −10.18%.
              Growth does not decay from in-sample to out-of-sample.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
