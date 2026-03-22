import type { CheatType } from '@/types';

interface ParsedCheat {
  id: string;
  name: string;
  code: string;
  codeType: CheatType;
  isEnabled: boolean;
  // Parsed memory patches
  patches: { address: number; value: number }[];
}

export class CheatEngine {
  private cheats: Map<string, ParsedCheat> = new Map();

  addCheat(name: string, code: string, codeType: CheatType): string {
    const id = crypto.randomUUID();
    const patches = this.parseCode(code, codeType);
    const cheat: ParsedCheat = { id, name, code, codeType, isEnabled: false, patches };
    this.cheats.set(id, cheat);
    return id;
  }

  removeCheat(id: string): void {
    this.cheats.delete(id);
  }

  toggleCheat(id: string): boolean {
    const cheat = this.cheats.get(id);
    if (!cheat) return false;
    cheat.isEnabled = !cheat.isEnabled;
    return cheat.isEnabled;
  }

  getActiveCheats(): ParsedCheat[] {
    return Array.from(this.cheats.values()).filter((c) => c.isEnabled);
  }

  getAllCheats(): ParsedCheat[] {
    return Array.from(this.cheats.values());
  }

  clearAll(): void {
    this.cheats.clear();
  }

  private parseCode(
    code: string,
    type: CheatType,
  ): { address: number; value: number }[] {
    const cleaned = code.replace(/[\s-]/g, '').toUpperCase();

    switch (type) {
      case 'gameshark':
        return this.parseGameShark(cleaned);
      case 'gamegenie':
        return this.parseGameGenie(cleaned);
      case 'action_replay':
        return this.parseActionReplay(cleaned);
      default:
        return [];
    }
  }

  // GameShark format: XXXXXXXX (8 hex digits)
  // First byte = code type, next 3 bytes = address, last 2 bytes = value
  private parseGameShark(code: string): { address: number; value: number }[] {
    const patches: { address: number; value: number }[] = [];
    // Split into 8-character chunks
    for (let i = 0; i < code.length; i += 8) {
      const chunk = code.slice(i, i + 8);
      if (chunk.length === 8) {
        const address = parseInt(chunk.slice(2, 6), 16);
        const value = parseInt(chunk.slice(6, 8), 16);
        if (!isNaN(address) && !isNaN(value)) {
          patches.push({ address, value });
        }
      }
    }
    return patches;
  }

  // Game Genie format varies by system
  // NES: 6 or 8 character codes (AAEAULPA format)
  // For now, store as raw — RetroArch cores handle the actual decoding
  private parseGameGenie(_code: string): { address: number; value: number }[] {
    return [];
  }

  // Action Replay: similar to GameShark but different header format
  private parseActionReplay(code: string): { address: number; value: number }[] {
    return this.parseGameShark(code); // Same base format for most systems
  }
}
