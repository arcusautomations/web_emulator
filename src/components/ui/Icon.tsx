/**
 * Icon — ARCADIUM UI Component (RSC compatible, no 'use client')
 *
 * Usage:
 *   import { Play, Settings, Star } from 'lucide-react';
 *
 *   <Icon icon={Play} size="lg" glow="cyan" />
 *   <Icon icon={Star} size="xl" glow="magenta" />
 *   <Icon icon={Settings} size="md" glow="none" className="text-text-secondary" />
 */

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconGlow = 'magenta' | 'cyan' | 'blue' | 'none';

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  glow?: IconGlow;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

// ── Maps ───────────────────────────────────────────────────────────────────

const sizeMap: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

const glowStyles: Record<IconGlow, string> = {
  none: '',
  magenta: 'drop-shadow(0 0 4px #ff00ff) drop-shadow(0 0 8px #ff00ff88)',
  cyan: 'drop-shadow(0 0 4px #00ffc8) drop-shadow(0 0 8px #00ffc888)',
  blue: 'drop-shadow(0 0 4px #0096ff) drop-shadow(0 0 8px #0096ff88)',
};

// ── Component ──────────────────────────────────────────────────────────────

function Icon({
  icon: LucideIconComponent,
  size = 'md',
  glow = 'none',
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const px = sizeMap[size];
  const filterStyle = glow !== 'none' ? { filter: glowStyles[glow] } : undefined;

  // If aria-label provided, the icon is meaningful; otherwise decorative
  const resolvedAriaHidden = ariaHidden !== undefined ? ariaHidden : ariaLabel ? undefined : true;

  return (
    <LucideIconComponent
      width={px}
      height={px}
      aria-label={ariaLabel}
      aria-hidden={resolvedAriaHidden}
      style={filterStyle}
      className={['shrink-0', className].filter(Boolean).join(' ')}
      strokeWidth={1.75}
    />
  );
}

Icon.displayName = 'Icon';

export { Icon };
