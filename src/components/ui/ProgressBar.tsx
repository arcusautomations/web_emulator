/**
 * ProgressBar — ARCADIUM UI Component (RSC compatible, no 'use client')
 *
 * Usage:
 *   <ProgressBar value={72} showLabel />
 *   <ProgressBar value={45} size="lg" showLabel />
 *   <ProgressBar value={100} size="sm" />
 */

import * as React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  showLabel?: boolean;
  size?: ProgressBarSize;
  className?: string;
  /** Accessible label for the progress indicator */
  'aria-label'?: string;
}

// ── Style maps ─────────────────────────────────────────────────────────────

const trackHeight: Record<ProgressBarSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

// ── Component ──────────────────────────────────────────────────────────────

function ProgressBar({
  value,
  showLabel = false,
  size = 'md',
  className = '',
  'aria-label': ariaLabel = 'Progress',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={['flex flex-col gap-1.5', className].filter(Boolean).join(' ')}>
      {/* Optional percentage label */}
      {showLabel && (
        <div className="flex justify-end">
          <span className="font-mono text-caption text-text-secondary tabular-nums">
            {clamped}%
          </span>
        </div>
      )}

      {/* Track */}
      <div
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={[
          'w-full rounded-full overflow-hidden bg-surface-3',
          trackHeight[size],
        ].join(' ')}
      >
        {/* Fill */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-magenta to-neon-cyan transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
