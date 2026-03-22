'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { CheatEngine } from '@/core/cheat-engine';
import { bottomSheetVariants, backdropVariants } from '@/lib/animation-variants';
import type { CheatType } from '@/types';

const cheatEngine = new CheatEngine();

export function CheatPanel() {
  const activeModal = useUIStore((s) => s.activeModal);
  const setActiveModal = useUIStore((s) => s.setActiveModal);
  const isOpen = activeModal === 'cheats';
  const [cheats, setCheats] = useState(cheatEngine.getAllCheats());
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [codeType, setCodeType] = useState<CheatType>('gameshark');

  const addCheat = () => {
    if (!name || !code) return;
    cheatEngine.addCheat(name, code, codeType);
    setCheats(cheatEngine.getAllCheats());
    setName('');
    setCode('');
  };

  const toggleCheat = (id: string) => {
    cheatEngine.toggleCheat(id);
    setCheats(cheatEngine.getAllCheats());
  };

  const removeCheat = (id: string) => {
    cheatEngine.removeCheat(id);
    setCheats(cheatEngine.getAllCheats());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div variants={backdropVariants} initial="initial" animate="animate" exit="exit" className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setActiveModal(null)} />
          <motion.div variants={bottomSheetVariants} initial="initial" animate="animate" exit="exit" className="fixed bottom-0 left-0 right-0 z-50 bg-surface-2 border-t border-magenta-dim/40 rounded-t-2xl max-h-[80vh] overflow-auto" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-surface-3 rounded-full" /></div>
            <div className="flex items-center justify-between px-6 pb-4 border-b border-surface-3">
              <h2 className="font-pixel text-h3 text-neon-magenta">CHEAT CODES</h2>
              <button onClick={() => setActiveModal(null)} className="p-2 text-text-secondary hover:text-text-primary"><X size={20} /></button>
            </div>

            {/* Add cheat form */}
            <div className="px-6 py-4 space-y-3 border-b border-surface-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cheat name..." className="w-full bg-surface-1 text-text-primary text-body-sm border border-surface-3 rounded-md px-3 py-2 focus:border-neon-cyan focus:outline-none" />
              <div className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code (e.g. 01FF16D0)" className="flex-1 bg-surface-1 text-text-primary font-mono text-body-sm border border-surface-3 rounded-md px-3 py-2 focus:border-neon-cyan focus:outline-none" />
                <select value={codeType} onChange={(e) => setCodeType(e.target.value as CheatType)} className="bg-surface-1 text-text-primary text-body-sm border border-surface-3 rounded-md px-3 py-2">
                  <option value="gameshark">GameShark</option>
                  <option value="gamegenie">Game Genie</option>
                  <option value="action_replay">Action Replay</option>
                </select>
              </div>
              <button onClick={addCheat} disabled={!name || !code} className="flex items-center gap-2 font-pixel text-h4 text-neon-cyan hover:text-cyan-light disabled:text-text-tertiary disabled:cursor-not-allowed transition-colors">
                <Plus size={16} /> ADD CHEAT
              </button>
            </div>

            {/* Cheat list */}
            <div className="px-6 py-4 space-y-2">
              {cheats.length === 0 ? (
                <p className="text-text-tertiary text-body-sm text-center py-4">No cheats added yet</p>
              ) : (
                cheats.map((cheat) => (
                  <div key={cheat.id} className="flex items-center justify-between bg-surface-1 rounded-lg p-3 border border-surface-3">
                    <div>
                      <p className="font-pixel text-micro text-text-primary">{cheat.name}</p>
                      <p className="font-mono text-micro text-text-tertiary">{cheat.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleCheat(cheat.id)} className={cheat.isEnabled ? 'text-neon-cyan' : 'text-text-tertiary'}>
                        {cheat.isEnabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button onClick={() => removeCheat(cheat.id)} className="text-text-tertiary hover:text-error"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
