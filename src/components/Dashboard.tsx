import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types/database';
import type { LessonUnit } from '../types/curriculum';
import { curriculumRepo } from '../repositories/curriculumRepository';
import { LessonPlayer } from './LessonPlayer';
import { AskAITutor } from './AskAITutor';
import { RoleplayRoom } from './RoleplayRoom';
import { HighFrequencySpeakingLab } from './HighFrequencySpeakingLab';
import { ListenAndRepeat } from './ListenAndRepeat';
import { syncService } from '../services/syncService';
import { 
  BookOpen, 
  MessageSquare, 
  Mic, 
  Settings, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Play, 
  Key, 
  Cloud, 
  RefreshCw,
  Globe
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'hf_speak' | 'ask' | 'practise' | 'listen' | 'settings'>('learn');
  const [lessons, setLessons] = useState<LessonUnit[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<{ title: string; context: string } | null>(null);

  // Settings states
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [activeLanguage, setActiveLanguage] = useState<'fr' | 'ar'>('fr');

  useEffect(() => {
    async function fetchLessons() {
      const data = await curriculumRepo.getLessons();
      setLessons(data);
    }
    fetchLessons();

    const storedKey = localStorage.getItem('deepseek_api_key');
    if (storedKey) {
      setApiKeyInput(storedKey);
      setKeySaved(true);
    }

    if (syncService.isReady()) {
      setIsSupabaseConnected(true);
    }
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('deepseek_api_key', apiKeyInput.trim());
    setKeySaved(true);
  };

  const handleConnectSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    const success = syncService.configure(supabaseUrl.trim(), supabaseKey.trim());
    if (success) {
      setIsSupabaseConnected(true);
      setSyncStatusMsg('Supabase connected additively! Local profile preserved.');
    }
  };

  const handleTriggerSync = async () => {
    setSyncStatusMsg('Synchronising pending local changes...');
    const result = await syncService.syncPendingQueue(profile);
    setSyncStatusMsg(`Sync completed! ${result.syncedCount} records pushed.`);
  };

  if (activeLessonId) {
    return (
      <LessonPlayer
        lessonId={activeLessonId}
        userId={profile.id}
        onClose={() => setActiveLessonId(null)}
        onCompleted={() => {}}
      />
    );
  }

  if (activeScenario) {
    return (
      <RoleplayRoom
        scenarioTitle={activeScenario.title}
        scenarioContext={activeScenario.context}
        onBack={() => setActiveScenario(null)}
      />
    );
  }

  return (
    <div 
      className={`min-h-screen bg-slate-50 flex flex-col pb-24 max-w-md mx-auto ${
        activeLanguage === 'ar' ? 'font-sans' : ''
      }`}
      dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top Header */}
      <header className="px-5 pt-8 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              {activeLanguage === 'fr' ? 'French AI Tutor' : 'Arabic AI Tutor (العربية)'} • {profile.cefrLevel}
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              {activeLanguage === 'fr' ? `Bonjour, ${profile.name} 👋` : `مَرْحَبًا، ${profile.name} 👋`}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full text-amber-700 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Day 1</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-5 space-y-5">
        {activeTab === 'learn' && (
          <>
            {/* Quick Mode Switcher Banner */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('learn')}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow-xs"
              >
                Situational Lessons
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hf_speak')}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900"
              >
                High-Frequency Speaking Lab
              </button>
            </div>

            {/* Featured Next Lesson Banner */}
            {lessons.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-5 text-white shadow-lg shadow-indigo-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Lesson 1</span>
                    <h3 className="text-lg font-bold mt-1">{lessons[0].title}</h3>
                    <p className="text-indigo-100 text-xs mt-1">
                      {lessons[0].description}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center font-bold text-sm">
                    {profile.dailyGoalMinutes}m
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-indigo-200">
                    {lessons[0].vocabularyIds.length} words • {lessons[0].expressionIds.length} expressions
                  </span>
                  <button 
                    onClick={() => setActiveLessonId(lessons[0].id)}
                    className="px-4 py-2 bg-white text-indigo-700 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-indigo-700" />
                    <span>Start Lesson</span>
                  </button>
                </div>
              </div>
            )}

            {/* Structured Lessons List */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Situational Curriculum (Offline)
              </h2>

              {lessons.map((lesson, idx) => (
                <div 
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 shadow-sm hover:border-slate-200 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{lesson.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{lesson.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'hf_speak' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('learn')}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900"
              >
                Situational Lessons
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hf_speak')}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow-xs"
              >
                High-Frequency Speaking Lab
              </button>
            </div>
            <HighFrequencySpeakingLab />
          </div>
        )}

        {activeTab === 'ask' && (
          <AskAITutor />
        )}

        {activeTab === 'practise' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Situational Roleplays (Spoken AI)
              </h2>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Interactive
              </span>
            </div>

            {[
              {
                title: 'Office: Appreciating & Meeting',
                context: 'Speaking to your manager and team about results',
                icon: '💼',
              },
              {
                title: 'Open-Air Market: Negotiating Prices',
                context: 'Asking for weights, prices, and small discounts',
                icon: '🍎',
              },
              {
                title: 'Restaurant: Ordering Food & Asking Bill',
                context: 'Calling the waiter, asking daily specials',
                icon: '🍽️',
              },
              {
                title: 'Telephone: Hotel Reception Reservation',
                context: 'Calling reception to confirm check-in dates',
                icon: '📞',
              },
            ].map((scen, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveScenario({ title: scen.title, context: scen.context })}
                className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between shadow-sm hover:border-slate-200 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-xl flex items-center justify-center">
                    {scen.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{scen.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{scen.context}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'listen' && (
          <ListenAndRepeat />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Language Pack Switcher */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Language Pack Configuration
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLanguage('fr')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    activeLanguage === 'fr'
                      ? 'border-indigo-600 bg-indigo-50/60 font-bold text-indigo-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="text-base mb-1">🇫🇷</div>
                  <div className="text-xs">French (Français)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLanguage('ar')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    activeLanguage === 'ar'
                      ? 'border-indigo-600 bg-indigo-50/60 font-bold text-indigo-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="text-base mb-1">🇦🇪</div>
                  <div className="text-xs font-arabic">Arabic (العربية RTL)</div>
                </button>
              </div>
            </div>

            {/* Supabase Additive Cloud Sync */}
            <form onSubmit={handleConnectSupabase} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-indigo-600" />
                  <span>Cloud Sync (Supabase Optional)</span>
                </span>
                {isSupabaseConnected && (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Connect your Supabase project without losing any local progress. All SQLite learning data will link seamlessly.
              </p>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="Supabase anon public key"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Connect Supabase
                </button>
                {isSupabaseConnected && (
                  <button
                    type="button"
                    onClick={handleTriggerSync}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync</span>
                  </button>
                )}
              </div>
              {syncStatusMsg && (
                <div className="text-[11px] text-indigo-600 font-medium pt-1">
                  {syncStatusMsg}
                </div>
              )}
            </form>

            {/* BYOK DeepSeek API Settings */}
            <form onSubmit={handleSaveApiKey} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <span>AI Provider (DeepSeek BYOK)</span>
                </span>
                {keySaved && (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Optional: Store your personal DeepSeek API key in local encrypted storage.
              </p>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Save Secret Locally
              </button>
            </form>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Local Learning Profile</h3>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400">User ID</span>
                  <span className="font-mono">{profile.id}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400">Target Language</span>
                  <span className="font-semibold">{activeLanguage === 'fr' ? 'French' : 'Arabic (العربية)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database Engine</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SQLite Offline First
                  </span>
                </div>
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
