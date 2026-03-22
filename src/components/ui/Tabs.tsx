'use client';

/**
 * Tabs — ARCADIUM UI Component
 *
 * Usage:
 *   const TABS = [
 *     { id: 'library', label: 'LIBRARY' },
 *     { id: 'recent', label: 'RECENT' },
 *     { id: 'settings', label: 'SETTINGS' },
 *   ];
 *
 *   <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
 */

import * as React from 'react';
import { motion } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  /** Optional ARIA label for the tablist */
  'aria-label'?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

function Tabs({ tabs, activeTab, onChange, className = '', 'aria-label': ariaLabel }: TabsProps) {
  const tablistRef = React.useRef<HTMLDivElement>(null);

  // Keyboard navigation — left/right arrows move between tabs
  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const enabledIndex = enabledTabs.findIndex((t) => t.id === tabs[index].id);

    let nextIndex: number | undefined;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (enabledIndex + 1) % enabledTabs.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (enabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = enabledTabs.length - 1;
    }

    if (nextIndex !== undefined) {
      const nextTab = enabledTabs[nextIndex];
      onChange(nextTab.id);
      // Focus the next tab button
      const buttons = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      const nextTabIndex = tabs.findIndex((t) => t.id === nextTab.id);
      buttons?.[nextTabIndex]?.focus();
    }
  }

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label={ariaLabel}
      className={[
        'bg-surface-1 border border-surface-3 rounded-lg p-1',
        'flex gap-1 overflow-x-auto',
        'scrollbar-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={isActive ? 0 : -1}
            className={[
              'relative flex-shrink-0 font-pixel text-h4 px-4 py-2 rounded-md',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-neon-cyan focus-visible:ring-offset-1',
              'focus-visible:ring-offset-surface-1',
              isActive
                ? 'text-neon-cyan'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-2',
              tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Animated active background */}
            {isActive && (
              <motion.span
                layoutId="tabs-active-bg"
                className="absolute inset-0 rounded-md bg-surface-2 shadow-glow-sm-cyan"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                aria-hidden="true"
              />
            )}

            {/* Label — above the animated bg */}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Tabs.displayName = 'Tabs';

export { Tabs };
