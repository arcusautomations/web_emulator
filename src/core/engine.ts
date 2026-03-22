import { Nostalgist } from 'nostalgist';
import { CORE_CONFIGS } from '@/lib/constants';
import { useEmulatorStore } from '@/lib/stores/emulator-store';
import type { SystemType, GameMeta, CoreConfig } from '@/types';
import { AudioPipeline } from './audio-pipeline';
import { InputManager } from './input-manager';

// Suppress unused import warnings — CoreConfig and SystemType used in type positions
type _CoreConfig = CoreConfig;
type _SystemType = SystemType;

// Module-scoped singleton — NOT in Zustand (non-serializable)
let nostalgistInstance: Nostalgist | null = null;
let audioPipeline: AudioPipeline | null = null;
let inputManager: InputManager | null = null;
let watchdogInterval: ReturnType<typeof setInterval> | null = null;

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

      // Initialize input manager — merge user key mapping with defaults
      const { useSettingsStore } = await import('@/lib/stores/settings-store');
      const settings = useSettingsStore.getState().settings;
      const effectiveKeyMap =
        Object.keys(settings.controls.keyboardMapping).length > 0
          ? settings.controls.keyboardMapping
          : undefined;

      inputManager = new InputManager(effectiveKeyMap, settings.controls.gamepadDeadzone);
      inputManager.start();

      // Launch Nostalgist with the ROM
      // Pass a File so Nostalgist can infer the filename/extension for the core
      const romFile = new File([romData], `rom${config.extensions[0]}`, {
        type: 'application/octet-stream',
      });

      nostalgistInstance = await Nostalgist.launch({
        core: config.core,
        rom: romFile,
        element: canvas,
        size: 'auto',
      });

      // Handle WebGL context loss (critical for iOS Safari)
      canvas.addEventListener('webglcontextlost', this.handleContextLost);
      canvas.addEventListener('webglcontextrestored', this.handleContextRestored);

      // Start watchdog timer
      this.startWatchdog();

      store.setStatus('running');
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to initialize emulator');
      throw error;
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

  async saveState(): Promise<ArrayBuffer | null> {
    if (!nostalgistInstance) return null;
    try {
      // Nostalgist.saveState() returns { state: Blob, thumbnail: Blob | undefined }
      const { state } = await nostalgistInstance.saveState();
      return state.arrayBuffer();
    } catch (error) {
      console.error('Failed to save state:', error);
      return null;
    }
  }

  async loadState(stateData: ArrayBuffer): Promise<void> {
    if (!nostalgistInstance) return;
    try {
      // Nostalgist.loadState() accepts a Blob (ResolvableFileInput)
      const stateBlob = new Blob([stateData]);
      await nostalgistInstance.loadState(stateBlob);
    } catch (error) {
      console.error('Failed to load state:', error);
      throw error;
    }
  }

  setSpeed(multiplier: 1 | 2 | 4): void {
    if (!nostalgistInstance) return;

    // FAST_FORWARD toggles fast-forward in RetroArch
    if (multiplier > 1) {
      nostalgistInstance.sendCommand('FAST_FORWARD');
    } else {
      // Sending FAST_FORWARD again toggles it off if it was on
      const store = useEmulatorStore.getState();
      if (store.speed > 1) {
        nostalgistInstance.sendCommand('FAST_FORWARD');
      }
    }

    useEmulatorStore.getState().setSpeed(multiplier);

    // Mute audio during fast-forward to avoid distortion
    if (audioPipeline) {
      if (multiplier > 1) {
        audioPipeline.setVolume(0);
      } else {
        // Restore volume from settings synchronously
        import('@/lib/stores/settings-store').then(({ useSettingsStore }) => {
          const s = useSettingsStore.getState().settings;
          audioPipeline?.setVolume(s.audio.isMuted ? 0 : s.audio.masterVolume);
        });
      }
    }
  }

  getCanvas(): HTMLCanvasElement | null {
    if (!nostalgistInstance) return null;
    try {
      return nostalgistInstance.getCanvas();
    } catch {
      return null;
    }
  }

  async captureScreenshot(): Promise<Blob | null> {
    if (!nostalgistInstance) return null;
    try {
      // Use Nostalgist's native screenshot API
      return await nostalgistInstance.screenshot();
    } catch {
      // Fall back to canvas.toBlob if native screenshot fails
      const canvas = this.getCanvas();
      if (!canvas) return null;
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });
    }
  }

  private handleContextLost = (e: Event): void => {
    e.preventDefault();
    console.warn('WebGL context lost — auto-saving state');
    // Emergency save
    this.saveState().then((state) => {
      if (state) {
        // Store in sessionStorage as base64 for recovery
        try {
          const base64 = btoa(String.fromCharCode(...new Uint8Array(state)));
          sessionStorage.setItem('arcadium_emergency_save', base64);
        } catch {
          // sessionStorage might be full or encoding might fail for large states
          console.warn('Emergency save to sessionStorage failed');
        }
      }
    });
    useEmulatorStore.getState().setStatus('paused');
  };

  private handleContextRestored = (): void => {
    console.log('WebGL context restored — attempting recovery');
    const saved = sessionStorage.getItem('arcadium_emergency_save');
    if (saved) {
      try {
        const bytes = Uint8Array.from(atob(saved), (c) => c.charCodeAt(0));
        this.loadState(bytes.buffer).catch((err) => {
          console.error('Failed to restore emergency save:', err);
        });
        sessionStorage.removeItem('arcadium_emergency_save');
      } catch {
        console.error('Failed to decode emergency save');
      }
    }
    useEmulatorStore.getState().setStatus('running');
  };

  private startWatchdog(): void {
    if (watchdogInterval) clearInterval(watchdogInterval);

    watchdogInterval = setInterval(() => {
      const store = useEmulatorStore.getState();
      if (store.status !== 'running') return;

      // Verify the Nostalgist instance is still healthy
      if (!nostalgistInstance) {
        console.warn('Watchdog: nostalgist instance unexpectedly null');
        store.setStatus('error');
        store.setError('Emulator instance lost');
        return;
      }

      const status = nostalgistInstance.getStatus();
      if (status === 'terminated') {
        console.warn('Watchdog: emulator terminated unexpectedly');
        store.setStatus('error');
        store.setError('Emulator terminated unexpectedly');
      }
    }, 2000);
  }

  destroy(): void {
    if (watchdogInterval) {
      clearInterval(watchdogInterval);
      watchdogInterval = null;
    }

    const canvas = this.getCanvas();
    if (canvas) {
      canvas.removeEventListener('webglcontextlost', this.handleContextLost);
      canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);
    }

    inputManager?.stop();
    inputManager = null;

    audioPipeline?.destroy();
    audioPipeline = null;

    if (nostalgistInstance) {
      try {
        nostalgistInstance.exit({ removeCanvas: false });
      } catch {
        // Ignore errors on exit — emulator may already be terminated
      }
      nostalgistInstance = null;
    }

    useEmulatorStore.getState().reset();
    EmulatorEngine._instance = null;
  }

  // Accessors for subsystems
  get audio(): AudioPipeline | null {
    return audioPipeline;
  }

  get input(): InputManager | null {
    return inputManager;
  }

  get isRunning(): boolean {
    return useEmulatorStore.getState().status === 'running';
  }
}
