'use client';

/**
 * CRTOverlay — scanline, vignette, and RGB subpixel layers for CRT simulation.
 *
 * Usage:
 *   // Full-screen page overlay (library, home, etc.)
 *   <CRTOverlay mode="full" />
 *
 *   // Inside a game canvas wrapper
 *   <CRTOverlay mode="canvas" intensity={0.18} />
 *
 * Props:
 *   mode      — 'full' applies scanlines + content-visibility optimisation.
 *               'canvas' adds vignette and RGB subpixel layers on top.
 *   intensity — overrides scanlineIntensity from settings (0–1).
 *               Passing 0 hides the overlay entirely.
 *
 * Reads scanlineIntensity from useSettingsStore when intensity prop is omitted.
 * Returns null if prefers-reduced-motion is active or effective intensity is 0.
 *
 * All layers are pointer-events-none and aria-hidden so they never interfere
 * with interaction or assistive technology.
 */

import { useSettingsStore } from '@/lib/stores/settings-store';
import { useReducedMotion } from 'framer-motion';

export interface CRTOverlayProps {
  mode: 'full' | 'canvas';
  /** Override for the scanline opacity (0–1). Defaults to settings value. */
  intensity?: number;
}

export function CRTOverlay({ mode, intensity }: CRTOverlayProps) {
  const settingsIntensity = useSettingsStore((s) => s.settings.video.scanlineIntensity);
  const prefersReducedMotion = useReducedMotion();

  const effectiveIntensity = intensity !== undefined ? intensity : settingsIntensity;

  // Bail out early — no visual pollution when motion is restricted or disabled.
  if (prefersReducedMotion || effectiveIntensity === 0) {
    return null;
  }

  // Clamp to [0, 1].
  const clamped = Math.min(1, Math.max(0, effectiveIntensity));

  // Scanline stripe opacity: scale the black stripe alpha by the intensity.
  // At intensity 1.0 we allow up to 0.4 opacity; at 0.12 (default) ~0.048.
  const stripeAlpha = (clamped * 0.4).toFixed(3);

  return (
    /*
     * Wrapper fragment — no extra DOM node.
     * We use a real element here only because we need multiple siblings
     * that share positioning context with the parent. The parent must be
     * `position: relative` (or absolute/fixed/sticky).
     *
     * content-visibility on the wrapper itself would suppress painting
     * entirely; instead we annotate it on each layer individually so the
     * browser can skip re-painting off-screen overlays on non-game pages.
     */
    <>
      {/* ── Layer 1: Scanlines ──────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, ${stripeAlpha}) 2px,
            rgba(0, 0, 0, ${stripeAlpha}) 4px
          )`,
          contentVisibility: mode === 'full' ? 'auto' : undefined,
        }}
      />

      {/* ── Layer 2: Vignette (canvas mode only) ────────────────────── */}
      {mode === 'canvas' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-50"
          style={{
            background: `radial-gradient(
              ellipse at center,
              transparent 55%,
              rgba(0, 0, 0, ${(clamped * 0.75).toFixed(3)}) 100%
            )`,
          }}
        />
      )}

      {/* ── Layer 3: RGB subpixel simulation (canvas + desktop only) ── */}
      {mode === 'canvas' && (
        <RGBSubpixelLayer />
      )}
    </>
  );
}

// ── RGB Subpixel layer ────────────────────────────────────────────────────────

/**
 * Renders a repeating horizontal RGB band overlay at 3% opacity.
 * Hidden on mobile via a CSS media query applied via a style tag pattern —
 * we use a wrapper div with a responsive class so Tailwind handles the
 * breakpoint rather than a JS matchMedia (avoids hydration mismatch).
 */
function RGBSubpixelLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50 hidden lg:block"
      style={{
        background: `repeating-linear-gradient(
          to right,
          rgba(255, 0, 0, 0.03),
          rgba(255, 0, 0, 0.03) 1px,
          rgba(0, 255, 0, 0.03) 1px,
          rgba(0, 255, 0, 0.03) 2px,
          rgba(0, 0, 255, 0.03) 2px,
          rgba(0, 0, 255, 0.03) 3px
        )`,
      }}
    />
  );
}
