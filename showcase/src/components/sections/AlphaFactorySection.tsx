import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionTitle } from '../ui/SectionTitle';
import { PIPELINE_NODES } from '../../data/strategyData';

const NODE_COLORS: Record<string, string> = {
  raw: '#6B7280', cs_norm: '#6B7280',
  ic: '#3B82F6', sign: '#3B82F6', redundancy: '#3B82F6', family: '#3B82F6',
  top8: '#8B5CF6', sector: '#F59E0B',
  base: '#3B82F6', ridge: '#8B5CF6', final: '#10B981',
};

const FORMULAS = [
  {
    title: 'OFI & DWI (LOB primitives)',
    latex: 'OFI = (bidvol₁ − askvol₁) / (bidvol₁ + askvol₁)\nDWI_L = Σₖ (1/k) × (bidvolₖ − askvolₖ) / (bidvolₖ + askvolₖ)',
    note: 'L=5 or 10 levels. 11 daily LOB factors aggregated from 10-min, 10-level snapshots at 24 intraday points.',
  },
  {
    title: 'Cross-Sectional Z-Score',
    latex: 'z_{i,t} = (f̃_{i,t} − μ_t(f̃)) / σ_t(f̃)',
    note: 'f̃ = winsorized at [1st, 99th] percentile. Uses only same-day cross-section. LOB factors EMA-smoothed (half-life 3d) before z-scoring.',
  },
  {
    title: 'IC and ICIR',
    latex: 'IC = mean(IC_t),   ICIR = mean(IC_t) / std(IC_t)',
    note: 'IC_t = cross-sectional Spearman correlation of z_factor with 10-day forward return rank.',
  },
  {
    title: 'BaseAlpha Weighting',
    latex: 'w_c = sign(IC_c) × |ICIR_c| / Σ_{c\'} |ICIR_{c\'}|\nBaseAlpha_{i,t} = Σ_c w_c × z_{c,i,t}',
    note: 'Top-8 factors by |ICIR| after IC gate, sign-stability, redundancy filter (pairwise corr ≤ 0.65) and family cap (≤ 2 per theme).',
  },
  {
    title: 'Sector Residualization',
    latex: 'BaseAlpha_res_{i,t} = BaseAlpha_{i,t} − λ × mean_{j∈s(i)}(BaseAlpha_{j,t})\nλ = 0.5',
    note: 'Partial (not full) sector-mean removal. Sector map: PCA(20)+KMeans(10) on D080–D240 returns, frozen thereafter.',
  },
  {
    title: 'Ridge Sleeve',
    latex: 'β̂_τ = argmin_β Σ_{(i,t)∈T_τ} (rank^(5)_{i,t} − z^T_{i,t} β)² + α‖β‖²₂\nα = 10,  purge = 12d > 5d horizon',
    note: 'Retrained every 30d on expanding past-only window. 12-day purge ensures no training label overlaps prediction day.',
  },
  {
    title: 'Finalpha',
    latex: 'Finalpha_{i,t} = 0.8 × z(BaseAlpha_res)_{i,t} + 0.2 × z(ridge5)_{i,t}',
    note: 'Both components cross-sectionally z-scored before blending. 20% Ridge weight chosen IS: enough to add decorrelated ML signal without destabilising the base.',
  },
  {
    title: 'Portfolio Weights',
    latex: 'w_i ∝ 0.5 × (1/σ_i) / Σ(1/σ_j) + 0.5 × rank(α_i) / Σrank(α_j)',
    note: 'Capped at 9%, renormalized. N=12 target, floor ≥ 10. Rebalanced every 10 days. Sticky top-50 reduces turnover.',
  },
];

export function AlphaFactorySection() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [showFormulas, setShowFormulas] = useState(false);
  const activeDetail = PIPELINE_NODES.find(n => n.id === activeNode);

  return (
    <section id="alpha-factory" className="py-24 px-6 section-divider">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          eyebrow="Alpha Pipeline"
          title="Alpha Factory"
          subtitle="An industrial-strength factor pipeline distilling 27 raw signals through rigorous screening into a disciplined composite alpha."
          center
        />

        <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
          {/* Pipeline nodes */}
          <div className="flex-1 flex flex-col items-center gap-0">
            {PIPELINE_NODES.map((node, i) => {
              const color = NODE_COLORS[node.id] ?? '#3B82F6';
              const isActive = activeNode === node.id;
              const isSpecial = node.id === 'final';
              return (
                <div key={node.id} className="flex flex-col items-center w-full">
                  <motion.button
                    onClick={() => setActiveNode(isActive ? null : node.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full max-w-sm px-5 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer glass-card ${isActive ? 'ring-1' : 'hover:bg-white/5'}`}
                    style={{
                      borderColor: isActive ? color : 'rgba(255,255,255,0.08)',
                      boxShadow: isActive ? `0 0 16px ${color}25` : undefined,
                      background: isSpecial ? 'rgba(16,185,129,0.06)' : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-semibold">{node.label}</p>
                        <p className="mono text-xs mt-0.5" style={{ color }}>{node.sublabel}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }}/>
                    </div>
                  </motion.button>
                  {i < PIPELINE_NODES.length - 1 && (
                    <div className="flex flex-col items-center my-1">
                      <div className="w-px h-4 bg-gradient-to-b from-white/10 to-white/5"/>
                      <svg width="8" height="6"><path d="M4 6L0 0h8L4 6z" fill="rgba(255,255,255,0.15)"/></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="flex-1 min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeDetail ? (
                <motion.div
                  key={activeDetail.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card rounded-2xl p-6 sticky top-24"
                  style={{ borderColor: `${NODE_COLORS[activeDetail.id] ?? '#3B82F6'}30` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS[activeDetail.id] ?? '#3B82F6' }}/>
                    <p className="text-white font-bold">{activeDetail.label}</p>
                  </div>
                  <p className="mono text-xs mb-4" style={{ color: NODE_COLORS[activeDetail.id] ?? '#3B82F6' }}>
                    {activeDetail.sublabel}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">{activeDetail.detail}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl p-6 sticky top-24 text-center"
                >
                  <div className="text-4xl mb-4">👆</div>
                  <p className="text-gray-500 text-sm">Click any pipeline stage for detailed explanation</p>
                  <p className="text-gray-600 text-xs mono mt-2">11 stages · 27 raw factors → 1 traded signal</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mathematical formulas toggle */}
        <div className="mt-4">
          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="flex items-center gap-2 text-xs mono text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            <span className={`transition-transform duration-200 ${showFormulas ? 'rotate-90' : ''}`}>▶</span>
            {showFormulas ? 'Hide' : 'Show'} Mathematical Formulas (from Research Report)
          </button>

          <AnimatePresence>
            {showFormulas && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FORMULAS.map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="glass-card rounded-xl p-4"
                    >
                      <p className="text-blue-400 text-xs mono font-semibold mb-2">{f.title}</p>
                      <pre className="text-white text-xs mono leading-relaxed bg-white/3 rounded-lg p-3 mb-2 overflow-x-auto whitespace-pre-wrap">{f.latex}</pre>
                      <p className="text-gray-500 text-xs leading-relaxed">{f.note}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
