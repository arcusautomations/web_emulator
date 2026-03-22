/**
 * Spinner — ARCADIUM UI Component (RSC compatible, no 'use client')
 *
 * CSS-only animated loading spinner using neon cyan colors.
 *
 * Usage:
 *   <Spinner />
 *   <Spinner size="lg" />
 *   <Spinner size="sm" className="text-neon-magenta" />
 */

import * as React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /** Screen-reader label */
  label?: string;
}

// ── Size map ───────────────────────────────────────────────────────────────

const sizeStyles: Record<SpinnerSize, { px: number; border: string }> = {
  sm: { px: 16, border: 'border-2' },
  md: { px: 24, border: 'border-2' },
  lg: { px: 32, border: 'border-[3px]' },
};

// ── Component ──────────────────────────────────────────────────────────────

function Spinner({ size = 'md', className = '', label = 'Loading...' }: SpinnerProps) {
  const { px, border } = sizeStyles[size];

  return (
    <span
      role="status"
      aria-label={label}
      className={['inline-flex items-center justify-center shrink-0', className]
        .filter(Boolean)
        .join(' ')}
      style={{ width: px, height: px }}
    >
      <span
        aria-hidden="true"
        className={[
          'block rounded-full animate-spin',
          'border-neon-cyan border-t-transparent',
          border,
        ].join(' ')}
        style={{ width: px, height: px }}
      />
    </span>
  );
}

Spinner.displayName = 'Spinner';

export { Spinner };
