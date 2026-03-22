'use client';

import { useOptimistic, useTransition } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Play } from 'lucide-react';
import { cardHoverVariants } from '@/lib/animation-variants';
import { springs } from '@/lib/animation-presets';
import { toggleFavorite } from '@/app/(app)/actions';
import { Badge } from '@/components/ui/Badge';
import type { SystemType } from '@/types';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    system: SystemType;
    cover_art_url: string | null;
    dominant_color: string | null;
    genre: string | null;
  };
  isFavorite: boolean;
  variant?: 'grid' | 'list';
}

export function GameCard({ game, isFavorite, variant = 'grid' }: GameCardProps) {
  const [optimisticFav, setOptimisticFav] = useOptimistic(isFavorite);
  const [, startTransition] = useTransition();

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticFav(!optimisticFav);
      await toggleFavorite(game.id);
    });
  }

  if (variant === 'list') {
    return (
      <Link href={`/play/${game.id}`}>
        <div className="flex items-center gap-4 bg-surface-1 border border-surface-3 rounded-lg p-3 hover:border-neon-cyan/30 hover:shadow-glow-sm-cyan transition-all">
          <div
            className="w-12 h-12 rounded-md flex-shrink-0 bg-surface-2"
            style={{ backgroundColor: game.dominant_color ?? undefined }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-pixel text-h4 text-text-primary truncate">{game.title}</p>
            <Badge variant="system" className="mt-1">{game.system.toUpperCase()}</Badge>
          </div>
          <button onClick={handleFavorite} className="p-2 hover:scale-110 transition-transform" aria-label={optimisticFav ? 'Remove from favorites' : 'Add to favorites'}>
            <Heart size={16} className={optimisticFav ? 'fill-error text-error' : 'text-text-tertiary'} />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/play/${game.id}`}>
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={springs.snap}
        className="bg-surface-1 border border-magenta-dim/30 rounded-lg overflow-hidden group cursor-pointer"
      >
        {/* Cover art */}
        <div className="aspect-[3/4] relative overflow-hidden" style={{ backgroundColor: game.dominant_color ?? '#140533' }}>
          {game.cover_art_url && (
            <img
              src={game.cover_art_url}
              alt={game.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-base/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="bg-neon-cyan/20 rounded-full p-4 shadow-glow-md-cyan">
              <Play size={24} className="text-neon-cyan" />
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-base/60 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            aria-label={optimisticFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={14} className={optimisticFav ? 'fill-error text-error' : 'text-white'} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="font-pixel text-h4 text-text-primary truncate leading-relaxed">{game.title}</p>
          <div className="mt-1.5">
            <Badge variant="system">{game.system.toUpperCase()}</Badge>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
