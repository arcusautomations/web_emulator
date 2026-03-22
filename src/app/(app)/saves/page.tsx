import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SaveSlotGrid } from '@/components/saves/SaveSlotGrid';

export default async function SavesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: saves } = await supabase
    .from('save_states')
    .select('*, games(title, system, cover_art_url)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      <h1 className="font-pixel text-h1 text-neon-cyan text-glow-cyan mb-6">SAVE STATES</h1>
      <SaveSlotGrid saves={saves ?? []} />
    </div>
  );
}
