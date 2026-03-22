'use client';

/**
 * BottomBar — mobile-only fixed bottom tab bar.
 *
 * Usage:
 *   <BottomBar />
 *
 * Hidden at lg and above. Handles bottom safe-area inset on iOS.
 * Active tab derived from usePathname().
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Heart, Save, Trophy, Settings } from 'lucide-react';

interface TabItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean | 'true' | 'false'; className?: string; }>;
}

const tabs: TabItem[] = [
  { href: '/', label: 'Library', icon: LayoutGrid },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/saves', label: 'Saves', icon: Save },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function BottomBar() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className={[
        'fixed bottom-0 left-0 right-0 z-40',
        'lg:hidden',
        'h-14 bg-base/90 backdrop-blur-md border-t border-surface-3',
        /* Safe-area bottom padding — overrides h-16 internal padding */
        'pb-[max(8px,env(safe-area-inset-bottom))]',
        'flex items-stretch',
      ].join(' ')}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            aria-label={tab.label}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neon-cyan',
              active ? 'text-neon-cyan' : 'text-text-tertiary hover:text-text-secondary',
            ].join(' ')}
          >
            <Icon
              size={18}
              aria-hidden={true}
              className={active ? 'drop-shadow-[0_0_6px_#00ffc8aa]' : ''}
            />
            <span className="font-pixel text-[10px] leading-none">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
