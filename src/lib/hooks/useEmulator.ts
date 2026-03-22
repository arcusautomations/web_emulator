'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useEmulatorStore } from '@/lib/stores/emulator-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
import type { GameMeta } from '@/types';

// Lazy import the engine to avoid SSR issues
let engineModule: typeof import('@/core/engine') | null = null;

async function getEngine() {
  if (!engineModule) {
    engineModule = await import('@/core/engine');
  }
  return engineModule.EmulatorEngine.instance;
}

export function useEmulator() {
  const status = useEmulatorStore((s) => s.status);
  const currentGame = useEmulatorStore((s) => s.currentGame);
  const speed = useEmulatorStore((s) => s.speed);
  const fps = useEmulatorStore((s) => s.fps);
  const isRewinding = useEmulatorStore((s) => s.isRewinding);
  const errorMessage = useEmulatorStore((s) => s.errorMessage);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const loadGame = useCallback(
    async (canvas: HTMLCanvasElement, game: GameMeta, romData: ArrayBuffer) => {
      canvasRef.current = canvas;
      const engine = await getEngine();
      await engine.init(canvas, game, romData);

      // Unlock audio on iOS after the first user interaction that triggered loadGame
      if (engine.audio) {
        await engine.audio.unlock();
        const { settings } = useSettingsStore.getState();
        engine.audio.setVolume(settings.audio.isMuted ? 0 : settings.audio.masterVolume);
      }
    },
    [],
  );

  const pause = useCallback(async () => {
    const engine = await getEngine();
    engine.pause();
  }, []);

  const resume = useCallback(async () => {
    const engine = await getEngine();
    engine.resume();
  }, []);

  const reset = useCallback(async () => {
    const engine = await getEngine();
    engine.reset();
  }, []);

  const setSpeed = useCallback(async (multiplier: 1 | 2 | 4) => {
    const engine = await getEngine();
    engine.setSpeed(multiplier);
  }, []);

  const saveState = useCallback(
    async (slot: number) => {
      const engine = await getEngine();
      const state = await engine.saveState();
      if (state && currentGame) {
        const { SaveManager } = await import('@/core/save-manager');
        const thumbnail = canvasRef.current
          ? await (
              await import('@/core/screenshot-capture')
            ).ScreenshotCapture.captureThumbnail(canvasRef.current)
          : null;

        // Derive core name from system
        const coreNameMap: Record<string, string> = {
          nes: 'nestopia',
          gba: 'mgba',
          gb: 'gambatte',
          gbc: 'gambatte',
        };
        const coreName = coreNameMap[currentGame.system] ?? currentGame.system;

        await SaveManager.save(
          currentGame.id,
          slot,
          state,
          thumbnail,
          coreName,
          currentGame.system,
        );
      }
      return state;
    },
    [currentGame],
  );

  const loadState = useCallback(
    async (slot: number) => {
      if (!currentGame) return;
      const { SaveManager } = await import('@/core/save-manager');
      const save = await SaveManager.load(currentGame.id, slot);
      if (save) {
        const engine = await getEngine();
        await engine.loadState(save.stateData);
      }
    },
    [currentGame],
  );

  const takeScreenshot = useCallback(async (): Promise<Blob | null> => {
    const engine = await getEngine();
    return engine.captureScreenshot();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      getEngine().then((engine) => engine.destroy());
    };
  }, []);

  return {
    status,
    currentGame,
    speed,
    fps,
    isRewinding,
    errorMessage,
    loadGame,
    pause,
    resume,
    reset,
    setSpeed,
    saveState,
    loadState,
    takeScreenshot,
  };
}
