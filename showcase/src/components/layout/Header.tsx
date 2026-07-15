import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NAV = [
  { label: 'Context',     href: '#context' },
  { label: 'Alpha',       href: '#alpha-factory' },
  { label: 'Factors',     href: '#factor-lab' },
  { label: 'Ensemble',    href: '#ensemble' },
  { label: 'Portfolio',   href: '#portfolio' },
  { label: 'OOS',         href: '#generalization' },
  { label: 'Leakage',     href: '#leakage' },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${solid ? 'bg-[rgba(7,11,18,0.92)] backdrop-blur-md border-b border-[var(--border)]' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[0.65rem] text-[var(--blue)] tracking-widest uppercase">T025</span>
          <span className="text-[var(--border)] text-xs">·</span>
          <span className="font-mono text-[0.65rem] text-[var(--text-3)] tracking-wider">Finalpha</span>
        </div>
        <nav className="hidden md:flex items-center gap-5">
          {NAV.map(n => (
            <a key={n.href} href={n.href}
              className="font-mono text-[0.65rem] text-[var(--text-3)] hover:text-[var(--text-2)] uppercase tracking-widest transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
