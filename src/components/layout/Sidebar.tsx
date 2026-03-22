'use client';

/**
 * Sidebar — desktop-only fixed left navigation.
 *
 * Usage:
 *   <Sidebar />
 *
 * Hidden below lg breakpoint (BottomBar handles mobile).
 * Width: 240px expanded, 64px collapsed (CSS transition).
 * Reads collapsed state from useUIStore.
 * Active item derived from usePathname().
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Heart,
  Save,
  Trophy,
  Camera,
  Settings,
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean | 'true' | 'false'; className?: string }>;
}

const primaryItems: NavItem[] = [
  { href: '/', label: 'Library', icon: LayoutGrid },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/saves', label: 'Saves', icon: Save },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/screenshots', label: 'Screenshots', icon: Camera },
];

const secondaryItems: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      id="main-sidebar"
      aria-label="Main navigation"
      className={[
        'fixed left-0 z-30',
        'top-14 lg:top-16',
        'h-[calc(100dvh-56px)] lg:h-[calc(100dvh-64px)]',
        'hidden lg:flex flex-col',
        'bg-base border-r border-surface-3',
        'transition-[width] duration-300 ease-in-out',
        'overflow-hidden',
        collapsed ? 'w-16' : 'w-60',
      ].join(' ')}
    >
      {/* Primary nav items */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-3 flex flex-col gap-0.5"
        aria-label="Primary navigation"
      >
        {primaryItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}

        {/* Separator */}
        <div
          role="separator"
          aria-hidden="true"
          className="my-2 mx-3 h-px bg-surface-3"
        />
      </nav>

      {/* Secondary nav items (settings pinned to bottom) */}
      <nav
        className="py-3 flex flex-col gap-0.5 border-t border-surface-3"
        aria-label="Secondary navigation"
      >
        {secondaryItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────────

interface SidebarItemProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}

function SidebarItem({ item, active, collapsed }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-label={collapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      className={[
        'relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-md',
        'font-pixel text-micro whitespace-nowrap',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-base',
        active
          ? 'bg-surface-2 text-neon-cyan before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-r before:bg-neon-cyan'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-1',
      ].join(' ')}
    >
      <Icon
        size={18}
        aria-hidden={true}
        className={[
          'shrink-0',
          active ? 'text-neon-cyan' : '',
        ].join(' ')}
      />
      {/* Label — hidden when collapsed, revealed via opacity + width transition */}
      <span
        className={[
          'transition-[opacity,max-width] duration-300 ease-in-out overflow-hidden',
          collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]',
        ].join(' ')}
        aria-hidden={collapsed ? 'true' : undefined}
      >
        {item.label}
      </span>
    </Link>
  );
}
