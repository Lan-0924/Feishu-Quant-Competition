import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FindingProps {
  children: ReactNode;
  label?: string;
  delay?: number;
}

export function Finding({ children, label = 'Finding', delay = 0 }: FindingProps) {
  return (
    <motion.div
      className="finding-box my-8"
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <p className="section-num mb-2" style={{ color: 'var(--amber)' }}>{label}</p>
      <p className="finding-text">{children}</p>
    </motion.div>
  );
}
