import React, { useState } from 'react';
import { useTerminal } from '../context/TerminalState';

export const LoginTerminal: React.FC = () => {
  const { setIsAuthenticated } = useTerminal();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || 'Invalid email or password.');
        return;
      }

      localStorage.setItem('trader_auth', 'true');
      setIsAuthenticated(true);
      setSuccessMessage('Authentication successful. Opening the terminal...');
    } catch {
      setError('Authentication service is unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020617] flex items-center justify-center z-[9999] font-sans p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>

      <div className="w-full max-w-md bg-[#0b1329]/85 backdrop-blur-md p-6 rounded-2xl border border-outline-variant shadow-lg relative z-10 group hover:border-primary/30 transition-all duration-300">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="material-symbols-outlined text-primary text-2xl">lock_open</span>
          </div>
          <h1 className="font-display-lg text-xl font-black text-on-surface tracking-tighter uppercase">QuantTrader Pro</h1>
          <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mt-1 opacity-70">Secure Gate Alpha-5</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          {error && (
            <div className="rounded-md border border-error/20 bg-error/10 p-2 text-center text-[13px] font-semibold uppercase text-error" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-md border border-primary/20 bg-primary/10 p-2 text-center text-[13px] font-semibold uppercase text-primary" role="status">
              {successMessage}
            </div>
          )}

          <div>
            <label htmlFor="login-identifier" className="block text-sm font-semibold text-on-surface mb-2">Email or Username</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant select-none">person</span>
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@quanttrader.local"
                autoComplete="username"
                className="w-full bg-transparent border border-outline-variant rounded-lg pl-11 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow text-on-surface placeholder:text-on-surface-variant"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold text-on-surface mb-2">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant select-none">key</span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full bg-transparent border border-outline-variant rounded-lg pl-11 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow text-on-surface placeholder:text-on-surface-variant"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-on-surface-variant transition-colors hover:text-on-surface"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-base">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="h-4 w-4 rounded border-outline-variant bg-transparent"
              />
              Remember me
            </label>
            <span className="text-xs uppercase tracking-[0.16em] text-on-surface-variant/70">Protected session</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm shadow-md hover:brightness-105 focus:ring-4 focus:ring-primary/20 transition-transform active:scale-[0.995] disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <span className="ml-2">Authenticating...</span>
              </>
            ) : (
              'Authenticate Identity'
            )}
          </button>
        </form>

        <div className="mt-4 border-t border-outline-variant/30 pt-3 text-center">
          <span className="text-[11px] text-on-surface-variant font-label-tabular opacity-50 uppercase tracking-widest">Encrypted Terminal Matrix Node v5.0</span>
        </div>
      </div>
    </div>
  );
};

export default LoginTerminal;