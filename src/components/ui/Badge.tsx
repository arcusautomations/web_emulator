/**
 * Badge — ARCADIUM UI Component (RSC compatible, no 'use client')
 *
 * Usage:
 *   <Badge variant="platform">GBA</Badge>
 *   <Badge variant="system" system="nes">NES</Badge>
 *   <Badge variant="count">12</Badge>
 *   <Badge variant="rarity-legendary">LEGENDARY</Badge>
 */

import * as React from 'react';
import type { SystemType } from '@/types';

// ── Types ──────────────────────────────────────────────────────────────────

export type BadgeVariant =
  | 'platform'
  | 'system'
  | 'count'
  | 'rarity-common'
  | 'rarity-rare'
  | 'rarity-legendary';

export interface BadgeProps {
  variant?: BadgeVariant;
  /** Only used when variant="system" — drives color */
  system?: SystemType;
  children?: React.ReactNode;
  className?: string;
}

// ── System color map ───────────────────────────────────────────────────────

const systemStyles: Record<SystemType, string> = {
  gb: 'bg-surface-3 text-text-secondary border border-surface-3',
  gbc: 'bg-blue-dim text-blue-light border border-blue-muted/50',
  gba: 'bg-cyan-dim text-cyan-light border border-cyan-muted/50',
  nes: 'bg-magenta-dim/30 text-magenta-light border border-magenta-dim/50',
};

// ── Variant style map ──────────────────────────────────────────────────────

const baseStyles = 'inline-flex items-center justify-center font-pixel text-micro tracking-wider uppercase';

const variantStyles: Record<BadgeVariant, string> = {
  platform: [
    'bg-magenta-dim/30 text-magenta-light',
    'border border-magenta-dim/50',
    'px-2 py-0.5 rounded-sm',
  ].join(' '),

  system: 'px-2 py-0.5 rounded-sm', // resolved dynamically with systemStyles

  count: [
    'bg-neon-cyan text-text-inverse',
    'min-w-5 h-5 px-1.5',
    'rounded-full',
    'tabular-nums',
  ].join(' '),

  'rarity-common': [
    'bg-surface-3 text-text-secondary',
    'border border-surface-3',
    'px-2 py-0.5 rounded-sm',
  ].join(' '),

  'rarity-rare': [
    'bg-blue-dim text-blue-light',
    'border border-blue-muted/60',
    'px-2 py-0.5 rounded-sm',
  ].join(' '),

  'rarity-legendary': [
    'bg-magenta-dim text-neon-magenta',
    'border border-magenta-muted/60',
    'shadow-glow-sm-magenta',
    'px-2 py-0.5 rounded-sm',
  ].join(' '),
};

// ── Component ──────────────────────────────────────────────────────────────

function Badge({ variant = 'platform', system, children, className = '' }: BadgeProps) {
  let resolvedVariantStyles = variantStyles[variant];

  // For "system" variant, merge dynamic system color on top
  if (variant === 'system' && system) {
    resolvedVariantStyles = [variantStyles.system, systemStyles[system]].join(' ');
  }

  const classes = [baseStyles, resolvedVariantStyles, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}

Badge.displayName = 'Badge';

export { Badge };
