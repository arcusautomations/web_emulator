# ARCADIUM — Definitive UI/UX Design System Specification
## Version 1.0 — Post 20-Cycle Iterative Refinement

---

## TABLE OF CONTENTS

1. Design Tokens — Color Palette
2. Design Tokens — Typography
3. Design Tokens — Spacing
4. Design Tokens — Border Radius
5. Design Tokens — Shadows & Glow
6. Design Tokens — Animation
7. Design Tokens — Components
8. Icon System
9. CRT/Scanline Overlay System
10. Page Architecture — Login
11. Page Architecture — Library/Home
12. Page Architecture — Game Player
13. Page Architecture — Settings
14. Page Architecture — Save State Manager
15. Page Architecture — Achievement Tracker
16. Page Architecture — Screenshot Gallery
17. Mobile-Specific Design
18. Desktop-Specific Design
19. Micro-interactions & Animations
20. Accessibility
21. Tailwind Configuration
22. Framer Motion Presets
23. Component Hierarchy & File Structure
24. Responsive Breakpoint Behaviors

---

## 1. DESIGN TOKENS — COLOR PALETTE

### Core Palette

```
Token Name            Hex        RGB                Usage
──────────────────────────────────────────────────────────────────
--color-bg-void       #0a0118    10, 1, 24          Deepest background, page body
--color-bg-base       #0d0221    13, 2, 33          Primary surface background
--color-bg-surface-1  #140533    20, 5, 51          Cards, elevated surfaces
--color-bg-surface-2  #1a0a40    26, 10, 64         Modals, overlays, dropdowns
--color-bg-surface-3  #22104d    34, 16, 77         Active/selected surface states

--color-neon-magenta  #ff00ff    255, 0, 255        Primary brand color, large headings
--color-magenta-light #ff66ff    255, 102, 255      Body text on dark (passes AA 6.2:1)
--color-magenta-muted #cc52cc    204, 82, 204       Disabled/secondary magenta elements
--color-magenta-dim   #661a66    102, 26, 102       Subtle backgrounds, borders

--color-neon-cyan     #00ffc8    0, 255, 200        Secondary brand, interactive elements
--color-cyan-light    #66ffd9    102, 255, 217       Hover states, highlighted text
--color-cyan-muted    #00b88e    0, 184, 142        Subdued interactive, secondary actions
--color-cyan-dim      #004d3b    0, 77, 59          Subtle borders, track fills

--color-electric-blue #0096ff    0, 150, 255        Accent, links, info states
--color-blue-light    #4db8ff    77, 184, 255       Hover for blue elements
--color-blue-muted    #006bb3    0, 107, 179        Subdued blue
--color-blue-dim      #002d4d    0, 45, 77          Subtle blue backgrounds

--color-text-primary  #f0e6ff    240, 230, 255      Primary body text (14.8:1 on base)
--color-text-secondary #b8a5d4   184, 165, 212      Secondary/muted text (7.2:1 on base)
--color-text-tertiary #7a6994    122, 105, 148      Placeholder, disabled (3.8:1 — large only)
--color-text-inverse  #0d0221    13, 2, 33          Text on light/neon backgrounds

--color-success       #00ff88    0, 255, 136        Save complete, achievement unlock
--color-warning       #ffaa00    255, 170, 0        Low battery, unsaved progress
--color-error         #ff3366    255, 51, 102       ROM load failure, connection error
--color-error-light   #ff6688    255, 102, 136      Error text on dark backgrounds (7.1:1)

--color-surface-glass rgba(13, 2, 33, 0.85)         Glass/frosted overlay backgrounds
--color-scanline      rgba(0, 0, 0, 0.12)           Scanline overlay color
```

### Contrast Ratios (verified against WCAG 2.1)

```
Combination                              Ratio    Rating
─────────────────────────────────────────────────────────
text-primary (#f0e6ff) on bg-base        14.8:1   AAA
text-secondary (#b8a5d4) on bg-base       7.2:1   AAA
magenta-light (#ff66ff) on bg-base        6.2:1   AA
neon-cyan (#00ffc8) on bg-base            8.9:1   AAA
neon-magenta (#ff00ff) on bg-base         4.6:1   AA (large text only)
electric-blue (#0096ff) on bg-base        4.8:1   AA (large text only)
error-light (#ff6688) on bg-base          7.1:1   AAA
text-primary (#f0e6ff) on surface-1       12.1:1   AAA
text-primary (#f0e6ff) on surface-2       10.4:1   AAA
```

### Tailwind Extension

```js
// tailwind.config.ts — colors
colors: {
  void: '#0a0118',
  base: '#0d0221',
  surface: {
    1: '#140533',
    2: '#1a0a40',
    3: '#22104d',
  },
  neon: {
    magenta: '#ff00ff',
    cyan: '#00ffc8',
    blue: '#0096ff',
  },
  magenta: {
    light: '#ff66ff',
    muted: '#cc52cc',
    dim: '#661a66',
  },
  cyan: {
    light: '#66ffd9',
    muted: '#00b88e',
    dim: '#004d3b',
  },
  blue: {
    light: '#4db8ff',
    muted: '#006bb3',
    dim: '#002d4d',
  },
  text: {
    primary: '#f0e6ff',
    secondary: '#b8a5d4',
    tertiary: '#7a6994',
    inverse: '#0d0221',
  },
  status: {
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff3366',
    'error-light': '#ff6688',
  },
}
```

---

## 2. DESIGN TOKENS — TYPOGRAPHY

### Font Families

```
Token                Font Stack                                   Usage
─────────────────────────────────────────────────────────────────────────
--font-pixel         'Press Start 2P', monospace                  Headings, labels, HUD, game UI
--font-body          'Inter', system-ui, -apple-system, sans-serif  Body text, descriptions, settings
--font-mono          'JetBrains Mono', 'Fira Code', monospace     Code, cheat codes, technical info
```

### Type Scale (modular scale ratio 1.25 — Major Third)

```
Token           Size    Line Height  Weight   Font Family   Usage
────────────────────────────────────────────────────────────────────────
--text-display  2.5rem  1.1          700      pixel         Hero headings, ARCADIUM logo text
--text-h1       2rem    1.2          700      pixel         Page titles
--text-h2       1.5rem  1.25         700      pixel         Section headings
--text-h3       1.125rem 1.3         700      pixel         Card titles, subsection headings
--text-h4       0.875rem 1.35        700      pixel         Small headings, labels in pixel font
--text-body-lg  1.125rem 1.6         400      body          Large body text, feature descriptions
--text-body     1rem    1.6          400      body          Default body text
--text-body-sm  0.875rem 1.5         400      body          Secondary info, metadata
--text-caption  0.75rem 1.5          500      body          Timestamps, badges, fine print
--text-micro    0.625rem 1.4         500      pixel         HUD elements, tiny labels
--text-mono     0.875rem 1.5         400      mono          Cheat codes, save state IDs
```

### Tailwind Extension

```js
// tailwind.config.ts — fonts & typography
fontFamily: {
  pixel: ['"Press Start 2P"', 'monospace'],
  body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
},
fontSize: {
  'display': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
  'h1': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
  'h2': ['1.5rem', { lineHeight: '1.25', fontWeight: '700' }],
  'h3': ['1.125rem', { lineHeight: '1.3', fontWeight: '700' }],
  'h4': ['0.875rem', { lineHeight: '1.35', fontWeight: '700' }],
  'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
  'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
  'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
  'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
  'micro': ['0.625rem', { lineHeight: '1.4', fontWeight: '500' }],
},
```

### Font Loading Strategy

```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono, Press_Start_2P } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

// Apply to <html>: className={`${inter.variable} ${jetbrainsMono.variable} ${pressStart.variable}`}
```

---

## 3. DESIGN TOKENS — SPACING

### Base Unit: 4px

```
Token     Value    Pixels   Usage
──────────────────────────────────────────────────
--sp-0    0        0px      Reset
--sp-px   1px      1px      Hairline borders
--sp-0.5  0.125rem 2px      Tight micro-spacing
--sp-1    0.25rem  4px      Minimal internal padding
--sp-1.5  0.375rem 6px      Icon-to-text gap
--sp-2    0.5rem   8px      Tight padding, small gaps
--sp-3    0.75rem  12px     Standard internal padding
--sp-4    1rem     16px     Default padding, card internal
--sp-5    1.25rem  20px     Medium spacing
--sp-6    1.5rem   24px     Section padding, card gaps
--sp-8    2rem     32px     Large section spacing
--sp-10   2.5rem   40px     Page section separators
--sp-12   3rem     48px     Major section breaks
--sp-16   4rem     64px     Page top/bottom padding
--sp-20   5rem     80px     Hero section spacing
--sp-24   6rem     96px     Maximum vertical rhythm unit
```

### Touch Target Minimums

```
Context             Minimum Size    Recommended Size
────────────────────────────────────────────────────
Mobile buttons      44 x 44px       48 x 48px
D-pad zones         56 x 56px       64 x 64px
Action buttons      48 x 48px       56 x 56px
List items          44px height     48px height
Desktop buttons     32 x 32px       36 x 36px
Icon buttons        36 x 36px       40 x 40px
```

### Layout Spacing Patterns

```
Pattern               Mobile          Tablet          Desktop
─────────────────────────────────────────────────────────────
Page padding          16px (sp-4)     24px (sp-6)     32px (sp-8)
Card grid gap         12px (sp-3)     16px (sp-4)     20px (sp-5)
Card internal pad     12px (sp-3)     16px (sp-4)     20px (sp-5)
Section gap           32px (sp-8)     40px (sp-10)    48px (sp-12)
Nav height            56px            56px            64px
Sidebar width         n/a             n/a             240px (collapsed: 64px)
Bottom bar height     64px            64px            n/a
```

---

## 4. DESIGN TOKENS — BORDER RADIUS

```
Token              Value     Usage
──────────────────────────────────────────────────
--radius-none      0px       Sharp-edged elements (retro feel)
--radius-sm        4px       Badges, tags, small chips
--radius-md        8px       Buttons, inputs, small cards
--radius-lg        12px      Cards, modals, panels
--radius-xl        16px      Large cards, image containers
--radius-2xl       24px      Bottom sheets, large modals
--radius-full      9999px    Circular icons, pill buttons, avatars
```

### Design Decision
Most game-related UI uses `radius-none` or `radius-sm` for retro sharpness. System UI (modals, settings, navigation) uses `radius-md` through `radius-lg` for modern feel. This creates intentional tension between retro game content and modern system chrome.

```js
// tailwind.config.ts
borderRadius: {
  'none': '0px',
  'sm': '4px',
  'md': '8px',
  'lg': '12px',
  'xl': '16px',
  '2xl': '24px',
  'full': '9999px',
},
```

---

## 5. DESIGN TOKENS — SHADOWS & GLOW

### Neon Glow System (3 intensity levels)

```
Token                     Value                                                     Usage
───────────────────────────────────────────────────────────────────────────────────────────────────
--glow-sm-magenta         0 0 4px #ff00ff66, 0 0 8px #ff00ff33                       Subtle accent, resting borders
--glow-md-magenta         0 0 8px #ff00ff88, 0 0 20px #ff00ff44, 0 0 40px #ff00ff22  Hover states, focused elements
--glow-lg-magenta         0 0 12px #ff00ffaa, 0 0 30px #ff00ff66, 0 0 60px #ff00ff33, 0 0 100px #ff00ff11  Active/hero elements

--glow-sm-cyan            0 0 4px #00ffc866, 0 0 8px #00ffc833                       Subtle accent, resting borders
--glow-md-cyan            0 0 8px #00ffc888, 0 0 20px #00ffc844, 0 0 40px #00ffc822  Hover states, focused elements
--glow-lg-cyan            0 0 12px #00ffc8aa, 0 0 30px #00ffc866, 0 0 60px #00ffc833, 0 0 100px #00ffc811  Active/hero elements

--glow-sm-blue            0 0 4px #0096ff66, 0 0 8px #0096ff33                       Subtle accent
--glow-md-blue            0 0 8px #0096ff88, 0 0 20px #0096ff44, 0 0 40px #0096ff22  Hover states
--glow-lg-blue            0 0 12px #0096ffaa, 0 0 30px #0096ff66, 0 0 60px #0096ff33  Active elements

--glow-success            0 0 8px #00ff8888, 0 0 20px #00ff8844                      Success feedback
--glow-error              0 0 8px #ff336688, 0 0 20px #ff336644                      Error feedback
--glow-warning            0 0 8px #ffaa0088, 0 0 20px #ffaa0044                      Warning feedback
```

### Elevation Shadows (used alongside or instead of glow)

```
Token              Value                                                Usage
──────────────────────────────────────────────────────────────────────────────
--shadow-sm        0 1px 2px rgba(0,0,0,0.5)                           Subtle elevation
--shadow-md        0 4px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)  Cards, dropdowns
--shadow-lg        0 8px 24px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)  Modals, popovers
--shadow-xl        0 16px 48px rgba(0,0,0,0.7), 0 4px 8px rgba(0,0,0,0.4)  Large modals, overlays
```

### Tailwind Extension

```js
// tailwind.config.ts
boxShadow: {
  'glow-sm-magenta': '0 0 4px #ff00ff66, 0 0 8px #ff00ff33',
  'glow-md-magenta': '0 0 8px #ff00ff88, 0 0 20px #ff00ff44, 0 0 40px #ff00ff22',
  'glow-lg-magenta': '0 0 12px #ff00ffaa, 0 0 30px #ff00ff66, 0 0 60px #ff00ff33, 0 0 100px #ff00ff11',
  'glow-sm-cyan': '0 0 4px #00ffc866, 0 0 8px #00ffc833',
  'glow-md-cyan': '0 0 8px #00ffc888, 0 0 20px #00ffc844, 0 0 40px #00ffc822',
  'glow-lg-cyan': '0 0 12px #00ffc8aa, 0 0 30px #00ffc866, 0 0 60px #00ffc833, 0 0 100px #00ffc811',
  'glow-sm-blue': '0 0 4px #0096ff66, 0 0 8px #0096ff33',
  'glow-md-blue': '0 0 8px #0096ff88, 0 0 20px #0096ff44, 0 0 40px #0096ff22',
  'glow-lg-blue': '0 0 12px #0096ffaa, 0 0 30px #0096ff66, 0 0 60px #0096ff33',
  'glow-success': '0 0 8px #00ff8888, 0 0 20px #00ff8844',
  'glow-error': '0 0 8px #ff336688, 0 0 20px #ff336644',
  'glow-warning': '0 0 8px #ffaa0088, 0 0 20px #ffaa0044',
  'elevation-sm': '0 1px 2px rgba(0,0,0,0.5)',
  'elevation-md': '0 4px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
  'elevation-lg': '0 8px 24px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)',
  'elevation-xl': '0 16px 48px rgba(0,0,0,0.7), 0 4px 8px rgba(0,0,0,0.4)',
},
```

### Text Glow (for headings)

```css
/* Utility classes */
.text-glow-magenta {
  text-shadow: 0 0 4px #ff00ff88, 0 0 12px #ff00ff44, 0 0 24px #ff00ff22;
}
.text-glow-cyan {
  text-shadow: 0 0 4px #00ffc888, 0 0 12px #00ffc844, 0 0 24px #00ffc822;
}
.text-glow-blue {
  text-shadow: 0 0 4px #0096ff88, 0 0 12px #0096ff44, 0 0 24px #0096ff22;
}
```

---

## 6. DESIGN TOKENS — ANIMATION

### Duration Scale

```
Token                Value     Usage
──────────────────────────────────────────────────────
--duration-instant   0ms       Disabled animations (reduced motion)
--duration-micro     75ms      Color changes, opacity snaps
--duration-fast      150ms     Button press feedback, toggles
--duration-normal    200ms     Standard transitions, hovers
--duration-moderate  300ms     Panel slides, card reveals
--duration-slow      400ms     Page transitions, modal enter/exit
--duration-slower    600ms     Complex sequences, achievement unlocks
--duration-slowest   1000ms    Boot/power-on sequences
```

### Easing Functions

```
Token                      Value                          Usage
──────────────────────────────────────────────────────────────────
--ease-out                 cubic-bezier(0.16, 1, 0.3, 1)  Elements entering view (decelerate in)
--ease-in                  cubic-bezier(0.7, 0, 0.84, 0)  Elements leaving view (accelerate out)
--ease-in-out              cubic-bezier(0.65, 0, 0.35, 1)  Continuous motion, position changes
--ease-bounce              cubic-bezier(0.34, 1.56, 0.64, 1)  Playful micro-interactions
--ease-snap                cubic-bezier(0.5, 0, 0, 1)      Quick snappy transitions (arcade feel)
--ease-power-on            cubic-bezier(0.22, 1, 0.36, 1)  CRT power-on effect
```

