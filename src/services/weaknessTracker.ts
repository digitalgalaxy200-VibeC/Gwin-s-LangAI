// ============================================================
// WEAKNESS TRACKER — Offline, localStorage-based
// Tracks every word the user struggled with across all units.
// Phase 3: weakness data will also sync to Supabase.
// ============================================================

export interface WeaknessEntry {
  word: string;           // French word or phrase
  shownAnswer: number;    // Times user tapped "Show Answer" instead of speaking
  wrongChoices: number;   // Times user chose wrong option in drill
  slowResponses: number;  // Times response took > 4 seconds (future timer integration)
  totalSeen: number;      // Total times this word appeared in a drill
  lastSeen: string;       // ISO date string
}

export interface WeaknessProfile {
  userId: string;
  words: Record<string, WeaknessEntry>;
  lastUpdated: string;
}

const STORAGE_KEY = 'weakness_profile';

function loadProfile(userId: string): WeaknessProfile {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (raw) return JSON.parse(raw) as WeaknessProfile;
  } catch {}
  return { userId, words: {}, lastUpdated: new Date().toISOString() };
}

function saveProfile(profile: WeaknessProfile): void {
  profile.lastUpdated = new Date().toISOString();
  localStorage.setItem(`${STORAGE_KEY}_${profile.userId}`, JSON.stringify(profile));
}

// ── Scoring: higher = weaker ──────────────────────────────────
function weaknessScore(e: WeaknessEntry): number {
  const missRate = e.totalSeen > 0 ? (e.shownAnswer + e.wrongChoices) / e.totalSeen : 0;
  return Math.round(missRate * 100) + e.shownAnswer * 2 + e.wrongChoices * 3;
}

// ── Public API ────────────────────────────────────────────────

export const weaknessTracker = {
  /**
   * Record that the user tapped "Show Answer" instead of speaking.
   * This is the primary weakness signal.
   */
  recordShownAnswer(userId: string, word: string): void {
    const profile = loadProfile(userId);
    const entry = profile.words[word] ?? {
      word, shownAnswer: 0, wrongChoices: 0, slowResponses: 0, totalSeen: 0, lastSeen: '',
    };
    entry.shownAnswer += 1;
    entry.totalSeen += 1;
    entry.lastSeen = new Date().toISOString();
    profile.words[word] = entry;
    saveProfile(profile);
  },

  /**
   * Record a wrong choice in a multiple-choice drill.
   */
  recordWrongChoice(userId: string, word: string): void {
    const profile = loadProfile(userId);
    const entry = profile.words[word] ?? {
      word, shownAnswer: 0, wrongChoices: 0, slowResponses: 0, totalSeen: 0, lastSeen: '',
    };
    entry.wrongChoices += 1;
    entry.totalSeen += 1;
    entry.lastSeen = new Date().toISOString();
    profile.words[word] = entry;
    saveProfile(profile);
  },

  /**
   * Record a correct answer (reduces weakness score over time).
   */
  recordCorrect(userId: string, word: string): void {
    const profile = loadProfile(userId);
    const entry = profile.words[word];
    if (!entry) return; // only track words that have been weak before
    entry.totalSeen += 1;
    entry.lastSeen = new Date().toISOString();
    profile.words[word] = entry;
    saveProfile(profile);
  },

  /**
   * Get the top N weakest words for a user.
   */
  getWeakestWords(userId: string, limit = 10): WeaknessEntry[] {
    const profile = loadProfile(userId);
    return Object.values(profile.words)
      .filter(e => weaknessScore(e) > 0)
      .sort((a, b) => weaknessScore(b) - weaknessScore(a))
      .slice(0, limit);
  },

  /**
   * Get the full weakness profile.
   */
  getProfile(userId: string): WeaknessProfile {
    return loadProfile(userId);
  },

  /**
   * Check if the user has enough weakness data to run a review session.
   */
  hasReviewData(userId: string): boolean {
    return this.getWeakestWords(userId, 5).length >= 3;
  },

  /**
   * Calculate a mastery percentage (100% = no weaknesses).
   */
  getMasteryPercent(userId: string): number {
    const profile = loadProfile(userId);
    const entries = Object.values(profile.words);
    if (entries.length === 0) return 100;
    const weakCount = entries.filter(e => weaknessScore(e) > 10).length;
    return Math.max(0, Math.round(((entries.length - weakCount) / entries.length) * 100));
  },
};
