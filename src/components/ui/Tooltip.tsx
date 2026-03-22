'use client';

/**
 * Tooltip — ARCADIUM UI Component
 *
 * Usage:
 *   <Tooltip content="Open settings" side="top">
 *     <button>...</button>
 *   </Tooltip>
 *
 *   <Tooltip content={<strong>Rich content</strong>} side="right" delay={300}>
 *     <Icon icon={Info} size="md" />
 *   </Tooltip>
 */

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

// Props that may exist on child elements for event forwarding
interface ChildProps {
  'aria-describedby'?: string;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement<ChildProps>;
  side?: TooltipSide;
  /** Show delay in ms */
  delay?: number;
  className?: string;
}

// ── Tooltip variants ───────────────────────────────────────────────────────

const tooltipVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// ── Position map ───────────────────────────────────────────────────────────

const positionClasses: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

// ── Component ──────────────────────────────────────────────────────────────

function Tooltip({ content, children, side = 'top', delay = 200, className = '' }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = React.useId();

  function show() {
    showTimer.current = setTimeout(() => setVisible(true), delay);
  }

  function hide() {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    setVisible(false);
  }

  // Long-press for mobile
  function handleTouchStart() {
    longPressTimer.current = setTimeout(() => setVisible(true), 500);
  }

  function handleTouchEnd() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    // Dismiss after a moment on mobile
    setTimeout(() => setVisible(false), 1500);
  }

  React.useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };
  }, []);

  const trigger = React.cloneElement(children, {
    'aria-describedby': visible ? tooltipId : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      children.props.onBlur?.(e);
    },
    onTouchStart: (e: React.TouchEvent) => {
      handleTouchStart();
      children.props.onTouchStart?.(e);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      handleTouchEnd();
      children.props.onTouchEnd?.(e);
    },
  });

  return (
    <div className="relative inline-flex">
      {trigger}

      <AnimatePresence>
        {visible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            variants={tooltipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={[
              'absolute z-50 pointer-events-none',
              'whitespace-nowrap',
              positionClasses[side],
              'bg-surface-2 text-text-primary text-caption',
              'border border-surface-3 rounded-md',
              'px-3 py-2',
              'shadow-elevation-md',
              'font-body',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

Tooltip.displayName = 'Tooltip';

export { Tooltip };
