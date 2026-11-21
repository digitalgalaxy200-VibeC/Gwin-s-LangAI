export interface WordGlossaryEntry {
  word: string;
  normalized: string;
  translation: string;
  partOfSpeech: string;
  phonetic?: string;
  gender?: 'm' | 'f';
}

export const FRENCH_QUICK_GLOSSARY: Record<string, WordGlossaryEntry> = {
  // Common verbs & conjugations
  'vous': { word: 'vous', normalized: 'vous', translation: 'you (formal / plural)', partOfSpeech: 'pronoun', phonetic: 'vu' },
  'avez': { word: 'avez', normalized: 'avoir', translation: 'have (from "avoir")', partOfSpeech: 'verb', phonetic: 'a.ve' },
  'fait': { word: 'fait', normalized: 'faire', translation: 'done / made (from "faire")', partOfSpeech: 'verb', phonetic: 'fɛ' },
  'fais': { word: 'fais', normalized: 'faire', translation: 'do / make (from "faire")', partOfSpeech: 'verb', phonetic: 'fɛ' },
  'suis': { word: 'suis', normalized: 'être', translation: 'am (from "être")', partOfSpeech: 'verb', phonetic: 'sɥi' },
  'êtes': { word: 'êtes', normalized: 'être', translation: 'are (from "être")', partOfSpeech: 'verb', phonetic: 'ɛt' },
  'ai': { word: 'ai', normalized: 'avoir', translation: 'have (from "avoir")', partOfSpeech: 'verb', phonetic: 'e' },
  'voudrais': { word: 'voudrais', normalized: 'vouloir', translation: 'would like (from "vouloir")', partOfSpeech: 'verb', phonetic: 'vu.dʁɛ' },
  'vais': { word: 'vais', normalized: 'aller', translation: 'am going (from "aller")', partOfSpeech: 'verb', phonetic: 'vɛ' },
  'travailler': { word: 'travailler', normalized: 'travailler', translation: 'to work', partOfSpeech: 'verb', phonetic: 'tʁa.va.je' },
  'parler': { word: 'parler', normalized: 'parler', translation: 'to speak', partOfSpeech: 'verb', phonetic: 'paʁ.le' },
  'commence': { word: 'commence', normalized: 'commencer', translation: 'start / begin', partOfSpeech: 'verb', phonetic: 'kɔ.mɑ̃s' },
  'voit': { word: 'voit', normalized: 'voir', translation: 'see (from "voir")', partOfSpeech: 'verb', phonetic: 'vwa' },
  'coûte': { word: 'coûte', normalized: 'coûter', translation: 'costs', partOfSpeech: 'verb', phonetic: 'kut' },
  'appelle': { word: 'appelle', normalized: 'appeler', translation: 'call / am calling', partOfSpeech: 'verb', phonetic: 'a.pɛl' },
  'pouvez': { word: 'pouvez', normalized: 'pouvoir', translation: 'can / are able to', partOfSpeech: 'verb', phonetic: 'pu.ve' },
  'faire': { word: 'faire', normalized: 'faire', translation: 'to do / to make', partOfSpeech: 'verb', phonetic: 'fɛʁ' },
  'prends': { word: 'prends', normalized: 'prendre', translation: 'take (from "prendre")', partOfSpeech: 'verb', phonetic: 'pʁɑ̃' },
  'sera': { word: 'sera', normalized: 'être', translation: 'will be (from "être")', partOfSpeech: 'verb', phonetic: 'sə.ʁa' },

  // Nouns
  'travail': { word: 'travail', normalized: 'travail', translation: 'work / job', partOfSpeech: 'noun', gender: 'm', phonetic: 'tʁa.vaj' },
  'matin': { word: 'matin', normalized: 'matin', translation: 'morning', partOfSpeech: 'noun', gender: 'm', phonetic: 'ma.tɛ̃' },
  'après-midi': { word: 'après-midi', normalized: 'après-midi', translation: 'afternoon', partOfSpeech: 'noun', gender: 'm', phonetic: 'a.pʁɛ.mi.di' },
  'bureau': { word: 'bureau', normalized: 'bureau', translation: 'office / desk', partOfSpeech: 'noun', gender: 'm', phonetic: 'by.ʁo' },
  'réunion': { word: 'réunion', normalized: 'réunion', translation: 'meeting', partOfSpeech: 'noun', gender: 'f', phonetic: 'ʁe.y.njɔ̃' },
  'minutes': { word: 'minutes', normalized: 'minute', translation: 'minutes', partOfSpeech: 'noun', gender: 'f', phonetic: 'mi.nyt' },
  'prix': { word: 'prix', normalized: 'prix', translation: 'price', partOfSpeech: 'noun', gender: 'm', phonetic: 'pʁi' },
  'pommes': { word: 'pommes', normalized: 'pomme', translation: 'apples', partOfSpeech: 'noun', gender: 'f', phonetic: 'pɔm' },
  'mangues': { word: 'mangues', normalized: 'mangue', translation: 'mangoes', partOfSpeech: 'noun', gender: 'f', phonetic: 'mɑ̃ɡ' },
  'kilo': { word: 'kilo', normalized: 'kilo', translation: 'kilogram', partOfSpeech: 'noun', gender: 'm', phonetic: 'ki.lo' },
  'responsable': { word: 'responsable', normalized: 'responsable', translation: 'manager / person in charge', partOfSpeech: 'noun', phonetic: 'ʁɛs.pɔ̃.sabl' },
  'addition': { word: 'addition', normalized: 'addition', translation: 'the bill / check', partOfSpeech: 'noun', gender: 'f', phonetic: 'a.di.sjɔ̃' },
  'plat': { word: 'plat', normalized: 'plat', translation: 'dish / course', partOfSpeech: 'noun', gender: 'm', phonetic: 'pla' },
  'jour': { word: 'jour', normalized: 'jour', translation: 'day', partOfSpeech: 'noun', gender: 'm', phonetic: 'ʒuʁ' },
  'verre': { word: 'verre', normalized: 'verre', translation: 'glass', partOfSpeech: 'noun', gender: 'm', phonetic: 'vɛʁ' },
  'eau': { word: 'eau', normalized: 'eau', translation: 'water', partOfSpeech: 'noun', gender: 'f', phonetic: 'o' },
  'chambre': { word: 'chambre', normalized: 'chambre', translation: 'room', partOfSpeech: 'noun', gender: 'f', phonetic: 'ʃɑ̃bʁ' },
  'réservation': { word: 'réservation', normalized: 'réservation', translation: 'reservation / booking', partOfSpeech: 'noun', gender: 'f', phonetic: 'ʁe.zɛʁ.va.sjɔ̃' },
  'je': { word: 'je', normalized: 'je', translation: 'I', partOfSpeech: 'pronoun', phonetic: 'ʒə' },
  'nouveau': { word: 'nouveau', normalized: 'nouveau', translation: 'new', partOfSpeech: 'adjective', phonetic: 'nu.vo' },
  'étranger': { word: 'étranger', normalized: 'étranger', translation: 'foreigner / from abroad', partOfSpeech: 'noun/adj', phonetic: 'e.tʁɑ̃.ʒe' },
  'madame': { word: 'madame', normalized: 'madame', translation: 'ma’am / Mrs.', partOfSpeech: 'noun', phonetic: 'ma.dam' },
  'monsieur': { word: 'monsieur', normalized: 'monsieur', translation: 'sir / Mr.', partOfSpeech: 'noun', phonetic: 'mə.sjø' },
  'pardon': { word: 'pardon', normalized: 'pardon', translation: 'sorry / excuse me', partOfSpeech: 'expression', phonetic: 'paʁ.dɔ̃' },
  'aidez-moi': { word: 'aidez-moi', normalized: 'aider', translation: 'help me', partOfSpeech: 'verb', phonetic: 'e.de mwa' },
  'parle': { word: 'parle', normalized: 'parler', translation: 'speak', partOfSpeech: 'verb', phonetic: 'paʁl' },
  'anglais': { word: 'anglais', normalized: 'anglais', translation: 'English', partOfSpeech: 'noun/adj', phonetic: 'ɑ̃.ɡlɛ' },
  'français': { word: 'français', normalized: 'français', translation: 'French', partOfSpeech: 'noun/adj', phonetic: 'fʁɑ̃.sɛ' },
  'comprends': { word: 'comprends', normalized: 'comprendre', translation: 'understand', partOfSpeech: 'verb', phonetic: 'kɔ̃.pʁɑ̃' },
  'lentement': { word: 'lentement', normalized: 'lentement', translation: 'slowly', partOfSpeech: 'adverb', phonetic: 'lɑ̃t.mɑ̃' },
  'répéter': { word: 'répéter', normalized: 'répéter', translation: 'to repeat', partOfSpeech: 'verb', phonetic: 'ʁe.pe.te' },
  'où': { word: 'où', normalized: 'où', translation: 'where', partOfSpeech: 'adverb', phonetic: 'u' },
  'est': { word: 'est', normalized: 'être', translation: 'is', partOfSpeech: 'verb', phonetic: 'ɛ' },
  'sont': { word: 'sont', normalized: 'être', translation: 'are', partOfSpeech: 'verb', phonetic: 'sɔ̃' },
  'ici': { word: 'ici', normalized: 'ici', translation: 'here', partOfSpeech: 'adverb', phonetic: 'i.si' },
  'hôtel': { word: 'hôtel', normalized: 'hôtel', translation: 'hotel', partOfSpeech: 'noun', gender: 'm', phonetic: 'o.tɛl' },
  'taxi': { word: 'taxi', normalized: 'taxi', translation: 'taxi / cab', partOfSpeech: 'noun', gender: 'm', phonetic: 'tak.si' },
  'besoin': { word: 'besoin', normalized: 'besoin', translation: 'need', partOfSpeech: 'noun', gender: 'm', phonetic: 'bə.zwɛ̃' },
  'payer': { word: 'payer', normalized: 'payer', translation: 'to pay', partOfSpeech: 'verb', phonetic: 'pe.je' },
  'carte': { word: 'carte', normalized: 'carte', translation: 'card (credit card)', partOfSpeech: 'noun', gender: 'f', phonetic: 'kaʁt' },
  'près': { word: 'près', normalized: 'près', translation: 'near / close', partOfSpeech: 'preposition', phonetic: 'pʁɛ' },
  'gare': { word: 'gare', normalized: 'gare', translation: 'train station', partOfSpeech: 'noun', gender: 'f', phonetic: 'ɡaʁ' },
  'toilettes': { word: 'toilettes', normalized: 'toilettes', translation: 'restrooms / toilets', partOfSpeech: 'noun', gender: 'f', phonetic: 'twa.lɛt' },
  'sujet': { word: 'sujet', normalized: 'sujet', translation: 'subject / matter', partOfSpeech: 'noun', gender: 'm', phonetic: 'sy.ʒɛ' },
  'aide': { word: 'aide', normalized: 'aide', translation: 'help / assistance', partOfSpeech: 'noun', gender: 'f', phonetic: 'ɛd' },
  'professionnalisme': { word: 'professionnalisme', normalized: 'professionnalisme', translation: 'professionalism', partOfSpeech: 'noun', gender: 'm', phonetic: 'pʁɔ.fɛ.sjɔ.na.lism' },
  'réactivité': { word: 'réactivité', normalized: 'réactivité', translation: 'responsiveness / promptness', partOfSpeech: 'noun', gender: 'f', phonetic: 'ʁe.ak.ti.vi.te' },
  'projet': { word: 'projet', normalized: 'projet', translation: 'project', partOfSpeech: 'noun', gender: 'm', phonetic: 'pʁɔ.ʒɛ' },
  'dossier': { word: 'dossier', normalized: 'dossier', translation: 'folder / file', partOfSpeech: 'noun', gender: 'm', phonetic: 'do.sje' },

  // Adjectives & Adverbs
  'très': { word: 'très', normalized: 'très', translation: 'very', partOfSpeech: 'adverb', phonetic: 'tʁɛ' },
  'bon': { word: 'bon', normalized: 'bon', translation: 'good', partOfSpeech: 'adjective', gender: 'm', phonetic: 'bɔ̃' },
  'remarquable': { word: 'remarquable', normalized: 'remarquable', translation: 'remarkable', partOfSpeech: 'adjective', phonetic: 'ʁə.maʁ.kabl' },
  'beaucoup': { word: 'beaucoup', normalized: 'beaucoup', translation: 'much / a lot', partOfSpeech: 'adverb', phonetic: 'bo.ku' },
  'précieuse': { word: 'précieuse', normalized: 'précieux', translation: 'precious / valuable', partOfSpeech: 'adjective', gender: 'f', phonetic: 'pʁe.sjøz' },
  'tôt': { word: 'tôt', normalized: 'tôt', translation: 'early', partOfSpeech: 'adverb', phonetic: 'to' },
  'combien': { word: 'combien', normalized: 'combien', translation: 'how much / how many', partOfSpeech: 'adverb', phonetic: 'kɔ̃.bjɛ̃' },
  'total': { word: 'total', normalized: 'total', translation: 'total', partOfSpeech: 'noun/adj', phonetic: 'tɔ.tal' },
  'petit': { word: 'petit', normalized: 'petit', translation: 'small', partOfSpeech: 'adjective', gender: 'm', phonetic: 'pə.ti' },
  'trois': { word: 'trois', normalized: 'trois', translation: 'three', partOfSpeech: 'numeral', phonetic: 'tʁwa' },
  'dix': { word: 'dix', normalized: 'dix', translation: 'ten', partOfSpeech: 'numeral', phonetic: 'dis' },
  'demain': { word: 'demain', normalized: 'demain', translation: 'tomorrow', partOfSpeech: 'adverb', phonetic: 'də.mɛ̃' },
  'hier': { word: 'hier', normalized: 'hier', translation: 'yesterday', partOfSpeech: 'adverb', phonetic: 'jɛʁ' },
  'aujourd’hui': { word: 'aujourd’hui', normalized: 'aujourd’hui', translation: 'today', partOfSpeech: 'adverb', phonetic: 'o.ʒuʁ.dɥi' },
  'ravi': { word: 'ravi', normalized: 'ravi', translation: 'delighted / glad', partOfSpeech: 'adjective', phonetic: 'ʁa.vi' },
  'ponctuel': { word: 'ponctuel', normalized: 'ponctuel', translation: 'punctual', partOfSpeech: 'adjective', phonetic: 'pɔ̃k.tɥɛl' },

  // Prepositions, Articles & Expressions
  'du': { word: 'du', normalized: 'du', translation: 'some / of the', partOfSpeech: 'partitive article', phonetic: 'dy' },
  'de': { word: 'de', normalized: 'de', translation: 'of / from', partOfSpeech: 'preposition', phonetic: 'də' },
  'le': { word: 'le', normalized: 'le', translation: 'the (masculine)', partOfSpeech: 'article', phonetic: 'lə' },
  'la': { word: 'la', normalized: 'la', translation: 'the (feminine)', partOfSpeech: 'article', phonetic: 'la' },
  'les': { word: 'les', normalized: 'les', translation: 'the (plural)', partOfSpeech: 'article', phonetic: 'le' },
  'un': { word: 'un', normalized: 'un', translation: 'a / an (masculine)', partOfSpeech: 'article', phonetic: 'œ̃' },
  'une': { word: 'une', normalized: 'une', translation: 'a / an (feminine)', partOfSpeech: 'article', phonetic: 'yn' },
  'ce': { word: 'ce', normalized: 'ce', translation: 'this / that', partOfSpeech: 'demonstrative', phonetic: 'sə' },
  'cet': { word: 'cet', normalized: 'cet', translation: 'this / that (before vowel)', partOfSpeech: 'demonstrative', phonetic: 'sɛt' },
  'ces': { word: 'ces', normalized: 'ces', translation: 'these / those', partOfSpeech: 'demonstrative', phonetic: 'se' },
  'avec': { word: 'avec', normalized: 'avec', translation: 'with', partOfSpeech: 'preposition', phonetic: 'a.vɛk' },
  'pour': { word: 'pour', normalized: 'pour', translation: 'for', partOfSpeech: 'preposition', phonetic: 'puʁ' },
  'dans': { word: 'dans', normalized: 'dans', translation: 'in / within', partOfSpeech: 'preposition', phonetic: 'dɑ̃' },
  'au': { word: 'au', normalized: 'au', translation: 'at the / to the', partOfSpeech: 'contracted prep', phonetic: 'o' },
  'sur': { word: 'sur', normalized: 'sur', translation: 'on / upon', partOfSpeech: 'preposition', phonetic: 'syʁ' },
  's’il': { word: 's’il', normalized: 'si', translation: 'if he / if it', partOfSpeech: 'conjunction', phonetic: 'sil' },
  'plaît': { word: 'plaît', normalized: 'plaire', translation: 'pleases (s’il vous plaît = please)', partOfSpeech: 'verb', phonetic: 'plɛ' },
  'bonjour': { word: 'bonjour', normalized: 'bonjour', translation: 'hello / good morning', partOfSpeech: 'expression', phonetic: 'bɔ̃.ʒuʁ' },
  'merci': { word: 'merci', normalized: 'merci', translation: 'thank you', partOfSpeech: 'expression', phonetic: 'mɛʁ.si' },
};

