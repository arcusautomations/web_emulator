import { SettingsClient } from '@/components/settings/SettingsClient';

export default function SettingsPage() {
  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      <h1 className="font-pixel text-h1 text-neon-cyan text-glow-cyan mb-6">SETTINGS</h1>
      <SettingsClient />
    </div>
  );
}
