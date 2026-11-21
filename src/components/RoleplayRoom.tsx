import React, { useState } from 'react';
import { aiProvider } from '../services/aiProvider';
import { audioEngine } from '../services/audioEngine';
import { Send, Volume2, ArrowLeft, Bot, User, AlertCircle } from 'lucide-react';

interface RoleplayProps {
  scenarioTitle: string;
  scenarioContext: string;
  onBack: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  contentFr: string;
  contentEn?: string;
  correction?: string;
}

export const RoleplayRoom: React.FC<RoleplayProps> = ({
  scenarioTitle,
  scenarioContext,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      contentFr: 'Bonjour ! Comment puis-je vous aider aujourd’hui ?',
      contentEn: 'Hello! How may I help you today?',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    setInputText('');

    // Add user message to UI
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', contentFr: userText }
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const historyPayload = updatedMessages.map(m => ({
        role: m.role,
        content: m.contentFr
      }));

      const reply = await aiProvider.roleplayChat(scenarioTitle, historyPayload);

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          contentFr: reply.responseFr,
          contentEn: reply.responseEn,
          correction: reply.correction,
        }
      ]);

      // Automatically speak French response
      audioEngine.playFrench(reply.responseFr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-900">{scenarioTitle}</h3>
          <p className="text-[10px] text-slate-400">{scenarioContext}</p>
        </div>
        <div className="w-8" />
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 font-semibold">
              {m.role === 'user' ? (
                <><span>You</span><User className="w-3 h-3" /></>
              ) : (
                <><Bot className="w-3 h-3 text-indigo-600" /><span>AI Partner</span></>
              )}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm space-y-1.5 ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-900 border border-slate-100 rounded-bl-none'
              }`}
            >
              <div className="font-semibold leading-relaxed">
                {m.contentFr}
              </div>

              {m.contentEn && (
                <div className={`text-xs ${m.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {m.contentEn}
                </div>
              )}

              {m.role === 'assistant' && (
                <button
                  onClick={() => audioEngine.playFrench(m.contentFr)}
                  className="pt-1 flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Replay</span>
                </button>
              )}
            </div>

            {m.correction && (
              <div className="mt-1 max-w-[85%] bg-amber-50 border border-amber-200/60 p-2.5 rounded-xl text-xs text-amber-900 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{m.correction}</span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent" />
            <span>AI Partner is typing in French...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Speak or type in French or English..."
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-3 bg-indigo-600 disabled:bg-slate-200 text-white rounded-2xl shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
