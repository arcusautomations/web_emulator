'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { get } from 'idb-keyval';
import { useEmulator } from '@/lib/hooks/useEmulator';
import { useEmulatorStore } from '@/lib/stores/emulator-store';
import { usePlatformDetect } from '@/lib/hooks/usePlatformDetect';
import { TouchControls } from './TouchControls';
import { GameHUD } from './GameHUD';
import { QuickMenu } from './QuickMenu';
import { LoadingOverlay } from './LoadingOverlay';
import { PauseOverlay } from './PauseOverlay';
import { EmulatorErrorBoundary } from './EmulatorErrorBoundary';
import { CheatPanel } from './CheatPanel';
import type { GameMeta, SystemType } from '@/types';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  game: any; // Supabase row
}

export function GamePlayerClient({ game }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { loadGame, resume } = useEmulator();
  const { isTouchDevice } = usePlatformDetect();
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const initRef = useRef(false); // Prevent double-init in StrictMode

  const emulatorStatus = useEmulatorStore((s) => s.status);

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
    if (initRef.current) return;
    let cancelled = false;

    async function init() {
      // Wait for container to be available (handles React timing)
      let container = containerRef.current;
      let retries = 0;
      while (!container && retries < 100) {
        await new Promise((r) => setTimeout(r, 20));
        container = containerRef.current;
        retries++;
      }

      if (!container || cancelled) {
        if (!cancelled) {
          setLoadError('Failed to initialize display. Please refresh the page.');
          setIsLoading(false);
        }
        return;
      }

      initRef.current = true;

      try {
        setLoadProgress(10);

        // Step 1: Fetch ROM data
        let romData: ArrayBuffer;

        if (game.source === 'bundled') {
          if (!game.rom_storage_path) {
            throw new Error('This game is not yet available. ROM file pending upload.');
          }

          setLoadProgress(20);
          const romUrl = game.rom_storage_path.startsWith('http')
            ? game.rom_storage_path
            : `/${game.rom_storage_path}`;

          const response = await fetch(romUrl);
          if (!response.ok) {
            throw new Error(`Failed to download ROM (HTTP ${response.status}).`);
          }
          romData = await response.arrayBuffer();

          if (romData.byteLength < 100) {
            throw new Error('Downloaded ROM file is invalid.');
          }
        } else {
          setLoadProgress(20);
          const stored = await get<ArrayBuffer>(`arcadium:rom:${game.file_hash}`);
          if (!stored) {
            throw new Error('ROM not found on this device. Please upload again.');
          }
          romData = stored;
        }

        if (cancelled) return;
        setLoadProgress(40);

        // Step 2: Initialize emulator (Nostalgist creates its canvas inside our container)
        await loadGame(container, gameMeta, romData);

        if (cancelled) return;
        setLoadProgress(100);
        setIsLoading(false);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load game');
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);

  const handleQuit = useCallback(() => {
    router.push('/');
  }, [router]);

  if (loadError) {
    return (
      <div className="min-h-[100dvh] bg-void flex flex-col items-center justify-center p-8">
        <div className="font-pixel text-h2 sm:text-h1 text-error mb-4">LOAD FAILED</div>
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
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        {/* Emulator container — Nostalgist injects its canvas here */}
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
        />

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

        {/* Touch Controls — show whenever game is running on touch device */}
        {isTouchDevice && !isLoading && (emulatorStatus === 'running' || emulatorStatus === 'paused') && (
          <TouchControls system={game.system} />
        )}

        {/* Quick Menu */}
        <QuickMenu gameId={game.id} system={game.system} onQuit={handleQuit} />

        {/* Cheat Panel */}
        <CheatPanel />
      </div>
    </EmulatorErrorBoundary>
  );
}
