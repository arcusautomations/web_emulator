'use client';

import { motion } from 'framer-motion';
import { listContainerVariants, listItemVariants } from '@/lib/animation-variants';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: any[];
  favoriteIds: Set<string>;
  view: string;
}

export function GameGrid({ games, favoriteIds, view }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="font-pixel text-h2 text-text-tertiary mb-4">NO CARTRIDGES DETECTED</div>
        <p className="text-text-secondary text-body-sm max-w-md">
          Upload a ROM file to start playing, or check your filters.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={listContainerVariants}
      initial="hidden"
      animate="visible"
      className={
        view === 'list'
          ? 'flex flex-col gap-2'
          : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4'
      }
    >
      {games.map((game, index) => (
        <motion.div key={game.id} variants={index < 12 ? listItemVariants : undefined}>
          <GameCard
            game={game}
            isFavorite={favoriteIds.has(game.id)}
            variant={view === 'list' ? 'list' : 'grid'}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
