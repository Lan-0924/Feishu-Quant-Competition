import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  negative?: boolean;
  delay?: number;
  large?: boolean;
}

export function MetricCard({ label, value, sub, positive, negative, delay = 0, large }: MetricCardProps) {
  const valueColor = positive ? 'text-accent-green' : negative ? 'text-accent-red' : 'text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="glass-card rounded-xl p-5 glow-blue"
    >
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mono mb-2">{label}</p>
      <p className={`${large ? 'text-3xl' : 'text-2xl'} font-bold mono ${valueColor}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mono mt-1">{sub}</p>}
    </motion.div>
  );
}
