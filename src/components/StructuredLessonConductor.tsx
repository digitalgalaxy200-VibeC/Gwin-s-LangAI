import React, { useState, useEffect, useCallback, useRef } from 'react';
import type {
  StructuredUnit,
  LessonBlock,
  WarmupBlock,
  InputBlock,
  DrillBlock,
  RoleplayBlock,
  CorrectionBlock,
  RecapBlock,
} from '../data/structuredProgram';
import { audioEngine } from '../services/audioEngine';
import { InteractiveSentence } from './InteractiveSentence';
import { weaknessTracker } from '../services/weaknessTracker';
import { aiRoleplayService } from '../services/aiRoleplay';
import type { AIRoleplayMessage } from '../services/aiRoleplay';
import {
  Volume2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Eye,
  Mic,
  Star,
  ArrowLeft,
  Timer,
  Sparkles,
  Loader2,
} from 'lucide-react';

// ── Props ─────────────────────────────────────────────────────

interface LessonConductorProps {
  unit: StructuredUnit;
  userId?: string;
  cefrLevel?: string;
  onClose: () => void;
  onCompleted: (unitId: string) => void;
}

// ── Block step tracker ────────────────────────────────────────

type DrillState = 'waiting' | 'revealed' | 'correct' | 'wrong';
type RoleplayStep = 'show_app' | 'waiting_you' | 'reveal_you' | 'ai_loading' | 'ai_response';

// ── Block label config ────────────────────────────────────────

const BLOCK_META: Record<LessonBlock['type'], { label: string; icon: string; color: string }> = {
  warmup:     { label: 'Warm-Up',    icon: '🔄', color: 'bg-amber-500'  },
  input:      { label: 'New Words',  icon: '📖', color: 'bg-indigo-600' },
  drill:      { label: 'Drill',      icon: '⚡', color: 'bg-violet-600' },
  roleplay:   { label: 'Role-Play',  icon: '🎭', color: 'bg-emerald-600'},
  correction: { label: 'Correction', icon: '✅', color: 'bg-rose-600'   },
  recap:      { label: 'Recap',      icon: '🏆', color: 'bg-slate-800'  },
};

// ── Main Conductor ────────────────────────────────────────────

