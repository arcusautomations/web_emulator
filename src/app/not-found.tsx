import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-void flex flex-col items-center justify-center">
      <h1 className="font-pixel text-display text-neon-magenta text-glow-magenta mb-4">404</h1>
      <p className="font-pixel text-h3 text-text-primary mb-8">GAME NOT FOUND</p>
      <p className="text-text-secondary mb-8">No cartridge detected at this address</p>
      <Link href="/" className="font-pixel text-h4 text-neon-cyan hover:text-cyan-light transition-colors">
        RETURN TO LIBRARY
      </Link>
    </div>
  );
}
