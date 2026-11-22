// Minimal Turso client + value helpers for the Worker.
import { createClient, type Client } from '@libsql/client/web';

export interface DbEnv {
  TURSO_URL: string;
  TURSO_TOKEN: string;
}

let cached: Client | null = null;
let cachedKey = '';

/** One client per isolate; rebuilt only if the configured endpoint changes. */
export function db(env: DbEnv): Client {
  const key = `${env.TURSO_URL}|${env.TURSO_TOKEN.slice(-12)}`;
  if (!cached || cachedKey !== key) {
    cached = createClient({ url: env.TURSO_URL, authToken: env.TURSO_TOKEN });
    cachedKey = key;
  }
  return cached;
}

export const str = (v: unknown): string => (v == null ? '' : String(v));

export const num = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export interface DbUser {
  id: string;
  email: string;
  name: string;
  nativeLang: string;
  targetLang: string;
  cefrLevel: string;
  dailyGoal: number;
  role: 'learner' | 'superadmin';
  passwordHash: string;
}

export function rowToUser(row: Record<string, unknown>): DbUser {
  const role = str(row.role) === 'superadmin' ? 'superadmin' : 'learner';
  return {
    id: str(row.id),
    email: str(row.email),
    name: str(row.name),
    nativeLang: str(row.native_lang) || 'en',
    targetLang: str(row.target_lang) || 'fr',
    cefrLevel: str(row.cefr_level) || 'A1',
    dailyGoal: num(row.daily_goal, 15),
    role,
    passwordHash: str(row.password_hash),
  };
}
