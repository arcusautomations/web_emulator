import type { Variants } from 'framer-motion';

export const pageVariants: Variants = {
  initial: { scaleY: 0.005, scaleX: 0.5, opacity: 1, filter: 'brightness(2)' },
  animate: {
    scaleY: 1,
    scaleX: 1,
    opacity: 1,
    filter: 'brightness(1)',
    transition: {
      scaleY: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      scaleX: { duration: 0.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
      filter: { duration: 0.4, ease: 'easeOut' },
    },
  },
  exit: {
    scaleY: 0.005,
    scaleX: 0.8,
    opacity: 1,
    filter: 'brightness(3)',
    transition: {
      scaleY: { duration: 0.2, ease: [0.7, 0, 0.84, 0] },
      scaleX: { duration: 0.15, ease: [0.7, 0, 0.84, 0] },
      filter: { duration: 0.15 },
    },
  },
};

export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

export const cardHoverVariants: Variants = {
  rest: { scale: 1, boxShadow: '0 0 0px transparent' },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 8px #00ffc888, 0 0 20px #00ffc844, 0 0 40px #00ffc822',
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  tap: { scale: 0.98, transition: { duration: 0.075 } },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] },
  },
};

export const glitchFlicker: Variants = {
  animate: {
    opacity: [0, 1, 0, 1, 0.8, 1],
    x: [0, -2, 3, -1, 0],
    filter: [
      'hue-rotate(0deg)',
      'hue-rotate(90deg)',
      'hue-rotate(-90deg)',
      'hue-rotate(45deg)',
      'hue-rotate(0deg)',
    ],
    transition: { duration: 0.3, times: [0, 0.1, 0.2, 0.4, 0.7, 1] },
  },
};

export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 28, mass: 1 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
};

export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const bottomSheetVariants: Variants = {
  initial: { y: '100%' },
  animate: {
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 26, mass: 1.2 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] },
  },
};

export const toastVariants: Variants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.8 },
  },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } },
};

export const reducedMotionVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};
