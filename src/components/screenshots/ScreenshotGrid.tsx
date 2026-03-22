'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Copy } from 'lucide-react';
import { listContainerVariants, listItemVariants } from '@/lib/animation-variants';
import { formatRelativeTime } from '@/lib/utils/format-utils';
import { Badge } from '@/components/ui/Badge';

interface Props {
  screenshots: any[];
}

export function ScreenshotGrid({ screenshots }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <motion.div variants={listContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {screenshots.map((ss, i) => (
          <motion.div key={ss.id} variants={i < 12 ? listItemVariants : undefined}>
            <button onClick={() => setLightboxIndex(i)} className="w-full bg-surface-1 border border-surface-3 rounded-none overflow-hidden group hover:shadow-glow-sm-cyan transition-all text-left">
              <div className="aspect-video relative overflow-hidden">
                <img src={ss.image_path} alt={`Screenshot from ${ss.games?.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="p-2">
                <p className="font-pixel text-micro text-text-secondary truncate">{ss.games?.title}</p>
                <p className="font-mono text-micro text-text-tertiary">{formatRelativeTime(ss.created_at)}</p>
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-4 right-4 text-text-secondary hover:text-text-primary z-10" onClick={() => setLightboxIndex(null)}>
            <X size={24} />
          </button>
          <img src={screenshots[lightboxIndex].image_path} alt="Screenshot" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <Badge variant="platform">{screenshots[lightboxIndex].games?.system?.toUpperCase()}</Badge>
            <span className="text-text-secondary text-caption">{screenshots[lightboxIndex].games?.title}</span>
          </div>
        </div>
      )}
    </>
  );
}
