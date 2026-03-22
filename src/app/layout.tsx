import type { Metadata, Viewport } from 'next';
import { Press_Start_2P, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { MotionShell } from '@/components/providers/MotionShell';
import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ARCADIUM',
  description: 'Premium retro game emulator',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#ff00ff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${pressStart2P.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-[100dvh]">
        <MotionShell>{children}</MotionShell>
      </body>
    </html>
  );
}
