// ============================================================
// OFFLINE TRANSLATION & DICTIONARY SERVICE
// Instant bidirectional search (English <-> French),
// local history logging, and saved favorites.
// ============================================================

import { FRENCH_QUICK_GLOSSARY } from './wordLookup';
import { sharedContentCache } from './sharedContentCache';

export interface TranslationResult {
  sourceText: string;
  translatedText: string;
  sourceLang: 'en' | 'fr';
  targetLang: 'en' | 'fr';
  phonetic?: string;
  partOfSpeech?: string;
  gender?: 'm' | 'f';
  exampleFr?: string;
  exampleEn?: string;
  notes?: string;
  matchType: 'exact_dictionary' | 'pattern' | 'smart_token' | 'ai_fallback' | 'online_api';
}

export interface TranslationHistoryItem extends TranslationResult {
  id: string;
  timestamp: string;
  isStarred?: boolean;
}

const HISTORY_STORAGE_KEY = 'translation_history_v1';

// Large bundled offline English -> French / French -> English lexical table
export interface LexiconEntry {
  fr: string;
  en: string[];
  phonetic: string;
  pos: string;
  gender?: 'm' | 'f';
  exampleFr?: string;
  exampleEn?: string;
}

export const OFFLINE_LEXICON: LexiconEntry[] = [
  // Greetings & Courtesies
  { fr: 'bonjour', en: ['hello', 'good morning', 'hi'], phonetic: 'bɔ̃.ʒuʁ', pos: 'expression', exampleFr: 'Bonjour monsieur, comment allez-vous ?', exampleEn: 'Hello sir, how are you?' },
  { fr: 'bonsoir', en: ['good evening'], phonetic: 'bɔ̃.swaʁ', pos: 'expression', exampleFr: 'Bonsoir à tous.', exampleEn: 'Good evening everyone.' },
  { fr: 'bonne nuit', en: ['good night'], phonetic: 'bɔn nɥi', pos: 'expression', exampleFr: 'Bonne nuit et à demain.', exampleEn: 'Good night and see you tomorrow.' },
  { fr: 'au revoir', en: ['goodbye', 'bye', 'see you'], phonetic: 'o ʁə.vwaʁ', pos: 'expression', exampleFr: 'Au revoir et bonne journée.', exampleEn: 'Goodbye and have a nice day.' },
  { fr: 'merci', en: ['thank you', 'thanks'], phonetic: 'mɛʁ.si', pos: 'expression', exampleFr: 'Merci beaucoup pour votre aide.', exampleEn: 'Thank you very much for your help.' },
  { fr: 's\'il vous plaît', en: ['please'], phonetic: 'sil vu plɛ', pos: 'expression', exampleFr: 'Un café, s\'il vous plaît.', exampleEn: 'A coffee, please.' },
  { fr: 'de rien', en: ['you are welcome', 'you\'re welcome', 'no problem', 'don\'t mention it'], phonetic: 'də ʁjɛ̃', pos: 'expression', exampleFr: 'De rien, c\'est un plaisir.', exampleEn: 'You\'re welcome, it\'s a pleasure.' },
  { fr: 'pardon', en: ['sorry', 'pardon', 'excuse me'], phonetic: 'paʁ.dɔ̃', pos: 'expression', exampleFr: 'Pardon, où est la gare ?', exampleEn: 'Excuse me, where is the station?' },
  { fr: 'excusez-moi', en: ['excuse me', 'pardon me'], phonetic: 'ɛk.sky.ze mwa', pos: 'expression', exampleFr: 'Excusez-moi de vous déranger.', exampleEn: 'Excuse me for bothering you.' },
  { fr: 'enchanté', en: ['nice to meet you', 'pleased to meet you'], phonetic: 'ɑ̃.ʃɑ̃.te', pos: 'expression', exampleFr: 'Enchanté de faire votre connaissance.', exampleEn: 'Nice to meet you.' },
  { fr: 'oui', en: ['yes', 'yeah'], phonetic: 'wi', pos: 'adverb', exampleFr: 'Oui, tout à fait.', exampleEn: 'Yes, absolutely.' },
  { fr: 'non', en: ['no'], phonetic: 'nɔ̃', pos: 'adverb', exampleFr: 'Non, merci.', exampleEn: 'No, thank you.' },
  { fr: 'd\'accord', en: ['okay', 'ok', 'agreed', 'all right'], phonetic: 'da.kɔʁ', pos: 'expression', exampleFr: 'D\'accord, on fait comme ça.', exampleEn: 'Okay, let\'s do it that way.' },

  // Pronouns & Core Questions
  { fr: 'je', en: ['i', 'me'], phonetic: 'ʒə', pos: 'pronoun' },
  { fr: 'tu', en: ['you (informal)'], phonetic: 'ty', pos: 'pronoun' },
  { fr: 'vous', en: ['you (formal / plural)'], phonetic: 'vu', pos: 'pronoun' },
  { fr: 'il', en: ['he', 'it'], phonetic: 'il', pos: 'pronoun' },
  { fr: 'elle', en: ['she', 'it'], phonetic: 'ɛl', pos: 'pronoun' },
  { fr: 'nous', en: ['we', 'us'], phonetic: 'nu', pos: 'pronoun' },
  { fr: 'on', en: ['we', 'one', 'people'], phonetic: 'ɔ̃', pos: 'pronoun' },
  { fr: 'ils', en: ['they (masculine)'], phonetic: 'il', pos: 'pronoun' },
  { fr: 'elles', en: ['they (feminine)'], phonetic: 'ɛl', pos: 'pronoun' },
  { fr: 'qui', en: ['who', 'whom'], phonetic: 'ki', pos: 'question', exampleFr: 'Qui est là ?', exampleEn: 'Who is there?' },
  { fr: 'quoi', en: ['what'], phonetic: 'kwa', pos: 'question' },
  { fr: 'qu\'est-ce que', en: ['what'], phonetic: 'kɛs.kə', pos: 'question', exampleFr: 'Qu\'est-ce que c\'est ?', exampleEn: 'What is it?' },
  { fr: 'où', en: ['where'], phonetic: 'u', pos: 'question', exampleFr: 'Où est le bureau ?', exampleEn: 'Where is the office?' },
  { fr: 'quand', en: ['when'], phonetic: 'kɑ̃', pos: 'question', exampleFr: 'Quand arrive le bus ?', exampleEn: 'When does the bus arrive?' },
  { fr: 'comment', en: ['how'], phonetic: 'kɔ.mɑ̃', pos: 'question', exampleFr: 'Comment ça marche ?', exampleEn: 'How does it work?' },
  { fr: 'pourquoi', en: ['why'], phonetic: 'puʁ.kwa', pos: 'question', exampleFr: 'Pourquoi pas ?', exampleEn: 'Why not?' },
  { fr: 'combien', en: ['how much', 'how many'], phonetic: 'kɔ̃.bjɛ̃', pos: 'question', exampleFr: 'C\'est combien ?', exampleEn: 'How much is it?' },

  // Essential Verbs & Forms
  { fr: 'être', en: ['to be', 'be'], phonetic: 'ɛtʁ', pos: 'verb' },
  { fr: 'suis', en: ['am'], phonetic: 'sɥi', pos: 'verb (être)' },
  { fr: 'est', en: ['is'], phonetic: 'ɛ', pos: 'verb (être)' },
  { fr: 'sommes', en: ['are (we)'], phonetic: 'sɔm', pos: 'verb (être)' },
  { fr: 'êtes', en: ['are (you)'], phonetic: 'ɛt', pos: 'verb (être)' },
  { fr: 'sont', en: ['are (they)'], phonetic: 'sɔ̃', pos: 'verb (être)' },
  { fr: 'avoir', en: ['to have', 'have'], phonetic: 'a.vwaʁ', pos: 'verb' },
  { fr: 'ai', en: ['have (i)'], phonetic: 'e', pos: 'verb (avoir)' },
  { fr: 'as', en: ['have (you)'], phonetic: 'a', pos: 'verb (avoir)' },
  { fr: 'a', en: ['has'], phonetic: 'a', pos: 'verb (avoir)' },
  { fr: 'avons', en: ['have (we)'], phonetic: 'a.vɔ̃', pos: 'verb (avoir)' },
  { fr: 'avez', en: ['have (you)'], phonetic: 'a.ve', pos: 'verb (avoir)' },
  { fr: 'ont', en: ['have (they)'], phonetic: 'ɔ̃', pos: 'verb (avoir)' },
  { fr: 'il y a', en: ['there is', 'there are'], phonetic: 'il i a', pos: 'expression' },
  { fr: 'faire', en: ['to do', 'to make', 'do', 'make'], phonetic: 'fɛʁ', pos: 'verb' },
  { fr: 'aller', en: ['to go', 'go'], phonetic: 'a.le', pos: 'verb' },
  { fr: 'vais', en: ['am going', 'go (i)'], phonetic: 'vɛ', pos: 'verb (aller)' },
  { fr: 'va', en: ['goes', 'is going'], phonetic: 'va', pos: 'verb (aller)' },
  { fr: 'pouvoir', en: ['to be able to', 'can'], phonetic: 'pu.vwaʁ', pos: 'verb' },
  { fr: 'peux', en: ['can (i/you)'], phonetic: 'pø', pos: 'verb (pouvoir)' },
  { fr: 'pouvez', en: ['can (you formal)'], phonetic: 'pu.ve', pos: 'verb (pouvoir)' },
  { fr: 'vouloir', en: ['to want', 'want'], phonetic: 'vu.lwaʁ', pos: 'verb' },
  { fr: 'voudrais', en: ['would like', 'want (polite)'], phonetic: 'vu.dʁɛ', pos: 'verb (vouloir)' },
  { fr: 'parler', en: ['to speak', 'to talk', 'speak', 'talk'], phonetic: 'paʁ.le', pos: 'verb' },
  { fr: 'comprendre', en: ['to understand', 'understand'], phonetic: 'kɔ̃.pʁɑ̃dʁ', pos: 'verb' },
  { fr: 'travailler', en: ['to work', 'work'], phonetic: 'tʁa.va.je', pos: 'verb' },
  { fr: 'manger', en: ['to eat', 'eat'], phonetic: 'mɑ̃.ʒe', pos: 'verb' },
  { fr: 'boire', en: ['to drink', 'drink'], phonetic: 'bwaʁ', pos: 'verb' },
  { fr: 'acheter', en: ['to buy', 'buy', 'purchase'], phonetic: 'aʃ.te', pos: 'verb' },
  { fr: 'payer', en: ['to pay', 'pay'], phonetic: 'pe.je', pos: 'verb' },
  { fr: 'chercher', en: ['to look for', 'to search', 'look for'], phonetic: 'ʃɛʁ.ʃe', pos: 'verb' },
  { fr: 'trouver', en: ['to find', 'find'], phonetic: 'tʁu.ve', pos: 'verb' },
  { fr: 'aider', en: ['to help', 'help'], phonetic: 'e.de', pos: 'verb' },
  { fr: 'attendre', en: ['to wait', 'wait'], phonetic: 'a.tɑ̃dʁ', pos: 'verb' },

  // Food, Drinks & Dining
  { fr: 'nourriture', en: ['food', 'nourishment'], phonetic: 'nu.ʁi.tyʁ', pos: 'noun', gender: 'f', exampleFr: 'La nourriture est excellente ici.', exampleEn: 'The food is excellent here.' },
  { fr: 'repas', en: ['meal', 'food'], phonetic: 'ʁə.pa', pos: 'noun', gender: 'm', exampleFr: 'Bon repas !', exampleEn: 'Enjoy your meal!' },
  { fr: 'aliment', en: ['food item', 'food', 'groceries'], phonetic: 'a.li.mɑ̃', pos: 'noun', gender: 'm' },
  { fr: 'eau', en: ['water'], phonetic: 'o', pos: 'noun', gender: 'f', exampleFr: 'Un verre d\'eau, s\'il vous plaît.', exampleEn: 'A glass of water, please.' },
  { fr: 'café', en: ['coffee'], phonetic: 'ka.fe', pos: 'noun', gender: 'm', exampleFr: 'Je voudrais un café.', exampleEn: 'I would like a coffee.' },
  { fr: 'thé', en: ['tea'], phonetic: 'te', pos: 'noun', gender: 'm' },
  { fr: 'pain', en: ['bread'], phonetic: 'pɛ̃', pos: 'noun', gender: 'm' },
  { fr: 'riz', en: ['rice'], phonetic: 'ʁi', pos: 'noun', gender: 'm' },
  { fr: 'poulet', en: ['chicken'], phonetic: 'pu.lɛ', pos: 'noun', gender: 'm' },
  { fr: 'poisson', en: ['fish'], phonetic: 'pwa.sɔ̃', pos: 'noun', gender: 'm' },
  { fr: 'viande', en: ['meat'], phonetic: 'vjɑ̃d', pos: 'noun', gender: 'f' },
  { fr: 'fruits', en: ['fruits', 'fruit'], phonetic: 'fʁɥi', pos: 'noun', gender: 'm' },
  { fr: 'mangue', en: ['mango'], phonetic: 'mɑ̃ɡ', pos: 'noun', gender: 'f' },
  { fr: 'pomme', en: ['apple'], phonetic: 'pɔm', pos: 'noun', gender: 'f' },
  { fr: 'addition', en: ['bill', 'check'], phonetic: 'a.di.sjɔ̃', pos: 'noun', gender: 'f', exampleFr: 'L\'addition, s\'il vous plaît.', exampleEn: 'The bill, please.' },
  { fr: 'restaurant', en: ['restaurant'], phonetic: 'ʁɛs.to.ʁɑ̃', pos: 'noun', gender: 'm' },
  { fr: 'plat', en: ['dish', 'meal'], phonetic: 'pla', pos: 'noun', gender: 'm' },
  { fr: 'menu', en: ['menu', 'set meal'], phonetic: 'mə.ny', pos: 'noun', gender: 'm' },

  // Places, Travel & Accommodation
  { fr: 'hôtel', en: ['hotel'], phonetic: 'o.tɛl', pos: 'noun', gender: 'm', exampleFr: 'Où est l\'hôtel le plus proche ?', exampleEn: 'Where is the nearest hotel?' },
  { fr: 'chambre', en: ['room', 'bedroom'], phonetic: 'ʃɑ̃bʁ', pos: 'noun', gender: 'f' },
  { fr: 'lit', en: ['bed'], phonetic: 'li', pos: 'noun', gender: 'm' },
  { fr: 'clé', en: ['key'], phonetic: 'kle', pos: 'noun', gender: 'f' },
  { fr: 'salle de bain', en: ['bathroom', 'washroom'], phonetic: 'sal də bɛ̃', pos: 'noun', gender: 'f' },
  { fr: 'toilettes', en: ['toilets', 'restroom', 'bathroom'], phonetic: 'twa.lɛt', pos: 'noun', gender: 'f' },
  { fr: 'taxi', en: ['taxi', 'cab'], phonetic: 'tak.si', pos: 'noun', gender: 'm' },
  { fr: 'bus', en: ['bus'], phonetic: 'bys', pos: 'noun', gender: 'm' },
  { fr: 'gare', en: ['train station', 'station'], phonetic: 'ɡaʁ', pos: 'noun', gender: 'f' },
  { fr: 'aéroport', en: ['airport'], phonetic: 'a.e.ʁɔ.pɔʁ', pos: 'noun', gender: 'm' },
  { fr: 'rue', en: ['street', 'road'], phonetic: 'ʁy', pos: 'noun', gender: 'f' },
  { fr: 'banque', en: ['bank'], phonetic: 'bɑ̃k', pos: 'noun', gender: 'f' },
  { fr: 'marché', en: ['market'], phonetic: 'maʁ.ʃe', pos: 'noun', gender: 'm' },
  { fr: 'hôpital', en: ['hospital'], phonetic: 'o.pi.tal', pos: 'noun', gender: 'm' },
  { fr: 'pharmacie', en: ['pharmacy', 'chemist'], phonetic: 'faʁ.ma.si', pos: 'noun', gender: 'f' },

  // Directions
  { fr: 'droite', en: ['right'], phonetic: 'dʁwat', pos: 'noun/dir', exampleFr: 'Tournez à droite.', exampleEn: 'Turn right.' },
  { fr: 'gauche', en: ['left'], phonetic: 'ɡoʃ', pos: 'noun/dir', exampleFr: 'C\'est à gauche.', exampleEn: 'It\'s on the left.' },
  { fr: 'tout droit', en: ['straight ahead', 'straight on'], phonetic: 'tu dʁwa', pos: 'expression', exampleFr: 'Allez tout droit.', exampleEn: 'Go straight ahead.' },
  { fr: 'près', en: ['near', 'close'], phonetic: 'pʁɛ', pos: 'preposition' },
  { fr: 'loin', en: ['far', 'distant'], phonetic: 'lwɛ̃', pos: 'adverb' },
  { fr: 'ici', en: ['here'], phonetic: 'i.si', pos: 'adverb' },
  { fr: 'là-bas', en: ['over there', 'there'], phonetic: 'la.ba', pos: 'adverb' },

  // Business, Work & Tech
  { fr: 'travail', en: ['work', 'job'], phonetic: 'tʁa.vaj', pos: 'noun', gender: 'm' },
  { fr: 'bureau', en: ['office', 'desk'], phonetic: 'by.ʁo', pos: 'noun', gender: 'm' },
  { fr: 'réunion', en: ['meeting'], phonetic: 'ʁe.y.njɔ̃', pos: 'noun', gender: 'f' },
  { fr: 'projet', en: ['project', 'plan'], phonetic: 'pʁɔ.ʒɛ', pos: 'noun', gender: 'm' },
  { fr: 'équipe', en: ['team'], phonetic: 'e.kip', pos: 'noun', gender: 'f' },
  { fr: 'responsable', en: ['manager', 'head', 'person in charge'], phonetic: 'ʁɛs.pɔ̃.sabl', pos: 'noun' },
  { fr: 'directeur', en: ['director', 'headmaster', 'principal'], phonetic: 'di.ʁɛk.tœʁ', pos: 'noun', gender: 'm' },
  { fr: 'école', en: ['school'], phonetic: 'e.kɔl', pos: 'noun', gender: 'f' },
  { fr: 'élève', en: ['student', 'pupil'], phonetic: 'e.lɛv', pos: 'noun' },
  { fr: 'enseignant', en: ['teacher', 'instructor'], phonetic: 'ɑ̃.sɛ.ɲɑ̃', pos: 'noun', gender: 'm' },
  { fr: 'application', en: ['application', 'app'], phonetic: 'a.pli.ka.sjɔ̃', pos: 'noun', gender: 'f' },
  { fr: 'téléphone', en: ['phone', 'telephone'], phonetic: 'te.le.fɔn', pos: 'noun', gender: 'm' },
  { fr: 'ordinateur', en: ['computer', 'laptop'], phonetic: 'ɔʁ.di.na.tœʁ', pos: 'noun', gender: 'm' },
  { fr: 'connexion', en: ['connection', 'internet'], phonetic: 'kɔ.nɛk.sjɔ̃', pos: 'noun', gender: 'f' },
  { fr: 'message', en: ['message'], phonetic: 'mɛ.saʒ', pos: 'noun', gender: 'm' },
  { fr: 'email', en: ['email', 'mail'], phonetic: 'i.mɛjl', pos: 'noun', gender: 'm' },

  // Time & Numbers
  { fr: 'aujourd\'hui', en: ['today'], phonetic: 'o.ʒuʁ.dɥi', pos: 'adverb' },
  { fr: 'demain', en: ['tomorrow'], phonetic: 'də.mɛ̃', pos: 'adverb' },
  { fr: 'hier', en: ['yesterday'], phonetic: 'jɛʁ', pos: 'adverb' },
  { fr: 'matin', en: ['morning'], phonetic: 'ma.tɛ̃', pos: 'noun', gender: 'm' },
  { fr: 'après-midi', en: ['afternoon'], phonetic: 'a.pʁɛ.mi.di', pos: 'noun', gender: 'm' },
  { fr: 'soir', en: ['evening'], phonetic: 'swaʁ', pos: 'noun', gender: 'm' },
  { fr: 'nuit', en: ['night'], phonetic: 'nɥi', pos: 'noun', gender: 'f' },
  { fr: 'heure', en: ['hour', 'time', 'o\'clock'], phonetic: 'œʁ', pos: 'noun', gender: 'f' },
  { fr: 'minute', en: ['minute'], phonetic: 'mi.nyt', pos: 'noun', gender: 'f' },
  { fr: 'semaine', en: ['week'], phonetic: 'sə.mɛn', pos: 'noun', gender: 'f' },
  { fr: 'mois', en: ['month'], phonetic: 'mwa', pos: 'noun', gender: 'm' },
  { fr: 'année', en: ['year'], phonetic: 'a.ne', pos: 'noun', gender: 'f' },
  { fr: 'un', en: ['one', '1', 'a', 'an'], phonetic: 'œ̃', pos: 'number' },
  { fr: 'deux', en: ['two', '2'], phonetic: 'dø', pos: 'number' },
  { fr: 'trois', en: ['three', '3'], phonetic: 'tʁwa', pos: 'number' },
  { fr: 'quatre', en: ['four', '4'], phonetic: 'katʁ', pos: 'number' },
  { fr: 'cinq', en: ['five', '5'], phonetic: 'sɛ̃k', pos: 'number' },
  { fr: 'six', en: ['six', '6'], phonetic: 'sis', pos: 'number' },
  { fr: 'sept', en: ['seven', '7'], phonetic: 'sɛt', pos: 'number' },
  { fr: 'huit', en: ['eight', '8'], phonetic: 'ɥit', pos: 'number' },
  { fr: 'neuf', en: ['nine', '9'], phonetic: 'nœf', pos: 'number' },
  { fr: 'dix', en: ['ten', '10'], phonetic: 'dis', pos: 'number' },
  { fr: 'vingt', en: ['twenty', '20'], phonetic: 'vɛ̃', pos: 'number' },
  { fr: 'trente', en: ['thirty', '30'], phonetic: 'tʁɑ̃t', pos: 'number' },
  { fr: 'quarante', en: ['forty', '40'], phonetic: 'ka.ʁɑ̃t', pos: 'number' },
  { fr: 'cinquante', en: ['fifty', '50'], phonetic: 'sɛ̃.kɑ̃t', pos: 'number' },
  { fr: 'cent', en: ['hundred', '100'], phonetic: 'sɑ̃', pos: 'number' },
  { fr: 'mille', en: ['thousand', '1000'], phonetic: 'mil', pos: 'number' },

  // Common Adjectives & Descriptors
  { fr: 'bon', en: ['good', 'nice'], phonetic: 'bɔ̃', pos: 'adjective' },
  { fr: 'mauvais', en: ['bad'], phonetic: 'mo.vɛ', pos: 'adjective' },
  { fr: 'grand', en: ['big', 'tall', 'large'], phonetic: 'ɡʁɑ̃', pos: 'adjective' },
  { fr: 'petit', en: ['small', 'little', 'short'], phonetic: 'pə.ti', pos: 'adjective' },
  { fr: 'nouveau', en: ['new'], phonetic: 'nu.vo', pos: 'adjective' },
  { fr: 'facile', en: ['easy'], phonetic: 'fa.sil', pos: 'adjective' },
  { fr: 'difficile', en: ['difficult', 'hard'], phonetic: 'di.fi.sil', pos: 'adjective' },
  { fr: 'rapide', en: ['fast', 'quick'], phonetic: 'ʁa.pid', pos: 'adjective' },
  { fr: 'lent', en: ['slow'], phonetic: 'lɑ̃', pos: 'adjective' },
  { fr: 'cher', en: ['expensive'], phonetic: 'ʃɛʁ', pos: 'adjective' },
  { fr: 'important', en: ['important'], phonetic: 'ɛ̃.pɔʁ.tɑ̃', pos: 'adjective' },
  { fr: 'prêt', en: ['ready'], phonetic: 'pʁɛ', pos: 'adjective' },
  { fr: 'disponible', en: ['available'], phonetic: 'dis.pɔ.nibl', pos: 'adjective' },
  { fr: 'fatigué', en: ['tired'], phonetic: 'fa.ti.ɡe', pos: 'adjective' },
  { fr: 'chaud', en: ['hot', 'warm'], phonetic: 'ʃo', pos: 'adjective' },
  { fr: 'froid', en: ['cold'], phonetic: 'fʁwa', pos: 'adjective' },

  // People & Family
  { fr: 'ami', en: ['friend'], phonetic: 'a.mi', pos: 'noun', gender: 'm' },
  { fr: 'homme', en: ['man'], phonetic: 'ɔm', pos: 'noun', gender: 'm' },
  { fr: 'femme', en: ['woman', 'wife'], phonetic: 'fam', pos: 'noun', gender: 'f' },
  { fr: 'enfant', en: ['child', 'kid'], phonetic: 'ɑ̃.fɑ̃', pos: 'noun', gender: 'm' },
  { fr: 'famille', en: ['family'], phonetic: 'fa.mij', pos: 'noun', gender: 'f' },
  { fr: 'père', en: ['father', 'dad'], phonetic: 'pɛʁ', pos: 'noun', gender: 'm' },
  { fr: 'mère', en: ['mother', 'mom'], phonetic: 'mɛʁ', pos: 'noun', gender: 'f' },

  // Daily Objects, Essentials & Life
  { fr: 'argent', en: ['money', 'silver', 'cash'], phonetic: 'aʁ.ʒɑ̃', pos: 'noun', gender: 'm' },
  { fr: 'sac', en: ['bag'], phonetic: 'sak', pos: 'noun', gender: 'm' },
  { fr: 'valise', en: ['suitcase', 'luggage'], phonetic: 'va.liz', pos: 'noun', gender: 'f' },
  { fr: 'porte', en: ['door'], phonetic: 'pɔʁt', pos: 'noun', gender: 'f' },
  { fr: 'maison', en: ['house', 'home'], phonetic: 'mɛ.zɔ̃', pos: 'noun', gender: 'f' },
  { fr: 'ville', en: ['city', 'town'], phonetic: 'vil', pos: 'noun', gender: 'f' },
  { fr: 'pays', en: ['country'], phonetic: 'pe.i', pos: 'noun', gender: 'm' },
  { fr: 'langue', en: ['language', 'tongue'], phonetic: 'lɑ̃ɡ', pos: 'noun', gender: 'f' },
  { fr: 'monde', en: ['world'], phonetic: 'mɔ̃d', pos: 'noun', gender: 'm' },
  { fr: 'voiture', en: ['car'], phonetic: 'vwa.tyʁ', pos: 'noun', gender: 'f' },
  { fr: 'problème', en: ['problem', 'issue'], phonetic: 'pʁɔ.blɛm', pos: 'noun', gender: 'm' },
  { fr: 'solution', en: ['solution'], phonetic: 'sɔ.ly.sjɔ̃', pos: 'noun', gender: 'f' },
  { fr: 'aide', en: ['help', 'assistance'], phonetic: 'ɛd', pos: 'noun', gender: 'f' },
  { fr: 'chose', en: ['thing'], phonetic: 'ʃoz', pos: 'noun', gender: 'f' },
  { fr: 'livre', en: ['book'], phonetic: 'livʁ', pos: 'noun', gender: 'm' },
  { fr: 'papier', en: ['paper'], phonetic: 'pa.pje', pos: 'noun', gender: 'm' },
  { fr: 'prix', en: ['price', 'cost'], phonetic: 'pʁi', pos: 'noun', gender: 'm' },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '');
}

