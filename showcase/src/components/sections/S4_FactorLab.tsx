import { motion } from 'framer-motion';
import { SectionMeta } from '../ui/SectionMeta';
import { Finding } from '../ui/Finding';
import { ResearchNote } from '../ui/ResearchNote';

const FACTORS = [
  {
    name: 'LOWVOL',
    weight: +0.174,
    family: 'Risk',
    ic: 0.0947, icir: 0.815,  // composite reflects it most
    color: 'var(--blue)',
    intuition: 'Low-idiosyncratic-volatility stocks earn superior risk-adjusted returns, partly from leverage constraints and partly from retail preference for high-beta names. The low-vol anomaly is one of the most robust return premia documented across markets.',
    construction: '−σ₂₀(rᵢ,ₜ): negative 20-day rolling realised volatility of adjusted daily returns.',
  },
  {
    name: 'RANGE_PCT',
    weight: +0.156,
    family: 'Anti-Lottery',
    ic: null, icir: null,
    color: 'var(--amber)',
    intuition: 'Intraday range relative to close price. Narrow-range stocks (calm-range) tend to outperform wide-range stocks (lottery-like). This is a complementary dimension of the low-vol anomaly, capturing intraday volatility rather than daily close-to-close vol.',
    construction: '−(Hᵢ,ₜ − Lᵢ,ₜ)/Cᵢ,ₜ: negative daily high-minus-low divided by closing price.',
  },
  {
    name: 'SKEW_60',
    weight: +0.155,
    family: 'Anti-Lottery',
    ic: null, icir: null,
    color: 'var(--amber)',
    intuition: '60-day return co-skewness. Positively-skewed stocks are overpriced by gambling demand. As skewness-seeking retail investors bid up lottery-like stocks, a persistent overpricing arises that subsequently mean-reverts. The negative skewness signal fades this premium.',
    construction: '−m₃/(σ₆₀)³: negative 60-day cubic central moment normalized by volatility cube.',
  },
  {
    name: 'REV_20',
    weight: +0.141,
    family: 'Reversal',
    ic: null, icir: null,
    color: 'var(--teal)',
    intuition: '20-day price reversal. Temporary retail overreaction to price moves creates a mean-reversion tendency over 2–4 weeks. This is the most well-documented anomaly in retail-dominated markets and provides the primary alpha anchor for the strategy.',
    construction: '−(Pᵢ,ₜ/Pᵢ,ₜ₋₂₀ − 1): negative 20-day price return.',
  },
  {
    name: 'DWI_AFT_MORN',
    weight: -0.118,
    family: 'Microstructure',
    ic: null, icir: null,
    color: 'var(--cyan)',
    intuition: 'Afternoon-minus-morning depth-weighted imbalance. When smart money shifts its order direction from morning to afternoon, it signals directional information about next-day price movement. The LOB captures this intraday information rotation.',
    construction: 'DWI_AFT − DWI_MORN: difference in 5-level depth-weighted order-flow imbalance between afternoon (snap_idx>12) and morning (snap_idx≤12).',
  },
  {
    name: 'SPR_D',
    weight: -0.109,
    family: 'Microstructure',
    ic: null, icir: null,
    color: 'var(--cyan)',
    intuition: 'Negative daily bid-ask spread. Tight spreads indicate high market quality, institutional attention, and better price discovery. Stocks with tight spreads tend to have lower future return predictability (efficient), but in the context of our signals, low spread → higher expected alpha. The negative weight reflects that wider spread stocks have more mispricing.',
    construction: '−(ask₁ − bid₁)/mid: negative relative bid-ask spread averaged across intraday snapshots.',
  },
  {
    name: 'REV_10',
    weight: +0.074,
    family: 'Reversal',
    ic: null, icir: null,
    color: 'var(--teal)',
    intuition: '10-day reversal, a shorter-horizon complement to REV_20. The reversal family is capped at 2 members to enforce diversification. Together, REV_10 and REV_20 provide reversal exposure at 2- and 4-week horizons.',
    construction: '−(Pᵢ,ₜ/Pᵢ,ₜ₋₁₀ − 1): negative 10-day price return.',
  },
  {
    name: 'OVNT',
    weight: -0.073,
    family: 'Microstructure',
    ic: null, icir: null,
    color: 'var(--cyan)',
    intuition: 'Overnight gap signal. Stocks that gap up at open due to positive retail sentiment tend to reverse intraday as informed traders take the other side. A negative weight fades overnight momentum, consistent with short-horizon reversal in this retail-driven market.',
    construction: '−(Openᵢ,ₜ/Closeᵢ,ₜ₋₁ − 1): negative overnight return (gap at market open).',
  },
];

const SIGNAL_TABLE = [
  { signal: 'BaseAlpha (raw)',            ic: 0.1026, icir: 0.674, note: 'Before sector residualization' },
  { signal: 'BaseAlpha (sector-resid.)',  ic: 0.0947, icir: 0.815, note: 'After λ=0.5 partial removal' },
  { signal: 'Ridge sleeve (z_ridge5)',    ic: 0.0945, icir: 0.619, note: 'Walk-forward, 5d target' },
  { signal: 'Finalpha (ensemble)',     ic: 0.0980, icir: 0.795, bold: true, note: 'Traded signal' },
];

