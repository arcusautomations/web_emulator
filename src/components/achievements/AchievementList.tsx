'use client';

import { motion } from 'framer-motion';
import { listContainerVariants, listItemVariants } from '@/lib/animation-variants';
import { Badge } from '@/components/ui/Badge';
import { Lock, Star } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format-utils';

interface Props {
  achievements: any[];
}

export function AchievementList({ achievements }: Props) {
  return (
    <motion.div variants={listContainerVariants} initial="hidden" animate="visible" className="space-y-3">
      {achievements.map((a, i) => (
        <motion.div key={a.id} variants={i < 12 ? listItemVariants : undefined} className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
          a.is_unlocked
            ? 'bg-surface-1 border-neon-magenta/30 shadow-glow-sm-magenta'
            : 'bg-surface-1/50 border-surface-3 opacity-70'
        }`}>
          {/* Badge icon */}
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            a.is_unlocked ? 'bg-neon-magenta/10' : 'bg-surface-2 grayscale'
          }`}>
            {a.badge_url ? (
              <img src={a.badge_url} alt="" className={`w-10 h-10 ${!a.is_unlocked ? 'grayscale opacity-50' : ''}`} />
            ) : (
              a.is_unlocked ? <Star size={24} className="text-neon-magenta" /> : <Lock size={24} className="text-text-tertiary" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`font-pixel text-h4 ${a.is_unlocked ? 'text-text-primary' : 'text-text-secondary'}`}>{a.title}</p>
              {a.rarity && <Badge variant={`rarity-${a.rarity}` as any}>{a.rarity.toUpperCase()}</Badge>}
            </div>
            <p className="text-text-secondary text-body-sm mt-0.5">{a.description}</p>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="system">{a.games?.system?.toUpperCase()}</Badge>
              <span className="font-pixel text-micro text-neon-cyan">{a.points} PTS</span>
              {a.is_unlocked && a.unlocked_at && (
                <span className="font-mono text-micro text-text-tertiary">{formatRelativeTime(a.unlocked_at)}</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
