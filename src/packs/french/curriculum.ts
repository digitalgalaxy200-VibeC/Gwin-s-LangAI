import type { VocabularyItem, VerbConjugationItem, SituationalExpression, LessonUnit } from '../../types/curriculum';

export interface HighFrequencyGroup {
  batchId: number; // 1 = words 1-5, 2 = words 6-10, etc.
  rangeLabel: string; // "Words 1 - 5"
  words: VocabularyItem[];
  combinedSpeakingSentences: {
    french: string;
    english: string;
    usedWords: string[];
    speakingPrompt: string;
  }[];
}

// Officially aligned with the French National Lexique & Baudot frequency lists (Top spoken frequency)
export const FRENCH_HIGH_FREQUENCY_LIST: VocabularyItem[] = [
  // --- BATCH 1 (Rank 1 - 5: Absolute core interaction) ---
  {
    id: 'hf_1',
    word: 'être',
    translation: 'to be',
    partOfSpeech: 'verb',
    phonetic: 'ɛtʁ',
    exampleSentenceFr: 'Je suis prêt pour la journée.',
    exampleSentenceEn: 'I am ready for the day.',
    frequencyRank: 1,
    cefrLevel: 'A1',
    category: 'core_verbs',
  },
  {
    id: 'hf_2',
    word: 'avoir',
    translation: 'to have',
    partOfSpeech: 'verb',
    phonetic: 'a.vwaʁ',
    exampleSentenceFr: 'J’ai une question importante.',
    exampleSentenceEn: 'I have an important question.',
    frequencyRank: 2,
    cefrLevel: 'A1',
    category: 'core_verbs',
  },
  {
    id: 'hf_3',
    word: 'faire',
    translation: 'to do / to make',
    partOfSpeech: 'verb',
    phonetic: 'fɛʁ',
    exampleSentenceFr: 'Qu’est-ce que vous faites aujourd’hui ?',
    exampleSentenceEn: 'What are you doing today?',
    frequencyRank: 3,
    cefrLevel: 'A1',
    category: 'core_verbs',
  },
  {
    id: 'hf_4',
    word: 'bonjour',
    translation: 'hello / good morning',
    partOfSpeech: 'expression',
    phonetic: 'bɔ̃.ʒuʁ',
    exampleSentenceFr: 'Bonjour tout le monde !',
    exampleSentenceEn: 'Hello everyone!',
    frequencyRank: 4,
    cefrLevel: 'A1',
    category: 'greetings',
  },
  {
    id: 'hf_5',
    word: 'merci',
    translation: 'thank you',
    partOfSpeech: 'expression',
    phonetic: 'mɛʁ.si',
    exampleSentenceFr: 'Merci pour votre aide.',
    exampleSentenceEn: 'Thank you for your help.',
    frequencyRank: 5,
    cefrLevel: 'A1',
    category: 'politeness',
  },

  // --- BATCH 2 (Rank 6 - 10: Desire, motion & request) ---
  {
    id: 'hf_6',
    word: 'vouloir',
    translation: 'to want',
    partOfSpeech: 'verb',
    phonetic: 'vu.lwaʁ',
    exampleSentenceFr: 'Je voudrais commander maintenant.',
    exampleSentenceEn: 'I would like to order now.',
    frequencyRank: 6,
    cefrLevel: 'A1',
    category: 'core_verbs',
  },
  {
    id: 'hf_7',
    word: 'aller',
    translation: 'to go',
    partOfSpeech: 'verb',
    phonetic: 'a.le',
    exampleSentenceFr: 'Comment allez-vous ce matin ?',
    exampleSentenceEn: 'How are you going this morning?',
    frequencyRank: 7,
    cefrLevel: 'A1',
    category: 'core_verbs',
  },
  {
    id: 'hf_8',
    word: 'pouvoir',
    translation: 'to be able to / can',
    partOfSpeech: 'verb',
    phonetic: 'pu.vwaʁ',
    exampleSentenceFr: 'Est-ce que vous pouvez m’aider ?',
    exampleSentenceEn: 'Can you help me?',
    frequencyRank: 8,
    cefrLevel: 'A1',
    category: 'core_verbs',
  },
  {
    id: 'hf_9',
    word: 's’il vous plaît',
    translation: 'please (formal)',
    partOfSpeech: 'expression',
    phonetic: 'sil vu plɛ',
    exampleSentenceFr: 'Un café, s’il vous plaît.',
    exampleSentenceEn: 'A coffee, please.',
    frequencyRank: 9,
    cefrLevel: 'A1',
    category: 'politeness',
  },
  {
    id: 'hf_10',
    word: 'bien',
    translation: 'well / good',
    partOfSpeech: 'adverb',
    phonetic: 'bjɛ̃',
    exampleSentenceFr: 'Tout va très bien, merci.',
    exampleSentenceEn: 'Everything is going very well, thank you.',
    frequencyRank: 10,
    cefrLevel: 'A1',
    category: 'adverbs',
  },

  // --- BATCH 3 (Rank 11 - 15: Everyday work, time & people) ---
  {
    id: 'hf_11',
    word: 'travail',
    translation: 'work / job',
    partOfSpeech: 'noun',
    gender: 'm',
    phonetic: 'tʁa.vaj',
    exampleSentenceFr: 'Vous avez fait du très bon travail.',
    exampleSentenceEn: 'You did very good work.',
    frequencyRank: 11,
    cefrLevel: 'A1',
    category: 'office',
  },
  {
    id: 'hf_12',
    word: 'matin',
    translation: 'morning',
    partOfSpeech: 'noun',
    gender: 'm',
    phonetic: 'ma.tɛ̃',
    exampleSentenceFr: 'On commence la réunion ce matin.',
    exampleSentenceEn: 'We start the meeting this morning.',
    frequencyRank: 12,
    cefrLevel: 'A1',
    category: 'time',
  },
  {
    id: 'hf_13',
    word: 'après-midi',
    translation: 'afternoon',
    partOfSpeech: 'noun',
    gender: 'm',
    phonetic: 'a.pʁɛ.mi.di',
    exampleSentenceFr: 'On se voit cet après-midi.',
    exampleSentenceEn: 'We see each other this afternoon.',
    frequencyRank: 13,
    cefrLevel: 'A1',
    category: 'time',
  },
  {
    id: 'hf_14',
    word: 'dire',
    translation: 'to say / tell',
    partOfSpeech: 'verb',
    phonetic: 'diʁ',
    exampleSentenceFr: 'Comment dit-on cela en français ?',
    exampleSentenceEn: 'How do you say that in French?',
    frequencyRank: 14,
    cefrLevel: 'A1',
    category: 'core_verbs',
  },
  {
    id: 'hf_15',
    word: 'responsable',
    translation: 'manager / person in charge',
    partOfSpeech: 'noun',
    gender: 'neutral',
    phonetic: 'ʁɛs.pɔ̃.sabl',
    exampleSentenceFr: 'Je voudrais parler avec le responsable.',
    exampleSentenceEn: 'I would like to speak with the manager.',
    frequencyRank: 15,
    cefrLevel: 'A2',
    category: 'office',
  },

  // --- BATCH 4 (Rank 16 - 20: Quantities, prices & commerce) ---
  {
    id: 'hf_16',
    word: 'combien',
    translation: 'how much / how many',
    partOfSpeech: 'adverb',
    phonetic: 'kɔ̃.bjɛ̃',
    exampleSentenceFr: 'C’est combien au total ?',
    exampleSentenceEn: 'How much is it in total?',
    frequencyRank: 16,
    cefrLevel: 'A1',
    category: 'market',
  },
  {
    id: 'hf_17',
    word: 'prix',
    translation: 'price',
    partOfSpeech: 'noun',
    gender: 'm',
    phonetic: 'pʁi',
    exampleSentenceFr: 'Quel est le prix de ces articles ?',
    exampleSentenceEn: 'What is the price of these items?',
    frequencyRank: 17,
    cefrLevel: 'A1',
    category: 'market',
  },
  {
    id: 'hf_18',
    word: 'prendre',
    translation: 'to take',
    partOfSpeech: 'verb',
    phonetic: 'pʁɑ̃dʁ',
    exampleSentenceFr: 'Je vais prendre un café et un croissant.',
    exampleSentenceEn: 'I am going to take a coffee and a croissant.',
    frequencyRank: 18,
    cefrLevel: 'A1',
    category: 'core_verbs',
  },
  {
    id: 'hf_19',
    word: 'addition',
    translation: 'the bill / check',
    partOfSpeech: 'noun',
    gender: 'f',
    phonetic: 'a.di.sjɔ̃',
    exampleSentenceFr: 'L’addition, s’il vous plaît.',
    exampleSentenceEn: 'The bill, please.',
    frequencyRank: 19,
    cefrLevel: 'A1',
    category: 'restaurant',
  },
  {
    id: 'hf_20',
    word: 'eau',
    translation: 'water',
    partOfSpeech: 'noun',
    gender: 'f',
    phonetic: 'o',
    exampleSentenceFr: 'Une carafe d’eau fraîche, s’il vous plaît.',
    exampleSentenceEn: 'A jug of fresh water, please.',
    frequencyRank: 20,
    cefrLevel: 'A1',
    category: 'restaurant',
  }
];

