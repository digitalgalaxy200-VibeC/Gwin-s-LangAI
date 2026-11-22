import React, { useState } from 'react';
import { STRUCTURED_PROGRAM, STAGE_LABELS, STAGE_DESCRIPTIONS } from '../data/structuredProgram';
import type { StructuredUnit, ProgressionStage } from '../data/structuredProgram';
import { StructuredLessonConductor } from './StructuredLessonConductor';
import { tursoService } from '../services/tursoService';
import { ChevronRight, ChevronDown, Lock, BookOpen, Zap, CheckCircle2 } from 'lucide-react';

// Units unlocked if previous unit is "completed" (stored in localStorage for now)
// Key: unit id → boolean
function getCompletedUnits(): Set<string> {
  try {
    const raw = localStorage.getItem('completed_units');
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {}
  return new Set();
}

function markUnitCompleted(id: string, userId: string) {
  const completed = getCompletedUnits();
  completed.add(id);
  localStorage.setItem('completed_units', JSON.stringify([...completed]));

  // Queue for the server. Stays local until the sync runs, so finishing a
  // lesson offline is never lost.
  tursoService.enqueueSyncItem(userId, 'unit_completed', { unitId: id, drillScore: 100 });
}

interface StructuredProgramProps {
  userId?: string;
  cefrLevel?: string;
}

export const StructuredProgram: React.FC<StructuredProgramProps> = ({
  userId = 'local_user',
  cefrLevel = 'A1',
}) => {
  const [activeUnit, setActiveUnit] = useState<StructuredUnit | null>(null);
  const [completedUnits, setCompletedUnits] = useState<Set<string>>(getCompletedUnits);
  // Accordion state: default open first active stage (survival)
  const [openStages, setOpenStages] = useState<Record<ProgressionStage, boolean>>({
    survival: true,
    functional: false,
    operational: false,
    fluent: false,
  });

  const toggleStage = (stage: ProgressionStage) => {
    setOpenStages(prev => ({ ...prev, [stage]: !prev[stage] }));
  };

  if (activeUnit) {
    return (
      <StructuredLessonConductor
        unit={activeUnit}
        userId={userId}
        cefrLevel={cefrLevel}
        onClose={() => setActiveUnit(null)}
        onCompleted={(id) => {
          markUnitCompleted(id, userId);
          setCompletedUnits(getCompletedUnits());
          setActiveUnit(null);
        }}
      />
    );
  }

  // Group units by stage
  const stages: ProgressionStage[] = ['survival', 'functional', 'operational', 'fluent'];
  const byStage = stages.map(stage => ({
    stage,
    units: STRUCTURED_PROGRAM.filter(u => u.stage === stage),
  }));

  const totalUnits = STRUCTURED_PROGRAM.length;
  const doneCount = completedUnits.size;

  return (
    <div className="space-y-5 pb-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 space-y-3 border border-indigo-900/50">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
            Military-Style Program
          </span>
        </div>
        <h2 className="text-lg font-black leading-tight">
          Offline Structured<br />French Program
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          6 blocks per unit · Warm-Up → Words → Drill → Role-Play → Correction → Recap<br />
          Everything works without internet. AI plugs in later for Stage 3–4.
        </p>

        {/* Overall progress */}
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
            <span>{doneCount} / {totalUnits} units complete</span>
            <span>{Math.round((doneCount / totalUnits) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full transition-all duration-700"
              style={{ width: `${(doneCount / totalUnits) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage Accordion Groups */}
      {byStage.map(({ stage, units }) => {
        if (units.length === 0) return null;
        const stageCompleted = units.every(u => completedUnits.has(u.id));
        const stageStarted = units.some(u => completedUnits.has(u.id));
        const isLocked = stage !== 'survival' && !stageStarted;
        const isOpen = !!openStages[stage];
        const completedInStage = units.filter(u => completedUnits.has(u.id)).length;

        return (
          <div key={stage} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
            {/* Clickable Accordion Header */}
            <button
              type="button"
              onClick={() => toggleStage(stage)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black text-slate-900">{STAGE_LABELS[stage]}</span>
                  {stageCompleted && (
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Terminé
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Locked
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{STAGE_DESCRIPTIONS[stage]}</div>
                <div className="text-[10px] text-indigo-600 font-extrabold mt-1">
                  {completedInStage} / {units.length} units done
                </div>
              </div>

              <div className="p-2 text-slate-400 hover:text-slate-600 shrink-0">
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-indigo-600 transition-transform" />
                ) : (
                  <ChevronRight className="w-5 h-5 transition-transform" />
                )}
              </div>
            </button>

            {/* Collapsible Content */}
            {isOpen && (
              <div className="p-3 pt-0 space-y-2 border-t border-slate-100 bg-slate-50/40">
                {units.map((unit, idx) => {
                  const done = completedUnits.has(unit.id);
                  // Unit is unlocked if it's the first OR previous unit is done
                  const prevDone = idx === 0 || completedUnits.has(units[idx - 1].id);
                  const locked = stage !== 'survival' ? true : !prevDone && idx > 0;

                  return (
                    <button
                      key={unit.id}
                      onClick={() => !locked && setActiveUnit(unit)}
                      disabled={locked}
                      className={`w-full text-left bg-white rounded-2xl p-3.5 border flex items-center gap-3.5 shadow-2xs transition-all active:scale-[0.99] ${
                        done
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : locked
                          ? 'border-slate-100 opacity-50'
                          : 'border-slate-200/80 hover:border-indigo-300'
                      }`}
                    >
                      {/* Icon circle */}
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
                        done ? 'bg-emerald-100' : locked ? 'bg-slate-100' : 'bg-indigo-50'
                      }`}>
                        {done ? '✅' : locked ? '🔒' : unit.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                            unit.track === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'
                          }`}>
                            Track {unit.track}
                          </span>
                          <span className="text-[10px] text-slate-400">{unit.estimatedMinutes} min</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-xs mt-0.5 truncate">
                          Unit {unit.unitNumber}: {unit.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{unit.subtitle}</p>

                        {/* Block preview pills */}
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {unit.blocks.map((b, bi) => (
                            <span key={bi} className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md capitalize">
                              {b.type}
                            </span>
                          ))}
                        </div>
                      </div>

                      {!locked && (
                        <div>
                          {done ? (
                            <BookOpen className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      )}
                      {locked && <Lock className="w-4 h-4 text-slate-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* AI future note */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 space-y-1">
        <div className="text-xs font-black text-amber-800">🤖 AI comes in Stage 3 (Operational)</div>
        <p className="text-xs text-amber-700 leading-relaxed">
          Everything in Stage 1 & 2 works fully offline. When you reach Stage 3, DeepSeek AI will replace the scripted role-play lines with live dynamic responses and correct your pronunciation in real time.
        </p>
      </div>
    </div>
  );
};
