import type { CoreConfig, SystemType } from '@/types';

export const CORE_CONFIGS: Record<SystemType, CoreConfig> = {
  gb: { core: 'gambatte', system: 'gb', extensions: ['.gb'], nativeWidth: 160, nativeHeight: 144 },
  gbc: { core: 'gambatte', system: 'gbc', extensions: ['.gbc', '.gb'], nativeWidth: 160, nativeHeight: 144 },
  gba: { core: 'mgba', system: 'gba', extensions: ['.gba'], nativeWidth: 240, nativeHeight: 160 },
  nes: { core: 'nestopia', system: 'nes', extensions: ['.nes'], nativeWidth: 256, nativeHeight: 240 },
};

export const MAX_ROM_SIZES: Record<SystemType, number> = {
  gb: 2 * 1024 * 1024,
  gbc: 4 * 1024 * 1024,
  gba: 32 * 1024 * 1024,
  nes: 4 * 1024 * 1024,
};

export const ROM_MAGIC_BYTES: Record<SystemType, { offset: number; bytes: number[] }[]> = {
  gb: [{ offset: 0x104, bytes: [0xce, 0xed, 0x66, 0x66] }],
  gbc: [{ offset: 0x104, bytes: [0xce, 0xed, 0x66, 0x66] }],
  gba: [{ offset: 0x04, bytes: [0x24, 0xff, 0xae, 0x51] }],
  nes: [{ offset: 0x00, bytes: [0x4e, 0x45, 0x53, 0x1a] }],
};

export const SYSTEM_LABELS: Record<SystemType, string> = {
  gb: 'Game Boy',
  gbc: 'Game Boy Color',
  gba: 'Game Boy Advance',
  nes: 'NES',
};

export const SYSTEM_COLORS: Record<SystemType, string> = {
  gb: 'magenta',
  gbc: 'cyan',
  gba: 'blue',
  nes: 'error',
};

export const DEFAULT_KEYBOARD_MAP: Record<string, string> = {
  z: 'a',
  x: 'b',
  a: 'y',
  s: 'x',
  Enter: 'start',
  ShiftRight: 'select',
  ShiftLeft: 'select',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  q: 'l',
  w: 'r',
};

export const KEYBOARD_SHORTCUTS = {
  quickSave: 'F5',
  quickLoad: 'F8',
  rewind: 'r',
  fastForward: ' ', // Space
  fullscreen: 'f',
  quickMenu: 'Escape',
  screenshot: 'F12',
  mute: 'm',
  volumeUp: '=',
  volumeDown: '-',
  hudToggle: 'h',
} as const;

export const REWIND_CONFIGS: Record<SystemType, { maxMB: number; captureInterval: number }> = {
  gb: { maxMB: 15, captureInterval: 2 },
  gbc: { maxMB: 15, captureInterval: 2 },
  gba: { maxMB: 30, captureInterval: 4 },
  nes: { maxMB: 10, captureInterval: 2 },
};

export const SAVE_SLOTS = 10;
export const MAX_ROMS_PER_USER = 50;
export const UPLOADS_PER_MINUTE = 10;
export const RA_POLL_INTERVAL_MS = 60000;
export const HUD_AUTO_HIDE_MS = 3000;
export const CLOUD_SYNC_DEBOUNCE_MS = 2000;
export const SEARCH_DEBOUNCE_MS = 300;
