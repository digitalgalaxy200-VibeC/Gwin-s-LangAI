import React, { useState } from 'react';
import { HIGH_FREQUENCY_5_BATCHES } from '../packs/french/curriculum';
import { audioEngine } from '../services/audioEngine';
import { InteractiveSentence } from './InteractiveSentence';
import { 
  Volume2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  BookOpen
} from 'lucide-react';

export const HighFrequencySpeakingLab: React.FC = () => {
  const [selectedBatchId, setSelectedBatchId] = useState<number>(1);
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);

  const activeBatch = HIGH_FREQUENCY_5_BATCHES.find(b => b.batchId === selectedBatchId) || HIGH_FREQUENCY_5_BATCHES[0];

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
      {/* Header Description */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-full">
            High-Frequency Speaking Engine
          </span>
          <span className="text-xs text-indigo-200 font-semibold">5-Word Spoken Batches</span>
        </div>
        <h2 className="text-lg font-bold">Lexique Spoken Frequency</h2>
        <p className="text-xs text-indigo-200 leading-relaxed">
          Learn the top French words ranked by real-life spoken usage. After each 5 words, immediately practice speaking full natural sentences constructed from them.
        </p>
      </div>

      {/* Batch Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {HIGH_FREQUENCY_5_BATCHES.map((batch) => (
          <button
            key={batch.batchId}
            onClick={() => setSelectedBatchId(batch.batchId)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
              selectedBatchId === batch.batchId
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Batch {batch.batchId}: #{batch.words[0].frequencyRank}–{batch.words[batch.words.length - 1].frequencyRank}
          </button>
        ))}
      </div>

      {/* Active 5 Words List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>{activeBatch.rangeLabel}</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">Tap word to hear</span>
        </div>

        <div className="divide-y divide-slate-100">
          {activeBatch.words.map((w) => {
            const isExpanded = expandedWordId === w.id;

            return (
              <div key={w.id} className="py-2.5 first:pt-0 last:pb-0">
                <div 
                  onClick={() => setExpandedWordId(isExpanded ? null : w.id)}
                  className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
                >
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

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => playWord(w.word, e)}
                      title="Listen word"
                      className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors active:scale-95"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Single Word Example */}
                {isExpanded && (
                  <div className="mt-2 ml-9 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Isolated Context</span>
                      <button
                        type="button"
                        onClick={(e) => playSentence(w.exampleSentenceFr, e)}
                        className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                    <InteractiveSentence 
                      sentence={w.exampleSentenceFr}
                      wordClassName="text-slate-800 text-xs"
                    />
                    <div className="text-xs text-slate-500">{w.exampleSentenceEn}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Spoken Combination Sentences (The Core Value) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Spoken Sentences
            </span>
            <h3 className="text-sm font-black text-slate-900 mt-1">
              Sentences Made From These 5 Words
            </h3>
          </div>
          <Sparkles className="w-5 h-5 text-emerald-500" />
        </div>

        <p className="text-xs text-slate-500">
          Listen, repeat, and speak these real combinations out loud:
        </p>

        <div className="space-y-3">
          {activeBatch.combinedSpeakingSentences.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2 hover:border-slate-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Scenario: {item.speakingPrompt}
                </span>
                <button
                  type="button"
                  onClick={() => playSentence(item.french)}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Listen</span>
                </button>
              </div>

              {/* Tappable sentence */}
              <InteractiveSentence 
                sentence={item.french}
                wordClassName="text-slate-900 text-sm font-black"
              />

              <div className="text-xs text-slate-600 font-medium pt-0.5">
                {item.english}
              </div>

              {/* Tags of words used */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold">Uses:</span>
                {item.usedWords.map((uw, i) => (
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
