import { motion } from 'framer-motion';
import { SectionTitle } from '../ui/SectionTitle';
import { FUTURE_RESEARCH } from '../../data/strategyData';

export function FutureResearchSection() {
  return (
    <section id="future" className="py-24 px-6 section-divider">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          eyebrow="Research Roadmap"
          title="Future Directions"
          subtitle="Four extensions that could materially improve the strategy's risk-adjusted performance and capacity."
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {FUTURE_RESEARCH.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="glass-card-hover rounded-2xl p-7"
              style={{ borderColor: `${item.color}20` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-base mb-2">{item.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-block glass-card rounded-2xl px-10 py-8">
            <p className="text-4xl mb-4">Fα</p>
            <p className="text-white font-bold text-lg mb-2">Finalpha · Team T025</p>
            <p className="text-gray-400 text-sm max-w-md">
              A disciplined, reproducible, and interpretable quantitative strategy
              built on the principle that portfolio diversification — not individual signal strength —
              is the primary source of edge.
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs mono text-gray-600">
              <span>OOS CAGR <span className="text-green-400">+17.64%</span></span>
              <span>·</span>
              <span>Sharpe <span className="text-blue-400">1.00</span></span>
              <span>·</span>
              <span>MaxDD <span className="text-red-400">−10.18%</span></span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