export const StructuredLessonConductor: React.FC<LessonConductorProps> = ({
  unit,
  userId = 'local_user',
  cefrLevel = 'A1',
  onClose,
  onCompleted,
}) => {
  const [blockIndex, setBlockIndex] = useState(0);

  // per-block sub-state
  const [warmupIdx, setWarmupIdx]       = useState(0);
  const [warmupRevealed, setWarmupRevealed] = useState(false);

  const [inputIdx, setInputIdx]         = useState(0);
  const [inputTab, setInputTab]         = useState<'words' | 'chunks'>('words');

  const [drillIdx, setDrillIdx]         = useState(0);
  const [drillState, setDrillState]     = useState<DrillState>('waiting');
  const [drillChoice, setDrillChoice]   = useState<string | null>(null);
  const [drillScore, setDrillScore]     = useState({ correct: 0, total: 0 });

  // Speed drill timer
  const [drillTimer, setDrillTimer]     = useState(0);
  const drillTimerRef                   = useRef<ReturnType<typeof setInterval> | null>(null);

  const [roleplayStep, setRoleplayStep]   = useState<RoleplayStep>('show_app');
  const [roleplayExIdx, setRoleplayExIdx] = useState(0);
  const [aiResponse, setAiResponse]       = useState<{ french: string; english: string; correction?: string } | null>(null);
  const aiHistoryRef                      = useRef<AIRoleplayMessage[]>([]);

  const [isCompleted, setIsCompleted]   = useState(false);

  const block = unit.blocks[blockIndex];
  const totalBlocks = unit.blocks.length;
  const progressPct = Math.round(((blockIndex) / totalBlocks) * 100);

  // Reset sub-state whenever block changes
  useEffect(() => {
    setWarmupIdx(0);
    setWarmupRevealed(false);
    setInputIdx(0);
    setInputTab('words');
    setDrillIdx(0);
    setDrillState('waiting');
    setDrillChoice(null);
    setRoleplayExIdx(0);
    setRoleplayStep('show_app');
    setAiResponse(null);
    aiHistoryRef.current = [];
    setDrillTimer(0);
    if (drillTimerRef.current) clearInterval(drillTimerRef.current);
  }, [blockIndex]);

  // Speed drill timer — starts when drill card is waiting
  useEffect(() => {
    if (block?.type === 'drill' && drillState === 'waiting') {
      setDrillTimer(0);
      drillTimerRef.current = setInterval(() => setDrillTimer(t => t + 1), 1000);
    } else {
      if (drillTimerRef.current) clearInterval(drillTimerRef.current);
    }
    return () => { if (drillTimerRef.current) clearInterval(drillTimerRef.current); };
  }, [block?.type, drillState, drillIdx]);

  const goNextBlock = useCallback(() => {
    if (blockIndex + 1 >= totalBlocks) {
      setIsCompleted(true);
      onCompleted(unit.id);
    } else {
      setBlockIndex(b => b + 1);
    }
  }, [blockIndex, totalBlocks, unit.id, onCompleted]);

  const play = (text: string) => audioEngine.playFrench(text, 0.9);

  // ── AI Roleplay: fetch live response ─────────────────────────
  const fetchAiResponse = useCallback(async (b: RoleplayBlock, userLine: string) => {
    if (!aiRoleplayService.isAvailable()) return;
    setRoleplayStep('ai_loading');
    const weakWords = weaknessTracker.getWeakestWords(userId, 5).map(w => w.word);
    const response = await aiRoleplayService.getResponse(
      b.scenario, cefrLevel, weakWords, aiHistoryRef.current, userLine,
    );
    if (response.source === 'ai' && response.french) {
      aiHistoryRef.current = [
        ...aiHistoryRef.current,
        { role: 'user', content: userLine },
        { role: 'assistant', content: response.french },
      ];
      setAiResponse(response);
      setRoleplayStep('ai_response');
      play(response.french);
    } else {
      setRoleplayStep('reveal_you');
    }
  }, [userId, cefrLevel]);

  // ── Render: Progress Bar & Header ─────────────────────────

  const renderHeader = () => {
    const meta = BLOCK_META[block.type];
    return (
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100">
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5 rounded-full ${meta.color}`}>
                {meta.icon} {meta.label}
              </span>
              <span className="text-[10px] text-slate-400">
                Block {blockIndex + 1} of {totalBlocks}
              </span>
            </div>
            <h2 className="text-sm font-black text-slate-900 mt-0.5 truncate">{unit.title}</h2>
          </div>
        </div>

        {/* Block pills */}
        <div className="px-4 pb-3 flex gap-1.5 overflow-x-auto scrollbar-none">
          {unit.blocks.map((b, i) => {
            const m = BLOCK_META[b.type];
            return (
              <div
                key={i}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${
                  i === blockIndex
                    ? `${m.color} text-white`
                    : i < blockIndex
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {i < blockIndex ? '✓' : m.icon} {m.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Render: Completion Screen ──────────────────────────────

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-slate-900 flex flex-col items-center justify-center px-6 text-white text-center space-y-6">
        <div className="text-6xl">🏆</div>
        <h1 className="text-2xl font-black">Unit Complete!</h1>
        <p className="text-indigo-200 text-sm leading-relaxed">
          You finished <strong>{unit.title}</strong>.<br />
          Every word, drill, and dialogue — done offline.
        </p>
        <div className="bg-white/10 rounded-2xl p-4 w-full max-w-xs space-y-2">
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Your Score</div>
          <div className="text-3xl font-black">{drillScore.total > 0 ? Math.round((drillScore.correct / drillScore.total) * 100) : 100}%</div>
          <div className="text-xs text-indigo-300">{drillScore.correct}/{drillScore.total} drill answers correct</div>
        </div>
        <button
          onClick={onClose}
          className="w-full max-w-xs py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg"
        >
          Back to Program →
        </button>
      </div>
    );
  }

  // ── Render: WARMUP block ──────────────────────────────────

  const renderWarmup = (b: WarmupBlock) => {
    const item = b.reviewItems[warmupIdx];
    const isLast = warmupIdx === b.reviewItems.length - 1;

    return (
      <div className="flex flex-col h-full">
        <div className="px-5 pt-5 pb-3 space-y-1">
          <p className="text-xs text-slate-500 leading-relaxed">{b.instruction}</p>
          <div className="text-[10px] text-slate-400">{warmupIdx + 1} / {b.reviewItems.length}</div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-6">
          <button
            onClick={() => play(item.french)}
            className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-xl active:scale-95 transition-all"
          >
            <Volume2 className="w-9 h-9" />
          </button>

          <div className="text-3xl font-black text-slate-900 text-center leading-tight">
            {item.french}
          </div>

          {warmupRevealed ? (
            <div className="text-base text-slate-500 font-medium">{item.english}</div>
          ) : (
            <button
              onClick={() => { setWarmupRevealed(true); play(item.french); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" /> Reveal meaning
            </button>
          )}
        </div>

        <div className="p-5">
          <button
            onClick={() => {
              if (isLast) {
                goNextBlock();
              } else {
                setWarmupIdx(i => i + 1);
                setWarmupRevealed(false);
              }
            }}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-md"
          >
            {isLast ? 'Start New Words →' : 'Next →'}
          </button>
        </div>
      </div>
    );
  };

  // ── Render: INPUT block ──────────────────────────────────

  const renderInput = (b: InputBlock) => {
    const totalItems = b.words.length + b.chunks.length;
    const isWords = inputTab === 'words';
    const list = isWords ? b.words : b.chunks;
    const item = list[inputIdx];
    const isLast = inputIdx === list.length - 1 && (!isWords || b.chunks.length === 0);
    const isLastSection = !isWords && inputIdx === b.chunks.length - 1;

    return (
      <div className="flex flex-col h-full">
        <div className="px-5 pt-5 pb-3">
          <p className="text-xs text-slate-500">{b.instruction}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => { setInputTab('words'); setInputIdx(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${inputTab === 'words' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              📖 Words ({b.words.length})
            </button>
            <button
              onClick={() => { setInputTab('chunks'); setInputIdx(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${inputTab === 'chunks' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              💬 Phrases ({b.chunks.length})
            </button>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{inputIdx + 1} / {list.length}</div>
        </div>

        <div className="flex-1 px-5 flex flex-col justify-center space-y-5">
          {'phonetic' in item && (
            <div className="bg-indigo-50 rounded-3xl p-6 space-y-4 border border-indigo-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-black text-slate-900 leading-tight">{item.french}</div>
                  <div className="text-xs font-mono text-slate-400 mt-1">/{item.phonetic}/</div>
                </div>
                <button
                  onClick={() => play(item.french)}
                  className="p-3 bg-indigo-600 text-white rounded-2xl active:scale-95 transition-all shadow-md"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm font-bold text-indigo-700">{item.english}</div>
              {'partOfSpeech' in item && (
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.partOfSpeech}</div>
              )}
              {'note' in item && item.note && (
                <div className="text-xs text-slate-600 bg-white rounded-2xl p-3 border border-indigo-100 leading-relaxed">
                  💡 {item.note}
                </div>
              )}
              {'gender' in item && item.gender && (
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${item.gender === 'm' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                  {item.gender === 'm' ? '♂ masculine' : '♀ feminine'}
                </div>
              )}
            </div>
          )}

          {/* Sentence preview */}
          {'exampleSentenceFr' in item && (
            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Example sentence</div>
              <InteractiveSentence sentence={(item as { exampleSentenceFr: string }).exampleSentenceFr} wordClassName="text-sm font-bold text-slate-800" />
            </div>
          )}
        </div>

        <div className="p-5 flex gap-3">
          {inputIdx > 0 && (
            <button
              onClick={() => setInputIdx(i => i - 1)}
              className="p-4 bg-slate-100 text-slate-700 rounded-2xl active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => {
              if (isLastSection || (isLast && isWords && b.chunks.length === 0)) {
                goNextBlock();
              } else if (isLast && isWords && b.chunks.length > 0) {
                setInputTab('chunks');
                setInputIdx(0);
              } else {
                setInputIdx(i => i + 1);
              }
            }}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isLastSection || (isLast && b.chunks.length === 0) ? 'Start Drills →' : (
              <>Next <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        <div className="px-5 pb-4">
          <div className="flex gap-1 justify-center">
            {Array.from({ length: totalItems }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i < inputIdx + (isWords ? 0 : b.words.length) ? 'bg-indigo-600 w-4' : 'bg-slate-200 w-2'}`} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Render: DRILL block ───────────────────────────────────

  const renderDrill = (b: DrillBlock) => {
    const ex = b.exercises[drillIdx];
    const isLast = drillIdx === b.exercises.length - 1;
    const timerColor = drillTimer < 2 ? 'text-emerald-600' : drillTimer < 4 ? 'text-amber-500' : 'text-rose-600';

    const handleReveal = () => {
      setDrillState('revealed');
      play(ex.answer);
      // Record weakness — user needed to see the answer
      weaknessTracker.recordShownAnswer(userId, ex.prompt);
    };

    const handleChoice = (opt: string) => {
      const isCorrect = opt === ex.answer;
      setDrillChoice(opt);
      setDrillState(isCorrect ? 'correct' : 'wrong');
      setDrillScore(s => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        total: s.total + 1,
      }));
      play(ex.answer);
      if (isCorrect) {
        weaknessTracker.recordCorrect(userId, ex.prompt);
      } else {
        weaknessTracker.recordWrongChoice(userId, ex.prompt);
      }
    };

    const handleNext = () => {
      if (isLast) {
        goNextBlock();
      } else {
        setDrillIdx(i => i + 1);
        setDrillState('waiting');
        setDrillChoice(null);
      }
    };

    return (
      <div className="flex flex-col h-full">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">{b.instruction}</p>
            <div className="text-[10px] text-slate-400 mt-1">{drillIdx + 1} / {b.exercises.length}</div>
          </div>
          {/* Speed Timer */}
          {drillState === 'waiting' && (
            <div className={`flex items-center gap-1 font-black text-sm ${timerColor}`}>
              <Timer className="w-3.5 h-3.5" />
              {drillTimer}s
            </div>
          )}
        </div>

        <div className="flex-1 px-5 space-y-4 flex flex-col justify-center">
          {/* Exercise card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{ex.type}</span>
              <span className="text-[10px] text-slate-400">{ex.instruction}</span>
            </div>

            <div className="text-lg font-black text-slate-900 leading-snug">{ex.prompt}</div>

            {/* CHOOSE type */}
            {ex.type === 'choose' && ex.options && (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {ex.options.map((opt) => {
                  const isSelected = drillChoice === opt;
                  const isCorrectOpt = opt === ex.answer;
                  let cls = 'bg-slate-50 border border-slate-200 text-slate-700';
                  if (drillState !== 'waiting') {
                    if (isCorrectOpt) cls = 'bg-emerald-50 border border-emerald-400 text-emerald-800 font-black';
                    else if (isSelected) cls = 'bg-rose-50 border border-rose-400 text-rose-700';
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => drillState === 'waiting' && handleChoice(opt)}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all active:scale-[0.98] ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* REPEAT / SUBSTITUTE type */}
            {(ex.type === 'repeat' || ex.type === 'substitute') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => play(ex.prompt)}
                    className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400">Tap to hear, then say it out loud</span>
                </div>

                {ex.type === 'substitute' && ex.substitutePairs && drillState === 'waiting' && (
                  <div className="space-y-1">
                    {ex.substitutePairs.map((pair, i) => (
                      <div key={i} className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl">
                        🔄 {pair.cue}
                      </div>
                    ))}
                  </div>
                )}

                {drillState === 'waiting' && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleReveal}
                      className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" /> Show Answer
                    </button>
                    <button
                      onClick={() => { setDrillScore(s => ({ correct: s.correct + 1, total: s.total + 1 })); setDrillState('correct'); }}
                      className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Mic className="w-3.5 h-3.5" /> I Said It ✓
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Answer reveal */}
            {drillState !== 'waiting' && (
              <div className={`rounded-2xl p-4 border ${drillState === 'correct' ? 'bg-emerald-50 border-emerald-200' : drillState === 'wrong' ? 'bg-rose-50 border-rose-200' : 'bg-indigo-50 border-indigo-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {drillState === 'correct' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {drillState === 'wrong' && <XCircle className="w-4 h-4 text-rose-600" />}
                  {drillState === 'revealed' && <Eye className="w-4 h-4 text-indigo-600" />}
                  <span className="text-xs font-bold text-slate-600">
                    {drillState === 'correct' ? 'Correct!' : drillState === 'wrong' ? 'The right answer:' : 'Answer:'}
                  </span>
                  <button onClick={() => play(ex.answer)} className="ml-auto p-1 text-slate-400 hover:text-slate-700">
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-sm font-black text-slate-900">{ex.answer}</div>
              </div>
            )}
          </div>
        </div>

        {drillState !== 'waiting' && (
          <div className="p-5">
            <button
              onClick={handleNext}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-md"
            >
              {isLast ? 'Go to Role-Play →' : 'Next Exercise →'}
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── Render: ROLEPLAY block ────────────────────────────────

  const renderRoleplay = (b: RoleplayBlock) => {
    const ex = b.exchanges[roleplayExIdx];
    const isLast = roleplayExIdx === b.exchanges.length - 1;
    const aiAvailable = aiRoleplayService.isAvailable();

    const handleAppNext = () => {
      play(ex.french);
      setRoleplayStep('waiting_you');
    };

    const handleRevealYou = () => {
      setRoleplayStep('reveal_you');
      play(ex.french);
      weaknessTracker.recordShownAnswer(userId, ex.french);
    };

    const handleISaidIt = () => {
      setDrillScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
      weaknessTracker.recordCorrect(userId, ex.french);
      // If AI available and next line is app's, fetch AI response
      if (aiAvailable && b.aiSlot) {
        void fetchAiResponse(b, ex.french);
      } else {
        setRoleplayStep('reveal_you');
      }
    };

    const handleNext = () => {
      setAiResponse(null);
      if (isLast) {
        goNextBlock();
      } else {
        setRoleplayExIdx(i => i + 1);
        const nextEx = b.exchanges[roleplayExIdx + 1];
        setRoleplayStep(nextEx.speaker === 'app' ? 'show_app' : 'waiting_you');
      }
    };

    return (
      <div className="flex flex-col h-full">
        <div className="px-5 pt-5 pb-3 space-y-2">
          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">📍 Scenario</div>
              {aiAvailable && b.aiSlot && (
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI Live
                </span>
              )}
            </div>
            <div className="text-xs text-slate-700 mt-0.5">{b.scenario}</div>
          </div>
          <p className="text-xs text-slate-500">{b.instruction}</p>
        </div>

        {/* Exchange history */}
        <div className="flex-1 px-5 space-y-3 overflow-y-auto">
          {b.exchanges.slice(0, roleplayExIdx).map((ex, i) => (
            <div key={i} className={`flex ${ex.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${ex.speaker === 'you' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}>
                <div className="text-xs font-bold opacity-70 mb-1">{ex.speaker === 'you' ? 'You' : aiAvailable ? '✨ AI' : '🤖 Scripted'}</div>
                <div className="text-sm font-black">{ex.french}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{ex.english}</div>
              </div>
            </div>
          ))}

          {/* AI loading state */}
          {roleplayStep === 'ai_loading' && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="text-xs text-slate-500">AI is responding...</span>
              </div>
            </div>
          )}

          {/* AI response */}
          {roleplayStep === 'ai_response' && aiResponse && (
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-white border-2 border-indigo-200 rounded-2xl px-4 py-4 space-y-2">
                <div className="text-[10px] font-black text-indigo-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Response
                </div>
                <div className="text-sm font-black text-slate-900">{aiResponse.french}</div>
                <div className="text-xs text-slate-500">{aiResponse.english}</div>
                {aiResponse.correction && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
                    💡 {aiResponse.correction}
                  </div>
                )}
                <button onClick={() => play(aiResponse.french)} className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Current exchange */}
          {ex && roleplayStep !== 'ai_loading' && (
            <div className={`flex ${ex.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-4 shadow-sm ${ex.speaker === 'you' ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-white border-2 border-emerald-300'}`}>
                <div className="text-[10px] font-black uppercase tracking-wider mb-2 text-slate-500">
                  {ex.speaker === 'you' ? '🎤 Your Turn' : '🤖 App says'}
                </div>

                {ex.speaker === 'app' && (
                  <div className="space-y-2">
                    {roleplayStep === 'show_app' ? (
                      <button
                        onClick={handleAppNext}
                        className="w-full py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Volume2 className="w-4 h-4" /> Hear App Line →
                      </button>
                    ) : (
                      <>
                        <InteractiveSentence sentence={ex.french} wordClassName="text-sm font-black text-slate-900" />
                        <div className="text-xs text-slate-500">{ex.english}</div>
                        <button
                          onClick={() => play(ex.french)}
                          className="p-2 bg-slate-100 rounded-xl text-slate-600 active:scale-95"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {ex.speaker === 'you' && (
                  <div className="space-y-3">
                    {ex.hint && (
                      <div className="text-xs text-indigo-600 bg-indigo-50 rounded-xl px-3 py-2 font-medium">
                        💡 {ex.hint}
                      </div>
                    )}
                    {roleplayStep === 'waiting_you' && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleRevealYou}
                          className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" /> See My Line
                        </button>
                        <button
                          onClick={handleISaidIt}
                          className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Mic className="w-3.5 h-3.5" /> I Said It ✓
                        </button>
                      </div>
                    )}
                    {roleplayStep === 'reveal_you' && (
                      <>
                        <InteractiveSentence sentence={ex.french} wordClassName="text-sm font-black text-slate-900" />
                        <div className="text-xs text-slate-500">{ex.english}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {(roleplayStep === 'reveal_you' || (ex.speaker === 'app' && roleplayStep !== 'show_app')) && (
          <div className="p-5">
            <button
              onClick={handleNext}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-md"
            >
              {isLast ? 'Go to Correction →' : 'Next Line →'}
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── Render: CORRECTION block ──────────────────────────────

  const renderCorrection = (b: CorrectionBlock) => (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <p className="text-xs text-slate-500">{b.instruction}</p>
      </div>

      <div className="flex-1 px-5 space-y-3 overflow-y-auto pb-4">
        {b.keyPoints.map((kp, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-50 px-4 py-2.5 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="text-sm font-bold text-rose-700 line-through decoration-rose-400">{kp.wrong}</span>
            </div>
            <div className="bg-emerald-50 px-4 py-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-sm font-black text-emerald-800">{kp.right}</span>
              <button onClick={() => play(kp.right)} className="ml-auto p-1 text-emerald-600">
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="px-4 py-3 text-xs text-slate-600 leading-relaxed">{kp.explanation}</div>
          </div>
        ))}
      </div>

      <div className="p-5">
        <button
          onClick={goNextBlock}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-md"
        >
          Final Recap →
        </button>
      </div>
    </div>
  );

  // ── Render: RECAP block ───────────────────────────────────

  const renderRecap = (b: RecapBlock) => (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <p className="text-xs text-slate-500">{b.instruction}</p>
      </div>

      <div className="flex-1 px-5 space-y-3 overflow-y-auto pb-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-3xl p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-indigo-200">You can now say:</div>
          {b.canSayNow.map((line, i) => (
            <div key={i} className="flex items-start gap-3">
              <Star className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-sm font-bold leading-snug">{line}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1">Well done 🎉</div>
          <p className="text-sm text-slate-700 leading-relaxed">{b.wellDoneNote}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Your Drill Score</div>
          <div className="text-3xl font-black text-indigo-600">
            {drillScore.total > 0 ? Math.round((drillScore.correct / drillScore.total) * 100) : 100}%
          </div>
          <div className="text-xs text-slate-500">{drillScore.correct}/{drillScore.total} correct</div>
        </div>
      </div>

      <div className="p-5">
        <button
          onClick={goNextBlock}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-xl"
        >
          Complete Unit 🏆
        </button>
      </div>
    </div>
  );

  // ── Main render dispatcher ────────────────────────────────

  const renderBlock = () => {
    switch (block.type) {
      case 'warmup':     return renderWarmup(block as WarmupBlock);
      case 'input':      return renderInput(block as InputBlock);
      case 'drill':      return renderDrill(block as DrillBlock);
      case 'roleplay':   return renderRoleplay(block as RoleplayBlock);
      case 'correction': return renderCorrection(block as CorrectionBlock);
      case 'recap':      return renderRecap(block as RecapBlock);
      default:           return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto">
      {renderHeader()}
      <div className="flex-1 flex flex-col">
        {renderBlock()}
      </div>
    </div>
  );
};