// Grouped into 5-word batches with real spoken combinations
export const HIGH_FREQUENCY_5_BATCHES: HighFrequencyGroup[] = [
  {
    batchId: 1,
    rangeLabel: 'Words 1 – 5: Core Interaction',
    words: FRENCH_HIGH_FREQUENCY_LIST.slice(0, 5),
    combinedSpeakingSentences: [
      {
        french: 'Bonjour, je suis très content d’être ici, merci.',
        english: 'Hello, I am very happy to be here, thank you.',
        usedWords: ['bonjour', 'être', 'merci'],
        speakingPrompt: 'Introduce yourself politely upon arriving.',
      },
      {
        french: 'Vous avez fait du bon travail aujourd’hui, merci beaucoup.',
        english: 'You have done good work today, thank you very much.',
        usedWords: ['avoir', 'faire', 'merci'],
        speakingPrompt: 'Thank a colleague for their daily effort.',
      },
      {
        french: 'Bonjour ! J’ai une question à vous poser.',
        english: 'Hello! I have a question to ask you.',
        usedWords: ['bonjour', 'avoir'],
        speakingPrompt: 'Politely interrupt to ask a question.',
      }
    ]
  },
  {
    batchId: 2,
    rangeLabel: 'Words 6 – 10: Requests & Polite Direction',
    words: FRENCH_HIGH_FREQUENCY_LIST.slice(5, 10),
    combinedSpeakingSentences: [
      {
        french: 'Je voudrais aller là-bas, pouvez-vous m’aider s’il vous plaît ?',
        english: 'I would like to go over there, can you help me please?',
        usedWords: ['vouloir', 'aller', 'pouvoir', 's’il vous plaît'],
        speakingPrompt: 'Ask a stranger on the street for directions.',
      },
      {
        french: 'Tout va très bien ce matin, merci beaucoup.',
        english: 'Everything is going very well this morning, thank you very much.',
        usedWords: ['aller', 'bien'],
        speakingPrompt: 'Respond enthusiastically when asked how you are.',
      },
      {
        french: 'Est-ce que je peux avoir un renseignement, s’il vous plaît ?',
        english: 'May I have some information, please?',
        usedWords: ['pouvoir', 's’il vous plaît'],
        speakingPrompt: 'Approach an information desk or reception counter.',
      }
    ]
  },
  {
    batchId: 3,
    rangeLabel: 'Words 11 – 15: Workplace & Time Situations',
    words: FRENCH_HIGH_FREQUENCY_LIST.slice(10, 15),
    combinedSpeakingSentences: [
      {
        french: 'Je voudrais parler avec le responsable ce matin au sujet du travail.',
        english: 'I would like to speak with the manager this morning regarding the work.',
        usedWords: ['responsable', 'matin', 'travail'],
        speakingPrompt: 'Request a meeting with your boss.',
      },
      {
        french: 'On peut se voir cet après-midi pour terminer ce travail ?',
        english: 'Can we see each other this afternoon to finish this work?',
        usedWords: ['après-midi', 'travail'],
        speakingPrompt: 'Coordinate with a teammate after lunch.',
      },
      {
        french: 'Comment dit-on "manager" en français ? On dit "le responsable".',
        english: 'How do you say "manager" in French? We say "le responsable".',
        usedWords: ['dire', 'responsable'],
        speakingPrompt: 'Clarify professional vocabulary in conversation.',
      }
    ]
  },
  {
    batchId: 4,
    rangeLabel: 'Words 16 – 20: Market & Café Fluency',
    words: FRENCH_HIGH_FREQUENCY_LIST.slice(15, 20),
    combinedSpeakingSentences: [
      {
        french: 'C’est combien au total pour le café et la bouteille d’eau ?',
        english: 'How much is it in total for the coffee and the bottle of water?',
        usedWords: ['combien', 'eau'],
        speakingPrompt: 'Ask for the total at the counter.',
      },
      {
        french: 'Je vais prendre un café, et l’addition s’il vous plaît.',
        english: 'I am going to take a coffee, and the bill please.',
        usedWords: ['prendre', 'addition'],
        speakingPrompt: 'Order and conclude your visit at a restaurant.',
      },
      {
        french: 'Quel est le meilleur prix si je prends les deux ?',
        english: 'What is the best price if I take both?',
        usedWords: ['prix', 'prendre'],
        speakingPrompt: 'Negotiate smoothly at an open-air market.',
      }
    ]
  }
];