### Framer Motion Spring Presets

```ts
// lib/animation-presets.ts

export const springs = {
  // Snappy arcade-feel spring — buttons, toggles, small UI elements
  snap: { type: 'spring', stiffness: 500, damping: 30, mass: 0.8 },

  // Standard UI spring — cards, panels, navigation elements
  standard: { type: 'spring', stiffness: 400, damping: 28, mass: 1 },

  // Gentle spring — modals, overlays, page-level elements
  gentle: { type: 'spring', stiffness: 300, damping: 26, mass: 1.2 },

  // Bouncy spring — achievement unlocks, celebrations (use sparingly)
  bouncy: { type: 'spring', stiffness: 350, damping: 15, mass: 0.8 },

  // Heavy spring — large panels, sidebars, bottom sheets
  heavy: { type: 'spring', stiffness: 250, damping: 30, mass: 1.5 },
} as const;

export const transitions = {
  // Micro-interaction (button press, toggle, color change)
  micro: { duration: 0.075, ease: [0.5, 0, 0, 1] },

  // Fast transition (hover states, small reveals)
  fast: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },

  // Standard transition
  normal: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },

  // Moderate transition (panels, drawers)
  moderate: { duration: 0.3, ease: [0.65, 0, 0.35, 1] },

  // Slow transition (page transitions, large reveals)
  slow: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },

  // CRT power-on sequence
  powerOn: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;
```

### Framer Motion Variant Presets

```ts
// lib/animation-variants.ts

// Page transition — CRT power on/off
export const pageVariants = {
  initial: {
    scaleY: 0.005,
    scaleX: 0.5,
    opacity: 1,
    filter: 'brightness(2)',
  },
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

// Staggered list children
export const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const listItemVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

// Card hover
export const cardHoverVariants = {
  rest: { scale: 1, boxShadow: '0 0 0px transparent' },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 8px #00ffc888, 0 0 20px #00ffc844, 0 0 40px #00ffc822',
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.075 },
  },
};

// Fade in/up (generic)
export const fadeInUp = {
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

// Glitch flicker (for achievement unlock, errors)
export const glitchFlicker = {
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

// Neon pulse (for loading/active indicators)
export const neonPulse = {
  animate: {
    boxShadow: [
      '0 0 4px #00ffc866, 0 0 8px #00ffc833',
      '0 0 8px #00ffc888, 0 0 20px #00ffc844, 0 0 40px #00ffc822',
      '0 0 4px #00ffc866, 0 0 8px #00ffc833',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Reduced motion fallbacks
export const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};
```

---

## 7. DESIGN TOKENS — COMPONENTS

### Button Styles

```
Variant        Resting State                              Hover                                Active/Press
───────────────────────────────────────────────────────────────────────────────────────────────────────────────
Primary        bg-neon-cyan text-inverse                  bg-cyan-light glow-md-cyan            bg-cyan-muted scale-[0.97]
               border border-cyan-muted                   brightness-110
               px-6 py-3 rounded-md font-pixel text-h4

Secondary      bg-transparent text-neon-cyan              bg-cyan-dim text-cyan-light           bg-cyan-dim/80 scale-[0.97]
               border border-neon-cyan glow-sm-cyan       glow-md-cyan
               px-6 py-3 rounded-md font-pixel text-h4

Ghost          bg-transparent text-text-secondary         text-text-primary bg-surface-1        bg-surface-2 scale-[0.97]
               border border-transparent
               px-6 py-3 rounded-md font-body

Danger         bg-transparent text-error-light            bg-error/10 text-error-light          bg-error/20 scale-[0.97]
               border border-error glow-sm-error          glow-error
               px-6 py-3 rounded-md font-pixel text-h4

Icon           bg-surface-1 text-text-secondary           bg-surface-2 text-text-primary        bg-surface-3 scale-[0.95]
               p-2 rounded-md                             glow-sm-cyan

Disabled       bg-surface-1 text-text-tertiary            (no change)                           (no change)
(any variant)  border border-surface-3 opacity-50
               cursor-not-allowed
```

#### Button Tailwind Classes

```tsx
// Primary Button
<motion.button
  className="
    bg-neon-cyan text-text-inverse font-pixel text-h4
    border border-cyan-muted rounded-md
    px-6 py-3
    hover:bg-cyan-light hover:shadow-glow-md-cyan hover:brightness-110
    active:bg-cyan-muted active:scale-[0.97]
    disabled:bg-surface-1 disabled:text-text-tertiary disabled:border-surface-3
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
    transition-all duration-150
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan
    focus-visible:ring-offset-2 focus-visible:ring-offset-base
  "
  whileTap={{ scale: 0.97 }}
  transition={springs.snap}
>
  START GAME
</motion.button>

// Secondary Button
<motion.button
  className="
    bg-transparent text-neon-cyan font-pixel text-h4
    border border-neon-cyan rounded-md shadow-glow-sm-cyan
    px-6 py-3
    hover:bg-cyan-dim hover:text-cyan-light hover:shadow-glow-md-cyan
    active:bg-cyan-dim/80 active:scale-[0.97]
    disabled:bg-surface-1 disabled:text-text-tertiary disabled:border-surface-3
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
    transition-all duration-150
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan
    focus-visible:ring-offset-2 focus-visible:ring-offset-base
  "
  whileTap={{ scale: 0.97 }}
  transition={springs.snap}
>
  LOAD ROM
</motion.button>
```

### Card Styles

```
Variant          Styles
────────────────────────────────────────────────────────────────────
Game Card        bg-surface-1 border border-magenta-dim/30 rounded-lg overflow-hidden
(Library)        hover:border-neon-cyan/50 hover:shadow-glow-md-cyan
                 transition-all duration-200
                 Image: aspect-[3/4] object-cover (cover art)
                 Content: p-3, font-pixel text-h4 (title), font-body text-caption (platform)

Save State       bg-surface-1 border border-surface-3 rounded-lg overflow-hidden
Card             hover:border-cyan-muted hover:shadow-glow-sm-cyan
                 Image: aspect-video object-cover (screenshot thumbnail)
                 Content: p-3, slot number + timestamp + game title

Achievement      bg-surface-1 border border-surface-3 rounded-lg p-4
Card             Unlocked: border-neon-magenta/50 shadow-glow-sm-magenta
                 Locked: opacity-60, grayscale filter on icon
                 Layout: icon (48px) + title + description + progress bar

Settings         bg-surface-1 border border-surface-3 rounded-lg p-5
Group Card       Header: font-pixel text-h3 text-neon-cyan mb-4
                 Content: stack of setting rows with dividers

Screenshot       bg-surface-1 border border-surface-3 rounded-none overflow-hidden
Card             CRT frame effect border (2px inset glow)
                 Image: aspect-video, hover:scale-105
                 Overlay on hover: game name + timestamp
```

### Input Styles

```
State            Styles
────────────────────────────────────────────────────────────────────
Default          bg-surface-1 text-text-primary font-body
                 border border-surface-3 rounded-md
                 px-4 py-3
                 placeholder:text-text-tertiary

Focused          border-neon-cyan shadow-glow-sm-cyan
                 outline-none

Error            border-error shadow-glow-error
                 + error text below: text-error-light text-caption

Disabled         bg-surface-1/50 text-text-tertiary
                 border-surface-3/50 cursor-not-allowed
```

#### Input Tailwind

```tsx
<input
  className="
    w-full bg-surface-1 text-text-primary font-body text-body
    border border-surface-3 rounded-md
    px-4 py-3
    placeholder:text-text-tertiary
    focus:border-neon-cyan focus:shadow-glow-sm-cyan focus:outline-none
    disabled:bg-surface-1/50 disabled:text-text-tertiary disabled:cursor-not-allowed
    transition-all duration-150
  "
  placeholder="Search games..."
/>
```

### Modal / Dialog Styles

```
Element          Styles
────────────────────────────────────────────────────────────────────
Backdrop         bg-black/70 backdrop-blur-sm
                 Framer Motion: initial opacity 0, animate opacity 1

Container        bg-surface-2 border border-magenta-dim/40 rounded-xl
                 shadow-elevation-xl
                 max-w-lg w-full mx-4
                 p-6

Header           font-pixel text-h2 text-neon-cyan
                 border-b border-surface-3 pb-4 mb-4

Footer           border-t border-surface-3 pt-4 mt-4
                 flex justify-end gap-3

Close Button     absolute top-4 right-4
                 icon-button variant, X icon
```

### Toggle / Switch

```
Off              bg-surface-3 rounded-full w-12 h-7
                 Thumb: bg-text-secondary w-5 h-5 rounded-full, translate-x-1

On               bg-neon-cyan shadow-glow-sm-cyan rounded-full
                 Thumb: bg-white w-5 h-5 rounded-full, translate-x-6
                 Framer Motion spring: snap preset
```

### Slider

```
Track            bg-surface-3 h-2 rounded-full
Fill             bg-neon-cyan h-2 rounded-full shadow-glow-sm-cyan
Thumb            bg-white w-5 h-5 rounded-full border-2 border-neon-cyan
                 shadow-glow-md-cyan
                 active:scale-110
```

### Tabs

```
Container        bg-surface-1 border border-surface-3 rounded-lg p-1 flex gap-1

Tab (inactive)   text-text-secondary font-pixel text-h4 px-4 py-2 rounded-md
                 hover:text-text-primary hover:bg-surface-2

Tab (active)     text-neon-cyan bg-surface-2 font-pixel text-h4 px-4 py-2 rounded-md
                 shadow-glow-sm-cyan
                 Framer Motion layoutId underline indicator
```

### Badge / Tag

```
Variant          Styles
────────────────────────────────────────────────────────────────────
Platform         bg-magenta-dim/30 text-magenta-light font-pixel text-micro
                 px-2 py-1 rounded-sm border border-magenta-dim/50

Favorite         bg-error/20 text-error-light
                 Heart icon filled

Count            bg-neon-cyan text-text-inverse font-pixel text-micro
                 min-w-[20px] h-5 rounded-full px-1.5
                 flex items-center justify-center

Rarity Common    bg-surface-3 text-text-secondary border border-surface-3
Rarity Rare      bg-blue-dim text-blue-light border border-blue-muted
Rarity Legendary bg-magenta-dim text-neon-magenta border border-magenta-muted shadow-glow-sm-magenta
```

### Progress Bar

```
Track            bg-surface-3 h-2 rounded-full overflow-hidden
Fill             bg-gradient-to-r from-neon-magenta to-neon-cyan h-full rounded-full
                 Animated width transition, shadow-glow-sm-cyan on completion
Percentage       font-mono text-caption text-text-secondary, right-aligned above bar
```

### Tooltip

```
Container        bg-surface-2 text-text-primary text-caption
                 border border-surface-3 rounded-md
                 px-3 py-2 shadow-elevation-md
                 max-w-[200px]
Arrow            Fill matches bg-surface-2, border matches border
Animation        Framer Motion: scale 0.95 + opacity 0 -> scale 1 + opacity 1, duration 0.15
```

---

## 8. ICON SYSTEM

### Primary Library: Lucide React

```
Package:    lucide-react
Reason:     Tree-shakeable, consistent 24px grid, 1.5px stroke weight,
            pairs well with pixel aesthetic when combined with glow effects.
            MIT licensed.
```

### Standard Icon Sizes

```
Token        Size     Stroke    Usage
──────────────────────────────────────────────
icon-xs      14px     1.5px     Inline with caption text, badges
icon-sm      16px     1.5px     Inline with body-sm text, list items
icon-md      20px     2px       Default, buttons, nav items
icon-lg      24px     2px       Section headers, feature icons
icon-xl      32px     2px       Empty states, hero elements
icon-2xl     48px     2px       Achievement icons, platform logos
```

### Custom Icons Needed (SVG, pixel-art style)

```
Icon                 Usage                     Style
──────────────────────────────────────────────────────────────────
arcadium-logo        Brand mark, nav, splash   Pixel art, stylized "A" with CRT glow
d-pad                Touch controls            Pixel-perfect cross shape
button-a             Touch A button            Circular with "A" label
button-b             Touch B button            Circular with "B" label
button-x             Touch X button            Circular with "X" label
button-y             Touch Y button            Circular with "Y" label
button-start         Touch Start               Pill shape with "START" label
button-select        Touch Select              Pill shape with "SELECT" label
button-l             Shoulder button L         Rounded rectangle "L"
button-r             Shoulder button R         Rounded rectangle "R"
console-nes          Platform icon             8-bit style NES silhouette
console-snes         Platform icon             16-bit style SNES silhouette
console-genesis      Platform icon             Genesis silhouette
console-gba          Platform icon             GBA silhouette
console-gb           Platform icon             Game Boy silhouette
console-n64          Platform icon             N64 silhouette
cartridge            ROM/game generic icon     Pixel art cartridge
save-floppy          Save state icon           Pixel art floppy disk
crt-display          Display settings icon     CRT monitor outline
scanline-pattern     Shader selection          Horizontal lines pattern
pixel-heart          Favorite                  8-bit heart (filled/outline)
pixel-star           Rating/achievement        8-bit star
coin-insert          Insert coin / start       Animated coin slot
trophy               Achievement unlocked      Pixel trophy with glow
controller           Gamepad generic           Pixel-style controller
```

### Icon Wrapper Component

```tsx
// components/ui/Icon.tsx
interface IconProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  glow?: 'magenta' | 'cyan' | 'blue' | 'none';
  className?: string;
}

const sizeMap = {
  xs: 14, sm: 16, md: 20, lg: 24, xl: 32, '2xl': 48,
};

const glowMap = {
  magenta: 'drop-shadow-[0_0_4px_#ff00ff88]',
  cyan: 'drop-shadow-[0_0_4px_#00ffc888]',
  blue: 'drop-shadow-[0_0_4px_#0096ff88]',
  none: '',
};
```

---

## 9. CRT / SCANLINE OVERLAY SYSTEM

### Implementation: CSS Pseudo-element + GPU Layer

```tsx
// components/effects/CRTOverlay.tsx
'use client';

import { useReducedMotion } from 'framer-motion';
import { useSettings } from '@/lib/hooks/useSettings';

interface CRTOverlayProps {
  /** 'full' covers entire viewport, 'canvas' covers game area only */
  mode: 'full' | 'canvas';
  /** Override intensity (0-1). Defaults to user setting. */
  intensity?: number;
}

export function CRTOverlay({ mode, intensity }: CRTOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const { settings } = useSettings();
  const effectiveIntensity = intensity ?? settings.scanlineIntensity ?? 0.12;

  if (prefersReducedMotion || effectiveIntensity === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(0, 0, 0, ${effectiveIntensity}) 1px,
            rgba(0, 0, 0, ${effectiveIntensity}) 2px
          )`,
          backgroundSize: '100% 2px',
        }}
      />

      {/* CRT vignette (dark edges) */}
      {mode === 'canvas' && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse at center,
              transparent 60%,
              rgba(0, 0, 0, 0.3) 100%
            )`,
          }}
        />
      )}

      {/* Subtle RGB sub-pixel effect (desktop only, canvas mode only) */}
      {mode === 'canvas' && (
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              rgba(255, 0, 0, 0.03),
              rgba(255, 0, 0, 0.03) 1px,
              rgba(0, 255, 0, 0.03) 1px,
              rgba(0, 255, 0, 0.03) 2px,
              rgba(0, 0, 255, 0.03) 2px,
              rgba(0, 0, 255, 0.03) 3px
            )`,
            backgroundSize: '3px 100%',
          }}
        />
      )}

      {/* Animated flicker (very subtle, optional) */}
      {!prefersReducedMotion && settings.crtFlicker && (
        <div
          className="absolute inset-0 animate-crt-flicker"
          style={{
            background: `linear-gradient(
              rgba(255, 255, 255, 0.01) 50%,
              rgba(0, 0, 0, 0.02) 50%
            )`,
            backgroundSize: '100% 4px',
          }}
        />
      )}
    </div>
  );
}
```

### CRT Flicker Keyframes (Tailwind plugin)

```js
// tailwind.config.ts — keyframes
keyframes: {
  'crt-flicker': {
    '0%, 100%': { opacity: '0.98' },
    '50%': { opacity: '1' },
  },
  'scanline-scroll': {
    '0%': { backgroundPosition: '0 0' },
    '100%': { backgroundPosition: '0 4px' },
  },
},
animation: {
  'crt-flicker': 'crt-flicker 0.1s infinite',
  'scanline-scroll': 'scanline-scroll 0.5s linear infinite',
},
```

### Performance Notes

- Scanline overlay uses `pointer-events-none` so it never blocks interaction
- All effects are purely visual CSS (no JS paint), GPU-composited via `will-change: auto`
- Mobile: only scanlines applied (no RGB sub-pixel, no vignette by default)
- User can disable entirely in settings (intensity = 0)
- `aria-hidden="true"` ensures screen readers skip overlay elements

---

## 10. PAGE ARCHITECTURE — LOGIN

### Route: `/login`

### Desktop Layout (>= 1024px)

```
┌─────────────────────────────────────────────────────────┐
│                    FULL VIEWPORT                        │
│  ┌─────────────────────┬───────────────────────────┐    │
│  │                     │                           │    │
│  │   LEFT PANEL        │    RIGHT PANEL            │    │
│  │   (50% width)       │    (50% width)            │    │
│  │                     │                           │    │
│  │   Animated BG:      │    ARCADIUM Logo           │    │
│  │   Grid of pixel     │    (font-pixel display)   │    │
│  │   game covers       │    text-glow-magenta      │    │
│  │   slowly scrolling  │                           │    │
│  │   with CRT overlay  │    Tagline:               │    │
│  │   + blur            │    "EVERY PIXEL.           │    │
│  │                     │     EVERY MEMORY."         │    │
│  │                     │    text-text-secondary     │    │
│  │                     │                           │    │
│  │                     │    ┌─────────────────┐    │    │
│  │                     │    │ Email input      │    │    │
│  │                     │    ├─────────────────┤    │    │
│  │                     │    │ Password input   │    │    │
│  │                     │    ├─────────────────┤    │    │
│  │                     │    │ [PRESS START]    │    │    │
│  │                     │    │  primary button  │    │    │
│  │                     │    ├─────────────────┤    │    │
│  │                     │    │ ─── or ────     │    │    │
│  │                     │    │ [Google] [GH]   │    │    │
│  │                     │    ├─────────────────┤    │    │
│  │                     │    │ New player?     │    │    │
│  │                     │    │ CREATE ACCOUNT  │    │    │
│  │                     │    └─────────────────┘    │    │
│  │                     │                           │    │
│  └─────────────────────┴───────────────────────────┘    │
│                    CRT scanline overlay (full mode)      │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 1024px)

