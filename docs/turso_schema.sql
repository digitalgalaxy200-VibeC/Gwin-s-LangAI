-- ============================================================
-- TURSO DATABASE SCHEMA — French & English AI Tutor (Multi-Tenant)
-- Execute this script in your Turso Shell or Dashboard SQL Editor:
--   turso db shell <your-db-name> < docs/turso_schema.sql
-- ============================================================

-- ── 1. INDIVIDUAL USERS TABLE ────────────────────────────────
-- Strictly isolates every person by their unique ID and email.
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,           -- UUID generated at registration
  email           TEXT NOT NULL UNIQUE,       -- Unique user email
  password_hash   TEXT NOT NULL,              -- Client-hashed password
  name            TEXT NOT NULL,              -- Learner display name
  native_lang     TEXT NOT NULL DEFAULT 'en', -- 'en' (learning French) OR 'fr' (learning English)
  target_lang     TEXT NOT NULL DEFAULT 'fr', -- 'fr' (French) OR 'en' (English)
  cefr_level      TEXT NOT NULL DEFAULT 'A1', -- 'A1', 'A2', 'B1', 'B2'
  daily_goal      INTEGER NOT NULL DEFAULT 15,-- Goal in minutes
  role            TEXT NOT NULL DEFAULT 'learner', -- 'learner' | 'superadmin'
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  last_login      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── 2. INDIVIDUAL LESSON PROGRESS TABLE ───────────────────────
-- Strictly partitioned by user_id. User A can NEVER see User B's units.
CREATE TABLE IF NOT EXISTS user_progress (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  unit_id         TEXT NOT NULL,              -- e.g. 'unit_1', 'unit_7'
  completed       INTEGER NOT NULL DEFAULT 1, -- 1 = completed, 0 = pending
  drill_score     INTEGER NOT NULL DEFAULT 100,
  completed_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, unit_id)
);

-- ── 3. INDIVIDUAL WEAKNESS LOG TABLE ─────────────────────────
-- Tracks words each specific user hesitated on or got wrong.
CREATE TABLE IF NOT EXISTS user_weaknesses (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  word            TEXT NOT NULL,
  shown_answer    INTEGER NOT NULL DEFAULT 0,
  wrong_choices   INTEGER NOT NULL DEFAULT 0,
  total_seen      INTEGER NOT NULL DEFAULT 0,
  last_seen       TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, word)
);

-- ── 4. INDIVIDUAL TRANSLATION & STARRED HISTORY ──────────────
-- Each person's private pocket dictionary history and bookmarks.
CREATE TABLE IF NOT EXISTS user_translations (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  source_text     TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_lang     TEXT NOT NULL,              -- 'en' or 'fr'
  target_lang     TEXT NOT NULL,              -- 'fr' or 'en'
  is_starred      INTEGER NOT NULL DEFAULT 0, -- 1 = bookmarked
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── 5. OFFLINE SYNC EVENT LOG TABLE ──────────────────────────
-- When a user is offline for days/weeks, changes queue up locally.
-- When internet returns, this table receives the batch push.
CREATE TABLE IF NOT EXISTS sync_events (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  event_type      TEXT NOT NULL,              -- 'unit_completed' | 'weakness_updated' | 'profile_updated'
  payload_json    TEXT NOT NULL,
  synced_at       TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── 6. PERFORMANCE INDEXES ───────────────────────────────────
-- Guarantees sub-millisecond retrieval filtered by user_id
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_weaknesses_user ON user_weaknesses(user_id);
CREATE INDEX IF NOT EXISTS idx_translations_user ON user_translations(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_events_user ON sync_events(user_id);
