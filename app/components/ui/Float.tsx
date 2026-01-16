'use client';
import { motion } from 'framer-motion';

export default function Float({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}