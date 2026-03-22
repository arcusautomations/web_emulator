import Link from 'next/link';
import { CRTOverlay } from '@/components/effects/CRTOverlay';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-void flex flex-col items-center justify-center relative overflow-hidden">
      {/* Static noise background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '128px 128px',
      }} />

      <div className="relative z-10 text-center">
        <p className="font-mono text-caption text-error mb-4">ERR 404</p>
        <h1 className="font-pixel text-display text-neon-magenta text-glow-magenta mb-4">
          GAME NOT FOUND
        </h1>
        <p className="text-text-secondary text-body mb-8">No cartridge detected at this address</p>
        <Link href="/" className="font-pixel text-h4 text-neon-cyan hover:text-cyan-light hover:shadow-glow-sm-cyan transition-all px-6 py-3 border border-neon-cyan rounded-md inline-block">
          RETURN TO LIBRARY
        </Link>
      </div>

      <CRTOverlay mode="full" intensity={0.08} />
    </div>
  );
}
