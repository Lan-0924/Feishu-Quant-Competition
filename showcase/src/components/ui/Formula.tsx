import { motion } from 'framer-motion';

interface FormulaProps {
  label?: string;
  children: string;
  note?: string;
}

export function Formula({ label, children, note }: FormulaProps) {
  return (
    <motion.div
      className="my-5"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {label && <p className="text-[0.68rem] font-mono text-[var(--text-3)] uppercase tracking-widest mb-1.5">{label}</p>}
      <pre className="formula-block">{children}</pre>
      {note && <p className="text-[0.75rem] text-[var(--text-3)] mt-1.5 leading-relaxed">{note}</p>}
    </motion.div>
  );
}
