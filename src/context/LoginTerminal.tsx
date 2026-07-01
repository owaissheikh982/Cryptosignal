import React, { useState } from 'react';
import { useTerminal } from '../context/TerminalState';

export const LoginTerminal: React.FC = () => {
  const { setIsAuthenticated } = useTerminal();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // STATIC CREDENTIALS — Yahan aap apni marzi ka username/password set kar sakte hain
    if (username === 'admin' && password === 'quant786') {
      localStorage.setItem('trader_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('INVALID ACCREDITATION: ACCESS DENIED.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020617] flex items-center justify-center z-[9999] font-mono p-sm">
      {/* Matrix Glowing background grid layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>
      
      <div className="w-full max-w-md bg-[#0b1329]/80 backdrop-blur-md p-lg lg:p-xl rounded-2xl border border-outline-variant shadow-2xl relative z-10 group hover:border-primary/30 transition-all duration-500">
        <div className="text-center mb-lg">
          <div className="w-12 h-12 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center mx-auto mb-sm shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]">
            <span className="material-symbols-outlined text-primary text-2xl animate-pulse">lock_open</span>
          </div>
          <h1 className="font-display-lg text-xl font-black text-on-surface tracking-tighter uppercase">QuantTrader Pro</h1>
          <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mt-1 opacity-70">Secure Gate Alpha-5</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-md">
          {error && (
            <div className="p-sm bg-error/10 border border-error/20 rounded-lg text-error text-[11px] font-bold uppercase tracking-tight text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-xs">
            <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">Trader Identity</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-sm text-on-surface-variant select-none">person</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ENTER USERNAME"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-md py-sm text-xs font-semibold focus:outline-none focus:border-primary transition-all text-on-surface placeholder:text-gray-600 uppercase tracking-wide"
                required
              />
            </div>
          </div>

          <div className="space-y-xs">
            <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">Access Token Pin</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-sm text-on-surface-variant select-none">key</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-md py-sm text-xs focus:outline-none focus:border-primary transition-all text-on-surface placeholder:text-gray-700 tracking-widest"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-sm bg-primary text-on-primary font-bold rounded-lg hover:brightness-111 active:scale-[0.98] transition-all text-xs uppercase cursor-pointer mt-sm shadow-[0_4px_20px_rgba(var(--primary-rgb),0.25)] font-sans"
          >
            Authenticate Identity
          </button>
        </form>

        <div className="mt-lg text-center border-t border-outline-variant/30 pt-md">
          <span className="text-[9px] text-on-surface-variant font-label-tabular opacity-50 uppercase tracking-widest">Encrypted Terminal Matrix Node v5.0</span>
        </div>
      </div>
    </div>
  );
};