'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { get } from 'idb-keyval';
import { useEmulator } from '@/lib/hooks/useEmulator';
import { useEmulatorStore } from '@/lib/stores/emulator-store';
import { usePlatformDetect } from '@/lib/hooks/usePlatformDetect';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { EmulatorCanvas } from './EmulatorCanvas';
import { TouchControls } from './TouchControls';
import { GameHUD } from './GameHUD';
import { QuickMenu } from './QuickMenu';
import { LoadingOverlay } from './LoadingOverlay';
import { PauseOverlay } from './PauseOverlay';
import { EmulatorErrorBoundary } from './EmulatorErrorBoundary';
import { CRTOverlay } from '@/components/effects/CRTOverlay';
import type { GameMeta, SystemType } from '@/types';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  game: any; // Supabase row
}

function KeyboardShortcutsActivator() {
  useKeyboardShortcuts();
  return null;
}

export function GamePlayerClient({ game }: Props) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { loadGame, resume, status } = useEmulator();
  const { isTouchDevice } = usePlatformDetect();
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Derive the emulator status directly from the store (stable selector)
  const emulatorStatus = useEmulatorStore((s) => s.status);

  // Convert Supabase row to GameMeta
  const gameMeta: GameMeta = {
    id: game.id,
    userId: game.user_id,
    title: game.title,
    system: game.system as SystemType,
    fileHash: game.file_hash,
    fileSizeBytes: game.file_size_bytes,
    source: game.source,
    coverArtUrl: game.cover_art_url,
    dominantColor: game.dominant_color,
    genre: game.genre,
    developer: game.developer,
    releaseYear: game.release_year,
    romStoragePath: game.rom_storage_path,
    createdAt: game.created_at,
    updatedAt: game.updated_at,
  };

  useEffect(() => {
    async function init() {
      if (!canvasRef.current) return;

      try {
        setLoadProgress(10);

        let romData: ArrayBuffer;

        if (game.source === 'bundled' && game.rom_storage_path) {
          setLoadProgress(30);
          const response = await fetch(`/${game.rom_storage_path}`);
          if (!response.ok) throw new Error('Failed to fetch ROM');
          romData = await response.arrayBuffer();
        } else {
          setLoadProgress(30);
          const stored = await get<ArrayBuffer>(`arcadium:rom:${game.file_hash}`);
          if (!stored) throw new Error('ROM not found in local storage. Please re-upload.');
          romData = stored;
        }

        setLoadProgress(60);

        await loadGame(canvasRef.current, gameMeta, romData);
        setLoadProgress(100);
        setIsLoading(false);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Failed to load game');
        setIsLoading(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);

  const handleQuit = useCallback(() => {
    router.push('/');
  }, [router]);

  if (loadError) {
    return (
      <div className="min-h-[100dvh] bg-void flex flex-col items-center justify-center p-8">
        <div className="font-pixel text-h2 text-error mb-4">LOAD FAILED</div>
        <p className="text-error-light text-body-sm mb-8 text-center max-w-md">{loadError}</p>
        <button
          onClick={handleQuit}
          className="font-pixel text-h4 text-neon-cyan hover:text-cyan-light transition-colors"
        >
          RETURN TO LIBRARY
        </button>
      </div>
    );
  }

  return (
    <EmulatorErrorBoundary onQuit={handleQuit}>
      <div className="fixed inset-0 bg-void flex items-center justify-center">
        {/* Canvas */}
        <EmulatorCanvas ref={canvasRef} system={game.system} />

        {/* CRT Overlay (on canvas only) */}
        <CRTOverlay mode="canvas" />

        {/* Loading Overlay */}
        {isLoading && <LoadingOverlay progress={loadProgress} title={game.title} />}

        {/* Pause Overlay */}
        {emulatorStatus === 'paused' && !isLoading && (
          <PauseOverlay onResume={resume} onQuit={handleQuit} />
        )}

        {/* HUD */}
        {!isLoading && emulatorStatus !== 'error' && (
          <GameHUD gameTitle={game.title} system={game.system} onQuit={handleQuit} />
        )}

        {/* Touch Controls */}
        {isTouchDevice && !isLoading && emulatorStatus === 'running' && (
          <TouchControls system={game.system} />
        )}

        {/* Quick Menu */}
        <QuickMenu gameId={game.id} system={game.system} onQuit={handleQuit} />

        {/* Keyboard shortcuts (active only when game is loaded) */}
        {!isLoading && <KeyboardShortcutsActivator />}
      </div>
    </EmulatorErrorBoundary>
  );
}
