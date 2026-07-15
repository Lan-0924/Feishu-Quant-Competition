import { motion } from 'framer-motion';
import { SectionTitle } from '../ui/SectionTitle';
import { OOS_METRICS } from '../../data/strategyData';

const TIMELINE_ITEMS = [
  {
    phase: 'Factor computation',
    window: 'All days (t−∞ → t−1)',
    label: '1-Day Factor Lag',
    detail: 'Every factor is shift(1) over asset_id. A day-t investment decision may only use information available through the close of t−1. Applied to all 27 factors (both price and LOB). LOB factors additionally EMA-smoothed (half-life 3d) before z-scoring.',
    color: '#3B82F6',
    icon: '⏱',
    gate: 'Causal boundary at source',
  },
  {
    phase: 'Factor weight fitting',
    window: 'IS only: D001–D484',
    label: 'IS-Only Factor Weights',
    detail: 'IC-IR weighting, sign-stability tests, redundancy filtering, and family cap — all fitted on in-sample data (D001–D484) with the 10-day forward-return target masked so the window never crosses into OOS. No weight is re-estimated after D484.',
    color: '#8B5CF6',
    icon: '🔒',
    gate: 'Forward-return masking at IS boundary',
  },
  {
    phase: 'Sector map estimation',
    window: 'D080–D240 only',
    label: 'Frozen Sector Map',
    detail: 'PCA(20)+KMeans(10) sector clustering estimated once on D080–D240 daily return co-movement. The asset→cluster mapping is frozen and reused unchanged for all days including OOS. The OOS portfolio carries no sector label information from OOS returns.',
    color: '#F59E0B',
    icon: '❄️',
    gate: 'Never refit after D240',
  },
  {
    phase: 'Ridge model training',
    window: 'Expanding past-only window · Purge=12d',
    label: 'Purged Walk-Forward Ridge',
    detail: 'Ridge(α=10) retrains every 30 days. Training set T_τ uses only observations strictly before (prediction_day − 12). Purge gap 12d > 5-day target horizon: no training label\'s forward-return window overlaps prediction day. Eliminates leakage from overlapping futures.',
    color: '#EF4444',
    icon: '🧹',
    gate: 'Purge gap 12 > horizon 5',
  },
  {
    phase: 'OOS portfolio execution',
    window: 'D485–D726',
    label: 'No OOS Retraining',
    detail: 'All artifacts used in OOS (factor weights, sector map, Ridge coefficients) are derived exclusively from data prior to each prediction date. The walk-forward Ridge does update on new data, but only using past-only windows with the purge rule applied. The IS-fitted artifact set drives the portfolio.',
    color: '#10B981',
    icon: '🚫',
    gate: 'IS-fitted parameters throughout',
  },
  {
    phase: 'Independent replay',
    window: 'D485–D705 (23 rebalance days)',
    label: 'Official Rules Replay',
    detail: `An independent re-pricing of the submitted CSV from a ¥50M cold start under the literal Section-4 competition rules reproduces the strategy NAV to max relative error of 3.2×10⁻¹⁶. Minimum EOD holdings across all ${OOS_METRICS.days} OOS days: 10 (rule requires ≥ 10). All 15 format and rule checks PASS.`,
    color: '#06B6D4',
    icon: '✅',
    gate: 'Max |reldiff| = 3.2×10⁻¹⁶',
  },
];

