import React, { useState, useEffect } from 'react';
import { useTerminal } from '../context/TerminalState';
import { ChartContainer } from '../components/ChartContainer';
// Backend response structure ke liye TypeScript interfaces
interface LiveSignal {
  symbol: string;
  price: number;
  confidence: number;
  reason: string;
  type: 'LONG' | 'SHORT' | 'HOLD';
}

interface AssetIntelligence {
  coin: string;
  action: 'BUY' | 'SELL' | 'AVOID' | 'HOLD';
  confidence: number;
  // FIX #1: Server se 4 trend values aati hain — sirf 2 nahi
  trend: 'Strongly Bullish' | 'Bullish' | 'Bearish' | 'Strongly Bearish';
  entry: number;
  stop_loss: number;
  take_profit: number[];
  risk_reward: string;
  risk_score: number;
  reasons: string[];
}

interface BackendSignals {
  marketTrend: string;
  recommendedStance: string;
  strongestSectors: string[];
  weakestSectors: string[];
  buySignal: LiveSignal | null;
  shortSignal: LiveSignal | null;
  allSignals: AssetIntelligence[];
  lastSyncTimestamp: string | null;
  // FIX #2: Backend yeh fields bhi return karta hai — interface mein missing tha
  engineStatus?: 'initializing' | 'ok' | 'degraded' | 'error';
  scanCount?: number;
  errors?: Record<string, string>;
}

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
  } = useTerminal();

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- LIVE MARKET INTELLIGENCE STATE ---
  // FIX #3: Initial state mein buySignal/shortSignal null rakho
  // Pehle price: 0 tha — "$0" display hota tha UI mein jab tak data na aaye
  // Ab null hai — UI mein "N/A" aur "0%" dikhega properly
  const [liveSignals, setLiveSignals] = useState<BackendSignals>({
    marketTrend: 'NEUTRAL',
    recommendedStance: 'PRESERVE_CAPITAL',
    strongestSectors: [],
    weakestSectors: [],
    buySignal: null,
    shortSignal: null,
    allSignals: [],
    lastSyncTimestamp: null,
    engineStatus: 'initializing',
  });
  // const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1h');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(() => {
    // Page load hote hi browser memory check karo
    return localStorage.getItem('user_timeframe') || '1h';
  });
  // Real-time API integration
  useEffect(() => {
    const fetchLiveSignals = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/signals?timeframe=${selectedTimeframe}`);

        if (response.ok) {
          const data: BackendSignals = await response.json();
          setLiveSignals(data);

          // 🟢 Value ko browser memory mein permanent save karlein
          localStorage.setItem('user_timeframe', selectedTimeframe);
        }
      } catch (error) {
        console.error("Market Intelligence Engine offline:", error);
      }
    };

    // FIX #5: Polling interval backend ke saath match karo
    // Pehle: 10 seconds — backend 30s mein data update karta hai, 3x unnecessary calls hoti thi
    // Ab: 30 seconds — backend refresh se aligned
    fetchLiveSignals();
    const interval = setInterval(fetchLiveSignals, 30000);

    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const handleSelectCoin = (symbol: string) => {
    setSelectedCoin(symbol);
  };

  const handleOpenTrade = (symbol: string) => {
    setSelectedCoin(symbol);
    setShowTradeModal(true);
  };

  // Close sidebar when clicking outside on mobile
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

      {/* SideNavBar Shell */}
      <aside
        className={`w-60 h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col py-lg px-md z-50 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        {/* Sidebar close button (mobile only) */}
        <button
          className="absolute top-3 right-3 lg:hidden p-1 rounded hover:bg-surface-container-high text-on-surface-variant"
          onClick={() => setSidebarOpen(false)}
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="mb-xl">
          <h1 className="font-display-lg text-headline-sm font-bold text-primary tracking-tighter">QuantTrader Pro</h1>
          <p className="text-on-surface-variant font-label-tabular text-[10px] opacity-70">Terminal v5.0 Pro</p>
        </div>

        <nav className="flex-1 space-y-base">
          <a className="flex items-center gap-md px-md py-sm text-primary font-bold border-r-2 border-primary bg-primary-container/10 transition-all scale-[0.98]" href="#command-center" onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-body-md">Command Center</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200" href="#signal-intel" onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined">insights</span>
            <span className="font-body-md">Signal Intel</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200" href="#whale-tracker" onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined">monitoring</span>
            <span className="font-body-md">Whale Tracker</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200" href="#market-pulse" onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-body-md">Market Pulse</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200" href="#portfolio-section" onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="font-body-md">Portfolio</span>
          </a>
        </nav>

        <div className="pt-lg border-t border-outline-variant space-y-base">
          {/* Layout Selector in Sidebar */}
          <div className="mb-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-xs">Layout Style</p>
            <div className="grid grid-cols-3 gap-xs p-1 bg-surface-container rounded border border-outline-variant">
              <button
                onClick={() => setTheme('standard')}
                className={`py-1 text-[9px] font-bold uppercase rounded transition-all ${currentTheme === 'standard' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                title="Standard Terminal"
              >
                STD
              </button>
              <button
                onClick={() => setTheme('flux')}
                className={`py-1 text-[9px] font-bold uppercase rounded transition-all ${currentTheme === 'flux' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                title="Fluid Flux"
              >
                FLUX
              </button>
              <button
                onClick={() => setTheme('monolith')}
                className={`py-1 text-[9px] font-bold uppercase rounded transition-all ${currentTheme === 'monolith' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                title="Monolith Brutalist"
              >
                MONO
              </button>
            </div>
          </div>

          <div className="p-sm bg-surface-container rounded border border-outline-variant mb-sm">
            <p className="text-[10px] text-on-surface-variant uppercase font-bold">Mock Account</p>
            <p className="text-sm font-bold text-on-surface font-mono mt-0.5">${accountBalance.toLocaleString()}</p>
          </div>
        </div>
      </aside>

      {/* TopNavBar Shell */}
      <header className="fixed top-0 left-0 right-0 lg:left-60 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm flex justify-between items-center px-md lg:px-lg z-40">
        <div className="flex items-center gap-sm lg:gap-xl">
          {/* Hamburger Menu Button (mobile only) */}
          <button
            className="lg:hidden p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <span className="font-headline-md text-headline-md font-black text-on-surface tracking-tighter text-sm lg:text-base">CryptoCommand</span>

          {/* Market stats — hidden on mobile, visible md+ */}
          <div className="hidden md:flex items-center gap-lg font-label-tabular text-xs text-on-surface-variant">
            <span className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Global Mkt Cap: $2.4T
            </span>
            <span className="flex items-center gap-xs">
              Fear &amp; Greed: <span className="text-primary font-bold">{fearGreedIndex} ({fearGreedIndex >= 75 ? 'Extreme Greed' : fearGreedIndex >= 55 ? 'Greed' : 'Neutral'})</span>
            </span>
            <span className="flex items-center gap-xs">
              Mkt Trend: <span className={`font-bold ${liveSignals.marketTrend === 'BULLISH' ? 'text-primary' : liveSignals.marketTrend === 'BEARISH' ? 'text-error' : liveSignals.marketTrend === 'SIDEWAYS' ? 'text-amber-500' : 'text-on-surface-variant'}`}>{liveSignals.marketTrend}</span>
            </span>
            <span className="flex items-center gap-xs hidden xl:inline-flex">
              Stance: <span className="font-mono text-[10px] bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 text-primary font-bold">{liveSignals.recommendedStance}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-sm lg:gap-md">
          <button
            onClick={() => handleOpenTrade(selectedCoin)}
            className="px-sm lg:px-lg py-xs bg-primary-container/20 border border-primary/30 text-primary font-bold rounded hover:bg-primary/20 transition-all text-xs lg:text-sm cursor-pointer whitespace-nowrap"
          >
            <span className="hidden sm:inline">Execute Trade</span>
            <span className="sm:hidden material-symbols-outlined text-base leading-none">add_circle</span>
          </button>

          <div className="flex items-center gap-xs lg:gap-sm text-on-surface-variant">
            <button className="p-1.5 hover:text-primary transition-opacity"><span className="material-symbols-outlined text-xl">notifications</span></button>
            <button className="p-1.5 hover:text-primary transition-opacity hidden sm:block"><span className="material-symbols-outlined text-xl">account_balance</span></button>
            <button className="p-1.5 hover:text-primary transition-opacity hidden sm:block"><span className="material-symbols-outlined text-xl">grid_view</span></button>
          </div>

          <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline overflow-hidden flex-shrink-0">
            <img alt="Trader Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNwdUQQKqtRbMgD7jdxhVQcErKTCNVtP5U1iFUg-NX3Tzg90ZA8-hagjMEE8xVTUecmsZGKGhrTyoG-9TvfMPCapgYZCppBRhxAoEWAvQtODEPYFpiWJMLolHKNXUyKojNKhMGz1UHyyJS-YtEogHXRN5hrnkQaxF6rg3HpuoXBR6bDjBvbBZxudxB2qkfs2NW8bHIZo1_kx0gQIaS7J6_jdOi-pfrtUmKKsuMFC64e5t9m027lLFQMKaRNuVFCgHP5VGK9wE3Jg" />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-0 lg:ml-60 pt-20 p-sm lg:p-lg min-h-screen space-y-sm lg:space-y-lg pb-20 lg:pb-lg">

        {/* Live Ticker Bar */}
        <div className="w-full overflow-hidden bg-surface-container rounded-xl border border-outline-variant py-xs">
          <div className="animate-ticker-scroll gap-xl px-lg">
            {Object.values(coins).map((c) => {
              const isUp = c.change24h >= 0;
              const flashClass = c.lastFlash === 'up' ? 'bg-primary/20' : c.lastFlash === 'down' ? 'bg-secondary/20' : '';
              return (
                <span
                  key={c.symbol}
                  onClick={() => handleSelectCoin(c.symbol)}
                  className={`font-label-tabular text-sm cursor-pointer px-sm py-0.5 rounded transition-all duration-300 ${flashClass} ${selectedCoin === c.symbol ? 'border border-primary/40 bg-surface-container-high' : ''}`}
                >
                  <span className="text-on-surface-variant font-semibold mr-1">{c.symbol}/USDT</span>
                  <span className={`${isUp ? 'text-primary' : 'text-error'} font-bold`}>
                    ${c.price.toLocaleString(undefined, { minimumFractionDigits: c.symbol === 'PEPE' ? 8 : 2 })} ({isUp ? '+' : ''}{c.change24h}%)
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Market stats bar (mobile only) */}
        <div className="md:hidden flex flex-wrap gap-xs text-[10px] text-on-surface-variant font-label-tabular bg-surface-container rounded-lg border border-outline-variant px-sm py-xs">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Mkt Cap: $2.4T
          </span>
          <span>
            F&amp;G: <span className="text-primary font-bold">{fearGreedIndex}</span>
          </span>
          <span>
            Trend: <span className={`font-bold ${liveSignals.marketTrend === 'BULLISH' ? 'text-primary' : liveSignals.marketTrend === 'BEARISH' ? 'text-error' : liveSignals.marketTrend === 'SIDEWAYS' ? 'text-amber-500' : 'text-on-surface-variant'}`}>{liveSignals.marketTrend}</span>
          </span>
          <span className="font-mono text-[9px] bg-primary/10 px-1 py-0.5 rounded border border-primary/20 text-primary font-bold">{liveSignals.recommendedStance}</span>
        </div>

        <div className="grid grid-cols-12 gap-sm lg:gap-grid-gutter items-start">
          {/* Command Center (Hero Chart) */}
          <section id="command-center" className="col-span-12 lg:col-span-8 glass-panel rounded-xl overflow-hidden flex flex-col min-h-[340px] lg:min-h-[500px]">
            <div className="p-sm lg:p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest/30">
              <div className="flex items-center gap-sm lg:gap-md">
                <span className="font-headline-sm text-on-surface text-sm lg:text-lg uppercase font-bold tracking-wider">{selectedCoin} / USDT</span>
                <span className="bg-primary/10 text-primary text-[10px] px-sm py-0.5 rounded border border-primary/20 font-bold animate-pulse">LIVE FEED</span>
              </div>
              <div className="relative space-x-2">
                <select
                  value={selectedCoin}
                  onChange={(e) => handleSelectCoin(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant rounded pl-sm lg:pl-md pr-sm lg:pr-lg py-xs text-xs font-semibold focus:outline-none focus:border-primary transition-all text-on-surface select-none max-w-[120px] lg:max-w-none"
                >
                  {Object.keys(coins).map((sym) => (
                    <option key={sym} value={sym}>{sym} - {coins[sym].name}</option>
                  ))}
                </select>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)} // 🟢 Dropdown change hote hi variable update hoga
                  className="bg-surface-container-lowest border border-outline-variant rounded pl-sm lg:pl-md pr-sm lg:pr-lg py-xs text-xs font-semibold focus:outline-none focus:border-primary transition-all text-on-surface select-none max-w-[120px] lg:max-w-none sm:w-60"
                >
                  <option value="5m">5 Minute (Ultra Scalp)</option>
                  <option value="15m">15 Minute (Futures Scalp)</option>
                  <option value="30m">30 Minute (Quick Trade)</option>
                  <option value="1h">1 Hour (Standard Swing)</option>
                </select>
              </div>
            </div>
            <div className="flex-1 p-sm lg:p-lg relative bg-[#020617] flex flex-col justify-center">
              <ChartContainer />
            </div>
          </section>

          {/* --- 🔮 DYNAMIC INTELLIGENCE SIGNAL SECTION --- */}
          <section id="signal-intel" className="col-span-12 lg:col-span-4 flex flex-col gap-sm lg:gap-grid-gutter">

            {/* On mobile: side-by-side cards, on lg: stacked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-sm lg:gap-grid-gutter">

              {/* Dynamic Top Buy Signal Card */}
              <div className="p-sm lg:p-lg bg-surface-container rounded-xl border border-outline-variant relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
                {liveSignals.buySignal ? (
                  <>
                    <div className="flex justify-between items-start mb-sm lg:mb-md">
                      <div>
                        <p className="text-label-caps text-primary uppercase mb-xs tracking-wider text-[10px] font-black">Top Buy Signal</p>
                        <h3 className="font-headline-md text-headline-sm text-on-surface font-black uppercase text-sm lg:text-base">
                          {liveSignals.buySignal.symbol} <br />
                          <span className="text-primary font-bold text-lg lg:text-2xl">${liveSignals.buySignal.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="font-display-lg text-primary text-2xl lg:text-4xl leading-none font-bold">{liveSignals.buySignal.confidence}<span className="text-body-md font-medium">%</span></span>
                        <p className="text-label-caps opacity-60 text-[10px]">Confidence</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-xs mb-sm lg:mb-lg">
                      <span className="px-sm py-1 rounded bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold uppercase">
                        {liveSignals.buySignal.reason}
                      </span>
                      <span className="px-sm py-1 rounded bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold uppercase">VOLUME CONFIRMED</span>
                    </div>
                    <button
                      onClick={() => handleOpenTrade(liveSignals.buySignal!.symbol)}
                      className="w-full py-xs lg:py-sm bg-primary text-on-primary font-bold rounded hover:brightness-111 active:scale-[0.98] transition-all text-xs uppercase cursor-pointer"
                    >OPEN LONG POSITION</button>
                  </>
                ) : (
                  // No buy signal — loading/scanning state
                  <div className="flex flex-col items-center justify-center py-lg gap-sm text-center">
                    <span className="material-symbols-outlined text-primary/40 text-4xl animate-pulse">search</span>
                    <p className="text-label-caps text-primary uppercase text-[10px] font-black">Top Buy Signal</p>
                    <p className="text-on-surface-variant text-xs">
                      {liveSignals.engineStatus === 'initializing' ? 'Engine scanning markets...' : 'No strong buy signal detected'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/60">
                      {liveSignals.engineStatus === 'initializing' ? 'First scan in progress' : 'Market in neutral zone'}
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Top Short Signal Card */}
              <div className="p-sm lg:p-lg bg-surface-container rounded-xl border border-outline-variant relative overflow-hidden group hover:border-error/40 transition-all duration-300">
                {liveSignals.shortSignal ? (
                  <>
                    <div className="flex justify-between items-start mb-sm lg:mb-md">
                      <div>
                        <p className="text-label-caps text-error uppercase mb-xs tracking-wider text-[10px] font-black">Top Short Signal</p>
                        <h3 className="font-headline-md text-headline-sm text-on-surface font-black uppercase text-sm lg:text-base">
                          {liveSignals.shortSignal.symbol}<br />
                          <span className="font-bold text-lg lg:text-2xl">${liveSignals.shortSignal.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="font-display-lg text-error text-2xl lg:text-4xl leading-none font-bold">{liveSignals.shortSignal.confidence}<span className="text-body-md font-medium">%</span></span>
                        <p className="text-label-caps opacity-60 text-[10px]">Confidence</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-xs mb-sm lg:mb-lg">
                      <span className="px-sm py-1 rounded bg-error/10 border border-error/20 text-[10px] text-error font-semibold uppercase">
                        {liveSignals.shortSignal.reason}
                      </span>
                      <span className="px-sm py-1 rounded bg-error/10 border border-error/20 text-[10px] text-error font-semibold uppercase">MOMENTUM WEAK</span>
                    </div>
                    <button
                      onClick={() => handleOpenTrade(liveSignals.shortSignal!.symbol)}
                      className="w-full py-xs lg:py-sm bg-error text-on-error font-bold rounded hover:brightness-111 active:scale-[0.98] transition-all text-xs uppercase cursor-pointer"
                    >OPEN SHORT POSITION</button>
                  </>
                ) : (
                  // No short signal — loading/scanning state
                  <div className="flex flex-col items-center justify-center py-lg gap-sm text-center">
                    <span className="material-symbols-outlined text-error/40 text-4xl animate-pulse">search</span>
                    <p className="text-label-caps text-error uppercase text-[10px] font-black">Top Short Signal</p>
                    <p className="text-on-surface-variant text-xs">
                      {liveSignals.engineStatus === 'initializing' ? 'Engine scanning markets...' : 'No strong short signal detected'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/60">
                      {liveSignals.engineStatus === 'initializing' ? 'First scan in progress' : 'Market in neutral zone'}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </section>
        </div>

        {/* Whale Alert Tracker */}
        <div className="grid grid-cols-12 gap-sm lg:gap-grid-gutter items-start">
          <section id="whale-tracker" className="col-span-12 lg:col-span-5 glass-panel rounded-xl flex flex-col min-h-[280px] lg:h-[380px] overflow-hidden">
            <div className="p-sm lg:p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest/30">
              <h3 className="font-headline-sm text-sm uppercase font-bold flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                Whale Tracker
              </h3>
              <span className="bg-tertiary/10 text-tertiary text-[10px] px-sm py-0.5 rounded font-bold">LIVE AUTO FEED</span>
            </div>
            <div className="flex-1 overflow-y-auto p-sm lg:p-md space-y-sm">
              {whaleAlerts.map((whale) => (
                <div
                  key={whale.id}
                  className="p-sm bg-surface-container-high/40 border-l-4 border-tertiary rounded flex items-center justify-between hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex gap-sm lg:gap-md items-center">
                    <div className="p-xs bg-tertiary/15 rounded-full flex-shrink-0">
                      <span className="material-symbols-outlined text-tertiary text-lg">water_drop</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-bold text-on-surface">
                        ${whale.amount} <span className="text-tertiary">{whale.token}</span>
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-label-tabular truncate max-w-[160px] lg:max-w-none">
                        {whale.from} → {whale.to}
                      </p>
                    </div>
                  </div>
                  <span className="text-label-tabular text-on-surface-variant text-[10px] font-semibold flex-shrink-0 ml-xs">{whale.timeAgo}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Market Pulse Widgets */}
          <section id="market-pulse" className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-sm lg:gap-grid-gutter">
            {/* Trending Coins */}
            <div className="glass-panel p-sm lg:p-md rounded-xl col-span-2 sm:col-span-1 flex flex-col min-h-[280px] lg:h-[380px]">
              <h4 className="text-label-caps text-on-surface-variant uppercase font-bold text-[10px] mb-sm lg:mb-md tracking-wider border-b border-outline-variant pb-sm">Trending Momentum</h4>
              <div className="space-y-xs lg:space-y-md flex-1 overflow-y-auto pr-xs">
                {Object.values(coins).slice(4).map((c) => {
                  const isUp = c.change24h >= 0;
                  return (
                    <div
                      key={c.symbol}
                      onClick={() => handleSelectCoin(c.symbol)}
                      className="flex items-center justify-between p-xs lg:p-sm rounded hover:bg-surface-container-high/40 cursor-pointer transition-colors"
                    >
                      <span className="font-label-tabular text-xs font-bold">{c.symbol}/USDT</span>
                      <div className="w-16 lg:w-24 h-6 flex items-end gap-0.5 opacity-80">
                        {c.history?.slice(-5).map((val, idx) => {
                          const minValHist = Math.min(...c.history.slice(-5));
                          const maxValHist = Math.max(...c.history.slice(-5));
                          const rangeHist = maxValHist - minValHist || 1;
                          const heightPct = ((val - minValHist) / rangeHist) * 80 + 20;
                          return (
                            <div
                              key={idx}
                              style={{ height: `${heightPct}%` }}
                              className={`flex-1 ${isUp ? 'bg-primary/40' : 'bg-error/40'}`}
                            />
                          );
                        })}
                      </div>
                      <span className={`text-xs font-bold ${isUp ? 'text-primary' : 'text-error'}`}>
                        {isUp ? '+' : ''}{c.change24h}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fear & Greed Gauge */}
            <div className="glass-panel p-sm lg:p-md rounded-xl col-span-2 sm:col-span-1 flex flex-col items-center justify-center text-center min-h-[280px] lg:h-[380px]">
              <h4 className="text-label-caps text-on-surface-variant uppercase font-bold text-[10px] mb-sm tracking-wider self-start">Sentiment Index</h4>
              <div className="relative w-28 h-28 lg:w-36 lg:h-36 flex items-center justify-center mt-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-highest" cx="72" cy="72" fill="transparent" r="62" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-primary" cx="72" cy="72" fill="transparent" r="62" stroke="currentColor" strokeDasharray="389.5" strokeDashoffset={`${389.5 - (389.5 * fearGreedIndex) / 100}`} strokeWidth="8"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display-lg text-primary text-3xl lg:text-4xl font-black leading-none">{fearGreedIndex}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mt-1">
                    {fearGreedIndex >= 75 ? 'Ext Greed' : fearGreedIndex >= 55 ? 'Greed' : 'Neutral'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-sm lg:mt-md max-w-[200px] leading-relaxed">
                {fearGreedIndex >= 60 ? 'Market is trending towards extreme greed. Accumulate cautiously.' : 'Market structure is dynamic. Trade setup updates live.'}
              </p>
            </div>
          </section>
        </div>

        {/* --- 📊 LIVE COIN SIGNALS & BIAS TABLE --- */}
        <section className="glass-panel rounded-xl overflow-hidden">
          <div className="p-sm lg:p-md border-b border-outline-variant bg-surface-container-lowest/30 flex justify-between items-center">
            <h3 className="font-display-lg text-xs lg:text-sm uppercase font-bold tracking-wider flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">table_chart</span>
              <span className="hidden sm:inline">Market Trade Intelligence &amp; Bias Tracker</span>
              <span className="sm:hidden">Market Intel</span>
            </h3>
            <span className="bg-primary/10 text-primary text-[10px] px-sm py-0.5 rounded border border-primary/20 font-bold animate-pulse hidden sm:block">
              REAL-TIME COIN METRICS
            </span>
          </div>

          <div className="p-sm lg:p-md overflow-x-auto">
            {!liveSignals.allSignals || liveSignals.allSignals.length === 0 ? (
              <div className="py-xl text-center text-on-surface-variant text-sm flex flex-col items-center gap-sm">
                <span className="material-symbols-outlined text-4xl opacity-30 animate-spin">sync</span>
                <span>Fetching live market intelligence metrics...</span>
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
                    <th className="py-sm">Key Catalyst</th>
                    <th className="py-sm text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {liveSignals.allSignals.map((sig) => {
                    const actionColors =
                      sig.action === 'BUY'
                        ? 'bg-primary/10 text-primary border border-primary/20 font-bold'
                        : sig.action === 'SELL'
                          ? 'bg-error/10 text-error border border-error/20 font-bold'
                          : sig.action === 'AVOID'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold'
                            : 'bg-surface-container-high text-on-surface border border-outline-variant';

                    // FIX #6: Strongly Bullish/Bearish bhi handle karo — pehle sirf Bullish/Bearish tha
                    const trendColors = sig.trend.includes('Bullish') ? 'text-primary font-bold' : 'text-error font-bold';

                    return (
                      <tr key={sig.coin} className="border-b border-outline-variant/30 hover:bg-surface-container-high/30 transition-colors">
                        <td className="py-sm font-bold text-on-surface">{sig.coin}/USDT</td>
                        <td className="py-sm text-right font-bold">${sig.entry.toLocaleString(undefined, { minimumFractionDigits: sig.coin === 'PEPE' ? 8 : 2 })}</td>
                        <td className={`py-sm text-center ${trendColors}`}>{sig.trend.toUpperCase()}</td>
                        <td className="py-sm text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${actionColors}`}>
                            {sig.action}
                          </span>
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
                          <div><span className="text-on-surface-variant">ENT:</span> <span className="text-primary font-bold">${sig.entry.toLocaleString(undefined, { minimumFractionDigits: sig.coin === 'PEPE' ? 8 : 2 }) || 'N/A'}</span></div>
                          <div><span className="text-on-surface-variant">SL:</span> <span className="text-error font-bold">${sig.stop_loss.toLocaleString(undefined, { minimumFractionDigits: sig.coin === 'PEPE' ? 8 : 2 })}</span></div>
                          <div><span className="text-on-surface-variant">TP:</span> <span className="text-primary font-bold">${sig.take_profit?.[0]?.toLocaleString(undefined, { minimumFractionDigits: sig.coin === 'PEPE' ? 8 : 2 }) || 'N/A'}</span></div>
                        </td>
                        <td className="py-sm text-on-surface-variant uppercase text-[10px] max-w-[200px] truncate" title={sig.reasons.join(', ')}>
                          {sig.reasons[0] || 'Market Equilibrium'}
                        </td>
                        <td className="py-sm text-center space-x-xs">
                          <button
                            onClick={() => handleOpenTrade(sig.coin)}
                            className="bg-primary/15 border border-primary/30 hover:bg-primary/20 hover:text-primary text-primary font-sans font-bold px-sm py-1 rounded text-[10px] transition-all cursor-pointer uppercase"
                          >
                            Long
                          </button>
                          <button
                            onClick={() => handleOpenTrade(sig.coin)}
                            className="bg-error/15 border border-error/30 hover:bg-error/20 hover:text-error text-error font-sans font-bold px-sm py-1 rounded text-[10px] transition-all cursor-pointer uppercase"
                          >
                            Short
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Portfolio & Open Positions Section */}
        <section id="portfolio-section" className="glass-panel rounded-xl overflow-hidden">
          <div className="p-sm lg:p-md border-b border-outline-variant bg-surface-container-lowest/30 flex flex-wrap justify-between items-center gap-sm">
            <h3 className="font-display-lg text-xs lg:text-sm uppercase font-bold tracking-wider flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              <span className="hidden sm:inline">Mock Portfolio &amp; Live Positions</span>
              <span className="sm:hidden">Portfolio</span>
            </h3>
            <div className="flex flex-wrap gap-sm lg:gap-lg text-xs font-mono">
              <div>
                <span className="text-on-surface-variant">Balance:</span>{' '}
                <span className="text-primary font-bold">${accountBalance.toLocaleString()} USDT</span>
              </div>
              <div>
                <span className="text-on-surface-variant">Positions:</span>{' '}
                <span className="text-on-surface font-bold">{positions.length}</span>
              </div>
            </div>
          </div>

          <div className="p-sm lg:p-md overflow-x-auto">
            {positions.length === 0 ? (
              <div className="py-xl text-center text-on-surface-variant text-sm flex flex-col items-center gap-sm">
                <span className="material-symbols-outlined text-4xl opacity-30">account_balance_wallet</span>
                <span>No active leverage positions open. Execute a trade to begin simulation.</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse font-mono text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-outline-variant/50 text-[10px] text-on-surface-variant uppercase tracking-wider">
                    <th className="py-sm">Token</th>
                    <th className="py-sm">Direction</th>
                    <th className="py-sm">Type</th>
                    <th className="py-sm">Leverage</th>
                    <th className="py-sm text-right">Size</th>
                    <th className="py-sm text-right">Entry Price</th>
                    <th className="py-sm text-right">Mark Price</th>
                    <th className="py-sm text-right">Margin</th>
                    <th className="py-sm text-right">Unrealized PNL</th>
                    <th className="py-sm text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos) => {
                    const isPnlUp = pos.pnl >= 0;
                    return (
                      <tr key={pos.id} className="border-b border-outline-variant/30 hover:bg-surface-container-high/30 transition-colors">
                        <td className="py-sm font-bold text-on-surface">{pos.coin}/USDT</td>
                        <td className="py-sm font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${pos.direction === 'LONG' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-error/10 text-error border border-error/20'}`}>
                            {pos.direction}
                          </span>
                        </td>
                        <td className="py-sm text-on-surface-variant">{pos.type}</td>
                        <td className="py-sm font-bold">{pos.leverage}x</td>
                        <td className="py-sm text-right">{pos.size} {pos.coin}</td>
                        <td className="py-sm text-right">${pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: pos.coin === 'PEPE' ? 8 : 2 })}</td>
                        <td className="py-sm text-right font-bold">${pos.currentPrice.toLocaleString(undefined, { minimumFractionDigits: pos.coin === 'PEPE' ? 8 : 2 })}</td>
                        <td className="py-sm text-right">${pos.margin.toLocaleString()} USDT</td>
                        <td className={`py-sm text-right font-bold ${isPnlUp ? 'text-primary' : 'text-error'}`}>
                          ${isPnlUp ? '+' : ''}{pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({isPnlUp ? '+' : ''}{pos.pnlPercent}%)
                        </td>
                        <td className="py-sm text-center">
                          <button
                            onClick={() => closePosition(pos.id)}
                            className="bg-error/15 border border-error/30 hover:bg-error hover:text-white text-error font-sans font-bold px-sm py-1 rounded text-[10px] transition-all cursor-pointer"
                          >
                            CLOSE
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-container-low/95 backdrop-blur-md border-t border-outline-variant z-40 flex justify-around items-center h-16">
        <a href="#command-center" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
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
        <a href="#market-pulse" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
          <span className="material-symbols-outlined text-xl">analytics</span>
          <span className="text-[9px] font-bold uppercase">Market</span>
        </a>
        <a href="#portfolio-section" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
          <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
          <span className="text-[9px] font-bold uppercase">Portfolio</span>
        </a>
      </nav>

    </div>
  );
};