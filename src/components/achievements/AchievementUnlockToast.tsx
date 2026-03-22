'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface Props {
  title: string;
  points: number;
  onDismiss: () => void;
}

export function AchievementUnlockToast({ title, points, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      exit={{ opacity: 0, y: -30, transition: { duration: 0.2 } }}
      onAnimationComplete={() => setTimeout(onDismiss, 4000)}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-surface-2 border border-neon-magenta/50 rounded-xl px-6 py-4 shadow-glow-lg-magenta min-w-80 max-w-md"
    >
      <div className="flex items-center gap-4">
        <div className="bg-neon-magenta/10 rounded-lg p-2">
          <Trophy size={28} className="text-neon-magenta" />
        </div>
        <div>
          <p className="font-pixel text-micro text-neon-magenta mb-0.5">ACHIEVEMENT UNLOCKED!</p>
          <p className="font-pixel text-h4 text-text-primary">{title}</p>
          <p className="font-pixel text-micro text-neon-cyan mt-1">{points} PTS</p>
        </div>
      </div>
    </motion.div>
  );
}