export function S4_FactorLab() {
  const maxW = Math.max(...FACTORS.map(f => Math.abs(f.weight)));

  return (
    <section id="factor-lab" className="py-28 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <SectionMeta
          num="§ 3.  Factor Analysis"
          question="Why these 8 factors, and why do they work together?"
          lead={
            <>
              The 8 selected factors span four distinct economic themes, each grounded in documented market
              anomalies. The pairwise correlations confirm structural independence — no two factors carry
              redundant information (all off-diagonal |ρ| ≤ 0.65).
            </>
          }
        />

        {/* Factor weight bars — primary visualization */}
        <div className="mb-14">
          <p className="section-num mb-6">Table 1 — IC-IR Factor Weights (from Research Report)</p>
          <div className="space-y-2">
            {FACTORS.map((f, i) => {
              const barPct = (Math.abs(f.weight) / maxW) * 100;
              return (
                <motion.details
                  key={f.name}
                  className="card-research-hover overflow-hidden"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <summary className="flex items-center gap-4 px-4 py-3 cursor-pointer list-none">
                    {/* Weight bar */}
                    <div className="w-40 flex-shrink-0">
                      <div className="h-1.5 bg-[var(--bg)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: f.color, width: `${barPct}%` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${barPct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: i * 0.06 }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold text-[var(--text)] w-28 flex-shrink-0">{f.name}</span>
                    <span className="font-mono text-sm font-bold flex-shrink-0" style={{ color: f.color }}>
                      {f.weight > 0 ? '+' : ''}{f.weight.toFixed(3)}
                    </span>
                    <span className="font-mono text-[0.65rem] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: `${f.color}12`, color: f.color }}>{f.family}</span>
                    <span className="font-mono text-[0.65rem] text-[var(--text-3)] ml-auto hidden md:block">
                      {f.weight > 0 ? 'Long high-z' : 'Short high-z'} → click for detail
                    </span>
                  </summary>
                  <div className="px-4 pb-4 pt-2 border-t border-[var(--border-dim)] grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-mono text-[0.62rem] text-[var(--text-3)] uppercase tracking-widest mb-1">Economic Intuition</p>
                      <p className="text-[0.8rem] text-[var(--text-2)] leading-relaxed">{f.intuition}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.62rem] text-[var(--text-3)] uppercase tracking-widest mb-1">Construction</p>
                      <p className="font-mono text-[0.75rem] text-[var(--text-2)] leading-relaxed bg-[var(--bg)] rounded p-2">{f.construction}</p>
                    </div>
                  </div>
                </motion.details>
              );
            })}
          </div>
        </div>

        {/* Predictive strength table */}
        <div className="mb-14">
          <p className="section-num mb-4">Table 2 — Signal Stage Predictive Strength (in-sample)</p>
          <div className="card-research overflow-hidden">
            <table className="table-research">
              <thead>
                <tr>
                  <th>Signal</th>
                  <th>IC</th>
                  <th>ICIR</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {SIGNAL_TABLE.map(row => (
                  <tr key={row.signal} className={row.bold ? 'row-highlight' : ''}>
                    <td className={row.bold ? 'font-semibold' : ''}>{row.signal}</td>
                    <td className="pos">{row.ic.toFixed(4)}</td>
                    <td className={row.bold ? 'pos font-bold' : ''}>{row.icir.toFixed(3)}</td>
                    <td className="text-[var(--text-3)]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-mono text-[0.72rem] text-[var(--text-3)] mt-2">
            Sector residualization trades IC −0.008 for ICIR +0.141 — a highly favorable exchange.
            The ensemble achieves IC 0.0980, higher than either component individually.
          </p>
        </div>

        {/* Correlation heatmap — actual figure */}
        <div className="mb-10">
          <p className="section-num mb-3">Figure 1 — Factor Correlation Matrix</p>
          <p className="text-[0.8rem] text-[var(--text-2)] mb-4 max-w-prose">
            All off-diagonal entries lie below the 0.65 redundancy threshold. The strongest correlation
            (REV_10 ↔ REV_20, ρ≈0.63) is within the reversal family, which is why the family cap allows
            at most 2 reversal factors. Microstructure factors (DWI_AFT_MORN, SPR_D) show near-zero
            correlation with price-based factors, confirming their information orthogonality.
          </p>
          <div className="card-research p-4">
            <img src="figures/fig3_factor_corr.png"
              alt="8-factor pairwise Spearman correlation matrix"
              className="w-full max-w-2xl mx-auto block rounded"
              style={{ filter: 'brightness(0.97) contrast(1.06)' }} />
            <p className="font-mono text-[0.65rem] text-[var(--text-3)] text-center mt-3">
              Figure 1: Pairwise rank-correlation matrix of the eight IC-IR-selected factors (IS mean, D080–D484).
              Factors ordered by |ICIR| descending.
            </p>
          </div>
        </div>

        <Finding label="Key Finding — §3.4">
          The composite is dominated by defensive low-risk factors (LOWVOL, RANGE_PCT), anti-lottery
          skewness (SKEW_60), and multi-horizon reversal (REV_20, REV_10), with two order-book factors
          (DWI_AFT_MORN, SPR_D) providing decorrelated microstructure signals. This combination is
          not accidental — it reflects the four market anomalies identified in §1.
        </Finding>

        <ResearchNote label="Why are LOB factors included despite being noisier?">
          <p>The LOB factors carry information that is largely <em>orthogonal</em> to the price-based family.
          DWI_AFT_MORN has pairwise Spearman correlation ≤ 0.09 with all seven other selected factors.
          Even a weak signal with |IC| ≈ 0.09 contributes meaningfully to the composite when it is
          uncorrelated with the existing factors — this is the ensemble diversification principle at the
          factor level (within BaseAlpha) before the Ridge-sleeve ensemble at the signal level.</p>
        </ResearchNote>
      </div>
    </section>
  );
}
