import { create } from 'zustand';
import type { EmulatorStatus, GameMeta, CoreType } from '@/types';

interface EmulatorState {
  status: EmulatorStatus;
  currentGame: GameMeta | null;
  currentCore: CoreType | null;
  speed: 1 | 2 | 4;
  isRewinding: boolean;
  fps: number;
  errorMessage: string | null;

  setStatus: (status: EmulatorStatus) => void;
  setCurrentGame: (game: GameMeta | null) => void;
  setCurrentCore: (core: CoreType | null) => void;
  setSpeed: (speed: 1 | 2 | 4) => void;
  setRewinding: (rewinding: boolean) => void;
  setFps: (fps: number) => void;
  setError: (message: string | null) => void;
  reset: () => void;
}

const initialState = {
  status: 'idle' as EmulatorStatus,
  currentGame: null as GameMeta | null,
  currentCore: null as CoreType | null,
  speed: 1 as 1 | 2 | 4,
  isRewinding: false,
  fps: 0,
  errorMessage: null as string | null,
};

export const useEmulatorStore = create<EmulatorState>((set) => ({
  ...initialState,
  setStatus: (status) => set({ status }),
  setCurrentGame: (game) => set({ currentGame: game }),
  setCurrentCore: (core) => set({ currentCore: core }),
  setSpeed: (speed) => set({ speed }),
  setRewinding: (rewinding) => set({ isRewinding: rewinding }),
  setFps: (fps) => set({ fps }),
  setError: (message) => set({ errorMessage: message, status: message ? 'error' : 'idle' }),
  reset: () => set(initialState),
}));
