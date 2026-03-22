'use client';

import { useCallback } from 'react';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { EmulatorEngine } from '@/core/engine';
import type { SystemType, RetroButton } from '@/types';

interface Props {
  system: SystemType;
}

export function TouchControls({ system }: Props) {
  const opacity = useSettingsStore((s) => s.settings.controls.touchControlOpacity);
  const size = useSettingsStore((s) => s.settings.controls.touchControlSize);

  const sizeMultiplier = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
  const dpadSize = Math.round(160 * sizeMultiplier);
  const btnSize = Math.round(60 * sizeMultiplier);
  const shoulderW = Math.round(72 * sizeMultiplier);
  const shoulderH = Math.round(36 * sizeMultiplier);

  const handlePress = useCallback((button: RetroButton) => {
    EmulatorEngine.instance.input?.setTouchButton(button, true);
    // Haptic feedback (Android only — guarded)
    if (navigator.vibrate) navigator.vibrate(10);
  }, []);

  const handleRelease = useCallback((button: RetroButton) => {
    EmulatorEngine.instance.input?.setTouchButton(button, false);
  }, []);

  const touchProps = (button: RetroButton) => ({
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

  const hasXY = system === 'gba';

  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* D-Pad — bottom left */}
      <div
        className="absolute pointer-events-auto"
        style={{ left: 20, bottom: 80, width: dpadSize, height: dpadSize }}
      >
        {/* Up */}
        <div
          {...touchProps('up')}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-1/3 h-1/3 bg-surface-2/60 border border-surface-3/40 rounded-t-lg active:bg-neon-cyan/30 touch-none"
        />
        {/* Down */}
        <div
          {...touchProps('down')}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1/3 h-1/3 bg-surface-2/60 border border-surface-3/40 rounded-b-lg active:bg-neon-cyan/30 touch-none"
        />
        {/* Left */}
        <div
          {...touchProps('left')}
          className="absolute top-1/2 -translate-y-1/2 left-0 w-1/3 h-1/3 bg-surface-2/60 border border-surface-3/40 rounded-l-lg active:bg-neon-cyan/30 touch-none"
        />
        {/* Right */}
        <div
          {...touchProps('right')}
          className="absolute top-1/2 -translate-y-1/2 right-0 w-1/3 h-1/3 bg-surface-2/60 border border-surface-3/40 rounded-r-lg active:bg-neon-cyan/30 touch-none"
        />
        {/* Center (inert) */}
        <div className="absolute left-1/3 top-1/3 w-1/3 h-1/3 bg-surface-3/40 rounded" />
      </div>

      {/* Action Buttons — bottom right */}
      <div className="absolute pointer-events-auto" style={{ right: 20, bottom: 80 }}>
        {/* A (right) */}
        <div
          {...touchProps('a')}
          className="absolute rounded-full bg-surface-2/60 border-2 border-neon-cyan/50 flex items-center justify-center font-pixel text-micro text-neon-cyan active:bg-neon-cyan/30 touch-none"
          style={{ width: btnSize, height: btnSize, right: 0, bottom: btnSize * 0.4 }}
        >
          A
        </div>
        {/* B (left-down) */}
        <div
          {...touchProps('b')}
          className="absolute rounded-full bg-surface-2/60 border-2 border-neon-magenta/50 flex items-center justify-center font-pixel text-micro text-neon-magenta active:bg-neon-magenta/30 touch-none"
          style={{ width: btnSize, height: btnSize, right: btnSize * 1.1, bottom: 0 }}
        >
          B
        </div>

        {hasXY && (
          <>
            {/* X (top) */}
            <div
              {...touchProps('x')}
              className="absolute rounded-full bg-surface-2/60 border-2 border-electric-blue/50 flex items-center justify-center font-pixel text-micro text-electric-blue active:bg-electric-blue/30 touch-none"
              style={{
                width: btnSize * 0.85,
                height: btnSize * 0.85,
                right: btnSize * 0.55,
                bottom: btnSize * 1.5,
              }}
            >
              X
            </div>
            {/* Y (left) */}
            <div
              {...touchProps('y')}
              className="absolute rounded-full bg-surface-2/60 border-2 border-success/50 flex items-center justify-center font-pixel text-micro text-success active:bg-success/30 touch-none"
              style={{
                width: btnSize * 0.85,
                height: btnSize * 0.85,
                right: btnSize * 1.7,
                bottom: btnSize * 0.4,
              }}
            >
              Y
            </div>
          </>
        )}
      </div>

      {/* Shoulder Buttons */}
      <div
        {...touchProps('l')}
        className="absolute top-16 left-4 pointer-events-auto bg-surface-2/60 border border-surface-3/40 rounded-lg flex items-center justify-center font-pixel text-micro text-text-secondary active:bg-neon-cyan/30 touch-none"
        style={{ width: shoulderW, height: shoulderH }}
      >
        L
      </div>
      <div
        {...touchProps('r')}
        className="absolute top-16 right-4 pointer-events-auto bg-surface-2/60 border border-surface-3/40 rounded-lg flex items-center justify-center font-pixel text-micro text-text-secondary active:bg-neon-cyan/30 touch-none"
        style={{ width: shoulderW, height: shoulderH }}
      >
        R
      </div>

      {/* Start / Select */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
        <div
          {...touchProps('select')}
          className="bg-surface-2/60 border border-surface-3/40 rounded-full px-4 py-1.5 font-pixel text-micro text-text-secondary active:bg-neon-cyan/20 touch-none"
        >
          SELECT
        </div>
        <div
          {...touchProps('start')}
          className="bg-surface-2/60 border border-surface-3/40 rounded-full px-4 py-1.5 font-pixel text-micro text-text-secondary active:bg-neon-cyan/20 touch-none"
        >
          START
        </div>
      </div>
    </div>
  );
}
