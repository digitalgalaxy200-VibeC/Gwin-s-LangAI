// ============================================================
// AUTH & SYNC SERVICE
//
// Talks to the Polyglot API Worker. The browser holds a session
// token and the user's own profile — never database credentials,
// and never a password hash. All privileged work (hashing,
// registration, sync, admin queries) happens server-side.
// ============================================================

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

export interface SyncPendingQueueItem {
  id: string;
  userId: string;
  eventType: 'unit_completed' | 'weakness_updated' | 'translation_saved';
  payload: Record<string, unknown>;
  timestamp: string;
}

const AUTH_USER_KEY = 'turso_current_user_v1';
const SESSION_TOKEN_KEY = 'polyglot_session_v1';
const PENDING_QUEUE_KEY = 'turso_pending_sync_queue_v1';

/** API origin, e.g. https://polyglot-api.example.workers.dev (no trailing slash). */
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim().replace(/\/+$/, '') ?? '';

interface ApiResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export class TursoService {
  private token: string | null = null;

  constructor() {
    try {
      this.token = localStorage.getItem(SESSION_TOKEN_KEY);
    } catch {
      this.token = null;
    }
  }

  // ── Configuration ──────────────────────────────────────────

  public isConfigured(): boolean {
    return Boolean(API_BASE);
  }

  public getApiBase(): string {
    return API_BASE;
  }

  private setToken(token: string | null): void {
    this.token = token;
    try {
      if (token) localStorage.setItem(SESSION_TOKEN_KEY, token);
      else localStorage.removeItem(SESSION_TOKEN_KEY);
    } catch {
      // Storage unavailable — session stays in memory only
    }
  }

  private async api<T>(
    path: string,
    init: { method?: string; body?: unknown; auth?: boolean } = {}
  ): Promise<ApiResult<T>> {
    if (!API_BASE) {
      return {
        ok: false,
        status: 0,
        error: 'The app has no API URL configured (VITE_API_URL).',
      };
    }

    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: init.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(init.auth && this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
      });

      const text = await res.text();
      const data = text ? (JSON.parse(text) as T & { error?: string }) : undefined;

      if (!res.ok) {
        return {
          ok: false,
          status: res.status,
          error: (data as { error?: string } | undefined)?.error ?? `Request failed (${res.status}).`,
        };
      }
      return { ok: true, status: res.status, data: data as T };
    } catch (err) {
      return {
        ok: false,
        status: 0,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // ── Session ────────────────────────────────────────────────

  public getCurrentUser(): TursoUser | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (raw) return JSON.parse(raw) as TursoUser;
    } catch {
      // Corrupted value — treat as signed out
    }
    return null;
  }

  public setCurrentUser(user: TursoUser | null): void {
    try {
      if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // Ignore storage failures
    }
  }

  public logout(): void {
    this.setCurrentUser(null);
    this.setToken(null);
  }

  // ── Auth ───────────────────────────────────────────────────

  public async register(
    email: string,
    passwordPlain: string,
    name: string,
    nativeLang: 'en' | 'fr' = 'en',
    targetLang: 'fr' | 'en' = 'fr'
  ): Promise<{ success: boolean; user?: TursoUser; error?: string }> {
    const res = await this.api<{ user: TursoUser; token: string }>('/auth/register', {
      method: 'POST',
      body: { email, password: passwordPlain, name, nativeLang, targetLang },
    });

    if (!res.ok || !res.data) return { success: false, error: res.error };

    this.setToken(res.data.token);
    this.setCurrentUser(res.data.user);
    return { success: true, user: res.data.user };
  }

  public async login(
    email: string,
    passwordPlain: string
  ): Promise<{ success: boolean; user?: TursoUser; error?: string }> {
    const cleanEmail = email.toLowerCase().trim();
    const res = await this.api<{ user: TursoUser; token: string }>('/auth/login', {
      method: 'POST',
      body: { email: cleanEmail, password: passwordPlain },
    });

    if (res.ok && res.data) {
      this.setToken(res.data.token);
      this.setCurrentUser(res.data.user);
      await this.pullUserDataFromCloud(res.data.user.id);
      return { success: true, user: res.data.user };
    }

    // Network unavailable: allow re-entry with the cached session so a
    // learner who is already signed in here can keep working offline.
    const cached = this.getCurrentUser();
    if (res.status === 0 && cached && cached.email.toLowerCase() === cleanEmail) {
      return { success: true, user: cached };
    }

    return { success: false, error: res.error ?? 'Sign in failed.' };
  }

  public async loginSuperAdmin(
    email: string,
    passwordPlain: string
  ): Promise<{ success: boolean; user?: TursoUser; error?: string }> {
    const res = await this.login(email, passwordPlain);
    if (!res.success || !res.user) return res;

    if (res.user.role !== 'superadmin') {
      return { success: false, error: 'This account does not have super admin access.' };
    }
    return res;
  }

  // ── Offline queue & sync ───────────────────────────────────

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
    } catch {
      // Queue is best-effort
    }
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

  public async syncPendingQueue(
    userId: string
  ): Promise<{ pushedCount: number; success: boolean; error?: string }> {
    if (!this.token) {
      return { pushedCount: 0, success: false, error: 'Sign in to sync your progress.' };
    }

    let queue: SyncPendingQueueItem[] = [];
    try {
      const raw = localStorage.getItem(PENDING_QUEUE_KEY);
      queue = raw ? JSON.parse(raw) : [];
    } catch {
      queue = [];
    }

    const mine = queue.filter(q => q.userId === userId);
    if (mine.length === 0) return { pushedCount: 0, success: true };

    const res = await this.api<{ pushed: number }>('/sync/push', {
      method: 'POST',
      auth: true,
      body: { items: mine },
    });

    if (!res.ok) {
      return { pushedCount: 0, success: false, error: res.error };
    }

    try {
      const remaining = queue.filter(q => q.userId !== userId);
      localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(remaining));
    } catch {
      // Ignore storage failures
    }

    return { pushedCount: res.data?.pushed ?? mine.length, success: true };
  }

  /** Pull the learner's completed units back into local state. */
  public async pullUserDataFromCloud(_userId: string): Promise<void> {
    if (!this.token) return;

    const res = await this.api<{ completedUnits: string[] }>('/me/progress', { auth: true });
    if (!res.ok || !res.data) return;

    try {
      const raw = localStorage.getItem('completed_units');
      const local: string[] = raw ? JSON.parse(raw) : [];
      const merged = new Set<string>([...local, ...res.data.completedUnits]);
      localStorage.setItem('completed_units', JSON.stringify([...merged]));
    } catch {
      // Ignore storage failures
    }
  }

  // ── Admin ──────────────────────────────────────────────────

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
      consistencyRate: number;
    }[];
    totalUsers: number;
    totalUnitsCompleted: number;
  }> {
    const empty = { users: [], totalUsers: 0, totalUnitsCompleted: 0 };
    const res = await this.api<typeof empty>('/admin/learners', { auth: true });
    return res.ok && res.data ? res.data : empty;
  }
}

export const tursoService = new TursoService();
