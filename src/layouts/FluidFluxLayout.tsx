import React, { useState, useEffect } from 'react';
import { useTerminal } from '../context/TerminalState';
import { ChartContainer } from '../components/ChartContainer';

// Backend se aane wale data ki TypeScript type structure
interface LiveSignal {
  symbol: string;
  confidence: number;
  reason: string;
  type: 'LONG' | 'SHORT';
}

interface BackendSignals {
  buySignal: LiveSignal;
  shortSignal: LiveSignal;
}

export const FluidFluxLayout: React.FC = () => {
  const {
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
  const [liveSignals, setLiveSignals] = useState<BackendSignals>({
    buySignal: { symbol: 'SOL', confidence: 94, reason: 'RSI OVERSOLD', type: 'LONG' },
    shortSignal: { symbol: 'PEPE', confidence: 88, reason: 'BEARISH DIVERGE', type: 'SHORT' }
  });

  // Backend se automatic live intelligence data fetch karne ka function
  useEffect(() => {
    const fetchLiveSignals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/signals');
        if (response.ok) {
          const data: BackendSignals = await response.json();
          setLiveSignals(data);
        }
      } catch (error) {
        console.error("Market Intelligence Engine unreachable:", error);
      }
    };

    // Pehli baar call karne ke liye aur phir har 10 seconds baad update karne ke liye
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
    <div className="relative min-h-screen deep-forest-gradient">

      {/* SideNavBar Shell */}
      <aside className="fixed left-6 top-6 bottom-6 w-20 hover:w-60 transition-all duration-500 bg-surface/40 backdrop-blur-xl border border-outline/20 rounded-[40px] flex flex-col items-center py-xl z-50 group overflow-hidden">
        <div className="mb-xl px-md w-full flex flex-col items-center">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:hidden transition-all">
            <span className="material-symbols-outlined text-primary">terminal</span>
          </div>
          <h1 className="font-display-lg text-headline-sm font-bold text-primary tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:block">
            QuantTrader
          </h1>
        </div>

        <nav className="flex-1 w-full px-md space-y-lg flex flex-col items-center group-hover:items-stretch">
          <a className="flex items-center gap-md p-sm text-primary bg-primary/10 rounded-full transition-all justify-center group-hover:justify-start" href="#command-center" title="Command Center">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body-md opacity-0 group-hover:opacity-100 whitespace-nowrap hidden group-hover:inline">Terminal</span>
          </a>
          <a className="flex items-center gap-md p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-full transition-all justify-center group-hover:justify-start" href="#signal-hub" title="Signal Intel">
            <span className="material-symbols-outlined">insights</span>
            <span className="font-body-md opacity-0 group-hover:opacity-100 whitespace-nowrap hidden group-hover:inline">Intel</span>
          </a>
          <a className="flex items-center gap-md p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-full transition-all justify-center group-hover:justify-start" href="#pulse-sentiment" title="Market Pulse">
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-body-md opacity-0 group-hover:opacity-100 whitespace-nowrap hidden group-hover:inline">Pulse</span>
          </a>
          <a className="flex items-center gap-md p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-full transition-all justify-center group-hover:justify-start" href="#portfolio-section" title="Portfolio">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="font-body-md opacity-0 group-hover:opacity-100 whitespace-nowrap hidden group-hover:inline">Portfolio</span>
          </a>
        </nav>

        <div className="mt-auto px-md space-y-md w-full flex flex-col items-center">
          <div className="hidden group-hover:block w-full p-sm bg-surface-container/50 rounded-2xl border border-outline/10 text-center mb-sm">
            <p className="text-[9px] uppercase font-bold text-on-surface-variant mb-1">Layout</p>
            <div className="grid grid-cols-3 gap-xs">
              <button onClick={() => setTheme('standard')} className="py-1 text-[8px] bg-background/50 hover:bg-background rounded text-on-surface">STD</button>
              <button onClick={() => setTheme('flux')} className="py-1 text-[8px] bg-primary text-on-primary rounded font-bold">FLUX</button>
              <button onClick={() => setTheme('monolith')} className="py-1 text-[8px] bg-background/50 hover:bg-background rounded text-on-surface">MONO</button>
            </div>
          </div>

          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer group-hover:w-full group-hover:rounded-full group-hover:px-sm transition-all" title={`Balance: $${accountBalance.toLocaleString()}`}>
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <span className="font-mono text-xs text-on-surface ml-2 hidden group-hover:inline font-bold">
              ${accountBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </aside>

      {/* Top Header */}
      <header className="fixed top-6 left-32 right-6 h-16 bg-surface/30 backdrop-blur-md border border-outline/10 rounded-full flex justify-between items-center px-lg z-40">
        <div className="flex items-center gap-xl">
          <span className="font-headline-md text-headline-md font-black text-on-surface tracking-tighter">CryptoCommand</span>
          <div className="hidden md:flex items-center gap-lg font-label-tabular text-[12px] text-on-surface-variant">
            <span className="flex items-center gap-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Global Mkt Cap: $2.4T
            </span>
            <span className="flex items-center gap-xs">
              Fear & Greed: <span className="text-primary font-bold">{fearGreedIndex} ({fearGreedIndex >= 75 ? 'Extreme Greed' : fearGreedIndex >= 55 ? 'Greed' : 'Neutral'})</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs bg-surface-container/30 border border-outline/10 rounded-full p-1 mr-xs md:flex hidden">
            <button onClick={() => setTheme('standard')} className="px-3 py-1 rounded-full text-[10px] uppercase text-on-surface-variant hover:text-on-surface transition-all">Standard</button>
            <button onClick={() => setTheme('flux')} className="px-3 py-1 rounded-full text-[10px] uppercase bg-primary text-on-primary font-bold shadow transition-all">Flux</button>
            <button onClick={() => setTheme('monolith')} className="px-3 py-1 rounded-full text-[10px] uppercase text-on-surface-variant hover:text-on-surface transition-all">Mono</button>
          </div>

          <button
            onClick={() => handleOpenTrade(selectedCoin)}
            className="px-6 py-2 bg-primary/20 border border-primary/40 text-primary font-bold rounded-full hover:bg-primary hover:text-on-primary transition-all text-sm uppercase tracking-wider cursor-pointer"
          >
            Execute Trade
          </button>

          <div className="flex items-center gap-sm text-on-surface-variant">
            <button className="p-2 hover:bg-surface-variant rounded-full transition-all">
              <span className="material-symbols-outlined text-lg">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden ml-2">
              <img alt="Trader Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNwdUQQKqtRbMgD7jdxhVQcErKTCNVtP5U1iFUg-NX3Tzg90ZA8-hagjMEE8xVTUecmsZGKGhrTyoG-9TvfMPCapgYZCppBRhxAoEWAvQtODEPYFpiWJMLolHKNXUyKojNKhMGz1UHyyJS-YtEogHXRN5hrnkQaxF6rg3HpuoXBR6bDjBvbBZxudxB2qkfs2NW8bHIZo1_kx0gQIaS7J6_jdOi-pfrtUmKKsuMFC64e5t9m027lLFQMKaRNuVFCgHP5VGK9wE3Jg" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-32 pt-28 px-lg pb-36 min-h-screen">
        <div className="max-w-[1400px] mx-auto space-y-lg">

          {/* Live Ticker */}
          <div className="w-full overflow-hidden bg-surface-container-low/40 rounded-full border border-outline/10 py-2">
            <div className="animate-ticker-scroll gap-xl px-lg">
              {Object.values(coins).map((c) => {
                const isUp = c.change24h >= 0;
                return (
                  <span
                    key={c.symbol}
                    onClick={() => handleSelectCoin(c.symbol)}
                    className={`font-label-tabular text-sm cursor-pointer px-md py-1 rounded-full transition-all duration-300 ${selectedCoin === c.symbol ? 'bg-primary/20 border border-primary/40 font-bold' : 'hover:bg-surface-container-high/40'}`}
                  >
                    <span className="text-on-surface-variant font-medium mr-1">{c.symbol}/USDT</span>
                    <span className={`${isUp ? 'text-primary' : 'text-error'} font-bold`}>
                      ${c.price.toLocaleString(undefined, { minimumFractionDigits: c.symbol === 'PEPE' ? 8 : 2 })}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Fluid Flux Grid */}
          <div className="grid grid-cols-12 gap-lg items-start">

            {/* Hero Chart Section */}
            <section id="command-center" className="col-span-12 glass-panel organic-chart overflow-hidden flex flex-col min-h-[500px] border-primary/20 shadow-[0_0_50px_rgba(16,185,129,0.03)]">
              <div className="p-lg flex justify-between items-center">
                <div className="flex items-center gap-md">
                  <span className="font-display-lg text-headline-sm uppercase tracking-tight text-on-surface">{selectedCoin} / USDT</span>
                  <span className="bg-primary/20 text-primary text-[10px] px-3 py-1 rounded-full border border-primary/40 font-bold uppercase tracking-widest animate-pulse">
                    Live Terminal
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={selectedCoin}
                    onChange={(e) => handleSelectCoin(e.target.value)}
                    className="bg-surface/50 border border-outline/30 rounded-full px-6 py-2 text-xs font-bold focus:outline-none focus:border-primary transition-all text-on-surface select-none pr-8 cursor-pointer"
                  >
                    {Object.keys(coins).map((sym) => (
                      <option key={sym} value={sym} className="bg-surface">{sym} - {coins[sym].name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex-1 p-lg relative bg-gradient-to-b from-transparent to-surface-container-lowest/50 flex flex-col justify-center">
                <ChartContainer />
              </div>
            </section>

            {/* --- 🧠 FULLY DYNAMIC INTELLIGENT SIGNAL HUB --- */}
            <section id="signal-hub" className="col-span-12 flex flex-col md:flex-row items-center justify-center gap-xl py-lg">

              {/* Dynamic Best Buy Token Card */}
              <div
                onClick={() => handleOpenTrade(liveSignals.buySignal.symbol)}
                className="w-80 h-[360px] hub-circle glass-panel p-xl flex flex-col items-center justify-center text-center border-primary/30 relative group hover:scale-105 transition-transform duration-500 shadow-[0_0_40px_rgba(16,185,129,0.05)] cursor-pointer"
              >
                <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping group-hover:opacity-40 opacity-0"></div>
                <p className="text-label-caps text-primary uppercase mb-xs tracking-widest font-black text-[10px]">Top Buy Signal</p>
                <h3 className="font-headline-md text-headline-sm text-on-surface mb-md font-bold uppercase">{liveSignals.buySignal.symbol}</h3>
                <div className="flex flex-col items-center mb-lg">
                  <span className="text-6xl font-display-lg text-primary leading-none font-black">{liveSignals.buySignal.confidence}<span className="text-xl font-medium">%</span></span>
                  <p className="text-label-caps text-on-surface-variant opacity-60 text-[9px] uppercase">Confidence</p>
                </div>
                <div className="flex gap-2 mb-xl">
                  <span className="px-3 py-1 rounded-full bg-primary-container text-[9px] text-on-primary font-bold border border-primary/20 uppercase tracking-wider">
                    {liveSignals.buySignal.reason}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenTrade(liveSignals.buySignal.symbol); }}
                  className="px-8 py-3 bg-primary text-on-primary font-bold rounded-full hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all text-xs uppercase cursor-pointer"
                >
                  OPEN LONG POSITION
                </button>
              </div>

              {/* Dynamic Best Short Token Card */}
              <div
                onClick={() => handleOpenTrade(liveSignals.shortSignal.symbol)}
                className="w-80 h-[360px] hub-circle glass-panel p-xl flex flex-col items-center justify-center text-center border-secondary/30 relative group hover:scale-105 transition-transform duration-500 shadow-[0_0_40px_rgba(251,146,60,0.05)] cursor-pointer"
              >
                <p className="text-label-caps text-secondary uppercase mb-xs tracking-widest font-black text-[10px]">Top Short Signal</p>
                <h3 className="font-headline-md text-headline-sm text-on-surface mb-md font-bold uppercase">{liveSignals.shortSignal.symbol}</h3>
                <div className="flex flex-col items-center mb-lg">
                  <span className="text-6xl font-display-lg text-secondary leading-none font-black">{liveSignals.shortSignal.confidence}<span className="text-xl font-medium">%</span></span>
                  <p className="text-label-caps text-on-surface-variant opacity-60 text-[9px] uppercase">Confidence</p>
                </div>
                <div className="flex gap-2 mb-xl">
                  <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-[9px] text-secondary font-bold border border-secondary/20 uppercase tracking-wider">
                    {liveSignals.shortSignal.reason}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenTrade(liveSignals.shortSignal.symbol); }}
                  className="px-8 py-3 bg-secondary text-on-secondary font-bold rounded-full hover:shadow-[0_0_20px_rgba(251,146,60,0.4)] transition-all text-xs uppercase cursor-pointer"
                >
                  OPEN SHORT POSITION
                </button>
              </div>
            </section>

            {/* Pulse & Sentiment */}
            <section id="pulse-sentiment" className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-lg">
              {/* Trending Momentum */}
              <div className="glass-panel p-lg rounded-[40px] border-outline/10 flex flex-col h-[320px]">
                <div className="flex justify-between items-center mb-lg border-b border-outline/10 pb-sm">
                  <h4 className="text-label-caps text-on-surface-variant tracking-widest uppercase font-bold text-[10px]">Trending Momentum</h4>
                  <span className="material-symbols-outlined text-primary text-xl">auto_graph</span>
                </div>
                <div className="space-y-md flex-1 overflow-y-auto pr-xs">
                  {Object.values(coins).slice(3).map((c) => {
                    const isUp = c.change24h >= 0;
                    return (
                      <div
                        key={c.symbol}
                        onClick={() => handleSelectCoin(c.symbol)}
                        className="flex items-center justify-between p-sm hover:bg-surface-variant/50 rounded-2xl transition-all cursor-pointer"
                      >
                        <span className="font-label-tabular font-bold w-16 text-xs">{c.symbol}</span>
                        <div className="flex-1 h-2 bg-surface-container-highest rounded-full mx-xl overflow-hidden max-w-[150px]">
                          <div
                            className={`h-full ${isUp ? 'bg-primary' : 'bg-secondary'}`}
                            style={{ width: `${Math.min(Math.abs(c.change24h) * 8 + 10, 100)}%` }}
                          />
                        </div>
                        <span className={`font-bold text-xs ${isUp ? 'text-primary' : 'text-secondary'}`}>
                          {isUp ? '+' : ''}{c.change24h}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sentiment Gauge */}
              <div className="glass-panel p-lg rounded-[40px] border-outline/10 flex items-center gap-xl h-[320px] justify-center">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="6"></circle>
                    <circle className="text-primary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset={`${364.4 - (364.4 * fearGreedIndex) / 100}`} strokeLinecap="round" strokeWidth="10"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display-lg text-primary text-3xl font-black leading-none">{fearGreedIndex}</span>
                    <span className="text-[8px] text-on-surface-variant uppercase font-bold tracking-wider mt-1">
                      {fearGreedIndex >= 75 ? 'Ext Greed' : fearGreedIndex >= 55 ? 'Greed' : 'Neutral'}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-label-caps text-on-surface-variant mb-xs tracking-widest uppercase font-bold text-[10px]">Sentiment Index</h4>
                  <p className="text-headline-sm text-on-surface font-bold mb-sm leading-tight text-lg">
                    {fearGreedIndex >= 60 ? 'Market is trending towards greed.' : 'Market is facing correction/neutral pressure.'}
                  </p>
                  <p className="text-xs text-on-surface-variant italic">
                    Caution advised. Accumulate strategically at support zones.
                  </p>
                </div>
              </div>
            </section>

            {/* Positions Ledger */}
            <section id="portfolio-section" className="col-span-12 glass-panel rounded-[40px] overflow-hidden p-lg">
              <div className="flex justify-between items-center mb-lg border-b border-outline/10 pb-sm">
                <h3 className="font-display-lg text-headline-sm text-sm uppercase font-bold flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                  Positions Ledger
                </h3>
                <div className="flex gap-lg text-xs font-mono">
                  <span className="text-primary font-bold">Mock Balance: ${accountBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                {positions.length === 0 ? (
                  <div className="py-lg text-center text-on-surface-variant text-sm flex flex-col items-center gap-sm">
                    <span className="material-symbols-outlined text-4xl opacity-30">account_balance_wallet</span>
                    <span>No active trade positions. Ready to execute trade.</span>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-outline/10 text-[10px] text-on-surface-variant uppercase tracking-wider">
                        <th className="py-sm">Token</th>
                        <th className="py-sm">Direction</th>
                        <th className="py-sm">Leverage</th>
                        <th className="py-sm text-right">Size</th>
                        <th className="py-sm text-right">Mark Price</th>
                        <th className="py-sm text-right">Margin Required</th>
                        <th className="py-sm text-right">Unrealized PNL</th>
                        <th className="py-sm text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos) => {
                        const isPnlUp = pos.pnl >= 0;
                        return (
                          <tr key={pos.id} className="border-b border-outline/5 hover:bg-surface-variant/30 transition-colors">
                            <td className="py-sm font-bold">{pos.coin}</td>
                            <td className="py-sm">
                              <span className={`px-3 py-0.5 rounded-full text-[9px] font-bold ${pos.direction === 'LONG' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                                {pos.direction}
                              </span>
                            </td>
                            <td className="py-sm font-bold">{pos.leverage}x</td>
                            <td className="py-sm text-right">{pos.size}</td>
                            <td className="py-sm text-right">${pos.currentPrice.toLocaleString(undefined, { minimumFractionDigits: pos.coin === 'PEPE' ? 8 : 2 })}</td>
                            <td className="py-sm text-right">${pos.margin.toLocaleString()} USDT</td>
                            <td className={`py-sm text-right font-bold ${isPnlUp ? 'text-primary' : 'text-secondary'}`}>
                              ${isPnlUp ? '+' : ''}{pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({isPnlUp ? '+' : ''}{pos.pnlPercent}%)
                            </td>
                            <td className="py-sm text-center">
                              <button
                                onClick={() => closePosition(pos.id)}
                                className="bg-secondary/20 border border-secondary/35 text-secondary hover:bg-secondary hover:text-white px-3 py-1 rounded-full text-[9px] font-bold transition-all cursor-pointer"
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

          </div>
        </div>
      </main>

      {/* Footer Whale Tracker */}
      <footer className="fixed bottom-6 left-32 right-6 h-20 bg-surface/80 backdrop-blur-2xl border border-outline/20 rounded-[30px] z-50 flex items-center overflow-hidden">
        <div className="bg-primary/10 h-full px-lg flex flex-col justify-center border-r border-outline/10 min-w-[200px]">
          <h3 className="font-label-caps text-primary text-xs flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-sm">waves</span>
            Whale Tracker
          </h3>
          <p className="text-[9px] text-on-surface-variant uppercase font-black tracking-wider">Live Stream Feed</p>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-ticker-scroll gap-xl px-lg py-sm">
            {whaleAlerts.map((whale) => (
              <div
                key={whale.id}
                className="flex items-center gap-md bg-surface-container-high/40 px-lg py-3 rounded-2xl border border-primary/5 hover:border-primary/20 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-sm">water_drop</span>
                <span className="font-label-tabular text-sm font-bold text-primary">${whale.amount} {whale.token}</span>
                <span className="text-[10px] text-on-surface-variant whitespace-nowrap">{whale.from} → {whale.to}</span>
                <span className="text-[9px] text-primary/60 font-bold">{whale.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};