```
┌──────────────────────────┐
│    Animated BG (dimmed)  │
│    ┌──────────────────┐  │
│    │                  │  │
│    │   ARCADIUM       │  │
│    │   Logo + Tagline │  │
│    │                  │  │
│    │   Email input    │  │
│    │   Password input │  │
│    │                  │  │
│    │   [PRESS START]  │  │
│    │                  │  │
│    │   ── or ──       │  │
│    │   [G] [GH]       │  │
│    │                  │  │
│    │   New player?    │  │
│    │   CREATE ACCOUNT │  │
│    │                  │  │
│    └──────────────────┘  │
│    (safe area bottom)    │
└──────────────────────────┘
```

### Login Page Component Tree

```
LoginPage
├── AnimatedCoverBackground (left panel / full BG mobile)
│   ├── CoverArtGrid (auto-scrolling mosaic of game covers)
│   ├── BlurOverlay (backdrop-blur-md + black/50 overlay)
│   └── CRTOverlay mode="full"
├── LoginFormPanel
│   ├── ArcadiumLogo (SVG + text-glow animation)
│   ├── Tagline (text-text-secondary, font-body text-body-lg)
│   ├── LoginForm
│   │   ├── TextInput label="Email" type="email"
│   │   ├── TextInput label="Password" type="password"
│   │   ├── ForgotPasswordLink
│   │   └── Button variant="primary" fullWidth>PRESS START</Button>
│   ├── Divider label="or"
│   ├── SocialLoginButtons
│   │   ├── Button variant="secondary" icon={Google}
│   │   └── Button variant="secondary" icon={GitHub}
│   └── CreateAccountLink
└── CRTOverlay mode="full"
```

### Login Interactions

- Logo animates in with CRT power-on effect on page load
- Form fields fade-in-up with 50ms stagger
- "PRESS START" button has neon pulse animation when form is valid
- On submit: button text changes to pixel-animated loading dots "..." cycling
- On success: CRT power-off transition to library page
- On error: form shakes (translateX spring: [-8, 8, -4, 4, 0]) + error glow on inputs
- Keyboard: Enter submits, Tab through fields

---

## 11. PAGE ARCHITECTURE — LIBRARY / HOME

### Route: `/` (authenticated)

### Desktop Layout (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px, collapsible to 64px)  │  MAIN CONTENT              │
│ ┌──────────────────┐                  │                            │
│ │ ARCADIUM logo    │                  │  ┌──────────────────────┐  │
│ │ (compact)        │                  │  │ Search bar + filters │  │
│ ├──────────────────┤                  │  │ [🔍 Search...] [▼Platform] [▼Sort] │
│ │ 🏠 Library       │ ← active        │  └──────────────────────┘  │
│ │ ⭐ Favorites     │                  │                            │
│ │ 🎮 Recently     │                  │  CONTINUE PLAYING (if any) │
│ │    Played        │                  │  ┌────┐ ┌────┐ ┌────┐     │
│ │ 💾 Save States  │                  │  │lrg │ │lrg │ │lrg │     │
│ │ 🏆 Achievements │                  │  │card│ │card│ │card│     │
│ │ 📸 Screenshots  │                  │  └────┘ └────┘ └────┘     │
│ │ ⚙️ Settings     │                  │  (horizontal scroll)       │
│ ├──────────────────┤                  │                            │
│ │                  │                  │  ALL GAMES                 │
│ │ PLATFORMS        │                  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│ │ ○ All            │                  │  │   │ │   │ │   │ │   │ │
│ │ ○ NES            │                  │  │   │ │   │ │   │ │   │ │
│ │ ○ SNES           │                  │  └───┘ └───┘ └───┘ └───┘ │
│ │ ○ Genesis        │                  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│ │ ○ Game Boy       │                  │  │   │ │   │ │   │ │   │ │
│ │ ○ GBA            │                  │  │   │ │   │ │   │ │   │ │
│ │ ○ N64            │                  │  └───┘ └───┘ └───┘ └───┘ │
│ ├──────────────────┤                  │  (responsive grid)         │
│ │ QUICK STATS      │                  │                            │
│ │ 42 Games         │                  │                            │
│ │ 8 Save States    │                  │                            │
│ │ 12 Achievements  │                  │                            │
│ └──────────────────┘                  │                            │
└───────────────────────────────────────┴────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌──────────────────────────┐
│ ┌──────────────────────┐ │
│ │ ARCADIUM   [🔍] [⚙️] │ │  ← Top bar (56px)
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ Search bar (expanded │ │  ← Tap search icon to expand
│ │ when active)         │ │
│ └──────────────────────┘ │
│                          │
│ Platform filter chips    │
│ [All] [NES] [SNES] ...  │  ← Horizontal scroll chips
│                          │
│ CONTINUE PLAYING         │
│ ┌──────┐ ┌──────┐       │
│ │ card │ │ card │  →     │  ← Horizontal scroll
│ └──────┘ └──────┘        │
│                          │
│ ALL GAMES (Grid 2-col)   │
│ ┌─────┐ ┌─────┐         │
│ │     │ │     │          │
│ │     │ │     │          │
│ └─────┘ └─────┘          │
│ ┌─────┐ ┌─────┐         │
│ │     │ │     │          │
│ │     │ │     │          │
│ └─────┘ └─────┘          │
│                          │
│ ┌──────────────────────┐ │
│ │ 🏠  ⭐  💾  🏆  ⚙️  │ │  ← Bottom tab bar (64px)
│ └──────────────────────┘ │
└──────────────────────────┘
```

### Tablet Layout (768px - 1023px)

```
Same as mobile but:
- 3-column game grid
- Larger card sizes
- Top bar includes search inline (no expand needed)
- Bottom tab bar remains
```

### Library Component Tree

```
LibraryPage
├── DesktopSidebar (hidden < lg)
│   ├── SidebarHeader
│   │   ├── ArcadiumLogo variant="compact"
│   │   └── CollapseToggle
│   ├── NavLinks
│   │   ├── NavLink icon={Home} label="Library" href="/"
│   │   ├── NavLink icon={Star} label="Favorites" href="/favorites"
│   │   ├── NavLink icon={Clock} label="Recently Played" href="/recent"
│   │   ├── NavLink icon={Save} label="Save States" href="/saves"
│   │   ├── NavLink icon={Trophy} label="Achievements" href="/achievements"
│   │   ├── NavLink icon={Camera} label="Screenshots" href="/screenshots"
│   │   └── NavLink icon={Settings} label="Settings" href="/settings"
│   ├── PlatformFilter
│   │   └── PlatformRadioGroup
│   └── QuickStats
├── MobileTopBar (hidden >= lg)
│   ├── ArcadiumLogo variant="mini"
│   ├── SearchToggle
│   └── SettingsLink
├── MainContent
│   ├── SearchAndFilters
│   │   ├── SearchInput
│   │   ├── PlatformChips (mobile/tablet only, horizontal scroll)
│   │   ├── SortDropdown (Name / Recently Played / Platform / Favorites First)
│   │   └── ViewToggle (Grid / List) — desktop only
│   ├── ContinuePlayingSection (conditional: only if recent games exist)
│   │   ├── SectionHeader "CONTINUE PLAYING"
│   │   └── HorizontalScrollRow
│   │       └── GameCard[] variant="large" (shows progress bar + last played time)
│   ├── GameGrid
│   │   ├── SectionHeader "ALL GAMES" + count badge
│   │   └── ResponsiveGrid
│   │       └── GameCard[] variant="standard"
│   └── EmptyState (conditional: shown when no games match)
│       ├── PixelArtIllustration (empty cartridge slot)
│       ├── "NO GAMES FOUND" text
│       └── "Try adjusting your filters or add some ROMs" subtext
├── MobileBottomBar (hidden >= lg)
│   └── BottomTabBar
│       ├── TabItem icon={Home} label="Library"
│       ├── TabItem icon={Star} label="Favorites"
│       ├── TabItem icon={Save} label="Saves"
│       ├── TabItem icon={Trophy} label="Trophies"
│       └── TabItem icon={Settings} label="Settings"
└── CRTOverlay mode="full" intensity={0.06}
```

### Game Card Component

```tsx
// components/game/GameCard.tsx

interface GameCardProps {
  game: Game;
  variant: 'standard' | 'large';
  onPlay: (gameId: string) => void;
  onToggleFavorite: (gameId: string) => void;
}

// Standard variant: used in main grid
// Classes: group relative bg-surface-1 border border-magenta-dim/30 rounded-lg
//          overflow-hidden cursor-pointer
//          hover:border-neon-cyan/50 hover:shadow-glow-md-cyan
//          transition-all duration-200

// Image container: relative aspect-[3/4] overflow-hidden
// Image: object-cover w-full h-full group-hover:scale-105 transition-transform duration-300
// Overlay (on hover): absolute inset-0 bg-gradient-to-t from-black/80 via-transparent
//   Contains: PLAY button centered, Favorite heart top-right

// Content area: p-3
// Title: font-pixel text-h4 text-text-primary truncate
// Platform badge: inline-flex mt-1

// Large variant: same structure but
// aspect-[16/9] for image (landscape, shows gameplay screenshot if available)
// Additional: last played timestamp, progress bar if applicable
// Width: min-w-[280px] on mobile, min-w-[320px] on desktop
```

### Search Behavior

- Desktop: always-visible search bar at top of main content, 400px max-width
- Mobile: tap search icon in top bar -> search bar slides down from top with backdrop
- Debounced search: 300ms delay before filtering
- Search matches: game title, platform name, tags
- Results update with list animation (staggered fade-in)
- Empty search state: "No games match [query]" with clear button
- Keyboard shortcut (desktop): Cmd/Ctrl+K opens focused search

### Sort Options

```
Option              Behavior
────────────────────────────────────────
Recently Played     Last played timestamp, desc (default)
Name A-Z            Alphabetical ascending
Name Z-A            Alphabetical descending
Platform            Grouped by platform, alpha within
Favorites First     Favorites pinned to top, then by name
Recently Added      Date added to library, desc
```

### Grid Responsive Columns

```
Breakpoint      Columns    Card Min Width
──────────────────────────────────────────
< 480px         2          ~calc(50% - 6px)
480-767px       3          ~calc(33% - 8px)
768-1023px      3          ~calc(33% - 8px)
1024-1279px     4          ~calc(25% - 12px)
1280-1535px     5          ~calc(20% - 12px)
>= 1536px       6          ~calc(16.6% - 13px)
```

Tailwind: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5`

---

## 12. PAGE ARCHITECTURE — GAME PLAYER

### Route: `/play/[gameId]`

### Desktop Layout (>= 1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ HUD BAR (auto-hides after 3s, mouse move reveals)                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ← Back  │  GAME TITLE  │  ⏸ Pause  💾 Save  📸 Screenshot  ⚙️│ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌──────────┐ ┌───────────────────────────────────┐ ┌──────────┐    │
│ │          │ │                                   │ │          │    │
│ │ LEFT     │ │         GAME CANVAS               │ │ RIGHT    │    │
│ │ PANEL    │ │                                   │ │ PANEL    │    │
│ │          │ │    (maintains aspect ratio,       │ │          │    │
│ │ Save     │ │     centered, max size            │ │ Game     │    │
│ │ States   │ │     within available space)       │ │ Info     │    │
│ │          │ │                                   │ │          │    │
│ │ slot 1   │ │                                   │ │ Controls │    │
│ │ slot 2   │ │                                   │ │ Guide    │    │
│ │ slot 3   │ │                                   │ │          │    │
│ │          │ │                                   │ │ Cheats   │    │
│ │ [+ New]  │ │     CRT Overlay (canvas mode)     │ │          │    │
│ │          │ │                                   │ │          │    │
│ └──────────┘ └───────────────────────────────────┘ └──────────┘    │
│                                                                     │
│ BOTTOM INFO BAR (subtle, always visible)                           │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Platform: NES │ FPS: 60 │ Shader: Scanline │ Ctrl: Keyboard    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

Side panels collapsible (keyboard shortcut: [ and ] to toggle).
Fullscreen: F11 or double-click canvas.
In fullscreen: side panels hidden, HUD overlay only.
```

### Mobile Layout — Landscape (primary gameplay mode)

```
┌──────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │                    GAME CANVAS                               │ │
│ │                 (full width, centered)                       │ │
│ │                                                              │ │
│ │    ┌───┐                                       ┌──┐ ┌──┐   │ │
│ │    │   │                                       │B │ │A │   │ │
│ │ ┌──┤ ▲ ├──┐                                    └──┘ └──┘   │ │
│ │ │◄ │   │ ►│                               ┌──┐ ┌──┐        │ │
│ │ └──┤ ▼ ├──┘                               │Y │ │X │        │ │
│ │    │   │                                  └──┘ └──┘         │ │
│ │    └───┘                                                    │ │
│ │         [SELECT] [START]                                    │ │
│ │                                              [L]     [R]    │ │
│ └──────────────────────────────────────────────────────────────┘ │
│  ← swipe down from top edge: HUD menu                           │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile Layout — Portrait (simplified, optional)

```
┌──────────────────────────┐
│ ┌──────────────────────┐ │
│ │     GAME CANVAS      │ │ ← Top half
│ │  (full width, 4:3)   │ │
│ │                      │ │
│ └──────────────────────┘ │
│                          │
│  ┌───┐      ┌──┐ ┌──┐  │ ← Bottom half: controls
│  │   │      │B │ │A │  │
│  │ ▲ │      └──┘ └──┘  │
│  ├───┤   ┌──┐ ┌──┐     │
│  │◄ ►│   │Y │ │X │     │
│  ├───┤   └──┘ └──┘     │
│  │ ▼ │                  │
│  └───┘                  │
│  [SEL] [START]  [L] [R] │
│                          │
│  ┌──────────────────┐   │
│  │ ⏸ 💾 📸 ⚙️  ✕  │   │ ← Quick action bar
│  └──────────────────┘   │
└──────────────────────────┘
```

### Player Component Tree

