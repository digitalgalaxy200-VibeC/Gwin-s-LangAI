// ============================================================
// SHARED PLATFORM-LEVEL CONTENT CACHE
// ============================================================
// Architecture: Cross-user vocabulary & AI content cache.
// When User A generates an AI explanation for "négocier",
// User B hitting that same word SKIPS the AI call and gets
// the cached result instantly — zero API cost, zero latency.
//
// Cache layers (fastest → slowest):
//   L1 — In-memory Map (current tab, ephemeral)
//   L2 — localStorage  (device-persistent across sessions)
//   L3 — Turso DB      (cross-device, cross-user, platform-wide)
//
// Key format: "{word}:{sourceLang}:{targetLang}:{contentType}"
// Content types: translation | phonetic | example_sentence |
//                ai_explanation | ai_roleplay_line
// ============================================================

export type ContentType =
  | 'translation'
  | 'phonetic'
  | 'example_sentence'
  | 'ai_explanation'
  | 'ai_roleplay_line';

export interface CacheEntry {
  key: string;           // "{word}:{src}:{tgt}:{type}"
  content: string;       // The cached string value
  hitCount: number;      // How many times this was served from cache
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
  expiresAt?: string;    // Optional TTL (ISO timestamp). Undefined = never expires.
}

const L2_STORAGE_KEY = 'polyglot_shared_content_cache_v1';
const L2_MAX_ENTRIES = 2000;        // Limit localStorage footprint
const DEFAULT_TTL_DAYS = 90;        // AI explanations expire after 90 days

// ── L1: In-memory cache ───────────────────────────────────────
const l1Cache = new Map<string, CacheEntry>();

// ── Helpers ───────────────────────────────────────────────────
function buildKey(
  word: string,
  sourceLang: string,
  targetLang: string,
  type: ContentType
): string {
  return `${word.trim().toLowerCase()}:${sourceLang}:${targetLang}:${type}`;
}

function isFresh(entry: CacheEntry): boolean {
  if (!entry.expiresAt) return true;
  return new Date(entry.expiresAt) > new Date();
}

function ttlDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// ── L2: localStorage I/O ──────────────────────────────────────
function l2Read(): Record<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(L2_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, CacheEntry>) : {};
  } catch {
    return {};
  }
}

function l2Write(store: Record<string, CacheEntry>): void {
  try {
    // Evict oldest entries if over limit
    const entries = Object.entries(store).sort(
      ([, a], [, b]) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    );
    const trimmed = entries.slice(-L2_MAX_ENTRIES);
    const slim: Record<string, CacheEntry> = {};
    for (const [k, v] of trimmed) slim[k] = v;
    localStorage.setItem(L2_STORAGE_KEY, JSON.stringify(slim));
  } catch {
    // Quota exceeded — silently skip; L1 still works
  }
}

