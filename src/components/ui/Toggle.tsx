'use client';

/**
 * Toggle — ARCADIUM UI Component
 *
 * Usage:
 *   <Toggle
 *     checked={audioEnabled}
 *     onChange={setAudioEnabled}
 *     label="Enable Audio"
 *   />
 *   <Toggle checked={true} onChange={() => {}} disabled />
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { springs } from '@/lib/animation-presets';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  /** Optional id — auto-generated if omitted */
  id?: string;
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled = false, label, id, className = '' }: ToggleProps) {
  const autoId = React.useId();
  const toggleId = id ?? autoId;

  function handleClick() {
    if (!disabled) onChange(!checked);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) onChange(!checked);
    }
  }

  const trackClasses = [
    'relative inline-flex items-center',
    'w-12 h-7 rounded-full',
    'border-2',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-base',
    checked
      ? 'bg-neon-cyan border-neon-cyan shadow-glow-sm-cyan'
      : 'bg-surface-3 border-surface-3',
    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        role="switch"
        id={toggleId}
        aria-checked={checked}
        aria-label={label}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={trackClasses}
        tabIndex={0}
      >
        {/* Animated thumb */}
        <motion.span
          className={[
            'absolute w-5 h-5 rounded-full',
            'shadow-elevation-sm',
            checked ? 'bg-text-inverse' : 'bg-text-secondary',
          ].join(' ')}
          animate={{ x: checked ? 20 : 2 }}
          transition={springs.snap}
          aria-hidden="true"
          style={{ top: '50%', translateY: '-50%' }}
        />
      </button>

      {/* Label */}
      {label && (
        <label
          htmlFor={toggleId}
          className={[
            'font-body text-body-sm select-none',
            disabled ? 'text-text-tertiary cursor-not-allowed' : 'text-text-secondary cursor-pointer',
          ].join(' ')}
        >
          {label}
        </label>
      )}
    </div>
  );
}

Toggle.displayName = 'Toggle';

export { Toggle };