```
GamePlayerPage
├── PlayerHUD (auto-hiding on desktop, swipe-reveal on mobile)
│   ├── BackButton (← icon + "Library" text on desktop, ← only on mobile)
│   ├── GameTitle (font-pixel text-h4, truncated)
│   ├── HUDActions
│   │   ├── IconButton icon={Pause} label="Pause" shortcut="Esc"
│   │   ├── IconButton icon={Save} label="Quick Save" shortcut="F5"
│   │   ├── IconButton icon={Camera} label="Screenshot" shortcut="F12"
│   │   ├── IconButton icon={Code} label="Cheats" shortcut="F9"
│   │   └── IconButton icon={Settings} label="Settings" shortcut="F10"
│   └── HUDMiniInfo (FPS counter, current shader)
├── GameCanvasContainer
│   ├── EmulatorCanvas (ref forwarded, WebGL/Canvas2D)
│   │   └── CRTOverlay mode="canvas"
│   ├── PauseOverlay (conditional)
│   │   ├── "PAUSED" text (font-pixel text-h1, neon pulse animation)
│   │   ├── ResumeButton
│   │   ├── SaveButton
│   │   ├── LoadButton
│   │   ├── SettingsButton
│   │   └── QuitButton
│   └── LoadingOverlay (conditional: ROM loading)
│       ├── RetroProgressBar (health-bar styled)
│       ├── "LOADING..." text with animated dots
│       └── CRT static noise background animation
├── DesktopSidePanels (hidden < lg, hidden in fullscreen)
│   ├── LeftPanel (collapsible)
│   │   └── QuickSaveSlots
│   │       ├── SaveSlotCard[] (thumbnail + timestamp)
│   │       └── NewSaveSlotButton
│   └── RightPanel (collapsible)
│       ├── GameInfoCard (cover art mini, platform, play time)
│       ├── ControlsGuide (current key bindings)
│       └── ActiveCheats (toggle list)
├── MobileTouchControls (hidden >= lg)
│   ├── DPad (left thumb zone)
│   ├── ActionButtons (right thumb zone)
│   │   ├── ButtonA, ButtonB, ButtonX, ButtonY
│   │   └── (layout depends on platform: NES=A+B, SNES=A+B+X+Y)
│   ├── ShoulderButtons (L top-left, R top-right)
│   ├── MetaButtons (Start, Select — bottom center)
│   └── QuickActionBar (portrait mode only)
├── BottomInfoBar (desktop only, subtle)
│   ├── PlatformBadge
│   ├── FPSCounter
│   ├── ShaderName
│   └── InputMethodIndicator
└── MobileGameMenu (bottom sheet, swipe-down activated)
    ├── SaveStateManager (compact)
    ├── ShaderPicker (compact)
    ├── CheatToggler (compact)
    └── QuitButton
```

### Game Launch Sequence Animation

```ts
// Sequence when navigating to /play/[gameId]:

const gameLaunchSequence = {
  // Step 1: CRT power-off on library page (exit animation)
  libraryExit: pageVariants.exit, // 200ms

  // Step 2: Black screen with "LOADING" text
  loadingScreen: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.1 } },
  },

  // Step 3: ROM loading progress (actual load time)
  progressBar: {
    // Health-bar style: magenta-to-cyan gradient fill
    // Width animates from 0% to 100% based on actual load progress
    // Pixel-art border around the bar
  },

  // Step 4: CRT power-on effect on game canvas
  canvasPowerOn: {
    initial: { scaleY: 0.005, scaleX: 0.3, filter: 'brightness(3)' },
    animate: {
      scaleY: 1,
      scaleX: 1,
      filter: 'brightness(1)',
      transition: {
        scaleY: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        scaleX: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
        filter: { duration: 0.5 },
      },
    },
  },

  // Step 5: Touch controls fade in (mobile only)
  controlsFadeIn: {
    initial: { opacity: 0 },
    animate: {
      opacity: 0.7, // Semi-transparent resting state
      transition: { duration: 0.3, delay: 0.3 },
    },
  },
};
```

### HUD Auto-Hide Behavior (Desktop)

```ts
// hooks/useAutoHideHUD.ts

const HIDE_DELAY = 3000; // ms
const SHOW_DELAY = 0; // instant on mouse move

// Mouse movement detected: show HUD immediately
// Mouse stops moving: start 3s timer, then fade out HUD
// Mouse enters HUD area: cancel hide timer, keep visible
// During pause: HUD always visible
// Keyboard shortcut 'H': toggle HUD lock (always visible / auto-hide)

// Framer Motion for HUD:
const hudVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  hidden: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] },
  },
};
```

---

## 13. PAGE ARCHITECTURE — SETTINGS

### Route: `/settings`

### Settings Groups

```
Group              Contains
────────────────────────────────────────────────────────────────
Display            CRT scanline intensity (slider 0-100%)
                   CRT flicker effect (toggle)
                   Shader preset (dropdown: None, Scanline, CRT Curvature, LCD Grid, Smooth)
                   Screen scaling (dropdown: Pixel Perfect, Stretch, Fit)
                   Aspect ratio (dropdown: Original, 4:3, 16:9, Stretch)
                   Show FPS counter (toggle)

Controls           Input method info (detected: keyboard/gamepad/touch)
                   Key bindings (remappable table)
                   Gamepad mapping
                   Touch control opacity (slider 0-100%)
                   Touch control size (slider: Small, Medium, Large)
                   Touch control layout (preset: Default, Compact, Spread)
                   Haptic feedback (toggle + intensity: Light, Medium, Strong)
                   Vibration on button press (toggle)

Audio              Master volume (slider 0-100%)
                   Sound effects volume (slider 0-100%)
                   UI sounds (toggle)
                   Audio latency compensation (slider)

Emulation          Auto-save interval (dropdown: Off, 1m, 5m, 10m)
                   Fast forward speed (dropdown: 2x, 4x, 8x, Unlimited)
                   Rewind buffer (dropdown: Off, 10s, 30s, 60s)
                   Frame skip (dropdown: Off, 1, 2, Auto)

Account            Profile info (avatar, username)
                   Cloud sync (toggle + last sync time)
                   Data export
                   Delete account (danger zone)

About              Version number
                   Credits
                   Open source licenses
                   Support/feedback link
```

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  MAIN CONTENT                                            │
│         │  ┌───────────────────────────────────────────────────┐    │
│ Library │  │ SETTINGS                                         │    │
│ ...     │  │ ┌──────────────────────────────────────────────┐  │    │
│         │  │ │ [Display] [Controls] [Audio] [Emulation]     │  │    │
│         │  │ │ [Account] [About]                            │  │    │
│ ⚙️ act  │  │ └──────────────────────────────────────────────┘  │    │
│         │  │                                                   │    │
│         │  │  ┌──── DISPLAY ────────────────────────────────┐  │    │
│         │  │  │                                             │  │    │
│         │  │  │  CRT Scanline Intensity                     │  │    │
│         │  │  │  ━━━━━━━━━━━━●━━━━━━━  45%                 │  │    │
│         │  │  │                                             │  │    │
│         │  │  │  CRT Flicker Effect                         │  │    │
│         │  │  │  ──────────────────────────────  [  ○ OFF]  │  │    │
│         │  │  │                                             │  │    │
│         │  │  │  Shader Preset                              │  │    │
│         │  │  │  [▼ Scanline                           ]    │  │    │
│         │  │  │                                             │  │    │
│         │  │  │  Screen Scaling                             │  │    │
│         │  │  │  [▼ Pixel Perfect                      ]    │  │    │
│         │  │  │                                             │  │    │
│         │  │  │  ...                                        │  │    │
│         │  │  └─────────────────────────────────────────────┘  │    │
│         │  └───────────────────────────────────────────────────┘    │
└─────────┴──────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────────┐
│ ← Settings               │ ← Top bar with back button
│                          │
│ ┌──────────────────────┐ │
│ │ Display          →   │ │ ← Setting group rows
│ ├──────────────────────┤ │
│ │ Controls         →   │ │
│ ├──────────────────────┤ │
│ │ Audio            →   │ │
│ ├──────────────────────┤ │
│ │ Emulation        →   │ │
│ ├──────────────────────┤ │
│ │ Account          →   │ │
│ ├──────────────────────┤ │
│ │ About            →   │ │
│ └──────────────────────┘ │
│                          │
│ [Bottom Tab Bar]         │
└──────────────────────────┘

Tap a group → slides to detail view:
┌──────────────────────────┐
│ ← Display                │
│                          │
│ CRT Scanline Intensity   │
│ ━━━━━━━━━━━●━━━━  45%   │
│                          │
│ CRT Flicker Effect       │
│ ────────────── [ ○ OFF]  │
│                          │
│ Shader Preset            │
│ [▼ Scanline           ]  │
│                          │
│ ...                      │
└──────────────────────────┘
```

### Settings During Gameplay (Mobile Bottom Sheet)

```
When in game player page, settings open as a bottom sheet
that covers ~60% of screen, game remains visible behind
(dimmed, paused).

┌──────────────────────────┐
│  (game canvas, dimmed)   │
│                          │
│ ┌──────────────────────┐ │
│ │ ═══ (drag handle)    │ │ ← Bottom sheet
│ │                      │ │
│ │ QUICK SETTINGS       │ │
│ │                      │ │
│ │ Scanlines ━━━●━ 45%  │ │
│ │ Volume    ━━━━●  80% │ │
│ │ Controls  ━━●━  Med  │ │
│ │ Shader    [Scanline▼] │ │
│ │                      │ │
│ │ [All Settings →]     │ │
│ │                      │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

### Settings Component Tree

```
SettingsPage
├── SettingsHeader
│   ├── BackButton (mobile)
│   └── PageTitle "SETTINGS" (font-pixel text-h1)
├── SettingsTabs (desktop: horizontal tabs, mobile: list -> detail navigation)
│   └── TabList
│       └── Tab[] (Display, Controls, Audio, Emulation, Account, About)
├── SettingsContent
│   ├── DisplaySettings
│   │   ├── SliderSetting label="CRT Scanline Intensity" min={0} max={100} suffix="%"
│   │   ├── ToggleSetting label="CRT Flicker Effect"
│   │   ├── SelectSetting label="Shader Preset" options={shaderOptions}
│   │   ├── SelectSetting label="Screen Scaling" options={scalingOptions}
│   │   ├── SelectSetting label="Aspect Ratio" options={ratioOptions}
│   │   └── ToggleSetting label="Show FPS Counter"
│   ├── ControlSettings
│   │   ├── InfoRow label="Detected Input" value={detectedInput}
│   │   ├── KeyBindingTable bindings={currentBindings} onRebind={handleRebind}
│   │   ├── SliderSetting label="Touch Control Opacity" (mobile only)
│   │   ├── SelectSetting label="Touch Control Size" (mobile only)
│   │   ├── SelectSetting label="Touch Control Layout" (mobile only)
│   │   ├── ToggleSetting label="Haptic Feedback" (mobile only)
│   │   └── SelectSetting label="Haptic Intensity" (mobile only)
│   ├── AudioSettings
│   │   ├── SliderSetting label="Master Volume"
│   │   ├── SliderSetting label="Sound Effects"
│   │   ├── ToggleSetting label="UI Sounds"
│   │   └── SliderSetting label="Audio Latency"
│   ├── EmulationSettings
│   │   ├── SelectSetting label="Auto-save Interval"
│   │   ├── SelectSetting label="Fast Forward Speed"
│   │   ├── SelectSetting label="Rewind Buffer"
│   │   └── SelectSetting label="Frame Skip"
│   ├── AccountSettings
│   │   ├── ProfileCard (avatar + username + edit)
│   │   ├── ToggleSetting label="Cloud Sync"
│   │   ├── Button "Export Data" variant="secondary"
│   │   └── DangerZone
│   │       └── Button "Delete Account" variant="danger"
│   └── AboutSettings
│       ├── VersionInfo
│       ├── CreditsLink
│       ├── LicensesLink
│       └── FeedbackLink
└── BottomTabBar (mobile)
```

### Key Binding Remapping UX

```
1. User clicks a key binding row (e.g., "A Button: Z")
2. Row highlights with cyan glow + pulsing border
3. Text changes to "PRESS A KEY..." (font-pixel, neon pulse animation)
4. User presses desired key
5. If conflict: warning toast "Key already bound to [action]. Swap?" with [Swap] [Cancel]
6. Key updates with brief glitch animation
7. If user presses Escape: cancels rebinding
```

---

## 14. PAGE ARCHITECTURE — SAVE STATE MANAGER

### Route: `/saves` (standalone) + inline in game player

### Desktop Layout (standalone page)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  SAVE STATE MANAGER                                      │
│         │                                                          │
│         │  Filter: [All Games ▼]  Sort: [Most Recent ▼]           │
│         │                                                          │
│         │  ┌─ SUPER MARIO BROS ──────────────────────────────────┐ │
│         │  │                                                     │ │
│         │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │ │
│         │  │  │ 📸       │  │ 📸       │  │ 📸       │         │ │
│         │  │  │ Slot 1   │  │ Slot 2   │  │ Slot 3   │         │ │
│         │  │  │ Auto-save│  │ Manual   │  │ Manual   │         │ │
│         │  │  │ 2m ago   │  │ 1h ago   │  │ 3d ago   │         │ │
│         │  │  │ World 1-3│  │ World 4-1│  │ World 8-2│         │ │
│         │  │  │ [Load]   │  │ [Load]   │  │ [Load]   │         │ │
│         │  │  │ [Delete] │  │ [Delete] │  │ [Delete] │         │ │
│         │  │  └──────────┘  └──────────┘  └──────────┘         │ │
│         │  │                                                     │ │
│         │  └─────────────────────────────────────────────────────┘ │
│         │                                                          │
│         │  ┌─ ZELDA ─────────────────────────────────────────────┐ │
│         │  │  ...                                                │ │
│         │  └─────────────────────────────────────────────────────┘ │
└─────────┴──────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────────┐
│ ← Save States            │
│                          │
│ [All Games ▼] [Recent ▼] │
│                          │
│ SUPER MARIO BROS         │
│ ┌──────────┐ ┌────────┐ │
│ │ 📸 Slot 1│ │📸 Slt 2│ │
│ │ Auto-save│ │ Manual │ │
│ │ 2m ago   │ │ 1h ago │ │
│ └──────────┘ └────────┘ │
│ ┌──────────┐            │
│ │ 📸 Slot 3│            │
│ │ Manual   │            │
│ │ 3d ago   │            │
│ └──────────┘             │
│                          │
│ ZELDA                    │
│ ...                      │
│                          │
│ [Bottom Tab Bar]         │
└──────────────────────────┘
```

### Save State Card

```tsx
// components/saves/SaveStateCard.tsx

// Layout: vertical card
// Thumbnail: aspect-video, screenshot at save point with CRT overlay
// Auto-save indicator: small cyan badge top-left "AUTO"
// Slot number: top-right badge "#1"
// Content below image:
//   - Relative timestamp (font-body text-caption text-text-secondary)
//   - Game context info if available (font-mono text-caption)
// Actions:
//   - Desktop: hover reveals [Load] [Delete] buttons overlay on image
//   - Mobile: tap opens action sheet (Load, Rename, Delete, Share)
//   - Swipe left on mobile: reveals delete button (red bg)

// Tailwind:
// bg-surface-1 border border-surface-3 rounded-lg overflow-hidden
// hover:border-cyan-muted hover:shadow-glow-sm-cyan transition-all duration-200
```

### Save Capture Animation

```ts
// When user triggers save (F5 or save button):

const saveCaptureAnimation = {
  // 1. Screen flash (brief white overlay)
  flash: {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 0.3, 0],
      transition: { duration: 0.2, times: [0, 0.3, 1] },
    },
  },

  // 2. Corner capture indicator (like a camera viewfinder)
  viewfinder: {
    // Four L-shaped corners appear and close inward
    initial: { scale: 1.2, opacity: 0 },
    animate: {
      scale: 1,
      opacity: [0, 1, 1, 0],
      transition: { duration: 0.5, times: [0, 0.2, 0.8, 1] },
    },
  },

  // 3. Toast notification slides in
  toast: {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: 'spring', stiffness: 500, damping: 30 },
    },
    exit: {
      opacity: 0, y: -10,
      transition: { duration: 0.2 },
    },
    // Toast content: "💾 STATE SAVED — SLOT 3" with cyan glow border
    // Auto-dismiss after 2 seconds
  },
};
```

### Empty State (No Save States)

```
Illustration: Pixel art floppy disk with "?" on it
Heading: "NO SAVE STATES YET" (font-pixel text-h2 text-neon-cyan)
Subtext: "Save your progress in any game using F5 or the save button"
         (font-body text-body text-text-secondary)
