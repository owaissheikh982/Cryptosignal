import React from 'react';
import { TerminalProvider, useTerminal } from './context/TerminalState';
import { StandardLayout } from './layouts/StandardLayout';
import { FluidFluxLayout } from './layouts/FluidFluxLayout';
import { MonolithLayout } from './layouts/MonolithLayout';
import { ExecuteTradeModal } from './components/ExecuteTradeModal';

const AppContent: React.FC = () => {
  const { currentTheme } = useTerminal();

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
