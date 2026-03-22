'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ContinuePlayingProps {
  games: any[];
}

export function ContinuePlaying({ games }: ContinuePlayingProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
      {games.map((game: any) => (
        <Link
          key={game.id}
          href={`/play/${game.id}`}
          className="flex-shrink-0 w-64 lg:w-80 group"
        >
          <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-1 border border-surface-3 group-hover:border-neon-cyan/30 group-hover:shadow-glow-sm-cyan transition-all">
            {game.cover_art_url && (
              <img
                src={game.cover_art_url}
                alt={game.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="font-pixel text-h4 text-text-primary truncate">{game.title}</p>
              <Badge variant="system" className="mt-1">{game.system?.toUpperCase()}</Badge>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-neon-cyan/20 rounded-full p-3 shadow-glow-md-cyan">
                <Play size={20} className="text-neon-cyan" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
