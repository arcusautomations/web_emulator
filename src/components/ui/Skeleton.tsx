/**
 * Skeleton — ARCADIUM UI Component (RSC compatible, no 'use client')
 *
 * Animated placeholder for loading states.
 *
 * Usage:
 *   // Text placeholder
 *   <Skeleton variant="text" />
 *   <Skeleton variant="text" width="60%" />
 *
 *   // Avatar
 *   <Skeleton variant="avatar" width={48} height={48} />
 *
 *   // Card
 *   <Skeleton variant="card" />
 *
 *   // Custom
 *   <Skeleton width={200} height={32} rounded="lg" />
 */

import * as React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export type SkeletonRounded = 'sm' | 'md' | 'lg' | 'full';
export type SkeletonVariant = 'text' | 'avatar' | 'card' | 'custom';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  rounded?: SkeletonRounded;
  className?: string;
}

// ── Maps ───────────────────────────────────────────────────────────────────

const roundedStyles: Record<SkeletonRounded, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

// ── Variant defaults ───────────────────────────────────────────────────────

function resolveVariantDefaults(variant: SkeletonVariant): {
  className: string;
  style: React.CSSProperties;
  rounded: SkeletonRounded;
} {
  switch (variant) {
    case 'text':
      return {
        className: 'w-full',
        style: { height: '1rem' },
        rounded: 'md',
      };
    case 'avatar':
      return {
        className: '',
        style: { width: '2.5rem', height: '2.5rem' },
        rounded: 'full',
      };
    case 'card':
      return {
        className: 'w-full aspect-[3/4]',
        style: {},
        rounded: 'lg',
      };
    default:
      return {
        className: '',
        style: {},
        rounded: 'md',
      };
  }
}

// ── Component ──────────────────────────────────────────────────────────────

function Skeleton({
  variant = 'custom',
  width,
  height,
  rounded,
  className = '',
}: SkeletonProps) {
  const defaults = resolveVariantDefaults(variant);

  // Width/height props override variant defaults
  const style: React.CSSProperties = {
    ...defaults.style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  const resolvedRounded = rounded ?? defaults.rounded;

  const classes = [
    'bg-surface-2 animate-pulse',
    roundedStyles[resolvedRounded],
    defaults.className,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      role="status"
      aria-busy="true"
      aria-label="Loading..."
      aria-live="polite"
      className={classes}
      style={style}
    >
      <span className="sr-only">Loading...</span>
    </span>
  );
}

Skeleton.displayName = 'Skeleton';

export { Skeleton };
