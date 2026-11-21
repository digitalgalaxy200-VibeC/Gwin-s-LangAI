import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  ShieldCheck, 
  WifiOff, 
  Award,
  Languages,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
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
  onOpenSuperAdmin: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onOpenSuperAdmin
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const playSampleAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Top Banner: Limited Early Cohort Notice */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-600 to-sky-700 text-white text-xs py-2 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2">
        <span className="bg-amber-400 text-slate-950 text-[10px] uppercase font-black px-2 py-0.5 rounded-full">New Protocol</span>
        <span>Operational Spoken French: Learn the top 300 high-frequency reflexes in 14 days.</span>
      </div>

      {/* Sticky Header Navigation */}
      <nav className="w-full border-b border-white/10 sticky top-0 bg-[#070b14]/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/25">
              🇫🇷
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">Polyglot Protocol</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  CIA Pattern
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium block">
                Military-Grade Spoken Fluency • 100% Offline
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onSignIn}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition-all"
            >
              Learner Login
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSuperAdmin}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
              title="Super Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
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
            <span>The High-Frequency Diplomatic & CIA Training Pattern</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Speak Fluent French in <span className="bg-gradient-to-r from-amber-300 via-sky-300 to-indigo-400 bg-clip-text text-transparent">14 Days</span>.<br />
            Not 4 Years.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Traditional classes teach grammar tables that make you freeze in conversation. We use the <strong>CIA / Foreign Service training pattern</strong>: drill the <strong>top 20% high-frequency phrase matrices</strong> with rapid auditory reflex until you speak instinctively—with 100% offline autonomy.
          </p>

          {/* Key Value Checks */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-300 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Zero-Data Offline First</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Grammar Conjugation Tables</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Native Audio Every Single Word</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center max-w-md mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full py-4 px-8 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-black text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>Start 14-Day Protocol</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onSignIn}
              className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-2xl font-bold text-sm transition-all active:scale-95"
            >
              Sign In to Your Workspace
            </button>
          </div>
          
          <p className="text-xs text-slate-500">
            Instant on-device setup • No credit card required • Zero internet connection needed
          </p>
        </div>
      </header>

      {/* SECTION 2: THE PROBLEM (Agitate the Old Way vs The CIA Pattern) */}
      <section className="py-16 bg-slate-900/50 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-800/40">
              The Fatal Flaw of Traditional Learning
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why 95% of People Can't Speak After Years of Lessons
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              You are taught how to read textbooks, not how to react in real-time. Here is how our framework rewires your brain:
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
                  <h3 className="text-lg font-black text-white">The Traditional Classroom / App Way</h3>
                  <span className="text-xs text-red-300">High friction • Slow recall</span>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Conjugation paralysis:</strong> You stop mid-sentence trying to remember whether to use subjunctive or imparfait.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Unusable vocabulary:</strong> Apps teach you "the green apple is under the table" instead of how to negotiate market prices.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Mental translation delay:</strong> You translate English $\rightarrow$ French in your head, creating awkward 5-second pauses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Internet dependent:</strong> When you land at the airport or travel between cities, the app fails without Wi-Fi.</span>
                </li>
              </ul>
            </div>

            {/* The CIA Pattern */}
            <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-2xl">
                The Protocol
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">The CIA High-Frequency Pattern</h3>
                  <span className="text-xs text-indigo-300">Immediate reflex • 14-day operational competence</span>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Substitution frames:</strong> Learn 1 flexible sentence skeleton, swap 10 slots, instantly command 100 variations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>80/20 Lexicon:</strong> Drill only the 300 words that account for 65% of all daily spoken conversations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Subconscious auditory reflex:</strong> Audio prompts force your vocal cords to respond before your conscious brain can doubt.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100% Offline engine:</strong> Entire curriculum, phonetic audio, and dictionary run on device storage.</span>
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
            <span>Interactive Audio Experience</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Experience the High-Frequency Substitution Drill
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Click to hear native French acoustic pronunciation. Notice how a single sentence frame ("Je voudrais...") unlocks dozens of real situations:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-3xl mx-auto pt-2">
            {[
              { fr: "Je voudrais payer par carte.", en: "I'd like to pay by card.", tag: "At the Checkout" },
              { fr: "Je voudrais aller au marché Dantokpa.", en: "I'd like to go to Dantokpa market.", tag: "Transport / Taxi" },
              { fr: "Je voudrais commander de l'eau.", en: "I'd like to order some water.", tag: "Restaurant / Daily" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950/80 border border-white/10 hover:border-indigo-500/50 p-4 rounded-2xl space-y-2 cursor-pointer transition-all hover:bg-slate-900 active:scale-95"
                onClick={() => playSampleAudio(item.fr)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider bg-indigo-950/90 px-2 py-0.5 rounded-md">
                    {item.tag}
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
            Tap any box above to hear native audio • All 20 Units contain over 1,000+ interactive audio drills
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
                <span>Field Case Study: Cotonou, Benin 🇧🇯</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                "Zero French on Monday. Haggling in Dantokpa Market by the Second Week."
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                When moving to Francophone West Africa, textbook French is practically useless for negotiations, motorcycle taxis (zémidjans), and border checks. 
                Using our <strong>6-Block High-Frequency Routine</strong>, our founders mastered real spoken French in 14 days without internet drops slowing them down.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-2xl font-black text-white">14 Days</div>
                  <div className="text-xs text-slate-400">To Spoken Autonomy</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">1,000</div>
                  <div className="text-xs text-slate-400">High-Impact Words</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">0 KB</div>
                  <div className="text-xs text-slate-400">Data Needed in Flight</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-84 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
              <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">The 14-Day Sprint Schedule</div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span><strong>Days 1-3:</strong> Emergency phonetics, numbers, taxi pricing & street navigation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span><strong>Days 4-8:</strong> Food, market bargaining, transport, & social introductions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span><strong>Days 9-14:</strong> Work discussions, problem resolution, and complex compound phrasing.</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all"
              >
                Enroll in 14-Day Protocol
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
                <span>Global Multi-Tenant Architecture</span>
              </div>
              <h2 className="text-3xl font-black text-white">We Started with French. The World is Next.</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                The high-frequency algorithm is language-agnostic. We have perfected French first, with full Spanish, German, Arabic, and Yoruba curriculums currently being indexed.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-md">🇫🇷 French (Live)</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold">🇪🇸 Spanish (Q3)</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold">🇩🇪 German (Q4)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <Languages className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white">Bidirectional Learning</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                English speakers learning French (🇬🇧➔🇫🇷) or French speakers learning English (🇫🇷➔🇬🇧). One tap switch.
              </p>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <h4 className="text-base font-bold text-white">Multi-User Isolation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Invite your siblings, partner, or team. Each person gets a strictly isolated cloud workspace on Turso Edge.
              </p>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Native Audio Offline</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every vocabulary card, translation look-up, and sentence drill includes native French acoustic pronunciation.
              </p>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h4 className="text-base font-bold text-white">Zero Polling & Offline Sync</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn offline for a week with zero battery or data drain. Syncs safely to the cloud only when you reconnect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-3 pt-4">
          {[
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
          ].map((faq, idx) => (
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
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/30 border border-indigo-500/40 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-indigo-600/20">
            ⚡
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Start Your 14-Day Spoken Journey Today
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Zero contracts. Works on any laptop, tablet, or phone. Free yourself from language anxiety with rapid subconscious drilling.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full py-4 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-4">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> Private & Secure</span>
            <span className="flex items-center gap-1.5"><WifiOff className="w-3.5 h-3.5 text-indigo-400" /> 100% Offline Autonomy</span>
            <span className="flex items-center gap-1.5"><FileCheck className="w-3.5 h-3.5 text-amber-400" /> Instant Activation</span>
          </div>
        </div>
      </section>

      {/* Responsive Footer */}
      <footer className="w-full border-t border-white/10 bg-[#070b14] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">Polyglot Protocol</span>
            <span>• High-Frequency Language Acquisition Engine</span>
          </div>

          <div className="flex items-center gap-6">
            <span>PWA Offline-First</span>
            <span>Turso Cloud Isolated</span>
            <button 
              onClick={onOpenSuperAdmin} 
              className="text-slate-400 hover:text-amber-400 font-bold flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Portal</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
