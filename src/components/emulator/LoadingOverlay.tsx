'use client';

import { motion } from 'framer-motion';

interface Props {
  progress: number;
  title: string;
}

export function LoadingOverlay({ progress, title }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-void flex flex-col items-center justify-center"
    >
      <div className="font-pixel text-h3 text-neon-cyan mb-2">LOADING</div>
      <div className="font-pixel text-micro text-text-tertiary mb-8 truncate max-w-xs">{title}</div>

      {/* Health bar style progress */}
      <div className="w-64 bg-surface-3 h-3 rounded-sm overflow-hidden border border-surface-3">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-magenta to-neon-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <div className="font-mono text-micro text-text-tertiary mt-2">{progress}%</div>
    </motion.div>
  );
}
