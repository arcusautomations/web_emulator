import { Suspense } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GameGrid } from '@/components/library/GameGrid';
import { GameFilters } from '@/components/library/GameFilters';
import { ContinuePlaying } from '@/components/library/ContinuePlaying';
import { ROMUploader } from '@/components/library/ROMUploader';
import { AddGameSection } from '@/components/library/AddGameSection';
import { Skeleton } from '@/components/ui/Skeleton';

interface Props {
  searchParams: Promise<{
    system?: string;
    sort?: string;
    q?: string;
    view?: string;
  }>;
}

async function fetchLibraryData(searchParams: { system?: string; sort?: string; q?: string }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Parallel data fetching
  let gamesQuery = supabase
    .from('games')
    .select('*')
    .or(`user_id.eq.${user.id},source.eq.bundled`);

  if (searchParams.system && searchParams.system !== 'all') {
    gamesQuery = gamesQuery.eq('system', searchParams.system);
  }
  if (searchParams.q) {
    gamesQuery = gamesQuery.ilike('title', `%${searchParams.q}%`);
  }

  const sortField = searchParams.sort === 'title' ? 'title' : searchParams.sort === 'system' ? 'system' : 'created_at';
  const sortAsc = searchParams.sort === 'title' || searchParams.sort === 'system';
  gamesQuery = gamesQuery.order(sortField, { ascending: sortAsc });

  const [
    { data: games },
    { data: favorites },
    { data: recentSessions },
  ] = await Promise.all([
    gamesQuery,
    supabase.from('favorites').select('game_id').eq('user_id', user.id),
    supabase
      .from('play_sessions')
      .select('game_id, started_at, games(*)')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(3),
  ]);

  const favoriteIds = new Set((favorites ?? []).map(f => f.game_id));
  const recentGames = (recentSessions ?? [])
    .filter(s => s.games)
    .map(s => ({ ...s.games, lastPlayed: s.started_at }));

  return {
    games: games ?? [],
    favoriteIds,
    recentGames,
  };
}

export default async function LibraryPage({ searchParams }: Props) {
  const params = await searchParams;
  const { games, favoriteIds, recentGames } = await fetchLibraryData(params);

  // Empty state — show ROMUploader as hero
  if (games.length === 0) {
    return (
      <div className="p-4 lg:p-8 pb-16 lg:pb-8">
        <h1 className="font-pixel text-h1 text-neon-cyan text-glow-cyan mb-8">LIBRARY</h1>
        <div className="max-w-lg mx-auto">
          <p className="font-pixel text-h4 text-text-secondary text-center mb-6">
            NO GAMES YET — ADD YOUR FIRST ROM
          </p>
          <ROMUploader />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 pb-16 lg:pb-8">
      {/* Continue Playing */}
      {recentGames.length > 0 && (
        <section className="mb-8">
          <h2 className="font-pixel text-h4 sm:text-h3 text-neon-cyan mb-4">CONTINUE PLAYING</h2>
          <ContinuePlaying games={recentGames} />
        </section>
      )}

      {/* Filters */}
      <GameFilters
        currentSystem={params.system}
        currentSort={params.sort}
        currentQuery={params.q}
        currentView={params.view}
      />

      {/* Collapsible ADD GAME section */}
      <div className="mt-4">
        <AddGameSection />
      </div>

      {/* Game Grid */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-h4 sm:text-h3 text-text-primary">
            ALL GAMES <span className="text-text-tertiary">({games.length})</span>
          </h2>
        </div>
        <Suspense fallback={<GameGridSkeleton />}>
          <GameGrid games={games} favoriteIds={favoriteIds} view={params.view || 'grid'} />
        </Suspense>
      </section>
    </div>
  );
}

function GameGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
      ))}
    </div>
  );
}
