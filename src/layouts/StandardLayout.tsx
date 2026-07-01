import React, { useState } from 'react';
import { useTerminal } from '../context/TerminalState';
import { ChartContainer } from '../components/ChartContainer';

// ─────────────────────────────────────────────────────────────────────────────
// 🟢 INTERNAL COMPONENT: Dynamic Full Market $10 Vol-Screener Panel
// ─────────────────────────────────────────────────────────────────────────────
const DynamicScreenerPanel: React.FC = () => {
  const { dynamicIntelState, selectedTimeframe, setShowTradeModal, setSelectedCoin } = useTerminal();

  const handleOpenTrade = (symbol: string) => {
    setSelectedCoin(symbol);
    setShowTradeModal(true);
  };

  return (
    <div className="space-y-4 p-4 bg-surface-container-low/60 rounded-2xl border border-outline-variant/40 backdrop-blur-md">
      {/* Header Matrix Node */}
      <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
        <div>
          <h2 className="text-sm lg:text-base font-black text-primary uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-400 animate-spin-slow">tune</span>
            Dynamic $10 Vol-Screener Pipeline
          </h2>
          <p className="text-[10px] text-on-surface-variant font-mono mt-0.5 uppercase tracking-wide">
            Auto-scanning total spot market for assets &lt; $1.00 with Vol &gt; $5M
          </p>
        </div>
        <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-2 py-0.5 font-bold rounded tracking-widest font-mono">
          TF: {selectedTimeframe?.toUpperCase() || '1H'}
        </span>
      </div>

      {/* Grid Allocation Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {!dynamicIntelState?.allSignals || dynamicIntelState.allSignals.length === 0 ? (
          <div className="col-span-full py-8 text-center text-on-surface-variant text-xs flex flex-col items-center gap-2 font-mono">
            <span className="material-symbols-outlined text-2xl animate-spin text-primary">sync</span>
            <span>POLLED EXCHANGE TICKERS DATA PIPELINE INJECTING...</span>
          </div>
        ) : (
          dynamicIntelState.allSignals.map((sig) => {
            const isBuy = sig.action === 'BUY' || sig.action === 'LONG';
            const actionBg = isBuy ? 'border-primary/30 bg-primary/5' : sig.action === 'SELL' || sig.action === 'SHORT' ? 'border-error/30 bg-error/5' : 'border-outline-variant/40 bg-surface-container-high/40';
            const textBadge = isBuy ? 'text-primary bg-primary/10 border-primary/20' : sig.action === 'SELL' || sig.action === 'SHORT' ? 'text-error bg-error/10 border-error/20' : 'text-amber-500 bg-amber-500/10 border-amber-500/20';

            return (
              <div key={sig.coin} className={`p-3 rounded-xl border transition-all duration-300 hover:scale-[0.99] flex flex-col justify-between ${actionBg}`}>
                
                {/* Coin Title and Action row */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-black text-on-surface font-mono">{sig.coin}/USDT</span>
                    <span className="block text-[14px] font-bold text-on-surface-variant font-mono mt-0.5">
                      ${sig.entry.toLocaleString(undefined, { minimumFractionDigits: sig.entry < 0.01 ? 6 : 2 })}
                    </span>
                  </div>
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border font-mono ${textBadge}`}>
                    {sig.action}
                  </span>
                </div>

                {/* Micro Reasons catalyst */}
                <div className="space-y-1 mb-2 min-h-[40px]">
                  {sig.reasons && sig.reasons.slice(0, 2).map((r, i) => (
                    <p key={i} className="text-[10px] text-on-surface-variant font-mono truncate uppercase flex items-center gap-1">
                      <span className="text-primary font-bold">▪</span> {r}
                    </p>
                  ))}
                </div>

                {/* Pure $10 Allocation Risk Matrix Widget */}
                <div className="p-2 bg-background/60 rounded-lg border border-outline-variant/30 font-mono space-y-0.5 text-[10px] mb-3">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">STOP LOSS:</span> 
                    <span className="text-error font-bold">${sig.stop_loss.toLocaleString(undefined, { minimumFractionDigits: sig.entry < 0.01 ? 6 : 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">TAKE PROFIT:</span> 
                    <span className="text-primary font-bold">${sig.take_profit[0]?.toLocaleString(undefined, { minimumFractionDigits: sig.entry < 0.01 ? 6 : 2 }) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-outline-variant/20 pt-1 mt-1">
                    <span className="text-primary font-bold">BUDGET ALLOC:</span>
                    <span className="text-primary font-bold">MAX {sig.suggestedPositionSizePct || 2}% ($10 RISK SLOTS)</span>
                  </div>
                </div>

                {/* Direct Order Routing Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleOpenTrade(sig.coin)} className="py-1 bg-primary/20 border border-primary/40 hover:bg-primary hover:text-white text-primary font-bold rounded text-[10px] uppercase tracking-wider transition-all font-mono">LONG</button>
                  <button onClick={() => handleOpenTrade(sig.coin)} className="py-1 bg-error/20 border border-error/40 hover:bg-error hover:text-white text-error font-bold rounded text-[10px] uppercase tracking-wider transition-all font-mono">SHORT</button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const StandardLayout: React.FC = () => {
  const {
    currentTheme,
    setTheme,
    coins,
    selectedCoin,
    setSelectedCoin,
    whaleAlerts,
    positions,
    closePosition,
    accountBalance,
    fearGreedIndex,
    setShowTradeModal,
    selectedTimeframe,
    setSelectedTimeframe,
    intelState,
  } = useTerminal();

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectCoin = (symbol: string) => {
    setSelectedCoin(symbol);
  };

  const handleOpenTrade = (symbol: string) => {
    setSelectedCoin(symbol);
    setShowTradeModal(true);
  };

  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="relative min-h-screen">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* MAIN TOP DECK ACTIONS BAR */}
      <header className="sticky top-0 z-30 flex flex-col gap-3 border-b border-outline-variant bg-surface px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-0 sm:h-14 lg:px-6">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface lg:hidden hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
            <span className="text-sm font-black tracking-wider uppercase text-on-surface truncate">QUANT_SHELL <span className="text-primary text-[10px] font-mono font-bold px-1.5 py-0.5 bg-primary/10 rounded border border-primary/20 ml-1">v3.0</span></span>
          </div>
        </div>

        {/* Live Controls Matrix */}
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {/* Timeframe selector engine */}
          <div className="flex items-center bg-surface-container-high rounded-lg p-0.5 border border-outline-variant">
            {['15m', '1h', '4h', '1d'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider transition-all duration-200 ${
                  selectedTimeframe === tf 
                    ? 'bg-primary text-white shadow-sm shadow-primary/20' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Theme customizer matrix */}
          <div className="hidden sm:flex items-center bg-surface-container-high rounded-lg p-0.5 border border-outline-variant">
            {(['standard', 'flux', 'monolith'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider transition-all duration-200 ${
                  currentTheme === t 
                    ? 'bg-secondary text-white' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Balance badge */}
          <div className="flex items-center gap-1.5 bg-surface-container-high border border-outline-variant px-3 py-1.5 rounded-xl">
            <span className="text-[10px] font-bold text-on-surface-variant font-mono">BAL:</span>
            <span className="text-xs font-black text-primary font-mono">${accountBalance.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* CENTRAL SPLIT VIEW ARCHITECTURE */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        
        {/* LEFT NAV BAR CONTROL DESK */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-64 transform border-r border-outline-variant bg-surface px-4 py-4 transition-transform duration-300 ease-in-out sm:w-72 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:w-64 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar internal navigation loop */}
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between lg:hidden border-b border-outline-variant/40 pb-3">
                <span className="text-xs font-black tracking-widest text-primary uppercase">NAVIGATION</span>
                <button onClick={() => setSidebarOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Navigation Hub Links */}
              <nav className="space-y-1">
                {[
                  { id: 'terminal', label: 'Trading Desk', icon: 'dashboard', href: '#market-watchlist' },
                  { id: 'intel', label: 'Signal Intelligence', icon: 'insights', href: '#signal-intel' },
                  { id: 'whales', label: 'Whale Order Flow', icon: 'monitoring', href: '#whale-tracker' },
                  { id: 'portfolio', label: 'Risk Portfolio', icon: 'account_balance_wallet', href: '#portfolio-section' },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
              
              {/* Real-time Crypto Watchlist Frame */}
              <div id="market-watchlist" className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant px-1 font-mono">CORE MONITOR ASSETS</span>
                <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
                  {Object.values(coins).map((coin) => {
                    const isSelected = selectedCoin === coin.symbol;
                    const isUp = coin.change24h >= 0;
                    
                    return (
                      <div
                        key={coin.symbol}
                        onClick={() => handleSelectCoin(coin.symbol)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                          isSelected 
                            ? 'bg-primary/10 border-primary text-on-surface' 
                            : 'bg-surface-container-low border-transparent hover:border-outline-variant/60'
                        } ${
                          coin.lastFlash === 'up' ? 'animate-flash-green' : coin.lastFlash === 'down' ? 'animate-flash-red' : ''
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black font-mono">{coin.symbol}/USDT</span>
                          <span className="text-[10px] text-on-surface-variant font-medium">{coin.name}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold font-mono text-on-surface">
                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 6 : 2 })}
                          </span>
                          <span className={`text-[10px] font-bold font-mono flex items-center ${isUp ? 'text-primary' : 'text-error'}`}>
                            {isUp ? '+' : ''}{coin.change24h}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Fear and Greed Matrix Node */}
            <div className="pt-4 border-t border-outline-variant/40">
              <div className="bg-surface-container-high border border-outline-variant p-3 rounded-xl font-mono">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black text-on-surface-variant uppercase">FEAR & GREED INDEX</span>
                  <span className="text-[10px] font-black text-primary">{fearGreedIndex} — GREED</span>
                </div>
                <div className="w-full bg-outline-variant rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${fearGreedIndex}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        

        {/* RIGHT CORE CANVAS WORKSPACE */}
        <main className="flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6 overflow-x-hidden space-y-4 lg:space-y-6 bg-background">
            {/* --- 🔮 DYNAMIC INTELLIGENCE SIGNAL SECTION --- */}
          <div className= "w-full">
            <section id="signal-intel" className="col-span-12 lg:col-span-4 flex flex-col gap-sm lg:gap-grid-gutter">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm lg:gap-grid-gutter">

                {/* Dynamic Top Buy Signal Card */}
                <div className="p-sm lg:p-lg bg-surface-container rounded-xl border border-outline-variant relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
                  {intelState?.buySignal ? (
                    <>
                      <div className="flex justify-between items-start mb-sm lg:mb-md">
                        <div>
                          <p className="text-label-caps text-primary uppercase mb-xs tracking-wider text-[10px] font-black">Top Buy Signal</p>
                          <h3 className="font-headline-md text-headline-sm text-on-surface font-black uppercase text-sm lg:text-base">
                            {intelState.buySignal.symbol} <br />
                            <span className="text-primary font-bold text-lg lg:text-2xl">${intelState.buySignal.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="font-display-lg text-primary text-2xl lg:text-4xl leading-none font-bold">{intelState.buySignal.confidence}<span className="text-body-md font-medium">%</span></span>
                          <p className="text-label-caps opacity-60 text-[10px]">Confidence</p>
                        </div>
                      </div>
                      
                      {/* 🟢 MULTI-REASON MAPPING: Pulls all raw catalyst factors live from array context node instead of index [0] */}
                      <div className="flex flex-col gap-1.5 mb-sm lg:mb-lg max-h-24 overflow-y-auto pr-1">
                        {coins[intelState.buySignal.symbol]?.signalContext?.reasons.map((r, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] text-gray-300 font-mono bg-primary/5 px-2 py-1 rounded border border-primary/10">
                            <span className="text-primary font-bold">⚡</span>
                            <span className="truncate uppercase">{r}</span>
                          </div>
                        )) || <span className="px-sm py-1 rounded bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold uppercase">{intelState.buySignal.reason}</span>}
                      </div>

                      <button onClick={() => handleOpenTrade(intelState.buySignal!.symbol)} className="w-full py-xs lg:py-sm bg-primary text-on-primary font-bold rounded hover:brightness-111 active:scale-[0.98] transition-all text-xs uppercase cursor-pointer">OPEN LONG POSITION</button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-lg gap-sm text-center">
                      <span className="material-symbols-outlined text-primary/40 text-4xl animate-pulse">search</span>
                      <p className="text-label-caps text-primary uppercase text-[10px] font-black">Top Buy Signal</p>
                      <p className="text-on-surface-variant text-xs">{intelState?.engineStatus === 'initializing' ? 'Engine scanning markets...' : 'No strong buy signal detected'}</p>
                    </div>
                  )}
                </div>

                {/* Dynamic Top Short Signal Card */}
                <div className="p-sm lg:p-lg bg-surface-container rounded-xl border border-outline-variant relative overflow-hidden group hover:border-error/40 transition-all duration-300">
                  {intelState?.shortSignal ? (
                    <>
                      <div className="flex justify-between items-start mb-sm lg:mb-md">
                        <div>
                          <p className="text-label-caps text-error uppercase mb-xs tracking-wider text-[10px] font-black">Top Short Signal</p>
                          <h3 className="font-headline-md text-headline-sm text-on-surface font-black uppercase text-sm lg:text-base">
                            {intelState.shortSignal.symbol}<br />
                            <span className="font-bold text-lg lg:text-2xl">${intelState.shortSignal.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="font-display-lg text-error text-2xl lg:text-4xl leading-none font-bold">{intelState.shortSignal.confidence}<span className="text-body-md font-medium">%</span></span>
                          <p className="text-label-caps opacity-60 text-[10px]">Confidence</p>
                        </div>
                      </div>

                      {/* 🟢 MULTI-REASON MAPPING: Pulls short catalyst flags directly */}
                      <div className="flex flex-col gap-1.5 mb-sm lg:mb-lg max-h-24 overflow-y-auto pr-1">
                        {coins[intelState.shortSignal.symbol]?.signalContext?.reasons.map((r, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] text-gray-300 font-mono bg-error/5 px-2 py-1 rounded border border-error/10">
                            <span className="text-error font-bold">🚨</span>
                            <span className="truncate uppercase">{r}</span>
                          </div>
                        )) || <span className="px-sm py-1 rounded bg-error/10 border border-error/20 text-[10px] text-error font-semibold uppercase">{intelState.shortSignal.reason}</span>}
                      </div>

                      <button onClick={() => handleOpenTrade(intelState.shortSignal!.symbol)} className="w-full py-xs lg:py-sm bg-error text-on-error font-bold rounded hover:brightness-111 active:scale-[0.98] transition-all text-xs uppercase cursor-pointer">OPEN SHORT POSITION</button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-lg gap-sm text-center">
                      <span className="material-symbols-outlined text-error/40 text-4xl animate-pulse">search</span>
                      <p className="text-label-caps text-error uppercase text-[10px] font-black">Top Short Signal</p>
                      <p className="text-on-surface-variant text-xs">{intelState?.engineStatus === 'initializing' ? 'Engine scanning markets...' : 'No strong short signal detected'}</p>
                    </div>
                  )}
                </div>

              </div>
            </section>
          </div>
          {/* TOP CHART CANVAS ROW */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 items-start">
            <div className="xl:col-span-2 glass-panel rounded-2xl overflow-hidden border border-outline-variant/60 bg-surface">
              <ChartContainer />
            </div>
            
            {/* INSTANT DEPTH EXECUTION CONSOLE */}
            <div className="glass-panel p-4 rounded-2xl border border-outline-variant/60 bg-surface space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                <h2 className="text-xs font-black text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                  Instant Order Routing Execution
                </h2>
                <span className="text-[10px] font-black font-mono px-1.5 py-0.5 bg-surface-container-high border border-outline-variant rounded text-on-surface">
                  {selectedCoin}/USDT
                </span>
                
              </div>

              {/* Mini Asset Metrics ticker */}
              <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2 rounded-xl border border-outline-variant/40 font-mono text-[11px]">
                <div className="flex flex-col">
                  <span className="text-on-surface-variant text-[10px]">MARKET PRICE</span>
                  <span className="font-bold text-on-surface">
                    ${coins[selectedCoin]?.price.toLocaleString(undefined, { minimumFractionDigits: coins[selectedCoin]?.price < 1 ? 6 : 2 })}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-on-surface-variant text-[10px]">24H CHANGE</span>
                  <span className={`font-bold ${coins[selectedCoin]?.change24h >= 0 ? 'text-primary' : 'text-error'}`}>
                    {coins[selectedCoin]?.change24h >= 0 ? '+' : ''}{coins[selectedCoin]?.change24h}%
                  </span>
                </div>
              </div>

              {/* Direct Quick Execution Triggers */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleOpenTrade(selectedCoin)}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 font-mono"
                >
                  INITIALIZE LONG POSITION
                </button>
                <button
                  onClick={() => handleOpenTrade(selectedCoin)}
                  className="w-full py-3 bg-error hover:bg-error-hover text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-error/10 hover:shadow-error/20 font-mono"
                >
                  INITIALIZE SHORT POSITION
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC INTEGRATION MIDDLEWARE LAYER */}
          <section id="signal-intel" className="space-y-4">
            <div className="glass-panel p-4 rounded-2xl border border-outline-variant/60 bg-surface">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2 mb-3">
                <h2 className="text-xs font-black text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-lg">insights</span>
                  Macro Intelligence Core Sync Engine
                </h2>
                <span className="text-[10px] font-bold font-mono text-on-surface-variant">
                  STATUS: {intelState?.engineStatus?.toUpperCase() || 'OK'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-on-surface-variant block text-[10px] mb-0.5">BIAS DIRECTION</span>
                  <span className="font-black text-primary uppercase tracking-wider">{intelState?.marketTrend || 'BULLISH STUCTURE'}</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-on-surface-variant block text-[10px] mb-0.5">RECOMMENDED STANCE</span>
                  <span className="font-black text-on-surface uppercase tracking-wider">{intelState?.recommendedStance || 'ACCUMULATE LEVERAGE'}</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-on-surface-variant block text-[10px] mb-0.5">STRONGEST SECTORS</span>
                  <span className="font-bold text-primary truncate block uppercase">{intelState?.strongestSectors?.join(', ') || 'SOLANA ECO, MEMES'}</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-on-surface-variant block text-[10px] mb-0.5">WEAKEST SECTORS</span>
                  <span className="font-bold text-error truncate block uppercase">{intelState?.weakestSectors?.join(', ') || 'L1 DEFI, STABLES'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 🟢 NEW MOUNTED LAYER: Dynamic Screener Engine Block */}
          <DynamicScreenerPanel />


           {/* --- 📊 LIVE COIN SIGNALS & BIAS TABLE --- */}
        <section className="glass-panel rounded-xl overflow-hidden">
          <div className="p-sm lg:p-md border-b border-outline-variant bg-surface-container-lowest/30 flex justify-between items-center">
            <h3 className="font-display-lg text-xs lg:text-sm uppercase font-bold tracking-wider flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">table_chart</span>
              <span className="hidden sm:inline">Market Trade Intelligence & Bias Tracker</span>
              <span className="sm:hidden">Market Intel</span>
            </h3>
            <span className="bg-primary/10 text-primary text-[10px] px-sm py-0.5 rounded border border-primary/20 font-bold animate-pulse hidden sm:block">REAL-TIME COIN METRICS</span>
          </div>

          <div className="p-sm lg:p-md overflow-x-auto">
            {!intelState?.allSignals || intelState.allSignals.length === 0 ? (
              <div className="py-xl text-center text-on-surface-variant text-sm flex flex-col items-center gap-sm">
                <span className="material-symbols-outlined text-4xl opacity-30 animate-spin">sync</span>
                <span>Fetching live market metrics across {selectedTimeframe}...</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse font-mono text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-outline-variant/55 text-[10px] text-on-surface-variant uppercase tracking-wider">
                    <th className="py-sm">Coin</th>
                    <th className="py-sm text-right">Price</th>
                    <th className="py-sm text-center">Trend Bias</th>
                    <th className="py-sm text-center">Action Stance</th>
                    <th className="py-sm text-center">Confidence</th>
                    <th className="py-sm text-center">Risk Level</th>
                    <th className="py-sm">Target Levels</th>
                    <th className="py-sm">Key Catalyst Trigger Series</th>
                    {/* <th className="py-sm text-center">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {intelState.allSignals.map((sig) => {
                    const actionColors =
                      sig.action === 'BUY' ? 'bg-primary/10 text-primary border border-primary/20 font-bold' :
                      sig.action === 'SELL' ? 'bg-error/10 text-error border border-error/20 font-bold' :
                      sig.action === 'AVOID' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold' :
                      'bg-surface-container-high text-on-surface border border-outline-variant';

                    const trendColors = sig.trend.includes('Bullish') ? 'text-primary font-bold' : 'text-error font-bold';

                    return (
                      <tr key={sig.coin} className="border-b border-outline-variant/30 hover:bg-surface-container-high/30 transition-colors">
                        <td className="py-sm font-bold text-on-surface">{sig.coin}/USDT</td>
                        <td className="py-sm text-right font-bold">${sig.entry.toLocaleString(undefined, { minimumFractionDigits: sig.coin === 'PEPE' ? 8 : 2 })}</td>
                        <td className={`py-sm text-center text-[10px] uppercase ${trendColors}`}>{sig.trend}</td>
                        <td className="py-sm text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${actionColors}`}>{sig.action}</span>
                        </td>
                        <td className="py-sm text-center font-bold text-on-surface">{sig.confidence}%</td>
                        <td className="py-sm text-center min-w-[100px]">
                          <div className="flex flex-col gap-0.5 items-center">
                            <div className="w-20 h-1.5 bg-outline-variant rounded-full overflow-hidden flex">
                              <div className={`h-full transition-all duration-500 ${sig.risk_score > 70 ? 'bg-error' : sig.risk_score > 40 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${sig.risk_score}%` }} />
                            </div>
                            <span className="text-[9px] text-on-surface-variant">{sig.risk_score}/100 Risk</span>
                          </div>
                        </td>
                        <td className="py-sm font-mono text-[10px] space-y-0.5">
                          <div><span className="text-on-surface-variant">ENT:</span> <span className="text-primary font-bold">${sig.entry.toLocaleString(undefined, { minimumFractionDigits: sig.coin === 'PEPE' ? 8 : 2 })}</span></div>
                          <div><span className="text-on-surface-variant">SL:</span> <span className="text-error font-bold">${sig.stop_loss.toLocaleString(undefined, { minimumFractionDigits: sig.coin === 'PEPE' ? 8 : 2 })}</span></div>
                          <div><span className="text-on-surface-variant">TP1:</span> <span className="text-primary font-bold">${sig.take_profit?.[0]?.toLocaleString(undefined, { minimumFractionDigits: sig.coin === 'PEPE' ? 8 : 2 })}</span></div>
                          {/* 🟢 RISK PANEL WIDGET INJECTION: Renders institutional recommended max portfolio allocation percentage */}
                          <div className="text-[9px] text-orange-400 font-bold bg-orange-500/5 px-1 rounded border border-orange-500/10 mt-1 max-w-max">ALLOC: MAX {sig.suggestedPositionSizePct}%</div>
                        </td>
                        
                        {/* 🟢 DETAILED REASONS MAP CONTAINER: Lists full mathematical validations inside the data cells */}
                        <td className="py-sm text-on-surface-variant text-[10px] max-w-[240px] space-y-1">
                          {sig.reasons.slice(0, 3).map((r, i) => (
                            <div key={i} className="flex gap-1 items-start truncate" title={r}>
                              <span className="text-primary text-[9px]">▪</span>
                              <span className="uppercase text-gray-400 tracking-tight">{r}</span>
                            </div>
                          ))}
                        </td>
{/* 
                        <td className="py-sm text-center space-x-xs whitespace-nowrap">
                          <button onClick={() => handleOpenTrade(sig.coin)} className="bg-primary/15 border border-primary/30 hover:bg-primary/20 hover:text-primary text-primary font-sans font-bold px-2 py-1 rounded text-[10px] transition-all cursor-pointer uppercase">Long</button>
                          <button onClick={() => handleOpenTrade(sig.coin)} className="bg-error/15 border border-error/30 hover:bg-error/20 hover:text-error text-error font-sans font-bold px-2 py-1 rounded text-[10px] transition-all cursor-pointer uppercase">Short</button>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>


          {/* WHALE TRACKER FLOOD NETWORK LOGS */}
          <section id="whale-tracker" className="glass-panel p-4 rounded-2xl border border-outline-variant/60 bg-surface">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2 mb-3">
              <h2 className="text-xs font-black text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-lg">monitoring</span>
                Whale Order Flow Matrix Feed
              </h2>
            </div>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto font-mono text-[11px] pr-1">
              {whaleAlerts.map((w) => (
                <div key={w.id} className="flex justify-between items-center p-2 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-outline-variant/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-sm animate-pulse">warning</span>
                    <span className="text-on-surface font-bold">🚨 {w.amount} {w.token}</span>
                    <span className="text-on-surface-variant uppercase text-[10px]">Routed from {w.from} → to {w.to}</span>
                  </div>
                  <span className="text-on-surface-variant font-bold text-[10px]">{w.timeAgo}</span>
                </div>
              ))}
            </div>
          </section>
          {/* RISK PORTFOLIO & ACTIVE TRACKER BLOCK */}
          <section id="portfolio-section" className="glass-panel rounded-2xl overflow-hidden border border-outline-variant/60 bg-surface">
            <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h2 className="text-xs font-black text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-lg">account_balance_wallet</span>
                Active Engine Positions & Risk Allocations ({positions.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-high/40 text-on-surface-variant text-[10px] font-black uppercase tracking-wider">
                    <th className="p-3">MARKET ASSET</th>
                    <th className="p-3">SIDE</th>
                    <th className="p-3">ENTRY PRICE</th>
                    <th className="p-3">MARK PRICE</th>
                    <th className="p-3">POSITION SIZE</th>
                    <th className="p-3">UNREALIZED PNL</th>
                    <th className="p-3 text-right">LIQUIDATION MANAGEMENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {positions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-on-surface-variant font-medium uppercase tracking-wider text-[11px]">
                        No active portfolio allocations deployed. Awaiting trade signals execution.
                      </td>
                    </tr>
                  ) : (
                    positions.map((pos) => {
                      const isLong = pos.direction === 'LONG';
                      const isProfit = pos.pnl >= 0;
                      
                      return (
                        <tr key={pos.id} className="hover:bg-surface-container-low/40 transition-colors">
                          <td className="p-3 font-black text-on-surface">{pos.coin}/USDT <span className="text-[10px] text-on-surface-variant font-bold bg-surface-container-high px-1 py-0.5 rounded border ml-1">{pos.leverage}x</span></td>
                          <td className="p-3">
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${isLong ? 'text-primary bg-primary/10 border-primary/20' : 'text-error bg-error/10 border-error/20'}`}>
                              {pos.direction}
                            </span>
                          </td>
                          <td className="p-3 text-on-surface-variant">${pos.entryPrice.toLocaleString()}</td>
                          <td className="p-3 text-on-surface font-bold">${pos.currentPrice.toLocaleString()}</td>
                          <td className="p-3 text-on-surface-variant">{pos.size.toLocaleString()} {pos.coin}</td>
                          <td className={`p-3 font-black ${isProfit ? 'text-primary' : 'text-error'}`}>
                            ${pos.pnl.toLocaleString()} ({isProfit ? '+' : ''}{pos.pnlPercent}%)
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => closePosition(pos.id)}
                              className="px-2.5 py-1 text-[10px] font-black text-error border border-error/30 hover:border-error hover:bg-error/10 rounded-lg transition-all uppercase tracking-wide"
                            >
                              Market Close
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR BARRIER */}
      <footer className="sticky bottom-0 z-30 flex h-14 w-full items-center justify-around border-t border-outline-variant bg-surface px-2 lg:hidden font-mono">
        <a href="#market-watchlist" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[9px] font-bold uppercase">Chart</span>
        </a>
        <a href="#signal-intel" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
          <span className="material-symbols-outlined text-xl">insights</span>
          <span className="text-[9px] font-bold uppercase">Signals</span>
        </a>
        <a href="#whale-tracker" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
          <span className="material-symbols-outlined text-xl">monitoring</span>
          <span className="text-[9px] font-bold uppercase">Whales</span>
        </a>
        <a href="#portfolio-section" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
          <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
          <span className="text-[9px] font-bold uppercase">Risk</span>
        </a>
      </footer>

    </div>
  );
};