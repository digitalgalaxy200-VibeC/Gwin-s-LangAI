// ============================================================
// OFFLINE STRUCTURED LANGUAGE PROGRAM — Track A + Track B
// All content is pre-scripted and works 100% offline.
// AI slots are marked with aiSlot:true and will be replaced
// by DeepSeek in a future update. For now they use scripts.
// ============================================================

export type BlockType = 'warmup' | 'input' | 'drill' | 'roleplay' | 'correction' | 'recap';

export interface LessonWord {
  french: string;
  phonetic: string;
  english: string;
  partOfSpeech: string;
  gender?: 'm' | 'f' | 'n';
  chunk?: string; // the full ready-made phrase if word is part of one
}

export interface InputChunk {
  french: string;
  phonetic: string;
  english: string;
  note?: string; // e.g. "Use this to introduce yourself"
}

export interface DrillExercise {
  type: 'repeat' | 'substitute' | 'choose';
  instruction: string;
  prompt: string;           // what user sees / hears
  answer: string;           // correct answer (shown in correction)
  options?: string[];       // for 'choose' type
  substitutePairs?: { cue: string; answer: string }[]; // for 'substitute'
}

export interface RoleplayExchange {
  speaker: 'app' | 'you';
  french: string;
  english: string;
  hint?: string;            // hint shown to user before they speak
  aiSlot?: boolean;         // future: replace with DeepSeek dynamic line
}

export interface WarmupItem {
  french: string;
  english: string;
}

// ── BLOCK CONTENT TYPES ──────────────────────────────────────

export interface WarmupBlock {
  type: 'warmup';
  durationMinutes: number;
  instruction: string;
  reviewItems: WarmupItem[];
}

export interface InputBlock {
  type: 'input';
  durationMinutes: number;
  instruction: string;
  words: LessonWord[];
  chunks: InputChunk[];
}

export interface DrillBlock {
  type: 'drill';
  durationMinutes: number;
  instruction: string;
  exercises: DrillExercise[];
}

export interface RoleplayBlock {
  type: 'roleplay';
  durationMinutes: number;
  scenario: string;
  instruction: string;
  exchanges: RoleplayExchange[];
  aiSlot: boolean; // when true: AI replaces scripted app lines in future
}

export interface CorrectionBlock {
  type: 'correction';
  durationMinutes: number;
  instruction: string;
  keyPoints: { wrong: string; right: string; explanation: string }[];
}

export interface RecapBlock {
  type: 'recap';
  durationMinutes: number;
  instruction: string;
  canSayNow: string[];      // "You can now say..." summary sentences
  wellDoneNote: string;
}

export type LessonBlock =
  | WarmupBlock
  | InputBlock
  | DrillBlock
  | RoleplayBlock
  | CorrectionBlock
  | RecapBlock;

// ── UNIT & STAGE TYPES ───────────────────────────────────────

export type ProgressionStage = 'survival' | 'functional' | 'operational' | 'fluent';

export interface StructuredUnit {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  stage: ProgressionStage;
  track: 'A' | 'B';       // A = foundations, B = scenario-applied
  estimatedMinutes: number;
  blocks: LessonBlock[];
}

// ============================================================
// STAGE 1 — SURVIVAL (Weeks 1–4)
// Track A: Core Language Foundations
// Track B: Applied Scenarios using Track A material
// ============================================================

