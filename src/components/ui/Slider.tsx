'use client';

/**
 * Slider — ARCADIUM UI Component
 *
 * Usage:
 *   <Slider
 *     label="Master Volume"
 *     value={volume}
 *     onChange={setVolume}
 *     min={0}
 *     max={100}
 *     showValue
 *   />
 *   <Slider value={50} onChange={() => {}} min={0} max={100} step={5} />
 */

import * as React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  disabled = false,
  id,
  className = '',
}: SliderProps) {
  const autoId = React.useId();
  const sliderId = id ?? autoId;

  // Percentage for the filled track
  const percent = Math.round(((value - min) / (max - min)) * 100);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(Number(e.target.value));
  }

  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      {/* Label row */}
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={sliderId}
              className="font-pixel text-micro text-text-secondary tracking-wider uppercase"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="font-mono text-caption text-text-secondary tabular-nums">
              {value}
            </span>
          )}
        </div>
      )}

      {/* Slider track wrapper */}
      <div className="relative flex items-center h-5">
        {/* Custom track background — filled portion in neon-cyan */}
        <div
          className="absolute inset-y-0 my-auto h-2 w-full rounded-full bg-surface-3 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-magenta to-neon-cyan transition-[width] duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Native range input — overlaid for interaction */}
        <input
          type="range"
          id={sliderId}
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={handleChange}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          className={[
            // Reset + position
            'relative w-full h-2 appearance-none bg-transparent cursor-pointer',
            // Disabled
            disabled ? 'opacity-40 cursor-not-allowed' : '',
            // Focus ring
            'focus-visible:outline-none',
            // Webkit thumb
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neon-cyan',
            '[&::-webkit-slider-thumb]:shadow-glow-sm-cyan',
            '[&::-webkit-slider-thumb]:transition-shadow',
            '[&::-webkit-slider-thumb:hover]:shadow-glow-md-cyan',
            // Firefox thumb
            '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neon-cyan',
            '[&::-moz-range-thumb]:shadow-glow-sm-cyan',
            '[&::-moz-range-thumb]:cursor-pointer',
            // Firefox track reset
            '[&::-moz-range-track]:bg-transparent',
            // Focus-visible thumb
            'focus-visible:[&::-webkit-slider-thumb]:ring-2',
            'focus-visible:[&::-webkit-slider-thumb]:ring-neon-cyan',
            'focus-visible:[&::-webkit-slider-thumb]:ring-offset-2',
            'focus-visible:[&::-webkit-slider-thumb]:ring-offset-base',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
    </div>
  );
}

Slider.displayName = 'Slider';

export { Slider };
