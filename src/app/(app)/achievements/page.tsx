import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AchievementList } from '@/components/achievements/AchievementList';
import { Trophy } from 'lucide-react';

export default async function AchievementsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: achievements } = await supabase
    .from('achievements')
    .select('*, games(title, system)')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false, nullsFirst: false });

  const total = achievements?.length ?? 0;
  const unlocked = achievements?.filter(a => a.is_unlocked).length ?? 0;

  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-pixel text-h1 text-neon-magenta text-glow-magenta">ACHIEVEMENTS</h1>
        {total > 0 && (
          <div className="text-right">
            <p className="font-pixel text-h3 text-neon-cyan">{unlocked}/{total}</p>
            <p className="font-mono text-micro text-text-tertiary">UNLOCKED</p>
          </div>
        )}
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Trophy size={48} className="text-text-tertiary mb-4" />
          <p className="font-pixel text-h3 text-text-tertiary mb-2">CHALLENGES AWAIT</p>
          <p className="text-text-secondary text-body-sm">Connect RetroAchievements in Settings to track your progress.</p>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mb-8">
            <div className="bg-surface-3 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full transition-all duration-500" style={{ width: `${(unlocked / total) * 100}%` }} />
            </div>
            <p className="font-mono text-caption text-text-tertiary mt-1">{Math.round((unlocked / total) * 100)}% complete</p>
          </div>

          <AchievementList achievements={achievements ?? []} />
        </>
      )}
    </div>
  );
}
