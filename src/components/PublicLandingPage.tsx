import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  WifiOff, 
  Award,
  Languages,
  CheckCircle2,
  TrendingUp,
  ChevronDown,
  Globe2,
  Users,
  XCircle,
  Lock,
  Headphones,
  FileCheck
} from 'lucide-react';

interface PublicLandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onContinueAsGuest: () => void;
}

type Lang = 'en' | 'fr';

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onContinueAsGuest,
}) => {
  const [lang, setLang] = useState<Lang>('en');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const playSampleAudio = (text: string, voiceLang: 'fr-FR' | 'en-US' = 'fr-FR') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Translations Dictionary for Complete Bilingual Landing Page
  const t = {
    en: {
      topBannerTag: "Battle-Tested Methodology",
      topBannerText: "How elite diplomatic & intelligence operatives master foreign spoken fluency in under 3 weeks.",
      appTitle: "Polyglot",
      ciaBadge: "Operative Pattern",
      appSubtitle: "Tactical Spoken Fluency • 100% Offline Autonomy",
      loginBtn: "Learner Login",
      getStartedBtn: "Get Started",
      guestBtn: "Explore as Guest",
      heroBadge: "The High-Speed Diplomatic & Field Operative Protocol",
      heroTitle1: "Speak Conversational French in ",
      heroDays: "14 Days",
      heroTitle2: "Using the Secret Foreign Service Reflex Method.",
      heroDesc: "Diplomatic corps and intelligence agencies never sit through 4 years of classroom grammar. They train the top 20% high-frequency vocal frames with rapid auditory reflex until speaking becomes an instinct. No internet required.",
      check1: "100% Zero-Data Offline First",
      check2: "No Grammar Conjugation Tables",
      check3: "Native Audio Every Single Word",
      ctaPrimary: "Start 14-Day Protocol",
      ctaSecondary: "Sign In to Your Workspace",
      ctaGuest: "Try Without Registering (Guest Mode)",
      heroNote: "Instant on-device setup • No credit card required • Zero internet connection needed",
      
      problemTag: "The Fatal Flaw of Traditional Learning",
      problemTitle: "Why 95% of People Can't Speak After Years of Lessons",
      problemSubtitle: "You are taught how to read textbooks, not how to react in real-time. Here is how our framework rewires your brain:",
      oldWayTitle: "The Traditional Classroom / App Way",
      oldWaySubtitle: "High friction • Slow recall",
      old1Title: "Conjugation paralysis:",
      old1Desc: "You stop mid-sentence trying to remember whether to use subjunctive or imparfait.",
      old2Title: "Unusable vocabulary:",
      old2Desc: "Apps teach you 'the green apple is under the table' instead of how to negotiate market prices.",
      old3Title: "Mental translation delay:",
      old3Desc: "You translate English ➔ French in your head, creating awkward 5-second pauses.",
      old4Title: "Internet dependent:",
      old4Desc: "When you land at the airport or travel between cities, the app fails without Wi-Fi.",
      
      ciaWayBadge: "The Protocol",
      ciaWayTitle: "The CIA High-Frequency Pattern",
      ciaWaySubtitle: "Immediate reflex • 14-day operational competence",
      cia1Title: "Substitution frames:",
      cia1Desc: "Learn 1 flexible sentence skeleton, swap 10 slots, instantly command 100 variations.",
      cia2Title: "80/20 Lexicon:",
      cia2Desc: "Drill only the 300 words that account for 65% of all daily spoken conversations.",
      cia3Title: "Subconscious auditory reflex:",
      cia3Desc: "Audio prompts force your vocal cords to respond before your conscious brain can doubt.",
      cia4Title: "100% Offline engine:",
      cia4Desc: "Entire curriculum, phonetic audio, and dictionary run directly on device storage.",
      
      demoBadge: "Interactive Audio Experience",
      demoTitle: "Experience the High-Frequency Substitution Drill",
      demoSubtitle: "Click to hear native acoustic pronunciation. Notice how a single sentence frame ('Je voudrais...') unlocks dozens of real situations:",
      demoTapNote: "Tap any box above to hear native audio • All 20 Units contain over 1,000+ interactive audio drills",
      
      caseTag: "Field Case Study: Cotonou, Benin 🇧🇯",
      caseTitle: '"Zero French on Monday. Haggling in Dantokpa Market by the Second Week."',
      caseDesc: "When moving to Francophone West Africa, textbook French is practically useless for negotiations, motorcycle taxis (zémidjans), and border checks. Using our 6-Block High-Frequency Routine, our learners mastered real spoken French in 14 days without internet drops slowing them down.",
      stat1Val: "14 Days",
      stat1Label: "To Spoken Autonomy",
      stat2Val: "1,000",
      stat2Label: "High-Impact Words",
      stat3Val: "0 KB",
      stat3Label: "Data Needed in Flight",
      roadmapTitle: "The 14-Day Sprint Schedule",
      step1: "Days 1-3: Emergency phonetics, numbers, taxi pricing & street navigation.",
      step2: "Days 4-8: Food, market bargaining, transport, & social introductions.",
      step3: "Days 9-14: Work discussions, problem resolution, and complex compound phrasing.",
      enrollBtn: "Enroll in 14-Day Protocol",
      
      globalTag: "Global Multi-Tenant Architecture",
      globalTitle: "We Started with French. The World is Next.",
      globalDesc: "The high-frequency algorithm is language-agnostic. We have perfected French first, with full Spanish, German, Arabic, and Yoruba curriculums currently being indexed.",
      tagFrench: "🇫🇷 French (Live)",
      tagSpanish: "🇪🇸 Spanish (Q3)",
      tagGerman: "🇩🇪 German (Q4)",
      
      feat1Title: "Bidirectional Learning",
      feat1Desc: "English speakers learning French (🇬🇧➔🇫🇷) or French speakers learning English (🇫🇷➔🇬🇧). One tap switch.",
      feat2Title: "Multi-User Isolation",
      feat2Desc: "Invite your siblings, partner, or team. Each person gets a strictly isolated cloud workspace on Turso Edge.",
      feat3Title: "Native Audio Offline",
      feat3Desc: "Every vocabulary card, translation look-up, and sentence drill includes native French acoustic pronunciation.",
      feat4Title: "Zero Polling & Offline Sync",
      feat4Desc: "Learn offline for a week with zero battery or data drain. Syncs safely to the cloud only when you reconnect.",
      
      faqTag: "Got Questions?",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "Can I really speak basic French within 14 days?",
          a: "Yes. By eliminating useless grammar drills and focusing strictly on the top 20% high-frequency patterns using the CIA substitution method, you will be able to order food, negotiate prices, ask directions, and introduce yourself within 2 weeks."
        },
        {
          q: "How does the offline mode work on my phone or laptop?",
          a: "The app is a Progressive Web App (PWA). All lessons, voice audio, and translation dictionaries are cached locally on your device. You can turn on Airplane Mode for a week and continue learning without interruption."
        },
        {
          q: "Can my siblings and friends learn on the same app?",
          a: "Absolutely. Each user registers with their own email. Data is strictly separated with unique user IDs so nobody's streaks, test scores, or vocabulary notebooks ever mix."
        },
        {
          q: "What if I am already a French speaker who wants to learn English?",
          a: "Our app is completely bidirectional. You can toggle your interface to French native mode to master English (🇫🇷 ➔ 🇬🇧) using the same high-frequency audio drilling methodology."
        },
        {
          q: "Do I need to install anything from an app store?",
          a: "No! Simply open the link on Safari or Chrome, tap 'Add to Home Screen' or 'Install', and the full app installs instantly on your phone or laptop with full offline support."
        }
      ],
      
      ctaFinalTitle: "Start Your 14-Day Spoken Journey Today",
      ctaFinalDesc: "Zero contracts. Works on any laptop, tablet, or phone. Free yourself from language anxiety with rapid subconscious drilling.",
      ctaCreateBtn: "Create Free Account",
      trust1: "Private & Secure",
      trust2: "100% Offline Autonomy",
      trust3: "Instant Activation",
      footerTag: "High-Frequency Language Acquisition Engine",
      footerAdmin: "Super Admin Portal"
    },
    fr: {
      topBannerTag: "Méthode Éprouvée",
      topBannerText: "La stratégie utilisée par les diplomates d'élite pour maîtriser une langue étrangère en moins de 3 semaines.",
      appTitle: "Polyglot",
      ciaBadge: "Méthode Opérationnelle",
      appSubtitle: "Aisance Orale Tactique • 100% Autonome Hors-Ligne",
      loginBtn: "Connexion",
      getStartedBtn: "Commencer",
      guestBtn: "Essayer en Invité",
      heroBadge: "Le Protocole Rapide des Services Diplomatiques & Opérationnels",
      heroTitle1: "Parlez Français Couramment en ",
      heroDays: "14 Jours",
      heroTitle2: "Grâce à la Méthode Réflexe des Services Secrets.",
      heroDesc: "Les diplomates et agents de terrain n'étudient pas 4 ans de grammaire en classe. Ils entraînent les 20% de matrices vocales les plus fréquentes avec un réflexe auditif immédiat jusqu'à ce que la parole devienne un réflexe naturel. Sans aucune connexion internet.",
      check1: "100% Autonome Hors-Ligne (Sans Données)",
      check2: "Zéro Tableaux de Conjugaison Rébarbatifs",
      check3: "Audio Natif sur Chaque Mot et Phrase",
      ctaPrimary: "Lancer le Protocole 14 Jours",
      ctaSecondary: "Accéder à Mon Espace",
      ctaGuest: "Découvrir Sans Inscription (Mode Invité)",
      heroNote: "Configuration immédiate • Aucune carte bancaire requise • Aucune connexion internet nécessaire",
      
      problemTag: "Le Défaut Fatal de la Méthode Traditionnelle",
      problemTitle: "Pourquoi 95% des Gens Ne Parlent Pas Après des Années de Cours",
      problemSubtitle: "On vous apprend à lire des manuels, pas à réagir en direct. Voici comment notre protocole reprogramme votre réflexe :",
      oldWayTitle: "La Méthode Traditionnelle / Applications Ordinaires",
      oldWaySubtitle: "Friction élevée • Réflexes lents",
      old1Title: "Paralysie de la conjugaison :",
      old1Desc: "Vous hésitez en pleine phrase pour vous souvenir s'il faut le subjonctif ou l'imparfait.",
      old2Title: "Vocabulaire inutile :",
      old2Desc: "Les applis vous apprennent 'la pomme verte est sur la table' au lieu de négocier au marché.",
      old3Title: "Délai de traduction mentale :",
      old3Desc: "Vous traduisez de l'anglais au français dans votre tête, créant un blanc gênant de 5 secondes.",
      old4Title: "Dépendant d'internet :",
      old4Desc: "Dès que vous atterrissez à l'aéroport ou voyagez entre deux villes, l'application plante sans Wi-Fi.",
      
      ciaWayBadge: "Le Protocole",
      ciaWayTitle: "Le Modèle Haute Fréquence CIA",
      ciaWaySubtitle: "Réflexe immédiat • Aisance opérationnelle en 14 jours",
      cia1Title: "Matrices de substitution :",
      cia1Desc: "Apprenez 1 squelette de phrase flexible, changez 10 éléments, maîtrisez 100 variations instantanément.",
      cia2Title: "Lexique 80/20 :",
      cia2Desc: "Entraînez uniquement les 300 mots qui représentent 65% des échanges oraux quotidiens.",
      cia3Title: "Réflexe auditif subconscient :",
      cia3Desc: "Le stimulus audio pousse vos cordes vocales à répondre avant même que le doute s'installe.",
      cia4Title: "Moteur 100% Hors-Ligne :",
      cia4Desc: "L'ensemble du programme, les prononciations et le dictionnaire tournent sur la mémoire de l'appareil.",
      
      demoBadge: "Expérience Audio Interactive",
      demoTitle: "Testez l'Entraînement par Substitution Haute Fréquence",
      demoSubtitle: "Cliquez pour écouter la prononciation acoustique native. Remarquez comment un seul cadre ('Je voudrais...') débloque des dizaines de situations réelles :",
      demoTapNote: "Touchez un encadré ci-dessus pour écouter • Les 20 unités contiennent plus de 1 000 exercices audio interactifs",
      
      caseTag: "Étude de Cas Réelle : Cotonou, Bénin 🇧🇯",
      caseTitle: '"Zéro français le lundi. Négociation au marché Dantokpa dès la deuxième semaine."',
      caseDesc: "Pour s'installer en Afrique de l'Ouest francophone, le français académique est inefficace pour négocier, prendre un zémidjan ou franchir les formalités. Grâce à notre routine en 6 blocs, nos apprenants maîtrisent le français parlé réel en 14 jours, sans interruption due au réseau.",
      stat1Val: "14 Jours",
      stat1Label: "Pour l'Autonomie Orale",
      stat2Val: "1 000",
      stat2Label: "Mots à Fort Impact",
      stat3Val: "0 Ko",
      stat3Label: "Données en Voyage",
      roadmapTitle: "Le Programme Sprint de 14 Jours",
      step1: "Jours 1-3 : Phonétique d'urgence, chiffres, prix des taxis et orientation dans la rue.",
      step2: "Jours 4-8 : Nourriture, négociation au marché, transports et présentations sociales.",
      step3: "Jours 9-14 : Réunions professionnelles, résolution de problèmes et tournures complexes.",
      enrollBtn: "Rejoindre le Protocole 14 Jours",
      
      globalTag: "Architecture Multi-Locataire Mondiale",
      globalTitle: "Nous Avons Commencé par le Français. Le Monde Est la Prochaine Étape.",
      globalDesc: "L'algorithme de haute fréquence fonctionne pour toutes les langues. Nous avons perfectionné le français en premier, l'espagnol, l'allemand, l'arabe et le yoruba étant en cours d'intégration.",
      tagFrench: "🇫🇷 Français (Actif)",
      tagSpanish: "🇪🇸 Espagnol (T3)",
      tagGerman: "🇩🇪 Allemand (T4)",
      
      feat1Title: "Apprentissage Bidirectionnel",
      feat1Desc: "Anglophones apprenant le français (🇬🇧➔🇫🇷) ou francophones apprenant l'anglais (🇫🇷➔🇬🇧). Changement en 1 clic.",
      feat2Title: "Isolation Multi-Utilisateurs",
      feat2Desc: "Invitez vos frères, sœurs, conjoints ou collègues. Chacun possède son espace privé isolé sur Turso Cloud.",
      feat3Title: "Audio Natif Hors-Ligne",
      feat3Desc: "Chaque fiche de vocabulaire, recherche de traduction et phrase d'entraînement dispose d'une prononciation native.",
      feat4Title: "Zéro Requête Inutile & Synchronisation",
      feat4Desc: "Apprenez hors-ligne pendant une semaine sans consommer de données. Synchronisation automatique au retour du Wi-Fi.",
      
      faqTag: "Des Questions ?",
      faqTitle: "Foire Aux Questions",
      faqs: [
        {
          q: "Peut-on vraiment parler un français de base en 14 jours ?",
          a: "Oui. En supprimant les exercices de grammaire inutiles et en se concentrant sur les 20% de structures les plus fréquentes avec la méthode de substitution CIA, vous commandez à manger, négociez les prix et vous présentez en 2 semaines."
        },
        {
          q: "Comment fonctionne le mode hors-ligne sur téléphone ou ordinateur ?",
          a: "L'application est une Progressive Web App (PWA). Toutes les leçons, les fichiers vocaux et le dictionnaire sont stockés localement sur votre appareil. Vous pouvez activer le mode avion pendant une semaine et continuer à vous entraîner."
        },
        {
          q: "Mes frères et sœurs peuvent-ils apprendre sur la même application ?",
          a: "Absolument. Chaque utilisateur crée son compte avec son propre email. Les données sont strictement isolées par identifiant unique afin que les progrès et carnets ne soient jamais mélangés."
        },
        {
          q: "Et si je suis francophone et que je veux apprendre l'anglais ?",
          a: "Notre application est totalement bidirectionnelle ! Vous pouvez basculer en mode natif français pour apprendre l'anglais (🇫🇷 ➔ 🇬🇧) avec la même méthode d'entraînement auditif accéléré."
        },
        {
          q: "Dois-je télécharger une application depuis l'App Store ou Google Play ?",
          a: "Non ! Ouvrez simplement le lien sur Safari ou Chrome, cliquez sur 'Ajouter à l'écran d'accueil' ou 'Installer', et l'application s'installe directement avec son support hors-ligne complet."
        }
      ],
      
      ctaFinalTitle: "Commencez Votre Voyage Vers la Maîtrise Orale Aujourd'hui",
      ctaFinalDesc: "Sans engagement. Fonctionne sur ordinateur, tablette ou smartphone. Libérez-vous de l'angoisse de parler grâce aux réflexes subconscients.",
      ctaCreateBtn: "Créer un Compte Gratuit",
      trust1: "Privé & Sécurisé",
      trust2: "100% Autonome Hors-Ligne",
      trust3: "Activation Immédiate",
      footerTag: "Moteur d'Acquisition Linguistique Haute Fréquence",
      footerAdmin: "Portail Super Admin"
    }
  };

  const cur = t[lang];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Top Banner: Limited Early Cohort Notice */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-gradient-to-r from-indigo-900 via-indigo-600 to-sky-700 px-3 py-2 text-center text-[10px] font-bold leading-snug tracking-wide text-white sm:px-4 sm:text-xs">
        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase text-slate-950 sm:text-[10px]">{cur.topBannerTag}</span>
        <span>{cur.topBannerText}</span>
      </div>

      {/* Sticky Header Navigation */}
      <nav className="w-full border-b border-white/10 sticky top-0 bg-[#070b14]/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          
          {/* Logo & Protocol Title */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img 
              src="/logo-transparent.svg" 
              alt="Polyglot Logo" 
              className="h-9 w-9 shrink-0 object-contain drop-shadow-[0_4px_12px_rgba(99,102,241,0.35)] sm:h-11 sm:w-11"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-base font-extrabold tracking-tight text-white sm:text-xl">{cur.appTitle}</span>
                <span className="hidden rounded-full border border-indigo-400/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-300 lg:inline-block">
                  {cur.ciaBadge}
                </span>
              </div>
              <span className="hidden truncate text-xs font-medium text-slate-400 sm:block">
                {cur.appSubtitle}
              </span>
            </div>
          </div>

          {/* Right Header Navigation & Language Switcher */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
            
            {/* Bilingual FR / EN Toggle Switch */}
            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setLang('en')}
                className={`flex items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-black transition-all sm:px-2.5 ${
                  lang === 'en' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to English"
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">EN</span>
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`flex items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-black transition-all sm:px-2.5 ${
                  lang === 'fr' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Passer en Français"
              >
                <span>🇫🇷</span>
                <span className="hidden sm:inline">FR</span>
              </button>
            </div>

            {/* Guest and login live in the hero on phones, so they stay off the mobile bar */}
            <button
              onClick={onContinueAsGuest}
              className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              {cur.guestBtn}
            </button>
            <button
              onClick={onSignIn}
              className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              {cur.loginBtn}
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <span>{cur.getStartedBtn}</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO - High-Converting Hook */}
      <header className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{cur.heroBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
            {cur.heroTitle1}<span className="bg-gradient-to-r from-amber-300 via-sky-300 to-indigo-400 bg-clip-text text-transparent">{cur.heroDays}</span>.<br />
            {cur.heroTitle2}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {cur.heroDesc}
          </p>

          {/* Key Value Checks */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-300 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{cur.check1}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{cur.check2}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{cur.check3}</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center max-w-lg mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full py-4 px-8 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-black text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>{cur.ctaPrimary}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onSignIn}
              className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-2xl font-bold text-sm transition-all active:scale-95"
            >
              {cur.ctaSecondary}
            </button>
          </div>

          <div className="pt-1">
            <button
              onClick={onContinueAsGuest}
              className="text-xs text-indigo-300 hover:text-white font-bold underline underline-offset-4 transition-colors cursor-pointer"
            >
              {cur.ctaGuest} ➔
            </button>
          </div>
          
          <p className="text-xs text-slate-500">
            {cur.heroNote}
          </p>
        </div>
      </header>

      {/* SECTION 2: THE PROBLEM (Old Way vs The High-Frequency Pattern) */}
      <section className="py-16 bg-slate-900/50 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-800/40">
              {cur.problemTag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {cur.problemTitle}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {cur.problemSubtitle}
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Old Way */}
            <div className="bg-red-950/20 border border-red-500/20 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{cur.oldWayTitle}</h3>
                  <span className="text-xs text-red-300">{cur.oldWaySubtitle}</span>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>{cur.old1Title}</strong> {cur.old1Desc}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>{cur.old2Title}</strong> {cur.old2Desc}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>{cur.old3Title}</strong> {cur.old3Desc}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>{cur.old4Title}</strong> {cur.old4Desc}</span>
                </li>
              </ul>
            </div>

            {/* The CIA Pattern */}
            <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-2xl">
                {cur.ciaWayBadge}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md shadow-indigo-500/20 flex items-center justify-center shrink-0">
                  <img 
                    src="/logo-white-bg.jpg" 
                    alt="Polyglot Solution Emblem" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{cur.ciaWayTitle}</h3>
                  <span className="text-xs text-indigo-300">{cur.ciaWaySubtitle}</span>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>{cur.cia1Title}</strong> {cur.cia1Desc}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>{cur.cia2Title}</strong> {cur.cia2Desc}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>{cur.cia3Title}</strong> {cur.cia3Desc}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>{cur.cia4Title}</strong> {cur.cia4Desc}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE DEMO (Try the High-Frequency Audio Drill) */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-white/10 rounded-3xl p-8 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-400/20">
            <Headphones className="w-4 h-4 text-indigo-400" />
            <span>{cur.demoBadge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {cur.demoTitle}
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {cur.demoSubtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-3xl mx-auto pt-2">
            {[
              { 
                fr: "Je voudrais payer par carte.", 
                en: "I'd like to pay by card.", 
                tagEn: "At the Checkout",
                tagFr: "Au Paiement" 
              },
              { 
                fr: "Je voudrais aller au marché Dantokpa.", 
                en: "I'd like to go to Dantokpa market.", 
                tagEn: "Transport / Taxi",
                tagFr: "Transport / Taxi" 
              },
              { 
                fr: "Je voudrais commander de l'eau.", 
                en: "I'd like to order some water.", 
                tagEn: "Daily Order",
                tagFr: "Commande du Jour" 
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950/80 border border-white/10 hover:border-indigo-500/50 p-4 rounded-2xl space-y-2 cursor-pointer transition-all hover:bg-slate-900 active:scale-95"
                onClick={() => playSampleAudio(item.fr, 'fr-FR')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider bg-indigo-950/90 px-2 py-0.5 rounded-md">
                    {lang === 'fr' ? item.tagFr : item.tagEn}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-sm font-bold text-white">{item.fr}</div>
                <div className="text-xs text-slate-400">{item.en}</div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500">
            {cur.demoTapNote}
          </p>
        </div>
      </section>

      {/* SECTION 4: REAL-WORLD CASE STUDY (Cotonou, Benin) */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
            <div className="space-y-5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wide uppercase">
                <Award className="w-4 h-4" />
                <span>{cur.caseTag}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {cur.caseTitle}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {cur.caseDesc}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-2xl font-black text-white">{cur.stat1Val}</div>
                  <div className="text-xs text-slate-400">{cur.stat1Label}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{cur.stat2Val}</div>
                  <div className="text-xs text-slate-400">{cur.stat2Label}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{cur.stat3Val}</div>
                  <div className="text-xs text-slate-400">{cur.stat3Label}</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-84 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
              <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">{cur.roadmapTitle}</div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span>{cur.step1}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span>{cur.step2}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span>{cur.step3}</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all"
              >
                {cur.enrollBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: MULTI-LANGUAGE ROADMAP & PLATFORM SCALE */}
      <section className="py-16 bg-slate-900/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-indigo-400 tracking-wider mb-2">
                <Globe2 className="w-4 h-4" />
                <span>{cur.globalTag}</span>
              </div>
              <h2 className="text-3xl font-black text-white">{cur.globalTitle}</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                {cur.globalDesc}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-md">{cur.tagFrench}</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold">{cur.tagSpanish}</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold">{cur.tagGerman}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <Languages className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white">{cur.feat1Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cur.feat1Desc}
              </p>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <h4 className="text-base font-bold text-white">{cur.feat2Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cur.feat2Desc}
              </p>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">{cur.feat3Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cur.feat3Desc}
              </p>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h4 className="text-base font-bold text-white">{cur.feat4Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cur.feat4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">{cur.faqTag}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{cur.faqTitle}</h2>
        </div>
        
        <div className="space-y-3 pt-4">
          {cur.faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-white hover:bg-white/5 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: FINAL HIGH-CONVERTING CLOSING CALL TO ACTION */}
      <section className="py-20 text-center bg-gradient-to-b from-slate-950 to-indigo-950/70 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-white p-2.5 mx-auto shadow-xl shadow-indigo-600/30 flex items-center justify-center">
            <img 
              src="/logo-white-bg.jpg" 
              alt="Polyglot White Emblem" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {cur.ctaFinalTitle}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            {cur.ctaFinalDesc}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full py-4 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>{cur.ctaCreateBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-4">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> {cur.trust1}</span>
            <span className="flex items-center gap-1.5"><WifiOff className="w-3.5 h-3.5 text-indigo-400" /> {cur.trust2}</span>
            <span className="flex items-center gap-1.5"><FileCheck className="w-3.5 h-3.5 text-amber-400" /> {cur.trust3}</span>
          </div>
        </div>
      </section>

      {/* Responsive Footer */}
      <footer className="w-full border-t border-white/10 bg-[#070b14] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">{cur.appTitle}</span>
            <span>• {cur.footerTag}</span>
          </div>

          <div className="flex items-center gap-6">
            <span>PWA Offline-First</span>
            <span>Turso Cloud Isolated</span>
            <span>Military-Grade Fluency</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