export function lookupFrenchWord(rawWord: string): WordGlossaryEntry {
  const clean = rawWord
    .toLowerCase()
    .replace(/[.,!?;:"()«»']/g, '')
    .trim();

  if (FRENCH_QUICK_GLOSSARY[clean]) {
    return FRENCH_QUICK_GLOSSARY[clean];
  }

  // Handle elisions: l'addition, d'eau, j'ai, s'il
  if (rawWord.toLowerCase().startsWith("l'") || rawWord.toLowerCase().startsWith("l’")) {
    const sub = clean.slice(1);
    if (FRENCH_QUICK_GLOSSARY[sub]) return FRENCH_QUICK_GLOSSARY[sub];
  }
  if (rawWord.toLowerCase().startsWith("j'") || rawWord.toLowerCase().startsWith("j’")) {
    const sub = clean.slice(1);
    if (FRENCH_QUICK_GLOSSARY[sub]) return FRENCH_QUICK_GLOSSARY[sub];
  }
  if (rawWord.toLowerCase().startsWith("d'") || rawWord.toLowerCase().startsWith("d’")) {
    const sub = clean.slice(1);
    if (FRENCH_QUICK_GLOSSARY[sub]) return FRENCH_QUICK_GLOSSARY[sub];
  }

  return {
    word: rawWord,
    normalized: clean,
    translation: 'Tap word to listen pronunciation',
    partOfSpeech: 'French word',
  };
}
