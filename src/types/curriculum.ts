export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'expression' | 'pronoun';
  gender?: 'm' | 'f' | 'neutral';
  phonetic: string;
  exampleSentenceFr: string;
  exampleSentenceEn: string;
  frequencyRank: number;
  cefrLevel: CEFRLevel;
  category: string;
  masteryScore?: number; // 0 - 100
}

export interface VerbConjugationItem {
  id: string;
  infinitive: string;
  translation: string;
  tense: 'present' | 'passé_composé' | 'futur_proche' | 'imparfait';
  pronoun: 'je' | 'tu' | 'il/elle' | 'nous' | 'vous' | 'ils/elles';
  conjugatedForm: string;
  exampleSentenceFr: string;
  exampleSentenceEn: string;
  regular: boolean;
}

export interface SituationalExpression {
  id: string;
  situation: 'office' | 'market' | 'restaurant' | 'transport' | 'social' | 'telephone';
  frenchText: string;
  englishText: string;
  formality: 'formal' | 'informal' | 'neutral';
  notes?: string;
  reusableSlot?: string; // e.g. "greeting", "appreciation", "request"
}

export interface LessonUnit {
  id: string;
  title: string;
  description: string;
  cefrLevel: CEFRLevel;
  category: 'vocabulary' | 'conjugation' | 'situational' | 'mixed';
  vocabularyIds: string[];
  conjugationIds?: string[];
  expressionIds: string[];
  orderIndex: number;
}

export interface UserLessonProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  lastAttemptAt: string;
  repetitionStage: number; // For Leitner spaced repetition (0-5)
  nextReviewAt: string;
}

export interface AudioCacheItem {
  hashKey: string; // hash of text + voice + speed
  text: string;
  language: string;
  voice: string;
  speed: number;
  audioBlobUri?: string; // Base64 or local file path
  createdAt: string;
}
