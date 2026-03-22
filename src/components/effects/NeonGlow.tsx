'use client';

/**
 * NeonGlow — reusable glow wrapper that applies box-shadow glow to children.
 *
 * Usage:
 *   <NeonGlow color="cyan" intensity="md">
 *     <GameCard ... />
 *   </NeonGlow>
 *
 *   // Conditionally active (e.g. hover state driven from parent)
 *   <NeonGlow color="magenta" intensity="lg" active={isHovered}>
 *     <button>Play</button>
 *   </NeonGlow>
 *
 * Props:
 *   color     — 'magenta' | 'cyan' | 'blue'
 *   intensity — 'sm' | 'md' | 'lg'
 *   active    — whether the glow is visible (default: true)
 *   children  — content to wrap
 *   className — additional classes merged onto the wrapper div
 */

import type { ReactNode } from 'react';

type GlowColor = 'magenta' | 'cyan' | 'blue';
type GlowIntensity = 'sm' | 'md' | 'lg';

export interface NeonGlowProps {
  color: GlowColor;
  intensity: GlowIntensity;
  active?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Maps color + intensity → the CSS custom property value defined in globals.css.
 * Using inline style rather than a dynamic Tailwind class ensures the correct
 * shadow value is applied even when Tailwind's JIT cannot statically detect
 * the composed class name.
 */
const GLOW_MAP: Record<GlowColor, Record<GlowIntensity, string>> = {
  magenta: {
    sm: 'var(--shadow-glow-sm-magenta)',
    md: 'var(--shadow-glow-md-magenta)',
    lg: 'var(--shadow-glow-lg-magenta)',
  },
  cyan: {
    sm: 'var(--shadow-glow-sm-cyan)',
    md: 'var(--shadow-glow-md-cyan)',
    lg: 'var(--shadow-glow-lg-cyan)',
  },
  blue: {
    sm: 'var(--shadow-glow-sm-blue)',
    md: 'var(--shadow-glow-md-blue)',
    lg: 'var(--shadow-glow-lg-blue)',
  },
};

export function NeonGlow({
  color,
  intensity,
  active = true,
  children,
  className,
}: NeonGlowProps) {
  const glowValue = GLOW_MAP[color][intensity];

  return (
    <div
      className={[
        'transition-shadow duration-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        boxShadow: active ? glowValue : 'none',
      }}
    >
      {children}
    </div>
  );
}
