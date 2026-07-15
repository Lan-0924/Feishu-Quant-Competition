import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const spring = useSpring(progress, { stiffness: 400, damping: 40 });

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 z-50 origin-left"
      style={{ scaleX: spring }}
    />
  );
}
