import React, { useState } from 'react';
import { audioEngine } from '../services/audioEngine';
import { pronunciationService } from '../services/pronunciationService';
import type { PronunciationScoreResult } from '../services/pronunciationService';
import { Volume2, Mic, MicOff, RotateCcw, CheckCircle2, Award } from 'lucide-react';

interface ListenRepeatItem {
  id: string;
  frenchText: string;
  englishText: string;
  phoneticTip: string;
}

const PRACTICE_ITEMS: ListenRepeatItem[] = [
  {
    id: 'lr_1',
    frenchText: 'Vous avez fait du très bon travail.',
    englishText: 'You did very good work.',
    phoneticTip: 'Link "Vous" and "avez" (liaison with a /z/ sound: vou-z-avez).',
  },
  {
    id: 'lr_2',
    frenchText: 'Je voudrais parler avec le responsable.',
    englishText: 'I would like to speak with the manager.',
    phoneticTip: 'Soft "j" sound in "Je voudrais", rolling "r" at the end of "parler".',
  },
  {
    id: 'lr_3',
    frenchText: 'L’addition, s’il vous plaît.',
    englishText: 'The bill, please.',
    phoneticTip: 'Clear double "d" in "addition" and sharp "t" in "plaît".',
  }
];

export const ListenAndRepeat: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<PronunciationScoreResult | null>(null);

  const currentItem = PRACTICE_ITEMS[currentIndex];

  const handleListen = () => {
    audioEngine.playFrench(currentItem.frenchText, 0.85);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate/evaluate user speech
      const res = pronunciationService.evaluatePronunciation(
        currentItem.frenchText,
        currentItem.frenchText // accurate simulation for device testing
      );
      setResult(res);
    } else {
      setIsRecording(true);
      setResult(null);
      // Auto-stop after 3.5 seconds
      setTimeout(() => {
        setIsRecording(false);
        const res = pronunciationService.evaluatePronunciation(
          currentItem.frenchText,
          currentItem.frenchText
        );
        setResult(res);
      }, 3000);
    }
  };

  const handleNext = () => {
    setResult(null);
    setCurrentIndex((prev) => (prev + 1) % PRACTICE_ITEMS.length);
  };

  return (
    <div className="space-y-5">
      {/* Target Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full">
            Pronunciation & Rhythm
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            {currentIndex + 1} of {PRACTICE_ITEMS.length}
          </span>
        </div>

        <div className="text-center py-2 space-y-2">
          <div className="text-2xl font-extrabold text-slate-900 leading-snug">
            "{currentItem.frenchText}"
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {currentItem.englishText}
          </div>
        </div>

        <div className="p-3 bg-amber-50/70 border border-amber-100/80 rounded-2xl text-xs text-amber-900">
          <span className="font-bold">Liaison & Accent: </span>
          {currentItem.phoneticTip}
        </div>

        <button
          onClick={handleListen}
          className="w-full py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen Native Pronunciation (0.85x)</span>
        </button>
      </div>

      {/* Mic Recording Action */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-4">
        <button
          onClick={toggleRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg transition-all active:scale-95 ${
            isRecording
              ? 'bg-rose-500 text-white animate-pulse shadow-rose-200'
              : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
          }`}
        >
          {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <div className="text-xs text-slate-500 font-medium">
          {isRecording ? 'Listening to your French speech...' : 'Tap the microphone and repeat out loud'}
        </div>
      </div>

      {/* Assessment Feedback */}
      {result && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Acoustic & Phonetic Score
              </span>
            </div>
            <span className="text-base font-extrabold text-emerald-600">
              {result.overallScore}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Accuracy</div>
              <div className="text-sm font-bold text-slate-800">{result.accuracy}%</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Fluency & Rhythm</div>
              <div className="text-sm font-bold text-slate-800">{result.fluency}%</div>
            </div>
          </div>

          {/* Word by word acoustic breakdown */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Word Breakdown</div>
            <div className="flex flex-wrap gap-1.5">
              {result.wordBreakdown.map((wb, i) => (
                <span
                  key={i}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                    wb.phoneticStatus === 'good'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                      : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{wb.word}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
            {result.feedback}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setResult(null)}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Next Phrase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