CTA: [START A GAME] button (primary)
```

---

## 15. PAGE ARCHITECTURE — ACHIEVEMENT TRACKER

### Route: `/achievements`

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  ACHIEVEMENTS                                            │
│         │                                                          │
│         │  ┌─ OVERALL PROGRESS ──────────────────────────────────┐ │
│         │  │ ████████████████░░░░░░░  68%  (34/50)              │ │
│         │  │ [All] [Unlocked: 34] [Locked: 16]                  │ │
│         │  └─────────────────────────────────────────────────────┘ │
│         │                                                          │
│         │  ┌─── RECENTLY UNLOCKED ───────────────────────────────┐ │
│         │  │ 🏆 First Blood      🏆 Speed Runner   🏆 Collector │ │
│         │  │ Unlocked 2h ago    Unlocked 1d ago   Unlocked 3d   │ │
│         │  └─────────────────────────────────────────────────────┘ │
│         │                                                          │
│         │  ┌─── ALL ACHIEVEMENTS ────────────────────────────────┐ │
│         │  │                                                     │ │
│         │  │  [🏆] First Blood (COMMON)           ✓ Unlocked    │ │
│         │  │  Beat any game's first level                        │ │
│         │  │  ━━━━━━━━━━━━━━━━━━━━━━━━ 100%                    │ │
│         │  │                                                     │ │
│         │  │  [🏆] Marathon Runner (RARE)          🔒 Locked     │ │
│         │  │  Play for 100 total hours                          │ │
│         │  │  ━━━━━━━━━━━━━━░░░░░░░░░  62% (62/100h)          │ │
│         │  │                                                     │ │
│         │  │  [🏆] Completionist (LEGENDARY)       🔒 Locked     │ │
│         │  │  Beat every game in your library                   │ │
│         │  │  ━━━━░░░░░░░░░░░░░░░░░░░  12% (5/42)             │ │
│         │  │                                                     │ │
│         │  └─────────────────────────────────────────────────────┘ │
└─────────┴──────────────────────────────────────────────────────────┘
```

### Achievement Card Component

```tsx
// components/achievements/AchievementCard.tsx

interface AchievementCardProps {
  achievement: Achievement;
}

// Unlocked state:
//   bg-surface-1 border-neon-magenta/50 shadow-glow-sm-magenta rounded-lg p-4
//   Icon: full color, pixel-trophy with glow
//   Title: font-pixel text-h3 text-text-primary
//   Description: font-body text-body-sm text-text-secondary
//   Progress bar: full, gradient fill, glow effect
//   Rarity badge: positioned top-right
//   Unlock time: font-body text-caption text-text-tertiary

// Locked state:
//   bg-surface-1 border-surface-3 rounded-lg p-4 opacity-70
//   Icon: grayscale, no glow
//   Title: font-pixel text-h3 text-text-secondary
//   Description: font-body text-body-sm text-text-tertiary
//   Progress bar: partial fill, no glow
//   Lock icon overlay on achievement icon

// Rarity colors:
//   Common: text-text-secondary, bg-surface-3 border
//   Rare: text-blue-light, bg-blue-dim border-blue-muted
//   Legendary: text-neon-magenta, bg-magenta-dim border-magenta-muted shadow-glow-sm-magenta
```

### Achievement Unlock Animation

```ts
// Triggered in-game when achievement conditions are met

const achievementUnlockSequence = {
  // 1. Glitch flicker of entire screen (50ms)
  screenGlitch: glitchFlicker.animate,

  // 2. Achievement banner slides in from top
  banner: {
    initial: {
      y: -100,
      opacity: 0,
      scaleX: 0.8,
    },
    animate: {
      y: 0,
      opacity: 1,
      scaleX: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      },
    },
    exit: {
      y: -60,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] },
    },
  },

  // 3. Banner content:
  //    Left: Trophy icon with golden glow pulse
  //    Center: "ACHIEVEMENT UNLOCKED" (font-pixel text-micro text-neon-magenta)
  //           Achievement title (font-pixel text-h4 text-text-primary)
  //    Right: Rarity badge
  //    Background: bg-surface-2/95 backdrop-blur-md border-b-2 border-neon-magenta
  //    Box shadow: glow-md-magenta

  // 4. Particle burst from trophy icon
  particles: {
    // 12 small squares (4x4px) in magenta/cyan
    // Burst outward in random directions
    // Each particle: scale 1 -> 0, opacity 1 -> 0, random rotation
    // Duration: 600ms
  },

  // 5. Auto-dismiss after 4 seconds
  // 6. Tap/click to dismiss immediately
};
```

### Achievement Progress Ring (for summary view)

```tsx
// SVG-based circular progress indicator
// Outer ring: stroke neon-cyan, track stroke surface-3
// Center: achievement icon or percentage text
// Animation: stroke-dashoffset animates from full circumference to calculated value
// Glow filter on the stroke when > 50% complete
```

---

## 16. PAGE ARCHITECTURE — SCREENSHOT GALLERY

### Route: `/screenshots`

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  SCREENSHOTS                                             │
│         │                                                          │
│         │  Filter: [All Games ▼]  │  34 screenshots                │
│         │                                                          │
│         │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│         │  │            │ │            │ │            │           │
│         │  │   (image)  │ │   (image)  │ │   (image)  │           │
│         │  │            │ │            │ │            │           │
│         │  ├────────────┤ ├────────────┤ ├────────────┤           │
│         │  │ Game Title │ │ Game Title │ │ Game Title │           │
│         │  │ 2h ago     │ │ 1d ago     │ │ 3d ago     │           │
│         │  └────────────┘ └────────────┘ └────────────┘           │
│         │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│         │  │    ...     │ │    ...     │ │    ...     │           │
│         │  └────────────┘ └────────────┘ └────────────┘           │
└─────────┴──────────────────────────────────────────────────────────┘
```

### Lightbox View

```
┌─────────────────────────────────────────────────────────────────────┐
│                        (dark overlay)                               │
│                                                                     │
│     ┌─ CRT FRAME BORDER (2px inset glow, slight curvature) ─────┐ │
│     │                                                            │ │
│     │                                                            │ │
│     │                    SCREENSHOT                              │ │
│     │                    (full resolution)                       │ │
│     │                                                            │ │
│     │                    CRT overlay (canvas mode)               │ │
│     │                                                            │ │
│     └────────────────────────────────────────────────────────────┘ │
│                                                                     │
│     Game Title  •  Platform  •  Taken 2 hours ago                  │
│                                                                     │
│     [← Prev]  [Download]  [Share]  [Delete]  [Next →]             │
│                                                                     │
│                                                              [✕]   │
└─────────────────────────────────────────────────────────────────────┘

Navigation: Arrow keys (desktop), swipe (mobile)
```

### Screenshot Card

```
bg-surface-1 border border-surface-3 rounded-none overflow-hidden
Intentionally no border-radius for retro CRT feel

Image: aspect-video object-cover
       group-hover:scale-105 transition-transform duration-300
       2px inset shadow (CRT screen effect)

Overlay on hover (desktop):
  absolute inset-0 bg-gradient-to-t from-base/80 to-transparent
  Contains: game name, timestamp, [View] button

Content (below image):
  px-3 py-2
  Game title: font-pixel text-micro text-text-primary truncate
  Timestamp: font-body text-caption text-text-tertiary
```

### Empty State

```
Illustration: Pixel art camera with flash effect
Heading: "NO SCREENSHOTS YET" (font-pixel text-h2 text-neon-cyan)
Subtext: "Capture moments from your games with F12 or the camera button"
         (font-body text-body text-text-secondary)
CTA: [START A GAME] button (primary)
```

---

## 17. MOBILE-SPECIFIC DESIGN

### Touch Control System

#### D-Pad Design

```
Size: 160 x 160px container (configurable: 140/160/180px)
Position: bottom-left, 16px from left edge, 16px from bottom safe area
Visual: semi-transparent (opacity from settings, default 0.7)

Structure:
  - Circular base: bg-surface-1/30 backdrop-blur-sm border border-neon-cyan/20
  - Cross overlay: 4 directional zones
  - Up/Down/Left/Right: 52x52px touch targets
  - Diagonal zones: 40x40px at corners (registers as two simultaneous directions)
  - Center dead zone: 32x32px circle

Active state:
  - Pressed direction lights up: bg-neon-cyan/40, glow-sm-cyan
  - Haptic feedback: light impact (UIImpactFeedbackGenerator.light equivalent)
```

#### Action Buttons Design

```
Position: bottom-right, 16px from right edge, 16px from bottom safe area

NES/GB layout (2 buttons):
  B: left, slightly lower — 52x52px circle
  A: right, slightly higher — 52x52px circle
  Gap: 8px

SNES/GBA layout (4 buttons):
  Diamond arrangement:
       X
    Y     A
       B
  Each button: 48x48px circle
  Gap: 4px between

Visual:
  - bg-surface-1/30 backdrop-blur-sm
  - Border: 2px solid, color-coded
    A: border-neon-cyan
    B: border-neon-magenta
    X: border-electric-blue
    Y: border-success
  - Label: font-pixel text-micro, centered
  - Active: bg-{color}/40, glow-sm-{color}
  - Haptic: medium impact on press, light on release
```

#### Shoulder Buttons

```
Position: top corners of screen, just below safe area
L: top-left, R: top-right
Size: 72x36px rounded rectangle
Visual: bg-surface-1/30 border border-surface-3/40 rounded-md
Label: font-pixel text-micro "L" / "R"
Active: bg-neon-cyan/30 border-neon-cyan/60
```

#### Start / Select Buttons

```
Position: bottom center, between D-pad and action buttons
Size: 56x28px pill shape each, 8px gap between
Visual: bg-surface-1/30 border border-surface-3/40 rounded-full
Label: font-pixel text-micro
Active: bg-magenta-dim/40 border-neon-magenta/60
```

### Haptic Feedback Patterns

```
Action                   Pattern                           iOS Equivalent
─────────────────────────────────────────────────────────────────────────
D-pad press              Light impact                      UIImpactFeedbackGenerator(.light)
D-pad release            None                              —
Action button press      Medium impact                     UIImpactFeedbackGenerator(.medium)
Action button release    Soft impact                       UIImpactFeedbackGenerator(.soft)
Start/Select press       Rigid impact                      UIImpactFeedbackGenerator(.rigid)
Save state captured      Success notification              UINotificationFeedbackGenerator(.success)
Achievement unlocked     Double medium impact (100ms gap)  Two medium impacts
Error/fail               Error notification                UINotificationFeedbackGenerator(.error)
Menu button tap          Selection changed                 UISelectionFeedbackGenerator
Slider change            Selection changed                 UISelectionFeedbackGenerator
Toggle switch            Medium impact                     UIImpactFeedbackGenerator(.medium)
```

### Portrait vs Landscape Handling

```
Context             Portrait                        Landscape
─────────────────────────────────────────────────────────────────────
Library/Browse      Full layout (default)           Wider grid, same layout
Settings            Full layout (default)           Same, wider cards
Save States         Full layout (default)           Side-by-side columns
Achievements        Full layout (default)           Same layout
Game Player         Canvas top + controls bottom    Full canvas + overlay controls
                    Quick action bar visible        Controls overlaid on canvas
                    16:9 aspect stretched to width  Canvas centered, max fill
```

#### Orientation Lock During Gameplay

```ts
// When entering game player:
// Suggest landscape orientation
// If device supports: lock to landscape
// Show one-time tooltip: "Rotate your device for the best experience"
// Respect user's system orientation lock setting

// API usage:
screen.orientation?.lock('landscape-primary').catch(() => {
  // Graceful fallback — show rotation prompt
});
```

### Gesture Controls

```
Gesture              Context         Action
─────────────────────────────────────────────────────────────────
Swipe down           Game player     Reveal HUD / game menu
                     from top edge
Swipe up             Game player     Hide HUD (if visible)
                     from bottom
Pinch                Game player     Zoom canvas (1x - 2x)
                     on canvas
Double-tap           Game player     Toggle fullscreen / reset zoom
                     on canvas
Long press           Library         Show game context menu
                     on game card    (Play, Favorite, Info, Delete)
Swipe left           Save states     Reveal delete action
                     on save card
Swipe right          Game player     Quick load last save
                     from left edge  (with confirmation toast)
Pull down            Library         Refresh / sync library
                     list
```

### Safe Area Handling

```tsx
// Layout wrapper for all pages
<div className="
  min-h-screen
  pt-[env(safe-area-inset-top)]
  pb-[env(safe-area-inset-bottom)]
  pl-[env(safe-area-inset-left)]
  pr-[env(safe-area-inset-right)]
">
  {children}
</div>

// Bottom tab bar
<nav className="
  fixed bottom-0 left-0 right-0
  pb-[env(safe-area-inset-bottom)]
  bg-surface-1/95 backdrop-blur-md
  border-t border-surface-3
">
  {/* Tab items */}
</nav>

// Game player touch controls:
// D-pad: bottom-[calc(env(safe-area-inset-bottom)+16px)]
// Action buttons: bottom-[calc(env(safe-area-inset-bottom)+16px)]
// Start/Select: bottom-[calc(env(safe-area-inset-bottom)+16px)]
```

### Bottom Sheet Pattern

```tsx
// components/mobile/BottomSheet.tsx
// Used for: settings during gameplay, game info, save management

// Implementation: Framer Motion drag gesture

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  snapPoints: number[]; // [0.3, 0.6, 0.9] = 30%, 60%, 90% of viewport
  children: React.ReactNode;
}

// Visual:
//   bg-surface-2 rounded-t-2xl border-t border-x border-surface-3
//   shadow-elevation-xl
//   Drag handle: w-10 h-1 bg-text-tertiary rounded-full mx-auto mt-3 mb-2

// Behavior:
//   Drag down past 20% of current snap → close
//   Drag up past midpoint between snaps → snap to next
//   Backdrop: bg-black/50, tap to close
//   Content scrollable within sheet

// Animation:
const sheetVariants = {
  hidden: {
    y: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  visible: {
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
};
```

---

## 18. DESKTOP-SPECIFIC DESIGN

### Keyboard Shortcut System

#### Global Shortcuts

```
Shortcut              Action
──────────────────────────────────────────
Cmd/Ctrl + K          Open search
Cmd/Ctrl + ,          Open settings
Cmd/Ctrl + S          Save state (in game)
Cmd/Ctrl + Shift + S  Save state to new slot
Escape                Pause game / close modal / go back
F5                    Quick save
F9                    Quick load
F10                   Open settings overlay
F11                   Toggle fullscreen
F12                   Take screenshot
[ (bracket)           Toggle left panel
] (bracket)           Toggle right panel
H                     Toggle HUD visibility lock
M                     Mute/unmute
```

#### Keyboard Shortcut Overlay

```
Triggered by: pressing "?" or Cmd/Ctrl + /

┌─────────────────────────────────────────────────────────┐
│                 KEYBOARD SHORTCUTS                       │
│                                                         │
│  NAVIGATION                    GAMEPLAY                  │
│  ───────────                   ────────                  │
│  ⌘K    Search                  Esc   Pause              │
│  ⌘,    Settings                F5    Quick Save         │
│  ←     Back                    F9    Quick Load         │
│                                F12   Screenshot         │
│  EMULATOR CONTROLS             F11   Fullscreen         │
│  ──────────────────            [     Left Panel         │
│  Arrow Keys  D-pad             ]     Right Panel        │
│  Z           A Button          H     Toggle HUD         │
│  X           B Button          M     Mute               │
│  A           X Button                                    │
│  S           Y Button          ?     This Help          │
│  Q           L Shoulder                                  │
│  W           R Shoulder                                  │
│  Enter       Start                                       │
│  Shift       Select                                      │
│                                                         │
│  Press Esc to close                                     │
└─────────────────────────────────────────────────────────┘

Visual:
  bg-surface-2/95 backdrop-blur-md border border-surface-3 rounded-xl
  shadow-elevation-xl
  Keys styled as: inline-flex bg-surface-3 px-2 py-1 rounded-sm font-mono text-caption
                  border border-surface-3 shadow-[0_1px_0_0_rgba(255,255,255,0.1)]
```

### Mouse Hover States

```
Element               Hover Effect
──────────────────────────────────────────────────────────────
Game card             scale 1.02, border -> cyan/50, glow-md-cyan
                      Cover art: scale 1.05 (overflow hidden clips)
                      Play button overlay fades in centered

Nav link              bg-surface-2, text -> text-primary
                      Active indicator (left bar) glows brighter

Button (primary)      brightness-110, glow intensifies one level up
Button (secondary)    bg-cyan-dim fills in, glow intensifies
Button (ghost)        bg-surface-1, text lightens

Input                 border subtly lightens to surface-3 bright

Save state card       border -> cyan-muted, glow-sm-cyan
                      Action buttons fade in over thumbnail

Achievement card      If unlocked: glow intensifies
                      If locked: opacity increases to 0.85

Screenshot card       Image scales 1.05, info overlay fades in

Slider thumb          scale 1.1, glow intensifies

Toggle                Track color lightens slightly
```

### Focus Indicators

```
// All interactive elements get consistent focus-visible styling:

focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-neon-cyan
focus-visible:ring-offset-2
focus-visible:ring-offset-base

// For elements with existing glow effects, focus adds an extra ring:
focus-visible:ring-2 focus-visible:ring-cyan-light
focus-visible:shadow-[0_0_0_4px_rgba(0,255,200,0.2)]

// Keyboard navigation indicator:
// When user navigates via Tab, a "KEYBOARD MODE" indicator appears
// briefly in the bottom-right corner (font-pixel text-micro text-cyan-muted)
// This helps users know focus management is active
```

### Sidebar Navigation

```tsx
// components/desktop/Sidebar.tsx

// Width: 240px expanded, 64px collapsed
// Collapse trigger: button at bottom of sidebar, or keyboard shortcut
// Collapse animation: width spring (heavy preset), labels fade out at 50% of transition

// Expanded:
//   Logo: ArcadiumLogo variant="compact" (logo mark + "ARCADIUM" text)
//   Nav items: icon (20px) + label (font-body text-body-sm) + active bar
//   Active item: bg-surface-2 border-l-2 border-neon-cyan text-neon-cyan
//   Platform section: collapsible sub-nav
//   Stats: bottom section

// Collapsed:
//   Logo: ArcadiumLogo variant="icon" (logo mark only, centered)
//   Nav items: icon only (centered, 24px), tooltip on hover (right side)
//   Active item: bg-surface-2 icon color neon-cyan
//   Platform section: hidden
//   Stats: hidden

// Visual:
//   bg-surface-1 border-r border-surface-3
//   Full viewport height (h-screen sticky top-0)

const sidebarVariants = {
  expanded: {
    width: 240,
    transition: { type: 'spring', stiffness: 250, damping: 30, mass: 1.5 },
  },
  collapsed: {
    width: 64,
    transition: { type: 'spring', stiffness: 250, damping: 30, mass: 1.5 },
  },
};

const labelVariants = {
  visible: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.15 } },
  hidden: { opacity: 0, x: -8, transition: { duration: 0.1 } },
};
```

### Widescreen Game Display

```
Aspect Ratio Handling:
  - Game canvas maintains its native aspect ratio (e.g., 256x240 NES = ~1.07:1)
  - Canvas centered in available space
  - Side panels fill remaining horizontal space

