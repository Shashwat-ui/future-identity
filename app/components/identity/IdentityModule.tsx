'use client';
import { motion } from 'framer-motion';
import QRProjection from './QRProjection';
import { IdentityModuleType } from '@/store/identityStore';
import { IdentityPayload } from '@/lib/identity';

interface IdentityModuleProps {
  type: IdentityModuleType;
  payload: IdentityPayload['data'];
}

export default function IdentityModule({ type, payload }: IdentityModuleProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/5 backdrop-blur-xl"
    >
      <h2 className="text-sm tracking-widest opacity-70">
        {type.toUpperCase()} PROJECTION
      </h2>

      <QRProjection payload={{ type, data: payload } as IdentityPayload} />

      <p className="text-xs opacity-50">
        Access window: 10 minutes
      </p>
    </motion.section>
  );
}