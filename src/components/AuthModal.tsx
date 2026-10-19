import { useState } from 'react';
import { X, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { authService, DEMO_GOOGLE_ACCOUNTS } from '../services/authService';
import type { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = (acc: typeof DEMO_GOOGLE_ACCOUNTS[0]) => {
    const profile = authService.loginWithGoogle(acc);
    onLoginSuccess(profile);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    const profile = authService.loginWithGoogle({
      name: customName.trim(),
      email: customEmail.trim(),
    });
    onLoginSuccess(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-100 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Branding & Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-white/10 mb-3 border border-slate-200">
            {/* Official Google SVG Logo */}
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-extrabold text-white">Sign In with Google</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Save your spoken sessions, track pronunciation weaknesses, and sync improvement metrics.
          </p>
        </div>

        {/* Benefits list */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>What gets saved to your Google Profile:</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-400 pl-1">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Personalized "Where Need to Improve" weakness analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full transcript history with mistakes & native corrections</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Fluency progress scores, speaking streaks, and level tracking</span>
            </li>
          </ul>
        </div>

        {/* One-Click Quick Google Account Picker */}
        {!showCustomForm ? (
          <div className="space-y-2.5 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Select Google Account:
            </span>

            {DEMO_GOOGLE_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                onClick={() => handleSelectAccount(acc)}
                className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between group transition-all text-left shadow"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.picture}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {acc.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{acc.email}</p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-xl bg-slate-900 group-hover:bg-indigo-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}

            <button
              onClick={() => setShowCustomForm(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-xs text-slate-400 hover:text-white transition-all text-center mt-2"
            >
              + Use a different Google Account
            </button>
          </div>
        ) : (
          /* Custom Google Account input */
          <form onSubmit={handleCustomSubmit} className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Arman Khan"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Google Email</label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="name@gmail.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                Register & Sign In
              </button>

              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-all"
              >
                Back
              </button>
            </div>
          </form>
        )}

        <p className="text-[10px] text-center text-slate-500">
          By signing in, your practicing sessions and diagnostic mistake logs will be securely synced to your browser profile.
        </p>
      </div>
    </div>
  );
};
