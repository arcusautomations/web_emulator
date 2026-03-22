'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useCallback, useRef } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';

interface GameFiltersProps {
  currentSystem?: string;
  currentSort?: string;
  currentQuery?: string;
  currentView?: string;
}

const SYSTEMS: { value: string; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'gb', label: 'GB' },
  { value: 'gbc', label: 'GBC' },
  { value: 'gba', label: 'GBA' },
  { value: 'nes', label: 'NES' },
];

export function GameFilters({ currentSystem = 'all', currentSort = 'title', currentQuery = '', currentView = 'grid' }: GameFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const updateParam = useCallback((key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all' && value !== 'grid' && value !== 'title') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`);
    });
  }, [router, searchParams]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* System filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {SYSTEMS.map((sys) => (
          <button
            key={sys.value}
            onClick={() => updateParam('system', sys.value)}
            className={`font-pixel text-micro px-3 py-1.5 rounded-md border transition-all whitespace-nowrap ${
              currentSystem === sys.value || (sys.value === 'all' && !currentSystem)
                ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-glow-sm-cyan'
                : 'bg-surface-1 border-surface-3 text-text-secondary hover:border-surface-3 hover:text-text-primary'
            }`}
          >
            {sys.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search games..."
          defaultValue={currentQuery}
          onChange={(e) => {
            const value = e.target.value;
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => updateParam('q', value), 300);
          }}
          className="w-full bg-surface-1 text-text-primary font-body text-body-sm border border-surface-3 rounded-md pl-9 pr-4 py-2 placeholder:text-text-tertiary focus:border-neon-cyan focus:shadow-glow-sm-cyan focus:outline-none transition-all"
        />
      </div>

      {/* View toggle (desktop) */}
      <div className="hidden sm:flex gap-1 bg-surface-1 border border-surface-3 rounded-md p-0.5">
        <button
          onClick={() => updateParam('view', 'grid')}
          className={`p-1.5 rounded ${currentView !== 'list' ? 'bg-surface-2 text-neon-cyan' : 'text-text-tertiary hover:text-text-secondary'}`}
          aria-label="Grid view"
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => updateParam('view', 'list')}
          className={`p-1.5 rounded ${currentView === 'list' ? 'bg-surface-2 text-neon-cyan' : 'text-text-tertiary hover:text-text-secondary'}`}
          aria-label="List view"
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );
}
