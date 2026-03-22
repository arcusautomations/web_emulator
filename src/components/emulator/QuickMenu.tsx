'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Download, Sliders, Code, LogOut } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { useEmulator } from '@/lib/hooks/useEmulator';
import { bottomSheetVariants, backdropVariants } from '@/lib/animation-variants';
import type { SystemType } from '@/types';

interface Props {
  gameId: string;
  system: SystemType;
  onQuit: () => void;
}

export function QuickMenu({ gameId: _gameId, system: _system, onQuit }: Props) {
  const activeModal = useUIStore((s) => s.activeModal);
  const setActiveModal = useUIStore((s) => s.setActiveModal);
  const addToast = useUIStore((s) => s.addToast);
  const { saveState, loadState, resume } = useEmulator();
  const isOpen = activeModal === 'quickMenu';

  const close = () => {
    setActiveModal(null);
    resume();
  };

  const handleSave = async (slot: number) => {
    await saveState(slot);
    addToast({ type: 'success', title: 'STATE SAVED', description: `Slot ${slot}`, duration: 2000 });
  };

  const handleLoad = async (slot: number) => {
    await loadState(slot);
    close();
    addToast({ type: 'info', title: 'STATE LOADED', description: `Slot ${slot}`, duration: 2000 });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={close}
          />
          <motion.div
            variants={bottomSheetVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface-2 border-t border-magenta-dim/40 rounded-t-2xl max-h-[70vh] overflow-auto"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-surface-3 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-surface-3">
              <h2 className="font-pixel text-h3 text-neon-cyan">QUICK MENU</h2>
              <button
                onClick={close}
                className="p-2 text-text-secondary hover:text-text-primary"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Save Slots */}
            <div className="px-6 py-4">
              <h3 className="font-pixel text-h4 text-text-secondary mb-3">SAVE / LOAD</h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <button
                      onClick={() => handleSave(i)}
                      className="bg-surface-1 border border-surface-3 rounded-md p-2 text-center hover:border-neon-cyan/30 transition-colors"
                    >
                      <Save size={14} className="mx-auto mb-1 text-text-secondary" />
                      <span className="font-pixel text-micro text-text-tertiary">S{i}</span>
                    </button>
                    <button
                      onClick={() => handleLoad(i)}
                      className="bg-surface-1 border border-surface-3 rounded-md p-2 text-center hover:border-neon-magenta/30 transition-colors"
                    >
                      <Download size={14} className="mx-auto mb-1 text-text-secondary" />
                      <span className="font-pixel text-micro text-text-tertiary">L{i}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-surface-3 space-y-2">
              <MenuButton
                icon={<Sliders size={18} />}
                label="SHADERS"
                onClick={() => setActiveModal('shaderPicker')}
              />
              <MenuButton
                icon={<Code size={18} />}
                label="CHEATS"
                onClick={() => setActiveModal('cheats')}
              />
              <MenuButton icon={<LogOut size={18} />} label="QUIT GAME" onClick={onQuit} danger />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
        danger
          ? 'text-error hover:bg-error/10'
          : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
      }`}
    >
      {icon}
      <span className="font-pixel text-h4">{label}</span>
    </button>
  );
}
