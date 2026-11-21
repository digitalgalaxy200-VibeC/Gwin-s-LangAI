import type { VocabularyItem, SituationalExpression } from '../../types/curriculum';

export const ARABIC_LANGUAGE_CONFIG = {
  languageId: 'ar',
  displayName: 'Arabic (العربية)',
  direction: 'rtl' as const,
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif',
};

export const ARABIC_VOCABULARY: VocabularyItem[] = [
  {
    id: 'vocab_marhaban',
    word: 'مَرْحَبًا',
    translation: 'hello / welcome',
    partOfSpeech: 'expression',
    phonetic: 'mar-ha-ban',
    exampleSentenceFr: 'مَرْحَبًا، كَيْفَ حَالُكَ اليَوْم؟',
    exampleSentenceEn: 'Hello, how are you today?',
    frequencyRank: 1,
    cefrLevel: 'A1',
    category: 'greetings',
  },
  {
    id: 'vocab_shukran',
    word: 'شُكْرًا',
    translation: 'thank you',
    partOfSpeech: 'expression',
    phonetic: 'shuk-ran',
    exampleSentenceFr: 'شُكْرًا جَزِيلًا لِمُسَاعَدَتِك.',
    exampleSentenceEn: 'Thank you very much for your help.',
    frequencyRank: 2,
    cefrLevel: 'A1',
    category: 'politeness',
  },
  {
    id: 'vocab_amal',
    word: 'عَمَل',
    translation: 'work / job',
    partOfSpeech: 'noun',
    gender: 'm',
    phonetic: 'a-mal',
    exampleSentenceFr: 'قُمْتَ بِعَمَلٍ مُمْتَاز.',
    exampleSentenceEn: 'You did an excellent job.',
    frequencyRank: 10,
    cefrLevel: 'A1',
    category: 'office',
  }
];

export const ARABIC_EXPRESSIONS: SituationalExpression[] = [
  {
    id: 'expr_ar_appreciation',
    situation: 'office',
    frenchText: 'قُمْتَ بِعَمَلٍ رَائِعٍ جِدًّا هَذَا الصَّبَاح.',
    englishText: 'You did very good work this morning.',
    formality: 'formal',
  },
  {
    id: 'expr_ar_market',
    situation: 'market',
    frenchText: 'بِكَمْ هَذَا مِنْ فَضْلِك؟',
    englishText: 'How much is this, please?',
    formality: 'neutral',
  }
];
