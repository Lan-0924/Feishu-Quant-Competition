import { motion } from 'framer-motion';
import { SectionTitle } from '../ui/SectionTitle';
import { GlassCard } from '../ui/GlassCard';

const ANOMALIES = [
  {
    icon: '🔄',
    label: 'Short-Horizon Reversal',
    color: '#10B981',
    description: 'Pronounced 1–20 day mean-reversion driven by retail overreaction and temporary liquidity imbalances. Especially strong in retail-dominated A-share market.',
  },
  {
    icon: '📉',
    label: 'Low-Volatility Anomaly',
    color: '#3B82F6',
    description: 'Low-idiosyncratic-vol stocks earn superior risk-adjusted returns. Partly from leverage constraints; partly from retail preference for high-beta lottery-like names.',
  },
  {
    icon: '🎰',
    label: 'Anti-Lottery Effect',
    color: '#EF4444',
    description: 'Positively-skewed stocks are structurally overpriced by gambling-seeking retail investors. Negative skewness signal (SKEW_60) fades this persistent premium.',
  },
  {
    icon: '📖',
    label: 'Informative Order Flow',
    color: '#06B6D4',
    description: 'Signed order-flow imbalance and spread dynamics from the 10-level LOB carry short-horizon price predictability nearly orthogonal to price-based signals.',
  },
];

const MARKET_FACTS = [
  { label: 'Retail participation', value: '~80%', sub: 'of daily trading volume' },
  { label: 'Data universe', value: '2,270', sub: 'unique A-share stocks' },
  { label: 'LOB snapshots', value: '24/day', sub: '10-min, 10-level, 09:40–15:00' },
  { label: 'Eligible on avg', value: '11.2%', sub: 'of universe per day' },
  { label: 'Settlement', value: 'T+1', sub: 'No same-day selling' },
  { label: 'LOB factors', value: '11', sub: 'orthogonal to price family' },
];

export function ThesisSection() {
  return (
    <section id="thesis" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="Research Thesis"
          title="Market Context & Core Insight"
          subtitle="Shanghai A-shares exhibit four persistent structural anomalies that reward a carefully constructed ensemble of weak, decorrelated signals."
        />

        {/* Abstract excerpt */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-7 mb-12 border-l-2 border-blue-500/40"
        >
          <p className="text-xs mono text-blue-400 uppercase tracking-widest mb-3">Abstract</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            We propose and evaluate a long-only quantitative strategy for the Shanghai A-share market, designed to extract return predictability from a combination of price-based and order book signals. The market context shapes the design: strong short-horizon reversals, retail-driven order flow, and informative intraday book dynamics make this setting well suited to microstructure-augmented factor composites.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            The key design principle is <span className="text-white font-semibold">ensembling for diversification</span>: rather than stacking correlated factors to maximize raw predictive correlation, we blend a weak but decorrelated machine learning signal into a robust base composite, seeking breadth of information as the primary source of improvement.
          </p>
        </motion.div>

        {/* Four anomalies */}
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mono mb-5">
          Four Return Anomalies — The Economic Foundations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {ANOMALIES.map((a, i) => (
            <GlassCard key={a.label} hover delay={i * 0.08} className="p-5">
              <div className="text-2xl mb-3">{a.icon}</div>
              <p className="text-white font-semibold text-sm mb-1">{a.label}</p>
              <div className="w-6 h-0.5 rounded mb-2" style={{ backgroundColor: a.color }}/>
              <p className="text-gray-500 text-xs leading-relaxed">{a.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Market facts strip */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-14">
          {MARKET_FACTS.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-lg p-3 text-center"
            >
              <p className="text-white font-bold mono text-lg">{f.value}</p>
              <p className="text-xs text-gray-500 leading-tight mt-1">{f.sub}</p>
              <p className="text-xs text-gray-600 mt-0.5">{f.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Central thesis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden mb-14"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(16,185,129,0.08) 100%)' }}
        >
          <div className="absolute inset-0 border border-blue-500/15 rounded-3xl"/>
          <div className="relative p-10 text-center">
            <p className="text-xs mono text-blue-400 uppercase tracking-[0.3em] mb-4">Core Hypothesis</p>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Weak + Decorrelated Signals
              <br/>
              <span className="text-gradient-blue">outperform</span>
              <br/>
              Strong + Correlated Signals
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
              A Ridge sleeve with ICIR=+0.619 and standalone CAGR of only +1.49% becomes a valuable portfolio
              component when its prediction errors are nearly orthogonal to the BaseAlpha errors.
              The ensemble effect — not raw predictive power — is the true alpha source.
              CAGR improves from +12.41% to <span className="text-accent-green font-semibold">+17.26%</span>, Sharpe from 1.00 to <span className="text-accent-green font-semibold">1.42</span>.
            </p>
          </div>
        </motion.div>

        {/* Signal combination animation */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0">
          {[
            { label: 'BaseAlpha', sub: 'ICIR-Weighted · 8 Factors', sub2: 'Sector-Residualized (λ=0.5)', color: '#3B82F6', weight: '80%', ic: '+0.0947', icir: '+0.815', cagr: '+12.41%' },
            { label: '+', sub: '', sub2: '', color: '', weight: '', ic: '', icir: '', cagr: '' },
            { label: 'Ridge Sleeve', sub: 'Walk-Forward Ridge(α=10)', sub2: '5d target · 12d purge', color: '#8B5CF6', weight: '20%', ic: '+0.0945', icir: '+0.619', cagr: '+1.49%' },
            { label: '=', sub: '', sub2: '', color: '', weight: '', ic: '', icir: '', cagr: '' },
            { label: 'Finalpha', sub: 'Ensemble · Diversification', sub2: 'Breadth of information', color: '#10B981', weight: '100%', ic: '+0.0980', icir: '+0.795', cagr: '+17.26%' },
          ].map((item, i) =>
            item.label === '+' || item.label === '=' ? (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-3xl font-light text-gray-600 md:mx-4"
              >
                {item.label}
              </motion.div>
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass-card rounded-2xl p-5 text-center min-w-[170px]"
                style={{ borderColor: `${item.color}25`, borderWidth: 1 }}
              >
                <p className="text-white font-bold text-sm mb-0.5">{item.label}</p>
                <p className="text-gray-500 text-xs leading-tight mb-0.5">{item.sub}</p>
                <p className="text-gray-600 text-xs leading-tight mb-3">{item.sub2}</p>
                <div className="space-y-1 text-xs mono">
                  <div className="flex justify-between"><span className="text-gray-600">IC</span><span style={{ color: item.color }}>{item.ic}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">ICIR</span><span style={{ color: item.color }}>{item.icir}</span></div>
                  <div className="flex justify-between border-t border-white/5 pt-1 mt-1"><span className="text-gray-600">IS CAGR</span><span className="text-accent-green font-bold">{item.cagr}</span></div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5">
                  <span className="text-xs mono font-bold" style={{ color: item.color }}>{item.weight}</span>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
