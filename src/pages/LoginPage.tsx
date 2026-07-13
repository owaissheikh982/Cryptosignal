import React, { useState } from 'react';
import { useTerminal } from '../context/TerminalState';

const LoginPage: React.FC = () => {
  const { setIsAuthenticated } = useTerminal();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Invalid email or password.');
        return;
      }
      localStorage.setItem('trader_auth', 'true');
      setIsAuthenticated(true);
    } catch (err) {
      setError('Authentication service is unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030615] to-[#07101a] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Decorative left panel (visible on large screens) */}
        <aside className="hidden lg:flex lg:col-span-5 items-center justify-center">
          <div className="w-full h-[420px] rounded-2xl border border-outline-variant/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.06),transparent)] p-6 flex flex-col items-start justify-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
            </div>
            <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Welcome to QuantTrader Pro</h2>
            <p className="text-sm text-on-surface-variant max-w-xs">Securely access the terminal. Designed for speed, clarity, and accuracy.</p>
          </div>
        </aside>

        {/* Login card */}
        <main className="col-span-1 lg:col-span-4 mx-auto w-full">
          <div className="bg-[#071827]/80 backdrop-blur-md p-8 rounded-2xl border border-outline-variant/40 shadow-[0_10px_30px_rgba(2,6,23,0.6)] transition-transform transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">lock_open</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-on-surface">QuantTrader Pro</h1>
                <p className="text-[11px] text-on-surface-variant uppercase tracking-widest">Secure Gate Alpha-5</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="login-identifier" className="block text-[12px] font-semibold text-on-surface mb-2">Email or Username</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">person</span>
                  <input
                    id="login-identifier"
                    className="w-full bg-transparent border border-outline-variant rounded-lg pl-11 pr-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email or Username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-[12px] font-semibold text-on-surface mb-2">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">key</span>
                  <input
                    id="login-password"
                    className="w-full bg-transparent border border-outline-variant rounded-lg pl-11 pr-12 py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    aria-label="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-3 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-on-surface-variant">
                  <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe((r) => !r)} className="h-4 w-4 rounded border-outline-variant bg-transparent" />
                  <span>Remember me</span>
                </label>
                <span className="text-xs text-on-surface-variant">Protected session</span>
              </div>

              {error && (
                <div role="alert" className="text-sm text-error bg-error/10 border border-error/20 rounded-md p-2 font-semibold">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg text-sm shadow-[0_8px_30px_rgba(16,185,129,0.14)] hover:brightness-105 focus:ring-4 focus:ring-primary/20 transition-transform active:scale-[0.995] disabled:opacity-60"
              >
                {isLoading ? 'Authenticating...' : 'Authenticate Identity'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider">Encrypted Terminal Matrix Node v5.0</span>
            </div>
          </div>
        </main>

        {/* Right spacer (hidden on small screens) */}
        <aside className="hidden lg:flex lg:col-span-3" />
      </div>
    </div>
  );
};

export default LoginPage;