// ── Main service object ───────────────────────────────────────
export const sharedContentCache = {

  /**
   * Look up cached content.
   * Checks L1 → L2 → returns null on miss.
   * Automatically promotes L2 hits to L1.
   */
  get(
    word: string,
    sourceLang: string,
    targetLang: string,
    type: ContentType
  ): string | null {
    const key = buildKey(word, sourceLang, targetLang, type);

    // L1 hit
    const l1 = l1Cache.get(key);
    if (l1 && isFresh(l1)) {
      l1.hitCount++;
      return l1.content;
    }

    // L2 hit
    const store = l2Read();
    const l2 = store[key];
    if (l2 && isFresh(l2)) {
      l2.hitCount++;
      store[key] = l2;
      l2Write(store);
      l1Cache.set(key, l2); // promote to L1
      return l2.content;
    }

    return null;
  },

  /**
   * Store content in L1 + L2 (write-through).
   * Pass ttlDays = 0 for no expiry (structural data like phonetics).
   */
  set(
    word: string,
    sourceLang: string,
    targetLang: string,
    type: ContentType,
    content: string,
    ttlDays: number = DEFAULT_TTL_DAYS
  ): void {
    const key = buildKey(word, sourceLang, targetLang, type);
    const now = new Date().toISOString();
    const entry: CacheEntry = {
      key,
      content,
      hitCount: 0,
      createdAt: now,
      updatedAt: now,
      expiresAt: ttlDays > 0 ? ttlDate(ttlDays) : undefined,
    };

    // L1
    l1Cache.set(key, entry);

    // L2
    const store = l2Read();
    store[key] = entry;
    l2Write(store);
  },

  /**
   * Warm up L1 from L2 at app startup.
   * Call once after the app mounts — loads fresh L2 entries into memory.
   */
  warmUp(): void {
    const store = l2Read();
    let loaded = 0;
    for (const [key, entry] of Object.entries(store)) {
      if (isFresh(entry)) {
        l1Cache.set(key, entry);
        loaded++;
      }
    }
    console.info(`[SharedCache] Warmed up ${loaded} entries from localStorage.`);
  },

  /**
   * Pre-seed the cache from the OFFLINE_LEXICON so every word
   * in our bundled dictionary hits L1 on first use.
   * Pass the lexicon array from offlineTranslationService.
   */
  seedFromLexicon(
    lexicon: { fr: string; en: string[]; phonetic: string; exampleFr?: string; exampleEn?: string }[]
  ): void {
    let seeded = 0;
    for (const entry of lexicon) {
      const { fr, en, phonetic, exampleFr, exampleEn } = entry;

      // Phonetic (no expiry — structural data)
      if (phonetic && !this.get(fr, 'fr', 'en', 'phonetic')) {
        this.set(fr, 'fr', 'en', 'phonetic', phonetic, 0);
        seeded++;
      }

      // Translation FR→EN
      if (en[0] && !this.get(fr, 'fr', 'en', 'translation')) {
        this.set(fr, 'fr', 'en', 'translation', en[0], 0);
        seeded++;
      }

      // Translation EN→FR
      if (en[0] && !this.get(en[0], 'en', 'fr', 'translation')) {
        this.set(en[0], 'en', 'fr', 'translation', fr, 0);
        seeded++;
      }

      // Example sentences (no expiry)
      if (exampleFr && !this.get(fr, 'fr', 'en', 'example_sentence')) {
        this.set(fr, 'fr', 'en', 'example_sentence', exampleFr, 0);
        seeded++;
      }
      if (exampleEn && !this.get(fr, 'fr', 'en', 'example_sentence')) {
        this.set(fr, 'en', 'fr', 'example_sentence', exampleEn || exampleFr || '', 0);
        seeded++;
      }
    }
    console.info(`[SharedCache] Seeded ${seeded} lexicon entries into cache.`);
  },

  /**
   * Returns cache statistics for the Super Admin Dashboard.
   */
  stats(): { l1Size: number; l2Size: number; totalHits: number } {
    const store = l2Read();
    const l2Size = Object.keys(store).length;
    const totalHits = Object.values(store).reduce((sum, e) => sum + e.hitCount, 0);
    return { l1Size: l1Cache.size, l2Size, totalHits };
  },

  /**
   * Flush expired entries from L2 (call on app startup or periodically).
   */
  purgeExpired(): number {
    const store = l2Read();
    let purged = 0;
    for (const [key, entry] of Object.entries(store)) {
      if (!isFresh(entry)) {
        delete store[key];
        l1Cache.delete(key);
        purged++;
      }
    }
    if (purged > 0) l2Write(store);
    console.info(`[SharedCache] Purged ${purged} expired entries.`);
    return purged;
  },

  /**
   * Export all L2 entries as an array — used to push to Turso
   * shared_content_cache table when the user is online.
   */
  exportForSync(): CacheEntry[] {
    const store = l2Read();
    return Object.values(store).filter(isFresh);
  },

  /**
   * Import a batch of entries received from Turso (cross-device sync).
   * Only overwrites local entries that have FEWER hits (newer server
   * data wins if the entry never appeared locally).
   */
  importFromServer(entries: CacheEntry[]): void {
    const store = l2Read();
    let imported = 0;
    for (const entry of entries) {
      const local = store[entry.key];
      // Server entry wins if local is missing or server has more community hits
      if (!local || entry.hitCount > local.hitCount) {
        store[entry.key] = entry;
        l1Cache.set(entry.key, entry);
        imported++;
      }
    }
    l2Write(store);
    console.info(`[SharedCache] Imported ${imported} entries from server.`);
  },
};
