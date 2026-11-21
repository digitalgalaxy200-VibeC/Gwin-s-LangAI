import React, { useState } from 'react';
import { tursoService, type TursoUser } from '../services/tursoService';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: TursoUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [languageMode, setLanguageMode] = useState<'en_to_fr' | 'fr_to_en'>('en_to_fr');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    if (mode === 'register') {
      const nativeLang = languageMode === 'en_to_fr' ? 'en' : 'fr';
      const targetLang = languageMode === 'en_to_fr' ? 'fr' : 'en';
      const res = await tursoService.register(email, password, name, nativeLang, targetLang);
      setIsLoading(false);
      if (res.success && res.user) {
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 500);
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    } else {
      const res = await tursoService.login(email, password);
      setIsLoading(false);
      if (res.success && res.user) {
        setSuccessMsg('Welcome back!');
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 500);
      } else {
        setErrorMsg(res.error || 'Failed to log in.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {mode === 'login' ? 'Individual Learner Sign In' : 'Create Your Learning Account'}
          </h3>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Access your private progress, weakness profile, and saved words.'
              : 'Strictly isolated private account. No data mixing.'}
          </p>
        </div>

        {/* Tab switch: Login vs Register */}
        <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Bidirectional Mode Selector (Only on Register) */}
        {mode === 'register' && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-indigo-600" />
              <span>Learning Direction</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguageMode('en_to_fr')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  languageMode === 'en_to_fr'
                    ? 'border-indigo-600 bg-indigo-50/70 font-black text-indigo-900'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="text-xs font-bold">🇬🇧 ➔ 🇫🇷</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Learn French</div>
              </button>

              <button
                type="button"
                onClick={() => setLanguageMode('fr_to_en')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  languageMode === 'fr_to_en'
                    ? 'border-indigo-600 bg-indigo-50/70 font-black text-indigo-900'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="text-xs font-bold">🇫🇷 ➔ 🇬🇧</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Apprendre l'Anglais</div>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {mode === 'register' && (
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name or Nickname"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address (e.g. gwin@gmail.com)"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password or PIN"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {errorMsg && (
            <div className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="text-[11px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to My Account' : 'Start My Learning Path'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-600 font-bold"
          >
            Continue as Guest (Local Offline Only)
          </button>
        </div>
      </div>
    </div>
  );
};
