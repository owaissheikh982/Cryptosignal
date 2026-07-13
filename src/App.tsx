import React, { useEffect, useState } from 'react';
import { TerminalProvider, useTerminal } from './context/TerminalState';
import { StandardLayout } from './layouts/StandardLayout';
import { FluidFluxLayout } from './layouts/FluidFluxLayout';
import { MonolithLayout } from './layouts/MonolithLayout';
import { ExecuteTradeModal } from './components/ExecuteTradeModal';
import LoginPage from './pages/LoginPage';

const AppContent: React.FC = () => {
  const { currentTheme, isAuthenticated, setIsAuthenticated } = useTerminal();
  const [authInitializing, setAuthInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          credentials: 'include',
        });

        if (!isMounted) return;
        setIsAuthenticated(response.ok);
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setAuthInitializing(false);
        }
      }
    };

    void verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [setIsAuthenticated]);

  if (authInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low/80 px-6 py-5 text-center shadow-2xl backdrop-blur-md">
          <div className="mb-3 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-2xl text-primary">progress_activity</span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em]">Authenticating access</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">Secure session verification in progress</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div 
      data-theme={currentTheme}
      className={`min-h-screen transition-colors duration-300 text-on-surface bg-background select-none ${
        currentTheme === 'flux' ? 'deep-forest-gradient' : ''
      }`}
    >
      {/* Dynamic Shell Selection */}
      {currentTheme === 'standard' && <StandardLayout />}
      {currentTheme === 'flux' && <FluidFluxLayout />}
      {currentTheme === 'monolith' && <MonolithLayout />}

      {/* Trade Execution Dialog overlay */}
      <ExecuteTradeModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TerminalProvider>
      <AppContent />
    </TerminalProvider>
  );
};

export default App;
