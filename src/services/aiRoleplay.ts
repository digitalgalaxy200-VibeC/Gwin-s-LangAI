// ============================================================
// AI ROLEPLAY SERVICE — Phase 3
// Replaces scripted role-play lines with live DeepSeek responses.
// Falls back to scripted lines when no API key is set.
// ============================================================

export interface AIRoleplayMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRoleplayResponse {
  french: string;
  english: string;
  correction?: string; // If the user made an error
  source: 'ai' | 'scripted';
}

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';

function getApiKey(): string | null {
  return localStorage.getItem('deepseek_api_key');
}

function buildSystemPrompt(
  scenario: string,
  cefrLevel: string,
  weakWords: string[],
): string {
  return `You are a French language tutor playing the role of a native French speaker in this scenario: "${scenario}".

Rules:
- Speak ONLY in French. Keep sentences at CEFR ${cefrLevel} level.
- After the learner speaks, respond naturally as the character in the scenario.
- Keep responses SHORT (1-2 sentences max) so the learner can keep up.
- If the learner made a grammar error, add a gentle correction at the end in this format: "[Correction: ...]"
- Do NOT translate. Do NOT explain grammar mid-conversation.
- These words are weak for this learner — try to naturally include them: ${weakWords.join(', ')}.
- Respond ONLY with JSON: { "french": "...", "english": "...", "correction": "..." or null }`;
}

export const aiRoleplayService = {
  isAvailable(): boolean {
    return !!getApiKey();
  },

  async getResponse(
    scenario: string,
    cefrLevel: string,
    weakWords: string[],
    conversationHistory: AIRoleplayMessage[],
    userMessage: string,
  ): Promise<AIRoleplayResponse> {
    const key = getApiKey();
    if (!key) {
      return { french: '', english: '', source: 'scripted' };
    }

    const messages: AIRoleplayMessage[] = [
      { role: 'system', content: buildSystemPrompt(scenario, cefrLevel, weakWords) },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    try {
      const res = await fetch(DEEPSEEK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 150,
          response_format: { type: 'json_object' },
        }),
      });

      if (!res.ok) return { french: '', english: '', source: 'scripted' };

      const data = await res.json() as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(content) as { french?: string; english?: string; correction?: string };

      return {
        french: parsed.french ?? '',
        english: parsed.english ?? '',
        correction: parsed.correction ?? undefined,
        source: 'ai',
      };
    } catch {
      return { french: '', english: '', source: 'scripted' };
    }
  },
};