export const offlineTranslationService = {
  /**
   * Search offline database bi-directionally
   */
  translate(input: string, sourceLang: 'en' | 'fr'): TranslationResult {
    const cleanQuery = input.trim();
    const norm = normalize(cleanQuery);
    const targetLang = sourceLang === 'en' ? 'fr' : 'en';

    if (!cleanQuery) {
      return {
        sourceText: input,
        translatedText: '',
        sourceLang,
        targetLang,
        matchType: 'exact_dictionary',
      };
    }

    // 1. Direct Exact Match in Lexicon
    if (sourceLang === 'en') {
      const match = OFFLINE_LEXICON.find(e => 
        e.en.some(alias => normalize(alias) === norm)
      );
      if (match) {
        return {
          sourceText: cleanQuery,
          translatedText: match.fr,
          sourceLang: 'en',
          targetLang: 'fr',
          phonetic: match.phonetic,
          partOfSpeech: match.pos,
          gender: match.gender,
          exampleFr: match.exampleFr,
          exampleEn: match.exampleEn,
          matchType: 'exact_dictionary',
        };
      }
    } else {
      const match = OFFLINE_LEXICON.find(e => normalize(e.fr) === norm);
      if (match) {
        return {
          sourceText: cleanQuery,
          translatedText: match.en[0],
          sourceLang: 'fr',
          targetLang: 'en',
          phonetic: match.phonetic,
          partOfSpeech: match.pos,
          gender: match.gender,
          exampleFr: match.exampleFr,
          exampleEn: match.exampleEn,
          matchType: 'exact_dictionary',
        };
      }
    }

    // 2. Exact glossary (phrasebook) entry. Only whole phrases match here:
    // substring matching used to hijack sentences and answer with a single
    // unrelated word, which is why multi-word input produced nonsense.
    if (sourceLang === 'fr') {
      const gEntry = FRENCH_QUICK_GLOSSARY[norm];
      if (gEntry) {
        return {
          sourceText: cleanQuery,
          translatedText: gEntry.translation,
          sourceLang: 'fr',
          targetLang: 'en',
          phonetic: gEntry.phonetic,
          partOfSpeech: gEntry.partOfSpeech,
          gender: gEntry.gender,
          matchType: 'exact_dictionary',
        };
      }
    } else {
      const gMatch = Object.entries(FRENCH_QUICK_GLOSSARY).find(
        ([, gEntry]) => normalize(gEntry.translation) === norm
      );
      if (gMatch) {
        const [frKey, gEntry] = gMatch;
        return {
          sourceText: cleanQuery,
          translatedText: frKey,
          sourceLang: 'en',
          targetLang: 'fr',
          phonetic: gEntry.phonetic,
          partOfSpeech: gEntry.partOfSpeech,
          gender: gEntry.gender,
          matchType: 'exact_dictionary',
        };
      }
    }

    // 3. Fallback when not found offline
    return {
      sourceText: cleanQuery,
      translatedText: sourceLang === 'en'
        ? `[Dictionnaire hors-ligne] Mot "${cleanQuery}" non indexé`
        : `[Offline dictionary] Word "${cleanQuery}" not indexed`,
      sourceLang,
      targetLang,
      notes: sourceLang === 'en'
        ? 'Astuce : essayez un mot plus simple ou activez l\'IA dans Profil.'
        : 'Tip: try a simpler word or enable AI in Profile.',
      matchType: 'pattern',
    };
  },

  /**
   * Machine translation for full sentences, used only when the offline
   * dictionary has no exact entry. Results are cached like AI output.
   */
  async translateOnline(input: string, sourceLang: 'en' | 'fr'): Promise<TranslationResult | null> {
    const query = input.trim();
    const targetLang = sourceLang === 'en' ? 'fr' : 'en';
    if (!query) return null;

    const cacheKey = `${query.toLowerCase()}::${sourceLang}->${targetLang}`;
    const cached = sharedContentCache.get(cacheKey, sourceLang, targetLang, 'translation');
    if (cached) {
      try {
        return { ...(JSON.parse(cached) as TranslationResult), matchType: 'online_api' };
      } catch {
        // Corrupted entry — fall through to the network
      }
    }

    try {
      // Prefer the Worker proxy when configured: it holds the provider key
      // server-side and falls back to MyMemory itself.
      const proxyUrl = (import.meta.env.VITE_TRANSLATE_PROXY_URL as string | undefined)?.trim();
      if (proxyUrl) {
        try {
          const res = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: query, source: sourceLang, target: targetLang }),
          });
          if (res.ok) {
            const payload = (await res.json()) as { translatedText?: string };
            const translated = payload.translatedText?.trim();
            if (translated) {
              const result: TranslationResult = {
                sourceText: query,
                translatedText: translated,
                sourceLang,
                targetLang,
                notes: 'Machine translation — verify before relying on it.',
                matchType: 'online_api',
              };
              sharedContentCache.set(cacheKey, sourceLang, targetLang, 'translation', JSON.stringify(result), 1440);
              return result;
            }
          }
        } catch {
          // Proxy unreachable — fall through to the direct provider
        }
      }

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${sourceLang}|${targetLang}`;
      const res = await fetch(url);
      if (!res.ok) return null;

      const json = await res.json();
      const translated =
        typeof json?.responseData?.translatedText === 'string'
          ? json.responseData.translatedText.trim()
          : '';

      if (!translated || /^MYMEMORY WARNING/i.test(translated)) return null;

      const result: TranslationResult = {
        sourceText: query,
        translatedText: translated,
        sourceLang,
        targetLang,
        notes: 'Machine translation — verify before relying on it.',
        matchType: 'online_api',
      };

      sharedContentCache.set(cacheKey, sourceLang, targetLang, 'translation', JSON.stringify(result), 1440);
      return result;
    } catch {
      return null;
    }
  },

  // ── History management ───────────────────────────────────────
  getHistory(): TranslationHistoryItem[] {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as TranslationHistoryItem[];
    } catch {}
    return [];
  },

  addToHistory(item: TranslationResult): TranslationHistoryItem {
    const list = this.getHistory();
    const newItem: TranslationHistoryItem = {
      ...item,
      id: `th_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStarred: false,
    };
    // Prepend and keep latest 50
    const updated = [newItem, ...list.filter(x => x.sourceText.toLowerCase() !== item.sourceText.toLowerCase())].slice(0, 50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  },

  toggleStar(id: string): TranslationHistoryItem[] {
    const list = this.getHistory();
    const updated = list.map(item => item.id === id ? { ...item, isStarred: !item.isStarred } : item);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  clearHistory(): void {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  },
};
