// ============================================================
// Polyglot API — Cloudflare Worker
//
// All privileged work happens here: database credentials, password
// hashing, session issuance and the translation provider key. The
// browser never receives any of them.
//
//   GET  /health
//   POST /translate        { q, source, target }
//   POST /auth/register    { email, password, name, nativeLang, targetLang }
//   POST /auth/login       { email, password }
//   GET  /me               (session)
//   GET  /me/progress      (session)
//   POST /sync/push        { items[] }  (session)
//   GET  /admin/learners   (session, role=superadmin)
// ============================================================

import { db, rowToUser, str, num, type DbUser } from './turso';
import {
  hashPassword,
  verifyPassword,
  isLegacyHash,
  signSession,
  verifySession,
  type SessionPayload,
} from './auth';

export interface Env {
  ALLOWED_ORIGIN?: string;
  GOOGLE_TRANSLATE_KEY?: string;
  TURSO_URL?: string;
  TURSO_TOKEN?: string;
  SESSION_SECRET?: string;
}

const SUPPORTED_LANGS = new Set(['en', 'fr', 'ar', 'es', 'de']);
const MAX_TRANSLATE_CHARS = 500;
const MAX_SYNC_ITEMS = 500;
const EVENT_TYPES = new Set(['unit_completed', 'weakness_updated', 'translation_saved']);

// ── Plumbing ────────────────────────────────────────────────

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGIN ?? '').split(',').map(v => v.trim()).filter(Boolean);
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    'Access-Control-Allow-Origin': isLocal || allowed.includes(origin) ? origin : allowed[0] ?? '',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const json = (body: unknown, status: number, extra: Record<string, string>): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extra },
  });

async function readJson<T>(request: Request): Promise<T | null> {
  if (Number(request.headers.get('Content-Length') ?? '0') > 32_000) return null;
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

const normalizeEmail = (v: unknown): string =>
  typeof v === 'string' ? v.toLowerCase().trim() : '';

async function requireSession(
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<{ session: SessionPayload } | { error: Response }> {
  const header = request.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return { error: json({ error: 'Authentication required.' }, 401, cors) };

  const session = await verifySession(token, env.SESSION_SECRET ?? '');
  if (!session) return { error: json({ error: 'Session expired or invalid.' }, 401, cors) };
  return { session };
}

const publicUser = (u: DbUser) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  nativeLang: u.nativeLang,
  targetLang: u.targetLang,
  cefrLevel: u.cefrLevel,
  dailyGoal: u.dailyGoal,
  role: u.role,
});

// ── Translation ─────────────────────────────────────────────

function decodeEntities(value: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&nbsp;': ' ',
  };
  return value.replace(/&(?:amp|lt|gt|quot|#39|#x27|nbsp);/g, m => entities[m] ?? m);
}

async function translateWithGoogle(q: string, source: string, target: string, key: string) {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, source, target, format: 'text' }),
    }
  );
  if (!res.ok) return null;
  const payload = (await res.json()) as {
    data?: { translations?: { translatedText?: string }[] };
  };
  const text = payload.data?.translations?.[0]?.translatedText;
  return text ? decodeEntities(text).trim() : null;
}