// Preserving legacy exports for curriculum backwards-compatibility
export const FRENCH_HIGH_FREQUENCY_VOCABULARY = FRENCH_HIGH_FREQUENCY_LIST;
export const FRENCH_VERB_CONJUGATIONS: VerbConjugationItem[] = [
  {
    id: 'conj_faire_pc_vous',
    infinitive: 'faire',
    translation: 'to do / to make',
    tense: 'passé_composé',
    pronoun: 'vous',
    conjugatedForm: 'avez fait',
    exampleSentenceFr: 'Vous avez fait du très bon travail.',
    exampleSentenceEn: 'You did very good work.',
    regular: false,
  },
  {
    id: 'conj_etre_pres_je',
    infinitive: 'être',
    translation: 'to be',
    tense: 'present',
    pronoun: 'je',
    conjugatedForm: 'suis',
    exampleSentenceFr: 'Je suis ravi de vous rencontrer.',
    exampleSentenceEn: 'I am delighted to meet you.',
    regular: false,
  },
  {
    id: 'conj_avoir_pres_j',
    infinitive: 'avoir',
    translation: 'to have',
    tense: 'present',
    pronoun: 'je',
    conjugatedForm: 'ai',
    exampleSentenceFr: 'J’ai une question concernant le contrat.',
    exampleSentenceEn: 'I have a question regarding the contract.',
    regular: false,
  },
  {
    id: 'conj_vouloir_pres_je',
    infinitive: 'vouloir',
    translation: 'to want',
    tense: 'present',
    pronoun: 'je',
    conjugatedForm: 'voudrais (cond.)',
    exampleSentenceFr: 'Je voudrais réserver une table pour deux.',
    exampleSentenceEn: 'I would like to reserve a table for two.',
    regular: false,
  },
  {
    id: 'conj_aller_pres_je',
    infinitive: 'aller',
    translation: 'to go',
    tense: 'futur_proche',
    pronoun: 'je',
    conjugatedForm: 'vais travailler',
    exampleSentenceFr: 'Je vais travailler sur ce dossier demain.',
    exampleSentenceEn: 'I am going to work on this folder tomorrow.',
    regular: false,
  }
];

