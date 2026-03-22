'use client';

import { useEmulatorStore } from '@/lib/stores/emulator-store';
import { motion, AnimatePresence } from 'framer-motion';

export function SpeedIndicator() {
  const speed = useEmulatorStore((s) => s.speed);

  return (
    <AnimatePresence>
      {speed > 1 && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="fixed top-16 right-4 z-40 font-pixel text-h4 text-warning bg-base/60 backdrop-blur-sm px-3 py-1 rounded-md border border-warning/30"
        >
          &gt;&gt;{speed}x
        </motion.div>
      )}
    </AnimatePresence>
  );
}