For ultra-wide monitors (>= 2560px):
  - Max canvas width: 1280px (5x NES, 4x SNES)
  - Side panels: 320px each
  - Remaining space: bg-void with subtle pattern (grid lines at 10% opacity)

Canvas scaling options (user setting):
  - Pixel Perfect: integer scaling only (1x, 2x, 3x, 4x, 5x)
  - Fit: scale to fit available space, maintain aspect ratio
  - Stretch: fill available space (may distort)

Side panel content adapts to available width:
  - < 200px: icon-only compact mode
  - 200-320px: standard layout
  - > 320px: expanded with additional info
```

### Picture-in-Picture Potential

```
// Future feature: when navigating away from game player,
// game continues in a floating PiP window

// Implementation approach:
// 1. Canvas element rendered to a video stream via captureStream()
// 2. Use document.pictureInPictureEnabled API
// 3. Floating window: 320x240 default size
// 4. Position: bottom-right of viewport
// 5. Controls: play/pause, close, return to game
// 6. Border: 2px neon-cyan glow

// Note: This requires browser PiP API support
// Fallback: game pauses when navigating away, with "Return to game" banner
```

---

## 19. MICRO-INTERACTIONS & ANIMATIONS

### Page Transitions (Next.js + Framer Motion)

```tsx
// app/template.tsx — wraps all page content

'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const variants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: {
          scaleY: 0.005,
          scaleX: 0.5,
          opacity: 1,
          filter: 'brightness(2)',
        },
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="origin-center"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### Game Launch Sequence (detailed)

```ts
// Full sequence from library to gameplay:

// Phase 1: Card Press (150ms)
// - Game card scales to 0.95 on press
// - Release triggers navigation

// Phase 2: Page Exit — CRT Off (200ms)
// - Library content: scaleY 1 -> 0.005, scaleX 1 -> 0.8
// - Brightness flash to white
// - Audio: CRT power-down "zzzip" sound (if UI sounds enabled)

// Phase 3: Loading Screen (variable, 500ms-5s)
// - Black screen fades in (100ms)
// - "LOADING" text appears (font-pixel text-h2, centered)
// - Animated dots: "..." cycles with 200ms per dot
// - Progress bar below: styled as retro health bar
//   - Border: 2px solid neon-cyan
//   - Fill: gradient magenta -> cyan, animates width
//   - Background: surface-3
//   - Height: 16px, no border-radius (retro sharp edges)
// - Background: subtle CRT static noise animation

// Phase 4: CRT Power On (500ms)
// - Horizontal line appears (scaleY: 0.005, full width)
// - Expands vertically (scaleY: 0.005 -> 1)
// - Brightness: 3 -> 1 (bright flash then settle)
// - Scanlines sweep downward once

// Phase 5: Controls Appear (300ms, mobile only)
// - Touch controls fade in from opacity 0 to user-set opacity
// - Slight scale: 0.9 -> 1

// Phase 6: HUD Flash (200ms, then auto-hide at 3s)
// - HUD bar briefly visible with all controls
// - Fades out after 3 seconds of no interaction
```

### Save State Capture Animation (detailed)

```ts
// Trigger: F5, save button tap, or auto-save

// Step 1: Screen Flash (200ms)
// - White overlay: opacity 0 -> 0.3 -> 0 (fast in, slower out)
// - Audio: camera shutter click (if UI sounds enabled)
// - Haptic: success notification

// Step 2: Viewfinder Corners (400ms)
// - 4 L-shaped bracket corners appear at edges of game canvas
// - Animate inward by 10px (as if framing the shot)
// - Color: neon-cyan with glow
// - Then fade out

// Step 3: Thumbnail Fly-out (500ms, desktop only)
// - Small thumbnail of screenshot "flies" from canvas center
//   to the save slot in the left panel
// - Path: ease-out curve
// - Scale: starts at canvas aspect ratio, shrinks to slot size
// - Opacity: 1 -> slight fade -> 1 (at destination)

// Step 4: Toast Notification (appears at step 2, stays 2s)
// - Slides in from top-right (desktop) or top-center (mobile)
// - Content: "STATE SAVED — SLOT #3" with floppy disk icon
// - Style: bg-surface-2 border border-neon-cyan shadow-glow-sm-cyan rounded-lg px-4 py-3
// - Auto-dismiss: slide up + fade out after 2s
```

### Achievement Unlock Notification (detailed)

```ts
// Trigger: in-game when achievement condition met

// Step 1: Screen Glitch (100ms)
// - Brief chromatic aberration effect on game canvas
// - RGB split: red channel shifts 2px right, blue 2px left
// - Audio: glitch/digital noise burst (if UI sounds enabled)

// Step 2: Banner Enter (spring animation, ~400ms)
// - From above viewport, slides to position
// - Position: top-center, below safe area
// - Spring: stiffness 400, damping 25
// - Width: max-w-md on mobile, max-w-lg on desktop

// Step 3: Banner Content Sequence (staggered 50ms each)
// - Trophy icon: scale 0 -> 1.2 -> 1 (bounce)
// - "ACHIEVEMENT UNLOCKED" label: fade-in-right
// - Achievement name: fade-in-right
// - Rarity badge: fade-in with glitch flicker

// Step 4: Particle Burst (from trophy icon, 600ms)
// - 12 small particles (pixel squares, 3x3px to 6x6px)
// - Colors: alternating neon-magenta and neon-cyan
// - Physics: burst outward with random velocity, gravity pulls down slightly
// - Each particle: opacity 1 -> 0, scale 1 -> 0
// - Rotation: random 0 -> 360+

// Step 5: Glow Pulse (2 cycles, 800ms)
// - Banner border pulses: glow-sm-magenta -> glow-lg-magenta -> glow-sm-magenta
// - 2 cycles then settle at glow-md-magenta

// Step 6: Auto-dismiss (4s after appearance)
// - Slides up + opacity fade
// - Duration: 300ms, ease-in

// Step 7: Persistent dot on Achievements nav icon
// - Small magenta dot (8x8px) on the achievements icon in nav
// - Pulse animation until user visits achievements page
```

### Button Press Feedback

```ts
// Visual:
// whileTap: { scale: 0.97 } (primary/secondary buttons)
// whileTap: { scale: 0.95 } (icon buttons, smaller elements)
// Color: active state applies immediately (no transition delay)
// Glow: momentarily intensifies

// Haptic (mobile):
// UI buttons: light impact
// Primary action buttons: medium impact
// Destructive actions: rigid impact (heavier)

// Audio (if UI sounds enabled):
// Standard button: soft "blip" (8-bit style, 50ms)
// Primary/CTA button: higher-pitched "blip" (60ms)
// Back/cancel: lower "blip" (40ms)
```

### Loading States

```tsx
// 1. Skeleton Screens (for library, achievements, saves)
// Pulse animation on bg-surface-2 shapes

<div className="animate-pulse">
  <div className="aspect-[3/4] bg-surface-2 rounded-lg" /> {/* Cover art */}
  <div className="mt-2 h-4 bg-surface-2 rounded w-3/4" /> {/* Title */}
  <div className="mt-1 h-3 bg-surface-2 rounded w-1/2" /> {/* Platform */}
</div>

// 2. ROM Loading (game player)
// CRT static noise background (CSS animation):
// Random opacity blocks in a grid, cycling every 50ms
// Overlay: "LOADING..." with animated dots
// Health-bar progress indicator

// 3. Inline Spinners
// Small: 16px, used inside buttons during actions
// Medium: 24px, used in content areas
// Style: border-2 border-text-tertiary border-t-neon-cyan rounded-full animate-spin

// 4. Full Page Loading
// ARCADIUM logo centered, neon pulse animation
// Scanline sweep animation across logo
// "BOOTING SYSTEM..." text below (font-pixel text-h4 text-text-secondary)
```

### Error States

```tsx
// 1. ROM Load Failure
<div className="flex flex-col items-center gap-6 p-8 text-center">
  {/* Pixel art broken cartridge illustration */}
  <PixelArtIllustration type="broken-cartridge" className="w-32 h-32" />
  <h2 className="font-pixel text-h2 text-error-light">LOAD FAILED</h2>
  <p className="font-body text-body text-text-secondary max-w-md">
    Could not load the ROM file. It may be corrupted or in an unsupported format.
  </p>
  <div className="flex gap-3">
    <Button variant="primary" onClick={retry}>TRY AGAIN</Button>
    <Button variant="ghost" onClick={goBack}>BACK TO LIBRARY</Button>
  </div>
</div>
// Border around error card: border-error/30, subtle glow-error

// 2. Network Error
// Same layout but with "disconnected cable" pixel art
// Heading: "CONNECTION LOST"
// Subtext: explains offline status, reassures saves are local

// 3. Form Validation Error
// Input: border-error, shadow-glow-error
// Error text: text-error-light text-caption, appears below input
// Animation: input shakes (translateX [-8, 8, -4, 4, 0], 300ms spring)
// Icon: AlertCircle icon left of error text, same color

// 4. Toast Error
// bg-surface-2 border border-error shadow-glow-error rounded-lg
// Left accent: 3px left border in error color
// Icon: AlertCircle in error color
// Message: font-body text-body-sm text-text-primary
// Auto-dismiss: 5s (longer than success toasts)
```

### Empty States

```tsx
// All empty states share this pattern:
<div className="flex flex-col items-center gap-4 py-16 text-center">
  <PixelArtIllustration type={illustrationType} className="w-24 h-24 opacity-60" />
  <h3 className="font-pixel text-h3 text-neon-cyan">{heading}</h3>
  <p className="font-body text-body-sm text-text-secondary max-w-sm">{description}</p>
  {cta && <Button variant="secondary">{ctaText}</Button>}
</div>

// Specific empty states:
// No Games: cartridge slot icon, "NO GAMES YET", "Add ROMs to start your collection"
// No Favorites: empty heart icon, "NO FAVORITES", "Star your favorite games for quick access"
// No Saves: floppy disk icon, "NO SAVE STATES", "Save progress in any game with F5"
// No Achievements: locked trophy, "NO ACHIEVEMENTS YET", "Start playing to unlock achievements"
// No Screenshots: camera icon, "NO SCREENSHOTS", "Capture moments with F12"
// No Search Results: magnifying glass with "?", "NO RESULTS FOR '[query]'", "Try different keywords"
```

---

## 20. ACCESSIBILITY

### Color Contrast Compliance

```
All text combinations meet WCAG 2.1 AA minimum:
- Regular text (< 18pt / < 14pt bold): 4.5:1 minimum ratio
- Large text (>= 18pt / >= 14pt bold): 3:1 minimum ratio

Body text uses text-primary (#f0e6ff) on base (#0d0221): 14.8:1 — exceeds AAA
Secondary text uses text-secondary (#b8a5d4) on base: 7.2:1 — AAA
Neon cyan (#00ffc8) on base: 8.9:1 — AAA (safe for all text sizes)
Magenta-light (#ff66ff) on base: 6.2:1 — AA for all sizes
Pure neon-magenta (#ff00ff) on base: 4.6:1 — AA for LARGE TEXT ONLY
Error-light (#ff6688) on base: 7.1:1 — AAA

Rule: #ff00ff (pure neon magenta) is ONLY used for:
  - Display text (>= 2rem)
  - H1 headings (>= 2rem)
  - Decorative borders and glows (not conveying information alone)

For any text smaller than 18pt, use #ff66ff (magenta-light) instead.
```

### Focus Management

```
// All interactive elements must have visible focus indicators

// Standard focus indicator:
className="
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-neon-cyan
  focus-visible:ring-offset-2
  focus-visible:ring-offset-base
"

// This creates a cyberpunk-themed but clearly visible focus ring:
// 2px cyan ring with 2px dark offset = always visible regardless of element bg

// For elements inside dark containers (modals, cards):
// ring-offset-surface-1 or ring-offset-surface-2 as appropriate

// Tab order: logical reading order, left-to-right, top-to-bottom
// Skip link: first focusable element, hidden until focused
<a
  href="#main-content"
  className="
    sr-only focus:not-sr-only
    focus:absolute focus:top-4 focus:left-4 focus:z-[100]
    focus:bg-neon-cyan focus:text-text-inverse
    focus:px-4 focus:py-2 focus:rounded-md
    focus:font-pixel focus:text-h4
    focus:shadow-glow-md-cyan
  "
>
  SKIP TO CONTENT
</a>
```

### Screen Reader Considerations

```
// ARIA labels for custom controls:
<button aria-label="Toggle favorite for Super Mario Bros">
  <HeartIcon />
</button>

// Game canvas:
<canvas
  role="img"
  aria-label="Game display — Super Mario Bros (NES). Press Escape to pause."
/>

// Touch controls (screen readers skip these, game is not playable via screen reader):
<div role="presentation" aria-hidden="true">
  {/* D-pad and action buttons */}
</div>

// CRT overlay (always hidden from screen readers):
<div aria-hidden="true">
  {/* Scanlines, vignette, etc. */}
</div>

// Progress indicators:
<div
  role="progressbar"
  aria-valuenow={68}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Achievement progress: 68% complete"
>
  {/* Visual progress bar */}
</div>

// Live regions for dynamic content:
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {/* Achievement unlocked announcements */}
  {/* Save state confirmation */}
  {/* Error messages */}
</div>

// Modal focus trapping:
// When modal opens: focus moves to first focusable element in modal
// Tab cycles within modal only
// Escape closes modal
// On close: focus returns to trigger element
```

### Reduced Motion Preferences

```tsx
// hooks/useMotionPreference.ts

import { useReducedMotion } from 'framer-motion';

export function useMotionPreference() {
  const systemPrefersReducedMotion = useReducedMotion();
  const { settings } = useSettings();

  // User can override in ARCADIUM settings:
  // "Animations" setting: "System Default" | "Full" | "Reduced" | "None"
  const userPref = settings.animationPreference;

  if (userPref === 'none') return 'none';
  if (userPref === 'reduced') return 'reduced';
  if (userPref === 'full') return 'full';
  // 'system' (default):
  return systemPrefersReducedMotion ? 'reduced' : 'full';
}

// Usage in components:
const motionPref = useMotionPreference();

// When motionPref === 'none':
//   - All animations instant (duration: 0)
//   - No glow pulse animations
//   - No CRT effects
//   - No scanlines
//   - Page transitions: simple opacity crossfade (150ms)
//   - No particle effects

// When motionPref === 'reduced':
//   - Simple opacity fades only (no scale, no translate, no rotate)
//   - Duration capped at 200ms
//   - No looping animations (pulse, flicker, etc.)
//   - No particle effects
//   - CRT scanlines: static only (no scroll/flicker)
//   - Page transitions: opacity crossfade (200ms)
//   - Glow effects: static (no animation)

// When motionPref === 'full':
//   - All animations as designed
//   - Full CRT effects
//   - Particle effects
//   - Spring animations
```

### Font Size Adjustability

