'use client';
import { motion } from 'framer-motion';

export default function ExpiryRing() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
      className="absolute inset-0 rounded-full border border-white/10"
    />
  );
}