'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ROMUploader } from './ROMUploader';

export function AddGameSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-pixel text-micro text-neon-cyan hover:text-cyan-light border border-neon-cyan/30 hover:border-neon-cyan/60 bg-surface-1/50 hover:bg-surface-1 rounded-md px-3 py-2 transition-all duration-150"
        aria-expanded={open}
      >
        {open ? <X size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
        {open ? 'CANCEL' : 'ADD GAME'}
      </button>

      {open && (
        <div className="mt-3 max-w-lg">
          <ROMUploader />
        </div>
      )}
    </div>
  );
}
