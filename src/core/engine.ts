import { Nostalgist } from 'nostalgist';
import { CORE_CONFIGS } from '@/lib/constants';
import { useEmulatorStore } from '@/lib/stores/emulator-store';
import type { SystemType, GameMeta } from '@/types';

// Suppress unused import warning — SystemType used in type position only
type _SystemType = SystemType;

// Module-scoped singleton — NOT in Zustand (non-serializable)
let nostalgistInstance: Nostalgist | null = null;

export class EmulatorEngine {
  private static _instance: EmulatorEngine | null = null;

  static get instance(): EmulatorEngine {
    if (!EmulatorEngine._instance) {
      EmulatorEngine._instance = new EmulatorEngine();
    }
    return EmulatorEngine._instance;
  }

  /**
   * Initialize the emulator.
   * @param containerEl — a <div> where we create a canvas for Nostalgist
   * @param game — game metadata
   * @param romData — the ROM binary as ArrayBuffer
   */
  async init(containerEl: HTMLDivElement, game: GameMeta, romData: ArrayBuffer): Promise<void> {
    const store = useEmulatorStore.getState();
    store.setStatus('loading');
    store.setCurrentGame(game);

    try {
      const config = CORE_CONFIGS[game.system];
      store.setCurrentCore(config.core);

      // Create a proper File object with correct extension for Nostalgist
      const ext = config.extensions[0] ?? '.bin';
      const romFile = new File([romData], `game${ext}`, {
        type: 'application/octet-stream',
      });

      // Create a canvas element inside the container for Nostalgist
      containerEl.innerHTML = '';
      const canvas = document.createElement('canvas');
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.backgroundColor = 'black';
      canvas.style.imageRendering = 'pixelated';
      canvas.style.objectFit = 'contain';
      containerEl.appendChild(canvas);

      // Pass OUR canvas to Nostalgist — it renders into it
      const launchPromise = Nostalgist.launch({
        core: config.core,
        rom: romFile,
        element: canvas,
        size: 'auto',
        retroarchConfig: {
          video_vsync: true,
          rewind_enable: false,
          savestate_thumbnail_enable: true,
        } as Record<string, unknown>,
      });

      // 30-second timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Emulator initialization timed out (30s). The WASM core may have failed to download. Please try again.')),
          30000,
        );
      });

      nostalgistInstance = await Promise.race([launchPromise, timeoutPromise]);

      store.setStatus('running');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to initialize emulator';
      store.setError(msg);
      throw error;
    }
  }

  // Touch / programmatic button press — delegates directly to Nostalgist
  pressButton(button: string): void {
    if (!nostalgistInstance) return;
    try {
      nostalgistInstance.pressDown(button);
    } catch {
      // Ignore unrecognised button names
    }
  }

  releaseButton(button: string): void {
    if (!nostalgistInstance) return;
    try {
      nostalgistInstance.pressUp(button);
    } catch {
      // Ignore
    }
  }

  pause(): void {
    if (!nostalgistInstance) return;
    nostalgistInstance.pause();
    useEmulatorStore.getState().setStatus('paused');
  }

  resume(): void {
    if (!nostalgistInstance) return;
    nostalgistInstance.resume();
    useEmulatorStore.getState().setStatus('running');
  }

  reset(): void {
    nostalgistInstance?.restart();
  }

  async saveState(): Promise<{ state: Blob; thumbnail?: Blob } | null> {
    if (!nostalgistInstance) return null;
    try {
      return await nostalgistInstance.saveState();
    } catch (error) {
      console.error('Failed to save state:', error);
      return null;
    }
  }

  async loadState(stateData: Blob): Promise<void> {
    if (!nostalgistInstance) return;
    await nostalgistInstance.loadState(stateData);
  }

  getCanvas(): HTMLCanvasElement | null {
    try {
      return nostalgistInstance?.getCanvas() ?? null;
    } catch {
      return null;
    }
  }

  async captureScreenshot(): Promise<Blob | null> {
    if (!nostalgistInstance) return null;
    try {
      return await nostalgistInstance.screenshot();
    } catch {
      return null;
    }
  }

  get isRunning(): boolean {
    return useEmulatorStore.getState().status === 'running';
  }

  get nostalgist(): Nostalgist | null {
    return nostalgistInstance;
  }

  destroy(): void {
    try {
      nostalgistInstance?.exit({ removeCanvas: true });
    } catch {
      // Ignore cleanup errors
    }
    nostalgistInstance = null;
    useEmulatorStore.getState().reset();
    EmulatorEngine._instance = null;
  }
}
