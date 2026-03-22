'use client';

/**
 * PageTransitionShell — wraps page content with a CRT power-on/off transition.
 *
 * Usage (in a layout or template file):
 *   <PageTransitionShell>
 *     {children}
 *   </PageTransitionShell>
 *
 * The key is derived from usePathname() so AnimatePresence fires on every
 * route change. Respects prefers-reduced-motion by swapping to a simple
 * fade variant via Framer Motion's useReducedMotion hook.
 */

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { pageVariants, reducedMotionVariants } from '@/lib/animation-variants';

interface PageTransitionShellProps {
  children: React.ReactNode;
}

export function PageTransitionShell({ children }: PageTransitionShellProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const variants = prefersReducedMotion ? reducedMotionVariants : pageVariants;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        /**
         * origin-top so the CRT vertical-collapse animation scales from the
         * vertical midpoint of the viewport rather than the element's own
         * top edge. This replicates the classic CRT power-off behaviour.
         */
        style={{ transformOrigin: '50% 50%' }}
        className="flex-1 min-h-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
