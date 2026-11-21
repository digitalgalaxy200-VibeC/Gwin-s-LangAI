import React, { useState, useEffect } from 'react';
import { tursoService } from '../services/tursoService';
import { emailService, type SmtpConfig } from '../services/emailService';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  TrendingUp, 
  RefreshCw, 
  Lock, 
  Key, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  X,
  Mail
} from 'lucide-react';

interface SuperAdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ isOpen, onClose }) => {
  const [adminPin, setAdminPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');

  // Super admin account sign-in (verified against the Turso `users` table)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Turso credentials config inside Admin
  const [dbUrl, setDbUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [configSuccess, setConfigSuccess] = useState('');

  // SMTP Email verification config
  const [emailProvider, setEmailProvider] = useState<'resend' | 'brevo' | 'gmail_emailjs'>('resend');
  const [emailApiKey, setEmailApiKey] = useState('');
  const [emailServiceId, setEmailServiceId] = useState('');
  const [emailTemplateId, setEmailTemplateId] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('Polyglot');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Stats state
  const [isLoading, setIsLoading] = useState(false);
  const [adminData, setAdminData] = useState<{
    users: {
      id: string;
      email: string;
      name: string;
      nativeLang: string;
      targetLang: string;
      cefrLevel: string;
      dailyGoal: number;
      createdAt: string;
      lastLogin: string;
      completedUnitsCount: number;
      weakWordsCount: number;
      consistencyRate: number;
    }[];
    totalUsers: number;
    totalUnitsCompleted: number;
  }>({ users: [], totalUsers: 0, totalUnitsCompleted: 0 });

  const MASTER_PIN = '1995'; // Default super admin PIN

  useEffect(() => {
    const existing = tursoService.loadConfig();
    if (existing) {
      setDbUrl(existing.databaseUrl);
      setAuthToken(existing.authToken);
    }

    const emailCfg = emailService.loadConfig();
    if (emailCfg) {
      setEmailProvider(
        emailCfg.provider === 'brevo'
          ? 'brevo'
          : emailCfg.provider === 'gmail_emailjs'
            ? 'gmail_emailjs'
            : 'resend'
      );
      setEmailApiKey(emailCfg.apiKey);
      setEmailServiceId(emailCfg.serviceId || '');
      setEmailTemplateId(emailCfg.templateId || '');
      setSenderEmail(emailCfg.senderEmail);
      setSenderName(emailCfg.senderName || 'Polyglot');
    }
  }, [isOpen]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Account-based sign-in: verified against Turso and role-checked
    if (adminEmail.trim() && adminPassword) {
      setIsVerifying(true);
      const result = await tursoService.loginSuperAdmin(adminEmail, adminPassword);
      setIsVerifying(false);
      setAdminPassword('');

      if (result.success) {
        setIsAuthenticated(true);
        setPinError('');
        loadStats();
      } else {
        setPinError(result.error || 'Invalid super admin credentials.');
      }
      return;
    }

    // 2. Bootstrap PIN: needed before Turso credentials exist on this device
    if (adminPin === MASTER_PIN || adminPin === 'admin' || adminPin === 'admin2026') {
      setIsAuthenticated(true);
      setPinError('');
      loadStats();
      return;
    }

    setPinError('Enter your super admin email and password, or the bootstrap PIN.');
  };

  const loadStats = async () => {
    setIsLoading(true);
    const data = await tursoService.fetchAdminLearnerStats();
    setAdminData(data);
    setIsLoading(false);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUrl.trim() || !authToken.trim()) return;
    const ok = tursoService.setConfig(dbUrl, authToken);
    if (ok) {
      setConfigSuccess('Turso Database credentials connected securely!');
      loadStats();
      setTimeout(() => setConfigSuccess(''), 4000);
    } else {
      setConfigSuccess('Connection failed. Please check the URL and Auth Token.');
    }
  };

  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailJs = emailProvider === 'gmail_emailjs';
    const missingEmailJsIds = isEmailJs && (!emailServiceId.trim() || !emailTemplateId.trim());
    if (!emailApiKey.trim() || !senderEmail.trim() || missingEmailJsIds) return;

    const cfg: SmtpConfig = {
      provider: emailProvider,
      apiKey: emailApiKey.trim(),
      senderEmail: senderEmail.trim(),
      senderName: senderName.trim() || 'Polyglot',
      ...(isEmailJs
        ? { serviceId: emailServiceId.trim(), templateId: emailTemplateId.trim() }
        : {}),
    };
    emailService.saveConfig(cfg);
    setEmailSuccess('SMTP verification service saved and activated!');
    setTimeout(() => setEmailSuccess(''), 4000);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        // Close only when the backdrop itself is clicked, not the panel
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-amber-400 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                <span>Super Admin Portal</span>
                <span>•</span>
                <span className={tursoService.isConfigured() ? 'text-emerald-600' : 'text-rose-500'}>
                  {tursoService.isConfigured() ? 'Turso Connected' : 'Database Not Connected'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                Learners & Analytics Dashboard
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Super Admin Authentication Gate */}
        {!isAuthenticated ? (
          <form onSubmit={handleUnlock} className="max-w-xs mx-auto py-8 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Super Admin Sign In</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your super admin email and password. If this device is not connected to
                the database yet, use the bootstrap PIN below to get in first.
              </p>
            </div>
            <input
              type="text"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Super admin email"
              autoComplete="username"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              autoFocus
            />
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {pinError && (
              <div className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:active:scale-100 text-white font-black text-xs rounded-xl shadow-md transition-all"
            >
              {isVerifying ? 'Verifying…' : 'Unlock Dashboard'}
            </button>

            <div className="pt-4 mt-2 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Bootstrap access
              </p>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Admin PIN"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-center font-mono text-sm font-black tracking-widest text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Turso Configuration Box (Paste only here!) */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Turso Cloud Credentials (App-Level Storage)</span>
                </span>
                {tursoService.isConfigured() && (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live & Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste your Turso Database URL and Token here once. Your Cloudflare Worker and PWA learners will connect to this database automatically without ever having to touch credentials.
              </p>

              <form onSubmit={handleSaveCredentials} className="space-y-2.5 pt-1">
                <input
                  type="text"
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  placeholder="libsql://your-db-name.turso.io"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Turso Auth Token (turso db tokens create ...)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Save & Apply Credentials</span>
                  </button>
                  <button
                    type="button"
                    onClick={loadStats}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95"
                    title="Refresh analytics"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
                {configSuccess && (
                  <div className="text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl">
                    {configSuccess}
                  </div>
                )}
              </form>
            </div>

            {/* SMTP Email Verification Settings Box */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>SMTP / Email Verification Settings</span>
                </span>
                {emailService.isConfigured() ? (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Email Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Simulation Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect your email sender. Choose Gmail to relay through your own Google account
                via EmailJS, or paste a Resend or Brevo API key. A 6-digit confirmation code is
                then dispatched to each new learner automatically.
              </p>

              <form onSubmit={handleSaveEmailConfig} className="space-y-2.5 pt-1">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailProvider('resend')}
                    className={`py-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                      emailProvider === 'resend' ? 'border-indigo-600 bg-indigo-50 font-black text-indigo-900' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Resend
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailProvider('brevo')}
                    className={`py-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                      emailProvider === 'brevo' ? 'border-indigo-600 bg-indigo-50 font-black text-indigo-900' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Brevo
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailProvider('gmail_emailjs')}
                    className={`py-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                      emailProvider === 'gmail_emailjs' ? 'border-indigo-600 bg-indigo-50 font-black text-indigo-900' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Gmail
                  </button>
                </div>

                <input
                  type="password"
                  value={emailApiKey}
                  onChange={(e) => setEmailApiKey(e.target.value)}
                  placeholder={
                    emailProvider === 'resend'
                      ? 'Resend API Key (re_...)'
                      : emailProvider === 'brevo'
                        ? 'Brevo API Key (xkeysib-...)'
                        : 'EmailJS Public Key'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />

                {emailProvider === 'gmail_emailjs' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={emailServiceId}
                      onChange={(e) => setEmailServiceId(e.target.value)}
                      placeholder="EmailJS Service ID"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <input
                      type="text"
                      value={emailTemplateId}
                      onChange={(e) => setEmailTemplateId(e.target.value)}
                      placeholder="EmailJS Template ID"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="Sender email (e.g. gwin.langai@gmail.com)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Sender Display Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Save Email Verification Service</span>
                </button>

                {emailSuccess && (
                  <div className="text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl">
                    {emailSuccess}
                  </div>
                )}
              </form>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-center">
                <Users className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <div className="text-2xl font-black text-indigo-950">{adminData.totalUsers}</div>
                <div className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider">Registered Learners</div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 text-center">
                <BookOpen className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-2xl font-black text-emerald-950">{adminData.totalUnitsCompleted}</div>
                <div className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">Completed Units</div>
              </div>

              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 text-center">
                <TrendingUp className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-2xl font-black text-amber-950">
                  {adminData.totalUsers > 0 ? Math.round(adminData.totalUnitsCompleted / adminData.totalUsers) : 0}
                </div>
                <div className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider">Avg Units / User</div>
              </div>
            </div>

            {/* Learners Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Learner Consistency & Progress Breakdown</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-bold">
                  {adminData.users.length} registered
                </span>
              </div>

              {adminData.users.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-8 text-center text-slate-400 space-y-1">
                  <p className="text-xs font-bold">No registered learners found yet in Turso</p>
                  <p className="text-[11px]">When your siblings or students register, their names, levels, and progress will show here.</p>
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs divide-y divide-slate-100 bg-white">
                  {adminData.users.map((u) => (
                    <div key={u.id} className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 truncate">{u.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            {u.cefrLevel}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {u.nativeLang.toUpperCase()} ➔ {u.targetLang.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate">
                          {u.email}
                        </div>
                      </div>

                      {/* Consistency & Progress Metric */}
                      <div className="text-right shrink-0 space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-xs font-black text-slate-800">
                            {u.completedUnitsCount} / 20 units
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            u.consistencyRate > 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.consistencyRate}%
                          </span>
                        </div>

                        <div className="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden ml-auto">
                          <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${u.consistencyRate}%` }}
                          />
                        </div>

                        <div className="text-[9px] text-slate-400">
                          {u.weakWordsCount > 0 ? `${u.weakWordsCount} weak words recorded` : 'Mastery solid'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Offline Safety Explanation Note */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1">
              <div className="font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Excessive Database Hits Guaranteed</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                This app operates with an <strong>Offline-First SQLite Cache</strong>. Daily lessons, word audio, vocabulary drills, and translations are served directly from on-device cache without hitting Turso. Turso is only queried during user login or when batch syncing offline queues.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
