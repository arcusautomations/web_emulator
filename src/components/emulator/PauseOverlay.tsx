'use client';

import { motion } from 'framer-motion';
import { Play, Home } from 'lucide-react';
import { fadeInUp } from '@/lib/animation-variants';

interface Props {
  onResume: () => void;
  onQuit: () => void;
}

export function PauseOverlay({ onResume, onQuit }: Props) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-40 bg-base/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
    >
      <div className="font-pixel text-display text-neon-cyan animate-neon-pulse">PAUSED</div>
      <div className="flex gap-4">
        <button
          onClick={onResume}
          className="flex items-center gap-2 bg-neon-cyan text-text-inverse font-pixel text-h4 px-6 py-3 rounded-md hover:bg-cyan-light transition-all"
        >
          <Play size={16} /> RESUME
        </button>
        <button
          onClick={onQuit}
          className="flex items-center gap-2 bg-transparent text-text-secondary border border-surface-3 font-pixel text-h4 px-6 py-3 rounded-md hover:border-error hover:text-error transition-all"
        >
          <Home size={16} /> QUIT
        </button>
      </div>
    </motion.div>
  );
}
