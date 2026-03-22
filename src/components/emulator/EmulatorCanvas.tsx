'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { CORE_CONFIGS } from '@/lib/constants';
import { useSettingsStore } from '@/lib/stores/settings-store';
import type { SystemType } from '@/types';

interface Props {
  system: SystemType;
}

export const EmulatorCanvas = forwardRef<HTMLCanvasElement, Props>(function EmulatorCanvas(
  { system },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const integerScaling = useSettingsStore((s) => s.settings.video.integerScaling);
  const shaderType = useSettingsStore((s) => s.settings.video.shaderType);
  const config = CORE_CONFIGS[system];

  useEffect(() => {
    function handleResize() {
      const container = containerRef.current;
      const canvas = typeof ref === 'function' ? null : ref?.current;
      if (!container || !canvas) return;

      const containerW = container.clientWidth;
      const containerH = container.clientHeight;

      if (integerScaling) {
        // Find the largest integer multiplier that fits within the container
        const scaleX = Math.floor(containerW / config.nativeWidth);
        const scaleY = Math.floor(containerH / config.nativeHeight);
        const scale = Math.max(1, Math.min(scaleX, scaleY));
        canvas.style.width = `${config.nativeWidth * scale}px`;
        canvas.style.height = `${config.nativeHeight * scale}px`;
      } else {
        // Fit to container maintaining aspect ratio
        const ratio = config.nativeWidth / config.nativeHeight;
        const containerRatio = containerW / containerH;
        if (containerRatio > ratio) {
          canvas.style.height = `${containerH}px`;
          canvas.style.width = `${containerH * ratio}px`;
        } else {
          canvas.style.width = `${containerW}px`;
          canvas.style.height = `${containerW / ratio}px`;
        }
      }
    }

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [system, integerScaling, config, ref]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <canvas
        ref={ref}
        width={config.nativeWidth}
        height={config.nativeHeight}
        className="bg-black"
        style={{ imageRendering: shaderType === 'smooth' ? 'auto' : 'pixelated' }}
        aria-label={`Game screen - ${system.toUpperCase()}`}
      />
    </div>
  );
});