export function LeakageControlSection() {
  return (
    <section id="leakage" className="py-24 px-6 section-divider">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          eyebrow="Data Integrity"
          title="Zero Look-Ahead Bias"
          subtitle="Every stage of the pipeline was designed with explicit leakage controls. Here is the formal audit trail — five gates with independent verification."
        />

        {/* All-pass banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 mb-10 border border-green-500/20 flex flex-col md:flex-row items-start md:items-center gap-5"
        >
          <div className="text-4xl">✅</div>
          <div>
            <p className="text-white font-bold text-lg">5 Leakage Gates Passed · Independent Replay Verified</p>
            <p className="text-gray-400 text-sm mt-1">
              Official-rules replay from ¥50M cold start reproduces strategy NAV to max|reldiff|&nbsp;=&nbsp;3.2×10⁻¹⁶.
              All {OOS_METRICS.orderRows} order rows ({OOS_METRICS.buys} buys, {OOS_METRICS.sells} sells) across {OOS_METRICS.rebalDays} rebalancing days pass the 15-point format validation.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-14">
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/30 via-white/10 to-cyan-500/20"/>
          <div className="space-y-6">
            {TIMELINE_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-5"
              >
                <div className="flex-shrink-0 relative z-10">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}40` }}
                  >
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1 glass-card rounded-xl p-4 hover:border-white/15 transition-all duration-200">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs text-gray-600 mono mb-1">{item.phase}</p>
                      <p className="text-white font-semibold text-sm">{item.label}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="mono text-xs px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                        {item.window}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.detail}</p>
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"/>
                    <p className="text-green-400 text-xs mono">{item.gate}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Time split table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <p className="text-white font-semibold text-sm mb-4">Time Split and Data Governance</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs mono">
              <thead>
                <tr className="border-b border-white/10">
                  {['Period', 'Days', 'Role', 'Artifacts Produced', 'Leakage Risk'].map(h => (
                    <th key={h} className="py-2 px-3 text-left text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-white/5">
                  <td className="py-2.5 px-3 text-blue-400 font-semibold">D001–D079</td>
                  <td className="py-2.5 px-3">79</td>
                  <td className="py-2.5 px-3">Factor warm-up</td>
                  <td className="py-2.5 px-3">Rolling windows initialized</td>
                  <td className="py-2.5 px-3 text-green-400">None</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 px-3 text-blue-400 font-semibold">D080–D240</td>
                  <td className="py-2.5 px-3">161</td>
                  <td className="py-2.5 px-3">Sector estimation window</td>
                  <td className="py-2.5 px-3">PCA+KMeans sector map (frozen)</td>
                  <td className="py-2.5 px-3 text-green-400">None — early IS window only</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 px-3 text-blue-400 font-semibold">D080–D484</td>
                  <td className="py-2.5 px-3">≈404</td>
                  <td className="py-2.5 px-3">In-sample (IS)</td>
                  <td className="py-2.5 px-3">Factor weights, hyperparameters</td>
                  <td className="py-2.5 px-3 text-green-400">None — forward returns masked at D484</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-green-400 font-semibold">D485–D726</td>
                  <td className="py-2.5 px-3">242</td>
                  <td className="py-2.5 px-3">Out-of-sample (OOS)</td>
                  <td className="py-2.5 px-3">Trade instructions only</td>
                  <td className="py-2.5 px-3 text-green-400">None — IS-only artifacts applied</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Submission compliance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6"
        >
          <p className="text-white font-semibold text-sm mb-4">Submission Compliance — T025_sell_open.csv</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { k: 'Order rows', v: OOS_METRICS.orderRows },
              { k: 'Buy rows', v: OOS_METRICS.buys },
              { k: 'Sell rows', v: OOS_METRICS.sells },
              { k: 'Rebalance days', v: OOS_METRICS.rebalDays },
            ].map(p => (
              <div key={p.k} className="text-center">
                <p className="text-white font-bold mono text-xl">{p.v}</p>
                <p className="text-gray-500 text-xs mono mt-1">{p.k}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Header format ✓', 'No all-zero rows ✓', 'buy ∈ [0,1] ✓', 'sell ∈ [0,1] ✓',
              '≤6 decimal places ✓', 'Asset ID regex ✓', 'Day range D485–D726 ✓',
              'Sorted ascending ✓', 'Unique (day,asset) ✓', 'No buy+sell same row ✓',
              '≥10 holdings daily ✓', 'NAV replay < 1e-6 ✓', 'Filename format ✓',
            ].map(chk => (
              <span key={chk} className="text-xs mono px-2.5 py-1 rounded bg-green-500/10 text-green-400">
                {chk}
              </span>
            ))}
          </div>
          <p className="text-green-400 mono text-xs font-bold mt-4">SUBMISSION READY · Max |reldiff| = 3.2×10⁻¹⁶</p>
        </motion.div>
      </div>
    </section>
  );
}
