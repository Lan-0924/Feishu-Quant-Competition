import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResearchNoteProps {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ResearchNote({ label, children, defaultOpen = false }: ResearchNoteProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[rgba(255,255,255,0.03)] transition-colors"
      >
        <span className="font-mono text-xs text-[var(--blue)] tracking-wide">{label}</span>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[var(--text-3)] text-xs"
        >
          ▶
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[var(--border-dim)] text-[0.83rem] text-[var(--text-2)] leading-relaxed space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
