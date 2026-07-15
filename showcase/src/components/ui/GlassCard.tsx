import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  accent?: string;
}

export function GlassCard({ children, className = '', hover, delay = 0, accent }: GlassCardProps) {
  const borderColor = accent ? `border-[${accent}]/20` : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`${hover ? 'glass-card-hover' : 'glass-card'} rounded-2xl ${borderColor} ${className}`}
    >
      {children}
    </motion.div>
  );
}
