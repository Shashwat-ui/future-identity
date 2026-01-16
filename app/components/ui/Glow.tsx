'use client';
import { motion } from 'framer-motion';

interface GlowProps {
  intensity?: number; // 0.2 – 1
  color?: string; // CSS color
}

export default function Glow({ intensity = 0.6, color = 'rgba(120,180,255,0.6)' }: GlowProps) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: intensity
      }}
      animate={{ opacity: [intensity * 0.6, intensity, intensity * 0.6] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}