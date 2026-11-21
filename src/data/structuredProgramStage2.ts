import type { StructuredUnit } from './structuredProgram';

// ============================================================
// STAGE 2 — FUNCTIONAL (Weeks 5–10)
// Track A: Foundations (Grammar, structures, recovery)
// Track B: Scenarios (Work, phone, meetings, pitches, logistics)
// ============================================================

// ── UNIT 7: Near Future Tense (Je vais + infinitive) ────────
export const unit7: StructuredUnit = {
  id: 'unit_7',
  unitNumber: 7,
  title: 'Near Future Tense',
  subtitle: 'Je vais + infinitive: speak about tomorrow and plans',
  icon: '🚀',
  stage: 'functional',
  track: 'A',
  estimatedMinutes: 40,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Review these foundation verbs. Say each aloud before revealing.',
      reviewItems: [
        { french: 'je vais', english: 'I am going / I will' },
        { french: 'on va', english: 'we are going / let\'s' },
        { french: 'vous allez', english: 'you are going (formal/plural)' },
        { french: 'travailler', english: 'to work' },
        { french: 'commencer', english: 'to begin / start' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Listen to the near future constructions. "Aller" + infinitive expresses what will happen soon.',
      words: [
        { french: 'je vais faire', phonetic: 'ʒə vɛ fɛʁ', english: 'I am going to do / make', partOfSpeech: 'verb phrase' },
        { french: 'on va voir', phonetic: 'ɔ̃ va vwaʁ', english: 'we will see / let\'s see', partOfSpeech: 'verb phrase' },
        { french: 'vous allez recevoir', phonetic: 'vu za.le ʁə.sə.vwaʁ', english: 'you are going to receive', partOfSpeech: 'verb phrase' },
        { french: 'bientôt', phonetic: 'bjɛ̃.to', english: 'soon', partOfSpeech: 'adverb' },
        { french: 'la semaine prochaine', phonetic: 'la sə.mɛn pʁɔ.ʃɛn', english: 'next week', partOfSpeech: 'expression' },
        { french: 'ce soir', phonetic: 'sə swaʁ', english: 'this evening / tonight', partOfSpeech: 'expression' },
        { french: 'terminer', phonetic: 'tɛʁ.mi.ne', english: 'to finish', partOfSpeech: 'verb' },
        { french: 'envoyer', phonetic: 'ɑ̃.vwa.je', english: 'to send', partOfSpeech: 'verb' },
      ],
      chunks: [
        { french: 'Je vais vous envoyer le document ce soir.', phonetic: 'ʒə vɛ vu zɑ̃.vwa.je lə dɔ.ky.mɑ̃', english: 'I am going to send you the document this evening.', note: 'Essential commitment sentence in work settings.' },
        { french: 'On va commencer dans cinq minutes.', phonetic: 'ɔ̃ va kɔ.mɑ̃.se dɑ̃ sɛ̃k mi.nyt', english: 'We are going to start in five minutes.', note: 'Standard meeting announcement.' },
        { french: 'Qu\'est-ce que vous allez faire demain ?', phonetic: 'kɛs.kə vu za.le fɛʁ də.mɛ̃', english: 'What are you going to do tomorrow?', note: 'Question structure for plans.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Form the near future quickly out loud.',
      exercises: [
        { type: 'repeat', instruction: 'Repeat exactly', prompt: 'Je vais travailler demain matin.', answer: 'Je vais travailler demain matin.' },
        { type: 'choose', instruction: 'Pick "We are going to start"', prompt: '"We will start" in French is:', answer: 'On va commencer', options: ['On commence', 'On va commencer', 'On a commencé', 'On va finir'] },
        { type: 'substitute', instruction: 'Change "ce soir" to "demain"', prompt: 'Je vais envoyer l\'email ce soir.', answer: 'Je vais envoyer l\'email demain.',
          substitutePairs: [{ cue: 'ce soir → demain', answer: 'Je vais envoyer l\'email demain.' }]
        },
        { type: 'repeat', instruction: 'Repeat with good pace', prompt: 'Vous allez recevoir le rapport la semaine prochaine.', answer: 'Vous allez recevoir le rapport la semaine prochaine.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 10,
      scenario: 'Project update call with a manager. Explaining what you and the team will deliver this week.',
      instruction: 'Respond to your manager\'s questions about project timelines using the near future.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Bonjour ! Pouvez-vous me donner des nouvelles du projet ?', english: 'Hello! Can you give me an update on the project?', aiSlot: true },
        { speaker: 'you', french: 'Bonjour ! Oui, nous allons terminer la première version ce soir.', english: 'Hello! Yes, we are going to finish the first version tonight.', hint: 'Say you will finish the first version tonight.' },
        { speaker: 'app', french: 'Parfait. Et quand allez-vous faire les tests ?', english: 'Perfect. And when are you going to do the testing?', aiSlot: true },
        { speaker: 'you', french: 'On va faire les tests demain matin.', english: 'We are going to do the testing tomorrow morning.', hint: 'Say we will test tomorrow morning.' },
        { speaker: 'app', french: 'Très bien, j\'attends votre retour.', english: 'Very good, I await your feedback.', aiSlot: true },
        { speaker: 'you', french: 'Je vais vous tenir informé demain après-midi.', english: 'I am going to keep you informed tomorrow afternoon.', hint: 'Promise to keep them updated tomorrow afternoon.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Avoid common pitfalls with near future.',
      keyPoints: [
        { wrong: 'Je vais à travailler.', right: 'Je vais travailler.', explanation: 'Never put "à" between aller and the infinitive in near future.' },
        { wrong: 'On va faisons.', right: 'On va faire.', explanation: 'The second verb must ALWAYS remain in its infinitive form.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Confirm your ability to talk about upcoming actions.',
      canSayNow: [
        'Je vais [infinitive] — I am going to do something',
        'On va commencer dans cinq minutes — We will start in 5 minutes',
        'Je vais vous envoyer le fichier ce soir — I will send the file tonight',
        'La semaine prochaine / Demain — Scheduling future commitments',
      ],
      wellDoneNote: 'You now master talking about actions in the future with total confidence.',
    },
  ],
};

// ── UNIT 8: Describing Things (Adjectives & Qualities) ─────────
export const unit8: StructuredUnit = {
  id: 'unit_8',
  unitNumber: 8,
  title: 'Describing Things',
  subtitle: 'Adjectives, colours, sizes, and product qualities',
  icon: '🎨',
  stage: 'functional',
  track: 'A',
  estimatedMinutes: 40,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Say these descriptor words aloud.',
      reviewItems: [
        { french: 'bon', english: 'good (masculine)' },
        { french: 'bonne', english: 'good (feminine)' },
        { french: 'nouveau', english: 'new' },
        { french: 'important', english: 'important' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Notice where adjectives go: most go AFTER the noun, but some short common ones go BEFORE.',
      words: [
        { french: 'rapide', phonetic: 'ʁa.pid', english: 'fast / quick', partOfSpeech: 'adjective' },
        { french: 'efficace', phonetic: 'e.fi.kas', english: 'efficient / effective', partOfSpeech: 'adjective' },
        { french: 'facile', phonetic: 'fa.sil', english: 'easy', partOfSpeech: 'adjective' },
        { french: 'difficile', phonetic: 'di.fi.sil', english: 'difficult', partOfSpeech: 'adjective' },
        { french: 'intéressant', phonetic: 'ɛ̃.te.ʁɛ.sɑ̃', english: 'interesting', partOfSpeech: 'adjective' },
        { french: 'cher', phonetic: 'ʃɛʁ', english: 'expensive', partOfSpeech: 'adjective' },
        { french: 'simple', phonetic: 'sɛ̃pl', english: 'simple / straightforward', partOfSpeech: 'adjective' },
      ],
      chunks: [
        { french: 'C\'est une solution très efficace.', phonetic: 'sɛ tyn sɔ.ly.sjɔ̃ tʁɛ e.fi.kas', english: 'It is a very efficient solution.', note: 'High-value descriptor for pitches.' },
        { french: 'C\'est facile à utiliser.', phonetic: 'sɛ fa.sil a y.ti.li.ze', english: 'It is easy to use.', note: 'Every software/service description uses this.' },
        { french: 'Ce n\'est pas trop cher.', phonetic: 'sə nɛ pa tʁo ʃɛʁ', english: 'It is not too expensive.', note: 'Value proposition statement.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Quick descriptions drill.',
      exercises: [
        { type: 'choose', instruction: 'Pick "It is easy to use"', prompt: 'How do you say "It is easy to use"?', answer: 'C\'est facile à utiliser', options: ['C\'est facile à utiliser', 'C\'est difficile pour utiliser', 'C\'est rapide d\'utiliser', 'C\'est cher à utiliser'] },
        { type: 'repeat', instruction: 'Repeat clearly', prompt: 'Notre application est rapide et simple.', answer: 'Notre application est rapide et simple.' },
        { type: 'substitute', instruction: 'Change "facile" to "intéressant"', prompt: 'Le projet est facile.', answer: 'Le projet est intéressant.', substitutePairs: [{ cue: 'facile → intéressant', answer: 'Le projet est intéressant.' }] },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 10,
      scenario: 'Describing your educational app to an interested colleague.',
      instruction: 'Highlight the qualities of the tool using descriptive adjectives.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Comment trouvez-vous cette nouvelle application ?', english: 'How do you find this new app?', aiSlot: true },
        { speaker: 'you', french: 'Elle est très rapide et facile à utiliser.', english: 'It is very fast and easy to use.', hint: 'Say it is fast and easy to use.' },
        { speaker: 'app', french: 'Et pour les écoles, est-ce que c\'est cher ?', english: 'And for schools, is it expensive?', aiSlot: true },
        { speaker: 'you', french: 'Non, ce n\'est pas très cher. C\'est une solution abordable.', english: 'No, it is not very expensive. It is an affordable solution.', hint: 'Say it is not expensive and is affordable.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Adjective gender agreement.',
      keyPoints: [
        { wrong: 'Une solution très efficace ? (No change, ends in -e)', right: 'Une solution efficace / Un système efficace', explanation: 'Adjectives ending in -e don\'t change form in the feminine.' },
        { wrong: 'Une application rapide et bon.', right: 'Une application rapide et bonne.', explanation: 'Bon becomes bonne in feminine.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Confirm your descriptive vocabulary.',
      canSayNow: [
        'C\'est rapide, simple et efficace — Power description trio',
        'C\'est facile à utiliser — Universal user-friendly phrase',
        'Ce n\'est pas cher — Price qualification',
      ],
      wellDoneNote: 'You can now evaluate and present features and qualities with precision.',
    },
  ],
};

// ── UNIT 9: Phone Calls (Open, Hold, Transfer, Messages) ──────
export const unit9: StructuredUnit = {
  id: 'unit_9',
  unitNumber: 9,
  title: 'Phone Calls',
  subtitle: 'Open, hold, transfer, and leave professional messages',
  icon: '📞',
  stage: 'functional',
  track: 'B',
  estimatedMinutes: 45,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Telephone opening reflexes.',
      reviewItems: [
        { french: 'Allô ?', english: 'Hello? (only on telephone)' },
        { french: 'Je voudrais parler à...', english: 'I would like to speak to...' },
        { french: 'Ne quittez pas.', english: 'Hold the line / Please hold.' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Phrases specific to French business telephone protocol.',
      words: [
        { french: 'à l\'appareil', phonetic: 'a la.pa.ʁɛj', english: 'speaking (on the phone)', partOfSpeech: 'expression' },
        { french: 'patienter', phonetic: 'pa.sjɑ̃.te', english: 'to wait / to hold', partOfSpeech: 'verb' },
        { french: 'transférer', phonetic: 'tʁɑ̃s.fe.ʁe', english: 'to transfer', partOfSpeech: 'verb' },
        { french: 'laisser un message', phonetic: 'lɛ.se œ̃ mɛ.saʒ', english: 'to leave a message', partOfSpeech: 'phrase' },
        { french: 'rappeler', phonetic: 'ʁa.pə.le', english: 'to call back', partOfSpeech: 'verb' },
        { french: 'vos coordonnées', phonetic: 'vo kɔ.ɔʁ.dɔ.ne', english: 'your contact details', partOfSpeech: 'noun' },
      ],
      chunks: [
        { french: 'C\'est [nom] à l\'appareil.', phonetic: 'sɛ ... a la.pa.ʁɛj', english: 'This is [name] speaking.', note: 'Standard way to announce identity on phone.' },
        { french: 'Pouvez-vous lui demander de me rappeler ?', phonetic: 'pu.ve vu lɥi də.mɑ̃.de də mə ʁa.pə.le', english: 'Can you ask him/her to call me back?', note: 'Polite callback request.' },
        { french: 'Mon numéro est le...', phonetic: 'mɔ̃ ny.me.ʁo ɛ lə', english: 'My phone number is...', note: 'How to state phone numbers (grouped in pairs).' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Telephone speed drill.',
      exercises: [
        { type: 'repeat', instruction: 'Announce yourself', prompt: 'Bonjour, c\'est Paul à l\'appareil.', answer: 'Bonjour, c\'est Paul à l\'appareil.' },
        { type: 'choose', instruction: 'How to say "Hold on please"?', prompt: '"Hold the line" in professional French:', answer: 'Un instant, ne quittez pas.', options: ['Attendez là.', 'Un instant, ne quittez pas.', 'Stop parler.', 'Reviens plus tard.'] },
        { type: 'repeat', instruction: 'Request callback', prompt: 'Pouvez-vous lui demander de me rappeler au zéro six ?', answer: 'Pouvez-vous lui demander de me rappeler au zéro six ?' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Calling a partner organization in Paris to speak with the operations director.',
      instruction: 'Conduct the phone conversation smoothly.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Société Horizon, bonjour, que puis-je faire pour vous ?', english: 'Horizon company, hello, how may I help you?', aiSlot: true },
        { speaker: 'you', french: 'Bonjour, c\'est [nom] à l\'appareil. Je voudrais parler à Monsieur Dupont.', english: 'Hello, this is [name] speaking. I would like to speak to Mr. Dupont.', hint: 'State your name and ask for Mr. Dupont.' },
        { speaker: 'app', french: 'Un instant, je vous le passe... Désolé, sa ligne est occupée.', english: 'One moment, transferring you... Sorry, his line is busy.', aiSlot: true },
        { speaker: 'you', french: 'D\'accord. Est-ce que je peux lui laisser un message ?', english: 'Okay. May I leave him a message?', hint: 'Ask if you can leave a message.' },
        { speaker: 'app', french: 'Certainement, quel est votre numéro de téléphone ?', english: 'Certainly, what is your phone number?', aiSlot: true },
        { speaker: 'you', french: 'Mon numéro est le zéro un quarante-deux zéro trois.', english: 'My number is 01 42 03...', hint: 'Give your number.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Telephone French etiquette.',
      keyPoints: [
        { wrong: 'Je suis Paul sur le téléphone.', right: 'C\'est Paul à l\'appareil.', explanation: 'Always say "C\'est [nom] à l\'appareil" on the phone.' },
        { wrong: 'Rappelle-moi.', right: 'Pouvez-vous me rappeler ?', explanation: 'Keep formal "vous" in all business calls.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Review telephone essentials.',
      canSayNow: [
        'C\'est [nom] à l\'appareil — Professional phone ID',
        'Je voudrais parler à [personne] — Destination request',
        'Pouvez-vous lui demander de me rappeler ? — Callback booking',
        'Mon numéro est le... — Giving contact info',
      ],
      wellDoneNote: 'You can navigate professional phone calls without visual cues.',
    },
  ],
};

// ── UNIT 10: Work Meetings (Agenda, Opinions, Decisions) ──────
export const unit10: StructuredUnit = {
  id: 'unit_10',
  unitNumber: 10,
  title: 'Work Meetings',
  subtitle: 'Agenda, expressing opinions, agreeing, and wrapping up',
  icon: '📋',
  stage: 'functional',
  track: 'B',
  estimatedMinutes: 45,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Warm up for meeting discussions.',
      reviewItems: [
        { french: 'la réunion', english: 'the meeting' },
        { french: 'commencer', english: 'to start' },
        { french: 'd\'accord', english: 'agreed / okay' },
        { french: 'la question', english: 'the question' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Phrases to participate actively in professional meetings.',
      words: [
        { french: 'à l\'ordre du jour', phonetic: 'a lɔʁdʁ dy ʒuʁ', english: 'on the agenda', partOfSpeech: 'expression' },
        { french: 'à mon avis', phonetic: 'a mɔ̃ na.vi', english: 'in my opinion', partOfSpeech: 'phrase' },
        { french: 'je pense que', phonetic: 'ʒə pɑ̃s kə', english: 'I think that', partOfSpeech: 'phrase' },
        { french: 'je suis d\'accord', phonetic: 'ʒə sɥi da.kɔʁ', english: 'I agree', partOfSpeech: 'expression' },
        { french: 'décider', phonetic: 'de.si.de', english: 'to decide', partOfSpeech: 'verb' },
        { french: 'en résumé', phonetic: 'ɑ̃ ʁe.zy.me', english: 'in summary / to recap', partOfSpeech: 'expression' },
        { french: 'la prochaine étape', phonetic: 'la pʁɔ.ʃɛn e.tap', english: 'the next step', partOfSpeech: 'noun' },
      ],
      chunks: [
        { french: 'À mon avis, c\'est la meilleure solution.', phonetic: 'a mɔ̃ na.vi sɛ la mɛ.jœʁ sɔ.ly.sjɔ̃', english: 'In my opinion, it is the best solution.', note: 'Polite way to express conviction.' },
        { french: 'Je suis tout à fait d\'accord avec vous.', phonetic: 'ʒə sɥi tu ta fɛ da.kɔʁ a.vɛk vu', english: 'I completely agree with you.', note: 'Strong agreement signal.' },
        { french: 'Quelle est la prochaine étape ?', phonetic: 'kɛl ɛ la pʁɔ.ʃɛn e.tap', english: 'What is the next step?', note: 'Meeting action-closer.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Meeting participation drill.',
      exercises: [
        { type: 'repeat', instruction: 'Express opinion', prompt: 'Je pense que nous devons avancer rapidement.', answer: 'Je pense que nous devons avancer rapidement.' },
        { type: 'choose', instruction: 'Pick "In my opinion"', prompt: '"In my opinion" =', answer: 'À mon avis', options: ['À mon avis', 'Selon vous', 'Dans le résumé', 'Sur le papier'] },
        { type: 'repeat', instruction: 'Confirm agreement', prompt: 'Je suis d\'accord avec cette décision.', answer: 'Je suis d\'accord avec cette décision.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Participating in a strategy alignment meeting with partners.',
      instruction: 'Give your input on a proposed launch timeline.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Alors, que pensez-vous de lancer le service le mois prochain ?', english: 'So, what do you think about launching the service next month?', aiSlot: true },
        { speaker: 'you', french: 'À mon avis, c\'est un bon calendrier. L\'équipe est prête.', english: 'In my opinion, it is a good timeline. The team is ready.', hint: 'Express your opinion that it is a good timeline.' },
        { speaker: 'app', french: 'Avez-vous des réserves sur le budget ?', english: 'Do you have any reservations about the budget?', aiSlot: true },
        { speaker: 'you', french: 'Non, je suis d\'accord avec le budget proposé.', english: 'No, I agree with the proposed budget.', hint: 'Say you agree with the budget.' },
        { speaker: 'app', french: 'Parfait. Quelle est donc notre prochaine étape ?', english: 'Perfect. What is our next step then?', aiSlot: true },
        { speaker: 'you', french: 'La prochaine étape est de valider le contrat avec les partenaires.', english: 'The next step is to validate the contract with the partners.', hint: 'Say the next step is validating the partner contract.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Meeting expressions correction.',
      keyPoints: [
        { wrong: 'Je suis d\'accord que... (awkward)', right: 'Je suis d\'accord pour... / Je pense que...', explanation: 'Use "Je pense que" for opinions and "Je suis d\'accord avec" for agreeing with people/proposals.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Check meeting readiness.',
      canSayNow: [
        'À mon avis / Je pense que — Voice opinions diplomatically',
        'Je suis tout à fait d\'accord — Affirm teamwork',
        'Quelle est la prochaine étape ? — Drive actions',
      ],
      wellDoneNote: 'You have the phrases needed to contribute actively to any francophone meeting.',
    },
  ],
};

// ── UNIT 11: Explaining Your Project / Product ───────────────
export const unit11: StructuredUnit = {
  id: 'unit_11',
  unitNumber: 11,
  title: 'Explaining Your Project',
  subtitle: 'Pitch your project, describe target users, and handle Q&A',
  icon: '💡',
  stage: 'functional',
  track: 'B',
  estimatedMinutes: 45,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Warm up project presentation terms.',
      reviewItems: [
        { french: 'notre projet', english: 'our project' },
        { french: 'l\'application', english: 'the application / app' },
        { french: 'les utilisateurs', english: 'the users' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Product pitch formulation patterns.',
      words: [
        { french: 'l\'objectif', phonetic: 'lɔb.ʒɛk.tif', english: 'the objective / goal', partOfSpeech: 'noun', gender: 'm' },
        { french: 'développer', phonetic: 'de.vlɔ.pe', english: 'to develop / build', partOfSpeech: 'verb' },
        { french: 'résoudre un problème', phonetic: 'ʁe.zudʁ œ̃ pʁɔ.blɛm', english: 'to solve a problem', partOfSpeech: 'phrase' },
        { french: 'les bénéficiaires', phonetic: 'le be.ne.fi.sjɛʁ', english: 'the beneficiaries / target audience', partOfSpeech: 'noun' },
        { french: 'grâce à', phonetic: 'ɡʁas a', english: 'thanks to / via', partOfSpeech: 'preposition' },
        { french: 'améliorer', phonetic: 'a.me.ljɔ.ʁe', english: 'to improve', partOfSpeech: 'verb' },
      ],
      chunks: [
        { french: 'Notre projet s\'appelle SchoolAid.', phonetic: 'nɔtʁ pʁɔ.ʒɛ sa.pɛl...', english: 'Our project is called SchoolAid.', note: 'Opening identity sentence.' },
        { french: 'L\'objectif est d\'améliorer l\'accès à l\'éducation.', phonetic: 'lɔb.ʒɛk.tif ɛ da.me.ljɔ.ʁe...', english: 'The goal is to improve access to education.', note: 'Mission statement structure.' },
        { french: 'Grâce à notre technologie, les écoles gagnent du temps.', phonetic: 'ɡʁas a nɔtʁ tɛk.nɔ.lɔ.ʒi...', english: 'Thanks to our technology, schools save time.', note: 'Value statement.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Pitch drills.',
      exercises: [
        { type: 'repeat', instruction: 'Pitch opening', prompt: 'Notre mission est d\'aider les jeunes apprenants.', answer: 'Notre mission est d\'aider les jeunes apprenants.' },
        { type: 'choose', instruction: 'Pick "Thanks to our solution"', prompt: '"Thanks to our solution" =', answer: 'Grâce à notre solution', options: ['Pour notre solution', 'Grâce à notre solution', 'Avec faute de solution', 'Dans la solution'] },
        { type: 'repeat', instruction: 'Problem solving formula', prompt: 'Nous résolvons un problème majeur pour les familles.', answer: 'Nous résolvons un problème majeur pour les familles.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Pitching your product to a local educational director in Cotonou.',
      instruction: 'Explain what you do, who it is for, and how it works.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Pouvez-vous me présenter votre projet en deux minutes ?', english: 'Can you introduce your project to me in two minutes?', aiSlot: true },
        { speaker: 'you', french: 'Avec plaisir. Notre application aide les écoles à gérer les élèves facilement.', english: 'With pleasure. Our app helps schools manage students easily.', hint: 'Say your app helps schools manage students easily.' },
        { speaker: 'app', french: 'Qui sont vos utilisateurs principaux aujourd\'hui ?', english: 'Who are your main users today?', aiSlot: true },
        { speaker: 'you', french: 'Ce sont les directeurs d\'écoles et les enseignants.', english: 'They are school principals and teachers.', hint: 'Say school directors and teachers.' },
        { speaker: 'app', french: 'Est-ce que cela fonctionne sans connexion Internet ?', english: 'Does this work without an Internet connection?', aiSlot: true },
        { speaker: 'you', french: 'Oui, tout fonctionne hors-ligne en toute sécurité.', english: 'Yes, everything works offline completely securely.', hint: 'Assure them it works 100% offline securely.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Pitch phrasing precision.',
      keyPoints: [
        { wrong: 'Merci à notre technologie.', right: 'Grâce à notre technologie.', explanation: '"Grâce à" means "thanks to" (positive cause). "Merci à" is thanking a person.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Confirm pitch capability.',
      canSayNow: [
        'Notre projet s\'appelle... / L\'objectif est de... — Clear intro',
        'Grâce à notre solution... — Distinct value highlight',
        'Tout fonctionne hors-ligne — Standout differentiator',
      ],
      wellDoneNote: 'You can present your initiative professionally to stakeholders.',
    },
  ],
};

// ── UNIT 12: Professional Emails & Scheduling ────────────────
export const unit12: StructuredUnit = {
  id: 'unit_12',
  unitNumber: 12,
  title: 'Emails & Scheduling',
  subtitle: 'Confirming, rescheduling, polite formulas, and follow-ups',
  icon: '✉️',
  stage: 'functional',
  track: 'B',
  estimatedMinutes: 40,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Email vocabulary warmup.',
      reviewItems: [
        { french: 'le message', english: 'the message' },
        { french: 'envoyer', english: 'to send' },
        { french: 'confirmer', english: 'to confirm' },
        { french: 'reporter', english: 'to postpone / reschedule' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Common French email building blocks.',
      words: [
        { french: 'suite à', phonetic: 'sɥit a', english: 'following / further to', partOfSpeech: 'preposition' },
        { french: 'cordialement', phonetic: 'kɔʁ.djal.mɑ̃', english: 'kind regards', partOfSpeech: 'adverb' },
        { french: 'disponibilité', phonetic: 'dis.pɔ.ni.bi.li.te', english: 'availability', partOfSpeech: 'noun', gender: 'f' },
        { french: 'convenir', phonetic: 'kɔ̃v.niʁ', english: 'to suit / to be convenient', partOfSpeech: 'verb' },
        { french: 'en pièce jointe', phonetic: 'ɑ̃ pjɛs ʒwɛ̃t', english: 'attached / in attachment', partOfSpeech: 'expression' },
      ],
      chunks: [
        { french: 'Suite à notre conversation, je vous confirme notre rendez-vous.', phonetic: 'sɥit a nɔtʁ kɔ̃.vɛʁ.sa.sjɔ̃...', english: 'Following our conversation, I confirm our appointment.', note: 'Flawless confirmation opener.' },
        { french: 'Est-ce que cette date vous convient ?', phonetic: 'ɛs.kə sɛt dat vu kɔ̃.vjɛ̃', english: 'Does this date suit you?', note: 'Standard date suggestion closing.' },
        { french: 'Dans l\'attente de votre retour, cordialement.', phonetic: 'dɑ̃ la.tɑ̃t də vɔtʁ ʁə.tuʁ', english: 'Looking forward to hearing from you, regards.', note: 'Professional email sign-off.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Email formula drills.',
      exercises: [
        { type: 'repeat', instruction: 'Standard opener', prompt: 'Suite à notre échange, voici le document promis.', answer: 'Suite à notre échange, voici le document promis.' },
        { type: 'choose', instruction: 'Professional sign-off', prompt: 'Which is a standard professional email sign-off?', answer: 'Cordialement', options: ['Bisous', 'Cordialement', 'Ciao', 'Au revoir'] },
        { type: 'repeat', instruction: 'Reschedule request', prompt: 'Je souhaite reporter notre réunion à jeudi.', answer: 'Je souhaite reporter notre réunion à jeudi.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 10,
      scenario: 'You need to reschedule an appointment with a client via message.',
      instruction: 'Politely apologize and suggest an alternative slot.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Bonjour, notre rendez-vous est toujours maintenu pour demain 14h ?', english: 'Hello, is our meeting still on for tomorrow at 2 PM?', aiSlot: true },
        { speaker: 'you', french: 'Bonjour. J\'ai un imprévu, je souhaite reporter notre réunion.', english: 'Hello. I have an unforeseen issue, I wish to postpone our meeting.', hint: 'Apologize and ask to reschedule.' },
        { speaker: 'app', french: 'Je comprends. Quelles sont vos disponibilités cette semaine ?', english: 'I understand. What is your availability this week?', aiSlot: true },
        { speaker: 'you', french: 'Je suis disponible vendredi matin à dix heures. Cela vous convient ?', english: 'I am available Friday morning at 10 AM. Does that suit you?', hint: 'Suggest Friday morning at 10 AM.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Written French etiquette.',
      keyPoints: [
        { wrong: 'Bien à vous (can be slightly familiar)', right: 'Cordialement (always safe in business)', explanation: '"Cordialement" is the universal, risk-free business closing in French.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Confirm written communication competency.',
      canSayNow: [
        'Suite à notre échange... — Professional opening',
        'Est-ce que cela vous convient ? — Scheduling check',
        'Dans l\'attente de votre réponse, cordialement — Complete wrap-up',
      ],
      wellDoneNote: 'You can draft clear, courteous correspondence for everyday business.',
    },
  ],
};

// ── UNIT 13: Handling Misunderstandings & Breaking Barriers ──
export const unit13: StructuredUnit = {
  id: 'unit_13',
  unitNumber: 13,
  title: 'Handling Misunderstandings',
  subtitle: 'Recover gracefully when speech is too fast or unclear',
  icon: '🔄',
  stage: 'functional',
  track: 'A',
  estimatedMinutes: 35,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Language barrier bridge words.',
      reviewItems: [
        { french: 'pardon', english: 'excuse me / sorry' },
        { french: 'lentement', english: 'slowly' },
        { french: 'répéter', english: 'to repeat' },
        { french: 'comprendre', english: 'to understand' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'The phrases that save any conversation when native speakers talk too fast.',
      words: [
        { french: 'plus lentement', phonetic: 'ply lɑ̃t.mɑ̃', english: 'more slowly', partOfSpeech: 'adverb' },
        { french: 'qu\'est-ce que ça veut dire ?', phonetic: 'kɛs.kə sa vø diʁ', english: 'what does that mean?', partOfSpeech: 'question' },
        { french: 'comment on dit... ?', phonetic: 'kɔ.mɑ̃ ɔ̃ di', english: 'how do you say...?', partOfSpeech: 'question' },
        { french: 'si j\'ai bien compris', phonetic: 'si ʒe bjɛ̃ kɔ̃.pʁi', english: 'if I understood correctly', partOfSpeech: 'expression' },
      ],
      chunks: [
        { french: 'Excusez-moi, pouvez-vous parler un peu plus lentement ?', phonetic: 'ɛk.sky.ze mwa pu.ve vu...', english: 'Excuse me, could you speak a bit more slowly?', note: 'Your #1 survival phrase in live conversation.' },
        { french: 'Je n\'ai pas bien compris le dernier mot.', phonetic: 'ʒə ne pa bjɛ̃ kɔ̃.pʁi...', english: 'I didn\'t quite catch the last word.', note: 'Pinpoint what you missed.' },
        { french: 'Si j\'ai bien compris, nous devons terminer demain ?', phonetic: 'si ʒe bjɛ̃ kɔ̃.pʁi...', english: 'If I understood correctly, we must finish tomorrow?', note: 'Confirmation check pattern.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Recovery phrase reflex drills.',
      exercises: [
        { type: 'repeat', instruction: 'Say it smoothly', prompt: 'Pouvez-vous répéter, s\'il vous plaît ?', answer: 'Pouvez-vous répéter, s\'il vous plaît ?' },
        { type: 'choose', instruction: 'Ask what a word means', prompt: 'How do you ask "What does that mean?"', answer: 'Qu\'est-ce que ça veut dire ?', options: ['C\'est quoi le dire ?', 'Qu\'est-ce que ça veut dire ?', 'Comment dire cela ?', 'Pourquoi ça ?'] },
        { type: 'repeat', instruction: 'Pacing request', prompt: 'Parlez un peu plus lentement, s\'il vous plaît.', answer: 'Parlez un peu plus lentement, s\'il vous plaît.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 10,
      scenario: 'A native French speaker speaks rapidly about project specs. You manage the tempo.',
      instruction: 'Intervene politely to slow them down and confirm comprehension.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'AlorsonvafaireçapourlundiensuiteonvérifielesfichiersavecléquipeOK ?', english: '[Fast speech] So we will do this for Monday then check the files with the team OK?', aiSlot: true },
        { speaker: 'you', french: 'Pardon, pouvez-vous répéter un peu plus lentement ?', english: 'Excuse me, could you repeat a bit more slowly?', hint: 'Ask them politely to repeat more slowly.' },
        { speaker: 'app', french: 'Ah pardon ! Je disais : nous allons faire cela pour lundi prochain.', english: 'Ah sorry! I was saying: we will do this for next Monday.', aiSlot: true },
        { speaker: 'you', french: 'D\'accord, si j\'ai bien compris, la date limite est lundi ?', english: 'Okay, if I understood correctly, the deadline is Monday?', hint: 'Confirm the deadline is Monday.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Never pretend to understand when you don\'t.',
      keyPoints: [
        { wrong: 'Staying silent and nodding when lost.', right: 'Excusez-moi, pouvez-vous reformuler ?', explanation: 'Native speakers deeply respect learners who ask for clarification.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Confirm barrier-breaking ability.',
      canSayNow: [
        'Pouvez-vous parler plus lentement ? — Control the conversation tempo',
        'Qu\'est-ce que ça veut dire ? — Ask for definitions',
        'Si j\'ai bien compris... — Verify agreement accurately',
      ],
      wellDoneNote: 'You now possess the tools to stay in control of any conversation.',
    },
  ],
};

// ── UNIT 14: Restaurant, Hotel & Travel ──────────────────────
export const unit14: StructuredUnit = {
  id: 'unit_14',
  unitNumber: 14,
  title: 'Restaurant, Hotel & Travel',
  subtitle: 'Order food, hotel check-in, dietary needs, resolving issues',
  icon: '🏨',
  stage: 'functional',
  track: 'B',
  estimatedMinutes: 45,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Hospitality vocabulary review.',
      reviewItems: [
        { french: 'l\'addition', english: 'the bill / check' },
        { french: 'la réservation', english: 'the booking / reservation' },
        { french: 'la chambre', english: 'the room' },
        { french: 'l\'eau', english: 'water' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Dining and lodging practical formulas.',
      words: [
        { french: 'la carte', phonetic: 'la kaʁt', english: 'the menu', partOfSpeech: 'noun', gender: 'f' },
        { french: 'le plat du jour', phonetic: 'lə pla dy ʒuʁ', english: 'daily special', partOfSpeech: 'noun', gender: 'm' },
        { french: 'une carafe d\'eau', phonetic: 'yn ka.ʁaf do', english: 'a jug of tap water (free in France)', partOfSpeech: 'phrase' },
        { french: 'compris', phonetic: 'kɔ̃.pʁi', english: 'included', partOfSpeech: 'adjective' },
        { french: 'la clé', phonetic: 'la kle', english: 'the key', partOfSpeech: 'noun', gender: 'f' },
      ],
      chunks: [
        { french: 'Une table pour deux personnes, s\'il vous plaît.', phonetic: 'yn tabl puʁ dø pɛʁ.sɔn...', english: 'A table for two people, please.', note: 'Standard restaurant entry phrase.' },
        { french: 'Je voudrais commander le plat du jour.', phonetic: 'ʒə vu.dʁɛ kɔ.mɑ̃.de...', english: 'I would like to order the daily special.', note: 'Ordering formula.' },
        { french: 'J\'ai une réservation au nom de [nom].', phonetic: 'ʒe yn ʁe.zɛʁ.va.sjɔ̃ o nɔ̃ də...', english: 'I have a reservation under the name of [name].', note: 'Universal hotel check-in.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Dining and hotel drills.',
      exercises: [
        { type: 'repeat', instruction: 'Ask for the bill', prompt: 'L\'addition, s\'il vous plaît.', answer: 'L\'addition, s\'il vous plaît.' },
        { type: 'choose', instruction: 'How to ask for free tap water in France?', prompt: 'Tap water carafe in French:', answer: 'Une carafe d\'eau', options: ['Un verre chaud', 'Une carafe d\'eau', 'De l\'eau cher', 'Bouteille payante'] },
        { type: 'repeat', instruction: 'Check-in line', prompt: 'Bonjour, j\'ai une réservation pour deux nuits.', answer: 'Bonjour, j\'ai une réservation pour deux nuits.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Arriving at a hotel reception in Paris after a long flight.',
      instruction: 'Check in, get your room key, and ask about breakfast hours.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Bonsoir monsieur, bienvenue à l\'Hôtel Central. Vous avez une réservation ?', english: 'Good evening sir, welcome to Hotel Central. Do you have a reservation?', aiSlot: true },
        { speaker: 'you', french: 'Bonsoir. Oui, j\'ai une réservation au nom de [nom].', english: 'Good evening. Yes, I have a reservation under the name of [name].', hint: 'State that you have a reservation under your name.' },
        { speaker: 'app', french: 'Très bien, voici votre clé, chambre 304 au 3e étage. Le petit déjeuner est à 7h.', english: 'Very good, here is your key, room 304 on 3rd floor. Breakfast is at 7 AM.', aiSlot: true },
        { speaker: 'you', french: 'Merci beaucoup ! Est-ce que le petit-déjeuner est compris ?', english: 'Thank you very much! Is breakfast included?', hint: 'Ask if breakfast is included.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Dining terms precision.',
      keyPoints: [
        { wrong: 'Le menu (often means a set meal, not the whole card)', right: 'La carte (the full list of dishes)', explanation: 'In France, "la carte" is the document, "le menu" is often a fixed multi-course formula.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Confirm travel fluency.',
      canSayNow: [
        'Une table pour [nombre] — Enter any bistro or restaurant',
        'J\'ai une réservation au nom de... — Check into any accommodation',
        'L\'addition, s\'il vous plaît — Close meals effortlessly',
      ],
      wellDoneNote: 'You have completed Stage 2: Functional French! You can now work, travel, and navigate francophone society.',
    },
  ],
};

// ============================================================
// STAGE 3 — OPERATIONAL (Weeks 11–20) [AI Enhanced Units]
// ============================================================

export const unit15: StructuredUnit = {
  id: 'unit_15',
  unitNumber: 15,
  title: 'Passé Composé (Past Tense)',
  subtitle: 'Narrating completed past actions and past project outcomes',
  icon: '🕰️',
  stage: 'operational',
  track: 'A',
  estimatedMinutes: 50,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Past tense auxiliary warmup.',
      reviewItems: [
        { french: 'j\'ai fait', english: 'I have done / I did' },
        { french: 'j\'ai travaillé', english: 'I worked' },
        { french: 'je suis allé', english: 'I went' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'The Passé Composé: Avoir or Être + past participle.',
      words: [
        { french: 'hier', phonetic: 'jɛʁ', english: 'yesterday', partOfSpeech: 'adverb' },
        { french: 'la semaine dernière', phonetic: 'la sə.mɛn dɛʁ.njɛʁ', english: 'last week', partOfSpeech: 'expression' },
        { french: 'j\'ai parlé', phonetic: 'ʒe paʁ.le', english: 'I spoke', partOfSpeech: 'verb phrase' },
        { french: 'nous avons fini', phonetic: 'nu za.vɔ̃ fi.ni', english: 'we finished', partOfSpeech: 'verb phrase' },
      ],
      chunks: [
        { french: 'Hier, j\'ai terminé le rapport financier.', phonetic: 'jɛʁ ʒe tɛʁ.mi.ne...', english: 'Yesterday, I finished the financial report.', note: 'Past action report.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Past tense drills.',
      exercises: [
        { type: 'repeat', instruction: 'Repeat past action', prompt: 'J\'ai envoyé le message hier soir.', answer: 'J\'ai envoyé le message hier soir.' },
        { type: 'choose', instruction: 'Pick "I visited"', prompt: '"I visited" in French:', answer: 'J\'ai visité', options: ['Je visite', 'J\'ai visité', 'Je vais visiter', 'Je suis visité'] },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Reviewing last week\'s accomplishments with your team lead.',
      instruction: 'This roleplay activates dynamic AI responses when connected to DeepSeek in Phase 3.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Qu\'avez-vous accompli la semaine dernière ?', english: 'What did you accomplish last week?', aiSlot: true },
        { speaker: 'you', french: 'J\'ai rencontré trois directeurs et j\'ai finalisé les devis.', english: 'I met three directors and finalized the quotes.', hint: 'Say you met directors and finalized quotes.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Être vs Avoir in past actions.',
      keyPoints: [
        { wrong: 'J\'ai allé au bureau.', right: 'Je suis allé au bureau.', explanation: 'Movement verbs like aller, venir, arriver use ÊTRE in the past.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Past tense summary.',
      canSayNow: ['Hier, j\'ai fait... — Tell past events clearly'],
      wellDoneNote: 'You have entered Stage 3 Operational! AI live roleplay is enabled for this unit.',
    },
  ],
};

export const unit16: StructuredUnit = {
  id: 'unit_16',
  unitNumber: 16,
  title: 'Opinions & Debates',
  subtitle: 'Expressing nuance, defending proposals, handling objections',
  icon: '🗣️',
  stage: 'operational',
  track: 'B',
  estimatedMinutes: 50,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Warmup debate connectors.',
      reviewItems: [
        { french: 'mais', english: 'but' },
        { french: 'cependant', english: 'however' },
        { french: 'parce que', english: 'because' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Advanced perspective connectors.',
      words: [
        { french: 'd\'un côté', phonetic: 'dœ̃ ko.te', english: 'on one hand', partOfSpeech: 'expression' },
        { french: 'de l\'autre côté', phonetic: 'də lo.tʁə ko.te', english: 'on the other hand', partOfSpeech: 'expression' },
        { french: 'je suis convaincu', phonetic: 'ʒə sɥi kɔ̃.vɛ̃.ky', english: 'I am convinced', partOfSpeech: 'phrase' },
      ],
      chunks: [
        { french: 'C\'est une opportunité, mais il y a des risques.', phonetic: 'sɛ tyn ɔ.pɔʁ.ty.ni.te...', english: 'It is an opportunity, but there are risks.', note: 'Balanced nuance.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Persuasion drills.',
      exercises: [
        { type: 'repeat', instruction: 'State conviction', prompt: 'Je suis convaincu de la viabilité de ce modèle.', answer: 'Je suis convaincu de la viabilité de ce modèle.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Debating budget allocation with an investor or board member.',
      instruction: 'DeepSeek AI provides counterarguments dynamically in Phase 3.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Ce coût me semble élevé. Pourquoi ne pas reporter l\'embauche ?', english: 'This cost seems high. Why not postpone hiring?', aiSlot: true },
        { speaker: 'you', french: 'Parce que cette embauche va accélérer notre croissance dès le premier mois.', english: 'Because this hire will accelerate our growth from month one.', hint: 'Defend the hiring with growth impact.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Subjunctive vs indicative alert in opinions.',
      keyPoints: [
        { wrong: 'Je ne pense pas que c\'est bon (formal)', right: 'Je ne pense pas que ce soit bon', explanation: 'Negative opinion verbs trigger subjunctive in formal French.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Debate mastery review.',
      canSayNow: ['Je suis convaincu que... — Defend your strategy'],
      wellDoneNote: 'Stage 3 debate capabilities unlocked.',
    },
  ],
};

export const unit17: StructuredUnit = {
  id: 'unit_17',
  unitNumber: 17,
  title: 'Fast Listening & Accents',
  subtitle: 'Understanding rapid native speech, elisions, and African French accents',
  icon: '👂',
  stage: 'operational',
  track: 'A',
  estimatedMinutes: 50,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Phonetic contraction warmup.',
      reviewItems: [
        { french: 'J\'sais pas', english: 'I don\'t know (spoken form of "Je ne sais pas")' },
        { french: 'Y a', english: 'There is (spoken form of "Il y a")' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Real spoken contractions.',
      words: [
        { french: 'c\'est-à-dire', phonetic: 'sɛ.ta.diʁ', english: 'that is to say / meaning', partOfSpeech: 'phrase' },
        { french: 'en fait', phonetic: 'ɑ̃ fɛt', english: 'actually / in fact', partOfSpeech: 'expression' },
      ],
      chunks: [
        { french: 'En fait, c\'est pas du tout un problème.', phonetic: 'ɑ̃ fɛt sɛ pa...', english: 'Actually, it\'s not at all a problem.', note: 'Colloquial ease.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Fast decoding drills.',
      exercises: [
        { type: 'repeat', instruction: 'Contracted spoken French', prompt: 'T\'es d\'accord avec ça ?', answer: 'T\'es d\'accord avec ça ?' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Informal fast chat with young francophone tech entrepreneurs.',
      instruction: 'Listen to natural, unstilted French cadence.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Salut ! Franchement votre outil c\'est du lourd, vous avez testé à Cotonou ?', english: 'Hey! Honestly your tool is awesome, did you test in Cotonou?', aiSlot: true },
        { speaker: 'you', french: 'Oui, on a testé dans cinq écoles et les retours sont excellents.', english: 'Yes, we tested in five schools and the feedback is excellent.', hint: 'Confirm you tested in 5 schools with great feedback.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Register switching: knowing when to use formal vs informal.',
      keyPoints: [
        { wrong: 'Using "t\'es" in formal government meetings.', right: 'Vous êtes', explanation: 'Keep formal register with officials and elders.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Comprehension confirmation.',
      canSayNow: ['Recognize informal contractions and reply smoothly'],
      wellDoneNote: 'You can navigate authentic spoken French without feeling bewildered.',
    },
  ],
};

export const unit18: StructuredUnit = {
  id: 'unit_18',
  unitNumber: 18,
  title: 'Negotiation & Deals',
  subtitle: 'Concessions, counter-offers, contractual commitments',
  icon: '🤝',
  stage: 'operational',
  track: 'B',
  estimatedMinutes: 50,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Negotiation reflexes warmup.',
      reviewItems: [
        { french: 'le contrat', english: 'the contract' },
        { french: 'le prix', english: 'the price' },
        { french: 'le délai', english: 'the deadline / timeframe' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Commercial bargaining formulas.',
      words: [
        { french: 'un compromis', phonetic: 'œ̃ kɔ̃.pʁɔ.mi', english: 'a compromise', partOfSpeech: 'noun', gender: 'm' },
        { french: 'en contrepartie', phonetic: 'ɑ̃ kɔ̃tʁ.paʁ.ti', english: 'in return / on the other hand', partOfSpeech: 'expression' },
        { french: 'conclure un accord', phonetic: 'kɔ̃.klyʁ œ̃ na.kɔʁ', english: 'to reach an agreement', partOfSpeech: 'phrase' },
      ],
      chunks: [
        { french: 'Nous pouvons faire un geste sur le prix si le contrat est annuel.', phonetic: 'nu pu.vɔ̃...', english: 'We can make a gesture on price if the contract is annual.', note: 'Classic trade-off offer.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Deal terms drill.',
      exercises: [
        { type: 'repeat', instruction: 'Counter-offer formula', prompt: 'Si vous signez aujourd\'hui, nous offrons la formation.', answer: 'Si vous signez aujourd\'hui, nous offrons la formation.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 15,
      scenario: 'Closing a deal with a hesitant client requesting a 20% discount.',
      instruction: 'Defend your margin diplomatically using conditional concessions.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Vingt pour cent de réduction, ou nous ne pourrons pas signer.', english: '20% discount, or we won\'t be able to sign.', aiSlot: true },
        { speaker: 'you', french: 'Je comprends. Nous pouvons accorder dix pour cent et inclure le support gratuit.', english: 'I understand. We can grant 10% and include free support.', hint: 'Propose 10% plus free support as compromise.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Conditional structures (Si + présent → futur).',
      keyPoints: [
        { wrong: 'Si vous signerez...', right: 'Si vous signez, nous ferons...', explanation: 'After "si", use present tense, followed by future in the result clause.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Negotiation recap.',
      canSayNow: ['Propose conditional concessions and defend value'],
      wellDoneNote: 'Stage 3 completed. Ready for spontaneous fluent conversation.',
    },
  ],
};

// ============================================================
// STAGE 4 — FLUENT USE (Weeks 20+) [No Safety Net]
// ============================================================

export const unit19: StructuredUnit = {
  id: 'unit_19',
  unitNumber: 19,
  title: 'Free Conversation (No Safety Net)',
  subtitle: 'Unscripted, spontaneous dialogue with zero English support',
  icon: '🌊',
  stage: 'fluent',
  track: 'B',
  estimatedMinutes: 60,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Take a deep breath. From here on, full immersion.',
      reviewItems: [
        { french: 'Je suis prêt.', english: 'I am ready.' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Idiomatic discourse markers.',
      words: [
        { french: 'd\'ailleurs', phonetic: 'da.jœʁ', english: 'by the way / besides', partOfSpeech: 'expression' },
        { french: 'quoi qu\'il en soit', phonetic: 'kwa ki lɑ̃ swa', english: 'in any case / regardless', partOfSpeech: 'phrase' },
      ],
      chunks: [
        { french: 'Quoi qu\'il en soit, nous allons trouver une solution.', phonetic: 'kwa ki lɑ̃ swa...', english: 'In any case, we will find a solution.', note: 'Universal resolve.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Rapid response drill under 1.5 seconds.',
      exercises: [
        { type: 'repeat', instruction: 'Fluid native speed', prompt: 'Tout compte fait, nous avons pris la bonne décision.', answer: 'Tout compte fait, nous avons pris la bonne décision.' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 25,
      scenario: 'Completely open-ended interview with a French journalist about technology in West Africa.',
      instruction: 'No pre-scripted lines. DeepSeek AI leads an authentic, flowing dialogue.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Bonjour, parlez-nous de l\'impact du numérique dans les écoles béninoises aujourd\'hui.', english: 'Hello, tell us about the impact of digital tech in Beninese schools today.', aiSlot: true },
        { speaker: 'you', french: 'C\'est une véritable révolution, car nos outils fonctionnent sans connexion Internet permanente.', english: 'It\'s a true revolution, because our tools work without constant Internet connection.', hint: 'Speak freely about offline impact.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Nuanced style corrections.',
      keyPoints: [
        { wrong: 'Excessive literal English calques.', right: 'Idiomatic French structures.', explanation: 'Think in French structures rather than word-for-word translation.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Fluent milestone celebration.',
      canSayNow: ['Hold complex 15+ minute unscripted discussions in French'],
      wellDoneNote: 'You can hold your ground in authentic, fast French conversation.',
    },
  ],
};

export const unit20: StructuredUnit = {
  id: 'unit_20',
  unitNumber: 20,
  title: 'Cultural Fluency & Nuance',
  subtitle: 'Humour, African Francophonie idioms, diplomatic elegance',
  icon: '🎭',
  stage: 'fluent',
  track: 'B',
  estimatedMinutes: 60,
  blocks: [
    {
      type: 'warmup',
      durationMinutes: 5,
      instruction: 'Cultural phrases warmup.',
      reviewItems: [
        { french: 'On est ensemble.', english: 'We are together / We stand united (West African French)' },
      ],
    },
    {
      type: 'input',
      durationMinutes: 10,
      instruction: 'Beninese & West African French high-resonance phrases.',
      words: [
        { french: 'y a pas de souci', phonetic: 'ja pa də su.si', english: 'no problem / no worries', partOfSpeech: 'expression' },
        { french: 'à tout à l\'heure', phonetic: 'a tu ta lœʁ', english: 'see you in a bit', partOfSpeech: 'expression' },
      ],
      chunks: [
        { french: 'Y a pas de souci, on gère la situation avec l\'équipe.', phonetic: 'ja pa də su.si...', english: 'No worries, we are handling the situation with the team.', note: 'Local warmth and competence.' },
      ],
    },
    {
      type: 'drill',
      durationMinutes: 10,
      instruction: 'Cultural nuance drill.',
      exercises: [
        { type: 'repeat', instruction: 'Warm closing formula', prompt: 'Merci pour l\'accueil, on reste en contact !', answer: 'Merci pour l\'accueil, on reste en contact !' },
      ],
    },
    {
      type: 'roleplay',
      durationMinutes: 25,
      scenario: 'Dinner with regional partners in Cotonou celebrating a joint milestone.',
      instruction: 'Engage with warmth, humor, and effortless French fluency.',
      aiSlot: true,
      exchanges: [
        { speaker: 'app', french: 'Félicitations pour le déploiement ! Santé à toute l\'équipe !', english: 'Congratulations on the deployment! Cheers to the whole team!', aiSlot: true },
        { speaker: 'you', french: 'Santé ! Merci à tous, c\'est le début d\'une grande aventure.', english: 'Cheers! Thanks to everyone, this is the start of a great adventure.', hint: 'Propose a toast and thank partners.' },
      ],
    },
    {
      type: 'correction',
      durationMinutes: 5,
      instruction: 'Cultural resonance polish.',
      keyPoints: [
        { wrong: 'Overly cold bureaucratic speech in celebratory contexts.', right: 'Warm, respectful, human engagement.', explanation: 'African business culture deeply values genuine human connection.' },
      ],
    },
    {
      type: 'recap',
      durationMinutes: 5,
      instruction: 'Grand curriculum completion.',
      canSayNow: [
        'Complete French mastery from Day 1 arrival to professional negotiation and leadership',
      ],
      wellDoneNote: 'You have achieved full conversational and operational French proficiency. All 20 units mastered!',
    },
  ],
};

export const STAGE2_AND_BEYOND_UNITS: StructuredUnit[] = [
  unit7,
  unit8,
  unit9,
  unit10,
  unit11,
  unit12,
  unit13,
  unit14,
  unit15,
  unit16,
  unit17,
  unit18,
  unit19,
  unit20,
];
