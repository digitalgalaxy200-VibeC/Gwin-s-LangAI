import React, { useState, useEffect } from 'react';
import type { LessonUnit, VocabularyItem, VerbConjugationItem, SituationalExpression } from '../types/curriculum';
import { curriculumRepo } from '../repositories/curriculumRepository';
import { audioEngine } from '../services/audioEngine';
import { Volume2, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

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

  // Combine items into steps
  // 1. Vocabulary items
  // 2. Conjugation items
  // 3. Situational expressions
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

  const playActiveSound = () => {
    if (!activeItem) return;
    if (activeItem.type === 'vocab') {
      audioEngine.playFrench(activeItem.data.word, playbackSpeed);
    } else if (activeItem.type === 'conj') {
      audioEngine.playFrench(activeItem.data.exampleSentenceFr, playbackSpeed);
    } else if (activeItem.type === 'expr') {
      audioEngine.playFrench(activeItem.data.frenchText, playbackSpeed);
    }
  };

  const playExampleSentence = (sentence: string) => {
    audioEngine.playFrench(sentence, playbackSpeed);
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Completed lesson
      await curriculumRepo.saveLessonProgress({
        userId,
        lessonId,
        completed: true,
        score: 100,
        lastAttemptAt: new Date().toISOString(),
        repetitionStage: 1,
        nextReviewAt: new Date(Date.now() + 86400000).toISOString(), // 24h
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
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto">
      {/* Top Header & Progress Bar */}
      <div className="bg-white px-5 pt-6 pb-4 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={onClose} 
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-xs font-bold text-slate-700 tracking-tight text-center truncate max-w-[200px]">
            {lesson.title}
          </div>
          <button
            onClick={toggleSpeed}
            className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200"
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${Math.min(100, ((currentStep) / (totalSteps || 1)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard / Learning Content */}
      <div className="flex-1 px-4 py-6 flex flex-col justify-center">
        {!isFinished && activeItem && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                {activeItem.type === 'vocab' && 'Vocabulary'}
                {activeItem.type === 'conj' && 'Conjugation Academy'}
                {activeItem.type === 'expr' && 'Situational Expression'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {currentStep + 1} of {totalSteps}
              </span>
            </div>

            {/* Vocab View */}
            {activeItem.type === 'vocab' && (
              <div className="text-center py-4 space-y-3">
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeItem.data.word}
                </div>
                <div className="text-xs font-mono text-indigo-600 bg-indigo-50/50 inline-block px-3 py-1 rounded-lg">
                  /{activeItem.data.phonetic}/
                </div>
                <div className="text-lg font-semibold text-slate-600">
                  {activeItem.data.translation}
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 text-left bg-slate-50 p-4 rounded-2xl relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Example in context
                    </span>
                    <button
                      type="button"
                      onClick={() => playExampleSentence(activeItem.data.exampleSentenceFr)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Example</span>
                    </button>
                  </div>
                  <div className="text-sm font-bold text-slate-800 leading-snug">
                    {activeItem.data.exampleSentenceFr}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {activeItem.data.exampleSentenceEn}
                  </div>
                </div>
              </div>
            )}

            {/* Conjugation View */}
            {activeItem.type === 'conj' && (
              <div className="space-y-4 py-2">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase">Verb: {activeItem.data.infinitive}</div>
                  <div className="text-2xl font-bold text-indigo-700 mt-1">
                    {activeItem.data.pronoun} {activeItem.data.conjugatedForm}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {activeItem.data.tense.replace('_', ' ')}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Everyday Sentence
                    </span>
                    <button
                      type="button"
                      onClick={() => playExampleSentence(activeItem.data.exampleSentenceFr)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Sentence</span>
                    </button>
                  </div>
                  <div className="text-base font-bold text-slate-900 leading-snug">
                    {activeItem.data.exampleSentenceFr}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {activeItem.data.exampleSentenceEn}
                  </div>
                </div>
              </div>
            )}

            {/* Situational Expression View */}
            {activeItem.type === 'expr' && (
              <div className="space-y-4 py-2">
                <div className="text-center">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Situation: {activeItem.data.situation} ({activeItem.data.formality})
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">
                    "{activeItem.data.frenchText}"
                  </div>
                  <div className="text-sm font-medium text-slate-600 mt-1">
                    {activeItem.data.englishText}
                  </div>
                </div>

                {activeItem.data.notes && (
                  <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100 text-xs text-amber-900 flex gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{activeItem.data.notes}</span>
                  </div>
                )}
              </div>
            )}

            {/* Audio Button */}
            <button
              onClick={playActiveSound}
              className="w-full py-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Volume2 className="w-5 h-5 text-indigo-600" />
              <span>Tap to Listen ({playbackSpeed}x)</span>
            </button>
          </div>
        )}

        {isFinished && (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Félicitations !</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              You completed <span className="font-bold text-slate-700">{lesson.title}</span>. All expressions are saved to your local offline library.
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
                <span>Repeat Lesson</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      {!isFinished && (
        <div className="p-4 bg-white border-t border-slate-100">
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>{currentStep === totalSteps - 1 ? 'Finish Lesson' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
