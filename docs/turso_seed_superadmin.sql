-- ============================================================
-- BOOTSTRAP SUPER ADMIN ACCOUNT
--
--   turso db shell <your-db-name> < docs/turso_seed_superadmin.sql
--
-- The password is stored as a SHA-256 hex hash, matching hashPassword()
-- in src/services/tursoService.ts. The plaintext password is never
-- written into the repository. Treat this hash as a credential:
-- rotate the password before real users exist.
-- ============================================================

-- Databases created before the `role` column existed need this once.
-- SQLite has no "ADD COLUMN IF NOT EXISTS", so a
-- "duplicate column name: role" error here is expected and harmless.
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'learner';

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Super admin account. Safe to re-run: an existing row with this email
-- is promoted to superadmin and its password hash is reset.
INSERT INTO users (id, email, password_hash, name, native_lang, target_lang, cefr_level, daily_goal, role)
VALUES (
  'usr_superadmin_gwyn',
  'gwyn.ukoha@gmail.com',
  '8552a14277347cfcc0d3511c18cfd04cefc5969119327f90548e7199957c6b29',
  'Gwyn',
  'en',
  'fr',
  'A1',
  15,
  'superadmin'
)
ON CONFLICT(email) DO UPDATE SET
  password_hash = excluded.password_hash,
  role          = 'superadmin';