async function translateWithMyMemory(q: string, source: string, target: string) {
  const url =
    'https://api.mymemory.translated.net/get' +
    `?q=${encodeURIComponent(q)}&langpair=${encodeURIComponent(`${source}|${target}`)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const payload = (await res.json()) as { responseData?: { translatedText?: string } };
  const text = payload.responseData?.translatedText?.trim() ?? '';
  return !text || /^MYMEMORY WARNING/i.test(text) ? null : text;
}

async function handleTranslate(request: Request, env: Env, cors: Record<string, string>) {
  const body = await readJson<{ q?: unknown; source?: unknown; target?: unknown }>(request);
  if (!body) return json({ error: 'Body must be JSON.' }, 400, cors);

  const q = typeof body.q === 'string' ? body.q.trim() : '';
  const source = typeof body.source === 'string' ? body.source.trim().toLowerCase() : '';
  const target = typeof body.target === 'string' ? body.target.trim().toLowerCase() : '';

  if (!q) return json({ error: 'q is required.' }, 400, cors);
  if (q.length > MAX_TRANSLATE_CHARS) {
    return json({ error: `q must be ${MAX_TRANSLATE_CHARS} characters or fewer.` }, 400, cors);
  }
  if (!SUPPORTED_LANGS.has(source) || !SUPPORTED_LANGS.has(target)) {
    return json({ error: 'Unsupported source or target language.' }, 400, cors);
  }
  if (source === target) return json({ translatedText: q, provider: 'identity' }, 200, cors);

  if (env.GOOGLE_TRANSLATE_KEY) {
    const google = await translateWithGoogle(q, source, target, env.GOOGLE_TRANSLATE_KEY);
    if (google) return json({ translatedText: google, provider: 'google' }, 200, cors);
  }

  const fallback = await translateWithMyMemory(q, source, target);
  if (fallback) return json({ translatedText: fallback, provider: 'mymemory' }, 200, cors);

  return json({ error: 'No translation provider available.' }, 502, cors);
}

// ── Auth routes ─────────────────────────────────────────────

async function handleRegister(request: Request, env: Env, cors: Record<string, string>) {
  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return json({ error: 'Body must be JSON.' }, 400, cors);

  const email = normalizeEmail(body.email);
  const password = typeof body.password === 'string' ? body.password : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const nativeLang = str(body.nativeLang) || 'en';
  const targetLang = str(body.targetLang) || 'fr';

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'Enter a valid email address.' }, 400, cors);
  }
  if (password.length < 6) {
    return json({ error: 'Password must be at least 6 characters.' }, 400, cors);
  }
  if (!SUPPORTED_LANGS.has(nativeLang) || !SUPPORTED_LANGS.has(targetLang)) {
    return json({ error: 'Unsupported language pair.' }, 400, cors);
  }

  const client = db(env as Required<Pick<Env, 'TURSO_URL' | 'TURSO_TOKEN'>>);
  const existing = await client.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [email],
  });
  if (existing.rows.length > 0) {
    return json({ error: 'An account with this email already exists.' }, 409, cors);
  }

  const id = `usr_${crypto.randomUUID()}`;
  const passwordHash = await hashPassword(password);

  await client.execute({
    sql: `INSERT INTO users
            (id, email, password_hash, name, native_lang, target_lang, cefr_level, daily_goal, role)
          VALUES (?, ?, ?, ?, ?, ?, 'A1', 15, 'learner')`,
    args: [id, email, passwordHash, name || email.split('@')[0], nativeLang, targetLang],
  });

  const user: DbUser = {
    id,
    email,
    name: name || email.split('@')[0],
    nativeLang,
    targetLang,
    cefrLevel: 'A1',
    dailyGoal: 15,
    role: 'learner',
    passwordHash,
  };

  const token = await signSession(user, env.SESSION_SECRET ?? '');
  return json({ user: publicUser(user), token }, 201, cors);
}

async function handleLogin(request: Request, env: Env, cors: Record<string, string>) {
  const body = await readJson<{ email?: unknown; password?: unknown }>(request);
  if (!body) return json({ error: 'Body must be JSON.' }, 400, cors);

  const email = normalizeEmail(body.email);
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) {
    return json({ error: 'Enter both email and password.' }, 400, cors);
  }

  const client = db(env as Required<Pick<Env, 'TURSO_URL' | 'TURSO_TOKEN'>>);
  const res = await client.execute({
    sql: `SELECT id, email, name, native_lang, target_lang, cefr_level, daily_goal,
                 password_hash, COALESCE(role, 'learner') AS role
          FROM users WHERE email = ?`,
    args: [email],
  });

  if (res.rows.length === 0) {
    return json({ error: 'No account found with this email.' }, 401, cors);
  }

  const user = rowToUser(res.rows[0] as Record<string, unknown>);
  if (!(await verifyPassword(password, user.passwordHash))) {
    return json({ error: 'Incorrect password.' }, 401, cors);
  }

  // Upgrade legacy browser-computed hashes on first successful login.
  if (isLegacyHash(user.passwordHash)) {
    const upgraded = await hashPassword(password);
    await client.execute({
      sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
      args: [upgraded, user.id],
    });
  }

  await client.execute({
    sql: "UPDATE users SET last_login = datetime('now') WHERE id = ?",
    args: [user.id],
  });

  const token = await signSession(user, env.SESSION_SECRET ?? '');
  return json({ user: publicUser(user), token }, 200, cors);
}

// ── Data routes ─────────────────────────────────────────────

async function handleProgress(env: Env, session: SessionPayload, cors: Record<string, string>) {
  const client = db(env as Required<Pick<Env, 'TURSO_URL' | 'TURSO_TOKEN'>>);
  const res = await client.execute({
    sql: 'SELECT unit_id FROM user_progress WHERE user_id = ? AND completed = 1',
    args: [session.sub],
  });
  const completedUnits = res.rows.map(r => str((r as Record<string, unknown>).unit_id));
  return json({ completedUnits }, 200, cors);
}

async function handleSyncPush(request: Request, env: Env, session: SessionPayload, cors: Record<string, string>) {
  const body = await readJson<{ items?: unknown }>(request);
  if (!body || !Array.isArray(body.items)) {
    return json({ error: 'items[] is required.' }, 400, cors);
  }
  if (body.items.length > MAX_SYNC_ITEMS) {
    return json({ error: `At most ${MAX_SYNC_ITEMS} items per request.` }, 413, cors);
  }

  const client = db(env as Required<Pick<Env, 'TURSO_URL' | 'TURSO_TOKEN'>>);
  let pushed = 0;

  for (const raw of body.items) {
    const item = raw as Record<string, unknown>;
    const eventType = str(item.eventType);
    if (!EVENT_TYPES.has(eventType)) continue;

    const id = str(item.id) || `sync_${crypto.randomUUID()}`;
    // Identity comes from the session, never from the payload.
    const userId = session.sub;
    const payload = (item.payload ?? {}) as Record<string, unknown>;

    if (eventType === 'unit_completed') {
      await client.execute({
        sql: `INSERT INTO user_progress (id, user_id, unit_id, completed, drill_score, completed_at)
              VALUES (?, ?, ?, 1, ?, datetime('now'))
              ON CONFLICT(user_id, unit_id) DO UPDATE SET
                drill_score = excluded.drill_score,
                completed_at = datetime('now')`,
        args: [id, userId, str(payload.unitId), num(payload.drillScore, 100)],
      });
    }

    if (eventType === 'weakness_updated') {
      const shown = num(payload.shownAnswer);
      const wrong = num(payload.wrongChoices);
      await client.execute({
        sql: `INSERT INTO user_weaknesses (id, user_id, word, shown_answer, wrong_choices, total_seen, last_seen)
              VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
              ON CONFLICT(user_id, word) DO UPDATE SET
                shown_answer = shown_answer + excluded.shown_answer,
                wrong_choices = wrong_choices + excluded.wrong_choices,
                total_seen = total_seen + 1,
                last_seen = datetime('now')`,
        args: [id, userId, str(payload.word), shown, wrong, shown + wrong + 1],
      });
    }

    if (eventType === 'translation_saved') {
      await client.execute({
        sql: `INSERT INTO user_translations
                (id, user_id, source_text, translated_text, source_lang, target_lang, is_starred)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          userId,
          str(payload.sourceText),
          str(payload.translatedText),
          str(payload.sourceLang) || 'en',
          str(payload.targetLang) || 'fr',
          payload.isStarred ? 1 : 0,
        ],
      });
    }

    await client.execute({
      sql: `INSERT INTO sync_events (id, user_id, event_type, payload_json)
            VALUES (?, ?, ?, ?)`,
      args: [id, userId, eventType, JSON.stringify(payload)],
    });
    pushed++;
  }

  return json({ pushed }, 200, cors);
}

