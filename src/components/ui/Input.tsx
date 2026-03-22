'use client';

/**
 * Input — ARCADIUM UI Component
 *
 * Usage:
 *   <Input label="Search Games" placeholder="Type a title..." />
 *   <Input
 *     label="Username"
 *     leftIcon={<User size={16} />}
 *     error="Username is required"
 *   />
 *   <Input type="password" label="Password" rightIcon={<Eye size={16} />} />
 */

import * as React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', id, ...rest }, ref) => {
    const inputId = id ?? React.useId();
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);

    const wrapperClasses = [
      'relative flex items-center',
      'bg-surface-1 rounded-md',
      'border transition-colors duration-150',
      hasError
        ? 'border-error shadow-glow-error'
        : 'border-surface-3 focus-within:border-neon-cyan focus-within:shadow-glow-sm-cyan',
    ].join(' ');

    const inputClasses = [
      'w-full bg-transparent',
      'text-text-primary font-body text-body',
      'placeholder:text-text-tertiary',
      'outline-none',
      'py-3',
      leftIcon ? 'pl-10' : 'pl-4',
      rightIcon ? 'pr-10' : 'pr-4',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="font-pixel text-micro text-text-secondary tracking-wider uppercase"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className={wrapperClasses}>
          {/* Left icon */}
          {leftIcon && (
            <span
              className="absolute left-3 text-text-tertiary pointer-events-none flex items-center"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            className={inputClasses}
            {...rest}
          />

          {/* Right icon */}
          {rightIcon && (
            <span
              className="absolute right-3 text-text-tertiary flex items-center"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="font-body text-caption text-error-light flex items-center gap-1.5"
          >
            <span aria-hidden="true">&#9888;</span>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
