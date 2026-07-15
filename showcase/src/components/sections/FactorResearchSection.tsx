import { useState } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { SectionTitle } from '../ui/SectionTitle';
import { GlassCard } from '../ui/GlassCard';
import { FACTOR_WEIGHTS, FACTOR_GROUPS } from '../../data/strategyData';

const GROUP_COLORS: Record<string, string> = {
  'Reversal': '#10B981',
  'Low Volatility': '#3B82F6',
  'Anti-Lottery': '#EF4444',
  'Microstructure (LOB)': '#06B6D4',
  'Intraday': '#8B5CF6',
  'Liquidity & Momentum': '#F59E0B',
};

export function FactorResearchSection() {
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);
  const [showCorr, setShowCorr] = useState(false);

  return (
    <section id="factors" className="py-24 px-6 section-divider">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="Factor Research"
          title="Factor Universe"
          subtitle="27 raw factors across 6 economic themes — screened through IC, sign-stability, redundancy, and family cap gates to reach 8 selected factors."
        />

        {/* Factor group cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {FACTOR_GROUPS.map((group, i) => (
            <GlassCard key={group.name} hover delay={i * 0.08} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold text-sm">{group.name}</p>
                  <p className="mono text-xs mt-0.5" style={{ color: GROUP_COLORS[group.name] }}>
                    {group.count} factor{group.count > 1 ? 's' : ''}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs mono font-bold flex-shrink-0"
                  style={{ backgroundColor: `${GROUP_COLORS[group.name]}15`, color: GROUP_COLORS[group.name] }}
                >
                  {group.count}
                </div>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">{group.description}</p>
              <div className="flex flex-wrap gap-1">
                {group.factors.slice(0, 5).map(f => (
                  <span key={f} className="text-xs mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${GROUP_COLORS[group.name]}10`, color: GROUP_COLORS[group.name] }}>
                    {f}
                  </span>
                ))}
                {group.factors.length > 5 && (
                  <span className="text-xs mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                    +{group.factors.length - 5}
                  </span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* 4-gate screening summary */}
        <div className="glass-card rounded-2xl p-5 mb-10">
          <p className="text-white font-semibold text-sm mb-4">Four-Gate Factor Screening (IS only)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { gate: 'Gate 1', label: 'IC threshold', value: '|IC| ≥ 0.010', color: '#3B82F6' },
              { gate: 'Gate 2', label: 'Sign stability', value: 'Both halves ≥ 20% of full IC, same sign', color: '#8B5CF6' },
              { gate: 'Gate 3', label: 'Redundancy', value: 'Max pairwise corr ≤ 0.65 · |ICIR| ≥ 0.12', color: '#F59E0B' },
              { gate: 'Gate 4', label: 'Family cap', value: '≤ 2 per economic theme', color: '#10B981' },
            ].map(g => (
              <div key={g.gate} className="glass-card rounded-lg p-3">
                <p className="mono text-xs font-bold mb-1" style={{ color: g.color }}>{g.gate}</p>
                <p className="text-gray-400 text-xs font-medium mb-0.5">{g.label}</p>
                <p className="text-white text-xs mono leading-snug">{g.value}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mono mt-3">
            27 candidates → gates → top-8 by |ICIR| across distinct families → ICIR-weighted blend
          </p>
        </div>

        {/* Selected 8 factors with weights */}
        <div className="mb-12">
          <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-blue-600/20 text-blue-400 mono text-xs flex items-center justify-center font-bold">8</span>
            Selected Factors — IC-IR Weights (Table 1)
          </h3>
          <p className="text-gray-500 text-xs mono mb-5">
            w_c = sign(IC_c) × |ICIR_c| / Σ|ICIR_c′| · Composite IC=+0.0947, ICIR=+0.815 after sector residualization
          </p>
          <div className="space-y-2.5">
            {FACTOR_WEIGHTS.map((fw, i) => {
              const color = GROUP_COLORS[fw.group] ?? '#3B82F6';
              const absW = Math.abs(fw.weight);
              const barWidth = (absW / 0.174) * 100;
              const isActive = hoveredFactor === fw.factor;
              const sign = fw.weight > 0 ? 'Long' : 'Short';

              return (
                <motion.div
                  key={fw.factor}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  onMouseEnter={() => setHoveredFactor(fw.factor)}
                  onMouseLeave={() => setHoveredFactor(null)}
                  className={`glass-card rounded-xl p-4 transition-all duration-200 cursor-default ${isActive ? 'border-white/15' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-32 flex-shrink-0">
                      <p className="text-white font-mono text-sm font-semibold">{fw.factor}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs mono px-1 py-0 rounded text-xs" style={{ backgroundColor: `${color}15`, color }}>{fw.group}</span>
                        <span className={`text-xs mono ${fw.weight > 0 ? 'text-green-500' : 'text-red-400'}`}>{sign}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${barWidth}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.06 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                        <span className="mono text-sm font-bold w-16 text-right" style={{ color }}>
                          {fw.weight > 0 ? '+' : ''}{fw.weight.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-400 text-xs mt-3 leading-relaxed border-t border-white/5 pt-3"
                    >
                      {fw.description}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Correlation heatmap — actual figure */}
        <div>
          <h3 className="text-base font-semibold text-white mb-2">Factor Correlation Matrix (Figure 1)</h3>
          <p className="text-gray-500 text-sm mb-4 mono">
            IS-mean pairwise cross-sectional Spearman correlation — ordered by |ICIR| descending.
            All off-diagonal entries lie below the 0.65 redundancy threshold.
            Strongest correlation: REV_10 ↔ REV_20 at ρ=0.63 (both reversal family, max 2 allowed).
            Microstructure factors (DWI_AFT_MORN, SPR_D) show near-zero correlation with price-based factors — confirming orthogonality.
          </p>
          <div className="glass-card rounded-2xl p-4 mb-4">
            <p className="text-white text-sm font-semibold mb-1 px-2">fig3_factor_corr.png — Direct Notebook Export</p>
            <p className="text-gray-500 text-xs mb-4 px-2 mono">BaseAlpha — 8-factor cross-sectional Spearman correlation (IS mean)</p>
            <img
              src="figures/fig3_factor_corr.png"
              alt="8-factor pairwise correlation matrix"
              className="w-full rounded-xl max-w-2xl mx-auto block"
              style={{ filter: 'brightness(0.97) contrast(1.05)' }}
            />
          </div>

          {/* Show/hide interactive Plotly version */}
          <button
            onClick={() => setShowCorr(!showCorr)}
            className="text-xs mono text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showCorr ? '▼ Hide' : '▶ Show'} interactive Plotly version
          </button>

          {showCorr && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card rounded-2xl p-4 mt-4 overflow-hidden"
            >
              <PlotlyHeatmap/>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Lazy-rendered Plotly heatmap (only shown when user clicks toggle)
function PlotlyHeatmap() {
  const labels = ['LOWVOL', 'RANGE_PCT', 'SKEW_60', 'REV_20', 'DWI_AFT_MORN', 'SPR_D', 'REV_10', 'OVNT'];
  const matrix = [
    [ 1.00,  0.62,  0.17,  0.10, -0.04, -0.14,  0.02, -0.07],
    [ 0.62,  1.00,  0.15,  0.15, -0.02, -0.09,  0.13, -0.02],
    [ 0.17,  0.15,  1.00,  0.30,  0.01, -0.06,  0.20, -0.01],
    [ 0.10,  0.15,  0.30,  1.00,  0.05,  0.00,  0.63, -0.00],
    [-0.04, -0.02,  0.01,  0.05,  1.00,  0.09,  0.05, -0.01],
    [-0.14, -0.09, -0.06,  0.00,  0.09,  1.00,  0.02,  0.04],
    [ 0.02,  0.13,  0.20,  0.63,  0.05,  0.02,  1.00,  0.02],
    [-0.07, -0.02, -0.01, -0.00, -0.01,  0.04,  0.02,  1.00],
  ];

  return (
    <Plot
      data={[{
        z: matrix, x: labels, y: labels,
        type: 'heatmap',
        colorscale: [[0, '#1D4ED8'], [0.4, '#1E3A5F'], [0.5, '#111827'], [0.6, '#7F1D1D'], [1, '#DC2626']],
        zmin: -0.7, zmax: 0.7,
        showscale: true,
        colorbar: { thickness: 12, outlinewidth: 0, tickfont: { color: '#6B7280', size: 10, family: 'JetBrains Mono' }, bgcolor: 'transparent' },
        text: matrix.map(row => row.map(v => v.toFixed(2))),
        texttemplate: '%{text}',
        textfont: { size: 10, color: '#E5E7EB', family: 'JetBrains Mono' },
        hovertemplate: '%{y} × %{x}<br>ρ = %{z:.3f}<extra></extra>',
      } as any]}
      layout={{
        paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
        margin: { t: 10, r: 10, b: 70, l: 110 },
        xaxis: { tickfont: { color: '#9CA3AF', size: 10, family: 'JetBrains Mono' }, tickangle: -30, gridcolor: 'transparent' },
        yaxis: { tickfont: { color: '#9CA3AF', size: 10, family: 'JetBrains Mono' }, gridcolor: 'transparent', autorange: 'reversed' as const },
        font: { family: 'JetBrains Mono' },
      } as any}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '380px' }}
    />
  );
}
