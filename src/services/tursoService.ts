// ============================================================
// TURSO SYNC & USER AUTHENTICATION SERVICE
// Full offline-first architecture with strict user-id isolation.
// If offline for days/weeks, local progress queues up safely.
// When online, it syncs bidirectionally into the user's Turso account.
// ============================================================

import { createClient, type Client } from '@libsql/client/web';

export interface TursoUser {
  id: string;
  email: string;
  name: string;
  nativeLang: 'en' | 'fr';
  targetLang: 'fr' | 'en';
  cefrLevel: string;
  dailyGoal: number;
  role?: 'learner' | 'superadmin';
}

export interface TursoConfig {
  databaseUrl: string;
  authToken: string;
}

export interface SyncPendingQueueItem {
  id: string;
  userId: string;
  eventType: 'unit_completed' | 'weakness_updated' | 'translation_saved';
  payload: Record<string, unknown>;
  timestamp: string;
}

const CONFIG_STORAGE_KEY = 'turso_db_config_v1';
const AUTH_USER_KEY = 'turso_current_user_v1';
const PENDING_QUEUE_KEY = 'turso_pending_sync_queue_v1';

// Simple SHA-256 password hash for client-side privacy
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(password));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export class TursoService {
  private client: Client | null = null;
  private config: TursoConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  // ── Configuration ──────────────────────────────────────────
  public loadConfig(): TursoConfig | null {
    try {
      const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (raw) {
        this.config = JSON.parse(raw);
        if (this.config && this.config.databaseUrl && this.config.authToken) {
          this.client = createClient({
            url: this.config.databaseUrl,
            authToken: this.config.authToken,
          });
        }
      }
    } catch {
      this.config = null;
      this.client = null;
    }
    return this.config;
  }

  public setConfig(url: string, token: string): boolean {
    const cleanUrl = url.trim();
    const cleanToken = token.trim();
    if (!cleanUrl || !cleanToken) return false;

    this.config = { databaseUrl: cleanUrl, authToken: cleanToken };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));

    try {
      this.client = createClient({
        url: cleanUrl,
        authToken: cleanToken,
      });
      return true;
    } catch {
      return false;
    }
  }

  public isConfigured(): boolean {
    return !!this.client;
  }

  // ── User Authentication (Offline First with Online Cloud Verification) ──
  public getCurrentUser(): TursoUser | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (raw) return JSON.parse(raw) as TursoUser;
    } catch {}
    return null;
  }

  public setCurrentUser(user: TursoUser | null): void {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  public async register(
    email: string,
    passwordPlain: string,
    name: string,
    nativeLang: 'en' | 'fr' = 'en',
    targetLang: 'fr' | 'en' = 'fr'
  ): Promise<{ success: boolean; user?: TursoUser; error?: string }> {
    const cleanEmail = email.toLowerCase().trim();
    const passHash = await hashPassword(passwordPlain);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser: TursoUser = {
      id: userId,
      email: cleanEmail,
      name: name.trim() || cleanEmail.split('@')[0],
      nativeLang,
      targetLang,
      cefrLevel: 'A1',
      dailyGoal: 15,
    };

    // Save locally immediately so learner can start learning offline without waiting
    this.setCurrentUser(newUser);

    // If Turso client is configured, save into cloud
    if (this.client) {
      try {
        await this.client.execute({
          sql: `INSERT INTO users (id, email, password_hash, name, native_lang, target_lang, cefr_level, daily_goal)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            newUser.id,
            newUser.email,
            passHash,
            newUser.name,
            newUser.nativeLang,
            newUser.targetLang,
            newUser.cefrLevel,
            newUser.dailyGoal,
          ],
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('UNIQUE constraint')) {
          return { success: false, error: 'An account with this email already exists.' };
        }
      }
    }

    return { success: true, user: newUser };
  }

  public async login(
    email: string,
    passwordPlain: string
  ): Promise<{ success: boolean; user?: TursoUser; error?: string }> {
    const cleanEmail = email.toLowerCase().trim();
    const passHash = await hashPassword(passwordPlain);

    // If online with Turso
    if (this.client) {
      try {
        const res = await this.client.execute({
          sql: `SELECT id, email, name, native_lang, target_lang, cefr_level, daily_goal, password_hash FROM users WHERE email = ?`,
          args: [cleanEmail],
        });

        if (res.rows.length === 0) {
          return { success: false, error: 'No account found with this email.' };
        }

        const row = res.rows[0];
        if (String(row.password_hash) !== passHash) {
          return { success: false, error: 'Incorrect password.' };
        }

        const user: TursoUser = {
          id: String(row.id),
          email: String(row.email),
          name: String(row.name),
          nativeLang: (row.native_lang as 'en' | 'fr') || 'en',
          targetLang: (row.target_lang as 'fr' | 'en') || 'fr',
          cefrLevel: String(row.cefr_level || 'A1'),
          dailyGoal: Number(row.daily_goal || 15),
        };

        this.setCurrentUser(user);

        // Pull user's cloud progress down to local device
        await this.pullUserDataFromCloud(user.id);

        return { success: true, user };
      } catch {
        // If network fails, try local login fallback
      }
    }

    // Local fallback check
    const localUser = this.getCurrentUser();
    if (localUser && localUser.email.toLowerCase() === cleanEmail) {
      return { success: true, user: localUser };
    }

    return { success: false, error: 'Cannot connect to server. Check credentials or internet.' };
  }

  public logout(): void {
    this.setCurrentUser(null);
  }

  /**
   * Super admin sign-in. Unlike login(), this refuses any account whose
   * `role` is not 'superadmin' and never falls back to a cached local user.
   */
  public async loginSuperAdmin(
    email: string,
    passwordPlain: string
  ): Promise<{ success: boolean; user?: TursoUser; error?: string }> {
    if (!this.client) {
      return { success: false, error: 'Turso database is not connected yet.' };
    }

    const cleanEmail = email.toLowerCase().trim();
    const passHash = await hashPassword(passwordPlain);

    try {
      const res = await this.client.execute({
        sql: `SELECT id, email, name, native_lang, target_lang, cefr_level, daily_goal, password_hash,
                     COALESCE(role, 'learner') AS role
              FROM users WHERE email = ?`,
        args: [cleanEmail],
      });

      if (res.rows.length === 0) {
        return { success: false, error: 'No account found with this email.' };
      }

      const row = res.rows[0];
      if (String(row.role) !== 'superadmin') {
        return { success: false, error: 'This account does not have super admin access.' };
      }

      if (String(row.password_hash) !== passHash) {
        return { success: false, error: 'Incorrect password.' };
      }

      const user: TursoUser = {
        id: String(row.id),
        email: String(row.email),
        name: String(row.name),
        nativeLang: (row.native_lang as 'en' | 'fr') || 'en',
        targetLang: (row.target_lang as 'fr' | 'en') || 'fr',
        cefrLevel: String(row.cefr_level || 'A1'),
        dailyGoal: Number(row.daily_goal || 15),
        role: 'superadmin',
      };

      return { success: true, user };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('no such column') || msg.includes('role')) {
        return {
          success: false,
          error: 'Database is missing the users.role column. Run docs/turso_seed_superadmin.sql.',
        };
      }
      return { success: false, error: `Sign-in failed: ${msg}` };
    }
  }

  // ── Offline Queue & Sync Engine ─────────────────────────────
  // Every action (completed unit, weak word) queues locally when offline.
  // When online, queue pushes to Turso strictly isolated by user_id.

  public enqueueSyncItem(
    userId: string,
    eventType: SyncPendingQueueItem['eventType'],
    payload: Record<string, unknown>
  ): void {
    try {
      const raw = localStorage.getItem(PENDING_QUEUE_KEY);
      const queue: SyncPendingQueueItem[] = raw ? JSON.parse(raw) : [];
      queue.push({
        id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        eventType,
        payload,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue));
    } catch {}
  }

  public getPendingQueueCount(userId: string): number {
    try {
      const raw = localStorage.getItem(PENDING_QUEUE_KEY);
      if (!raw) return 0;
      const queue: SyncPendingQueueItem[] = JSON.parse(raw);
      return queue.filter(q => q.userId === userId).length;
    } catch {
      return 0;
    }
  }

  public async syncPendingQueue(userId: string): Promise<{ pushedCount: number; success: boolean; error?: string }> {
    if (!this.client) {
      return { pushedCount: 0, success: false, error: 'Turso database is not connected.' };
    }

    try {
      const raw = localStorage.getItem(PENDING_QUEUE_KEY);
      if (!raw) return { pushedCount: 0, success: true };

      const queue: SyncPendingQueueItem[] = JSON.parse(raw);
      const userItems = queue.filter(q => q.userId === userId);
      const remainingItems = queue.filter(q => q.userId !== userId);

      if (userItems.length === 0) return { pushedCount: 0, success: true };

      for (const item of userItems) {
        if (item.eventType === 'unit_completed') {
          const unitId = String(item.payload.unitId);
          const score = Number(item.payload.drillScore || 100);
          await this.client.execute({
            sql: `INSERT INTO user_progress (id, user_id, unit_id, completed, drill_score, completed_at)
                  VALUES (?, ?, ?, 1, ?, datetime('now'))
                  ON CONFLICT(user_id, unit_id) DO UPDATE SET drill_score = excluded.drill_score, completed_at = datetime('now')`,
            args: [`prog_${item.id}`, userId, unitId, score],
          });
        }

        if (item.eventType === 'weakness_updated') {
          const word = String(item.payload.word);
          const shown = Number(item.payload.shownAnswer || 0);
          const wrong = Number(item.payload.wrongChoices || 0);
          await this.client.execute({
            sql: `INSERT INTO user_weaknesses (id, user_id, word, shown_answer, wrong_choices, total_seen, last_seen)
                  VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                  ON CONFLICT(user_id, word) DO UPDATE SET 
                    shown_answer = shown_answer + excluded.shown_answer,
                    wrong_choices = wrong_choices + excluded.wrong_choices,
                    total_seen = total_seen + 1,
                    last_seen = datetime('now')`,
            args: [`weak_${item.id}`, userId, word, shown, wrong, shown + wrong + 1],
          });
        }

        // Log sync event for history audit
        await this.client.execute({
          sql: `INSERT INTO sync_events (id, user_id, event_type, payload_json) VALUES (?, ?, ?, ?)`,
          args: [item.id, userId, item.eventType, JSON.stringify(item.payload)],
        });
      }

      // Save only items belonging to other users (clear this user's pushed items)
      localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(remainingItems));
      return { pushedCount: userItems.length, success: true };
    } catch (err) {
      return {
        pushedCount: 0,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // Pull down cloud progress to make sure the user's phone has their full history
  public async pullUserDataFromCloud(userId: string): Promise<void> {
    if (!this.client) return;

    try {
      // 1. Progress
      const progRes = await this.client.execute({
        sql: `SELECT unit_id FROM user_progress WHERE user_id = ? AND completed = 1`,
        args: [userId],
      });
      if (progRes.rows.length > 0) {
        const rawLocal = localStorage.getItem('completed_units');
        const set = new Set<string>(rawLocal ? JSON.parse(rawLocal) : []);
        progRes.rows.forEach(r => set.add(String(r.unit_id)));
        localStorage.setItem('completed_units', JSON.stringify([...set]));
      }
    } catch {}
  }

  // ── SUPER ADMIN DASHBOARD QUERIES ──────────────────────────
  public async fetchAdminLearnerStats(): Promise<{
    users: {
      id: string;
      email: string;
      name: string;
      nativeLang: string;
      targetLang: string;
      cefrLevel: string;
      dailyGoal: number;
      createdAt: string;
      lastLogin: string;
      completedUnitsCount: number;
      weakWordsCount: number;
      consistencyRate: number; // Percentage based on activity
    }[];
    totalUsers: number;
    totalUnitsCompleted: number;
  }> {
    if (!this.client) {
      return { users: [], totalUsers: 0, totalUnitsCompleted: 0 };
    }

    try {
      const usersRes = await this.client.execute(`
        SELECT id, email, name, native_lang, target_lang, cefr_level, daily_goal, created_at, last_login
        FROM users
        ORDER BY created_at DESC
      `);

      const progressRes = await this.client.execute(`
        SELECT user_id, COUNT(*) as cnt FROM user_progress WHERE completed = 1 GROUP BY user_id
      `);

      const weakRes = await this.client.execute(`
        SELECT user_id, COUNT(*) as cnt FROM user_weaknesses GROUP BY user_id
      `);

      const progressMap = new Map<string, number>();
      progressRes.rows.forEach(r => progressMap.set(String(r.user_id), Number(r.cnt)));

      const weakMap = new Map<string, number>();
      weakRes.rows.forEach(r => weakMap.set(String(r.user_id), Number(r.cnt)));

      let totalUnits = 0;
      const formatted = usersRes.rows.map(u => {
        const uid = String(u.id);
        const completed = progressMap.get(uid) || 0;
        totalUnits += completed;
        const weak = weakMap.get(uid) || 0;

        // Calculate consistency metric (units done vs total 20 units)
        const consistencyRate = Math.min(100, Math.round((completed / 20) * 100));

        return {
          id: uid,
          email: String(u.email),
          name: String(u.name),
          nativeLang: String(u.native_lang || 'en'),
          targetLang: String(u.target_lang || 'fr'),
          cefrLevel: String(u.cefr_level || 'A1'),
          dailyGoal: Number(u.daily_goal || 15),
          createdAt: String(u.created_at || ''),
          lastLogin: String(u.last_login || ''),
          completedUnitsCount: completed,
          weakWordsCount: weak,
          consistencyRate,
        };
      });

      return {
        users: formatted,
        totalUsers: formatted.length,
        totalUnitsCompleted: totalUnits,
      };
    } catch {
      return { users: [], totalUsers: 0, totalUnitsCompleted: 0 };
    }
  }
}

export const tursoService = new TursoService();
