import type { IAIProvider, AIResponse } from '../types/ai';
import { sharedContentCache } from './sharedContentCache';
import { getUserLanguagePair, languageName } from './languageContext';

export class DeepSeekProvider implements IAIProvider {
  public async askTutor(userPrompt: string, apiKey?: string): Promise<AIResponse> {
    const { native, target } = getUserLanguagePair();
    const targetName = languageName(target);
    const nativeName = languageName(native);

    // ── Shared cache lookup (L1 → L2) ────────────────────────
    // Keyed by prompt and language pair, so the same question asked for
    // a different target language is never served the wrong answer.
    const cacheKey = `${userPrompt}::${native}->${target}`;
    const cached = sharedContentCache.get(cacheKey, native, target, 'ai_explanation');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AIResponse;
        console.info('[DeepSeek] Cache HIT — skipped AI call');
        return { ...parsed, estimatedCostUsd: 0 };
      } catch {
        // Corrupted entry — fall through to live call
      }
    }

    // If no API key provided or offline, return smart local heuristic translation
    if (!apiKey) {
      return this.fallbackHeuristic(userPrompt);
    }

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are an expert ${targetName} Language Tutor. The learner already speaks ${nativeName} and may ask in ${nativeName}, ${targetName}, or a mix of both (e.g. "Bonjour, je voudrais parler avec... I don't know how to say manager").
Always return a strict JSON object with:
{
  "targetText": "natural, authentic ${targetName} sentence answering the learner",
  "nativeText": "natural ${nativeName} translation of targetText",
  "formality": "formal" | "informal" | "neutral",
  "explanation": "brief explanation in ${nativeName}"
}`
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const json = await response.json();
      const content = JSON.parse(json.choices[0].message.content);
      const targetText = content.targetText ?? content.frenchText ?? '';
      const nativeText = content.nativeText ?? content.englishTranslation ?? '';

      const result: AIResponse = {
        frenchText: targetText,
        englishTranslation: nativeText,
        targetText,
        nativeText,
        formality: content.formality || 'neutral',
        explanation: content.explanation,
        retrievalLevel: 3,
        estimatedCostUsd: 0.0008,
      };

      // ── Write-through to shared cache ───────────────────────
      // Any future user asking the identical prompt skips this call.
      sharedContentCache.set(cacheKey, native, target, 'ai_explanation', JSON.stringify(result));
      return result;
    } catch (err) {
      console.warn('[DeepSeekProvider] API call failed, using heuristic fallback:', err);
      return this.fallbackHeuristic(userPrompt);
    }
  }

  public async roleplayChat(
    scenario: string,
    messageHistory: { role: 'user' | 'assistant'; content: string }[],
    apiKey?: string
  ): Promise<{ responseFr: string; responseEn: string; correction?: string }> {
    // Build a cache key from language pair, scenario and last user message
    const { native, target } = getUserLanguagePair();
    const targetName = languageName(target);
    const nativeName = languageName(native);
    const lastMsg = messageHistory[messageHistory.length - 1]?.content || '';
    const roleplayCacheKey = `${native}->${target}::${scenario.substring(0, 60)}::${lastMsg.substring(0, 80)}`;
    const cachedRoleplay = sharedContentCache.get(roleplayCacheKey, native, target, 'ai_roleplay_line');
    if (cachedRoleplay) {
      try {
        const parsed = JSON.parse(cachedRoleplay) as { responseFr: string; responseEn: string; correction?: string };
        console.info('[DeepSeek] Roleplay cache HIT');
        return parsed;
      } catch { /* fall through */ }
    }

    if (!apiKey) {
      return this.heuristicRoleplay(scenario, lastMsg);
    }

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are participating in a realistic ${targetName} spoken roleplay scenario: "${scenario}".
The learner speaks ${nativeName} and may answer in ${targetName}, ${nativeName}, or a mix of both.
Play your role naturally in ${targetName}. Always return a strict JSON object with:
{
  "responseTarget": "your response in natural ${targetName}",
  "responseNative": "${nativeName} translation of your response",
  "correction": "optional friendly tip in ${nativeName} if the learner made a grammar error or mixed languages"
}`
            },
            ...messageHistory
          ],
          response_format: { type: 'json_object' },
          temperature: 0.5
        })
      });

      const json = await response.json();
      const parsed = JSON.parse(json.choices[0].message.content);
      const result = {
        responseFr: parsed.responseTarget ?? parsed.responseFr ?? '',
        responseEn: parsed.responseNative ?? parsed.responseEn ?? '',
        correction: parsed.correction,
      };

      // ── Write-through to shared roleplay cache ──────────────
      sharedContentCache.set(roleplayCacheKey, native, target, 'ai_roleplay_line', JSON.stringify(result), 30);
      return result;
    } catch (e) {
      return this.heuristicRoleplay(scenario, lastMsg);
    }
  }

  // Robust offline heuristic so "Ask AI" and "Practise" work offline without an API key
  private fallbackHeuristic(prompt: string): AIResponse {
    const p = prompt.toLowerCase();

    if (p.includes('manager') || p.includes('boss')) {
      return {
        frenchText: 'Je voudrais parler avec le responsable, s’il vous plaît.',
        englishTranslation: 'I would like to speak with the manager, please.',
        formality: 'formal',
        explanation: 'In a workplace setting, "le responsable" or "le directeur" is the natural professional term.',
        retrievalLevel: 3,
        estimatedCostUsd: 0,
      };
    }

    if (p.includes('good job') || p.includes('work')) {
      return {
        frenchText: 'Vous avez fait du très bon travail.',
        englishTranslation: 'You did very good work.',
        formality: 'formal',
        explanation: 'A classic professional way to appreciate colleagues.',
        retrievalLevel: 3,
        estimatedCostUsd: 0,
      };
    }

    if (p.includes('bill') || p.includes('check')) {
      return {
        frenchText: 'L’addition, s’il vous plaît.',
        englishTranslation: 'The bill, please.',
        formality: 'neutral',
        explanation: 'Standard phrase used when finishing a meal at a café or restaurant.',
        retrievalLevel: 3,
        estimatedCostUsd: 0,
      };
    }

    // Default polite conversational fallback
    return {
      frenchText: 'Excusez-moi, pourriez-vous m’aider avec cela, s’il vous plaît ?',
      englishTranslation: 'Excuse me, could you please help me with that?',
      formality: 'formal',
      explanation: 'Universal polite question starter in French.',
      retrievalLevel: 3,
      estimatedCostUsd: 0,
    };
  }

  private heuristicRoleplay(scenario: string, userText: string): { responseFr: string; responseEn: string; correction?: string } {
    const text = userText.toLowerCase();

    if (scenario.toLowerCase().includes('office')) {
      if (text.includes('manager') || text.includes('responsable')) {
        return {
          responseFr: 'Bien sûr, il est actuellement en réunion, mais il sera disponible dans dix minutes.',
          responseEn: 'Of course, he is currently in a meeting, but he will be available in ten minutes.',
          correction: text.includes('manager') ? 'Tip: You can use "le responsable" in French.' : undefined,
        };
      }
      return {
        responseFr: 'Bonjour ! Comment avance la préparation du dossier de présentation ?',
        responseEn: 'Hello! How is the preparation for the presentation file going?',
      };
    }

    if (scenario.toLowerCase().includes('market')) {
      return {
        responseFr: 'Elles sont très fraîches ce matin ! C’est trois euros le kilo.',
        responseEn: 'They are very fresh this morning! That is three euros per kilo.',
      };
    }

    if (scenario.toLowerCase().includes('restaurant')) {
      return {
        responseFr: 'Très bien ! Désirez-vous également une boisson avec votre plat ?',
        responseEn: 'Very well! Would you also like a beverage with your dish?',
      };
    }

    return {
      responseFr: 'Bonjour, enchanté ! En quoi puis-je vous aider aujourd’hui ?',
      responseEn: 'Hello, delighted to meet you! How can I assist you today?',
    };
  }
}

export const aiProvider = new DeepSeekProvider();
