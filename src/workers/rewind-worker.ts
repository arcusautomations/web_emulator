import { expose } from 'comlink';
// Use a relative import — the @/ alias may not resolve inside the worker bundle context
import { RewindBuffer } from '../core/rewind-buffer';
import type { SystemType } from '../types';

let buffer: RewindBuffer | null = null;

const api = {
  init(system: string, bufferSeconds?: number, fps?: number) {
    buffer = new RewindBuffer(system as SystemType, bufferSeconds, fps);
  },

  push(stateData: ArrayBuffer) {
    buffer?.push(stateData);
  },

  pop(): ArrayBuffer | null {
    return buffer?.pop() ?? null;
  },

  clear() {
    buffer?.clear();
  },

  getLength(): number {
    return buffer?.length ?? 0;
  },

  getMemoryUsage(): number {
    return buffer?.memoryUsageMB ?? 0;
  },

  getCapacityPercent(): number {
    return buffer?.capacityPercent ?? 0;
  },
};

expose(api);
