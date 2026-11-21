import React, { useState } from 'react';
import type { UserProfile } from '../types/database';
import { 
  BookOpen, 
  MessageSquare, 
  Mic, 
  Settings, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Volume2
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'ask' | 'practise' | 'listen' | 'settings'>('learn');

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 max-w-md mx-auto">
      {/* Top Header */}
      <header className="px-5 pt-8 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              French AI Tutor • {profile.cefrLevel}
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Bonjour, {profile.name} 👋
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full text-amber-700 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Day 1 Streak</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-5 space-y-5">
        {activeTab === 'learn' && (
          <>
            {/* Daily Goal Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-5 text-white shadow-lg shadow-indigo-100">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Today's Focus</span>
                  <h3 className="text-lg font-bold mt-1">Appreciating Someone's Work</h3>
                  <p className="text-indigo-100 text-xs mt-1">
                    Master polite office affirmations & feedback expressions.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center font-bold text-sm">
                  0/{profile.dailyGoalMinutes}m
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-indigo-200">5 practical expressions</span>
                <button 
                  onClick={() => speakText("Vous avez fait du très bon travail.")}
                  className="px-4 py-2 bg-white text-indigo-700 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Example</span>
                </button>
              </div>
            </div>

            {/* Quick Learning Pillars */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Curriculum Pillars</h2>
              
              <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 shadow-sm hover:border-slate-200 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
                  50
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">High-Frequency Vocab</h4>
                  <p className="text-xs text-slate-500">Tier 1: Top 50 survival words in practical context</p>
                </div>
                <div className="text-xs font-bold text-slate-400">0/50</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 shadow-sm hover:border-slate-200 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
                  Être
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Conjugation Academy</h4>
                  <p className="text-xs text-slate-500">Être, Avoir, Faire & Aller in real sentences</p>
                </div>
                <div className="text-xs font-bold text-slate-400">0/12</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 shadow-sm hover:border-slate-200 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base">
                  🗣️
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Everyday Expressions</h4>
                  <p className="text-xs text-slate-500">Polite greetings, market requests & asking directions</p>
                </div>
                <div className="text-xs font-bold text-slate-400">0/25</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'ask' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Ask AI (Phase 3 Ready)</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
              Ask in mixed French and English: <br />
              <span className="italic text-slate-600">"Bonjour, je voudrais parler avec... how do I say manager?"</span>
            </p>
          </div>
        )}

        {activeTab === 'practise' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Roleplay Scenarios</h2>
            {['Office Meeting', 'Market Negotiation', 'Calling Reception', 'Ordering at a Restaurant'].map((scenario, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{scenario}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Spoken interactive simulation</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">Phase 3</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'listen' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Listen & Repeat</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
              Phoneme-level pronunciation evaluation and speech rhythm practice.
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Local Profile Info</h3>
            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">User ID</span>
                <span className="font-mono">{profile.id}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Target Language</span>
                <span className="font-semibold">{profile.targetLanguage}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Storage Mode</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Local (SQLite)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cloud Sync (Supabase)</span>
                <span className="text-slate-400">Optional (Phase 4)</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 px-4 py-2 z-20 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center py-1 px-2 transition-colors ${
              activeTab === 'learn' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Learn</span>
          </button>

          <button
            onClick={() => setActiveTab('ask')}
            className={`flex flex-col items-center py-1 px-2 transition-colors ${
              activeTab === 'ask' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Ask AI</span>
          </button>

          <button
            onClick={() => setActiveTab('practise')}
            className={`flex flex-col items-center py-1 px-2 transition-colors ${
              activeTab === 'practise' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Practise</span>
          </button>

          <button
            onClick={() => setActiveTab('listen')}
            className={`flex flex-col items-center py-1 px-2 transition-colors ${
              activeTab === 'listen' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Listen</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center py-1 px-2 transition-colors ${
              activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
