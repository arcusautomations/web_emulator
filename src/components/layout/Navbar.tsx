'use client';

/**
 * Navbar — fixed top navigation bar for ARCADIUM.
 *
 * Usage:
 *   <Navbar />
 *
 * Height: 64px desktop (h-16), 56px mobile (h-14).
 * Left:   hamburger (toggles sidebar via useUIStore), ARCADIUM logo.
 * Center: reserved for Phase 3 search.
 * Right:  player avatar circle with initials "P1".
 */

import { Menu, X } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';

export function Navbar() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-14 lg:h-16 bg-base/80 backdrop-blur-md border-b border-surface-3 flex items-center px-3 lg:px-4"
      role="banner"
    >
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!sidebarCollapsed}
          aria-controls="main-sidebar"
          className="flex items-center justify-center w-9 h-9 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-base shrink-0"
        >
          {sidebarCollapsed ? (
            <Menu size={20} aria-hidden="true" />
          ) : (
            <X size={20} aria-hidden="true" />
          )}
        </button>

        <span
          className="font-pixel text-h3 text-neon-magenta text-glow-magenta select-none tracking-wider whitespace-nowrap"
          aria-label="ARCADIUM — home"
        >
          ARCADIUM
        </span>
      </div>

      {/* Center: reserved for Phase 3 search */}
      <div className="hidden lg:flex flex-1 justify-center px-4" aria-hidden="true" />

      {/* Right: user avatar */}
      <div className="flex items-center ml-auto shrink-0">
        <button
          type="button"
          aria-label="Player 1 account menu"
          className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-surface-2 border border-surface-3 hover:border-neon-cyan hover:shadow-glow-sm-cyan transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          <span className="font-pixel text-micro text-text-primary select-none leading-none">
            P1
          </span>
        </button>
      </div>
    </header>
  );
}
