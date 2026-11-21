import type { IAIProvider, AIResponse } from '../types/ai';

export class DeepSeekProvider implements IAIProvider {
  public async askTutor(userPrompt: string, apiKey?: string): Promise<AIResponse> {
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
              content: `You are an expert French Language Tutor. The user may ask questions in English, French, or mixed English/French (e.g. "Bonjour, je voudrais parler avec... I don't know how to say manager").
Always return a strict JSON object with:
{
  "frenchText": "natural authentic French sentence",
  "englishTranslation": "natural English translation",
  "formality": "formal" | "informal" | "neutral",
  "explanation": "brief conversational explanation or note"
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

      return {
        frenchText: content.frenchText,
        englishTranslation: content.englishTranslation,
        formality: content.formality || 'neutral',
        explanation: content.explanation,
        retrievalLevel: 3,
        estimatedCostUsd: 0.0008, // Approx DeepSeek input/output token cost
      };
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
    if (!apiKey) {
      return this.heuristicRoleplay(scenario, messageHistory[messageHistory.length - 1]?.content || '');
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
              content: `You are participating in a realistic French spoken roleplay scenario: "${scenario}".
The user may speak in French or mixed French/English.
Play your role naturally. Always return a strict JSON object with:
{
  "responseFr": "your response in natural French",
  "responseEn": "English translation of your response",
  "correction": "optional friendly tip if the user made a grammar error or mixed language"
}`
            },
            ...messageHistory
          ],
          response_format: { type: 'json_object' },
          temperature: 0.5
        })
      });

      const json = await response.json();
      return JSON.parse(json.choices[0].message.content);
    } catch (e) {
      return this.heuristicRoleplay(scenario, messageHistory[messageHistory.length - 1]?.content || '');
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
