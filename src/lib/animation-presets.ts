export const springs = {
  snap: { type: 'spring' as const, stiffness: 500, damping: 30, mass: 0.8 },
  standard: { type: 'spring' as const, stiffness: 400, damping: 28, mass: 1 },
  gentle: { type: 'spring' as const, stiffness: 300, damping: 26, mass: 1.2 },
  bouncy: { type: 'spring' as const, stiffness: 350, damping: 15, mass: 0.8 },
  heavy: { type: 'spring' as const, stiffness: 250, damping: 30, mass: 1.5 },
} as const;

export const transitions = {
  micro: { duration: 0.075, ease: [0.5, 0, 0, 1] as const },
  fast: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const },
  normal: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  moderate: { duration: 0.3, ease: [0.65, 0, 0.35, 1] as const },
  slow: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  powerOn: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
} as const;
