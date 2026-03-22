-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE system_type AS ENUM ('gb', 'gbc', 'gba', 'nes');
CREATE TYPE game_source AS ENUM ('bundled', 'uploaded');

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Games
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  system system_type NOT NULL,
  file_hash TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  source game_source NOT NULL DEFAULT 'uploaded',
  cover_art_url TEXT,
  dominant_color TEXT,
  genre TEXT,
  developer TEXT,
  release_year INTEGER,
  rom_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, file_hash)
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
  thumbnail_path TEXT,
  state_data_path TEXT NOT NULL,
  state_size_bytes BIGINT NOT NULL,
  core_name TEXT NOT NULL,
  core_version TEXT,
  description TEXT,
  is_auto_save BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, game_id, slot_number)
);

CREATE INDEX idx_saves_user_game ON save_states(user_id, game_id);

-- Play sessions
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

-- User settings
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
  image_path TEXT NOT NULL,
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
  code TEXT NOT NULL,
  code_type TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_cheats_game ON cheat_codes(game_id, user_id);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  ra_achievement_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  badge_url TEXT,
  points INTEGER DEFAULT 0,
  rarity TEXT,
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
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own and bundled games" ON games FOR SELECT USING (user_id = auth.uid() OR source = 'bundled');
CREATE POLICY "Users can insert own games" ON games FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own games" ON games FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own uploaded games" ON games FOR DELETE USING (user_id = auth.uid() AND source = 'uploaded');

CREATE POLICY "Users manage own save states" ON save_states FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own play sessions" ON play_sessions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own settings" ON user_settings FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own screenshots" ON screenshots FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own cheat codes" ON cheat_codes FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own achievements" ON achievements FOR ALL USING (user_id = auth.uid());

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER save_states_updated_at BEFORE UPDATE ON save_states FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
