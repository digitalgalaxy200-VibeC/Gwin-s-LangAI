import React, { useState, useEffect } from 'react';
import type { LessonUnit, VocabularyItem, VerbConjugationItem, SituationalExpression } from '../types/curriculum';
import { curriculumRepo } from '../repositories/curriculumRepository';
import { audioEngine } from '../services/audioEngine';
import { Volume2, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Sparkles, X } from 'lucide-react';

interface LessonPlayerProps {
  lessonId: string;
  userId: string;
  onClose: () => void;
  onCompleted: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lessonId,
  userId,
  onClose,
  onCompleted,
}) => {
  const [lesson, setLesson] = useState<LessonUnit | null>(null);
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [conjugationList, setConjugationList] = useState<VerbConjugationItem[]>([]);
  const [expressionList, setExpressionList] = useState<SituationalExpression[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);

  useEffect(() => {
    async function loadLessonData() {
      const l = await curriculumRepo.getLessonById(lessonId);
      if (l) {
        setLesson(l);
        const [v, c, e] = await Promise.all([
          curriculumRepo.getVocabularyByIds(l.vocabularyIds),
          l.conjugationIds ? curriculumRepo.getConjugationsByIds(l.conjugationIds) : Promise.resolve([]),
          curriculumRepo.getExpressionsByIds(l.expressionIds),
        ]);
        setVocabList(v);
        setConjugationList(c);
        setExpressionList(e);
      }
    }
    loadLessonData();
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  type StepItem = 
    | { type: 'vocab'; data: VocabularyItem }
    | { type: 'conj'; data: VerbConjugationItem }
    | { type: 'expr'; data: SituationalExpression };

  const steps: StepItem[] = [
    ...vocabList.map(v => ({ type: 'vocab' as const, data: v })),
    ...conjugationList.map(c => ({ type: 'conj' as const, data: c })),
    ...expressionList.map(e => ({ type: 'expr' as const, data: e })),
  ];

  const totalSteps = steps.length;
  const isFinished = currentStep >= totalSteps;
  const activeItem = steps[currentStep];

  const playSound = (text: string) => {
    audioEngine.playFrench(text, playbackSpeed);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await curriculumRepo.saveLessonProgress({
        userId,
        lessonId,
        completed: true,
        score: 100,
        lastAttemptAt: new Date().toISOString(),
        repetitionStage: 1,
        nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
      });
      setCurrentStep(totalSteps);
      onCompleted();
    }
  };

  const toggleSpeed = () => {
    const nextSpeed = playbackSpeed === 0.9 ? 0.75 : playbackSpeed === 0.75 ? 1.0 : 0.9;
    setPlaybackSpeed(nextSpeed);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto">
      {/* Top Header: Close, Progress, and Speed */}
      <header className="bg-white px-4 pt-5 pb-3 border-b border-slate-200/80 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose} 
            title="Exit lesson"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Bar with step text */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-slate-400">
              <span className="truncate max-w-[140px] text-slate-700 font-extrabold">{lesson.title}</span>
              <span>{Math.min(currentStep + 1, totalSteps)} / {totalSteps}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, ((currentStep + (isFinished ? 1 : 0)) / (totalSteps || 1)) * 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={toggleSpeed}
            title="Toggle playback speed"
            className="text-xs font-bold px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            {playbackSpeed}x
          </button>
        </div>
      </header>

      {/* Main Study Card */}
      <main className="flex-1 px-4 py-5 flex flex-col justify-center">
        {!isFinished && activeItem && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-sm space-y-6">
            {/* Card Category Tag */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                {activeItem.type === 'vocab' && 'Key Vocabulary'}
                {activeItem.type === 'conj' && 'Conjugation in Action'}
                {activeItem.type === 'expr' && 'Spoken Situational Phrase'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {activeItem.type === 'expr' ? activeItem.data.situation : activeItem.type === 'conj' ? activeItem.data.infinitive : activeItem.data.partOfSpeech}
              </span>
            </div>

            {/* Content: Vocab */}
            {activeItem.type === 'vocab' && (
              <div className="space-y-5">
                {/* Primary target phrase with inline speaker */}
                <div className="text-center pt-2 pb-1 space-y-2">
                  <div className="inline-flex items-center justify-center gap-3">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {activeItem.data.word}
                    </span>
                    <button
                      type="button"
                      onClick={() => playSound(activeItem.data.word)}
                      title="Listen word"
                      className="p-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl shadow-md shadow-indigo-200 transition-all"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-xs font-mono text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-lg">
                    /{activeItem.data.phonetic}/
                  </div>

                  <div className="text-base font-semibold text-slate-600 pt-1">
                    {activeItem.data.translation}
                  </div>
                </div>

                {/* Contextual Sentence Container with its own contextual audio button */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Example in Context
                    </span>
                    <button
                      type="button"
                      onClick={() => playSound(activeItem.data.exampleSentenceFr)}
                      className="p-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
                    >
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold">Listen</span>
                    </button>
                  </div>
                  <div className="text-sm font-bold text-slate-900 leading-snug">
                    {activeItem.data.exampleSentenceFr}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {activeItem.data.exampleSentenceEn}
                  </div>
                </div>
              </div>
            )}

            {/* Content: Conjugation */}
            {activeItem.type === 'conj' && (
              <div className="space-y-5">
                <div className="text-center pt-2 pb-1 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Infinitive: <span className="text-indigo-600 font-extrabold">{activeItem.data.infinitive}</span> ({activeItem.data.translation})
                  </div>
                  <div className="inline-flex items-center justify-center gap-3">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {activeItem.data.pronoun} {activeItem.data.conjugatedForm}
                    </span>
                    <button
                      type="button"
                      onClick={() => playSound(`${activeItem.data.pronoun} ${activeItem.data.conjugatedForm}`)}
                      className="p-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl shadow-md shadow-indigo-200 transition-all"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 font-medium capitalize">
                    {activeItem.data.tense.replace('_', ' ')}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Everyday Spoken Sentence
                    </span>
                    <button
                      type="button"
                      onClick={() => playSound(activeItem.data.exampleSentenceFr)}
                      className="p-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
                    >
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold">Listen</span>
                    </button>
                  </div>
                  <div className="text-sm font-bold text-slate-900 leading-snug">
                    {activeItem.data.exampleSentenceFr}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {activeItem.data.exampleSentenceEn}
                  </div>
                </div>
              </div>
            )}

            {/* Content: Situational Expression */}
            {activeItem.type === 'expr' && (
              <div className="space-y-4 pt-2">
                <div className="text-center space-y-3">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {activeItem.data.situation} • {activeItem.data.formality}
                  </div>

                  <div className="inline-flex items-center justify-center gap-3">
                    <span className="text-2xl font-black text-slate-900 leading-snug">
                      "{activeItem.data.frenchText}"
                    </span>
                    <button
                      type="button"
                      onClick={() => playSound(activeItem.data.frenchText)}
                      className="p-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl shadow-md shadow-indigo-200 transition-all shrink-0"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-sm font-medium text-slate-600">
                    {activeItem.data.englishText}
                  </div>
                </div>

                {activeItem.data.notes && (
                  <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl text-xs text-amber-900 flex gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{activeItem.data.notes}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Completion Celebration Card */}
        {isFinished && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Félicitations !</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              You completed <span className="font-bold text-slate-700">{lesson.title}</span>. All phrases are saved to your offline spaced-repetition library.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => setCurrentStep(0)}
                className="w-full py-3 rounded-2xl text-slate-500 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Again</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Navigation Bar (Thumb Zone) */}
      {!isFinished && (
        <footer className="p-4 bg-white border-t border-slate-200/80 sticky bottom-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-5 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${
                currentStep === 0
                  ? 'opacity-30 text-slate-400 cursor-not-allowed bg-slate-50'
                  : 'bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
            >
              <span>{currentStep === totalSteps - 1 ? 'Complete Lesson' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
