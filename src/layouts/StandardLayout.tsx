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
  trend: 'Bullish' | 'Bearish';
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

  // --- LIVE MARKET INTELLIGENCE STATE ---
  // Default fallbacks jo backend down hone par dikhenge
  const [liveSignals, setLiveSignals] = useState<BackendSignals>({
    marketTrend: 'NEUTRAL',
    recommendedStance: 'PRESERVE_CAPITAL',
    strongestSectors: [],
    weakestSectors: [],
    buySignal: { symbol: 'BTC', price: 0, confidence: 0, reason: 'RSI OVERSOLD', type: 'LONG' },
    shortSignal: { symbol: 'SOL', price: 0, confidence: 0, reason: 'BEARISH DIVERGENCE', type: 'SHORT' },
    allSignals: [],
    lastSyncTimestamp: null
  });

  // Real-time API integration
  useEffect(() => {
    const fetchLiveSignals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/signals');
        if (response.ok) {
          const data: BackendSignals = await response.json();
          setLiveSignals(data);
        }
      } catch (error) {
        console.error("Market Intelligence Engine offline:", error);
      }
    };

    // Har 10 seconds baad data pool hoga
    fetchLiveSignals();
    const interval = setInterval(fetchLiveSignals, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectCoin = (symbol: string) => {
    setSelectedCoin(symbol);
  };

  const handleOpenTrade = (symbol: string) => {
    setSelectedCoin(symbol);
    setShowTradeModal(true);
  };

  return (
    <div className="relative min-h-screen">
      {/* SideNavBar Shell */}
      <aside className="w-60 h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col py-lg px-md z-50">
        <div className="mb-xl">
          <h1 className="font-display-lg text-headline-sm font-bold text-primary tracking-tighter">QuantTrader Pro</h1>
          <p className="text-on-surface-variant font-label-tabular text-[10px] opacity-70">Terminal v5.0 Pro</p>
        </div>

        <nav className="flex-1 space-y-base">
          <a className="flex items-center gap-md px-md py-sm text-primary font-bold border-r-2 border-primary bg-primary-container/10 transition-all scale-[0.98]" href="#command-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-body-md">Command Center</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200" href="#signal-intel">
            <span className="material-symbols-outlined">insights</span>
            <span className="font-body-md">Signal Intel</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200" href="#whale-tracker">
            <span className="material-symbols-outlined">monitoring</span>
            <span className="font-body-md">Whale Tracker</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200" href="#market-pulse">
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-body-md">Market Pulse</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200" href="#portfolio-section">
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
      <header className="fixed top-0 right-0 w-[calc(100%-240px)] h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm flex justify-between items-center px-lg z-40">
        <div className="flex items-center gap-xl">
          <span className="font-headline-md text-headline-md font-black text-on-surface tracking-tighter">CryptoCommand</span>
          <div className="flex items-center gap-lg font-label-tabular text-xs text-on-surface-variant">
            <span className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Global Mkt Cap: $2.4T
            </span>
            <span className="flex items-center gap-xs">
              Fear & Greed: <span className="text-primary font-bold">{fearGreedIndex} ({fearGreedIndex >= 75 ? 'Extreme Greed' : fearGreedIndex >= 55 ? 'Greed' : 'Neutral'})</span>
            </span>
            <span className="flex items-center gap-xs">
              Mkt Trend: <span className={`font-bold ${liveSignals.marketTrend === 'BULLISH' ? 'text-primary' : liveSignals.marketTrend === 'BEARISH' ? 'text-error' : 'text-on-surface-variant'}`}>{liveSignals.marketTrend}</span>
            </span>
            <span className="flex items-center gap-xs hidden xl:inline-flex">
              Stance: <span className="font-mono text-[10px] bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 text-primary font-bold">{liveSignals.recommendedStance}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button
            onClick={() => handleOpenTrade(selectedCoin)}
            className="px-lg py-xs bg-primary-container/20 border border-primary/30 text-primary font-bold rounded hover:bg-primary/20 transition-all text-sm cursor-pointer"
          >
            Execute Trade
          </button>

          <div className="flex items-center gap-sm text-on-surface-variant">
            <button className="p-base hover:text-primary transition-opacity"><span className="material-symbols-outlined">notifications</span></button>
            <button className="p-base hover:text-primary transition-opacity"><span className="material-symbols-outlined">account_balance</span></button>
            <button className="p-base hover:text-primary transition-opacity"><span className="material-symbols-outlined">grid_view</span></button>
          </div>

          <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline overflow-hidden">
            <img alt="Trader Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNwdUQQKqtRbMgD7jdxhVQcErKTCNVtP5U1iFUg-NX3Tzg90ZA8-hagjMEE8xVTUecmsZGKGhrTyoG-9TvfMPCapgYZCppBRhxAoEWAvQtODEPYFpiWJMLolHKNXUyKojNKhMGz1UHyyJS-YtEogHXRN5hrnkQaxF6rg3HpuoXBR6bDjBvbBZxudxB2qkfs2NW8bHIZo1_kx0gQIaS7J6_jdOi-pfrtUmKKsuMFC64e5t9m027lLFQMKaRNuVFCgHP5VGK9wE3Jg" />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-60 pt-20 p-lg min-h-screen space-y-lg">

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

        <div className="grid grid-cols-12 gap-grid-gutter items-start">
          {/* Command Center (Hero Chart) */}
          <section id="command-center" className="col-span-12 lg:col-span-8 glass-panel rounded-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest/30">
              <div className="flex items-center gap-md">
                <span className="font-headline-sm text-on-surface text-lg uppercase font-bold tracking-wider">{selectedCoin} / USDT</span>
                <span className="bg-primary/10 text-primary text-[10px] px-sm py-0.5 rounded border border-primary/20 font-bold animate-pulse">LIVE FEED</span>
              </div>
              <div className="relative">
                <select
                  value={selectedCoin}
                  onChange={(e) => handleSelectCoin(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant rounded pl-md pr-lg py-xs text-xs font-semibold focus:outline-none focus:border-primary transition-all text-on-surface select-none"
                >
                  {Object.keys(coins).map((sym) => (
                    <option key={sym} value={sym}>{sym} - {coins[sym].name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1 p-lg relative bg-[#020617] flex flex-col justify-center">
              <ChartContainer />
            </div>
          </section>

          {/* --- 🔮 DYNAMIC INTELLIGENCE SIGNAL SECTION --- */}
          <section id="signal-intel" className="col-span-12 lg:col-span-4 flex flex-col gap-grid-gutter">

            {/* Dynamic Top Buy Signal Card */}
            <div className="p-lg bg-surface-container rounded-xl border border-outline-variant relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
              <div className="flex justify-between items-start mb-md">
                <div>
                  <p className="text-label-caps text-primary uppercase mb-xs tracking-wider text-[10px] font-black">Top Buy Signal</p>
                  <h3 className="font-headline-md text-headline-sm text-on-surface font-black uppercase">{liveSignals.buySignal?.symbol || 'N/A'} <br /> <span className="text-primary font-bold text-2xl">${liveSignals.buySignal?.price.toLocaleString() || '0.00'}</span></h3>               </div>
                <div className="text-right">
                  <span className="font-display-lg text-primary text-4xl leading-none font-bold">{liveSignals.buySignal?.confidence || 0}<span className="text-body-md font-medium">%</span></span>
                  <p className="text-label-caps opacity-60 text-[10px]">Confidence</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-xs mb-lg">
                <span className="px-sm py-1 rounded bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold uppercase">
                  {liveSignals.buySignal?.reason || 'ANALYZING MARKET'}
                </span>
                <span className="px-sm py-1 rounded bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold uppercase">
                  VOLUME CONFIRMED
                </span>
              </div>
              <button
                onClick={() => liveSignals.buySignal && handleOpenTrade(liveSignals.buySignal.symbol)}
                className="w-full py-sm bg-primary text-on-primary font-bold rounded hover:brightness-111 active:scale-[0.98] transition-all text-xs uppercase cursor-pointer"
              >
                OPEN LONG POSITION
              </button>
            </div>

            {/* Dynamic Top Short Signal Card */}
            <div className="p-lg bg-surface-container rounded-xl border border-outline-variant relative overflow-hidden group hover:border-error/40 transition-all duration-300">
              <div className="flex justify-between items-start mb-md">
                <div>
                  <p className="text-label-caps text-error uppercase mb-xs tracking-wider text-[10px] font-black">Top Short Signal</p>
                  <h3 className="font-headline-md text-headline-sm text-on-surface font-black uppercase">{liveSignals.shortSignal?.symbol || 'N/A'}<br /> <span className="font-bold text-2xl">${liveSignals.shortSignal?.price.toLocaleString() || '0.00'}</span></h3>
                </div>
                <div className="text-right">
                  <span className="font-display-lg text-error text-4xl leading-none font-bold">{liveSignals.shortSignal?.confidence || 0}<span className="text-body-md font-medium">%</span></span>
                  <p className="text-label-caps opacity-60 text-[10px]">Confidence</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-xs mb-lg">
                <span className="px-sm py-1 rounded bg-error/10 border border-error/20 text-[10px] text-error font-semibold uppercase">
                  {liveSignals.shortSignal?.reason || 'ANALYZING MARKET'}
                </span>
                <span className="px-sm py-1 rounded bg-error/10 border border-error/20 text-[10px] text-error font-semibold uppercase">
                  MOMENTUM WEAK
                </span>
              </div>
              <button
                onClick={() => liveSignals.shortSignal && handleOpenTrade(liveSignals.shortSignal.symbol)}
                className="w-full py-sm bg-error text-on-error font-bold rounded hover:brightness-111 active:scale-[0.98] transition-all text-xs uppercase cursor-pointer"
              >
                OPEN SHORT POSITION
              </button>
            </div>
          </section>
        </div>

        {/* Whale Alert Tracker */}
        <div className="grid grid-cols-12 gap-grid-gutter items-start">
          <section id="whale-tracker" className="col-span-12 lg:col-span-5 glass-panel rounded-xl flex flex-col h-[380px] overflow-hidden">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest/30">
              <h3 className="font-headline-sm text-sm uppercase font-bold flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                Whale Tracker
              </h3>
              <span className="bg-tertiary/10 text-tertiary text-[10px] px-sm py-0.5 rounded font-bold">LIVE AUTO FEED</span>
            </div>
            <div className="flex-1 overflow-y-auto p-md space-y-sm">
              {whaleAlerts.map((whale) => (
                <div
                  key={whale.id}
                  className="p-sm bg-surface-container-high/40 border-l-4 border-tertiary rounded flex items-center justify-between hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex gap-md items-center">
                    <div className="p-xs bg-tertiary/15 rounded-full">
                      <span className="material-symbols-outlined text-tertiary text-lg">water_drop</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        ${whale.amount} <span className="text-tertiary">{whale.token}</span>
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-label-tabular">
                        {whale.from} → {whale.to}
                      </p>
                    </div>
                  </div>
                  <span className="text-label-tabular text-on-surface-variant text-[10px] font-semibold">{whale.timeAgo}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Market Pulse Widgets */}
          <section id="market-pulse" className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-grid-gutter">
            {/* Trending Coins */}
            <div className="glass-panel p-md rounded-xl col-span-2 sm:col-span-1 flex flex-col h-[380px]">
              <h4 className="text-label-caps text-on-surface-variant uppercase font-bold text-[10px] mb-md tracking-wider border-b border-outline-variant pb-sm">Trending Momentum</h4>
              <div className="space-y-md flex-1 overflow-y-auto pr-xs">
                {Object.values(coins).slice(4).map((c) => {
                  const isUp = c.change24h >= 0;
                  return (
                    <div
                      key={c.symbol}
                      onClick={() => handleSelectCoin(c.symbol)}
                      className="flex items-center justify-between p-sm rounded hover:bg-surface-container-high/40 cursor-pointer transition-colors"
                    >
                      <span className="font-label-tabular text-xs font-bold">{c.symbol}/USDT</span>
                      <div className="w-24 h-6 flex items-end gap-0.5 opacity-80">
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
            <div className="glass-panel p-md rounded-xl col-span-2 sm:col-span-1 flex flex-col items-center justify-center text-center h-[380px]">
              <h4 className="text-label-caps text-on-surface-variant uppercase font-bold text-[10px] mb-sm tracking-wider self-start">Sentiment Index</h4>
              <div className="relative w-36 h-36 flex items-center justify-center mt-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-highest" cx="72" cy="72" fill="transparent" r="62" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-primary" cx="72" cy="72" fill="transparent" r="62" stroke="currentColor" strokeDasharray="389.5" strokeDashoffset={`${389.5 - (389.5 * fearGreedIndex) / 100}`} strokeWidth="8"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display-lg text-primary text-4xl font-black leading-none">{fearGreedIndex}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mt-1">
                    {fearGreedIndex >= 75 ? 'Ext Greed' : fearGreedIndex >= 55 ? 'Greed' : 'Neutral'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-md max-w-[200px] leading-relaxed">
                {fearGreedIndex >= 60 ? 'Market is trending towards extreme greed. Accumulate cautiously.' : 'Market structure is dynamic. Trade setup updates live.'}
              </p>
            </div>
          </section>
        </div>

        {/* --- 📊 LIVE COIN SIGNALS & BIAS TABLE --- */}
        <section className="glass-panel rounded-xl overflow-hidden">
          <div className="p-md border-b border-outline-variant bg-surface-container-lowest/30 flex justify-between items-center">
            <h3 className="font-display-lg text-sm uppercase font-bold tracking-wider flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">table_chart</span>
              Market Trade Intelligence & Bias Tracker
            </h3>
            <span className="bg-primary/10 text-primary text-[10px] px-sm py-0.5 rounded border border-primary/20 font-bold animate-pulse">
              REAL-TIME COIN METRICS
            </span>
          </div>

          <div className="p-md overflow-x-auto">
            {!liveSignals.allSignals || liveSignals.allSignals.length === 0 ? (
              <div className="py-xl text-center text-on-surface-variant text-sm flex flex-col items-center gap-sm">
                <span className="material-symbols-outlined text-4xl opacity-30 animate-spin">sync</span>
                <span>Fetching live market intelligence metrics...</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse font-mono text-xs">
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

                    const trendColors = sig.trend === 'Bullish' ? 'text-primary font-bold' : 'text-error font-bold';

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
          <div className="p-md border-b border-outline-variant bg-surface-container-lowest/30 flex justify-between items-center">
            <h3 className="font-display-lg text-sm uppercase font-bold tracking-wider flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              Mock Portfolio & Live Positions
            </h3>
            <div className="flex gap-lg text-xs font-mono">
              <div>
                <span className="text-on-surface-variant">Available Balance:</span>{' '}
                <span className="text-primary font-bold">${accountBalance.toLocaleString()} USDT</span>
              </div>
              <div>
                <span className="text-on-surface-variant">Active Positions:</span>{' '}
                <span className="text-on-surface font-bold">{positions.length}</span>
              </div>
            </div>
          </div>

          <div className="p-md overflow-x-auto">
            {positions.length === 0 ? (
              <div className="py-xl text-center text-on-surface-variant text-sm flex flex-col items-center gap-sm">
                <span className="material-symbols-outlined text-4xl opacity-30">account_balance_wallet</span>
                <span>No active leverage positions open. Execute a trade to begin simulation.</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse font-mono text-xs">
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
      </main >
    </div >
  );
};