async function handleAdminLearners(env: Env, session: SessionPayload, cors: Record<string, string>) {
  if (session.role !== 'superadmin') {
    return json({ error: 'Super admin access required.' }, 403, cors);
  }

  const client = db(env as Required<Pick<Env, 'TURSO_URL' | 'TURSO_TOKEN'>>);
  const usersRes = await client.execute(`
    SELECT id, email, name, native_lang, target_lang, cefr_level, daily_goal, created_at, last_login
    FROM users ORDER BY created_at DESC
  `);
  const progressRes = await client.execute(
    'SELECT user_id, COUNT(*) AS cnt FROM user_progress WHERE completed = 1 GROUP BY user_id'
  );
  const weakRes = await client.execute(
    'SELECT user_id, COUNT(*) AS cnt FROM user_weaknesses GROUP BY user_id'
  );

  const progress = new Map<string, number>();
  for (const r of progressRes.rows) {
    const row = r as Record<string, unknown>;
    progress.set(str(row.user_id), num(row.cnt));
  }
  const weak = new Map<string, number>();
  for (const r of weakRes.rows) {
    const row = r as Record<string, unknown>;
    weak.set(str(row.user_id), num(row.cnt));
  }

  let totalUnitsCompleted = 0;
  const users = usersRes.rows.map(r => {
    const row = r as Record<string, unknown>;
    const id = str(row.id);
    const completed = progress.get(id) ?? 0;
    totalUnitsCompleted += completed;
    return {
      id,
      email: str(row.email),
      name: str(row.name),
      nativeLang: str(row.native_lang) || 'en',
      targetLang: str(row.target_lang) || 'fr',
      cefrLevel: str(row.cefr_level) || 'A1',
      dailyGoal: num(row.daily_goal, 15),
      createdAt: str(row.created_at),
      lastLogin: str(row.last_login),
      completedUnitsCount: completed,
      weakWordsCount: weak.get(id) ?? 0,
      consistencyRate: Math.min(100, Math.round((completed / 20) * 100)),
    };
  });

  return json({ users, totalUsers: users.length, totalUnitsCompleted }, 200, cors);
}

