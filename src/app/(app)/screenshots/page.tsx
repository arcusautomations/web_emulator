import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ScreenshotGrid } from '@/components/screenshots/ScreenshotGrid';
import { Camera } from 'lucide-react';

export default async function ScreenshotsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: screenshots } = await supabase
    .from('screenshots')
    .select('*, games(title, system)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      <h1 className="font-pixel text-h1 text-electric-blue mb-6" style={{ textShadow: '0 0 4px #0096ff88, 0 0 12px #0096ff44' }}>SCREENSHOTS</h1>
      {(!screenshots || screenshots.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Camera size={48} className="text-text-tertiary mb-4" />
          <p className="font-pixel text-h3 text-text-tertiary mb-2">NO SCREENSHOTS YET</p>
          <p className="text-text-secondary text-body-sm">Press F12 during gameplay to capture.</p>
        </div>
      ) : (
        <ScreenshotGrid screenshots={screenshots} />
      )}
    </div>
  );
}
