import { motion } from 'framer-motion';

const base = import.meta.env.BASE_URL;

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center">
                <span className="mono text-blue-400 text-xs font-bold">Fα</span>
              </div>
              <span className="font-bold text-white text-base">Finalpha</span>
            </div>
            <p className="text-[var(--text-2)] text-sm max-w-xs leading-relaxed">
              A Defensive Short-Horizon Reversal Strategy with Order-Book Microstructure
              for Long-Only A-Share Portfolios.
            </p>
            <p className="mono text-[var(--text-3)] text-[0.65rem] mt-3 tracking-wide">
              Feishu Quant Competition 2026 · Team T025 · June 2026
            </p>
          </div>

          {/* Center — metrics */}
          <div className="text-center">
            <p className="mono text-[0.6rem] text-[var(--text-3)] tracking-widest uppercase mb-3">Out-of-Sample</p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="mono text-lg font-bold text-emerald-400">+17.64%</p>
                <p className="mono text-[0.58rem] text-[var(--text-3)]">CAGR</p>
              </div>
              <div className="text-center">
                <p className="mono text-lg font-bold text-blue-400">1.00</p>
                <p className="mono text-[0.58rem] text-[var(--text-3)]">Sharpe</p>
              </div>
              <div className="text-center">
                <p className="mono text-lg font-bold text-red-400">−10.18%</p>
                <p className="mono text-[0.58rem] text-[var(--text-3)]">MaxDD</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="text-right">
            <a href={`${base}Research_report.pdf`} target="_blank" rel="noopener noreferrer"
              className="btn-primary mb-3 justify-center md:justify-end">
              Read Paper
            </a>
            <p className="mono text-[var(--text-3)] text-[0.62rem] leading-relaxed">
              Built with React + TypeScript + Tailwind<br />
              Deployed on GitHub Pages
            </p>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="mono text-[var(--text-3)] text-[0.65rem] tracking-wide">
            Shanghai Stock Exchange · Long-Only · Sell-at-Open · T+1 Settlement
          </p>
          <p className="mono text-[var(--text-3)] text-[0.65rem] italic text-center">
            "Research, reproducibility, and robustness."
          </p>
        </div>
      </div>
    </footer>
  );
}
