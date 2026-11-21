import React, { useState } from 'react';
import type { UserProfile } from '../types/database';
import { Sparkles, ArrowRight, BookOpen, Volume2, Globe } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [nativeLanguage] = useState('English');
  const [targetLanguage] = useState('French');
  const [cefrLevel, setCefrLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>('A1');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [learningReason, setLearningReason] = useState('Conversational Fluency');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onComplete({
      name: name.trim(),
      nativeLanguage,
      targetLanguage,
      cefrLevel,
      dailyGoalMinutes,
      learningReason,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bonjour ! Welcome to Polyglot</h1>
        <p className="text-slate-500 text-sm mt-2">
          Speak your way to proficiency. Offline-ready, zero fluff.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            What is your name?
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Your Starting French Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { level: 'A1', label: 'Beginner', desc: 'No French background' },
              { level: 'A2', label: 'Elementary', desc: 'Know basic phrases' },
              { level: 'B1', label: 'Intermediate', desc: 'Can express ideas' },
              { level: 'B2', label: 'Fluent', desc: 'Spontaneous speech' },
            ].map((item) => (
              <button
                key={item.level}
                type="button"
                onClick={() => setCefrLevel(item.level as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  cefrLevel === item.level
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-sm">{item.level} • {item.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Primary Motivation
          </label>
          <select
            value={learningReason}
            onChange={(e) => setLearningReason(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium bg-white"
          >
            <option value="Conversational Fluency">Real-life conversations (Travel & Social)</option>
            <option value="Professional & Workplace">Professional & Workplace French (Office)</option>
            <option value="Living in France">Living / Moving to a French-speaking country</option>
            <option value="Exam / Certification">DELF / TCF Preparation</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Daily Learning Goal
          </label>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDailyGoalMinutes(mins)}
                className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  dailyGoalMinutes === mins
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-6"
        >
          <span>Start Learning Locally</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> 100% Offline Ready</span>
        <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5" /> Audio Included</span>
        <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> SQLite Powered</span>
      </div>
    </div>
  );
};
