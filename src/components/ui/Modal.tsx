'use client';

/**
 * Modal — ARCADIUM UI Component
 *
 * Usage:
 *   <Modal
 *     isOpen={isOpen}
 *     onClose={() => setIsOpen(false)}
 *     title="SAVE STATE"
 *     footer={<Button onClick={() => setIsOpen(false)}>CONFIRM</Button>}
 *   >
 *     <p>Modal body content goes here.</p>
 *   </Modal>
 */

import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { backdropVariants, modalVariants } from '@/lib/animation-variants';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Additional classes for the modal container */
  className?: string;
}

// ── Focus Trap Hook ────────────────────────────────────────────────────────

function useFocusTrap(isOpen: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors),
    ).filter((el) => !el.closest('[aria-hidden="true"]'));

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus first element on open
    const previouslyFocused = document.activeElement as HTMLElement | null;
    first?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, containerRef]);
}

// ── Component ──────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, children, footer, className = '' }: ModalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Escape key handler
  React.useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useFocusTrap(isOpen, containerRef);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal container — centered */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="presentation"
          >
            <motion.div
              key="modal-panel"
              ref={containerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              className={[
                'bg-surface-2 border border-magenta-dim/40',
                'rounded-xl shadow-elevation-xl',
                'max-w-lg w-full mx-4 p-6',
                'flex flex-col',
                'relative',
                className,
              ]
                .filter(Boolean)
                .join(' ')}
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || true) && (
                <div className="flex items-start justify-between gap-4 border-b border-surface-3 pb-4 mb-4">
                  {title && (
                    <h2
                      id="modal-title"
                      className="font-pixel text-h2 text-neon-cyan leading-snug"
                    >
                      {title}
                    </h2>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className={[
                      'shrink-0 p-1 rounded-md',
                      'text-text-tertiary hover:text-text-primary',
                      'hover:bg-surface-3 transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2',
                      'focus-visible:ring-neon-cyan focus-visible:ring-offset-2',
                      'focus-visible:ring-offset-surface-2',
                      !title ? 'ml-auto' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="flex-1 font-body text-body text-text-primary">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 border-t border-surface-3 pt-4 mt-4">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Portal to document.body — safe with SSR guard
  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

Modal.displayName = 'Modal';

export { Modal };
