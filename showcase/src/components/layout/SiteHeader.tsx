import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NAV = [
  { label: 'Highlights', href: '#highlights' },
  { label: 'Pipeline',   href: '#pipeline'   },
  { label: 'Results',    href: '#results'    },
  { label: 'Figures',    href: '#figures'    },
  { label: 'Paper',      href: '#paper'      },
];

const base = import.meta.env.BASE_URL;

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${solid ? 'bg-[rgba(10,14,23,0.92)] backdrop-blur-md border-b border-[var(--border)]' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <span className="mono text-blue-400 text-xs font-semibold">Fα</span>
          </div>
          <span className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">Finalpha</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {NAV.map(n => (
            <a key={n.href} href={n.href}
              className="text-xs font-medium text-[var(--text-2)] hover:text-white transition-colors tracking-wide">
              {n.label}
            </a>
          ))}
          <a href={`${base}Research_report.pdf`} target="_blank" rel="noopener noreferrer"
            className="btn-primary text-xs !py-1.5 !px-3">
            Read Paper
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
