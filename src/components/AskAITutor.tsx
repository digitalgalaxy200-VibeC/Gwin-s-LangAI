import React, { useState, useEffect } from 'react';
import { retrievalEngine } from '../services/retrievalEngine';
import { aiProvider } from '../services/aiProvider';
import { audioEngine } from '../services/audioEngine';
import { 
  Sparkles, 
  Send, 
  Volume2, 
  Database, 
  Cpu, 
  DollarSign, 
  History 
} from 'lucide-react';
import type { AIResponse, CachedTranslationItem } from '../types/ai';

export const AskAITutor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [history, setHistory] = useState<CachedTranslationItem[]>([]);
  const [stats, setStats] = useState({ level1Hits: 0, level2Hits: 0, level3Hits: 0, totalSavedUsd: 0 });

  useEffect(() => {
    refreshHistoryAndStats();
  }, []);

  const refreshHistoryAndStats = () => {
    setHistory(retrievalEngine.getSavedCache().slice(0, 10));
    setStats(retrievalEngine.getStats());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const res = await retrievalEngine.query(query, aiProvider);
      setCurrentResponse(res);
      refreshHistoryAndStats();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (text: string) => {
    setQuery(text);
  };

  return (
    <div className="space-y-5">
      {/* Cost & Tier Savings Indicator */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              3-Level Retrieval Engine
            </span>
          </div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 -mr-1" />
            <span>${stats.totalSavedUsd.toFixed(3)} saved</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
          <div className="bg-slate-800/60 p-2 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">L1 Exact</div>
            <div className="text-sm font-bold text-indigo-400">{stats.level1Hits} hits</div>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">L2 Pattern</div>
            <div className="text-sm font-bold text-cyan-400">{stats.level2Hits} hits</div>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">L3 AI Calls</div>
            <div className="text-sm font-bold text-amber-400">{stats.level3Hits}</div>
          </div>
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything or use mixed French & English..."
          className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 p-2 bg-indigo-600 disabled:bg-slate-200 text-white rounded-xl shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Suggestion Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => handleQuickPrompt("You did a good job this afternoon")}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 rounded-full text-slate-600 whitespace-nowrap"
        >
          "You did a good job this afternoon"
        </button>
        <button
          onClick={() => handleQuickPrompt("You did a good job this morning")}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 rounded-full text-slate-600 whitespace-nowrap"
        >
          "You did a good job this morning" (L2 Pattern)
        </button>
        <button
          onClick={() => handleQuickPrompt("Bonjour, je voudrais parler avec... I don't know manager")}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 rounded-full text-slate-600 whitespace-nowrap"
        >
          Mixed French/English
        </button>
      </div>

      {/* Result Display */}
      {currentResponse && (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 ${
              currentResponse.retrievalLevel === 1 
                ? 'bg-indigo-50 text-indigo-700' 
                : currentResponse.retrievalLevel === 2 
                ? 'bg-cyan-50 text-cyan-700' 
                : 'bg-amber-50 text-amber-700'
            }`}>
              {currentResponse.retrievalLevel === 1 && <Database className="w-3 h-3" />}
              {currentResponse.retrievalLevel === 2 && <Cpu className="w-3 h-3" />}
              {currentResponse.retrievalLevel === 3 && <Sparkles className="w-3 h-3" />}
              Level {currentResponse.retrievalLevel} • {currentResponse.retrievalLevel === 1 ? 'Exact Match ($0)' : currentResponse.retrievalLevel === 2 ? 'Grammar Pattern ($0)' : 'AI Generation'}
            </span>
            <span className="text-xs font-semibold text-slate-400 capitalize">
              {currentResponse.formality}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-slate-900">
              "{currentResponse.frenchText}"
            </div>
            <div className="text-sm font-medium text-slate-500">
              {currentResponse.englishTranslation}
            </div>
          </div>

          {currentResponse.explanation && (
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
              {currentResponse.explanation}
            </div>
          )}

          <button
            onClick={() => audioEngine.playFrench(currentResponse.frenchText)}
            className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Listen Audio</span>
          </button>
        </div>
      )}

      {/* History / Library of Saved Expressions */}
      {history.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <History className="w-3.5 h-3.5" />
            <span>Saved Offline Library ({history.length})</span>
          </div>

          <div className="space-y-2">
            {history.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {item.frenchText}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {item.englishText}
                  </div>
                </div>

                <button
                  onClick={() => audioEngine.playFrench(item.frenchText)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