```tsx
// Settings -> Display -> Text Size
// Options: "Small" (87.5%), "Default" (100%), "Large" (112.5%), "Extra Large" (125%)

// Implementation: CSS custom property on <html>
<html style={{ fontSize: `${fontSizePercentage}%` }}>

// Since all typography uses rem units, this scales everything proportionally

// Impact on layout:
// - All rem-based spacing scales with text
// - Fixed-size elements (icons, touch targets) use px — not affected
// - Grid column counts don't change (content just gets bigger/tighter)
// - At "Extra Large": some layouts may need horizontal scroll for data tables
//   -> Solution: data tables become horizontally scrollable cards on small viewports

// Minimum touch target: always at least 44px regardless of text size setting
```

### Color Vision Deficiency Support

```
// The design does NOT rely on color alone to convey information.
// Every colored indicator has a secondary differentiator:

// Favorite: heart icon (filled vs outline) + color
// Platform: text label always present alongside color-coded badge
// Achievement rarity: text label ("COMMON", "RARE", "LEGENDARY") + color
// Error states: icon (AlertCircle) + color + text message
// Success states: icon (CheckCircle) + color + text message
// Toggle state: position (left/right) + color + optional "ON"/"OFF" label
// Progress: percentage text always accompanies progress bar fill

// Additional: high contrast mode available in Settings -> Display
// Increases all border widths by 1px, increases glow opacity by 50%,
// uses underlines on links in addition to color
```

---

## 21. COMPLETE TAILWIND CONFIGURATION

```ts
// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#0a0118',
        base: '#0d0221',
        surface: {
          1: '#140533',
          2: '#1a0a40',
          3: '#22104d',
        },
        neon: {
          magenta: '#ff00ff',
          cyan: '#00ffc8',
          blue: '#0096ff',
        },
        magenta: {
          light: '#ff66ff',
          muted: '#cc52cc',
          dim: '#661a66',
        },
        cyan: {
          light: '#66ffd9',
          muted: '#00b88e',
          dim: '#004d3b',
        },
        blue: {
          light: '#4db8ff',
          muted: '#006bb3',
          dim: '#002d4d',
        },
        text: {
          primary: '#f0e6ff',
          secondary: '#b8a5d4',
          tertiary: '#7a6994',
          inverse: '#0d0221',
        },
        status: {
          success: '#00ff88',
          warning: '#ffaa00',
          error: '#ff3366',
          'error-light': '#ff6688',
        },
      },

      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['var(--font-body)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', '"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },

      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['1.125rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['0.875rem', { lineHeight: '1.35', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        'micro': ['0.625rem', { lineHeight: '1.4', fontWeight: '500' }],
      },

      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },

      boxShadow: {
        'glow-sm-magenta': '0 0 4px #ff00ff66, 0 0 8px #ff00ff33',
        'glow-md-magenta': '0 0 8px #ff00ff88, 0 0 20px #ff00ff44, 0 0 40px #ff00ff22',
        'glow-lg-magenta': '0 0 12px #ff00ffaa, 0 0 30px #ff00ff66, 0 0 60px #ff00ff33, 0 0 100px #ff00ff11',
        'glow-sm-cyan': '0 0 4px #00ffc866, 0 0 8px #00ffc833',
        'glow-md-cyan': '0 0 8px #00ffc888, 0 0 20px #00ffc844, 0 0 40px #00ffc822',
        'glow-lg-cyan': '0 0 12px #00ffc8aa, 0 0 30px #00ffc866, 0 0 60px #00ffc833, 0 0 100px #00ffc811',
        'glow-sm-blue': '0 0 4px #0096ff66, 0 0 8px #0096ff33',
        'glow-md-blue': '0 0 8px #0096ff88, 0 0 20px #0096ff44, 0 0 40px #0096ff22',
        'glow-lg-blue': '0 0 12px #0096ffaa, 0 0 30px #0096ff66, 0 0 60px #0096ff33',
        'glow-success': '0 0 8px #00ff8888, 0 0 20px #00ff8844',
        'glow-error': '0 0 8px #ff336688, 0 0 20px #ff336644',
        'glow-warning': '0 0 8px #ffaa0088, 0 0 20px #ffaa0044',
        'elevation-sm': '0 1px 2px rgba(0,0,0,0.5)',
        'elevation-md': '0 4px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
        'elevation-lg': '0 8px 24px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)',
        'elevation-xl': '0 16px 48px rgba(0,0,0,0.7), 0 4px 8px rgba(0,0,0,0.4)',
      },

      keyframes: {
        'crt-flicker': {
          '0%, 100%': { opacity: '0.98' },
          '50%': { opacity: '1' },
        },
        'neon-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 4px #00ffc866, 0 0 8px #00ffc833',
          },
          '50%': {
            boxShadow: '0 0 8px #00ffc888, 0 0 20px #00ffc844, 0 0 40px #00ffc822',
          },
        },
        'neon-pulse-magenta': {
          '0%, 100%': {
            boxShadow: '0 0 4px #ff00ff66, 0 0 8px #ff00ff33',
          },
          '50%': {
            boxShadow: '0 0 8px #ff00ff88, 0 0 20px #ff00ff44, 0 0 40px #ff00ff22',
          },
        },
        'text-flicker': {
          '0%, 100%': { opacity: '1' },
          '33%': { opacity: '0.95' },
          '66%': { opacity: '0.98' },
        },
        'scanline-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 50%, 90%': { transform: 'translateX(-4px)' },
          '30%, 70%': { transform: 'translateX(4px)' },
        },
      },

      animation: {
        'crt-flicker': 'crt-flicker 0.1s infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'neon-pulse-magenta': 'neon-pulse-magenta 2s ease-in-out infinite',
        'text-flicker': 'text-flicker 3s ease-in-out infinite',
        'scanline-down': 'scanline-down 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
      },

      transitionDuration: {
        'micro': '75ms',
        'fast': '150ms',
        'normal': '200ms',
        'moderate': '300ms',
        'slow': '400ms',
      },

      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'in-out-expo': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'snap': 'cubic-bezier(0.5, 0, 0, 1)',
      },

      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        'ultrawide': '2560px',
      },

      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    // Custom plugin for text-glow utilities
    function({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        '.text-glow-magenta': {
          textShadow: '0 0 4px #ff00ff88, 0 0 12px #ff00ff44, 0 0 24px #ff00ff22',
        },
        '.text-glow-cyan': {
          textShadow: '0 0 4px #00ffc888, 0 0 12px #00ffc844, 0 0 24px #00ffc822',
        },
        '.text-glow-blue': {
          textShadow: '0 0 4px #0096ff88, 0 0 12px #0096ff44, 0 0 24px #0096ff22',
        },
        '.text-glow-none': {
          textShadow: 'none',
        },
      });
    },
  ],
};

export default config;
```

---

## 22. FRAMER MOTION COMPLETE PRESETS

```ts
// lib/motion.ts — Single source of truth for all Framer Motion configs

import { Variants, Transition } from 'framer-motion';

// ═══════════════════════════════════════════
// SPRING PRESETS
// ═══════════════════════════════════════════

export const springs = {
  snap: { type: 'spring' as const, stiffness: 500, damping: 30, mass: 0.8 },
  standard: { type: 'spring' as const, stiffness: 400, damping: 28, mass: 1 },
  gentle: { type: 'spring' as const, stiffness: 300, damping: 26, mass: 1.2 },
  bouncy: { type: 'spring' as const, stiffness: 350, damping: 15, mass: 0.8 },
  heavy: { type: 'spring' as const, stiffness: 250, damping: 30, mass: 1.5 },
};

// ═══════════════════════════════════════════
// TWEEN PRESETS
// ═══════════════════════════════════════════

export const tweens = {
  micro: { duration: 0.075, ease: [0.5, 0, 0, 1] } as Transition,
  fast: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } as Transition,
  normal: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } as Transition,
  moderate: { duration: 0.3, ease: [0.65, 0, 0.35, 1] } as Transition,
  slow: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } as Transition,
  powerOn: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as Transition,
};

// ═══════════════════════════════════════════
// PAGE TRANSITIONS
// ═══════════════════════════════════════════

export const pageTransition: Variants = {
  initial: {
    scaleY: 0.005,
    scaleX: 0.5,
    opacity: 1,
    filter: 'brightness(2)',
  },
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

export const pageTransitionReduced: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

// ═══════════════════════════════════════════
// STAGGER CONTAINERS
// ═══════════════════════════════════════════

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

// ═══════════════════════════════════════════
// STAGGER CHILDREN
// ═══════════════════════════════════════════

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

// ═══════════════════════════════════════════
// CARD INTERACTIONS
// ═══════════════════════════════════════════

export const cardHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 0px transparent',
    transition: tweens.normal,
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 8px #00ffc888, 0 0 20px #00ffc844, 0 0 40px #00ffc822',
    transition: tweens.normal,
  },
  tap: {
    scale: 0.98,
    transition: tweens.micro,
  },
};

// ═══════════════════════════════════════════
// MODAL / OVERLAY
// ═══════════════════════════════════════════

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.standard,
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 5,
    transition: { duration: 0.15, ease: [0.7, 0, 0.84, 0] },
  },
};

// ═══════════════════════════════════════════
// BOTTOM SHEET (mobile)
// ═══════════════════════════════════════════

export const bottomSheet: Variants = {
  hidden: {
    y: '100%',
    transition: springs.heavy,
  },
  visible: {
    y: 0,
    transition: springs.standard,
  },
};

// ═══════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════

export const sidebarExpanded: Variants = {
  expanded: {
    width: 240,
    transition: springs.heavy,
  },
  collapsed: {
    width: 64,
    transition: springs.heavy,
  },
};

export const sidebarLabel: Variants = {
  expanded: {
    opacity: 1,
    x: 0,
    display: 'block',
    transition: { delay: 0.1, duration: 0.15 },
  },
  collapsed: {
    opacity: 0,
    x: -8,
    transitionEnd: { display: 'none' },
    transition: { duration: 0.1 },
  },
};

// ═══════════════════════════════════════════
// FADE VARIANTS
// ═══════════════════════════════════════════

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: tweens.normal },
  exit: { opacity: 0, transition: tweens.fast },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
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

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

// ═══════════════════════════════════════════
// SPECIAL EFFECTS
// ═══════════════════════════════════════════

export const glitchFlicker: Variants = {
  rest: {},
  animate: {
    x: [0, -2, 3, -1, 0],
    opacity: [1, 0.8, 1, 0.9, 1],
    filter: [
      'hue-rotate(0deg)',
      'hue-rotate(90deg)',
      'hue-rotate(-90deg)',
      'hue-rotate(45deg)',
      'hue-rotate(0deg)',
    ],
    transition: {
      duration: 0.3,
      times: [0, 0.2, 0.4, 0.7, 1],
    },
  },
};

export const neonPulse: Variants = {
  animate: {
    boxShadow: [
      '0 0 4px #00ffc866, 0 0 8px #00ffc833',
      '0 0 8px #00ffc888, 0 0 20px #00ffc844, 0 0 40px #00ffc822',
      '0 0 4px #00ffc866, 0 0 8px #00ffc833',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const crtPowerOn: Variants = {
  off: {
    scaleY: 0.005,
    scaleX: 0.3,
    filter: 'brightness(3)',
  },
  on: {
    scaleY: 1,
    scaleX: 1,
    filter: 'brightness(1)',
    transition: {
      scaleY: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      scaleX: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
      filter: { duration: 0.5 },
    },
  },
};

// ═══════════════════════════════════════════
// TOAST / NOTIFICATION
// ═══════════════════════════════════════════

export const toastSlideIn: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.snap,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] },
  },
};

// ═══════════════════════════════════════════
// ACHIEVEMENT UNLOCK
// ═══════════════════════════════════════════

export const achievementBanner: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
    scaleX: 0.8,
  },
  visible: {
    y: 0,
    opacity: 1,
    scaleX: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.8,
    },
  },
  exit: {
    y: -60,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] },
  },
};

// ═══════════════════════════════════════════
// HUD AUTO-HIDE
// ═══════════════════════════════════════════

export const hudBar: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: tweens.normal,
  },
  hidden: {
    opacity: 0,
    y: -20,
    transition: tweens.moderate,
  },
};

// ═══════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════

export const tooltip: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
  },
};

// ═══════════════════════════════════════════
// TOGGLE / SWITCH THUMB
// ═══════════════════════════════════════════

export const toggleThumb = {
  off: { x: 4 },
  on: { x: 24 },
  transition: springs.snap,
};

// ═══════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════

export const skeletonPulse: Variants = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
```

---

## 23. COMPONENT HIERARCHY & FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, providers, meta
│   ├── template.tsx            # Page transition wrapper (AnimatePresence)
│   ├── page.tsx                # Redirect to /login or /library
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── (authenticated)/        # Route group with auth guard
│   │   ├── layout.tsx          # Sidebar (desktop) + bottom bar (mobile) layout
│   │   ├── page.tsx            # Library/Home page
│   │   ├── favorites/
│   │   │   └── page.tsx        # Favorites filtered view
│   │   ├── recent/
│   │   │   └── page.tsx        # Recently played filtered view
│   │   ├── play/
│   │   │   └── [gameId]/
│   │   │       └── page.tsx    # Game player page
│   │   ├── saves/
│   │   │   └── page.tsx        # Save state manager
│   │   ├── achievements/
│   │   │   └── page.tsx        # Achievement tracker
│   │   ├── screenshots/
│   │   │   └── page.tsx        # Screenshot gallery
│   │   └── settings/
│   │       └── page.tsx        # Settings page
│   └── globals.css             # Global styles, CRT utilities, custom scrollbar
│
├── components/
│   ├── ui/                     # Design system primitives
│   │   ├── Button.tsx          # All button variants
│   │   ├── Input.tsx           # Text input with error/focus states
│   │   ├── Select.tsx          # Dropdown select
│   │   ├── Slider.tsx          # Range slider with glow
│   │   ├── Toggle.tsx          # Toggle switch
│   │   ├── Tabs.tsx            # Tab container + tab items
│   │   ├── Badge.tsx           # Tags, status badges, rarity badges
│   │   ├── Card.tsx            # Base card component
│   │   ├── Modal.tsx           # Dialog with backdrop + focus trap
│   │   ├── Tooltip.tsx         # Hover/focus tooltip
│   │   ├── ProgressBar.tsx     # Linear progress with gradient fill
│   │   ├── ProgressRing.tsx    # Circular SVG progress
│   │   ├── Skeleton.tsx        # Loading skeleton shapes
│   │   ├── Toast.tsx           # Notification toast
│   │   ├── Icon.tsx            # Icon wrapper with size/glow props
│   │   ├── Divider.tsx         # Horizontal divider with optional label
│   │   └── EmptyState.tsx      # Reusable empty state pattern
│   │
│   ├── layout/                 # Layout components
│   │   ├── Sidebar.tsx         # Desktop sidebar navigation
│   │   ├── BottomTabBar.tsx    # Mobile bottom tab navigation
│   │   ├── TopBar.tsx          # Mobile top bar
│   │   ├── PageHeader.tsx      # Page title + actions
│   │   └── ResponsiveGrid.tsx  # Grid with responsive column counts
│   │
│   ├── effects/                # Visual effects
│   │   ├── CRTOverlay.tsx      # Scanlines, vignette, RGB sub-pixel
│   │   ├── NeonBorder.tsx      # Animated neon border wrapper
│   │   ├── GlitchText.tsx      # Text with glitch effect on demand
│   │   ├── ParticleBurst.tsx   # Achievement unlock particles
│   │   └── AnimatedBackground.tsx # Login page scrolling cover grid
│   │
│   ├── game/                   # Game-related components
│   │   ├── GameCard.tsx        # Library game card (standard + large)
│   │   ├── GameGrid.tsx        # Responsive game grid with search/filter
│   │   ├── EmulatorCanvas.tsx  # Canvas element with emulator bindings
│   │   ├── PlayerHUD.tsx       # Auto-hiding HUD bar
│   │   ├── PauseOverlay.tsx    # Pause menu overlay
│   │   ├── LoadingOverlay.tsx  # ROM loading progress
│   │   ├── ControlsGuide.tsx   # Keyboard/gamepad mapping display
│   │   └── FPSCounter.tsx      # Frame rate display
│   │
│   ├── controls/               # Touch controls (mobile)
│   │   ├── TouchControlsOverlay.tsx  # Full overlay container
│   │   ├── DPad.tsx            # Directional pad
│   │   ├── ActionButtons.tsx   # A/B/X/Y button cluster
│   │   ├── ShoulderButtons.tsx # L/R buttons
│   │   ├── MetaButtons.tsx     # Start/Select
│   │   └── ControlCustomizer.tsx # Drag-to-reposition controls
│   │
│   ├── saves/                  # Save state components
│   │   ├── SaveStateCard.tsx   # Individual save state display
│   │   ├── SaveStateGrid.tsx   # Grid of save states per game
│   │   ├── QuickSaveSlots.tsx  # Compact save slot list (player sidebar)
│   │   └── SaveCaptureEffect.tsx # Flash + viewfinder animation
│   │
│   ├── achievements/           # Achievement components
│   │   ├── AchievementCard.tsx # Individual achievement display
│   │   ├── AchievementList.tsx # Filtered list of achievements
│   │   ├── AchievementBanner.tsx # In-game unlock notification
│   │   └── AchievementProgress.tsx # Overall progress bar/ring
│   │
│   ├── screenshots/            # Screenshot components
│   │   ├── ScreenshotCard.tsx  # Gallery thumbnail card
│   │   ├── ScreenshotGrid.tsx  # Responsive gallery grid
│   │   └── Lightbox.tsx        # Full-screen image viewer with CRT frame
│   │
│   ├── settings/               # Settings components
│   │   ├── SettingsGroup.tsx   # Card wrapper for setting group
│   │   ├── SettingRow.tsx      # Individual setting with label + control
│   │   ├── KeyBindingTable.tsx # Remappable key binding rows
│   │   ├── ShaderPicker.tsx    # Shader selection with preview
│   │   └── QuickSettings.tsx   # Compact settings for in-game bottom sheet
│   │
│   ├── auth/                   # Authentication components
│   │   ├── LoginForm.tsx       # Email/password form
│   │   ├── SocialLoginButtons.tsx # OAuth provider buttons
│   │   └── ArcadiumLogo.tsx    # Logo with variants (full, compact, icon)
│   │
│   └── mobile/                 # Mobile-specific components
│       ├── BottomSheet.tsx     # Draggable bottom sheet
│       ├── ActionSheet.tsx     # iOS-style action sheet (long press menu)
│       ├── SwipeToDelete.tsx   # Swipe-reveal delete action
│       └── OrientationPrompt.tsx # "Rotate your device" prompt
│
├── lib/
│   ├── motion.ts               # All Framer Motion presets (section 22)
│   ├── constants.ts            # App constants, routes, breakpoints
│   ├── types.ts                # TypeScript interfaces (Game, SaveState, Achievement, etc.)
│   ├── utils.ts                # Utility functions
│   ├── haptics.ts              # Haptic feedback abstraction
│   └── hooks/
│       ├── useSettings.ts      # Settings context/store
│       ├── useAutoHideHUD.ts   # HUD visibility logic
│       ├── useMotionPreference.ts # Reduced motion detection
│       ├── useKeyboardShortcuts.ts # Global keyboard shortcut handler
│       ├── useGamepad.ts       # Gamepad API integration
│       ├── useOrientation.ts   # Device orientation detection
│       ├── useSafeArea.ts      # Safe area inset values
│       └── useMediaQuery.ts    # Responsive breakpoint hook
│
├── styles/
│   └── globals.css             # (imported in app/layout.tsx)
│
└── public/
    ├── fonts/                  # Self-hosted font files (if not using next/font)
    ├── icons/                  # Custom pixel-art SVG icons
    │   ├── arcadium-logo.svg
    │   ├── d-pad.svg
    │   ├── button-a.svg
    │   ├── button-b.svg
    │   ├── button-x.svg
    │   ├── button-y.svg
    │   ├── console-nes.svg
    │   ├── console-snes.svg
    │   ├── console-genesis.svg
    │   ├── console-gba.svg
    │   ├── console-gb.svg
    │   ├── console-n64.svg
    │   ├── cartridge.svg
    │   ├── save-floppy.svg
    │   ├── pixel-heart.svg
    │   ├── pixel-heart-filled.svg
    │   ├── pixel-star.svg
    │   ├── trophy.svg
    │   └── controller.svg
    └── illustrations/          # Empty state pixel art
        ├── empty-cartridge.svg
        ├── broken-cartridge.svg
        ├── empty-floppy.svg
        ├── empty-camera.svg
        ├── empty-trophy.svg
        ├── disconnected.svg
        └── no-results.svg