export const FRENCH_SITUATIONAL_EXPRESSIONS: SituationalExpression[] = [
  {
    id: 'expr_office_appreciation_1',
    situation: 'office',
    frenchText: 'Vous avez fait du très bon travail cet après-midi.',
    englishText: 'You did very good work this afternoon.',
    formality: 'formal',
    notes: 'Used to appreciate a colleague or subordinate professionally.',
    reusableSlot: 'time_slot',
  },
  {
    id: 'expr_market_price_ask',
    situation: 'market',
    frenchText: 'C’est combien le kilo de mangues ?',
    englishText: 'How much is a kilo of mangoes?',
    formality: 'neutral',
  },
  {
    id: 'expr_restaurant_order',
    situation: 'restaurant',
    frenchText: 'Pour moi, ce sera le plat du jour avec un verre d’eau, s’il vous plaît.',
    englishText: 'For me, that will be the dish of the day with a glass of water, please.',
    formality: 'neutral',
  }
];

export const FRENCH_LESSON_UNITS: LessonUnit[] = [
  {
    id: 'lesson_1_appreciation',
    title: 'Appreciating Someone’s Work',
    description: 'Learn how to recognize colleagues and speak politely in professional settings.',
    cefrLevel: 'A1',
    category: 'situational',
    orderIndex: 1,
    vocabularyIds: ['hf_11', 'hf_12', 'hf_13', 'hf_5'],
    conjugationIds: ['conj_faire_pc_vous'],
    expressionIds: ['expr_office_appreciation_1'],
  },
  {
    id: 'lesson_2_market',
    title: 'Negotiating at the Market',
    description: 'Ask prices, understand weight units, and negotiate politely with vendors.',
    cefrLevel: 'A1',
    category: 'situational',
    orderIndex: 2,
    vocabularyIds: ['hf_16', 'hf_17'],
    expressionIds: ['expr_market_price_ask'],
  }
];
