import { CORE_CONFIGS, MAX_ROM_SIZES, ROM_MAGIC_BYTES } from '@/lib/constants';
import type { SystemType } from '@/types';

export function detectSystemFromExtension(filename: string): SystemType | null {
  const ext = '.' + filename.split('.').pop()?.toLowerCase();
  for (const [system, config] of Object.entries(CORE_CONFIGS)) {
    if (config.extensions.includes(ext)) {
      return system as SystemType;
    }
  }
  return null;
}

export async function validateROM(
  file: File,
  system: SystemType,
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  const maxSize = MAX_ROM_SIZES[system];
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Max ${(maxSize / 1024 / 1024).toFixed(0)} MB for ${system.toUpperCase()}.`,
    };
  }

  if (file.size < 100) {
    return { valid: false, error: 'File is too small to be a valid ROM.' };
  }

  // Check magic bytes
  const magicChecks = ROM_MAGIC_BYTES[system];
  const headerBuffer = await file.slice(0, 512).arrayBuffer();
  const headerView = new Uint8Array(headerBuffer);

  for (const check of magicChecks) {
    let matches = true;
    for (let i = 0; i < check.bytes.length; i++) {
      if (headerView[check.offset + i] !== check.bytes[i]) {
        matches = false;
        break;
      }
    }
    if (matches) return { valid: true };
  }

  return {
    valid: false,
    error: 'Invalid ROM file. Magic bytes do not match expected format.',
  };
}

export async function hashROM(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getSystemLabel(system: SystemType): string {
  const labels: Record<SystemType, string> = {
    gb: 'Game Boy',
    gbc: 'Game Boy Color',
    gba: 'Game Boy Advance',
    nes: 'NES',
  };
  return labels[system];
}
