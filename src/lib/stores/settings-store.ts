import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '@/types';

const defaultSettings: UserSettings = {
  video: {
    shaderType: 'crt',
    scanlineIntensity: 0.12,
    crtFlicker: false,
    aspectRatio: 'original',
    integerScaling: true,
    oledMode: false,
  },
  audio: {
    masterVolume: 0.8,
    isMuted: false,
    ambientAudio: true,
    audioLatencyTarget: 64,
    uiSounds: true,
  },
  controls: {
    keyboardMapping: {},
    touchControlLayout: {
      dpadPosition: { x: 0.08, y: 0.55 },
      actionPosition: { x: 0.75, y: 0.5 },
      shoulderPosition: { x: 0.5, y: 0.05 },
      metaPosition: { x: 0.45, y: 0.85 },
      scale: 1,
    },
    touchControlOpacity: 0.5,
    touchControlSize: 'medium',
    hapticFeedback: true,
    gamepadDeadzone: 0.15,
    oneHandedMode: 'off',
    turboButtons: {},
  },
  ui: {
    sidebarCollapsed: false,
    defaultView: 'grid',
    defaultSort: 'last_played',
  },
  cloudSync: {
    enabled: true,
    autoSaveInterval: 60,
  },
  retroachievements: {
    connected: false,
    username: '',
    hardcoreMode: false,
  },
};

interface SettingsStore {
  settings: UserSettings;
  updateVideo: (patch: Partial<UserSettings['video']>) => void;
  updateAudio: (patch: Partial<UserSettings['audio']>) => void;
  updateControls: (patch: Partial<UserSettings['controls']>) => void;
  updateUI: (patch: Partial<UserSettings['ui']>) => void;
  updateCloudSync: (patch: Partial<UserSettings['cloudSync']>) => void;
  updateRA: (patch: Partial<UserSettings['retroachievements']>) => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateVideo: (patch) =>
        set((s) => ({
          settings: { ...s.settings, video: { ...s.settings.video, ...patch } },
        })),
      updateAudio: (patch) =>
        set((s) => ({
          settings: { ...s.settings, audio: { ...s.settings.audio, ...patch } },
        })),
      updateControls: (patch) =>
        set((s) => ({
          settings: { ...s.settings, controls: { ...s.settings.controls, ...patch } },
        })),
      updateUI: (patch) =>
        set((s) => ({
          settings: { ...s.settings, ui: { ...s.settings.ui, ...patch } },
        })),
      updateCloudSync: (patch) =>
        set((s) => ({
          settings: { ...s.settings, cloudSync: { ...s.settings.cloudSync, ...patch } },
        })),
      updateRA: (patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            retroachievements: { ...s.settings.retroachievements, ...patch },
          },
        })),
      resetToDefaults: () => set({ settings: defaultSettings }),
    }),
    { name: 'arcadium-settings' }
  )
);
