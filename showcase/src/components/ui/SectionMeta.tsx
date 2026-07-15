import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionMetaProps {
  num: string;
  question: string;
  lead?: ReactNode;
}

export function SectionMeta({ num, question, lead }: SectionMetaProps) {
  return (
    <div className="mb-14">
      <motion.p
        className="section-num mb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {num}
      </motion.p>
      <motion.h2
        className="section-question mb-5"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        {question}
      </motion.h2>
      {lead && (
        <motion.div
          className="text-[var(--text-2)] leading-relaxed text-base max-w-prose"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          {lead}
        </motion.div>
      )}
    </div>
  );
}
