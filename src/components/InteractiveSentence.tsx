import React, { useState } from 'react';
import { lookupFrenchWord } from '../services/wordLookup';
import type { WordGlossaryEntry } from '../services/wordLookup';
import { audioEngine } from '../services/audioEngine';
import { Volume2, X } from 'lucide-react';

interface InteractiveSentenceProps {
  sentence: string;
  className?: string;
  wordClassName?: string;
}

export const InteractiveSentence: React.FC<InteractiveSentenceProps> = ({
  sentence,
  className = '',
  wordClassName = '',
}) => {
  const [selectedWord, setSelectedWord] = useState<WordGlossaryEntry | null>(null);

  // Split sentence into words and whitespace/punctuation
  const tokens = sentence.split(/(\s+|[.,!?;:()«»"]+)/);

  const handleWordClick = (token: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = token.replace(/[.,!?;:()«»"\s]/g, '').trim();
    if (!clean) return;

    const entry = lookupFrenchWord(clean);
    setSelectedWord(entry);
    // Instant phonetic audio playback on tap
    audioEngine.playFrench(entry.word, 0.85);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Tappable Sentence Tokens */}
      <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1">
        {tokens.map((token, idx) => {
          const isWord = /[a-zA-ZÀ-ÿ’']/.test(token.trim());

          if (!isWord) {
            return (
              <span key={idx} className="text-slate-400">
                {token}
              </span>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleWordClick(token, e)}
              className={`inline-block px-1 py-0.5 rounded-md hover:bg-indigo-100 hover:text-indigo-900 active:bg-indigo-200 cursor-pointer border-b border-dashed border-indigo-200/80 transition-all font-bold ${wordClassName}`}
            >
              {token}
            </button>
          );
        })}
      </div>

      {/* Floating Word Card Sheet (Mobile Friendly) */}
      {selectedWord && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="mt-3 p-3.5 bg-indigo-950 text-white rounded-2xl shadow-xl border border-indigo-800/80 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 z-20"
        >
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">
                {selectedWord.word}
              </span>
              {selectedWord.phonetic && (
                <span className="text-xs font-mono text-indigo-300">
                  /{selectedWord.phonetic}/
                </span>
              )}
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-indigo-800/80 text-indigo-200 rounded-md">
                {selectedWord.partOfSpeech}
              </span>
            </div>
            <div className="text-xs text-indigo-100 font-medium truncate">
              {selectedWord.translation}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => audioEngine.playFrench(selectedWord.word, 0.8)}
              title="Repeat pronunciation"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl shadow-md transition-all flex items-center gap-1"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedWord(null)}
              className="p-2 text-indigo-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