// ── Router ──────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const dbReady = Boolean(env.TURSO_URL && env.TURSO_TOKEN && env.SESSION_SECRET);

    if (url.pathname === '/health') {
      return json(
        {
          ok: true,
          database: dbReady,
          providers: env.GOOGLE_TRANSLATE_KEY ? ['google', 'mymemory'] : ['mymemory'],
        },
        200,
        cors
      );
    }

    if (url.pathname === '/translate' && request.method === 'POST') {
      return handleTranslate(request, env, cors);
    }

    if (url.pathname.startsWith('/auth/') || url.pathname.startsWith('/me') || url.pathname.startsWith('/sync') || url.pathname.startsWith('/admin')) {
      if (!dbReady) {
        return json({ error: 'Server is not configured with a database.' }, 503, cors);
      }
    }

    if (url.pathname === '/auth/register' && request.method === 'POST') {
      return handleRegister(request, env, cors);
    }

    if (url.pathname === '/auth/login' && request.method === 'POST') {
      return handleLogin(request, env, cors);
    }

    if (url.pathname === '/me' && request.method === 'GET') {
      const auth = await requireSession(request, env, cors);
      if ('error' in auth) return auth.error;
      return json({ session: auth.session }, 200, cors);
    }

    if (url.pathname === '/me/progress' && request.method === 'GET') {
      const auth = await requireSession(request, env, cors);
      if ('error' in auth) return auth.error;
      return handleProgress(env, auth.session, cors);
    }

    if (url.pathname === '/sync/push' && request.method === 'POST') {
      const auth = await requireSession(request, env, cors);
      if ('error' in auth) return auth.error;
      return handleSyncPush(request, env, auth.session, cors);
    }

    if (url.pathname === '/admin/learners' && request.method === 'GET') {
      const auth = await requireSession(request, env, cors);
      if ('error' in auth) return auth.error;
      return handleAdminLearners(env, auth.session, cors);
    }

    return json({ error: 'Not found.' }, 404, cors);
  },
};
