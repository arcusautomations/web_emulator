'use client';

/**
 * GlitchText — plays a glitch/flicker animation when `trigger` flips to true.
 *
 * Usage:
 *   // Static (no animation)
 *   <GlitchText trigger={false}>ARCADIUM</GlitchText>
 *
 *   // Triggered on some event (e.g. game select)
 *   const [glitch, setGlitch] = useState(false);
 *   <GlitchText trigger={glitch} onAnimationComplete={() => setGlitch(false)}>
 *     {game.title}
 *   </GlitchText>
 *
 * Props:
 *   children            — text/node content to render inside the span
 *   trigger             — when flipped from false → true, the glitch plays once
 *   className           — additional classes on the motion.span
 *   onAnimationComplete — called after the animation finishes (use to reset trigger)
 */

import { motion, type AnimationDefinition } from 'framer-motion';
import { glitchFlicker } from '@/lib/animation-variants';
import type { ReactNode } from 'react';

export interface GlitchTextProps {
  children: ReactNode;
  trigger: boolean;
  className?: string;
  onAnimationComplete?: (definition: AnimationDefinition) => void;
}

export function GlitchText({
  children,
  trigger,
  className,
  onAnimationComplete,
}: GlitchTextProps) {
  return (
    <motion.span
      /**
       * Only pass `animate` when trigger is true. When trigger is false the
       * element remains in its natural state — no variant is applied at all,
       * so there is no "return" tween after the animation ends; the element
       * simply stops exactly where glitchFlicker left it (opacity: 1, x: 0,
       * hue-rotate: 0deg) because those are the final keyframe values.
       */
      variants={glitchFlicker}
      animate={trigger ? 'animate' : undefined}
      onAnimationComplete={onAnimationComplete}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.span>
  );
}
