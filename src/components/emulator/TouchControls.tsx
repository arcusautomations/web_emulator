'use client';

import { useCallback } from 'react';
import { useSettingsStore } from '@/lib/stores/settings-store';
import type { SystemType } from '@/types';

interface Props {
  system: SystemType;
}

// Lazy-load the engine to avoid SSR issues
let enginePromise: Promise<typeof import('@/core/engine')> | null = null;
function getEngine() {
  if (!enginePromise) {
    enginePromise = import('@/core/engine');
  }
  return enginePromise;
}

export function TouchControls({ system }: Props) {
  const opacity = useSettingsStore((s) => s.settings.controls.touchControlOpacity);
  const size = useSettingsStore((s) => s.settings.controls.touchControlSize);

  const sizeMultiplier = size === 'small' ? 0.85 : size === 'large' ? 1.15 : 1;
  const dpadSize = Math.round(140 * sizeMultiplier);
  const btnSize = Math.round(56 * sizeMultiplier);
  const metaBtnW = Math.round(64 * sizeMultiplier);
  const metaBtnH = Math.round(28 * sizeMultiplier);
  const shoulderW = Math.round(64 * sizeMultiplier);
  const shoulderH = Math.round(32 * sizeMultiplier);

  // Only GBA has L/R shoulder buttons. GB/GBC/NES do not.
  const hasShoulders = system === 'gba';

  const handlePress = useCallback(async (button: string) => {
    const mod = await getEngine();
    mod.EmulatorEngine.instance.pressButton(button);
    if (navigator.vibrate) navigator.vibrate(8);
  }, []);

  const handleRelease = useCallback(async (button: string) => {
    const mod = await getEngine();
    mod.EmulatorEngine.instance.releaseButton(button);
  }, []);

  const touchProps = (button: string) => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      handlePress(button);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      handleRelease(button);
    },
    onTouchCancel: () => handleRelease(button),
  });

  const btnBase =
    'flex items-center justify-center font-pixel select-none touch-none active:brightness-150';

  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* D-Pad — bottom left */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: 16,
          bottom: hasShoulders ? 100 : 80,
          width: dpadSize,
          height: dpadSize,
        }}
      >
        {/* Center cross background */}
        <div className="absolute inset-[25%] bg-surface-3/30 rounded-sm" />

        {/* Up */}
        <div
          {...touchProps('up')}
          className={`absolute left-1/2 -translate-x-1/2 top-0 w-[34%] h-[34%] ${btnBase} bg-surface-2/50 border border-surface-3/40 rounded-t-lg active:bg-neon-cyan/30`}
        >
          <span className="text-[10px] text-text-tertiary">▲</span>
        </div>
        {/* Down */}
        <div
          {...touchProps('down')}
          className={`absolute left-1/2 -translate-x-1/2 bottom-0 w-[34%] h-[34%] ${btnBase} bg-surface-2/50 border border-surface-3/40 rounded-b-lg active:bg-neon-cyan/30`}
        >
          <span className="text-[10px] text-text-tertiary">▼</span>
        </div>
        {/* Left */}
        <div
          {...touchProps('left')}
          className={`absolute top-1/2 -translate-y-1/2 left-0 w-[34%] h-[34%] ${btnBase} bg-surface-2/50 border border-surface-3/40 rounded-l-lg active:bg-neon-cyan/30`}
        >
          <span className="text-[10px] text-text-tertiary">◀</span>
        </div>
        {/* Right */}
        <div
          {...touchProps('right')}
          className={`absolute top-1/2 -translate-y-1/2 right-0 w-[34%] h-[34%] ${btnBase} bg-surface-2/50 border border-surface-3/40 rounded-r-lg active:bg-neon-cyan/30`}
        >
          <span className="text-[10px] text-text-tertiary">▶</span>
        </div>
      </div>

      {/* Action Buttons — bottom right */}
      <div
        className="absolute pointer-events-auto"
        style={{
          right: 16,
          bottom: hasShoulders ? 100 : 80,
        }}
      >
        {/* A button (right) */}
        <div
          {...touchProps('a')}
          className={`absolute rounded-full ${btnBase} bg-surface-2/50 border-2 border-neon-cyan/60 text-neon-cyan text-[11px] active:bg-neon-cyan/30 active:shadow-glow-sm-cyan`}
          style={{ width: btnSize, height: btnSize, right: 0, bottom: btnSize * 0.5 }}
        >
          A
        </div>
        {/* B button (left-below) */}
        <div
          {...touchProps('b')}
          className={`absolute rounded-full ${btnBase} bg-surface-2/50 border-2 border-neon-magenta/60 text-neon-magenta text-[11px] active:bg-neon-magenta/30 active:shadow-glow-sm-magenta`}
          style={{ width: btnSize, height: btnSize, right: btnSize * 1.15, bottom: 0 }}
        >
          B
        </div>
      </div>

      {/* Shoulder Buttons — GBA only */}
      {hasShoulders && (
        <>
          <div
            {...touchProps('l')}
            className={`absolute left-4 pointer-events-auto ${btnBase} bg-surface-2/50 border border-surface-3/50 rounded-lg text-text-secondary text-[10px] active:bg-neon-cyan/30`}
            style={{ width: shoulderW, height: shoulderH, top: 68 }}
          >
            L
          </div>
          <div
            {...touchProps('r')}
            className={`absolute right-4 pointer-events-auto ${btnBase} bg-surface-2/50 border border-surface-3/50 rounded-lg text-text-secondary text-[10px] active:bg-neon-cyan/30`}
            style={{ width: shoulderW, height: shoulderH, top: 68 }}
          >
            R
          </div>
        </>
      )}

      {/* Start / Select — center bottom, above device safe area */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex gap-6 pointer-events-auto"
        style={{ bottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}
      >
        <div
          {...touchProps('select')}
          className={`${btnBase} bg-surface-2/50 border border-surface-3/50 rounded-full text-text-secondary text-[9px] tracking-wider active:bg-neon-cyan/20`}
          style={{ width: metaBtnW, height: metaBtnH }}
        >
          SELECT
        </div>
        <div
          {...touchProps('start')}
          className={`${btnBase} bg-surface-2/50 border border-surface-3/50 rounded-full text-text-secondary text-[9px] tracking-wider active:bg-neon-cyan/20`}
          style={{ width: metaBtnW, height: metaBtnH }}
        >
          START
        </div>
      </div>
    </div>
  );
}