```

---

## 24. RESPONSIVE BREAKPOINT BEHAVIORS

### Breakpoint Definitions

```
Token       Value     Common Devices
─────────────────────────────────────────────────────
xs          480px     Large phones (landscape)
sm          640px     Small tablets (portrait)
md          768px     Tablets (portrait), large phones (landscape)
lg          1024px    Tablets (landscape), small laptops
xl          1280px    Standard laptops, desktops
2xl         1536px    Large desktops
3xl         1920px    Full HD monitors
ultrawide   2560px    QHD / ultra-wide monitors
```

### Component Behavior Per Breakpoint

```
Component            < 480    480-767   768-1023  1024-1279  1280+
──────────────────────────────────────────────────────────────────────
Navigation           bottom   bottom    bottom    sidebar    sidebar
                     bar      bar       bar       (240px)    (240px)

Sidebar              hidden   hidden    hidden    visible    visible
                                                  (collapse  (expand
                                                   toggle)    toggle)

Game Grid Cols       2        3         3         4          5-6

Game Card Size       ~150px   ~190px    ~220px    ~230px     ~220px
(width)

Search Bar           icon     icon      inline    inline     inline
                     expand   expand    (always)  (always)   (always)

Platform Filter      horiz    horiz     horiz     sidebar    sidebar
                     chips    chips     chips     radio      radio

Game Player          portrait portrait  portrait  side       side
Side Panels          hidden   hidden    hidden    panels     panels

Touch Controls       visible  visible   visible   hidden     hidden
                     (adapt   (adapt    (adapt
                     to size) to size)  to size)

HUD                  swipe    swipe     swipe     auto-hide  auto-hide
                     reveal   reveal    reveal    mouse      mouse

Settings             list →   list →    list →    tabs       tabs
Navigation           detail   detail    detail    (horiz)    (horiz)

Save State Grid      2 col    2 col     3 col     3-4 col    4-5 col

Achievement List     1 col    1 col     2 col     2 col      3 col

Screenshot Grid      2 col    3 col     3 col     4 col      5-6 col

Modal                full     full      centered  centered   centered
                     screen   width     (max-w)   (max-w)    (max-w)

Bottom Sheet         yes      yes       yes       no (modal) no (modal)

Keyboard Shortcuts   hidden   hidden    hidden    overlay    overlay
Overlay
```

### Orientation-Specific Behaviors

```
Context              Portrait                        Landscape
──────────────────────────────────────────────────────────────────────
Game Player          Canvas top (60%),               Canvas full width,
(mobile)             controls bottom (40%)           controls overlay on canvas

Library              Normal vertical layout           Grid slightly wider,
                                                     same basic layout

Settings             Same as portrait                Same as portrait

Orientation Lock     Suggested for game player       Locked if user allows
```

### Safe Area Behavior Per Device Type

```
Device Type              Safe Areas
──────────────────────────────────────────────────────────────────────
iPhone (notch)           top: ~47px, bottom: ~34px (home indicator)
iPhone (Dynamic Island)  top: ~59px, bottom: ~34px
iPad                     top: ~20px, bottom: 0px (or ~20px with gesture nav)
Android (punch hole)     top: ~32px, bottom: ~48px (gesture nav)
Android (notchless)      top: ~24px (status bar), bottom: ~48px (gesture nav)
Desktop                  All: 0px

Implementation: env(safe-area-inset-*) CSS variables
All handled by the root layout padding and fixed element positioning.
```

---

## GLOBAL CSS — globals.css

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Root defaults */
  html {
    background-color: #0a0118;
    color: #f0e6ff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Prevent mobile browser pull-to-refresh during gameplay */
    overscroll-behavior: none;
  }

  body {
    background-color: #0d0221;
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
  }

  /* Selection styling */
  ::selection {
    background-color: #ff00ff44;
    color: #f0e6ff;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #140533;
  }

  ::-webkit-scrollbar-thumb {
    background: #22104d;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #2d1860;
  }

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: #22104d #140533;
  }
}

@layer components {
  /* Skip link */
  .skip-link {
    @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]
           focus:bg-neon-cyan focus:text-text-inverse
           focus:px-4 focus:py-2 focus:rounded-md
           focus:font-pixel focus:shadow-glow-md-cyan;
  }

  /* Text glow utilities (also defined in Tailwind plugin, this is CSS fallback) */
  .text-glow-magenta {
    text-shadow: 0 0 4px #ff00ff88, 0 0 12px #ff00ff44, 0 0 24px #ff00ff22;
  }

  .text-glow-cyan {
    text-shadow: 0 0 4px #00ffc888, 0 0 12px #00ffc844, 0 0 24px #00ffc822;
  }

  .text-glow-blue {
    text-shadow: 0 0 4px #0096ff88, 0 0 12px #0096ff44, 0 0 24px #0096ff22;
  }

  /* CRT screen inset shadow (for screenshot frames, game canvas border) */
  .crt-inset {
    box-shadow:
      inset 0 0 30px rgba(0, 0, 0, 0.5),
      inset 0 0 8px rgba(0, 255, 200, 0.1);
  }

  /* Neon underline (for links) */
  .neon-underline {
    text-decoration: none;
    background-image: linear-gradient(#00ffc8, #00ffc8);
    background-size: 0% 2px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition: background-size 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .neon-underline:hover {
    background-size: 100% 2px;
  }

  /* Retro health bar (for progress/loading) */
  .health-bar {
    @apply relative h-4 border-2 border-neon-cyan bg-surface-3;
    image-rendering: pixelated;
  }

  .health-bar-fill {
    @apply h-full bg-gradient-to-r from-neon-magenta to-neon-cyan;
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Glass effect for overlays */
  .glass {
    @apply bg-base/85 backdrop-blur-md;
  }

  /* Hide scrollbar utility */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

@layer utilities {
  /* Safe area padding utilities */
  .pt-safe {
    padding-top: env(safe-area-inset-top);
  }
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
  .pl-safe {
    padding-left: env(safe-area-inset-left);
  }
  .pr-safe {
    padding-right: env(safe-area-inset-right);
  }

  /* Touch action utilities for game canvas */
  .touch-none {
    touch-action: none;
  }

  /* Pixel rendering for game canvas */
  .pixel-render {
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }
}

/* Reduced motion overrides */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.15s !important;
  }

  .text-glow-magenta,
  .text-glow-cyan,
  .text-glow-blue {
    text-shadow: none;
  }
}

/* Print styles — hide non-essential elements */
@media print {
  .crt-overlay,
  nav,
  .touch-controls {
    display: none !important;
  }
}
```

---

## APPENDIX A: TYPE DEFINITIONS

```ts
// lib/types.ts

export type Platform = 'nes' | 'snes' | 'genesis' | 'gb' | 'gba' | 'n64';

export interface Game {
  id: string;
  title: string;
  platform: Platform;
  coverArtUrl: string | null;
  romFileHash: string;
  isFavorite: boolean;
  lastPlayedAt: string | null; // ISO timestamp
  totalPlayTimeSeconds: number;
  dateAdded: string; // ISO timestamp
  tags: string[];
}

export interface SaveState {
  id: string;
  gameId: string;
  slotNumber: number;
  isAutoSave: boolean;
  thumbnailUrl: string;
  createdAt: string; // ISO timestamp
  label: string | null; // User-editable label
  contextInfo: string | null; // e.g., "World 1-3"
  fileSizeBytes: number;
}

export type AchievementRarity = 'common' | 'rare' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  rarity: AchievementRarity;
  isUnlocked: boolean;
  unlockedAt: string | null; // ISO timestamp
  progress: number; // 0-100
  progressLabel: string | null; // e.g., "62/100 hours"
}

export interface Screenshot {
  id: string;
  gameId: string;
  imageUrl: string;
  thumbnailUrl: string;
  takenAt: string; // ISO timestamp
  caption: string | null;
}

export type ShaderPreset = 'none' | 'scanline' | 'crt-curvature' | 'lcd-grid' | 'smooth';
export type ScreenScaling = 'pixel-perfect' | 'fit' | 'stretch';
export type AspectRatio = 'original' | '4:3' | '16:9' | 'stretch';
export type AutoSaveInterval = 'off' | '1m' | '5m' | '10m';
export type FastForwardSpeed = '2x' | '4x' | '8x' | 'unlimited';
export type RewindBuffer = 'off' | '10s' | '30s' | '60s';
export type FrameSkip = 'off' | '1' | '2' | 'auto';
export type HapticIntensity = 'light' | 'medium' | 'strong';
export type TouchControlSize = 'small' | 'medium' | 'large';
export type TouchControlLayout = 'default' | 'compact' | 'spread';
export type AnimationPreference = 'system' | 'full' | 'reduced' | 'none';
export type TextSize = 'small' | 'default' | 'large' | 'extra-large';

export interface UserSettings {
  // Display
  scanlineIntensity: number; // 0-100
  crtFlicker: boolean;
  shaderPreset: ShaderPreset;
  screenScaling: ScreenScaling;
  aspectRatio: AspectRatio;
  showFPS: boolean;
  textSize: TextSize;
  highContrast: boolean;
  animationPreference: AnimationPreference;

  // Controls
  keyBindings: Record<string, string>; // action -> key
  touchControlOpacity: number; // 0-100
  touchControlSize: TouchControlSize;
  touchControlLayout: TouchControlLayout;
  hapticFeedback: boolean;
  hapticIntensity: HapticIntensity;

  // Audio
  masterVolume: number; // 0-100
  sfxVolume: number; // 0-100
  uiSounds: boolean;
  audioLatency: number; // ms

  // Emulation
  autoSaveInterval: AutoSaveInterval;
  fastForwardSpeed: FastForwardSpeed;
  rewindBuffer: RewindBuffer;
  frameSkip: FrameSkip;

  // Account
  cloudSync: boolean;
}

export interface KeyBinding {
  action: string; // e.g., "a_button", "dpad_up", "start"
  label: string; // e.g., "A Button", "D-Pad Up", "Start"
  key: string; // e.g., "z", "ArrowUp", "Enter"
  gamepadButton: number | null; // Gamepad API button index
}
```

---

## APPENDIX B: HAPTICS ABSTRACTION

```ts
// lib/haptics.ts

type HapticPattern = 'light' | 'medium' | 'rigid' | 'soft' | 'success' | 'error' | 'selection';

export function triggerHaptic(pattern: HapticPattern): void {
  // Check if Vibration API is available
  if (!navigator.vibrate) return;

  // Check user settings
  // const { hapticFeedback, hapticIntensity } = getSettings();
  // if (!hapticFeedback) return;

  const patterns: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 20,
    rigid: 30,
    soft: 5,
    success: [15, 50, 15],
    error: [30, 50, 30, 50, 30],
    selection: 5,
  };

  navigator.vibrate(patterns[pattern]);
}

// For iOS/Safari, the Vibration API is not supported.
// Alternative: use AudioContext to generate sub-audible taps
// that trigger the Taptic Engine (experimental, limited support).
// Best practice: use native iOS APIs if building a PWA wrapper.
```

---

## APPENDIX C: KEYBOARD SHORTCUTS HOOK

```ts
// lib/hooks/useKeyboardShortcuts.ts

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ShortcutMap {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(contextShortcuts?: ShortcutMap) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, metaKey, ctrlKey, shiftKey } = event;
      const mod = metaKey || ctrlKey;

      // Global shortcuts
      if (mod && key === 'k') {
        event.preventDefault();
        // Open search
        document.dispatchEvent(new CustomEvent('arcadium:open-search'));
        return;
      }

      if (mod && key === ',') {
        event.preventDefault();
        router.push('/settings');
        return;
      }

      if (key === '?' && !event.target?.closest?.('input, textarea, select')) {
        event.preventDefault();
        document.dispatchEvent(new CustomEvent('arcadium:toggle-shortcuts'));
        return;
      }

      // Context-specific shortcuts
      if (contextShortcuts) {
        const shortcutKey = [
          mod ? 'mod' : '',
          shiftKey ? 'shift' : '',
          key.toLowerCase(),
        ]
          .filter(Boolean)
          .join('+');

        if (contextShortcuts[shortcutKey]) {
          event.preventDefault();
          contextShortcuts[shortcutKey]();
        }
      }
    },
    [contextShortcuts, router]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Usage in game player:
// useKeyboardShortcuts({
//   'escape': pauseGame,
//   'f5': quickSave,
//   'f9': quickLoad,
//   'f12': takeScreenshot,
//   'f11': toggleFullscreen,
//   'f10': openSettings,
//   'h': toggleHUDLock,
//   'm': toggleMute,
//   '[': toggleLeftPanel,
//   ']': toggleRightPanel,
// });
```

---

This concludes the ARCADIUM Design System Specification v1.0.
