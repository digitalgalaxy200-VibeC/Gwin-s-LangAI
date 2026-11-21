import React from 'react';
import { weaknessTracker } from '../services/weaknessTracker';
import { Zap, Target, Calendar, BookOpen, RotateCcw } from 'lucide-react';

interface WeeklyRhythmProps {
  userId: string;
  currentUnitNumber: number;
  completedCount: number;
  totalUnits: number;
  onStartReview: () => void;
  onGoToProgram: () => void;
}

function getDayOfWeekLabel(): { label: string; dayType: 'new' | 'review' | 'free' | 'rest'; emoji: string } {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // Mon–Thu: new material, Fri: review, Sat: free conversation, Sun: rest
  if (day >= 1 && day <= 4) return { label: 'New Material Day', dayType: 'new', emoji: '📖' };
  if (day === 5) return { label: 'Review Day', dayType: 'review', emoji: '🔄' };
  if (day === 6) return { label: 'Free Conversation Day', dayType: 'free', emoji: '🎙️' };
  return { label: 'Rest Day', dayType: 'rest', emoji: '😴' };
}

function getWeekNumber(userId: string): number {
  const key = `program_start_${userId}`;
  let startDateStr = localStorage.getItem(key);
  if (!startDateStr) {
    startDateStr = new Date().toISOString();
    localStorage.setItem(key, startDateStr);
  }
  const start = new Date(startDateStr);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
}

