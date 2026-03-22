import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GameGrid } from '@/components/library/GameGrid';
import { Heart } from 'lucide-react';

export default async function FavoritesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: favorites } = await supabase
    .from('favorites')
    .select('game_id, games(*)')
    .eq('user_id', user.id);

  const games = (favorites ?? []).map(f => f.games).filter(Boolean);
  const favoriteIds = new Set(games.map((g: any) => g.id));

  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      <h1 className="font-pixel text-h1 text-neon-magenta text-glow-magenta mb-6">FAVORITES</h1>
      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={48} className="text-text-tertiary mb-4" />
          <p className="font-pixel text-h3 text-text-tertiary mb-2">NO FAVORITES YET</p>
          <p className="text-text-secondary text-body-sm">Heart a game in your library to see it here.</p>
        </div>
      ) : (
        <GameGrid games={games} favoriteIds={favoriteIds} view="grid" />
      )}
    </div>
  );
}
