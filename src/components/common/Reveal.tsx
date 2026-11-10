import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Fades content in as it scrolls into view. Does nothing for users who prefer reduced motion. */
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
};