export const WeeklyRhythm: React.FC<WeeklyRhythmProps> = ({
  userId,
  currentUnitNumber,
  completedCount,
  totalUnits,
  onStartReview,
  onGoToProgram,
}) => {
  const { label, dayType, emoji } = getDayOfWeekLabel();
  const weekNum = getWeekNumber(userId);
  const weakWords = weaknessTracker.getWeakestWords(userId, 5);
  const mastery = weaknessTracker.getMasteryPercent(userId);
  const hasReviewData = weaknessTracker.hasReviewData(userId);

  return (
    <div className="space-y-3">
      {/* Today's card */}
      <div className={`rounded-3xl p-5 space-y-3 ${
        dayType === 'new' ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white' :
        dayType === 'review' ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' :
        dayType === 'free' ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white' :
        'bg-gradient-to-br from-slate-700 to-slate-800 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
            Week {weekNum} · {label}
          </div>
          <span className="text-2xl">{emoji}</span>
        </div>

        {dayType === 'new' && (
          <>
            <h3 className="text-lg font-black">Continue the Program</h3>
            <p className="text-xs opacity-80 leading-relaxed">
              Unit {currentUnitNumber} is next. Complete it to unlock the next level.
            </p>
            <button
              onClick={onGoToProgram}
              className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-sm font-black active:scale-95 transition-all"
            >
              Go to Unit {currentUnitNumber} →
            </button>
          </>
        )}

        {dayType === 'review' && (
          <>
            <h3 className="text-lg font-black">Review Day — Your Weak Words</h3>
            {hasReviewData ? (
              <>
                <div className="space-y-1">
                  {weakWords.slice(0, 4).map((w, i) => (
                    <div key={i} className="bg-white/15 rounded-xl px-3 py-1.5 text-xs font-bold">
                      {w.word} — {w.shownAnswer + w.wrongChoices} misses
                    </div>
                  ))}
                </div>
                <button
                  onClick={onStartReview}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-sm font-black active:scale-95 transition-all"
                >
                  Start Review Session →
                </button>
              </>
            ) : (
              <p className="text-xs opacity-80">Complete at least 1 unit first to build your review list.</p>
            )}
          </>
        )}

        {dayType === 'free' && (
          <>
            <h3 className="text-lg font-black">Free Conversation Day</h3>
            <p className="text-xs opacity-80 leading-relaxed">
              No hints. No scripts. Go to Practise and speak. Try to hold a 3-minute conversation with no English.
            </p>
            <button
              onClick={onGoToProgram}
              className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-sm font-black active:scale-95 transition-all"
            >
              Go to Practise →
            </button>
          </>
        )}

        {dayType === 'rest' && (
          <>
            <h3 className="text-lg font-black">Rest Day</h3>
            <p className="text-xs opacity-80 leading-relaxed">
              Listen to French media, podcasts or conversations around you in Benin. No study pressure today.
            </p>
          </>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Done</div>
          <div className="text-xl font-black text-indigo-600">{completedCount}</div>
          <div className="text-[10px] text-slate-400">of {totalUnits} units</div>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Mastery</div>
          <div className="text-xl font-black text-emerald-600">{mastery}%</div>
          <div className="text-[10px] text-slate-400">word retention</div>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Weak</div>
          <div className="text-xl font-black text-amber-600">{weakWords.length}</div>
          <div className="text-[10px] text-slate-400">words to fix</div>
        </div>
      </div>

      {/* Weekly schedule strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">This Week</div>
        <div className="flex gap-1.5">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
            const today = new Date().getDay();
            const dayIndex = i + 1 === 7 ? 0 : i + 1; // convert Mon-first to JS getDay
            const isToday = today === dayIndex;
            const isPast = today > dayIndex || (today === 0 && dayIndex < 6);
            const type = i < 4 ? 'new' : i === 4 ? 'review' : i === 5 ? 'free' : 'rest';
            const colors = {
              new: isToday ? 'bg-indigo-600 text-white' : isPast ? 'bg-indigo-100 text-indigo-500' : 'bg-slate-50 text-slate-400',
              review: isToday ? 'bg-amber-500 text-white' : isPast ? 'bg-amber-100 text-amber-500' : 'bg-slate-50 text-slate-400',
              free: isToday ? 'bg-emerald-600 text-white' : isPast ? 'bg-emerald-100 text-emerald-500' : 'bg-slate-50 text-slate-400',
              rest: isToday ? 'bg-slate-700 text-white' : isPast ? 'bg-slate-200 text-slate-500' : 'bg-slate-50 text-slate-300',
            };
            const icons = { new: '📖', review: '🔄', free: '🎙️', rest: '😴' };
            return (
              <div key={d} className={`flex-1 rounded-xl py-2 text-center transition-all ${colors[type]}`}>
                <div className="text-[8px] font-black">{d}</div>
                <div className="text-sm mt-0.5">{icons[type]}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-3 text-[9px] text-slate-400">
          <span>📖 New</span><span>🔄 Review</span><span>🎙️ Free talk</span><span>😴 Rest</span>
        </div>
      </div>

      {/* Weak words list (if any) */}
      {weakWords.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-amber-800">Your Weakest Words</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {weakWords.map((w, i) => (
              <span key={i} className="text-xs font-bold bg-white border border-amber-300 text-amber-800 px-2.5 py-1 rounded-xl">
                {w.word}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-amber-700">These will appear more often in your drills and Friday reviews.</p>
        </div>
      )}
    </div>
  );
};

// ── Weakness Review Unit Builder ───────────────────────────────
// Builds a mini offline review unit from the user's weakest words

import type { StructuredUnit } from '../data/structuredProgram';

export function buildWeaknessReviewUnit(userId: string): StructuredUnit | null {
  const weakWords = weaknessTracker.getWeakestWords(userId, 10);
  if (weakWords.length < 3) return null;

  const reviewWords = weakWords.slice(0, 8);

  return {
    id: 'unit_review',
    unitNumber: 0,
    title: 'Your Personal Review',
    subtitle: `${reviewWords.length} words you struggled with — built just for you`,
    icon: '🎯',
    stage: 'survival',
    track: 'A',
    estimatedMinutes: 20,
    blocks: [
      {
        type: 'warmup',
        durationMinutes: 5,
        instruction: 'These are the words you struggled with most. Speak each one before tapping to reveal.',
        reviewItems: reviewWords.map(w => ({ french: w.word, english: `(missed ${w.shownAnswer + w.wrongChoices} times)` })),
      },
      {
        type: 'drill',
        durationMinutes: 10,
        instruction: 'Speed round on your weak words. No hesitating — faster this time.',
        exercises: reviewWords.map(w => ({
          type: 'repeat' as const,
          instruction: 'Say it immediately without thinking',
          prompt: w.word,
          answer: w.word,
        })),
      },
      {
        type: 'recap',
        durationMinutes: 5,
        instruction: 'Review complete. These words are now reinforced.',
        canSayNow: reviewWords.map(w => w.word),
        wellDoneNote: 'Review sessions like this are what separate learners who plateau from learners who keep improving. Come back Friday for the next one.',
      },
    ],
  };
}

// Keep unused imports from causing lint errors
export { Zap, BookOpen, RotateCcw, Calendar };
