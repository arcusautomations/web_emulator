'use client';

/**
 * Toast — ARCADIUM UI Component
 *
 * Reads from useUIStore and renders all active toasts.
 * Place <ToastContainer /> once in your root layout.
 *
 * Usage (triggering a toast):
 *   const { addToast } = useUIStore();
 *
 *   addToast({ type: 'success', title: 'Game Saved!', description: 'Slot 1 updated.' });
 *   addToast({ type: 'achievement', title: 'ACHIEVEMENT UNLOCKED', description: 'Speedrunner', duration: 6000 });
 *   addToast({ type: 'error', title: 'Save Failed', description: 'Storage full.' });
 *
 * In root layout:
 *   import { ToastContainer } from '@/components/ui/Toast';
 *   <ToastContainer />
 */

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, Trophy } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { toastVariants } from '@/lib/animation-variants';
import type { Toast as ToastType } from '@/types';

// ── Border/icon config per type ────────────────────────────────────────────

interface ToastConfig {
  borderClass: string;
  iconClass: string;
  shadowClass?: string;
  Icon: React.ElementType;
}

const toastConfig: Record<ToastType['type'], ToastConfig> = {
  success: {
    borderClass: 'border-success',
    iconClass: 'text-success',
    Icon: CheckCircle2,
  },
  error: {
    borderClass: 'border-error',
    iconClass: 'text-error-light',
    Icon: AlertCircle,
  },
  info: {
    borderClass: 'border-electric-blue',
    iconClass: 'text-blue-light',
    Icon: Info,
  },
  achievement: {
    borderClass: 'border-neon-magenta',
    iconClass: 'text-neon-magenta',
    shadowClass: 'shadow-glow-sm-magenta',
    Icon: Trophy,
  },
};

// ── Single toast item ──────────────────────────────────────────────────────

interface ToastItemProps {
  toast: ToastType;
}

function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useUIStore((s) => s.removeToast);
  const config = toastConfig[toast.type];
  const duration = toast.duration ?? 4000;

  React.useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, removeToast]);

  return (
    <motion.li
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={[
        'relative flex items-start gap-3',
        'bg-surface-2 border rounded-lg p-4',
        'shadow-elevation-lg',
        'min-w-80 max-w-sm',
        config.borderClass,
        config.shadowClass ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Type icon */}
      <config.Icon
        size={18}
        className={['shrink-0 mt-0.5', config.iconClass].join(' ')}
        aria-hidden="true"
      />

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="font-pixel text-micro text-text-primary tracking-wide">{toast.title}</p>
        {toast.description && (
          <p className="font-body text-body-sm text-text-secondary mt-1 leading-snug">
            {toast.description}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className={[
          'shrink-0 p-1 rounded-md',
          'text-text-tertiary hover:text-text-primary',
          'hover:bg-surface-3 transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-neon-cyan focus-visible:ring-offset-1',
          'focus-visible:ring-offset-surface-2',
        ].join(' ')}
      >
        <X size={14} aria-hidden="true" />
      </button>

      {/* Progress bar — auto-dismiss countdown */}
      <motion.div
        className={['absolute bottom-0 left-0 h-0.5 rounded-b-lg', config.borderClass].join(' ')}
        style={{ backgroundColor: 'currentColor' }}
        initial={{ width: '100%', opacity: 0.6 }}
        animate={{ width: '0%', opacity: 0.3 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        aria-hidden="true"
      />
    </motion.li>
  );
}

// ── Toast container ────────────────────────────────────────────────────────

function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
    >
      <ul
        className="flex flex-col gap-3 list-none m-0 p-0 pointer-events-auto"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions removals"
      >
        <AnimatePresence mode="sync" initial={false}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

ToastContainer.displayName = 'ToastContainer';
ToastItem.displayName = 'ToastItem';

export { ToastContainer, ToastItem };
