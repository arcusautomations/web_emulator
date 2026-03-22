'use client';

/**
 * Button — ARCADIUM UI Component
 *
 * Usage:
 *   <Button variant="primary" size="md" leftIcon={<Play />} onClick={handlePlay}>
 *     PLAY GAME
 *   </Button>
 *   <Button variant="secondary" isLoading>SAVING...</Button>
 *   <Button variant="icon" aria-label="Settings"><Settings /></Button>
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { springs } from '@/lib/animation-presets';
import { Spinner } from './Spinner';

// ── Types ──────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

// ── Style maps ─────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-neon-cyan text-text-inverse font-pixel',
    'border border-transparent',
    'hover:shadow-glow-md-cyan',
    'disabled:bg-cyan-muted disabled:shadow-none disabled:cursor-not-allowed',
  ].join(' '),

  secondary: [
    'bg-transparent text-neon-cyan font-pixel',
    'border border-neon-cyan',
    'hover:shadow-glow-md-cyan hover:bg-cyan-dim',
    'disabled:border-cyan-muted disabled:text-cyan-muted disabled:shadow-none disabled:cursor-not-allowed',
  ].join(' '),

  ghost: [
    'bg-transparent text-text-secondary font-body',
    'border border-transparent',
    'hover:text-text-primary hover:bg-surface-2',
    'disabled:text-text-tertiary disabled:cursor-not-allowed',
  ].join(' '),

  danger: [
    'bg-transparent text-error-light font-pixel',
    'border border-error',
    'hover:bg-error/10 hover:shadow-glow-error',
    'disabled:border-error/40 disabled:text-error/40 disabled:shadow-none disabled:cursor-not-allowed',
  ].join(' '),

  icon: [
    'bg-surface-1 text-text-secondary',
    'border border-surface-3',
    'hover:text-text-primary hover:border-neon-cyan/50 hover:shadow-glow-sm-cyan',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-caption',
  md: 'px-6 py-3 text-h4',
  lg: 'px-8 py-4 text-h3',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

// ── Component ──────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isIconVariant = variant === 'icon';

    const baseStyles = [
      'relative inline-flex items-center justify-center gap-2',
      'rounded-md',
      'transition-colors duration-150',
      'select-none cursor-pointer',
      'focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-base',
      isIconVariant ? iconSizeStyles[size] : sizeStyles[size],
      variantStyles[variant],
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <motion.button
        ref={ref}
        className={baseStyles}
        disabled={isDisabled}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        transition={springs.snap}
        {...(rest as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {/* Loading overlay */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center gap-2 rounded-md">
            <Spinner
              size="sm"
              className={variant === 'primary' ? '[--spinner-color:theme(colors.text-inverse)]' : ''}
            />
            <span className="font-pixel text-micro tracking-widest">LOADING...</span>
          </span>
        )}

        {/* Content — hidden when loading to preserve button width */}
        <span
          className={[
            'inline-flex items-center gap-2',
            isLoading ? 'invisible' : 'visible',
          ].join(' ')}
          aria-hidden={isLoading}
        >
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      </motion.button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
