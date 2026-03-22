'use client';

/**
 * Select — ARCADIUM UI Component
 *
 * Usage:
 *   const SHADER_OPTIONS = [
 *     { value: 'none', label: 'No Shader' },
 *     { value: 'crt', label: 'CRT' },
 *     { value: 'lcd', label: 'LCD' },
 *   ];
 *
 *   <Select
 *     label="Display Shader"
 *     options={SHADER_OPTIONS}
 *     value={shader}
 *     onChange={setShader}
 *     placeholder="Select shader..."
 *   />
 */

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

// ── Dropdown animation variants ────────────────────────────────────────────

const dropdownVariants = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// ── Component ──────────────────────────────────────────────────────────────

function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  error,
  disabled = false,
  id,
  className = '',
}: SelectProps) {
  const autoId = React.useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;
  const listboxId = `${selectId}-listbox`;

  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const hasError = Boolean(error);
  const enabledOptions = options.filter((o) => !o.disabled);

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape; navigate with arrows
  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(
          options.findIndex((o) => o.value === value && !o.disabled) !== -1
            ? options.findIndex((o) => o.value === value && !o.disabled)
            : 0,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(enabledOptions.length - 1);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }

  function handleListKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    const enabledIndices = options.reduce<number[]>((acc, o, i) => {
      if (!o.disabled) acc.push(i);
      return acc;
    }, []);

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown': {
        e.preventDefault();
        const currentPos = enabledIndices.indexOf(highlightedIndex);
        const nextIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
        setHighlightedIndex(nextIndex);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const currentPos = enabledIndices.indexOf(highlightedIndex);
        const prevIndex =
          enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
        setHighlightedIndex(prevIndex);
        break;
      }
      case 'Home':
        e.preventDefault();
        setHighlightedIndex(enabledIndices[0]);
        break;
      case 'End':
        e.preventDefault();
        setHighlightedIndex(enabledIndices[enabledIndices.length - 1]);
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const opt = options[highlightedIndex];
        if (opt && !opt.disabled) {
          onChange(opt.value);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
      }
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  // Scroll highlighted option into view
  React.useEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[highlightedIndex] as HTMLLIElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, isOpen]);

  // Reset highlight when closed
  React.useEffect(() => {
    if (!isOpen) setHighlightedIndex(-1);
  }, [isOpen]);

  const triggerClasses = [
    'w-full flex items-center justify-between gap-3',
    'bg-surface-1 rounded-md px-4 py-3',
    'text-body font-body',
    'border transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-base',
    hasError
      ? 'border-error shadow-glow-error'
      : isOpen
        ? 'border-neon-cyan shadow-glow-sm-cyan'
        : 'border-surface-3 hover:border-neon-cyan/50',
    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5">
      {/* Label */}
      {label && (
        <label
          id={`${selectId}-label`}
          className="font-pixel text-micro text-text-secondary tracking-wider uppercase"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={selectId}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          className={triggerClasses}
        >
          <span className={selectedOption ? 'text-text-primary' : 'text-text-tertiary'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.15 }}
            className="shrink-0 text-text-tertiary"
            aria-hidden="true"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={[
                'absolute z-20 top-full left-0 right-0 mt-1',
                'bg-surface-2 border border-surface-3 rounded-lg',
                'shadow-elevation-lg overflow-hidden',
              ].join(' ')}
            >
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-labelledby={label ? `${selectId}-label` : undefined}
                aria-activedescendant={
                  highlightedIndex >= 0 ? `${selectId}-option-${highlightedIndex}` : undefined
                }
                tabIndex={0}
                onKeyDown={handleListKeyDown}
                className="max-h-56 overflow-y-auto py-1 focus-visible:outline-none"
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              >
                {options.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <li
                      key={option.value}
                      id={`${selectId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                      className={[
                        'flex items-center justify-between gap-3',
                        'px-4 py-2.5',
                        'font-body text-body-sm',
                        'transition-colors duration-100',
                        'cursor-pointer select-none',
                        isHighlighted ? 'bg-surface-3' : '',
                        isSelected ? 'text-neon-cyan' : 'text-text-primary',
                        option.disabled
                          ? 'opacity-40 cursor-not-allowed text-text-tertiary'
                          : 'hover:bg-surface-3',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check
                          size={14}
                          className="shrink-0 text-neon-cyan"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
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
}

Select.displayName = 'Select';

export { Select };
