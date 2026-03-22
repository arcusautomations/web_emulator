import { REWIND_CONFIGS } from '@/lib/constants';
import type { SystemType } from '@/types';

export class RewindBuffer {
  private buffer: (ArrayBuffer | null)[];
  private size = 0;
  private writeHead = 0;
  readonly maxFrames: number;
  readonly captureInterval: number;

  constructor(
    system: SystemType,
    bufferSeconds = 10,
    fps = 60,
  ) {
    const config = REWIND_CONFIGS[system];
    this.captureInterval = config.captureInterval;
    this.maxFrames = Math.ceil((bufferSeconds * fps) / this.captureInterval);
    this.buffer = new Array(this.maxFrames).fill(null);
  }

  push(stateData: ArrayBuffer): void {
    this.buffer[this.writeHead] = stateData;
    this.writeHead = (this.writeHead + 1) % this.buffer.length;
    if (this.size < this.buffer.length) this.size++;
  }

  pop(): ArrayBuffer | null {
    if (this.size === 0) return null;
    this.writeHead = (this.writeHead - 1 + this.buffer.length) % this.buffer.length;
    const state = this.buffer[this.writeHead];
    this.buffer[this.writeHead] = null;
    this.size--;
    return state;
  }

  clear(): void {
    this.buffer.fill(null);
    this.size = 0;
    this.writeHead = 0;
  }

  get length(): number {
    return this.size;
  }

  get isEmpty(): boolean {
    return this.size === 0;
  }

  get memoryUsageMB(): number {
    return this.buffer.reduce((sum, s) => sum + (s?.byteLength ?? 0), 0) / (1024 * 1024);
  }

  get capacityPercent(): number {
    return (this.size / this.maxFrames) * 100;
  }
}
