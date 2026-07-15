import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const base = import.meta.env.BASE_URL;

const FIGURES = [
  {
    file: 'fig3_oos_equity.png',
    title: 'Out-of-Sample Equity Curve',
    caption: 'Finalpha OOS performance (D485–D726, fresh ¥50M cold start). CAGR +17.64%, Sharpe 1.00, MaxDD −10.18%, total PnL +16.89%.',
    wide: true,
  },
  {
    file: 'fig1_is_equity.png',
    title: 'In-Sample Equity Curve',
    caption: 'Finalpha IS equity curve (D080–D484, ≈1.9 years). CAGR +17.26%, Sharpe 1.42, MaxDD −12.32%, Final NAV ¥67.88M.',
    wide: false,
  },
  {
    file: 'fig3_factor_corr.png',
    title: 'Factor Correlation Matrix',
    caption: '8-factor pairwise Spearman rank-correlations (IS mean, D080–D484). All off-diagonal entries lie below the 0.65 redundancy threshold, confirming structural independence.',
    wide: false,
  },
  {
    file: 'fig2_signal_decomposition.png',
    title: 'Signal Decomposition — IS Backtest',
    caption: 'BaseAlpha (blue) vs Ridge sleeve (orange) vs Finalpha ensemble (green). The Ridge alone achieves only CAGR +1.49%, yet the ensemble reaches +17.26% — pure diversification gain.',
    wide: true,
  },
];

// ── Fullscreen Modal ─────────────────────────────────────────
function Modal({ idx, onClose, onNav }: {
  idx: number; onClose: () => void; onNav: (dir: 1 | -1) => void;
}) {
  const fig = FIGURES[idx];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    };
    window.addEventListener('keydown', fn);
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose, onNav]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
        title="Close (Esc)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Prev / Next */}
      {idx > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onNav(-1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      )}
      {idx < FIGURES.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNav(1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      )}

      {/* Image */}
      <motion.div
        className="relative max-h-[80vh] max-w-5xl w-full"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={`${base}figures/${fig.file}`}
          alt={fig.title}
          className="w-full h-full object-contain rounded-lg"
        />
      </motion.div>

      {/* Caption */}
      <motion.div
        className="mt-5 max-w-2xl text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={e => e.stopPropagation()}
      >
        <p className="text-white font-semibold text-sm mb-1">{fig.title}</p>
        <p className="text-[var(--text-2)] text-xs leading-relaxed">{fig.caption}</p>
        <p className="mono text-[var(--text-3)] text-[0.6rem] mt-3">
          {idx + 1} / {FIGURES.length} · ← → to navigate · Esc to close
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Gallery section ──────────────────────────────────────────
export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  const navigate = useCallback((dir: 1 | -1) => {
    setOpen(prev => {
      if (prev === null) return null;
      const next = prev + dir;
      return next >= 0 && next < FIGURES.length ? next : prev;
    });
  }, []);

  return (
    <section id="figures" className="py-32 px-6 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">Figures</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Research Figures</h2>
          <p className="text-[var(--text-2)] mt-4 text-base">Click any figure to enlarge · Use ← → or keyboard to navigate</p>
        </motion.div>

        {/* Masonry grid using CSS columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-0">
          {FIGURES.map((fig, i) => (
            <motion.div
              key={fig.file}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="break-inside-avoid mb-5 group cursor-pointer"
              onClick={() => setOpen(i)}
            >
              <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-1)] transition-all duration-300 group-hover:border-blue-500/30 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <img
                  src={`${base}figures/${fig.file}`}
                  alt={fig.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-semibold leading-snug mb-1">{fig.title}</p>
                  <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{fig.caption}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <svg className="text-blue-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                    <span className="text-blue-400 text-[0.65rem] mono">Expand</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open !== null && (
          <Modal idx={open} onClose={() => setOpen(null)} onNav={navigate} />
        )}
      </AnimatePresence>
    </section>
  );
}
