'use client';

import { formatRelativeTime } from '@/lib/utils/format-utils';
import { Badge } from '@/components/ui/Badge';
import { Save, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { listContainerVariants, listItemVariants } from '@/lib/animation-variants';

interface Props {
  saves: any[];
}

export function SaveSlotGrid({ saves }: Props) {
  if (saves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Save size={48} className="text-text-tertiary mb-4" />
        <p className="font-pixel text-h3 text-text-tertiary mb-2">MEMORY CARD EMPTY</p>
        <p className="text-text-secondary text-body-sm">Your progress is waiting to be written.</p>
      </div>
    );
  }

  // Group by game
  const grouped = saves.reduce((acc: Record<string, any[]>, save: any) => {
    const gameTitle = save.games?.title ?? 'Unknown';
    if (!acc[gameTitle]) acc[gameTitle] = [];
    acc[gameTitle].push(save);
    return acc;
  }, {});

  return (
    <motion.div variants={listContainerVariants} initial="hidden" animate="visible" className="space-y-8">
      {Object.entries(grouped).map(([gameTitle, gameSaves]) => (
        <motion.div key={gameTitle} variants={listItemVariants}>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-pixel text-h3 text-text-primary">{gameTitle}</h2>
            <Badge variant="system">{(gameSaves[0] as any).games?.system?.toUpperCase()}</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(gameSaves as any[]).map((save) => (
              <div key={save.id} className="bg-surface-1 border border-surface-3 rounded-lg overflow-hidden hover:border-neon-cyan/30 transition-all group">
                <div className="aspect-video bg-surface-2 relative">
                  {save.thumbnail_path && (
                    <img src={save.thumbnail_path} alt={`Save slot ${save.slot_number}`} className="w-full h-full object-cover" />
                  )}
                  {save.is_auto_save && (
                    <span className="absolute top-1 left-1 font-pixel text-micro bg-warning/20 text-warning px-1.5 py-0.5 rounded">AUTO</span>
                  )}
                </div>
                <div className="p-2">
                  <p className="font-pixel text-micro text-text-secondary">SLOT {save.slot_number}</p>
                  <p className="font-mono text-micro text-text-tertiary">{formatRelativeTime(save.updated_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
