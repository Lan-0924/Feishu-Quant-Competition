import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionTitle } from '../ui/SectionTitle';
import { GlassCard } from '../ui/GlassCard';
import { PORTFOLIO_NODES, RISK_OVERLAYS } from '../../data/strategyData';

const NODE_COLORS = ['#6B7280', '#3B82F6', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];

export function PortfolioEngineSection() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const active = PORTFOLIO_NODES.find(n => n.id === activeNode);

  return (
    <section id="portfolio" className="py-24 px-6 section-divider">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="Portfolio Construction"
          title="Portfolio Engine"
          subtitle="A concentrated, risk-controlled execution machine built for T+1 rules with three adaptive overlays."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Flow diagram */}
          <div className="flex flex-col items-center gap-0">
            {PORTFOLIO_NODES.map((node, i) => (
              <div key={node.id} className="flex flex-col items-center w-full">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    w-full max-w-xs px-5 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer glass-card
                    ${activeNode === node.id ? 'ring-1' : 'hover:bg-white/5'}
                  `}
                  style={{
                    borderColor: activeNode === node.id ? NODE_COLORS[i] : 'rgba(255,255,255,0.08)',
                    boxShadow: activeNode === node.id ? `0 0 16px ${NODE_COLORS[i]}20` : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: NODE_COLORS[i] }} />
                    <span className="text-white text-sm font-semibold">{node.label}</span>
                  </div>
                </motion.button>

                {i < PORTFOLIO_NODES.length - 1 && (
                  <div className="flex flex-col items-center my-1">
                    <div className="w-px h-4 bg-white/10" />
                    <svg width="8" height="6"><path d="M4 6L0 0h8L4 6z" fill="rgba(255,255,255,0.15)" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detail / Risk overlays panel */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card rounded-2xl p-6 mb-6"
                >
                  <p className="text-white font-bold mb-2">{active.label}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{active.detail}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl p-6 mb-6 text-center"
                >
                  <p className="text-gray-500 text-sm">Click a stage to see details</p>
                </motion.div>
              )}
            </AnimatePresence>

            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mono">Risk Overlays</h3>
            {RISK_OVERLAYS.map((ro, i) => (
              <GlassCard key={ro.name} delay={i * 0.1} className="p-5" hover>
                <div className="flex items-start gap-4">
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: ro.color }}
                  />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-white text-sm font-semibold">{ro.name}</p>
                      <span className="mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${ro.color}15`, color: ro.color }}>
                        {ro.target}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{ro.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Key parameters */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mono mb-4">Key Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { k: 'Holdings Target', v: 'N = 12' },
              { k: 'Holdings Floor', v: 'N ≥ 10' },
              { k: 'Name Cap', v: '9% / name' },
              { k: 'Rebalance Freq', v: 'Every 10d' },
              { k: 'Sticky Top K', v: 'Top-50' },
              { k: 'Vol Target', v: '18% ann.' },
              { k: 'DD Breaker', v: '−5% from peak' },
              { k: 'Execution', v: 'T+1, sell open' },
            ].map(p => (
              <div key={p.k} className="glass-card rounded-lg p-3">
                <p className="text-gray-500 text-xs mono">{p.k}</p>
                <p className="text-white text-sm mono font-semibold mt-1">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
