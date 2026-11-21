import React, { useState } from 'react';
import { tursoService, type TursoUser } from '../services/tursoService';
import { emailService } from '../services/emailService';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  KeyRound,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: TursoUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  initialMode = 'login',
  onClose, 
  onSuccess 
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'otp_verify'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [languageMode, setLanguageMode] = useState<'en_to_fr' | 'fr_to_en'>('en_to_fr');
  const [otpInput, setOtpInput] = useState('');
  const [createdUserTemp, setCreatedUserTemp] = useState<TursoUser | null>(null);

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
      
      if (res.success && res.user) {
        setCreatedUserTemp(res.user);
        
        // Generate and send verification email / OTP
        const otp = emailService.generateOtp();
        const sendResult = await emailService.sendVerificationEmail(res.user.email, res.user.name, otp);
        setIsLoading(false);

        if (sendResult.simulated) {
          setSuccessMsg(`Verification code sent! (Dev preview code: ${otp})`);
        } else {
          setSuccessMsg(`A 6-digit confirmation code was sent to ${res.user.email}.`);
        }
        setMode('otp_verify');
      } else {
        setIsLoading(false);
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

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otpInput.trim()) {
      setErrorMsg('Please enter your 6-digit code.');
      return;
    }

    const check = emailService.verifyOtp(email, otpInput);
    if (check.valid && createdUserTemp) {
      setSuccessMsg('Email verified successfully! Welcome to French AI Tutor.');
      setTimeout(() => {
        onSuccess(createdUserTemp);
        onClose();
      }, 700);
    } else {
      setErrorMsg(check.error || 'Invalid code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
            {mode === 'otp_verify' ? <KeyRound className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {mode === 'login' && 'Sign In to Your Account'}
            {mode === 'register' && 'Create Your Learner Account'}
            {mode === 'otp_verify' && 'Verify Your Email Address'}
          </h3>
          <p className="text-xs text-slate-500">
            {mode === 'login' && 'Access your private lessons, streaks, and weakness review.'}
            {mode === 'register' && 'Join with your email. Strictly isolated Turso account.'}
            {mode === 'otp_verify' && `Enter the 6-digit verification code sent to ${email}.`}
          </p>
        </div>

        {/* Tab switch: Login vs Register (only when not in OTP mode) */}
        {mode !== 'otp_verify' && (
          <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>
        )}

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

        {/* OTP Verification Form */}
        {mode === 'otp_verify' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-3 pt-2">
            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="6-digit code"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-center font-mono text-xl font-black tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                autoFocus
              />
            </div>

            {errorMsg && (
              <div className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="text-[11px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMode('register')}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 font-bold pt-1"
            >
              Back to Registration
            </button>
          </form>
        ) : (
          /* Login & Registration Form */
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
                  <span>{mode === 'login' ? 'Sign In to My Account' : 'Register & Receive Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

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
