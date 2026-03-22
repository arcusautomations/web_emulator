export class AudioPipeline {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isUnlocked = false;

  constructor() {
    this.initContext();
  }

  private initContext(): void {
    try {
      this.context = new AudioContext({
        sampleRate: 44100,
        latencyHint: 'interactive',
      });
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);

      // iOS Safari interruption recovery
      this.context.addEventListener('statechange', () => {
        if (
          this.context?.state === 'interrupted' ||
          this.context?.state === 'suspended'
        ) {
          const resume = () => {
            this.context?.resume();
            document.removeEventListener('touchstart', resume);
            document.removeEventListener('click', resume);
          };
          document.addEventListener('touchstart', resume, { once: true });
          document.addEventListener('click', resume, { once: true });
        }
      });
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }
  }

  async unlock(): Promise<void> {
    if (this.isUnlocked || !this.context) return;

    if (this.context.state === 'suspended') {
      // Play a silent buffer to unlock on iOS
      const buffer = this.context.createBuffer(1, 1, 44100);
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start();
      await this.context.resume();
    }
    this.isUnlocked = true;
  }

  setVolume(value: number): void {
    if (this.gainNode && this.context) {
      const clampedValue = Math.max(0, Math.min(1, value));
      this.gainNode.gain.setTargetAtTime(clampedValue, this.context.currentTime, 0.015);
    }
  }

  mute(): void {
    this.setVolume(0);
  }

  get audioContext(): AudioContext | null {
    return this.context;
  }

  destroy(): void {
    if (this.context) {
      this.context.close().catch(() => {});
      this.context = null;
      this.gainNode = null;
    }
  }
}
