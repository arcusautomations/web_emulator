import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SettingsClient } from '@/components/settings/SettingsClient';

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      <h1 className="font-pixel text-h1 text-neon-cyan text-glow-cyan mb-6">SETTINGS</h1>
      <SettingsClient user={user ?? undefined} />
    </div>
  );
}
