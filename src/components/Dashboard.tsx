import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types/database';
import type { LessonUnit } from '../types/curriculum';
import { curriculumRepo } from '../repositories/curriculumRepository';
import { LessonPlayer } from './LessonPlayer';
import { AskAITutor } from './AskAITutor';
import { RoleplayRoom } from './RoleplayRoom';
import { HighFrequencySpeakingLab } from './HighFrequencySpeakingLab';
import { NewcomerSurvivalGuide } from './NewcomerSurvivalGuide';
import { ListenAndRepeat } from './ListenAndRepeat';
import { StructuredProgram } from './StructuredProgram';
import { TranslationHub } from './TranslationHub';
import { WeeklyRhythm, buildWeaknessReviewUnit } from './WeeklyRhythm';
import { StructuredLessonConductor } from './StructuredLessonConductor';
import { tursoService, type TursoUser } from '../services/tursoService';
import { AuthModal } from './AuthModal';
import { SuperAdminDashboard } from './SuperAdminDashboard';
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
  RefreshCw,
  Globe,
  Zap,
  Languages,
  Database,
  LogIn,
  LogOut,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'program' | 'translate' | 'learn' | 'hf_speak' | 'newcomer' | 'ask' | 'practise' | 'listen' | 'settings'>('program');
  const [lessons, setLessons] = useState<LessonUnit[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<{ title: string; context: string } | null>(null);
  const [activeReviewUnit, setActiveReviewUnit] = useState<ReturnType<typeof buildWeaknessReviewUnit>>(null);

  // Settings states
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'fr' | 'ar'>('fr');

  // Turso Multi-Tenant Account states
  const [currentUser, setCurrentUser] = useState<TursoUser | null>(tursoService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [tursoUrlInput, setTursoUrlInput] = useState('');
  const [tursoTokenInput, setTursoTokenInput] = useState('');
  const [tursoSaved, setTursoSaved] = useState(tursoService.isConfigured());
  const [tursoSyncMsg, setTursoSyncMsg] = useState('');

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
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('deepseek_api_key', apiKeyInput.trim());
    setKeySaved(true);
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

  if (activeReviewUnit) {
    return (
      <StructuredLessonConductor
        unit={activeReviewUnit}
        userId={profile.id}
        cefrLevel={profile.cefrLevel}
        onClose={() => setActiveReviewUnit(null)}
        onCompleted={() => setActiveReviewUnit(null)}
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
            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>{currentUser ? `${currentUser.name} (${currentUser.nativeLang.toUpperCase()} ➔ ${currentUser.targetLang.toUpperCase()})` : 'Individual Learner'}</span>
              <span>•</span>
              <span>{currentUser ? currentUser.cefrLevel : profile.cefrLevel}</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 mt-0.5">
              {currentUser ? `Bonjour, ${currentUser.name} 👋` : `Bonjour, ${profile.name} 👋`}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                type="button"
                onClick={() => { tursoService.logout(); setCurrentUser(null); }}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all active:scale-95 text-xs font-bold flex items-center gap-1"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all active:scale-95 text-[11px] font-black flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-xl text-amber-700 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Day 1</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-5 space-y-5">

        {/* ── Structured Program tab ── */}
        {activeTab === 'program' && (
          <div className="space-y-4">
            <WeeklyRhythm
              userId={profile.id}
              currentUnitNumber={1}
              completedCount={0}
              totalUnits={20}
              onStartReview={() => {
                const reviewUnit = buildWeaknessReviewUnit(profile.id);
                if (reviewUnit) setActiveReviewUnit(reviewUnit);
              }}
              onGoToProgram={() => {}}
            />
            <StructuredProgram userId={profile.id} cefrLevel={profile.cefrLevel} />
          </div>
        )}

        {/* ── Offline Instant Translation Hub ── */}
        {activeTab === 'translate' && (
          <TranslationHub />
        )}

        {/* ── Learn-mode tab switcher (shown for all 3 learn sub-tabs) ── */}
        {(activeTab === 'learn' || activeTab === 'newcomer' || activeTab === 'hf_speak') && (
          <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('newcomer')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'newcomer' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛬 Day 1 Arrival
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hf_speak')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hf_speak' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Top Frequency
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('learn')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'learn' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Situations
            </button>
          </div>
        )}

        {activeTab === 'learn' && (
          <>
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

        {activeTab === 'newcomer' && (
          <NewcomerSurvivalGuide />
        )}

        {activeTab === 'hf_speak' && (
          <HighFrequencySpeakingLab />
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

            {/* Turso Cloud Database Connection */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Turso Database (Cloud SQLite)</span>
                </span>
                {tursoSaved && (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Connect your Turso edge database. Each family member or sibling logs in with their own account; their progress is strictly isolated.
              </p>
              <input
                type="text"
                value={tursoUrlInput}
                onChange={(e) => setTursoUrlInput(e.target.value)}
                placeholder="libsql://your-db-name.turso.io"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <input
                type="password"
                value={tursoTokenInput}
                onChange={(e) => setTursoTokenInput(e.target.value)}
                placeholder="Turso Auth Token"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const ok = tursoService.setConfig(tursoUrlInput, tursoTokenInput);
                    if (ok) {
                      setTursoSaved(true);
                      setTursoSyncMsg('Turso database connected successfully!');
                    } else {
                      setTursoSyncMsg('Failed to connect. Check URL and token.');
                    }
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
                >
                  Save Turso Credentials
                </button>
                {tursoSaved && currentUser && (
                  <button
                    type="button"
                    onClick={async () => {
                      setTursoSyncMsg('Pushing offline progress to your Turso cloud...');
                      const res = await tursoService.syncPendingQueue(currentUser.id);
                      if (res.success) {
                        setTursoSyncMsg(`Synced! ${res.pushedCount} offline records pushed.`);
                      } else {
                        setTursoSyncMsg(`Sync failed: ${res.error}`);
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Now</span>
                  </button>
                )}
              </div>
              {tursoSyncMsg && (
                <div className="text-[11px] text-indigo-600 font-bold pt-1">
                  {tursoSyncMsg}
                </div>
              )}
            </div>

            {/* Super Admin Dashboard Trigger */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-5 text-white shadow-md flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Master Administrator</span>
                </div>
                <h4 className="text-sm font-black text-white">Super Admin Portal</h4>
                <p className="text-[11px] text-slate-300">
                  Manage Turso credentials & view all learner consistency stats.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-all shrink-0 ml-2"
              >
                Open Admin
              </button>
            </div>

            {/* Individual Account Status */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Current Learner Account</span>
                </span>
                {currentUser ? (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Signed In
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                    Guest Mode
                  </span>
                )}
              </div>
              {currentUser ? (
                <div className="text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-400">Account Name</span>
                    <span className="font-bold text-slate-900">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-400">Email</span>
                    <span className="font-mono text-slate-800">{currentUser.email}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-400">Mode</span>
                    <span className="font-extrabold text-indigo-600">
                      {currentUser.nativeLang === 'en' ? '🇬🇧 English ➔ 🇫🇷 French' : '🇫🇷 Français ➔ 🇬🇧 English'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { tursoService.logout(); setCurrentUser(null); }}
                    className="w-full py-2 bg-slate-100 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
                  >
                    Switch Account / Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Sign in or register an account so your progress syncs to your personal Turso database profile.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all"
                  >
                    Sign In or Create Account
                  </button>
                </div>
              )}
            </div>

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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 px-2 py-2 z-20 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('program')}
            className={`flex flex-col items-center py-1 px-1.5 transition-colors ${
              activeTab === 'program' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Program</span>
          </button>

          <button
            onClick={() => setActiveTab('translate')}
            className={`flex flex-col items-center py-1 px-1.5 transition-colors ${
              activeTab === 'translate' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Languages className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Translate</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center py-1 px-1.5 transition-colors ${
              activeTab === 'learn' || activeTab === 'newcomer' || activeTab === 'hf_speak' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Explore</span>
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

      {/* Turso Multi-Tenant Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Super Admin Dashboard Modal (Protected by Master PIN) */}
      <SuperAdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
};
