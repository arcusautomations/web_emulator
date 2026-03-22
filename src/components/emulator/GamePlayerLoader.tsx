'use client';

/**
 * GamePlayerLoader — thin client boundary that performs the ssr:false dynamic
 * import of GamePlayerClient. `next/dynamic` with `ssr: false` is only allowed
 * in Client Components; this wrapper satisfies that constraint while keeping
 * the PlayPage RSC free of client-only APIs.
 */

import dynamic from 'next/dynamic';

const GamePlayerClient = dynamic(
  () => import('./GamePlayerClient').then((m) => ({ default: m.GamePlayerClient })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[100dvh] bg-void flex flex-col items-center justify-center">
        <div className="font-pixel text-h2 text-neon-cyan animate-neon-pulse mb-4">LOADING...</div>
        <div className="w-64 bg-surface-3 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full animate-pulse w-1/2" />
        </div>
      </div>
    ),
  },
);

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  game: any; // Supabase row passed straight through from the RSC
}

export function GamePlayerLoader({ game }: Props) {
  return <GamePlayerClient game={game} />;
}
