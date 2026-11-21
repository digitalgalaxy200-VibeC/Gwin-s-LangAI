export interface AIResponse {
  /** Target-language text. Legacy name kept so existing call sites still work. */
  frenchText: string;
  /** Native-language translation. Legacy name kept for compatibility. */
  englishTranslation: string;
  /** Language-neutral aliases for new code. */
  targetText?: string;
  nativeText?: string;
  formality: 'formal' | 'informal' | 'neutral';
  explanation?: string;
  reusableSlot?: string;
  retrievalLevel: 1 | 2 | 3; // 1 = exact cache, 2 = pattern match, 3 = LLM fallback
  estimatedCostUsd: number;
}

export interface IAIProvider {
  askTutor(userPrompt: string, apiKey?: string): Promise<AIResponse>;
  roleplayChat(
    scenario: string,
    messageHistory: { role: 'user' | 'assistant'; content: string }[],
    apiKey?: string
  ): Promise<{ responseFr: string; responseEn: string; correction?: string }>;
}

export interface CachedTranslationItem {
  id: string;
  inputPrompt: string;
  normalizedQuery: string;
  frenchText: string;
  englishText: string;
  formality: 'formal' | 'informal' | 'neutral';
  patternTemplate?: string; // e.g. "Vous avez fait du très bon travail {time_slot}."
  slotValues?: Record<string, string>;
  createdAt: string;
}

export interface AIRequestLog {
  id: string;
  query: string;
  retrievalLevel: 1 | 2 | 3;
  tokensUsed: number;
  costUsd: number;
  timestamp: string;
}
