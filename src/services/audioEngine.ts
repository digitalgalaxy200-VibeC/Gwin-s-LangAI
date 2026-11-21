import type { AudioCacheItem } from '../types/curriculum';
import { speechLocale } from './languageContext';

class AudioEngineService {
  private playbackRate: number = 0.9;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Prioritize natural French voices
        const frVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Thomas') || v.name.includes('Amelie')))
          || voices.find(v => v.lang.startsWith('fr'));
        if (frVoice) {
          this.voice = frVoice;
        }
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  public setSpeed(speed: number) {
    this.playbackRate = Math.max(0.5, Math.min(2.0, speed));
  }

  public getSpeed(): number {
    return this.playbackRate;
  }

  /** Picks the best installed voice for a language, ignoring the cached one. */
  private pickVoice(lang: string): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const code = lang.toLowerCase();
    return (
      voices.find(v => v.lang.toLowerCase().startsWith(code) && /natural|google/i.test(v.name)) ||
      voices.find(v => v.lang.toLowerCase().startsWith(code)) ||
      null
    );
  }

  /**
   * Speaks text in the given language. Defaults to French only for legacy
   * callers; new code should pass the learner's target language.
   */
  public async play(text: string, lang: string = 'fr', overrideSpeed?: number): Promise<void> {
    const rate = overrideSpeed ?? this.playbackRate;
    const locale = speechLocale(lang);

    // Check local audio cache if present in localStorage
    const cacheKey = this.computeAudioHash(text, locale, rate);
    const cached = localStorage.getItem(`audio_cache_${cacheKey}`);

    if (cached) {
      try {
        const item: AudioCacheItem = JSON.parse(cached);
        if (item.audioBlobUri) {
          const audio = new Audio(item.audioBlobUri);
          audio.playbackRate = rate;
          await audio.play();
          return;
        }
      } catch (e) {
        // Fall back to synthesis
      }
    }

    // Offline native/browser speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending utterances
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale;
      utterance.rate = rate;
      const voice = this.pickVoice(locale) || this.voice;
      if (voice) {
        utterance.voice = voice;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('[AudioEngine] No speech synthesis available on this device.');
    }
  }

  /** @deprecated Use play(text, 'fr') — kept for existing call sites. */
  public async playFrench(text: string, overrideSpeed?: number): Promise<void> {
    return this.play(text, 'fr', overrideSpeed);
  }

  public computeAudioHash(text: string, lang: string, speed: number): string {
    const normalized = `${lang}_${speed.toFixed(2)}_${text.trim().toLowerCase()}`;
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
}

export const audioEngine = new AudioEngineService();
