import { get, set, del } from 'idb-keyval';
import type { SystemType } from '@/types';

interface LocalSaveState {
  stateData: ArrayBuffer;
  thumbnail: Blob | null;
  timestamp: number;
  coreName: string;
  system: SystemType;
}

export class SaveManager {
  private static storageKey(gameId: string, slot: number): string {
    return `arcadium:save:${gameId}:${slot}`;
  }

  static async save(
    gameId: string,
    slot: number,
    stateData: ArrayBuffer,
    thumbnail: Blob | null,
    coreName: string,
    system: SystemType,
  ): Promise<void> {
    const key = this.storageKey(gameId, slot);
    const saveData: LocalSaveState = {
      stateData,
      thumbnail,
      timestamp: Date.now(),
      coreName,
      system,
    };
    await set(key, saveData);
  }

  static async load(gameId: string, slot: number): Promise<LocalSaveState | null> {
    const key = this.storageKey(gameId, slot);
    const data = await get<LocalSaveState>(key);
    return data ?? null;
  }

  static async delete(gameId: string, slot: number): Promise<void> {
    const key = this.storageKey(gameId, slot);
    await del(key);
  }

  static async listSlots(
    gameId: string,
  ): Promise<{ slot: number; timestamp: number; coreName: string }[]> {
    const slots: { slot: number; timestamp: number; coreName: string }[] = [];
    for (let i = 0; i < 10; i++) {
      const data = await get<LocalSaveState>(this.storageKey(gameId, i));
      if (data) {
        slots.push({ slot: i, timestamp: data.timestamp, coreName: data.coreName });
      }
    }
    return slots;
  }

  // Get thumbnail as object URL for display
  static async getThumbnailUrl(gameId: string, slot: number): Promise<string | null> {
    const data = await get<LocalSaveState>(this.storageKey(gameId, slot));
    if (data?.thumbnail) {
      return URL.createObjectURL(data.thumbnail);
    }
    return null;
  }
}
