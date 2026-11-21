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
  Target,
  ChevronDown,
  Globe2,
  Users
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation Bar - Responsive Desktop & Mobile */}
      <nav className="w-full border-b border-white/10 sticky top-0 bg-slate-950/85 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20">
              🇫🇷
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">Polyglot Protocol</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  CIA Methodology
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium block">
                Starting with French • Expanding Globally
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onSignIn}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition-all"
            >
              Log In
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

      {/* Hero Section */}
      <header className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-sky-500/15 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>The High-Frequency Foreign Service / CIA Framework</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Speak Fluent French in <span className="bg-gradient-to-r from-amber-300 via-sky-300 to-indigo-400 bg-clip-text text-transparent">14 Days</span>.<br />
            Not 4 Years.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Traditional apps teach grammar rules that make you freeze in conversation. We use the <strong>CIA / Foreign Service pattern</strong>: drill the <strong>top 20% high-frequency phrase matrices</strong> with rapid auditory reflex until you speak instinctively—even completely offline.
          </p>

          {/* Social Proof Stats */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-400 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Offline Autonomy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Grammar Drudgery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Native Audio Every Drill</span>
            </div>
          </div>

          {/* CTAs */}
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
        </div>
      </header>

      {/* The Secret: High Frequency + CIA Protocol */}
      <section className="py-16 bg-slate-900/60 border-y border-white/10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/40">
              The Cognitive Science
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Traditional Language Apps Fail You
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              When diplomatic personnel or field operatives need to operate in a foreign country in two weeks, they never conjugate irregular verbs on a chalkboard. Here is how our protocol gets you speaking:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-7 space-y-4 hover:border-indigo-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">80/20 High-Frequency Lexicon</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                In every human language, just <strong>300 root words account for 65% of all daily spoken conversations</strong>. We discard the fluff and drill only the real-world operational blocks you actually hear on the street.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-7 space-y-4 hover:border-indigo-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">The CIA Substitution Pattern</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Learn 1 sentence skeleton, swap 10 variables, and command 100 variations. Instead of translating from English in your head, your vocal cords develop immediate muscle memory.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-7 space-y-4 hover:border-indigo-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Zero Cloud Reliance (True Offline)</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                High-stakes travelers and field agents cannot rely on stable 4G. The entire dictionary, spoken phonetics, and 20 curriculum units run strictly on your device without cellular data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Feature Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                When moving to Francophone West Africa, classroom French is practically useless for negotiations, motorcycle taxis (zémidjans), and border checks. 
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

            <div className="w-full lg:w-80 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
              <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">The 2-Week Roadmap</div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span><strong>Days 1-3:</strong> Emergency phonetics, numbers, prices & direction navigation.</span>
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
                Enroll Your Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Multi-Language Roadmap Section */}
      <section className="py-16 bg-slate-900/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-indigo-400 tracking-wider mb-2">
                <Globe2 className="w-4 h-4" />
                <span>Global Multi-Tenant Platform</span>
              </div>
              <h2 className="text-3xl font-black text-white">We Started with French. The World is Next.</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                The high-frequency algorithm is language-agnostic. We have perfected French first, with full Spanish, German, Arabic, and Yoruba curriculums currently being indexed.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs">🇫🇷 French (Active)</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold">🇪🇸 Spanish (Q3)</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold">🇩🇪 German (Q4)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <Languages className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white">Bidirectional Learning</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                English speakers learning French (🇬🇧➔🇫🇷) or French speakers learning English (🇫🇷➔🇬🇧) switch with a single tap.
              </p>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <h4 className="text-base font-bold text-white">Multi-User Isolation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Invite your siblings or entire family. Each person gets a completely isolated workspace on Turso Cloud.
              </p>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Native Speech Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every vocabulary card, translation look-up, and sentence drill includes native French acoustic pronunciation.
              </p>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h4 className="text-base font-bold text-white">Spaced Repetition</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The algorithm automatically recycles words you hesitate on so you retain 92% of lessons after 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-white text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-3">
          {[
            {
              q: "Can I really speak basic French within 14 days?",
              a: "Yes. By eliminating useless grammar drills and focusing strictly on the top high-frequency patterns using the CIA method, you will be able to order food, negotiate prices, ask directions, and introduce yourself within 2 weeks."
            },
            {
              q: "How does the offline mode work on my phone or laptop?",
              a: "The app is a Progressive Web App (PWA). All lessons, voice audio, and translation dictionaries are cached locally on your device. You can turn on Airplane Mode for a week and continue learning without interruption."
            },
            {
              q: "Can my siblings and friends learn on the same app?",
              a: "Absolutely. Each user registers with their own email. Data is strictly separated so nobody's streaks, test scores, or vocabulary notebooks ever mix."
            },
            {
              q: "What if I am already a French speaker who wants to learn English?",
              a: "Our app is completely bidirectional. You can toggle your interface to French native mode to master English (🇫🇷 ➔ 🇬🇧) using the same high-frequency audio drilling methodology."
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

      {/* Main Closing Call to Action */}
      <section className="py-20 text-center bg-gradient-to-b from-slate-950 to-indigo-950/60 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
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
        </div>
      </section>

      {/* Responsive Footer */}
      <footer className="w-full border-t border-white/10 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">Polyglot Protocol</span>
            <span>• High-Frequency Language Acquisition Engine</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Progressive Web App (PWA)</span>
            <span>Offline-First SQLite</span>
            <button 
              onClick={onOpenSuperAdmin} 
              className="text-slate-400 hover:text-amber-400 font-bold flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
