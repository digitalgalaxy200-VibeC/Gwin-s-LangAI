// ============================================================
// LANGUAGE CONTEXT
// Single source of truth for the signed-in learner's language pair.
// Every AI prompt and speech engine reads from here instead of
// assuming the learner speaks English and is learning French.
// ============================================================

import { tursoService } from './tursoService';

export type LangCode = 'en' | 'fr' | 'ar';

export interface LanguagePair {
  /** The language the learner already speaks. */
  native: LangCode;
  /** The language the learner is trying to learn. */
  target: LangCode;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'French',
  ar: 'Arabic',
  es: 'Spanish',
  de: 'German',
};

const SPEECH_LOCALES: Record<string, string> = {
  en: 'en-GB',
  fr: 'fr-FR',
  ar: 'ar-SA',
  es: 'es-ES',
  de: 'de-DE',
};

export function languageName(code?: string): string {
  const key = (code || '').toLowerCase();
  return LANGUAGE_NAMES[key] || code || 'French';
}

export function speechLocale(code?: string): string {
  const key = (code || '').toLowerCase();
  return SPEECH_LOCALES[key] || `${key || 'fr'}-${key ? key.toUpperCase() : 'FR'}`;
}

/**
 * The current learner's pair. Falls back to English → French for guests,
 * which matches the default registration flow.
 */
export function getUserLanguagePair(fallback?: Partial<LanguagePair>): LanguagePair {
  let user = null;
  try {
    user = tursoService.getCurrentUser();
  } catch {
    user = null;
  }

  return {
    native: (user?.nativeLang || fallback?.native || 'en') as LangCode,
    target: (user?.targetLang || fallback?.target || 'fr') as LangCode,
  };
}