// ── UNIT 1: Greetings & Introductions ────────────────────────
const unit1: StructuredUnit = {
  id: 'unit_1',
  unitNumber: 1,
  title: 'Greetings & Introductions',
  subtitle: 'Your first spoken words in French',
  icon: '👋',
  stage: 'survival',
  track: 'A',
  estimatedMinutes: 45,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Listen to each French word and try to say it before the English appears. Tap the speaker to hear it again.',
      reviewItems: [
        { french: 'bonjour', english: 'hello / good morning' },
        { french: 'merci', english: 'thank you' },
        { french: 'oui', english: 'yes' },
        { french: 'non', english: 'no' },
        { french: 's\'il vous plaît', english: 'please' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Listen carefully. These are the words and ready-made blocks for today. Tap each one to hear it twice.',
      words: [
        { french: 'bonsoir', phonetic: 'bɔ̃.swaʁ', english: 'good evening', partOfSpeech: 'expression' },
        { french: 'au revoir', phonetic: 'o ʁə.vwaʁ', english: 'goodbye', partOfSpeech: 'expression' },
        { french: 'enchanté(e)', phonetic: 'ɑ̃.ʃɑ̃.te', english: 'nice to meet you', partOfSpeech: 'expression' },
        { french: 'je m\'appelle', phonetic: 'ʒə ma.pɛl', english: 'my name is', partOfSpeech: 'phrase' },
        { french: 'comment vous appelez-vous ?', phonetic: 'kɔ.mɑ̃ vu za.pɛ.le vu', english: 'what is your name? (formal)', partOfSpeech: 'question' },
        { french: 'comment tu t\'appelles ?', phonetic: 'kɔ.mɑ̃ ty ta.pɛl', english: 'what is your name? (informal)', partOfSpeech: 'question' },
        { french: 'ça va ?', phonetic: 'sa va', english: 'how are you? / how\'s it going?', partOfSpeech: 'question' },
        { french: 'ça va bien', phonetic: 'sa va bjɛ̃', english: 'I\'m fine / it\'s going well', partOfSpeech: 'expression' },
        { french: 'et vous ?', phonetic: 'e vu', english: 'and you? (formal)', partOfSpeech: 'expression' },
        { french: 'd\'où venez-vous ?', phonetic: 'du və.ne vu', english: 'where are you from? (formal)', partOfSpeech: 'question' },
        { french: 'je viens du Bénin', phonetic: 'ʒə vjɛ̃ dy be.nɛ̃', english: 'I am from Benin', partOfSpeech: 'phrase' },
      ],
      chunks: [
        { french: 'Bonjour, je m\'appelle [nom].', phonetic: 'bɔ̃.ʒuʁ ʒə ma.pɛl', english: 'Hello, my name is [name].', note: 'Replace [nom] with your name. This is your opening sentence.' },
        { french: 'Enchanté(e) de faire votre connaissance.', phonetic: 'ɑ̃.ʃɑ̃.te də fɛʁ vɔtʁ kɔ.nɛ.sɑ̃s', english: 'Pleased to meet you.', note: 'Use this after someone tells you their name.' },
        { french: 'Je viens du Bénin. Et vous ?', phonetic: 'ʒə vjɛ̃ dy be.nɛ̃ e vu', english: 'I am from Benin. And you?', note: 'Always bounce the question back — it keeps the conversation going.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Speak the answer out loud before tapping to reveal it. Speed is the goal — aim for under 2 seconds.',
      exercises: [
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Bonjour, je m\'appelle Marie.', answer: 'Bonjour, je m\'appelle Marie.' },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Enchanté de faire votre connaissance.', answer: 'Enchanté de faire votre connaissance.' },
        { type: 'substitute', instruction: 'Replace the name with your own', prompt: 'Je m\'appelle Marie. Et vous ?', answer: 'Je m\'appelle [your name]. Et vous ?',
          substitutePairs: [
            { cue: 'Marie → your name', answer: 'Je m\'appelle [your name]. Et vous ?' },
            { cue: 'Paul → your name', answer: 'Je m\'appelle [your name]. Et vous ?' },
          ]
        },
        { type: 'choose', instruction: 'Which is "good evening"?', prompt: 'Good evening in French is:', answer: 'bonsoir', options: ['bonjour', 'bonsoir', 'au revoir', 'ça va'] },
        { type: 'choose', instruction: 'Which means "how are you?"', prompt: 'Ça va ? means:', answer: 'how are you / how\'s it going', options: ['where are you from', 'how are you / how\'s it going', 'what is your name', 'goodbye'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Ça va bien, merci. Et vous ?', answer: 'Ça va bien, merci. Et vous ?' },
        { type: 'choose', instruction: 'Pick the correct response to "Ça va ?"', prompt: 'Someone says "Ça va ?" — you say:', answer: 'Ça va bien, merci.', options: ['Au revoir !', 'Ça va bien, merci.', 'Je m\'appelle Paul.', 'Bonjour tout le monde.'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Je viens du Bénin.', answer: 'Je viens du Bénin.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'First day at the office. You meet a French-speaking colleague for the first time.',
      instruction: 'Read the APP line out loud, then speak YOUR line before tapping to reveal it. Imagine you\'re really there.',
      aiSlot: false, // AI will take over these app lines in future
      exchanges: [
        { speaker: 'app', french: 'Bonjour ! Vous êtes nouveau ici ?', english: 'Hello! Are you new here?', aiSlot: true },
        { speaker: 'you', french: 'Oui, bonjour ! Je m\'appelle [your name].', english: 'Yes, hello! My name is [your name].', hint: 'Greet them and say your name.' },
        { speaker: 'app', french: 'Enchanté ! Moi, c\'est Sophie.', english: 'Nice to meet you! I\'m Sophie.', aiSlot: true },
        { speaker: 'you', french: 'Enchantée, Sophie ! D\'où venez-vous ?', english: 'Nice to meet you, Sophie! Where are you from?', hint: 'Reply "nice to meet you" and ask where they\'re from.' },
        { speaker: 'app', french: 'Je viens de Lyon. Et vous ?', english: 'I am from Lyon. And you?', aiSlot: true },
        { speaker: 'you', french: 'Je viens du Bénin.', english: 'I am from Benin.', hint: 'Tell them where you\'re from.' },
        { speaker: 'app', french: 'Très bien ! Ça va, ce premier jour ?', english: 'Very good! How\'s your first day going?', aiSlot: true },
        { speaker: 'you', french: 'Ça va bien, merci !', english: 'It\'s going well, thank you!', hint: 'Say you\'re doing well.' },
        { speaker: 'app', french: 'Parfait. À bientôt !', english: 'Perfect. See you soon!', aiSlot: true },
        { speaker: 'you', french: 'Au revoir, Sophie !', english: 'Goodbye, Sophie!', hint: 'Say goodbye using their name.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Common mistakes in this unit. Read the correct version out loud twice.',
      keyPoints: [
        { wrong: 'Je suis appelle Marie.', right: 'Je m\'appelle Marie.', explanation: '"Je m\'appelle" literally means "I call myself" — do NOT use "suis" (am) here.' },
        { wrong: 'Enchanté de votre connaissance.', right: 'Enchanté de faire votre connaissance.', explanation: 'The full phrase always includes "faire" (to make/do).' },
        { wrong: 'Je viens Bénin.', right: 'Je viens du Bénin.', explanation: 'Country names need "du" (masculine) or "de la" (feminine) after "je viens".' },
        { wrong: 'Bonjour in the evening', right: 'Bonsoir (after ~6pm)', explanation: '"Bonjour" is for morning/afternoon. "Bonsoir" is for evening. Using the right one impresses people.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Here is what you can now say. Read each one out loud one final time.',
      canSayNow: [
        'Bonjour / Bonsoir — greet anyone at the right time of day',
        'Je m\'appelle [name] — introduce yourself',
        'Enchanté(e) de faire votre connaissance — make a great first impression',
        'Ça va ? / Ça va bien, merci — small talk opener and reply',
        'Je viens du Bénin — say where you\'re from',
        'Au revoir — say goodbye naturally',
      ],
      wellDoneNote: 'You just completed your first real French conversation. These exact phrases work in any professional setting in France, Benin, or any French-speaking country.',
    },
  ],
};

// ── UNIT 2: Numbers, Time & Dates ────────────────────────────
const unit2: StructuredUnit = {
  id: 'unit_2',
  unitNumber: 2,
  title: 'Numbers, Time & Dates',
  subtitle: 'Counting, telling time, scheduling',
  icon: '🔢',
  stage: 'survival',
  track: 'A',
  estimatedMinutes: 45,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Quick spoken review. Say each before tapping to reveal.',
      reviewItems: [
        { french: 'Bonjour, je m\'appelle [name].', english: 'Hello, my name is [name].' },
        { french: 'Ça va bien, merci.', english: 'I\'m fine, thank you.' },
        { french: 'Je viens du Bénin.', english: 'I am from Benin.' },
        { french: 'Au revoir !', english: 'Goodbye!' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Numbers and time are non-negotiable. Tap each to hear it, then repeat.',
      words: [
        { french: 'un / une', phonetic: 'œ̃ / yn', english: '1', partOfSpeech: 'number' },
        { french: 'deux', phonetic: 'dø', english: '2', partOfSpeech: 'number' },
        { french: 'trois', phonetic: 'tʁwa', english: '3', partOfSpeech: 'number' },
        { french: 'cinq', phonetic: 'sɛ̃k', english: '5', partOfSpeech: 'number' },
        { french: 'dix', phonetic: 'dis', english: '10', partOfSpeech: 'number' },
        { french: 'vingt', phonetic: 'vɛ̃', english: '20', partOfSpeech: 'number' },
        { french: 'cent', phonetic: 'sɑ̃', english: '100', partOfSpeech: 'number' },
        { french: 'mille', phonetic: 'mil', english: '1000', partOfSpeech: 'number' },
        { french: 'quelle heure est-il ?', phonetic: 'kɛl œʁ ɛ.til', english: 'what time is it?', partOfSpeech: 'question' },
        { french: 'il est deux heures', phonetic: 'il ɛ dø.zœʁ', english: 'it is two o\'clock', partOfSpeech: 'phrase' },
        { french: 'il est midi', phonetic: 'il ɛ mi.di', english: 'it is noon', partOfSpeech: 'phrase' },
        { french: 'matin / après-midi / soir', phonetic: 'ma.tɛ̃ / a.pʁɛ.mi.di / swaʁ', english: 'morning / afternoon / evening', partOfSpeech: 'noun' },
        { french: 'aujourd\'hui', phonetic: 'o.ʒuʁ.dɥi', english: 'today', partOfSpeech: 'adverb' },
        { french: 'demain', phonetic: 'də.mɛ̃', english: 'tomorrow', partOfSpeech: 'adverb' },
        { french: 'lundi / vendredi', phonetic: 'lœ̃.di / vɑ̃.dʁə.di', english: 'Monday / Friday', partOfSpeech: 'noun' },
      ],
      chunks: [
        { french: 'La réunion est à dix heures.', phonetic: 'la ʁe.y.njɔ̃ ɛ.t‿a di.zœʁ', english: 'The meeting is at ten o\'clock.', note: 'Use this to state scheduled times.' },
        { french: 'On se retrouve demain matin ?', phonetic: 'ɔ̃ sə ʁə.tʁuv də.mɛ̃ ma.tɛ̃', english: 'Shall we meet tomorrow morning?', note: 'Natural way to suggest a meeting time.' },
        { french: 'C\'est combien ?', phonetic: 'sɛ kɔ̃.bjɛ̃', english: 'How much is it?', note: 'Essential in any shop or market.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Speed round. No hesitating — say the answer before tapping.',
      exercises: [
        { type: 'choose', instruction: 'Pick the correct number', prompt: '"Twenty" in French is:', answer: 'vingt', options: ['deux', 'vingt', 'cent', 'dix'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Quelle heure est-il ? Il est deux heures.', answer: 'Quelle heure est-il ? Il est deux heures.' },
        { type: 'substitute', instruction: 'Change the time', prompt: 'La réunion est à deux heures.', answer: 'La réunion est à [time] heures.',
          substitutePairs: [
            { cue: 'two → ten', answer: 'La réunion est à dix heures.' },
            { cue: 'two → noon', answer: 'La réunion est à midi.' },
          ]
        },
        { type: 'choose', instruction: 'Which means "tomorrow"?', prompt: '"Tomorrow" in French is:', answer: 'demain', options: ['aujourd\'hui', 'matin', 'demain', 'vendredi'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'C\'est combien ? C\'est dix euros.', answer: 'C\'est combien ? C\'est dix euros.' },
        { type: 'substitute', instruction: 'Change the day', prompt: 'On se retrouve lundi matin ?', answer: 'On se retrouve [day] matin ?',
          substitutePairs: [
            { cue: 'lundi → vendredi', answer: 'On se retrouve vendredi matin ?' },
            { cue: 'lundi → demain', answer: 'On se retrouve demain matin ?' },
          ]
        },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'You are on the phone with a colleague scheduling a meeting.',
      instruction: 'You are speaking. Tap the APP line to hear it, then speak your line before revealing the answer.',
      aiSlot: false,
      exchanges: [
        { speaker: 'app', french: 'Allô ? Bonjour !', english: 'Hello? Good morning!', aiSlot: true },
        { speaker: 'you', french: 'Bonjour ! Je voudrais fixer une réunion.', english: 'Good morning! I\'d like to arrange a meeting.', hint: 'Greet them and say you want to arrange a meeting.' },
        { speaker: 'app', french: 'Bien sûr. Quel jour vous convient ?', english: 'Of course. Which day suits you?', aiSlot: true },
        { speaker: 'you', french: 'Lundi matin, c\'est possible ?', english: 'Monday morning, is that possible?', hint: 'Suggest Monday morning as a question.' },
        { speaker: 'app', french: 'Oui ! À quelle heure ?', english: 'Yes! At what time?', aiSlot: true },
        { speaker: 'you', french: 'À dix heures, s\'il vous plaît.', english: 'At ten o\'clock, please.', hint: 'Suggest 10am politely.' },
        { speaker: 'app', french: 'Parfait. À lundi à dix heures alors !', english: 'Perfect. Until Monday at ten then!', aiSlot: true },
        { speaker: 'you', french: 'Très bien. Au revoir !', english: 'Very good. Goodbye!', hint: 'Confirm and say goodbye.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Key mistakes with numbers and time. Say the correct version out loud twice.',
      keyPoints: [
        { wrong: 'Il est deux heure.', right: 'Il est deux heures.', explanation: '"Heure" is always plural when the hour is more than 1.' },
        { wrong: 'C\'est combie ?', right: 'C\'est combien ?', explanation: 'The final "n" in "combien" is nasal — it must be there or you won\'t be understood.' },
        { wrong: 'vingt-et-un → vingt-un', right: 'vingt et un (21)', explanation: 'Numbers ending in 1 (21, 31, 41...) use "et" before "un".' },
        { wrong: 'On se retrouve demain à matin', right: 'On se retrouve demain matin', explanation: 'No "à" before matin/après-midi/soir when combined with a day.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'What you can now say — read each aloud.',
      canSayNow: [
        'Count from 1 to 1000 in French',
        'Quelle heure est-il ? — Ask for the time',
        'La réunion est à [time] heures — State a meeting time',
        'On se retrouve [day] [time] ? — Suggest a meeting',
        'C\'est combien ? — Ask a price anywhere',
        'Aujourd\'hui / demain — today and tomorrow',
      ],
      wellDoneNote: 'You can now schedule meetings and handle basic numbers entirely in French. This is what matters in professional settings.',
    },
  ],
};

// ── UNIT 3: Core Verbs — être, avoir, aller, pouvoir, vouloir ─
const unit3: StructuredUnit = {
  id: 'unit_3',
  unitNumber: 3,
  title: 'Core Verbs',
  subtitle: 'The 5 verbs that power 80% of speech',
  icon: '⚡',
  stage: 'survival',
  track: 'A',
  estimatedMinutes: 45,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Spoken review — say each before tapping.',
      reviewItems: [
        { french: 'La réunion est à dix heures.', english: 'The meeting is at ten o\'clock.' },
        { french: 'On se retrouve demain matin ?', english: 'Shall we meet tomorrow morning?' },
        { french: 'C\'est combien ?', english: 'How much is it?' },
        { french: 'Bonjour, je m\'appelle [name].', english: 'Hello, my name is [name].' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'These 5 verbs unlock most French sentences. Each has conjugations — tap to hear each form.',
      words: [
        // être
        { french: 'je suis', phonetic: 'ʒə sɥi', english: 'I am', partOfSpeech: 'verb (être)' },
        { french: 'vous êtes', phonetic: 'vu.z‿ɛt', english: 'you are (formal)', partOfSpeech: 'verb (être)' },
        { french: 'c\'est', phonetic: 'sɛ', english: 'it is / that is', partOfSpeech: 'verb (être)' },
        // avoir
        { french: 'j\'ai', phonetic: 'ʒe', english: 'I have', partOfSpeech: 'verb (avoir)' },
        { french: 'vous avez', phonetic: 'vu.z‿a.ve', english: 'you have (formal)', partOfSpeech: 'verb (avoir)' },
        { french: 'il y a', phonetic: 'il i a', english: 'there is / there are', partOfSpeech: 'verb (avoir)' },
        // aller
        { french: 'je vais', phonetic: 'ʒə vɛ', english: 'I am going / I will', partOfSpeech: 'verb (aller)' },
        { french: 'on va', phonetic: 'ɔ̃ va', english: 'we are going / let\'s', partOfSpeech: 'verb (aller)' },
        // pouvoir
        { french: 'je peux', phonetic: 'ʒə pø', english: 'I can', partOfSpeech: 'verb (pouvoir)' },
        { french: 'vous pouvez', phonetic: 'vu pu.ve', english: 'you can (formal)', partOfSpeech: 'verb (pouvoir)' },
        // vouloir
        { french: 'je voudrais', phonetic: 'ʒə vu.dʁɛ', english: 'I would like', partOfSpeech: 'verb (vouloir)' },
        { french: 'je veux', phonetic: 'ʒə vø', english: 'I want', partOfSpeech: 'verb (vouloir)' },
      ],
      chunks: [
        { french: 'Je suis disponible demain.', phonetic: 'ʒə sɥi dis.pɔ.nibl də.mɛ̃', english: 'I am available tomorrow.', note: '"Je suis + adjective" is your most versatile sentence pattern.' },
        { french: 'Est-ce que vous pouvez m\'aider ?', phonetic: 'ɛs.kə vu pu.ve me.de', english: 'Can you help me? (formal)', note: '"Est-ce que vous pouvez..." is the polite power phrase.' },
        { french: 'Je voudrais un café, s\'il vous plaît.', phonetic: 'ʒə vu.dʁɛ œ̃ ka.fe sil vu plɛ', english: 'I would like a coffee, please.', note: '"Je voudrais" is safer and more polite than "je veux".' },
        { french: 'On va commencer ?', phonetic: 'ɔ̃ va kɔ.mɑ̃.se', english: 'Shall we start? / Let\'s begin.', note: '"On va + infinitive" is the near-future tense — simple and natural.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Transform the sentence. Speak out loud first, then tap to check.',
      exercises: [
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Je suis disponible demain matin.', answer: 'Je suis disponible demain matin.' },
        { type: 'substitute', instruction: 'Change "disponible" to "prêt" (ready)', prompt: 'Je suis disponible.', answer: 'Je suis prêt.',
          substitutePairs: [{ cue: 'disponible → prêt', answer: 'Je suis prêt.' }]
        },
        { type: 'choose', instruction: 'Which is more polite?', prompt: 'To order food, it\'s better to say:', answer: 'Je voudrais un café.', options: ['Je veux un café.', 'Je voudrais un café.', 'Donne-moi un café.', 'Un café.'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Est-ce que vous pouvez m\'aider ?', answer: 'Est-ce que vous pouvez m\'aider ?' },
        { type: 'substitute', instruction: 'Change the near-future action', prompt: 'On va commencer.', answer: 'On va [infinitive].',
          substitutePairs: [
            { cue: 'commencer → parler', answer: 'On va parler.' },
            { cue: 'commencer → travailler', answer: 'On va travailler.' },
          ]
        },
        { type: 'choose', instruction: '"There is a problem" in French is:', prompt: '"There is a problem."', answer: 'Il y a un problème.', options: ['C\'est un problème.', 'Il y a un problème.', 'J\'ai un problème.', 'Je suis problème.'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Il y a une réunion demain à neuf heures.', answer: 'Il y a une réunion demain à neuf heures.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Work meeting check-in. Your manager asks if you\'re ready and you discuss the agenda.',
      instruction: 'Speak your lines out loud. Use the hints before revealing.',
      aiSlot: false,
      exchanges: [
        { speaker: 'app', french: 'Bonjour ! Vous êtes prêt pour la réunion ?', english: 'Good morning! Are you ready for the meeting?', aiSlot: true },
        { speaker: 'you', french: 'Oui, je suis prêt(e). La réunion est à quelle heure ?', english: 'Yes, I am ready. What time is the meeting?', hint: 'Say you\'re ready and ask what time.' },
        { speaker: 'app', french: 'Elle est à dix heures. Il y a cinq personnes.', english: 'It\'s at ten o\'clock. There are five people.', aiSlot: true },
        { speaker: 'you', french: 'D\'accord. Est-ce que vous pouvez envoyer l\'ordre du jour ?', english: 'Okay. Can you send the agenda?', hint: 'Say OK and ask if they can send the agenda.' },
        { speaker: 'app', french: 'Bien sûr ! Je vais l\'envoyer maintenant.', english: 'Of course! I\'m going to send it now.', aiSlot: true },
        { speaker: 'you', french: 'Merci. On va commencer à dix heures alors.', english: 'Thank you. We\'ll start at ten then.', hint: 'Thank them and confirm the start time.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Common verb errors. Read the right version twice.',
      keyPoints: [
        { wrong: 'Je suis avoir faim.', right: 'J\'ai faim.', explanation: '"Faim" (hungry) uses "avoir", not "être". French uses "avoir" for many states English uses "to be" for.' },
        { wrong: 'Je veux voudrais un café.', right: 'Je voudrais un café.', explanation: 'Pick one: "veux" (direct, blunt) or "voudrais" (polite). "Voudrais" is safer in formal settings.' },
        { wrong: 'On va à commencer.', right: 'On va commencer.', explanation: 'Near future: "aller + infinitive" with no "à" in between.' },
        { wrong: 'Est-ce que vous peut m\'aider ?', right: 'Est-ce que vous pouvez m\'aider ?', explanation: '"Vous" always takes "pouvez", not "peut" (which is il/elle).' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Read each aloud one final time.',
      canSayNow: [
        'Je suis [adjective] — describe your state (ready, available, tired)',
        'J\'ai [noun] — say what you have or feel',
        'Il y a [noun] — there is/are (meetings, problems, people)',
        'Je voudrais [noun/infinitive] — politely request anything',
        'On va [infinitive] — near future (let\'s do / we will)',
        'Est-ce que vous pouvez [infinitive] ? — politely ask anyone for help',
      ],
      wellDoneNote: 'These 6 patterns cover the vast majority of sentences you\'ll need in survival and early professional French. Build everything else on top of them.',
    },
  ],
};

// ── UNIT 4: Question Words ────────────────────────────────────
const unit4: StructuredUnit = {
  id: 'unit_4',
  unitNumber: 4,
  title: 'Question Words',
  subtitle: 'Ask anything confidently',
  icon: '❓',
  stage: 'survival',
  track: 'A',
  estimatedMinutes: 40,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Spoken review. No looking — say the French before tapping.',
      reviewItems: [
        { french: 'Est-ce que vous pouvez m\'aider ?', english: 'Can you help me?' },
        { french: 'Je voudrais un café, s\'il vous plaît.', english: 'I\'d like a coffee, please.' },
        { french: 'On va commencer ?', english: 'Shall we start?' },
        { french: 'Il y a une réunion demain.', english: 'There is a meeting tomorrow.' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Seven question words. Tap each to hear, then repeat.',
      words: [
        { french: 'qui', phonetic: 'ki', english: 'who', partOfSpeech: 'question word' },
        { french: 'quoi / que / qu\'est-ce que', phonetic: 'kwa / kə / kɛs.kə', english: 'what', partOfSpeech: 'question word' },
        { french: 'où', phonetic: 'u', english: 'where', partOfSpeech: 'question word' },
        { french: 'quand', phonetic: 'kɑ̃', english: 'when', partOfSpeech: 'question word' },
        { french: 'comment', phonetic: 'kɔ.mɑ̃', english: 'how', partOfSpeech: 'question word' },
        { french: 'combien', phonetic: 'kɔ̃.bjɛ̃', english: 'how many / how much', partOfSpeech: 'question word' },
        { french: 'pourquoi', phonetic: 'puʁ.kwa', english: 'why', partOfSpeech: 'question word' },
      ],
      chunks: [
        { french: 'Qui est responsable de ce projet ?', phonetic: 'ki ɛ ʁɛs.pɔ̃.sabl', english: 'Who is responsible for this project?', note: '"Qui est..." is used for people.' },
        { french: 'Qu\'est-ce que vous faites ?', phonetic: 'kɛs.kə vu fɛt', english: 'What are you doing?', note: '"Qu\'est-ce que" is the safest way to ask "what" — always works.' },
        { french: 'Où est la salle de réunion ?', phonetic: 'u ɛ la sal də ʁe.y.njɔ̃', english: 'Where is the meeting room?', note: 'Most useful question on your first day anywhere.' },
        { french: 'Comment ça marche ?', phonetic: 'kɔ.mɑ̃ sa maʁʃ', english: 'How does it work?', note: 'Use this to ask about any process or system.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Build the question. Speak first, tap to confirm.',
      exercises: [
        { type: 'choose', instruction: 'Which question word means "who"?', prompt: '"Who" in French is:', answer: 'qui', options: ['quoi', 'qui', 'où', 'combien'] },
        { type: 'choose', instruction: 'Which question word means "where"?', prompt: '"Where" in French is:', answer: 'où', options: ['comment', 'pourquoi', 'où', 'quand'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Où est la salle de réunion ?', answer: 'Où est la salle de réunion ?' },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Qu\'est-ce que vous faites ?', answer: 'Qu\'est-ce que vous faites ?' },
        { type: 'substitute', instruction: 'Change the question word to ask "when"', prompt: 'Où est la réunion ?', answer: 'Quand est la réunion ?',
          substitutePairs: [{ cue: 'Où → Quand', answer: 'Quand est la réunion ?' }]
        },
        { type: 'choose', instruction: 'How do you ask "how does it work?"', prompt: 'Pick the correct sentence:', answer: 'Comment ça marche ?', options: ['Pourquoi ça marche ?', 'Comment ça marche ?', 'Combien ça marche ?', 'Qui ça marche ?'] },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 10,
      scenario: 'First day at a new office. You need to ask where things are and understand the schedule.',
      instruction: 'Ask the questions. Use the hints before revealing.',
      aiSlot: false,
      exchanges: [
        { speaker: 'app', french: 'Bonjour ! Bienvenue dans l\'équipe !', english: 'Hello! Welcome to the team!', aiSlot: true },
        { speaker: 'you', french: 'Merci ! Où est la salle de réunion ?', english: 'Thank you! Where is the meeting room?', hint: 'Say thank you, then ask where the meeting room is.' },
        { speaker: 'app', french: 'C\'est au deuxième étage, à droite.', english: 'It\'s on the second floor, on the right.', aiSlot: true },
        { speaker: 'you', french: 'Merci. Quand commence la réunion ?', english: 'Thank you. When does the meeting start?', hint: 'Ask when the meeting starts.' },
        { speaker: 'app', french: 'À neuf heures trente.', english: 'At nine thirty.', aiSlot: true },
        { speaker: 'you', french: 'Qui est responsable de la réunion ?', english: 'Who is responsible for the meeting?', hint: 'Ask who is in charge of the meeting.' },
        { speaker: 'app', french: 'C\'est Madame Dupont.', english: 'It\'s Madame Dupont.', aiSlot: true },
        { speaker: 'you', french: 'D\'accord. Comment ça marche ici ?', english: 'Okay. How does it work here?', hint: 'Say OK and ask how things work here.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Common question mistakes. Correct version out loud twice.',
      keyPoints: [
        { wrong: 'Que vous faites ?', right: 'Qu\'est-ce que vous faites ?', explanation: '"Que" alone sounds incomplete in spoken French. "Qu\'est-ce que" is what native speakers actually say.' },
        { wrong: 'Comment est ça marche ?', right: 'Comment ça marche ?', explanation: 'No "est" here. "Comment ça marche" is a fixed block — learn it as a chunk.' },
        { wrong: 'Où est-il la réunion ?', right: 'Où est la réunion ?', explanation: 'Don\'t add "il" after "est" for location questions like this.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Read each aloud.',
      canSayNow: [
        'Qui est... ? — ask who someone is',
        'Qu\'est-ce que vous faites ? — ask what someone is doing',
        'Où est... ? — ask where anything is',
        'Quand est... ? — ask when something happens',
        'Comment ça marche ? — ask how something works',
        'Combien ? — ask any price or quantity',
        'Pourquoi ? — ask why (use sparingly in formal settings)',
      ],
      wellDoneNote: 'With these 7 question words, you can navigate almost any conversation in France — asking is the fastest way to learn.',
    },
  ],
};

// ── UNIT 5: Work Small Talk & Professional Introductions ──────
const unit5: StructuredUnit = {
  id: 'unit_5',
  unitNumber: 5,
  title: 'Work Small Talk',
  subtitle: 'Professional first impressions',
  icon: '💼',
  stage: 'survival',
  track: 'B',  // Applied scenario using Track A
  estimatedMinutes: 45,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Speed review — all from previous units. Speak first.',
      reviewItems: [
        { french: 'Qui est responsable de ce projet ?', english: 'Who is responsible for this project?' },
        { french: 'Où est la salle de réunion ?', english: 'Where is the meeting room?' },
        { french: 'On va commencer ?', english: 'Shall we start?' },
        { french: 'Je suis disponible demain matin.', english: 'I am available tomorrow morning.' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Professional vocabulary and work phrases. Tap to hear.',
      words: [
        { french: 'je travaille', phonetic: 'ʒə tʁa.vaj', english: 'I work', partOfSpeech: 'verb' },
        { french: 'mon poste', phonetic: 'mɔ̃ pɔst', english: 'my position / my role', partOfSpeech: 'phrase' },
        { french: 'mon équipe', phonetic: 'mɔ̃.n‿e.kip', english: 'my team', partOfSpeech: 'phrase' },
        { french: 'notre projet', phonetic: 'nɔtʁ pʁɔ.ʒɛ', english: 'our project', partOfSpeech: 'phrase' },
        { french: 'depuis', phonetic: 'də.pɥi', english: 'since / for (time)', partOfSpeech: 'preposition' },
        { french: 'bientôt', phonetic: 'bjɛ̃.to', english: 'soon', partOfSpeech: 'adverb' },
        { french: 'maintenant', phonetic: 'mɛ̃.tə.nɑ̃', english: 'now', partOfSpeech: 'adverb' },
        { french: 'tout à fait', phonetic: 'tu.t‿a fɛ', english: 'absolutely / exactly', partOfSpeech: 'expression' },
        { french: 'bien sûr', phonetic: 'bjɛ̃ syʁ', english: 'of course', partOfSpeech: 'expression' },
        { french: 'pas encore', phonetic: 'pa.z‿ɑ̃.kɔʁ', english: 'not yet', partOfSpeech: 'expression' },
      ],
      chunks: [
        { french: 'Je travaille dans le secteur de l\'éducation.', phonetic: 'ʒə tʁa.vaj dɑ̃ lə sɛk.tœʁ', english: 'I work in the education sector.', note: 'Replace "l\'éducation" with your field.' },
        { french: 'Je suis en poste depuis six mois.', phonetic: 'ʒə sɥi ɑ̃ pɔst də.pɥi si mwa', english: 'I have been in this role for six months.', note: '"Depuis" + present tense = how long you\'ve been doing something.' },
        { french: 'Notre équipe travaille sur un nouveau projet.', phonetic: 'nɔtʁ e.kip tʁa.vaj syʁ œ̃ nu.vo pʁɔ.ʒɛ', english: 'Our team is working on a new project.', note: 'Replace project name as needed.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Substitute and repeat. Keep it fast.',
      exercises: [
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Je travaille dans le secteur de l\'éducation.', answer: 'Je travaille dans le secteur de l\'éducation.' },
        { type: 'substitute', instruction: 'Change the sector', prompt: 'Je travaille dans le secteur de l\'éducation.', answer: 'Je travaille dans le secteur de [your sector].',
          substitutePairs: [
            { cue: 'éducation → la technologie', answer: 'Je travaille dans le secteur de la technologie.' },
            { cue: 'éducation → la santé', answer: 'Je travaille dans le secteur de la santé.' },
          ]
        },
        { type: 'choose', instruction: 'Which means "of course"?', prompt: '"Of course" in French:', answer: 'bien sûr', options: ['bientôt', 'tout à fait', 'bien sûr', 'pas encore'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Je suis en poste depuis six mois.', answer: 'Je suis en poste depuis six mois.' },
        { type: 'choose', instruction: '"Not yet" in French is:', prompt: '"Not yet" =', answer: 'pas encore', options: ['pas maintenant', 'pas encore', 'bientôt', 'tout à fait'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Tout à fait ! Notre équipe est disponible demain.', answer: 'Tout à fait ! Notre équipe est disponible demain.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Professional meeting introduction — presenting yourself and your work to a French partner.',
      instruction: 'Full spoken scenario. Use all units combined.',
      aiSlot: false,
      exchanges: [
        { speaker: 'app', french: 'Bonjour ! Je suis Marc Lemaire. Enchanté.', english: 'Hello! I\'m Marc Lemaire. Nice to meet you.', aiSlot: true },
        { speaker: 'you', french: 'Bonjour Monsieur Lemaire ! Je m\'appelle [name]. Enchanté(e).', english: 'Hello Mr. Lemaire! My name is [name]. Nice to meet you.', hint: 'Greet formally and introduce yourself.' },
        { speaker: 'app', french: 'Qu\'est-ce que vous faites exactement ?', english: 'What exactly do you do?', aiSlot: true },
        { speaker: 'you', french: 'Je travaille dans le secteur de l\'éducation. Je suis en poste depuis deux ans.', english: 'I work in the education sector. I\'ve been in this role for two years.', hint: 'State your sector and how long you\'ve been there.' },
        { speaker: 'app', french: 'Très intéressant. Vous travaillez sur quel projet ?', english: 'Very interesting. What project are you working on?', aiSlot: true },
        { speaker: 'you', french: 'Notre équipe travaille sur un nouveau projet d\'application éducative.', english: 'Our team is working on a new educational app project.', hint: 'Describe your project using "notre équipe".' },
        { speaker: 'app', french: 'Est-ce que vous êtes disponible pour une réunion demain ?', english: 'Are you available for a meeting tomorrow?', aiSlot: true },
        { speaker: 'you', french: 'Oui, bien sûr ! Je suis disponible demain matin à dix heures.', english: 'Yes, of course! I\'m available tomorrow morning at ten.', hint: 'Say yes, of course, and suggest a time.' },
        { speaker: 'app', french: 'Parfait. À demain !', english: 'Perfect. See you tomorrow!', aiSlot: true },
        { speaker: 'you', french: 'À demain, Monsieur Lemaire. Au revoir !', english: 'See you tomorrow, Mr. Lemaire. Goodbye!', hint: 'Confirm and say goodbye formally.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Professional French errors that hurt your credibility. Correct version out loud twice.',
      keyPoints: [
        { wrong: 'Je travaille dans éducation.', right: 'Je travaille dans le secteur de l\'éducation.', explanation: 'Always name the sector with "dans le secteur de". It sounds more professional.' },
        { wrong: 'Depuis deux ans je suis ici.', right: 'Je suis ici depuis deux ans.', explanation: '"Depuis" comes AFTER the verb in normal word order in French.' },
        { wrong: 'Très bien sûr !', right: 'Bien sûr ! (or) Tout à fait !', explanation: 'Don\'t combine "très" with "bien sûr" — choose one expression.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Read aloud.',
      canSayNow: [
        'Introduce yourself professionally in a meeting or partner call',
        'State your role, sector and how long you\'ve been there',
        'Describe your team\'s project',
        'Confirm availability and schedule a follow-up meeting',
        'Use "bien sûr", "tout à fait", "pas encore" naturally',
      ],
      wellDoneNote: 'You just ran a full professional introduction in French. This is exactly the opening 5 minutes of any business meeting in a French-speaking context.',
    },
  ],
};

// ── UNIT 6: Buying, Paying & Everyday Logistics ───────────────
const unit6: StructuredUnit = {
  id: 'unit_6',
  unitNumber: 6,
  title: 'Buying & Everyday Logistics',
  subtitle: 'Markets, shops, transport',
  icon: '🛒',
  stage: 'survival',
  track: 'B',
  estimatedMinutes: 40,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Speed review. Speak before tapping.',
      reviewItems: [
        { french: 'C\'est combien ?', english: 'How much is it?' },
        { french: 'Je voudrais [quelque chose], s\'il vous plaît.', english: 'I would like [something], please.' },
        { french: 'Est-ce que vous pouvez m\'aider ?', english: 'Can you help me?' },
        { french: 'Où est... ?', english: 'Where is... ?' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Shopping, transport and everyday survival words. Tap to hear.',
      words: [
        { french: 'je voudrais acheter', phonetic: 'ʒə vu.dʁɛ aʃ.te', english: 'I would like to buy', partOfSpeech: 'phrase' },
        { french: 'c\'est trop cher', phonetic: 'sɛ tʁo ʃɛʁ', english: 'it\'s too expensive', partOfSpeech: 'expression' },
        { french: 'vous pouvez faire un rabais ?', phonetic: 'vu pu.ve fɛʁ œ̃ ʁa.bɛ', english: 'can you give a discount?', partOfSpeech: 'phrase' },
        { french: 'je peux payer par carte ?', phonetic: 'ʒə pø pe.je paʁ kaʁt', english: 'can I pay by card?', partOfSpeech: 'question' },
        { french: 'un ticket / un billet', phonetic: 'œ̃ ti.kɛ / œ̃ bi.jɛ', english: 'a ticket', partOfSpeech: 'noun', gender: 'm' },
        { french: 'à droite / à gauche', phonetic: 'a dʁwat / a ɡoʃ', english: 'to the right / to the left', partOfSpeech: 'expression' },
        { french: 'tout droit', phonetic: 'tu dʁwa', english: 'straight ahead', partOfSpeech: 'expression' },
        { french: 'près d\'ici', phonetic: 'pʁɛ di.si', english: 'near here / close by', partOfSpeech: 'expression' },
        { french: 'l\'arrêt de bus', phonetic: 'la.ʁɛ də bys', english: 'the bus stop', partOfSpeech: 'noun', gender: 'm' },
        { french: 'le marché', phonetic: 'lə maʁ.ʃe', english: 'the market', partOfSpeech: 'noun', gender: 'm' },
      ],
      chunks: [
        { french: 'Je voudrais acheter un kilo de mangues.', phonetic: 'ʒə vu.dʁɛ aʃ.te œ̃ ki.lo də mɑ̃ɡ', english: 'I would like to buy a kilo of mangoes.', note: 'Replace "mangues" with any food or item.' },
        { french: 'C\'est combien le kilo ?', phonetic: 'sɛ kɔ̃.bjɛ̃ lə ki.lo', english: 'How much per kilo?', note: 'Use at any market in francophone Africa or France.' },
        { french: 'L\'arrêt de bus est près d\'ici ?', phonetic: 'la.ʁɛ də bys ɛ pʁɛ di.si', english: 'Is the bus stop near here?', note: 'Replace "l\'arrêt de bus" with any destination.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Market and transport drills. Fast responses.',
      exercises: [
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'C\'est combien le kilo de mangues ?', answer: 'C\'est combien le kilo de mangues ?' },
        { type: 'choose', instruction: '"It\'s too expensive" is:', prompt: 'Too expensive =', answer: 'C\'est trop cher.', options: ['C\'est bon marché.', 'C\'est trop cher.', 'C\'est combien ?', 'Je peux payer ?'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Vous pouvez faire un rabais ? C\'est trop cher.', answer: 'Vous pouvez faire un rabais ? C\'est trop cher.' },
        { type: 'substitute', instruction: 'Ask if you can pay by card', prompt: 'Je peux payer en espèces.', answer: 'Je peux payer par carte ?',
          substitutePairs: [{ cue: 'en espèces → par carte', answer: 'Je peux payer par carte ?' }]
        },
        { type: 'choose', instruction: '"Straight ahead" is:', prompt: 'Straight ahead =', answer: 'tout droit', options: ['à droite', 'à gauche', 'tout droit', 'près d\'ici'] },
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'L\'arrêt de bus est à droite, tout droit.', answer: 'L\'arrêt de bus est à droite, tout droit.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 10,
      scenario: 'At the market in Cotonou — buying mangoes and asking for directions to the bus stop.',
      instruction: 'You are the buyer. Speak your lines before tapping.',
      aiSlot: false,
      exchanges: [
        { speaker: 'app', french: 'Bonjour ! Vous désirez quelque chose ?', english: 'Hello! Would you like something?', aiSlot: true },
        { speaker: 'you', french: 'Bonjour ! Je voudrais acheter des mangues.', english: 'Hello! I\'d like to buy some mangoes.', hint: 'Greet and say you want to buy mangoes.' },
        { speaker: 'app', french: 'Oui ! C\'est mille francs le kilo.', english: 'Yes! It\'s one thousand francs per kilo.', aiSlot: true },
        { speaker: 'you', french: 'C\'est trop cher. Vous pouvez faire un rabais ?', english: 'That\'s too expensive. Can you give a discount?', hint: 'Say it\'s too expensive and ask for a discount.' },
        { speaker: 'app', french: 'D\'accord, huit cents francs le kilo.', english: 'Okay, 800 francs per kilo.', aiSlot: true },
        { speaker: 'you', french: 'Bien. Je voudrais deux kilos, s\'il vous plaît.', english: 'Good. I\'d like two kilos, please.', hint: 'Accept and order 2 kilos.' },
        { speaker: 'app', french: 'Voilà ! C\'est seize cents francs.', english: 'Here you go! That\'s 1600 francs.', aiSlot: true },
        { speaker: 'you', french: 'Je peux payer par carte ?', english: 'Can I pay by card?', hint: 'Ask if card payment is possible.' },
        { speaker: 'app', french: 'Non, seulement en espèces ici.', english: 'No, only cash here.', aiSlot: true },
        { speaker: 'you', french: 'D\'accord. Où est l\'arrêt de bus près d\'ici ?', english: 'Okay. Where is the bus stop near here?', hint: 'Pay and then ask for directions to the bus stop.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Market and transport errors. Correct version out loud twice.',
      keyPoints: [
        { wrong: 'C\'est beaucoup cher.', right: 'C\'est trop cher.', explanation: '"Trop" means "too much" — it\'s the right word for expressing something is overpriced. "Beaucoup" means "a lot" but doesn\'t carry the same complaint meaning.' },
        { wrong: 'Je peux payer avec carte ?', right: 'Je peux payer par carte ?', explanation: 'Pay BY card uses "par carte", not "avec carte".' },
        { wrong: 'Allez tout le droit.', right: 'Allez tout droit.', explanation: '"Tout droit" is a fixed block — no "le" in the middle.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Read aloud.',
      canSayNow: [
        'Je voudrais acheter [item] — buy anything at a market',
        'C\'est combien le kilo ? — ask the price',
        'C\'est trop cher / Vous pouvez faire un rabais ? — negotiate',
        'Je peux payer par carte ? — ask about card payment',
        'À droite / à gauche / tout droit — navigate anywhere',
        'L\'arrêt de bus est près d\'ici ? — find public transport',
      ],
      wellDoneNote: 'You just completed Stage 1: Survival. You can now introduce yourself, schedule meetings, ask questions, navigate and shop — all in French with no internet required.',
    },
  ],
};

// ── EXPORT ───────────────────────────────────────────────────

export const STRUCTURED_PROGRAM: StructuredUnit[] = [
  unit1,
  unit2,
  unit3,
  unit4,
  unit5,
  unit6,
];

export const STAGE_LABELS: Record<ProgressionStage, string> = {
  survival: '🔵 Stage 1 — Survival',
  functional: '🟡 Stage 2 — Functional',
  operational: '🟠 Stage 3 — Operational',
  fluent: '🟢 Stage 4 — Fluent Use',
};

export const STAGE_DESCRIPTIONS: Record<ProgressionStage, string> = {
  survival: 'Weeks 1–4: Greetings, numbers, core verbs, questions, work basics and everyday logistics.',
  functional: 'Weeks 5–10: Work scenarios, near future tense, handling unexpected replies.',
  operational: 'Weeks 11–20: Past tense, opinions, explanations, longer conversations.',
  fluent: 'Week 20+: Fast listening, accents, negotiation, spontaneous speech with AI.',
};
