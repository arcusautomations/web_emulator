# ARCADIUM — Complete Design Specification
## Web-Based Retro Game Emulator | Post 20x Iterative Refinement

**Version:** 1.1 | **Date:** 2026-03-22 | **Status:** Final (post spec-review fixes)

> **Document Hierarchy:** This spec is the single source of truth for features, scope, and architecture. The companion `ARCADIUM_DESIGN_SYSTEM.md` is authoritative only for visual tokens and interaction patterns. Where they conflict, this spec wins.

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Emulation Engine](#4-emulation-engine)
5. [Database Schema](#5-database-schema)
6. [Supabase Storage](#6-supabase-storage)
7. [Authentication](#7-authentication)
8. [UI/UX Design System](#8-uiux-design-system)
9. [Page Architecture](#9-page-architecture)
10. [Mobile Design](#10-mobile-design)
11. [Desktop Design](#11-desktop-design)
12. [Features Specification](#12-features-specification)
13. [Performance Budgets](#13-performance-budgets)
14. [Security](#14-security)
15. [PWA & Offline](#15-pwa--offline)
16. [DevOps & CI/CD](#16-devops--cicd)
17. [Game Library](#17-game-library)
18. [Accessibility](#18-accessibility)

---

## 1. PROJECT OVERVIEW

**ARCADIUM** is a premium, web-based retro game emulator supporting Game Boy, Game Boy Color, Game Boy Advance, and NES. It runs in any modern browser on both mobile (iPhone/Android) and desktop with zero lag, neon cyberpunk aesthetics, and a full feature suite rivaling native emulators.

### Key Decisions
- **Name:** ARCADIUM
- **Systems:** GB, GBC, GBA, NES
- **Aesthetic:** Retro Neon / Cyberpunk (scanlines, glow, CRT vibes)
- **Device Target:** True dual-mode (both mobile and desktop get dedicated, first-class layouts)
- **Game Library:** User uploads own ROMs (IndexedDB) + test account pre-loaded with 65 curated legal homebrew
- **Features:** All 12 — save states, rewind, fast-forward, shaders, gamepad, cloud sync, cheats, screenshots, RetroAchievements, library management, key remapping, audio settings
- **Auth:** Hardcoded test login for development (credentials below)

### Test Credentials
```
Username: player1
Password: arcadium2026!
```

---

## 2. TECH STACK

All versions pinned to latest stable as of March 2026:

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 15.x | App Router, RSC, TypeScript strict |
| **React** | React | 19.x | UI rendering |
| **Language** | TypeScript | 5.7+ | Strict mode, no `any` |
| **Styling** | Tailwind CSS | v3.4+ | Utility-first CSS (v3 config format; upgrade to v4 CSS-first post-launch) |
| **Animation** | Framer Motion | 11.x | Page transitions, micro-interactions |
| **State** | Zustand | 5.x | Lightweight stores, middleware support |
| **Emulation** | Nostalgist.js | latest | RetroArch WASM core wrapper |
| **Backend** | Supabase | JS SDK v2 | Auth, Postgres, Storage, Edge Functions, Realtime |
| **Local Storage** | idb-keyval | latest | IndexedDB wrapper for ROM/save caching |
| **Icons** | Lucide React | latest | Tree-shakeable, MIT |
| **Fonts** | next/font/google | - | Press Start 2P, Inter, JetBrains Mono |
| **Deployment** | Vercel | - | Frontend hosting, Edge Runtime |
| **Deployment** | Supabase Cloud | - | Backend, DB, storage |

### Emulation Cores (via Nostalgist.js / RetroArch WASM)

| System | Core | Accuracy | WASM Size (gzipped) |
|--------|------|----------|---------------------|
| Game Boy | Gambatte | Cycle-accurate | ~800 KB |
| Game Boy Color | Gambatte | Cycle-accurate | ~800 KB (same core) |
| Game Boy Advance | mGBA | Near cycle-accurate | ~1.2 MB |
| NES | Nestopia | Cycle-accurate | ~600 KB |

---

## 3. ARCHITECTURE

### Folder Structure

```
src/
  app/                          # Next.js 15 App Router
    (auth)/
      login/page.tsx            # Login page
    (app)/
      layout.tsx                # Authenticated layout (nav, sidebar)
      page.tsx                  # Library/home (default route)
      play/[gameId]/page.tsx    # Game player
      saves/page.tsx            # Save state manager
      achievements/page.tsx     # Achievement tracker
      screenshots/page.tsx      # Screenshot gallery
      settings/page.tsx         # Settings
    api/
      health/route.ts           # Health check
  core/                         # Framework-agnostic emulator engine
    engine.ts                   # EmulatorEngine class (singleton)
    audio-pipeline.ts           # Web Audio API bridge
    video-pipeline.ts           # Canvas/WebGL rendering bridge
    input-manager.ts            # Unified input (keyboard, gamepad, touch)
    save-manager.ts             # Save state serialization/deserialization
    rewind-buffer.ts            # Ring buffer for rewind feature
    cheat-engine.ts             # GameShark/Game Genie code parser + patcher
    shader-pipeline.ts          # WebGL post-processing (CRT, scanlines)
    screenshot-capture.ts       # Canvas snapshot + GIF recording
    retroachievements.ts        # RetroAchievements API client
    types.ts                    # Emulator types (SystemType, CoreConfig, etc.)
  components/
    ui/                         # Design system primitives
      Button.tsx
      Card.tsx
      Input.tsx
      Modal.tsx
      Toggle.tsx
      Slider.tsx
      Tabs.tsx
      Badge.tsx
      ProgressBar.tsx
      Tooltip.tsx
      Icon.tsx
      Spinner.tsx
    layout/                     # Layout components
      Navbar.tsx                # Top navigation bar
      Sidebar.tsx               # Desktop sidebar
      BottomBar.tsx             # Mobile bottom navigation
      PageTransition.tsx        # CRT power on/off animation wrapper
    emulator/                   # Emulator UI components
      EmulatorCanvas.tsx        # Game display canvas
      TouchControls.tsx         # Mobile on-screen D-pad + buttons
      GameHUD.tsx               # Overlay HUD (fps, save indicator, etc.)
      ShaderPicker.tsx          # Visual filter selector
      QuickMenu.tsx             # In-game quick menu (save/load/rewind/etc.)
    library/                    # Library page components
      GameGrid.tsx              # Game card grid
      GameCard.tsx              # Individual game card
      GameFilters.tsx           # System/genre/sort filters
      ROMUploader.tsx           # Drag-and-drop ROM upload
      SearchBar.tsx             # Search with auto-complete
    saves/                      # Save management components
      SaveSlotGrid.tsx
      SaveSlotCard.tsx
      CloudSyncStatus.tsx
    achievements/               # Achievement components
      AchievementCard.tsx
      AchievementUnlockToast.tsx
    settings/                   # Settings components
      ControlsConfig.tsx
      AudioSettings.tsx
      VideoSettings.tsx
      AccountSettings.tsx
    effects/                    # Visual effects
      CRTOverlay.tsx            # Scanlines + vignette + RGB subpixel
      NeonGlow.tsx              # Reusable glow wrapper
      GlitchText.tsx            # Glitch flicker text effect
  lib/
    supabase/
      client.ts                 # Supabase browser client
      server.ts                 # Supabase server client (RSC)
      middleware.ts             # Auth middleware
    hooks/
      useEmulator.ts            # Emulator engine hook
      useGamepad.ts             # Gamepad API hook
      useSettings.ts            # User settings hook
      useCloudSync.ts           # Cloud save sync hook
      useLibrary.ts             # Game library hook
      useAchievements.ts        # RetroAchievements hook
      usePlatformDetect.ts      # Mobile/desktop/tablet detection
      useKeyboardShortcuts.ts   # Global keyboard shortcut handler
    stores/
      emulator-store.ts         # Emulator state (playing, paused, speed, etc.)
      library-store.ts          # Game library state
      ui-store.ts               # UI state (sidebar, modals, theme)
      settings-store.ts         # User preferences (persisted)
    utils/
      rom-utils.ts              # ROM hash, metadata extraction, format detection
      image-utils.ts            # Cover art processing, thumbnail generation
      format-utils.ts           # Time, date, file size formatting
    animation-presets.ts        # Framer Motion spring/transition presets
    animation-variants.ts       # Framer Motion variant presets
    constants.ts                # App-wide constants
  workers/
    emulator-worker.ts          # Web Worker for emulator engine (future)
  types/
    index.ts                    # Global TypeScript types
    database.ts                 # Supabase generated types
public/
  cores/                        # WASM core files (cached aggressively)
    gambatte_libretro.wasm
    mgba_libretro.wasm
    nestopia_libretro.wasm
  roms/                         # Pre-loaded homebrew ROMs for test account
    gb/
    gbc/
    gba/
    nes/
  icons/                        # Custom pixel-art SVG icons
  sounds/                       # UI sound effects
    boot.mp3                    # CRT boot sound
    select.mp3                  # Menu selection
    save.mp3                    # Save state confirmation
    achievement.mp3             # Achievement unlock
```

### State Architecture

Three Zustand stores with clear separation of concerns:

```typescript
// stores/emulator-store.ts
interface EmulatorState {
  status: 'idle' | 'loading' | 'running' | 'paused' | 'error';
  currentGame: GameMeta | null;
  currentCore: CoreType | null;
  speed: 1 | 2 | 4;               // Fast-forward multiplier
  isRewinding: boolean;
  fps: number;
  // NOTE: Nostalgist WASM instance is NOT stored in Zustand (non-serializable).
  // It lives in a module-scoped variable inside core/engine.ts.
  // The store only holds serializable status/metadata.
  errorMessage: string | null;

  // Actions
  loadGame: (game: GameMeta) => Promise<void>;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  setSpeed: (speed: 1 | 2 | 4) => void;
  startRewind: () => void;
  stopRewind: () => void;
  takeScreenshot: () => Promise<string>;
  saveState: (slot: number) => Promise<void>;
  loadState: (slot: number) => Promise<void>;
}

// stores/library-store.ts
interface LibraryState {
  games: GameMeta[];
  favorites: Record<string, boolean>;  // game IDs → true (JSON-serializable, Zustand-reactive)
  recentlyPlayed: GameMeta[];
  searchQuery: string;
  systemFilter: SystemType | 'all';
  sortBy: 'title' | 'system' | 'last_played' | 'added';
  viewMode: 'grid' | 'list';
  isLoading: boolean;

  // Actions
  fetchGames: () => Promise<void>;
  addROM: (file: File) => Promise<GameMeta>;
  removeGame: (gameId: string) => void;
  toggleFavorite: (gameId: string) => void;
  setFilter: (filter: Partial<LibraryFilters>) => void;
}

// stores/settings-store.ts — persisted to localStorage + cloud
interface SettingsState {
  // Video
  shaderType: 'none' | 'crt' | 'lcd' | 'sharp' | 'smooth';
  scanlineIntensity: number;         // 0-1
  crtFlicker: boolean;
  aspectRatio: 'original' | 'stretch' | '4:3' | '16:9';
  integerScaling: boolean;

  // Audio
  masterVolume: number;              // 0-1
  isMuted: boolean;
  channelVolumes: Record<string, number>;
  audioLatencyTarget: number;        // ms

  // Controls
  keyboardMapping: Record<string, string>;
  touchControlLayout: TouchLayoutConfig;
  touchControlOpacity: number;       // 0-1
  touchControlSize: 'small' | 'medium' | 'large';
  hapticFeedback: boolean;
  gamepadDeadzone: number;           // 0-1

  // Cloud
  cloudSyncEnabled: boolean;
  autoSaveInterval: number;          // seconds, 0 = disabled

  // RetroAchievements
  raUsername: string;
  raApiKey: string;
  raHardcoreMode: boolean;
}
```

### Component Communication

```
┌─────────────────────────────────────────────────────┐
│                    Next.js Shell                     │
│  ┌──────────────────────────────────────────────┐   │
│  │              Zustand Stores                   │   │
│  │  ┌────────┐ ┌────────┐ ┌──────────┐         │   │
│  │  │Emulator│ │Library │ │Settings  │         │   │
│  │  │ Store  │ │ Store  │ │  Store   │         │   │
│  │  └───┬────┘ └────────┘ └──────────┘         │   │
│  └──────┼───────────────────────────────────────┘   │
│         │ subscribe/dispatch                         │
│  ┌──────▼───────────────────────────────────────┐   │
│  │          EmulatorEngine (core/)               │   │
│  │  ┌──────────┐ ┌───────────┐ ┌────────────┐  │   │
│  │  │Nostalgist│ │ Audio     │ │ Input      │  │   │
│  │  │  .js     │ │ Pipeline  │ │ Manager    │  │   │
│  │  └──────────┘ └───────────┘ └────────────┘  │   │
│  │  ┌──────────┐ ┌───────────┐ ┌────────────┐  │   │
│  │  │ Rewind   │ │ Shader    │ │ Cheat      │  │   │
│  │  │ Buffer   │ │ Pipeline  │ │ Engine     │  │   │
│  │  └──────────┘ └───────────┘ └────────────┘  │   │
│  └──────────────────────────────────────────────┘   │
│         │ canvas/audio output                        │
│  ┌──────▼───────────────────────────────────────┐   │
│  │           React UI Components                 │   │
│  │  EmulatorCanvas | TouchControls | GameHUD     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 4. EMULATION ENGINE

### Core Loading Strategy

```typescript
// core/engine.ts
const CORE_CONFIG: Record<SystemType, CoreConfig> = {
  gb:  { core: 'gambatte', system: 'gb',  extensions: ['.gb'] },
  gbc: { core: 'gambatte', system: 'gbc', extensions: ['.gbc', '.gb'] },
  gba: { core: 'mgba',    system: 'gba', extensions: ['.gba'] },
  nes: { core: 'nestopia', system: 'nes', extensions: ['.nes'] },
};
```

**Loading sequence:**
1. User selects game → detect system from file extension
2. Check if WASM core is in browser Cache API → if yes, use cached
3. If not cached, fetch from `/cores/` (Vercel CDN, `Cache-Control: public, max-age=31536000, immutable`)
4. Initialize Nostalgist.js with core + ROM blob
5. Attach to canvas element
6. Start audio pipeline (handle iOS AudioContext unlock)
7. Connect input manager
8. Begin rendering loop

### Audio Pipeline

```typescript
// core/audio-pipeline.ts
export class AudioPipeline {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isUnlocked = false;

  // iOS Safari requires user gesture to unlock AudioContext
  async unlock(): Promise<void> {
    if (this.isUnlocked) return;
    this.context = new AudioContext({
      sampleRate: 44100,
      latencyHint: 'interactive', // Lowest latency
    });
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);

    // iOS unlock: play a silent buffer on first touch
    if (this.context.state === 'suspended') {
      const buffer = this.context.createBuffer(1, 1, 44100);
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start();
      await this.context.resume();
    }
    this.isUnlocked = true;
  }

  setVolume(value: number): void {
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(value, this.context!.currentTime, 0.015);
    }
  }
}
```

### Rewind Buffer

```typescript
// core/rewind-buffer.ts
export class RewindBuffer {
  private buffer: (ArrayBuffer | null)[];
  private size = 0;          // Number of valid entries
  private writeHead = 0;     // Next position to write

  // Per-system memory budgets (save state sizes differ drastically)
  static readonly MEMORY_BUDGETS: Record<string, { maxMB: number; captureInterval: number }> = {
    gb:  { maxMB: 15,  captureInterval: 2 },   // ~50KB/state × 300 = 15MB
    gbc: { maxMB: 15,  captureInterval: 2 },   // ~50KB/state × 300 = 15MB
    gba: { maxMB: 30,  captureInterval: 4 },   // ~300KB/state × 100 = 30MB (reduced capture rate)
    nes: { maxMB: 10,  captureInterval: 2 },   // ~30KB/state × 300 = 10MB
  };

  constructor(
    private bufferSeconds: number = 10,
    private fps: number = 60,
    private captureInterval: number = 2,
  ) {
    const maxFrames = Math.ceil((bufferSeconds * fps) / captureInterval);
    this.buffer = new Array(maxFrames).fill(null);
  }

  push(stateData: ArrayBuffer): void {
    this.buffer[this.writeHead] = stateData;
    this.writeHead = (this.writeHead + 1) % this.buffer.length;
    if (this.size < this.buffer.length) this.size++;
  }

  // Correct ring buffer pop: read backwards from writeHead
  pop(): ArrayBuffer | null {
    if (this.size === 0) return null;
    this.writeHead = (this.writeHead - 1 + this.buffer.length) % this.buffer.length;
    const state = this.buffer[this.writeHead];
    this.buffer[this.writeHead] = null;
    this.size--;
    return state;
  }

  clear(): void {
    this.buffer.fill(null);
    this.size = 0;
    this.writeHead = 0;
  }

  get memoryUsageMB(): number {
    return this.buffer.reduce((sum, s) => sum + (s?.byteLength ?? 0), 0) / (1024 * 1024);
  }
}
```

### Shader Pipeline

```typescript
// core/shader-pipeline.ts
export type ShaderType = 'none' | 'crt' | 'lcd' | 'sharp' | 'smooth';

// Uses WebGL2 post-processing on the Nostalgist canvas output
// CRT shader: scanlines + curvature + vignette + chromatic aberration
// LCD shader: grid overlay simulating LCD subpixels
// Sharp: nearest-neighbor upscaling (pixel-perfect)
// Smooth: bilinear interpolation
```

### Input Manager

```typescript
// core/input-manager.ts
export class InputManager {
  private keyMap: Map<string, RetroButton> = new Map();
  private gamepadIndex: number | null = null;
  private touchState: Map<RetroButton, boolean> = new Map();
  private deadzone: number = 0.15;

  // Unified input polling — called every frame
  poll(): InputState {
    return {
      ...this.pollKeyboard(),
      ...this.pollGamepad(),
      ...this.pollTouch(),
    };
  }

  // Gamepad API with hot-plug detection
  private pollGamepad(): Partial<InputState> {
    const gamepads = navigator.getGamepads();
    // ... standard mapping for Xbox/PS/Switch Pro/8BitDo controllers
    // Apply deadzone to analog sticks
    // Map to RetroArch button indices
  }
}
```

---

## 5. DATABASE SCHEMA

### Supabase Postgres Migrations

```sql
-- Migration 001: Initial Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE system_type AS ENUM ('gb', 'gbc', 'gba', 'nes');
CREATE TYPE game_source AS ENUM ('bundled', 'uploaded');

-- Users (Supabase Auth handles this, but we add a profiles table)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Games / ROM metadata
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  system system_type NOT NULL,
  file_hash TEXT NOT NULL,                    -- SHA-256 of ROM file
  file_size_bytes BIGINT NOT NULL,
  source game_source NOT NULL DEFAULT 'uploaded',
  cover_art_url TEXT,
  genre TEXT,
  developer TEXT,
  release_year INTEGER,
  rom_storage_path TEXT,                       -- Supabase Storage path (bundled only)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(user_id, file_hash)                   -- Prevent duplicate ROMs per user
);

CREATE INDEX idx_games_user_system ON games(user_id, system);
CREATE INDEX idx_games_user_title ON games(user_id, title);
CREATE INDEX idx_games_file_hash ON games(file_hash);

-- Save states
CREATE TABLE save_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  slot_number INTEGER NOT NULL CHECK (slot_number BETWEEN 0 AND 9),
  thumbnail_path TEXT,                         -- Storage path to screenshot
  state_data_path TEXT NOT NULL,               -- Storage path to state binary
  state_size_bytes BIGINT NOT NULL,
  core_name TEXT NOT NULL,                     -- 'gambatte', 'mgba', 'nestopia'
  core_version TEXT,
  description TEXT,
  is_auto_save BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(user_id, game_id, slot_number)
);

CREATE INDEX idx_saves_user_game ON save_states(user_id, game_id);

-- Play history
CREATE TABLE play_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  last_save_state_id UUID REFERENCES save_states(id) ON DELETE SET NULL
);

CREATE INDEX idx_sessions_user_game ON play_sessions(user_id, game_id);
CREATE INDEX idx_sessions_started ON play_sessions(started_at DESC);

-- User settings (JSONB for flexibility)
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  video JSONB DEFAULT '{}' NOT NULL,
  audio JSONB DEFAULT '{}' NOT NULL,
  controls JSONB DEFAULT '{}' NOT NULL,
  ui JSONB DEFAULT '{}' NOT NULL,
  cloud_sync JSONB DEFAULT '{}' NOT NULL,
  retroachievements JSONB DEFAULT '{}' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Favorites
CREATE TABLE favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, game_id)
);

-- Screenshots
CREATE TABLE screenshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  image_path TEXT NOT NULL,                    -- Supabase Storage path
  thumbnail_path TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_screenshots_user ON screenshots(user_id, created_at DESC);

-- Cheat codes
CREATE TABLE cheat_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,                          -- GameShark/Game Genie code string
  code_type TEXT NOT NULL,                     -- 'gameshark', 'gamegenie', 'action_replay'
  is_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_cheats_game ON cheat_codes(game_id, user_id);

-- Achievements cache (from RetroAchievements API)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  ra_achievement_id INTEGER NOT NULL,          -- RetroAchievements.org ID
  title TEXT NOT NULL,
  description TEXT,
  badge_url TEXT,
  points INTEGER DEFAULT 0,
  rarity TEXT,                                 -- 'common', 'rare', 'legendary'
  unlocked_at TIMESTAMPTZ,
  is_unlocked BOOLEAN DEFAULT FALSE,

  UNIQUE(user_id, game_id, ra_achievement_id)
);

CREATE INDEX idx_achievements_user_game ON achievements(user_id, game_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE save_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheat_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: users can read/update own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Games: users see own games + bundled games
CREATE POLICY "Users can view own and bundled games"
  ON games FOR SELECT USING (
    user_id = auth.uid() OR source = 'bundled'
  );
CREATE POLICY "Users can insert own games"
  ON games FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own games"
  ON games FOR DELETE USING (user_id = auth.uid() AND source = 'uploaded');

-- Save states: users can only access own saves
CREATE POLICY "Users can manage own save states"
  ON save_states FOR ALL USING (user_id = auth.uid());

-- Play sessions: users own their sessions
CREATE POLICY "Users can manage own play sessions"
  ON play_sessions FOR ALL USING (user_id = auth.uid());

-- Settings: users own their settings
CREATE POLICY "Users can manage own settings"
  ON user_settings FOR ALL USING (user_id = auth.uid());

-- Favorites: users manage own favorites
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL USING (user_id = auth.uid());

-- Screenshots: users manage own screenshots
CREATE POLICY "Users can manage own screenshots"
  ON screenshots FOR ALL USING (user_id = auth.uid());

-- Cheats: users manage own cheats
CREATE POLICY "Users can manage own cheat codes"
  ON cheat_codes FOR ALL USING (user_id = auth.uid());

-- Achievements: users manage own achievements
CREATE POLICY "Users can manage own achievements"
  ON achievements FOR ALL USING (user_id = auth.uid());

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER save_states_updated_at BEFORE UPDATE ON save_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 6. SUPABASE STORAGE

### Bucket Configuration

| Bucket | Purpose | Max File Size | Access | Cache-Control |
|--------|---------|--------------|--------|---------------|
| `roms` | Bundled homebrew ROMs | 32 MB | Public read (bundled) / Private (uploaded) | `public, max-age=604800` |
| `save-states` | Save state binary data | 2 MB | Private (user-owned) | `private, no-cache` |
| `screenshots` | Game screenshots + thumbnails | 5 MB | Private (user-owned) | `public, max-age=86400` |
| `cover-art` | Game cover art images | 2 MB | Public read | `public, max-age=2592000` |

### Storage Path Conventions

```
roms/bundled/{system}/{filename}.{ext}         # Bundled homebrew
save-states/{user_id}/{game_id}/slot-{n}.state # Save state binary
save-states/{user_id}/{game_id}/slot-{n}.png   # Save state thumbnail
screenshots/{user_id}/{game_id}/{timestamp}.png
cover-art/{system}/{file_hash}.webp
```

### Storage Policies

```sql
-- ROMs bucket: public read for bundled, private for user uploads
CREATE POLICY "Public read for bundled ROMs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'roms' AND (storage.foldername(name))[1] = 'bundled');

-- Save states: user owns their directory
CREATE POLICY "Users manage own save states"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'save-states'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Screenshots: user owns their directory
CREATE POLICY "Users manage own screenshots"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Cover art: public read
CREATE POLICY "Public read for cover art"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cover-art');
```

---

## 7. AUTHENTICATION

Simple hardcoded test auth for development. Uses Supabase Auth with email/password.

### Seed Script

```typescript
// supabase/seed.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  // Create test user via Supabase Auth Admin API
  const { data: user } = await supabase.auth.admin.createUser({
    email: 'player1@arcadium.local',
    password: 'arcadium2026!',
    email_confirm: true,
    user_metadata: { username: 'player1', display_name: 'Player One' },
  });

  // Create profile
  await supabase.from('profiles').insert({
    id: user.user!.id,
    username: 'player1',
    display_name: 'Player One',
  });

  // Seed 65 bundled games (metadata)
  const bundledGames = [
    // GB
    { title: 'Tobu Tobu Girl', system: 'gb', file_hash: '...', file_size_bytes: 32768, source: 'bundled', rom_storage_path: 'roms/bundled/gb/tobu-tobu-girl.gb', genre: 'Platformer', developer: 'Tangram Games' },
    { title: 'Shock Lobster', system: 'gb', file_hash: '...', file_size_bytes: 32768, source: 'bundled', rom_storage_path: 'roms/bundled/gb/shock-lobster.gb', genre: 'Platformer', developer: 'tbsp' },
    { title: 'Adjustris', system: 'gb', file_hash: '...', file_size_bytes: 32768, source: 'bundled', rom_storage_path: 'roms/bundled/gb/adjustris.gb', genre: 'Puzzle', developer: 'tbsp' },
    // ... (all 65 games populated in full seed script)
  ];

  for (const game of bundledGames) {
    await supabase.from('games').insert({
      ...game,
      user_id: user.user!.id,
    });
  }

  // Upload ROM files to storage
  // (Script reads from local /roms directory and uploads to Supabase Storage)
}
```

### Login Flow

```
1. User visits / → redirected to /login
2. Login page: username + password form
3. Submit → supabase.auth.signInWithPassword({ email: 'player1@arcadium.local', password: 'arcadium2026!' })
4. On success → redirect to / (library)
5. Supabase middleware checks auth on all (app) routes
6. On logout → supabase.auth.signOut() → redirect to /login
```

### Middleware

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(/* ... */);

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from login
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|cores|roms|icons|sounds).*)'],
};
```

---

## 8. UI/UX DESIGN SYSTEM

### Color Palette

```
--color-bg-void       #0a0118    Deepest background
--color-bg-base       #0d0221    Primary surface
--color-bg-surface-1  #140533    Cards, elevated surfaces
--color-bg-surface-2  #1a0a40    Modals, overlays
--color-bg-surface-3  #22104d    Active/selected states

--color-neon-magenta  #ff00ff    Brand primary, large headings (AA large text only, 4.6:1)
--color-magenta-light #ff66ff    Body text on dark (AA compliant, 6.2:1)
--color-neon-cyan     #00ffc8    Interactive elements (AAA, 8.9:1)
--color-electric-blue #0096ff    Links, info states (AA large, 4.8:1)

--color-text-primary  #f0e6ff    Primary body text (AAA, 14.8:1)
--color-text-secondary #b8a5d4   Secondary text (AAA, 7.2:1)

--color-success       #00ff88    Save complete, achievement unlock
--color-warning       #ffaa00    Warnings
--color-error         #ff3366    Errors
```

### Typography

| Token | Size | Font | Usage |
|-------|------|------|-------|
| display | 2.5rem | Press Start 2P | ARCADIUM logo |
| h1 | 2rem | Press Start 2P | Page titles |
| h2 | 1.5rem | Press Start 2P | Section headings |
| h3 | 1.125rem | Press Start 2P | Card titles |
| h4 | 0.875rem | Press Start 2P | Labels, badges |
| body-lg | 1.125rem | Inter | Feature descriptions |
| body | 1rem | Inter | Default body text |
| body-sm | 0.875rem | Inter | Metadata |
| caption | 0.75rem | Inter | Timestamps |
| micro | 0.625rem | Press Start 2P | HUD elements |
| mono | 0.875rem | JetBrains Mono | Cheat codes |

### Animation Presets (Framer Motion)

```typescript
// Spring presets
snap:     { type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }   // Buttons, toggles
standard: { type: 'spring', stiffness: 400, damping: 28, mass: 1 }     // Cards, panels
gentle:   { type: 'spring', stiffness: 300, damping: 26, mass: 1.2 }   // Modals, overlays
bouncy:   { type: 'spring', stiffness: 350, damping: 15, mass: 0.8 }   // Celebrations
heavy:    { type: 'spring', stiffness: 250, damping: 30, mass: 1.5 }   // Large panels

// Page transitions: CRT power on/off
Enter: scaleY 0.005→1 (300ms) + scaleX 0.5→1 (200ms, 100ms delay) + brightness 2→1
Exit:  scaleY 1→0.005 (200ms) + brightness 1→3 (150ms)
```

### Glow System (3 intensities only)

```
sm:  0 0 4px {color}66, 0 0 8px {color}33                              // Resting borders
md:  0 0 8px {color}88, 0 0 20px {color}44, 0 0 40px {color}22         // Hover/focus
lg:  0 0 12px {color}aa, 0 0 30px {color}66, 0 0 60px {color}33        // Hero/active
```

### CRT Overlay

CSS pseudo-elements, GPU-accelerated, `pointer-events: none`:
- **Scanlines:** 2px repeating-linear-gradient at 12% opacity (configurable)
- **Vignette:** radial-gradient darkening edges (game canvas only)
- **RGB subpixel:** 3px repeating horizontal RGB bands at 3% opacity (desktop only)
- **Flicker:** Optional 4px animated band (disabled by default)
- **Respects `prefers-reduced-motion`** — disabled entirely

---

## 9. PAGE ARCHITECTURE

### Login Page (`/login`)

```
┌────────────────────────────────────────────┐
│          ┌──────────────────┐              │
│          │   ARCADIUM LOGO  │              │
│          │ (pixel art, glow) │              │
│          └──────────────────┘              │
│          ┌──────────────────┐              │
│          │ Username          │              │
│          │ [______________ ] │              │
│          │ Password          │              │
│          │ [______________ ] │              │
│          │                   │              │
│          │ [ INSERT COIN  ]  │ ← Primary   │
│          └──────────────────┘   button     │
│                                             │
│       CRT scanline overlay on entire page   │
│       Subtle neon pulse on logo             │
│       Boot-up animation on first load       │
└────────────────────────────────────────────┘
```

### Library / Home Page (`/`)

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ [≡] ARCADIUM                    🔍 Search...      [avatar] │ ← Navbar
├─────────┬──────────────────────────────────────────────────┤
│         │                                                   │
│ Library │  ► CONTINUE PLAYING                               │
│ ★ Favs  │  ┌─────┐ ┌─────┐ ┌─────┐                       │
│ ⏱ Recent│  │game1│ │game2│ │game3│  ← Last 3 played       │
│ ─────── │  └─────┘ └─────┘ └─────┘                       │
│ GB      │                                                   │
│ GBC     │  ► ALL GAMES (42)         [Grid|List] [Sort ▼]  │
│ GBA     │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│ NES     │  │     │ │     │ │     │ │     │ │     │      │
│ ─────── │  │cover│ │cover│ │cover│ │cover│ │cover│      │
│ Settings│  │ art │ │ art │ │ art │ │ art │ │ art │      │
│ ─────── │  │     │ │     │ │     │ │     │ │     │      │
│ Upload  │  │Title│ │Title│ │Title│ │Title│ │Title│      │
│ ROM     │  │ GBA │ │ NES │ │ GB  │ │ GBC │ │ GBA │      │
│         │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│         │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│         │  │ ... │ │ ... │ │ ... │ │ ... │ │ ... │      │
│         │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
└─────────┴──────────────────────────────────────────────────┘
Sidebar: 240px, collapsible to 64px icons
Grid: 2-6 columns responsive, 3:4 aspect ratio cover art
```

**Mobile Layout:**
```
┌──────────────────────────┐
│ ARCADIUM          🔍 [≡] │ ← Compact navbar
├──────────────────────────┤
│ [GB] [GBC] [GBA] [NES]  │ ← Horizontal scrolling tabs
├──────────────────────────┤
│ ► CONTINUE                │
│ ┌──────┐ ┌──────┐        │ ← Horizontal scroll
│ │game1 │ │game2 │ →      │
│ └──────┘ └──────┘        │
├──────────────────────────┤
│ ► ALL GAMES              │
│ ┌──────┐ ┌──────┐       │ ← 2-column grid
│ │cover │ │cover │       │
│ │Title │ │Title │       │
│ └──────┘ └──────┘       │
│ ┌──────┐ ┌──────┐       │
│ │cover │ │cover │       │
│ │Title │ │Title │       │
│ └──────┘ └──────┘       │
├──────────────────────────┤
│ [🏠] [★] [⚙️] [📸]     │ ← Bottom navigation bar
└──────────────────────────┘
```

### Game Player Page (`/play/[gameId]`)

**Desktop Layout:**
```
┌──────────────────────────────────────────────────────┐
│ [←] Tobu Tobu Girl Deluxe                   [⚙] [✕] │
├──────────────────────────────────────────────────────┤
│                                                       │
│         ┌──────────────────────────────┐             │
│         │                              │             │
│         │                              │             │
│         │       GAME CANVAS            │             │
│         │     (integer-scaled)          │             │
│         │                              │             │
│         │                              │             │
│         │                              │             │
│         └──────────────────────────────┘             │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ [⏪Rewind] [⏸Pause] [⏩2x] [💾Save] [📷Snap] │  │ ← HUD bar
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  CRT overlay on canvas only                          │
│  HUD auto-hides after 3s, mouse movement reveals     │
│  Keyboard: Enter=Start, Shift=Select, Z=A, X=B       │
│  F5=QuickSave, F8=QuickLoad, R=Rewind                │
└──────────────────────────────────────────────────────┘
```

**Mobile Layout (Landscape):**
```
┌──────────────────────────────────────────────────────┐
│ ┌────────────────────────────┐                        │
│ │                            │          [A]           │
│ │       GAME CANVAS          │       [B]              │
│ │       (full height)         │                        │
│ │                            │   [SEL] [START]        │
│ │                            │                        │
│ └────────────────────────────┘                        │
│  [D-PAD]                              [L]  [R]       │
│                               [≡ Quick Menu]          │
└──────────────────────────────────────────────────────┘

Touch controls: semi-transparent, configurable opacity/size/position
Quick menu: bottom sheet with save/load/rewind/settings
```

---

## 10. MOBILE DESIGN

### Touch Control Specifications

```
D-pad: 120x120px zone, each direction 56x56px touch target
A button: 56px diameter, positioned in right thumb reach zone
B button: 56px diameter, offset left-down from A
Start/Select: 40x24px pill shapes, centered bottom
L/R: 64x32px shoulder buttons, top corners
Opacity: Default 0.4, configurable 0.1-0.8
Haptic: UIImpactFeedback light on press (if supported)
```

### Gesture Controls
- **Swipe up from bottom:** Open quick menu
- **Two-finger tap:** Pause/resume
- **Pinch:** Zoom (in settings mode only, not during gameplay)

### Safe Areas
- Respect `env(safe-area-inset-*)` for notch/Dynamic Island
- Bottom bar: `padding-bottom: max(16px, env(safe-area-inset-bottom))`
- Touch controls never overlap with home indicator

### Portrait vs Landscape
- **Portrait:** Canvas at top (50% height), controls fill bottom half
- **Landscape:** Canvas left (60% width), controls overlay right side
- Auto-detect orientation, smooth transition between layouts

---

## 11. DESKTOP DESIGN

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Z | A button |
| X | B button |
| A | Y button (GBA) |
| S | X button (GBA) |
| Enter | Start |
| Shift | Select |
| Arrow keys | D-pad |
| Q / W | L / R shoulder |
| F5 | Quick save (slot 0) |
| F8 | Quick load (slot 0) |
| R (hold) | Rewind |
| Space | Fast forward (hold) |
| F | Toggle fullscreen |
| Escape | Open/close quick menu |
| F12 | Take screenshot |
| M | Toggle mute |
| +/- | Volume up/down |

### Sidebar Navigation

```
Width: 240px expanded, 64px collapsed
Items: Library, Favorites, Recent, [system filters], Settings, Upload ROM
Active item: bg-surface-2, left border 2px neon-cyan, text-neon-cyan
Hover: bg-surface-1, text-text-primary
Collapse: hamburger toggle in navbar, persisted preference
Below 1024px: sidebar becomes bottom bar (mobile nav)
```

---

## 12. FEATURES SPECIFICATION

### 1. Save States
- 10 slots per game (0-9)
- Slot 0 = quick save/quick load
- Auto-save on exit (if enabled)
- Thumbnail screenshot captured at save time
- Stored locally (IndexedDB) + cloud (Supabase Storage)
- Size: ~50-200KB per state depending on system

### 2. Rewind
- Ring buffer: 10 seconds default (configurable 5-60s)
- Captures state every 2 frames (~30 captures/sec)
- Memory budget: ~15MB for 10s
- Hold R (keyboard) or hold rewind button (touch)
- Visual: canvas slightly desaturates, "REWIND" text overlay
- Audio: reversed audio at reduced volume

### 3. Fast Forward
- Speeds: 2x, 4x (toggle or hold)
- Hold Space (keyboard) or tap FF button (touch)
- Visual: speed indicator ">>2x" in HUD corner
- Audio: muted during fast-forward (avoids distortion)

### 4. Visual Filters / Shaders
- **None:** Raw pixel output
- **CRT:** Scanlines + curvature + vignette + chromatic aberration
- **LCD:** Simulates Game Boy LCD grid pattern
- **Sharp:** Nearest-neighbor (pixel-perfect, no blur)
- **Smooth:** Bilinear interpolation
- All implemented via WebGL2 post-processing
- Configurable scanline intensity (0-100%)

### 5. Gamepad / Controller Support
- Browser Gamepad API with auto-detection
- Supported: Xbox, PlayStation, Switch Pro, 8BitDo, generic
- Standard mapping applied automatically
- Custom button remapping saved per controller
- Deadzone: configurable (default 0.15)
- Haptic feedback on supported controllers
- Hot-plug: detect connect/disconnect in real-time

### 6. Cloud Save Sync
- Save states uploaded to Supabase Storage on save
- Downloaded on load if newer than local copy
- Conflict resolution: server timestamp wins (last-write-wins)
- Offline queue: saves queued in IndexedDB, synced when online
- Sync indicator in HUD: cloud icon with status (synced/syncing/offline)
- Bandwidth: only upload changed slots, not all 10

### 7. Cheat Codes
- Support: GameShark, Game Genie, Action Replay
- Code parsing per system (different formats for GB vs GBA vs NES)
- Toggle individual cheats on/off during gameplay
- Persist enabled cheats per game in database
- No built-in cheat database (user enters codes manually)
- Cheat panel accessible from quick menu

### 8. Screenshots & Recording
- **Screenshot:** Canvas toBlob() → PNG → save to gallery + Supabase Storage
- **GIF recording:** Last 15 seconds ring buffer → GIF encoding via gif.js worker
- **Share:** Copy to clipboard, download, or generate share link
- Screenshots displayed in gallery with CRT-frame styling
- Keyboard shortcut: F12

### 9. RetroAchievements Integration
- Optional: user enters RA username + API key in settings
- API polling: check achievements on save state load + periodically
- Achievement unlock: glitch-flicker toast notification with sound
- Achievement page: grid of unlocked/locked with progress bars
- Rarity badges: Common (gray), Rare (blue), Legendary (magenta + glow)
- Hardcore mode: disables cheats, rewind, save states for "pure" runs

### 10. Library Management
- Auto-detect ROM system from file extension + header magic bytes
- Cover art: auto-fetch from public databases by file hash, fallback to system-colored placeholder
- Favorites: star toggle, separate favorites view
- Recently played: last 10 games, sorted by last_played timestamp
- Search: real-time fuzzy search across title, system, genre
- Sort: by title, system, last played, date added
- View: grid (cover art) or list (compact)
- Filter: by system (GB/GBC/GBA/NES)

### 11. Customizable Controls / Key Remapping
- Keyboard: remap any key to any emulator button
- Touch: reposition and resize on-screen buttons (drag to move, pinch to resize)
- Touch opacity: slider 10-80%
- Touch size preset: small/medium/large
- Per-game control profiles (save different layouts for different games)
- Gamepad: remap buttons per controller ID

### 12. Audio Settings
- Master volume: slider 0-100%
- Mute toggle
- Per-channel mixing: enable/disable individual sound channels (e.g., mute pulse1, pulse2, wave, noise on GB)
- Audio latency target: configurable (default: 64ms buffer)
- Low-latency mode: reduces buffer to 32ms (may crackle on slow devices)

---

## 13. PERFORMANCE BUDGETS

| Metric | Target | Hard Limit |
|--------|--------|------------|
| **First Contentful Paint** | < 1.0s | < 1.5s |
| **Largest Contentful Paint** | < 1.5s | < 2.5s |
| **Time to Interactive** | < 2.0s | < 3.0s |
| **Cumulative Layout Shift** | < 0.05 | < 0.1 |
| **First Input Delay** | < 50ms | < 100ms |
| **JS Bundle (initial)** | < 150 KB gz | < 200 KB gz |
| **WASM Core Load** | < 1.5s (cached <50ms) | < 3.0s |
| **ROM Load (local)** | < 100ms | < 300ms |
| **ROM Load (Supabase)** | < 500ms | < 2.0s |
| **Save State Write** | < 200ms | < 500ms |
| **Save State Cloud Sync** | < 1.0s | < 3.0s |
| **Screenshot Capture** | < 100ms | < 300ms |
| **Frame Rate (gameplay)** | 60 FPS | Never below 55 FPS |
| **Input Latency** | < 16ms (1 frame) | < 33ms (2 frames) |
| **Audio Latency** | < 64ms | < 128ms |
| **Lighthouse Performance** | > 90 | > 80 |
| **Lighthouse Accessibility** | > 95 | > 90 |

### Code Splitting Strategy

```
Route              Loaded When                Bundle
─────────────────────────────────────────────────────
/login             Always                     ~30 KB gz
/ (library)        After auth                 ~80 KB gz
/play/[id]         On game launch             ~120 KB gz (includes emulator engine)
/settings          On navigate                ~40 KB gz
/saves             On navigate                ~35 KB gz
/achievements      On navigate                ~30 KB gz
/screenshots       On navigate                ~25 KB gz

WASM cores         On first game of that system (then cached)
Gambatte:          ~800 KB
mGBA:              ~1.2 MB
Nestopia:          ~600 KB
```

---

## 14. SECURITY

### Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  worker-src 'self' blob:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://retroachievements.org;
  img-src 'self' blob: data: https://*.supabase.co https://media.retroachievements.org;
  media-src 'self' blob:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
```

### ROM Upload Validation

```typescript
// Maximum file sizes per system
const MAX_ROM_SIZES: Record<SystemType, number> = {
  gb:  2 * 1024 * 1024,    // 2 MB
  gbc: 4 * 1024 * 1024,    // 4 MB
  gba: 32 * 1024 * 1024,   // 32 MB
  nes: 4 * 1024 * 1024,    // 4 MB
};

// Magic byte validation
const ROM_MAGIC: Record<SystemType, { offset: number; bytes: number[] }[]> = {
  gb:  [{ offset: 0x104, bytes: [0xCE, 0xED, 0x66, 0x66] }],  // Nintendo logo
  gbc: [{ offset: 0x104, bytes: [0xCE, 0xED, 0x66, 0x66] }],  // Same + CGB flag
  gba: [{ offset: 0x04, bytes: [0x24, 0xFF, 0xAE, 0x51] }],   // GBA header
  nes: [{ offset: 0x00, bytes: [0x4E, 0x45, 0x53, 0x1A] }],   // "NES\x1A" (iNES)
};
```

### Additional Security Measures
- WASM execution sandboxed in browser's WebAssembly VM
- No `eval()` anywhere in codebase
- All user inputs sanitized (game titles, cheat codes)
- Rate limiting on Supabase Edge Functions
- File type validation on all uploads (ROM, screenshots)
- Storage bucket policies enforce user-scoped access
- HTTPS enforced via Vercel + Supabase

---

## 15. PWA & OFFLINE

### Service Worker Strategy

```typescript
// next.config.ts — using next-pwa or serwist
// Cache strategies:
//
// WASM cores:    CacheFirst (immutable, versioned by hash)
// ROM files:     CacheFirst (immutable, user's own files)
// App shell:     StaleWhileRevalidate (HTML, JS, CSS)
// Cover art:     CacheFirst (with expiry)
// API calls:     NetworkFirst (fall back to cached data)
// Fonts:         CacheFirst (immutable)
```

### manifest.json

```json
{
  "name": "ARCADIUM",
  "short_name": "ARCADIUM",
  "description": "Retro Game Emulator",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#0d0221",
  "theme_color": "#ff00ff",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Offline Capabilities
- Play any game that has been played before (ROM cached in IndexedDB + SW cache)
- Save states work offline (saved to IndexedDB, synced when back online)
- Library browsable offline (metadata cached)
- New ROM uploads work offline (stored locally, synced later)
- Offline indicator: amber warning badge in navbar

---

## 16. DEVOPS & CI/CD

### GitHub Actions Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run build
```

### Vercel Configuration

```json
// vercel.json
{
  "headers": [
    {
      "source": "/cores/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Environment Variables

```
# Vercel
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # Server-side only

# Supabase
SUPABASE_DB_URL=postgresql://...
```

### Monitoring
- **Errors:** Vercel built-in error tracking (or Sentry if needed)
- **Performance:** Vercel Speed Insights (Core Web Vitals)
- **Analytics:** Vercel Analytics (page views, unique visitors)
- **Uptime:** Vercel status + Supabase dashboard

---

## 17. GAME LIBRARY

### 65 Curated Legal Homebrew Games

**Game Boy (7 titles):**
1. Tobu Tobu Girl (MIT) — Arcade platformer
2. Shock Lobster (zlib) — Platformer/runner
3. Adjustris (CC0) — Puzzle
4. Libbet and the Magic Floor (zlib) — Puzzle
5. Dangan GB (Freeware) — Bullet-hell shmup
6. Into the Blue (Freeware) — Tetris Attack clone
7. gb-wordle (GPL v3) — Wordle

**Game Boy Color (5 titles):**
8. Tobu Tobu Girl Deluxe (MIT) — Enhanced platformer
9. uCity (GPL v3) — City builder
10. Geometrix (GPL v3) — Puzzle
11. Pandora's Blocks/DMGTRIS (GPL v3) — Tetris TGM
12. Feed IT Souls Jam (Free) — Metroidvania

**Game Boy Advance (11 titles):**
13. Varooom 3D (zlib) — 3D racing at 60fps
14. BeatBeast (MIT) — Rhythm shmup
15. Butano Fighter (zlib) — Shmup
16. Inheritors of the Oubliette (GPL v3) — Dungeon crawler
17. uCity Advance (GPL v3) — City builder
18. Celeste Classic GBA (Free) — Precision platformer
19. Anguna (Free) — Zelda-like adventure
20. Discrete Orange (CC0) — Puzzle platformer
21. Dungeon Tactics Advance (Open source) — Roguelite strategy
22. Sleep Paradox (Open source) — Action RPG
23. Waimanu (CC) — Puzzle

**NES (18+ titles):**
24. Super Tilt Bro (WTFPL) — Smash Bros-style fighter
25. NESert Golfing (CC BY 4.0) — Golf physics
26. RHDE: Furniture Fight (All-Permissive) — Strategy
27. Thwaite (GPL v3) — Missile Command
28. Concentration Room (CC BY-SA) — Memory puzzle
29. Nova the Squirrel (GPL v3) — Platformer
30. L'Abbaye des Morts NES (CC BY 4.0) — Gothic platformer
31. Spacegulls (Free) — Space platformer
32. Bobl (Free) — Water platformer
33. FROM BELOW (Free) — Tetris + Cthulhu
34. Famidash (Free) — Geometry Dash demake
35. Wolfling (Free) — Metroidvania
36. What Remains (Free) — Narrative adventure
37-65. retrobrews collection (28 titles, all approved for distribution)

**Total bundled data: ~70-80 MB** (lazy-loaded per-game)

---

## 18. ACCESSIBILITY

### WCAG 2.1 AA Compliance

- All text meets contrast ratios (verified in Section 8)
- `#ff00ff` (4.6:1) restricted to large text (>18px) and decorative elements
- Body text uses `#ff66ff` (6.2:1) or `#f0e6ff` (14.8:1)
- Focus indicators: 2px cyan ring with 2px offset, visible on all interactive elements
- Skip-to-content link on every page
- All images have alt text
- Touch targets minimum 44x44px
- `prefers-reduced-motion`: all animations replaced with instant opacity fades
- `prefers-color-scheme`: dark only (by design, but respects system settings for non-game UI contrast)
- Screen reader: game canvas labeled, controls announced, status changes use `aria-live`
- Keyboard: all UI navigable via Tab, emulator controls via configurable keys

---

## APPENDIX: UI SOUND EFFECTS

| Sound | File | Duration | Trigger |
|-------|------|----------|---------|
| Boot | boot.mp3 | ~1.5s | Login → Library transition |
| Select | select.mp3 | ~100ms | Menu item hover/select |
| Save | save.mp3 | ~300ms | Save state confirmed |
| Achievement | achievement.mp3 | ~800ms | Achievement unlocked |
| Error | error.mp3 | ~200ms | ROM load failure |
| Screenshot | screenshot.mp3 | ~150ms | Screenshot captured |

All UI sounds: 8-bit/chiptune style, volume respects master volume setting, disabled when muted.

---

## 19. iOS SAFARI KNOWN LIMITATIONS

These are platform-specific constraints that cannot be worked around. The implementation must account for all of them.

### Critical: No `screen.orientation.lock()`
iOS Safari does not support the Screen Orientation API. We cannot force landscape mode. Implementation: show a "Rotate your device" prompt overlay when in portrait during gameplay. The `.catch()` on orientation lock calls is mandatory.

### Critical: Use `100dvh` not `100vh`
iOS Safari's `100vh` does not account for the dynamic URL bar. All full-height layouts must use `min-h-[100dvh]` (dynamic viewport height) instead of `min-h-screen`.

### Critical: WebGL Context Loss on Backgrounding
When an iOS user switches apps or the phone auto-locks, Safari reclaims WebGL contexts. The emulator engine MUST:
1. Listen for `webglcontextlost` on the canvas
2. Auto-save state to IndexedDB immediately
3. Listen for `webglcontextrestored`
4. Restore the saved state and resume rendering

```typescript
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  engine.emergencySave();
});
canvas.addEventListener('webglcontextrestored', () => {
  engine.restoreFromEmergencySave();
});
```

### Major: No Haptic Feedback API
`navigator.vibrate()` is not supported on iOS Safari. All haptic feedback code must be guarded with feature detection and treated as Android/desktop-only. iOS users get visual-only button press feedback.

### Major: Audio Interruption Handling
iOS can interrupt the AudioContext (incoming call, Siri, Control Center). The audio pipeline must handle the `statechange` event on AudioContext and call `resume()` after interruption ends:

```typescript
audioContext.addEventListener('statechange', () => {
  if (audioContext.state === 'interrupted') {
    // Wait for user interaction, then resume
    const resume = () => {
      audioContext.resume();
      document.removeEventListener('touchstart', resume);
    };
    document.addEventListener('touchstart', resume, { once: true });
  }
});
```

### Major: PWA IndexedDB Quota (~50MB in standalone)
iOS standalone mode (Add to Home Screen) reportedly has a ~50MB IndexedDB quota. Our 65 bundled ROMs total ~70-80MB. Implementation strategy:
- Bundle only the 30 smallest/most-popular ROMs by default (~25MB)
- Lazy-download remaining ROMs on first play
- Implement LRU cache eviction for ROM data in IndexedDB
- Show storage usage indicator in settings

### Minor: No SharedArrayBuffer
iOS Safari does not support `SharedArrayBuffer` (required for `Cross-Origin-Isolation`). This means some advanced WASM features (threading) are unavailable. Nostalgist.js works without it, but performance may be slightly lower than Chrome on desktop.

---

## 20. ERROR HANDLING & CRASH RECOVERY

### Emulator Error Boundary

A React error boundary wraps the emulator canvas. On any WASM crash, out-of-memory, or unhandled exception:

```
┌──────────────────────────────────────┐
│           ⚠ GAME CRASHED             │
│                                       │
│  Something went wrong with the        │
│  emulation core.                      │
│                                       │
│  [🔄 Restart Game]                    │
│  [💾 Load Last Auto-Save]            │
│  [🏠 Return to Library]              │
│                                       │
│  Error: WASM out of memory (mGBA)    │
└──────────────────────────────────────┘
```

### Watchdog Timer
A `setInterval` checks every 2 seconds that the emulator is producing frames. If frame count is stale for 5 seconds (and not paused), trigger the crash recovery UI.

### ROM Deletion Confirmation
Deleting a ROM shows a confirmation modal warning that associated save states will also be deleted. The delete action cascades through IndexedDB (local ROM data) and Supabase (cloud saves, screenshots, achievements).

### Cloud Sync Conflict UI
When last-write-wins detects a conflict (both local and server have newer saves than last sync):

```
┌──────────────────────────────────────┐
│       ⚡ SAVE CONFLICT               │
│                                       │
│  This game has saves on two devices.  │
│                                       │
│  📱 This device:  Slot 3, 2min ago   │
│  ☁️ Cloud:        Slot 3, 5min ago   │
│                                       │
│  [Keep Local] [Keep Cloud] [Keep Both]│
└──────────────────────────────────────┘
```

"Keep Both" saves cloud version to a new slot.

---

## 21. 404 / NOT FOUND PAGE

A full-page CRT-themed 404:
- Static noise / CRT interference animation on the background
- "GAME NOT FOUND" in Press Start 2P, neon magenta, large
- "No cartridge detected at this address" in Inter, text-secondary
- [Return to Library] primary button
- Subtle scanline overlay

---

## 22. RATE LIMITING

### ROM Upload Rate Limits
- Max 10 ROM uploads per minute per user
- Max 50 ROMs total per user account
- Enforced via Supabase Edge Function middleware (rate limiter using Supabase cache/KV)

### API Rate Limits
- Supabase default rate limits apply (100 req/sec per user on free tier)
- RetroAchievements API: max 1 request per second (their API limit)

---

## 23. RETROACHIEVEMENTS API KEY SECURITY

RA API keys are user credentials and must not be stored in plaintext. Implementation:

1. User enters RA API key in settings
2. Key is sent to a Supabase Edge Function
3. Edge Function encrypts the key using `ENCRYPTION_SECRET` env var (AES-256-GCM)
4. Encrypted key stored in `user_settings.retroachievements.encrypted_api_key`
5. All RA API calls go through Edge Function, which decrypts and proxies

The key is NEVER sent to the client after initial entry. The client only knows "RA is connected" or "RA is not connected."

---

*End of specification. Version 1.1 — 23 sections covering architecture, emulation, database, storage, auth, UI/UX, pages, mobile, desktop, features, performance, security, PWA, DevOps, game library, accessibility, iOS limitations, error handling, 404 page, rate limiting, and API key security.*
