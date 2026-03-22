import { CRTOverlay } from '@/components/effects/CRTOverlay';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] bg-void flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,0,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Logo */}
      <div className="mb-12 text-center relative z-10">
        <h1 className="font-pixel text-display text-neon-magenta text-glow-magenta tracking-wider">
          ARCADIUM
        </h1>
        <p className="font-pixel text-micro text-text-tertiary mt-4 tracking-widest">
          RETRO GAMING TERMINAL v1.0
        </p>
      </div>

      {/* Login card */}
      <div className="bg-surface-1 border border-magenta-dim/30 rounded-xl p-8 w-full max-w-md relative z-10 shadow-elevation-lg">
        <LoginForm />
      </div>

      {/* Hint */}
      <p className="font-mono text-caption text-text-tertiary mt-6 relative z-10">
        player1@arcadium.local / arcadium2026!
      </p>

      <CRTOverlay mode="full" intensity={0.06} />
    </div>
  );
}
