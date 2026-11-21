import type { AIResponse, CachedTranslationItem, IAIProvider, AIRequestLog } from '../types/ai';

// Pre-seeded patterns for Level 2 slot substitution
interface GrammarPatternRule {
  patternRegex: RegExp;
  frenchTemplate: string;
  englishTemplate: string;
  slots: Record<string, Record<string, { fr: string; en: string }>>;
}

const GRAMMAR_PATTERNS: GrammarPatternRule[] = [
  {
    // "you did a good job [time]" / "you did very good work [time]"
    patternRegex: /(?:you did (?:a )?(?:very )?good (?:job|work)) (this morning|this afternoon|this evening|yesterday|tomorrow)/i,
    frenchTemplate: 'Vous avez fait du très bon travail {time}.',
    englishTemplate: 'You did very good work {time}.',
    slots: {
      time: {
        'this morning': { fr: 'ce matin', en: 'this morning' },
        'this afternoon': { fr: 'cet après-midi', en: 'this afternoon' },
        'this evening': { fr: 'ce soir', en: 'this evening' },
        'yesterday': { fr: 'hier', en: 'yesterday' },
        'tomorrow': { fr: 'demain', en: 'tomorrow' },
      }
    }
  },
  {
    // "how much is [item]" / "what is the price of [item]"
    patternRegex: /(?:how much (?:is|are)|what is the price of) (the apples|the bread|a coffee|a kilo of mangoes)/i,
    frenchTemplate: 'C’est combien {item} ?',
    englishTemplate: 'How much is {item}?',
    slots: {
      item: {
        'the apples': { fr: 'les pommes', en: 'the apples' },
        'the bread': { fr: 'le pain', en: 'the bread' },
        'a coffee': { fr: 'un café', en: 'a coffee' },
        'a kilo of mangoes': { fr: 'le kilo de mangues', en: 'a kilo of mangoes' },
      }
    }
  },
  {
    // "i would like to speak with [person]"
    patternRegex: /i (?:would like|want) to speak (?:with|to) (the manager|the boss|the receptionist|the driver)/i,
    frenchTemplate: 'Je voudrais parler avec {person}, s’il vous plaît.',
    englishTemplate: 'I would like to speak with {person}, please.',
    slots: {
      person: {
        'the manager': { fr: 'le responsable', en: 'the manager' },
        'the boss': { fr: 'le patron', en: 'the boss' },
        'the receptionist': { fr: 'la réceptionniste', en: 'the receptionist' },
        'the driver': { fr: 'le chauffeur', en: 'the driver' },
      }
    }
  }
];

export class RetrievalEngine {
  private cacheKey = 'ai_translations_cache';
  private logsKey = 'ai_request_logs';

  private normalize(query: string): string {
    return query
      .toLowerCase()
      .replace(/[?!.,'"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public getSavedCache(): CachedTranslationItem[] {
    const raw = localStorage.getItem(this.cacheKey);
    return raw ? JSON.parse(raw) : [];
  }

  private saveToCache(item: CachedTranslationItem): void {
    const cache = this.getSavedCache();
    cache.unshift(item);
    localStorage.setItem(this.cacheKey, JSON.stringify(cache));
  }

  public logRequest(log: Omit<AIRequestLog, 'id' | 'timestamp'>): void {
    const raw = localStorage.getItem(this.logsKey);
    const logs: AIRequestLog[] = raw ? JSON.parse(raw) : [];
    logs.unshift({
      ...log,
      id: 'log_' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(this.logsKey, JSON.stringify(logs));
  }

  public getStats(): { level1Hits: number; level2Hits: number; level3Hits: number; totalSavedUsd: number } {
    const raw = localStorage.getItem(this.logsKey);
    const logs: AIRequestLog[] = raw ? JSON.parse(raw) : [];
    let l1 = 0, l2 = 0, l3 = 0;
    logs.forEach(l => {
      if (l.retrievalLevel === 1) l1++;
      if (l.retrievalLevel === 2) l2++;
      if (l.retrievalLevel === 3) l3++;
    });
    // Estimated $0.003 saved per cached hit vs standard cloud LLM tokens
    const totalSavedUsd = (l1 + l2) * 0.003;
    return { level1Hits: l1, level2Hits: l2, level3Hits: l3, totalSavedUsd };
  }

  /**
   * 3-Tier Retrieval:
   * Level 1: Exact Match in local SQLite/localStorage cache
   * Level 2: Deterministic Slot/Pattern Substitution (0 tokens)
   * Level 3: External AI Provider fallback
   */
  public async query(prompt: string, aiProvider: IAIProvider, apiKey?: string): Promise<AIResponse> {
    const norm = this.normalize(prompt);

    // LEVEL 1: Exact Match
    const cache = this.getSavedCache();
    const exactHit = cache.find(item => item.normalizedQuery === norm || this.normalize(item.inputPrompt) === norm);
    if (exactHit) {
      this.logRequest({ query: prompt, retrievalLevel: 1, tokensUsed: 0, costUsd: 0 });
      return {
        frenchText: exactHit.frenchText,
        englishTranslation: exactHit.englishText,
        formality: exactHit.formality,
        explanation: 'Retrieved instantly from your local exact-match library (Level 1 Cache, $0).',
        retrievalLevel: 1,
        estimatedCostUsd: 0,
      };
    }

    // LEVEL 2: Pattern and Slot Matching
    for (const rule of GRAMMAR_PATTERNS) {
      const match = prompt.match(rule.patternRegex);
      if (match && match[1]) {
        const slotKey = Object.keys(rule.slots)[0];
        const capturedValue = match[1].toLowerCase().trim();
        const slotMap = rule.slots[slotKey];

        if (slotMap && slotMap[capturedValue]) {
          const frReplacement = slotMap[capturedValue].fr;
          const enReplacement = slotMap[capturedValue].en;

          const synthesizedFr = rule.frenchTemplate.replace(`{${slotKey}}`, frReplacement);
          const synthesizedEn = rule.englishTemplate.replace(`{${slotKey}}`, enReplacement);

          // Save newly synthesized expression to Level 1 cache for future
          this.saveToCache({
            id: 'synth_' + Date.now().toString(36),
            inputPrompt: prompt,
            normalizedQuery: norm,
            frenchText: synthesizedFr,
            englishText: synthesizedEn,
            formality: 'formal',
            patternTemplate: rule.frenchTemplate,
            createdAt: new Date().toISOString(),
          });

          this.logRequest({ query: prompt, retrievalLevel: 2, tokensUsed: 0, costUsd: 0 });

          return {
            frenchText: synthesizedFr,
            englishTranslation: synthesizedEn,
            formality: 'formal',
            explanation: `Assembled locally via grammar pattern engine without calling AI (Level 2 Substitution: slot "${capturedValue}" -> "${frReplacement}").`,
            retrievalLevel: 2,
            estimatedCostUsd: 0,
          };
        }
      }
    }

    // LEVEL 3: AI Provider Fallback
    const aiResult = await aiProvider.askTutor(prompt, apiKey);
    
    // Save generated result locally so it is never called again
    this.saveToCache({
      id: 'ai_' + Date.now().toString(36),
      inputPrompt: prompt,
      normalizedQuery: norm,
      frenchText: aiResult.frenchText,
      englishText: aiResult.englishTranslation,
      formality: aiResult.formality,
      createdAt: new Date().toISOString(),
    });

    this.logRequest({
      query: prompt,
      retrievalLevel: 3,
      tokensUsed: 120,
      costUsd: aiResult.estimatedCostUsd,
    });

    return aiResult;
  }
}

export const retrievalEngine = new RetrievalEngine();
