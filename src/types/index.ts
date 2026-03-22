// System & Core types
export type SystemType = 'gb' | 'gbc' | 'gba' | 'nes';
export type CoreType = 'gambatte' | 'mgba' | 'nestopia';
export type GameSource = 'bundled' | 'uploaded';
export type ShaderType = 'none' | 'crt' | 'lcd' | 'sharp' | 'smooth';
export type CheatType = 'gameshark' | 'gamegenie' | 'action_replay';

export interface CoreConfig {
  core: CoreType;
  system: SystemType;
  extensions: string[];
  nativeWidth: number;
  nativeHeight: number;
}

export interface GameMeta {
  id: string;
  userId: string;
  title: string;
  system: SystemType;
  fileHash: string;
  fileSizeBytes: number;
  source: GameSource;
  coverArtUrl: string | null;
  dominantColor: string | null; // For progressive image loading
  genre: string | null;
  developer: string | null;
  releaseYear: number | null;
  romStoragePath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveState {
  id: string;
  userId: string;
  gameId: string;
  slotNumber: number;
  thumbnailPath: string | null;
  stateDataPath: string;
  stateSizeBytes: number;
  coreName: CoreType;
  coreVersion: string | null;
  description: string | null;
  isAutoSave: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaySession {
  id: string;
  userId: string;
  gameId: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number;
  lastSaveStateId: string | null;
}

export interface Achievement {
  id: string;
  userId: string;
  gameId: string;
  raAchievementId: number;
  title: string;
  description: string | null;
  badgeUrl: string | null;
  points: number;
  rarity: 'common' | 'rare' | 'legendary';
  unlockedAt: string | null;
  isUnlocked: boolean;
}

export interface Screenshot {
  id: string;
  userId: string;
  gameId: string;
  imagePath: string;
  thumbnailPath: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface CheatCode {
  id: string;
  gameId: string;
  userId: string;
  name: string;
  code: string;
  codeType: CheatType;
  isEnabled: boolean;
  createdAt: string;
}

export interface UserSettings {
  video: VideoSettings;
  audio: AudioSettings;
  controls: ControlsSettings;
  ui: UIPreferences;
  cloudSync: CloudSyncSettings;
  retroachievements: RASettings;
}

export interface VideoSettings {
  shaderType: ShaderType;
  scanlineIntensity: number;
  crtFlicker: boolean;
  aspectRatio: 'original' | 'stretch' | '4:3' | '16:9';
  integerScaling: boolean;
  oledMode: boolean;
}

export interface AudioSettings {
  masterVolume: number;
  isMuted: boolean;
  ambientAudio: boolean;
  audioLatencyTarget: number;
  uiSounds: boolean;
}

export interface ControlsSettings {
  keyboardMapping: Record<string, string>;
  touchControlLayout: TouchLayoutConfig;
  touchControlOpacity: number;
  touchControlSize: 'small' | 'medium' | 'large';
  hapticFeedback: boolean;
  gamepadDeadzone: number;
  oneHandedMode: 'off' | 'left' | 'right';
  turboButtons: Record<string, boolean>;
}

export interface TouchLayoutConfig {
  dpadPosition: { x: number; y: number };
  actionPosition: { x: number; y: number };
  shoulderPosition: { x: number; y: number };
  metaPosition: { x: number; y: number };
  scale: number;
}

export interface UIPreferences {
  sidebarCollapsed: boolean;
  defaultView: 'grid' | 'list';
  defaultSort: 'title' | 'system' | 'last_played' | 'added';
}

export interface CloudSyncSettings {
  enabled: boolean;
  autoSaveInterval: number;
}

export interface RASettings {
  connected: boolean;
  username: string;
  hardcoreMode: boolean;
}

// Input types
export type RetroButton =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'a'
  | 'b'
  | 'x'
  | 'y'
  | 'l'
  | 'r'
  | 'start'
  | 'select';

export interface InputState {
  buttons: Record<RetroButton, boolean>;
  turbo: Record<RetroButton, boolean>;
}

// Emulator types
export type EmulatorStatus = 'idle' | 'loading' | 'running' | 'paused' | 'error';

// Toast types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'achievement';
  title: string;
  description?: string;
  duration?: number;
}
