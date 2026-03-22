'use client';

import { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { Toggle } from '@/components/ui/Toggle';
import { Slider } from '@/components/ui/Slider';
import { Select } from '@/components/ui/Select';
import { signOut } from '@/app/(app)/actions';

const TABS = [
  { id: 'display', label: 'DISPLAY' },
  { id: 'audio', label: 'AUDIO' },
  { id: 'controls', label: 'CONTROLS' },
  { id: 'cloud', label: 'CLOUD' },
  { id: 'account', label: 'ACCOUNT' },
];

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState('display');
  const settings = useSettingsStore((s) => s.settings);
  const updateVideo = useSettingsStore((s) => s.updateVideo);
  const updateAudio = useSettingsStore((s) => s.updateAudio);
  const updateControls = useSettingsStore((s) => s.updateControls);
  const updateCloudSync = useSettingsStore((s) => s.updateCloudSync);

  return (
    <div>
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6 space-y-6">
        {activeTab === 'display' && (
          <div className="space-y-6">
            <SettingRow label="Shader" description="Visual filter applied to the game display">
              <Select
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'crt', label: 'CRT' },
                  { value: 'lcd', label: 'LCD Grid' },
                  { value: 'sharp', label: 'Sharp Pixels' },
                  { value: 'smooth', label: 'Smooth' },
                ]}
                value={settings.video.shaderType}
                onChange={(v) => updateVideo({ shaderType: v as any })}
              />
            </SettingRow>
            <SettingRow label="Scanline Intensity" description="Strength of CRT scanline effect">
              <Slider value={settings.video.scanlineIntensity} onChange={(v) => updateVideo({ scanlineIntensity: v })} min={0} max={1} step={0.01} showValue />
            </SettingRow>
            <SettingRow label="Integer Scaling" description="Pixel-perfect display without blur">
              <Toggle checked={settings.video.integerScaling} onChange={(v) => updateVideo({ integerScaling: v })} />
            </SettingRow>
            <SettingRow label="OLED Black Mode" description="True black backgrounds for OLED screens">
              <Toggle checked={settings.video.oledMode} onChange={(v) => {
                updateVideo({ oledMode: v });
                document.documentElement.classList.toggle('oled-mode', v);
              }} />
            </SettingRow>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-6">
            <SettingRow label="Master Volume">
              <Slider value={settings.audio.masterVolume} onChange={(v) => updateAudio({ masterVolume: v })} min={0} max={1} step={0.01} showValue />
            </SettingRow>
            <SettingRow label="Mute">
              <Toggle checked={settings.audio.isMuted} onChange={(v) => updateAudio({ isMuted: v })} />
            </SettingRow>
            <SettingRow label="UI Sounds" description="Play sounds for menu interactions">
              <Toggle checked={settings.audio.uiSounds} onChange={(v) => updateAudio({ uiSounds: v })} />
            </SettingRow>
            <SettingRow label="Ambient Audio" description="Subtle background music on library page">
              <Toggle checked={settings.audio.ambientAudio} onChange={(v) => updateAudio({ ambientAudio: v })} />
            </SettingRow>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="space-y-6">
            <SettingRow label="Touch Control Size">
              <Select
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
                value={settings.controls.touchControlSize}
                onChange={(v) => updateControls({ touchControlSize: v as any })}
              />
            </SettingRow>
            <SettingRow label="Touch Opacity">
              <Slider value={settings.controls.touchControlOpacity} onChange={(v) => updateControls({ touchControlOpacity: v })} min={0.1} max={0.8} step={0.05} showValue />
            </SettingRow>
            <SettingRow label="Haptic Feedback" description="Vibration on button press (Android)">
              <Toggle checked={settings.controls.hapticFeedback} onChange={(v) => updateControls({ hapticFeedback: v })} />
            </SettingRow>
            <SettingRow label="Gamepad Deadzone">
              <Slider value={settings.controls.gamepadDeadzone} onChange={(v) => updateControls({ gamepadDeadzone: v })} min={0.05} max={0.5} step={0.01} showValue />
            </SettingRow>
          </div>
        )}

        {activeTab === 'cloud' && (
          <div className="space-y-6">
            <SettingRow label="Cloud Sync" description="Sync save states across devices">
              <Toggle checked={settings.cloudSync.enabled} onChange={(v) => updateCloudSync({ enabled: v })} />
            </SettingRow>
            <SettingRow label="Auto-Save Interval" description="Seconds between auto-saves (0 = disabled)">
              <Slider value={settings.cloudSync.autoSaveInterval} onChange={(v) => updateCloudSync({ autoSaveInterval: v })} min={0} max={300} step={10} showValue />
            </SettingRow>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="bg-surface-1 border border-surface-3 rounded-lg p-5">
              <p className="font-pixel text-h4 text-text-primary mb-1">PLAYER ONE</p>
              <p className="text-text-secondary text-body-sm">player1@arcadium.local</p>
            </div>
            <form action={signOut}>
              <button type="submit" className="font-pixel text-h4 text-error hover:text-error-light transition-colors">
                LOG OUT
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="font-pixel text-h4 text-text-primary">{label}</p>
        {description && <p className="text-text-tertiary text-caption mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}
