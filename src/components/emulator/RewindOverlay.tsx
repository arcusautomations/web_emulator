'use client';

import { useEmulatorStore } from '@/lib/stores/emulator-store';

export function RewindOverlay() {
  const isRewinding = useEmulatorStore((s) => s.isRewinding);
  if (!isRewinding) return null;

  return (
    <div className="fixed inset-0 z-35 pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-base/20" style={{ filter: 'saturate(0.3)' }} />
      <div className="font-pixel text-h2 text-neon-magenta text-glow-magenta animate-pulse z-10">
        ◀◀ REWIND
      </div>
    </div>
  );
}
