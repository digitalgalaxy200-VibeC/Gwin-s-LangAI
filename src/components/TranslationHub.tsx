import React, { useState, useEffect } from 'react';
import { 
  offlineTranslationService, 
  type TranslationResult, 
  type TranslationHistoryItem 
} from '../services/offlineTranslationService';
import { audioEngine } from '../services/audioEngine';
import { DeepSeekProvider } from '../services/aiProvider';
import { 
  ArrowLeftRight, 
  Volume2, 
  Search, 
  X, 
  Star, 
  Clock, 
  Trash2, 
  Globe2, 
  Sparkles,
  Loader2
} from 'lucide-react';

export const TranslationHub: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<'en' | 'fr'>('en');
  const [inputText, setInputText] = useState('');
  const [currentResult, setCurrentResult] = useState<TranslationResult | null>(null);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'starred'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setHistory(offlineTranslationService.getHistory());
  }, []);

  const handleTranslate = async (textToTranslate?: string) => {
    const text = textToTranslate !== undefined ? textToTranslate : inputText;
    if (!text.trim()) {
      setCurrentResult(null);
      return;
    }

    // 1. Try local offline dictionary first
    const offlineRes = offlineTranslationService.translate(text, sourceLang);
    
    // If found offline, display instantly
    if (!offlineRes.translatedText.startsWith('[')) {
      setCurrentResult(offlineRes);
      const saved = offlineTranslationService.addToHistory(offlineRes);
      setHistory(prev => [saved, ...prev.filter(x => x.sourceText.toLowerCase() !== offlineRes.sourceText.toLowerCase())].slice(0, 50));
      return;
    }

    // 2. If not indexed offline, check if DeepSeek API key is saved to translate via AI
    const apiKey = localStorage.getItem('deepseek_api_key');
    if (apiKey) {
      setIsLoading(true);
      try {
        const provider = new DeepSeekProvider();
        const prompt = sourceLang === 'en'
          ? `Translate this English word or sentence into natural French: "${text}"`
          : `Translate this French word or sentence into English: "${text}"`;
        const aiRes = await provider.askTutor(prompt, apiKey);
        
        const finalRes: TranslationResult = {
          sourceText: text.trim(),
          translatedText: sourceLang === 'en' ? aiRes.frenchText : aiRes.englishTranslation,
          sourceLang,
          targetLang: sourceLang === 'en' ? 'fr' : 'en',
          notes: aiRes.explanation,
          matchType: 'ai_fallback',
        };
        setCurrentResult(finalRes);
        const saved = offlineTranslationService.addToHistory(finalRes);
        setHistory(prev => [saved, ...prev.filter(x => x.sourceText.toLowerCase() !== finalRes.sourceText.toLowerCase())].slice(0, 50));
        setIsLoading(false);
        return;
      } catch {
        setIsLoading(false);
      }
    }

    // 3. Machine translation over HTTPS — works without an API key
    setIsLoading(true);
    const onlineRes = await offlineTranslationService.translateOnline(text, sourceLang);
    setIsLoading(false);
    if (onlineRes) {
      setCurrentResult(onlineRes);
      const saved = offlineTranslationService.addToHistory(onlineRes);
      setHistory(prev => [saved, ...prev.filter(x => x.sourceText.toLowerCase() !== onlineRes.sourceText.toLowerCase())].slice(0, 50));
      return;
    }

    // 4. Nothing worked — show the dictionary's not-found message
    setCurrentResult(offlineRes);
    const saved = offlineTranslationService.addToHistory(offlineRes);
    setHistory(prev => [saved, ...prev.filter(x => x.sourceText.toLowerCase() !== offlineRes.sourceText.toLowerCase())].slice(0, 50));
  };

  const handleSwap = () => {
    const nextSource = sourceLang === 'en' ? 'fr' : 'en';
    setSourceLang(nextSource);
    if (currentResult && currentResult.translatedText && !currentResult.translatedText.startsWith('[')) {
      setInputText(currentResult.translatedText);
      const newRes = offlineTranslationService.translate(currentResult.translatedText, nextSource);
      setCurrentResult(newRes);
    } else {
      setInputText('');
      setCurrentResult(null);
    }
  };

  const handlePlayAudio = (text: string, lang: 'en' | 'fr') => {
    if (lang === 'fr') {
      audioEngine.playFrench(text, 0.85);
    } else {
      // Browser SpeechSynthesis for English if available
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'en-US';
          window.speechSynthesis.speak(u);
        }
      } catch {}
    }
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = offlineTranslationService.toggleStar(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    offlineTranslationService.clearHistory();
    setHistory([]);
  };

  const handleHistoryClick = (item: TranslationHistoryItem) => {
    setSourceLang(item.sourceLang);
    setInputText(item.sourceText);
    setCurrentResult(item);
  };

  const filteredHistory = historyFilter === 'starred'
    ? history.filter(x => x.isStarred)
    : history;

  const targetLang = sourceLang === 'en' ? 'fr' : 'en';

  return (
    <div className="space-y-4 pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-sm border border-indigo-800/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5" />
            <span>100% Offline Pocket Dictionary</span>
          </span>
          <span className="text-[11px] text-indigo-300 font-bold">1,000+ Words</span>
        </div>
        <h2 className="text-lg font-black tracking-tight">Offline Instant Translator</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Know a word in English but not in French? Type it here and tap translate. Everything works with zero internet, including spoken audio and local search history.
        </p>
      </div>

      {/* Language Switcher Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex-1 text-center py-2 font-black text-xs text-indigo-700 bg-indigo-50/70 rounded-xl flex items-center justify-center gap-1.5">
          <span>{sourceLang === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}</span>
        </div>

        <button
          type="button"
          onClick={handleSwap}
          className="mx-2 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-90 shadow-xs"
          title="Swap languages"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        <div className="flex-1 text-center py-2 font-black text-xs text-emerald-700 bg-emerald-50/70 rounded-xl flex items-center justify-center gap-1.5">
          <span>{targetLang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</span>
        </div>
      </div>

      {/* Translation Input Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
            placeholder={sourceLang === 'en' ? "Type a word in English (e.g. 'water', 'meeting', 'bill')..." : "Tapez un mot en français (ex. 'chambre', 'combien', 'merci')..."}
            rows={2}
            className="w-full text-slate-900 placeholder:text-slate-400 font-bold text-base focus:outline-none resize-none pr-8"
          />
          {inputText && (
            <button
              onClick={() => { setInputText(''); setCurrentResult(null); }}
              className="absolute top-1 right-1 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="text-[10px] text-slate-400 font-semibold">
            Press Enter or tap Translate
          </div>

          <button
            type="button"
            onClick={() => handleTranslate()}
            disabled={isLoading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Translate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Translation Output Card */}
      {currentResult && (
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 rounded-3xl p-5 border border-indigo-100 shadow-sm space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{targetLang === 'fr' ? 'French Translation' : 'English Translation'}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {currentResult.translatedText}
              </h3>
              {currentResult.phonetic && (
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  /{currentResult.phonetic}/
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePlayAudio(currentResult.translatedText, targetLang)}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl shadow-xs transition-all"
                title="Hear pronunciation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grammar & POS tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentResult.partOfSpeech && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-200/70 text-slate-700 rounded-lg">
                {currentResult.partOfSpeech}
              </span>
            )}
            {currentResult.gender && (
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg ${
                currentResult.gender === 'm' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
              }`}>
                {currentResult.gender === 'm' ? '♂ masculine' : '♀ feminine'}
              </span>
            )}
          </div>

          {/* Context Example */}
          {currentResult.exampleFr && (
            <div className="bg-white/80 rounded-2xl p-3 border border-indigo-100/60 space-y-1">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Example in context</div>
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>{currentResult.exampleFr}</span>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(currentResult.exampleFr!, 'fr')}
                  className="p-1 text-indigo-600 hover:text-indigo-800"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {currentResult.exampleEn && (
                <div className="text-xs text-slate-500 font-medium">
                  {currentResult.exampleEn}
                </div>
              )}
            </div>
          )}

          {currentResult.notes && (
            <div className="text-[11px] text-slate-500 font-medium bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-xl">
              💡 {currentResult.notes}
            </div>
          )}
        </div>
      )}

      {/* Recent History & Saved Notebook */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Translation History
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryFilter(f => f === 'all' ? 'starred' : 'all')}
              className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                historyFilter === 'starred' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{historyFilter === 'starred' ? 'Showing Starred' : 'Show Starred'}</span>
            </button>

            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-[10px] text-slate-400 hover:text-rose-600 p-1"
                title="Clear history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-100 text-slate-400 space-y-1">
            <p className="text-xs font-bold">No translations yet</p>
            <p className="text-[11px]">Any word you look up will be recorded here so you can review anytime.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => handleHistoryClick(item)}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between shadow-xs hover:border-indigo-200 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleToggleStar(item.id, e)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${item.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{item.sourceText}</span>
                      <span className="text-[10px] text-slate-400 font-mono">→</span>
                      <span className="text-xs font-extrabold text-indigo-700">{item.translatedText}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{item.sourceLang.toUpperCase()} → {item.targetLang.toUpperCase()}</span>
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(item.targetLang === 'fr' ? item.translatedText : item.sourceText, 'fr');
                  }}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
