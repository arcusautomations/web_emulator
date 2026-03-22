import { Nostalgist } from 'nostalgist';
import { CORE_CONFIGS } from '@/lib/constants';
import { useEmulatorStore } from '@/lib/stores/emulator-store';
import type { SystemType, GameMeta } from '@/types';
import { AudioPipeline } from './audio-pipeline';

// Suppress unused import warning — SystemType used in type position only
type _SystemType = SystemType;

// Module-scoped singleton — NOT in Zustand (non-serializable)
let nostalgistInstance: Nostalgist | null = null;
let audioPipeline: AudioPipeline | null = null;

export class EmulatorEngine {
  private static _instance: EmulatorEngine | null = null;

  static get instance(): EmulatorEngine {
    if (!EmulatorEngine._instance) {
      EmulatorEngine._instance = new EmulatorEngine();
    }
    return EmulatorEngine._instance;
  }

  async init(canvas: HTMLCanvasElement, game: GameMeta, romData: ArrayBuffer): Promise<void> {
    const store = useEmulatorStore.getState();
    store.setStatus('loading');
    store.setCurrentGame(game);

    try {
      const config = CORE_CONFIGS[game.system];
      store.setCurrentCore(config.core);

      // Initialize audio pipeline
      audioPipeline = new AudioPipeline();

      // Create ROM file from buffer so Nostalgist can infer the extension
      const romFile = new File([romData], `game${config.extensions[0]}`, {
        type: 'application/octet-stream',
      });

      // Launch Nostalgist with a 30-second timeout.
      // Nostalgist handles its own rendering loop, audio output, and keyboard input.
      // For touch/programmatic input we call pressDown/pressUp on the instance.
      const launchPromise = Nostalgist.launch({
        core: config.core,
        rom: romFile,
        element: canvas,
        size: { width: config.nativeWidth, height: config.nativeHeight },
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Emulator initialization timed out. Please try again.')),
          30000,
        );
      });

      nostalgistInstance = await Promise.race([launchPromise, timeoutPromise]);

      // Handle WebGL context loss (critical on iOS Safari)
      canvas.addEventListener('webglcontextlost', this.handleContextLost);
      canvas.addEventListener('webglcontextrestored', this.handleContextRestored);

      store.setStatus('running');
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to initialize emulator');
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
    nostalgistInstance?.pause();
    useEmulatorStore.getState().setStatus('paused');
  }

  resume(): void {
    nostalgistInstance?.resume();
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
    try {
      await nostalgistInstance.loadState(stateData);
    } catch (error) {
      console.error('Failed to load state:', error);
      throw error;
    }
  }

  getCanvas(): HTMLCanvasElement | null {
    try {
      return nostalgistInstance?.getCanvas() ?? null;
    } catch {
      return null;
    }
  }

  async captureScreenshot(): Promise<Blob | null> {
    const canvas = this.getCanvas();
    if (!canvas) return null;
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }

  private handleContextLost = (e: Event): void => {
    e.preventDefault();
    console.warn('WebGL context lost');
    useEmulatorStore.getState().setStatus('paused');
  };

  private handleContextRestored = (): void => {
    console.log('WebGL context restored');
    useEmulatorStore.getState().setStatus('running');
  };

  get audio(): AudioPipeline | null {
    return audioPipeline;
  }

  get isRunning(): boolean {
    return useEmulatorStore.getState().status === 'running';
  }

  get nostalgist(): Nostalgist | null {
    return nostalgistInstance;
  }

  destroy(): void {
    const canvas = this.getCanvas();
    if (canvas) {
      canvas.removeEventListener('webglcontextlost', this.handleContextLost);
      canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);
    }

    audioPipeline?.destroy();
    audioPipeline = null;

    try {
      nostalgistInstance?.exit();
    } catch {
      // Ignore cleanup errors
    }
    nostalgistInstance = null;

    useEmulatorStore.getState().reset();
    EmulatorEngine._instance = null;
  }
}
