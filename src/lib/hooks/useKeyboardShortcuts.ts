'use client';

import { useEffect } from 'react';
import { useEmulator } from './useEmulator';
import { useUIStore } from '@/lib/stores/ui-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants';

export function useKeyboardShortcuts() {
  const { saveState, loadState, pause, resume, setSpeed, takeScreenshot, status, speed } =
    useEmulator();
  const setActiveModal = useUIStore((s) => s.setActiveModal);
  const activeModal = useUIStore((s) => s.activeModal);
  const addToast = useUIStore((s) => s.addToast);
  const updateAudio = useSettingsStore((s) => s.updateAudio);
  const isMuted = useSettingsStore((s) => s.settings.audio.isMuted);
  const masterVolume = useSettingsStore((s) => s.settings.audio.masterVolume);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const key = e.key;

      switch (key) {
        case KEYBOARD_SHORTCUTS.quickSave:
          e.preventDefault();
          await saveState(0);
          addToast({ type: 'success', title: 'STATE SAVED', description: 'Slot 0', duration: 2000 });
          break;

        case KEYBOARD_SHORTCUTS.quickLoad:
          e.preventDefault();
          await loadState(0);
          addToast({ type: 'info', title: 'STATE LOADED', description: 'Slot 0', duration: 2000 });
          break;

        case KEYBOARD_SHORTCUTS.quickMenu:
          e.preventDefault();
          if (activeModal === 'quickMenu') {
            setActiveModal(null);
            resume();
          } else {
            pause();
            setActiveModal('quickMenu');
          }
          break;

        case KEYBOARD_SHORTCUTS.screenshot:
          e.preventDefault();
          await takeScreenshot();
          addToast({ type: 'info', title: 'SCREENSHOT CAPTURED', duration: 2000 });
          break;

        case KEYBOARD_SHORTCUTS.mute:
          e.preventDefault();
          updateAudio({ isMuted: !isMuted });
          break;

        case KEYBOARD_SHORTCUTS.volumeUp:
          e.preventDefault();
          updateAudio({ masterVolume: Math.min(1, masterVolume + 0.1) });
          break;

        case KEYBOARD_SHORTCUTS.volumeDown:
          e.preventDefault();
          updateAudio({ masterVolume: Math.max(0, masterVolume - 0.1) });
          break;

        case KEYBOARD_SHORTCUTS.fullscreen:
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;

        case KEYBOARD_SHORTCUTS.fastForward:
          e.preventDefault();
          if (speed === 1) setSpeed(2);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_SHORTCUTS.fastForward && speed > 1) {
        setSpeed(1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    status,
    speed,
    activeModal,
    isMuted,
    masterVolume,
    saveState,
    loadState,
    pause,
    resume,
    setSpeed,
    takeScreenshot,
    setActiveModal,
    addToast,
    updateAudio,
  ]);
}
