import React, { useState } from 'react';
import { NEWCOMER_SURVIVAL_GROUPS } from '../packs/french/newcomerCurriculum';
import { audioEngine } from '../services/audioEngine';
import { InteractiveSentence } from './InteractiveSentence';
import { 
  Volume2, 
  Sparkles, 
  PlaneTakeoff
} from 'lucide-react';

export const NewcomerSurvivalGuide: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(NEWCOMER_SURVIVAL_GROUPS[0].groupId);

  const activeGroup = NEWCOMER_SURVIVAL_GROUPS.find(g => g.groupId === selectedGroupId) || NEWCOMER_SURVIVAL_GROUPS[0];

  const playWord = (word: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    audioEngine.playFrench(word, 0.85);
  };

  const playSentence = (sentence: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    audioEngine.playFrench(sentence, 0.85);
  };

  return (
    <div className="space-y-5">
      {/* Real Immigrant / Arrival Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-5 shadow-lg border border-indigo-800/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <PlaneTakeoff className="w-3.5 h-3.5" />
            <span>Day 1 in France • Essential Survival</span>
          </span>
          <span className="text-xs text-indigo-200 font-bold">5 Focused Groups</span>
        </div>
        <h2 className="text-lg font-black tracking-tight">"Just Landed" High-Frequency Spoken French</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The absolute first words and sentences you need when stepping off a plane into a French-speaking country: identifying yourself, essential politeness, breaking the language barrier, finding transport, and buying water.
        </p>
      </div>

      {/* Group Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {NEWCOMER_SURVIVAL_GROUPS.map((grp) => (
          <button
            key={grp.groupId}
            onClick={() => setSelectedGroupId(grp.groupId)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
              selectedGroupId === grp.groupId
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>{grp.icon}</span>
            <span>{grp.title.split('.')[1] || grp.title}</span>
          </button>
        ))}
      </div>

      {/* Target Words in This Group */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              {activeGroup.title}
            </h3>
            <p className="text-xs text-slate-400">{activeGroup.subtitle}</p>
          </div>
          <span className="text-2xl">{activeGroup.icon}</span>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-100 pt-1">
          {activeGroup.words.map((w) => (
            <div key={w.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
                  #{w.frequencyRank}
                </span>
                <div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{w.word}</span>
                    <span className="text-[11px] font-mono font-normal text-slate-400">/{w.phonetic}/</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {w.translation}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => playWord(w.word, e)}
                title="Listen word"
                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Spoken Survival Sentences (Full Dialogues Made from These Words) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Real Spoken Dialogues
            </span>
            <h3 className="text-sm font-black text-slate-900 mt-1">
              Sentences You Can Say Right Away
            </h3>
          </div>
          <Sparkles className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="space-y-3">
          {activeGroup.survivalDialogues.map((dlg, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2.5 hover:border-slate-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Situation: {dlg.prompt}
                </span>
                <button
                  type="button"
                  onClick={() => playSentence(dlg.french)}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Listen</span>
                </button>
              </div>

              {/* Tappable Sentence with Instant Word Lookup */}
              <InteractiveSentence 
                sentence={dlg.french}
                wordClassName="text-slate-900 text-sm font-black"
              />

              <div className="text-xs text-slate-600 font-medium">
                {dlg.english}
              </div>

              {/* Used words tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold">Active words:</span>
                {dlg.usedWords.map((uw, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                    {uw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
