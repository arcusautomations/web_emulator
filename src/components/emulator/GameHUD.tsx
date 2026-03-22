'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Pause,
  Play,
  Save,
  Camera,
  Settings,
  Maximize,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useEmulator } from '@/lib/hooks/useEmulator';
import { useEmulatorStore } from '@/lib/stores/emulator-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { HUD_AUTO_HIDE_MS } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import type { SystemType } from '@/types';

interface Props {
  gameTitle: string;
  system: SystemType;
  onQuit: () => void;
}

export function GameHUD({ gameTitle, system, onQuit }: Props) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { pause, resume, saveState, takeScreenshot } = useEmulator();
  const status = useEmulatorStore((s) => s.status);
  const speed = useEmulatorStore((s) => s.speed);
  const fps = useEmulatorStore((s) => s.fps);
  const setActiveModal = useUIStore((s) => s.setActiveModal);
  const addToast = useUIStore((s) => s.addToast);
  const isMuted = useSettingsStore((s) => s.settings.audio.isMuted);
  const updateAudio = useSettingsStore((s) => s.updateAudio);

  const resetTimer = useCallback(() => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (status === 'running') {
      timerRef.current = setTimeout(() => setVisible(false), HUD_AUTO_HIDE_MS);
    }
  }, [status]);

  useEffect(() => {
    const handleMouseMove = () => resetTimer();
    const handleTouchStart = () => resetTimer();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchStart);
    resetTimer();
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  // Always visible when paused
  useEffect(() => {
    if (status === 'paused') setVisible(true);
  }, [status]);

  const handleSave = async () => {
    await saveState(0);
    addToast({ type: 'success', title: 'STATE SAVED', description: 'Slot 0', duration: 2000 });
  };

  const handleScreenshot = async () => {
    const blob = await takeScreenshot();
    if (blob) {
      addToast({ type: 'info', title: 'SCREENSHOT CAPTURED', duration: 2000 });
    }
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-base/80 backdrop-blur-md border-b border-surface-3 px-4 py-2">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onQuit}
              className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Return to library"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-pixel text-h4 text-text-primary truncate max-w-48">
              {gameTitle}
            </span>
            <Badge variant="system">{system.toUpperCase()}</Badge>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => (status === 'running' ? pause() : resume())}
              className="p-2 text-text-secondary hover:text-neon-cyan transition-colors"
              aria-label={status === 'running' ? 'Pause' : 'Resume'}
            >
              {status === 'running' ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              onClick={handleSave}
              className="p-2 text-text-secondary hover:text-neon-cyan transition-colors"
              aria-label="Quick save"
            >
              <Save size={18} />
            </button>
            <button
              onClick={handleScreenshot}
              className="p-2 text-text-secondary hover:text-neon-cyan transition-colors"
              aria-label="Screenshot"
            >
              <Camera size={18} />
            </button>
            <button
              onClick={() => updateAudio({ isMuted: !isMuted })}
              className="p-2 text-text-secondary hover:text-neon-cyan transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 text-text-secondary hover:text-neon-cyan transition-colors hidden sm:block"
              aria-label="Fullscreen"
            >
              <Maximize size={18} />
            </button>
            <button
              onClick={() => setActiveModal('quickMenu')}
              className="p-2 text-text-secondary hover:text-neon-cyan transition-colors"
              aria-label="Menu"
            >
              <Settings size={18} />
            </button>

            {/* FPS + Speed */}
            <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-surface-3">
              <span className="font-mono text-micro text-text-tertiary">{fps}fps</span>
              {speed > 1 && (
                <span className="font-pixel text-micro text-warning">&gt;&gt;{speed}x</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
