-- ============================================================
-- SUPABASE SCHEMA — French AI Tutor
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- All tables use Row Level Security (RLS) so users only see
-- their own data. The anon key is safe to use in the app.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. USER PROFILES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  local_id      TEXT NOT NULL UNIQUE,       -- matches SQLite profile.id
  name          TEXT NOT NULL,
  cefr_level    TEXT NOT NULL DEFAULT 'A1',
  daily_goal_minutes INTEGER NOT NULL DEFAULT 15,
  native_language TEXT NOT NULL DEFAULT 'en',
  motivation    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON public.user_profiles FOR SELECT
  USING (local_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (local_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (local_id = current_setting('app.user_id', true));

-- ── 2. UNIT PROGRESS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.unit_progress (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_local_id TEXT NOT NULL,
  unit_id       TEXT NOT NULL,              -- e.g. 'unit_1', 'unit_7'
  completed     BOOLEAN NOT NULL DEFAULT FALSE,
  drill_score   INTEGER,                    -- 0-100 percentage
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_local_id, unit_id)
);

ALTER TABLE public.unit_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own unit progress"
  ON public.unit_progress FOR SELECT
  USING (user_local_id = current_setting('app.user_id', true));

CREATE POLICY "Users can upsert own unit progress"
  ON public.unit_progress FOR INSERT
  WITH CHECK (user_local_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update own unit progress"
  ON public.unit_progress FOR UPDATE
  USING (user_local_id = current_setting('app.user_id', true));

-- ── 3. WEAKNESS PROFILE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weakness_profile (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_local_id   TEXT NOT NULL,
  word            TEXT NOT NULL,
  shown_answer    INTEGER NOT NULL DEFAULT 0,
  wrong_choices   INTEGER NOT NULL DEFAULT 0,
  slow_responses  INTEGER NOT NULL DEFAULT 0,
  total_seen      INTEGER NOT NULL DEFAULT 0,
  last_seen       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_local_id, word)
);

ALTER TABLE public.weakness_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own weaknesses"
  ON public.weakness_profile FOR SELECT
  USING (user_local_id = current_setting('app.user_id', true));

CREATE POLICY "Users can upsert own weaknesses"
  ON public.weakness_profile FOR INSERT
  WITH CHECK (user_local_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update own weaknesses"
  ON public.weakness_profile FOR UPDATE
  USING (user_local_id = current_setting('app.user_id', true));

-- ── 4. SYNC EVENT LOG ────────────────────────────────────────
-- Tracks every sync push from local → cloud (additive only, LWW)
CREATE TABLE IF NOT EXISTS public.sync_events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_local_id TEXT NOT NULL,
  event_type    TEXT NOT NULL,              -- 'unit_completed', 'weakness_updated', 'profile_synced'
  payload       JSONB,
  synced_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sync_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own sync events"
  ON public.sync_events FOR INSERT
  WITH CHECK (user_local_id = current_setting('app.user_id', true));

CREATE POLICY "Users can read own sync events"
  ON public.sync_events FOR SELECT
  USING (user_local_id = current_setting('app.user_id', true));

-- ── 5. AI CONVERSATION LOG (Phase 3) ─────────────────────────
-- Logs AI roleplay exchanges for future analysis
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_local_id TEXT NOT NULL,
  unit_id       TEXT NOT NULL,
  scenario      TEXT,
  messages      JSONB NOT NULL DEFAULT '[]',
  corrections   JSONB NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own conversations"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (user_local_id = current_setting('app.user_id', true));

CREATE POLICY "Users can read own conversations"
  ON public.ai_conversations FOR SELECT
  USING (user_local_id = current_setting('app.user_id', true));

-- ── 6. HELPER FUNCTIONS ───────────────────────────────────────

-- Get user's weakest words (called from app via RPC)
CREATE OR REPLACE FUNCTION public.get_weakest_words(p_user_id TEXT, p_limit INT DEFAULT 10)
RETURNS TABLE(word TEXT, score INT) AS $$
  SELECT
    word,
    (shown_answer * 2 + wrong_choices * 3 + slow_responses) AS score
  FROM public.weakness_profile
  WHERE user_local_id = p_user_id
  ORDER BY score DESC
  LIMIT p_limit;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ── 7. UPDATED_AT TRIGGER ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_weakness_profile_updated_at
  BEFORE UPDATE ON public.weakness_profile
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 8. INDEXES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_unit_progress_user ON public.unit_progress(user_local_id);
CREATE INDEX IF NOT EXISTS idx_weakness_user ON public.weakness_profile(user_local_id);
CREATE INDEX IF NOT EXISTS idx_sync_events_user ON public.sync_events(user_local_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_local_id);

-- ============================================================
-- HOW TO USE:
-- 1. Go to your Supabase project → SQL Editor
-- 2. Paste this entire file and click Run
-- 3. Copy your Project URL and anon key
-- 4. In the app → Profile tab → Cloud Sync → paste URL + key → Connect
-- ============================================================
