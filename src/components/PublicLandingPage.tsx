import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  ShieldCheck, 
  WifiOff, 
  Award,
  Zap,
  Languages
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
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col max-w-lg mx-auto shadow-2xl overflow-x-hidden font-sans">
      
      {/* Top Navbar */}
      <nav className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 sticky top-0 bg-slate-900/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-sm">
            🇫🇷
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-white block">French AI Tutor</span>
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">Offline & AI Spoken</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSignIn}
            className="px-3.5 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-bold transition-all text-white active:scale-95"
          >
            Sign In
          </button>
          <button
            onClick={onOpenSuperAdmin}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
            title="Super Admin Portal"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-5 pt-8 pb-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-extrabold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Speak Authentic French from Day 1</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
          Master Spoken French.<br />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
            100% Offline & AI-Powered.
          </span>
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
          Built for real life in Benin, France, and West Africa. Learn high-frequency spoken patterns, practice military-style 6-block drills, and speak with zero fear of internet drops.
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            onClick={onGetStarted}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>Create Free Learner Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onSignIn}
            className="w-full py-3.5 px-6 bg-white/10 hover:bg-white/15 text-slate-200 rounded-2xl font-bold text-xs transition-all active:scale-95"
          >
            I Already Have an Account
          </button>
        </div>
      </header>

      {/* Real World Case Study & Proof Banner */}
      <section className="px-5 py-4">
        <div className="bg-gradient-to-br from-indigo-950/80 to-slate-800/80 border border-indigo-500/20 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/90 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Real World Case Study</span>
            </span>
            <span className="text-xs text-indigo-300 font-bold">Cotonou, Benin 🇧🇯</span>
          </div>

          <h3 className="text-base font-black text-white leading-snug">
            "I arrived with zero French. Within 2 weeks, I was handling team meetings and market shopping."
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            By combining the <strong>top 1,000 spoken frequency blocks</strong> with on-device speech audio, learners gain spoken automaticity without translating in their head. The offline cache runs seamlessly across Cotonou and regional travels without mobile data.
          </p>

          <div className="pt-2 flex items-center gap-3 border-t border-white/10 text-xs text-slate-400">
            <div>
              <span className="font-extrabold text-white block">20 Guided Units</span>
              <span className="text-[10px] block">A1 ➔ B2 Fluency</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="font-extrabold text-white block">100% Offline Cache</span>
              <span className="text-[10px] block">Zero Data Needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-5 py-6 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 text-center">
          What Makes This Different
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <WifiOff className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-black text-white">Full Offline Autonomy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every lesson, native pronunciation, phonetic transcription, and dictionary search runs directly from phone storage.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <Volume2 className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-black text-white">Native Spoken Audio</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audio on every single word and dialogue. Speak before the answers reveal to train speed and automaticity.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <Languages className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-black text-white">Bidirectional Learning</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              English speakers learning French (🇬🇧➔🇫🇷) or French speakers learning English (🇫🇷➔🇬🇧). One tap switch.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <Zap className="w-5 h-5 text-sky-400" />
            <h4 className="text-sm font-black text-white">Turso Isolated Cloud Sync</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your siblings and students have strictly isolated accounts. Cloud sync preserves streaks whenever Wi-Fi returns.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA & Footer */}
      <footer className="p-6 text-center space-y-4 border-t border-white/10 mt-auto bg-slate-950">
        <div className="space-y-1">
          <p className="text-xs font-black text-white">Ready to start speaking French?</p>
          <p className="text-[11px] text-slate-400">Join your personalized learner workspace today.</p>
        </div>

        <button
          onClick={onGetStarted}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95"
        >
          Get Started Now
        </button>

        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-2">
          <span>PWA Ready</span>
          <span>•</span>
          <span>Turso Edge SQLite</span>
          <span>•</span>
          <span>DeepSeek AI</span>
        </div>
      </footer>
    </div>
  );
};
