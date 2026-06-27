import React, { useState } from 'react';
import { useTerminal } from '../context/TerminalState';
import { ChartContainer } from '../components/ChartContainer';

export const MonolithLayout: React.FC = () => {
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

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSelectCoin = (symbol: string) => {
    setSelectedCoin(symbol);
  };

  const handleOpenTrade = (symbol: string) => {
    setSelectedCoin(symbol);
    setShowTradeModal(true);
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface font-mono select-none">
      
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 h-14 lg:h-16 bg-background border-b-4 border-white flex justify-between items-center px-sm lg:px-lg z-50">
        <div className="flex items-center gap-md lg:gap-xl">
          {/* Hamburger Menu (mobile only) */}
          <button
            className="lg:hidden p-1.5 border-2 border-white text-on-surface hover:bg-white hover:text-black transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>

          <h1 className="font-display-lg text-sm lg:text-headline-sm font-black text-primary uppercase tracking-tighter italic truncate max-w-[160px] lg:max-w-none">
            QuantTrader
          </h1>
          <div className="hidden lg:flex items-center gap-lg font-label-tabular text-xs uppercase font-bold text-on-surface-variant">
            <span className="flex items-center gap-xs">
              <span className="w-3 h-3 bg-primary"></span>
              Global Mkt Cap: $2.4T
            </span>
            <span className="flex items-center gap-xs">
              Fear & Greed: <span className="text-primary">68 (Greed)</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-xs lg:gap-md">
          {/* Quick Layout selectors in header for Monolith theme - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-xs border-2 border-white p-1 bg-surface font-black text-[10px] uppercase">
            <button onClick={() => setTheme('standard')} className="px-2 py-0.5 hover:bg-white hover:text-black">STD</button>
            <button onClick={() => setTheme('flux')} className="px-2 py-0.5 hover:bg-white hover:text-black">FLUX</button>
            <button onClick={() => setTheme('monolith')} className="px-2 py-0.5 bg-primary text-black">MONO</button>
          </div>

          <button 
            onClick={() => handleOpenTrade(selectedCoin)}
            className="px-sm lg:px-lg py-1.5 lg:py-2 bg-primary text-on-primary font-black uppercase hover:bg-white hover:text-black transition-colors border-2 border-primary cursor-pointer text-[10px] lg:text-xs whitespace-nowrap"
          >
            <span className="hidden sm:inline">Execute Trade</span>
            <span className="sm:hidden material-symbols-outlined text-base leading-none">add_circle</span>
          </button>
          
          <div className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-white overflow-hidden flex-shrink-0">
            <img alt="Trader Avatar" className="w-full h-full object-cover grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNwdUQQKqtRbMgD7jdxhVQcErKTCNVtP5U1iFUg-NX3Tzg90ZA8-hagjMEE8xVTUecmsZGKGhrTyoG-9TvfMPCapgYZCppBRhxAoEWAvQtODEPYFpiWJMLolHKNXUyKojNKhMGz1UHyyJS-YtEogHXRN5hrnkQaxF6rg3HpuoXBR6bDjBvbBZxudxB2qkfs2NW8bHIZo1_kx0gQIaS7J6_jdOi-pfrtUmKKsuMFC64e5t9m027lLFQMKaRNuVFCgHP5VGK9wE3Jg" />
          </div>
        </div>
      </header>

      {/* Mobile Layout Selector (below header) */}
      <div className="lg:hidden fixed top-14 left-0 right-0 bg-background border-b-4 border-white z-40 flex items-center justify-center gap-1 p-1">
        <button onClick={() => setTheme('standard')} className="px-2 py-1 text-[9px] font-black uppercase border-2 border-white hover:bg-white hover:text-black transition-colors">STD</button>
        <button onClick={() => setTheme('flux')} className="px-2 py-1 text-[9px] font-black uppercase border-2 border-white hover:bg-white hover:text-black transition-colors">FLUX</button>
        <button onClick={() => setTheme('monolith')} className="px-2 py-1 text-[9px] font-black uppercase bg-primary text-black border-2 border-primary">MONO</button>
      </div>

      {/* Mobile Sidebar Drawer */}
      <aside className={`lg:hidden fixed top-14 left-0 bottom-0 w-72 bg-background border-r-4 border-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar close button */}
        <button
          className="absolute top-2 right-2 border-2 border-white p-1 hover:bg-white hover:text-black transition-colors"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="p-md border-b-4 border-white">
          <h3 className="font-label-caps uppercase font-black flex items-center gap-xs text-xs">
            <span className="material-symbols-outlined text-sm">monitoring</span> Whale Tracker
          </h3>
        </div>
        
        <div className="p-xs space-y-xs">
          {whaleAlerts.map((whale) => (
            <div key={whale.id} className="p-sm bg-surface border-2 border-white flex flex-col gap-xs">
              <div className="flex justify-between items-start">
                <p className="text-xs font-black text-primary uppercase">${whale.amount} {whale.token}</p>
                <span className="text-[10px] font-label-tabular opacity-60">{whale.timeAgo}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-label-tabular uppercase truncate">
                {whale.from} → {whale.to}
              </p>
            </div>
          ))}
        </div>
        
        {/* Sentiment Gauge inside sidebar */}
        <div className="p-md border-t-4 border-white bg-surface mt-auto">
          <h4 className="text-[10px] font-black uppercase text-primary mb-md">Sentiment Index</h4>
          <div className="flex items-center gap-md">
            <div className="relative w-14 h-14 border-4 border-primary flex items-center justify-center flex-shrink-0">
              <span className="font-black text-lg">{fearGreedIndex}</span>
            </div>
            <div>
              <span className="text-xs font-black uppercase text-white">Greed</span>
              <p className="text-[10px] leading-tight text-on-surface-variant mt-1">Market is trending towards greed.</p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-md space-y-md border-t-4 border-outline-variant">
          <a onClick={() => setMobileSidebarOpen(false)} className="flex items-center gap-md p-md bg-white text-black font-black uppercase text-xs cursor-pointer" href="#main-chart">
            <span className="material-symbols-outlined text-md">dashboard</span> Chart
          </a>
          <a onClick={() => setMobileSidebarOpen(false)} className="flex items-center gap-md p-md border-2 border-white hover:bg-primary hover:text-black transition-all font-black uppercase text-xs cursor-pointer" href="#signal-intel">
            <span className="material-symbols-outlined text-md">insights</span> Signals
          </a>
          <a onClick={() => setMobileSidebarOpen(false)} className="flex items-center gap-md p-md border-2 border-white hover:bg-primary hover:text-black transition-all font-black uppercase text-xs cursor-pointer" href="#portfolio-section">
            <span className="material-symbols-outlined text-md">account_balance_wallet</span> Portfolio
          </a>
        </nav>
      </aside>

      {/* Industrial Stack Layout */}
      <div className="flex flex-col lg:flex-row pt-14 lg:pt-16 min-h-screen">
        
        {/* Column 1 (20% on desktop, hidden on mobile - moved to sidebar) */}
        <aside className="hidden lg:flex w-[20%] fixed left-0 top-16 bottom-0 border-r-4 border-white flex-col overflow-hidden bg-background">
          <div className="p-md border-b-2 border-white bg-white text-black">
            <h3 className="font-label-caps uppercase font-black flex items-center gap-xs text-xs">
              <span className="material-symbols-outlined text-sm">monitoring</span> Whale Tracker
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-xs space-y-xs">
            {whaleAlerts.map((whale) => (
              <div key={whale.id} className="p-sm bg-surface border-2 border-white flex flex-col gap-xs">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-black text-primary uppercase">${whale.amount} {whale.token}</p>
                  <span className="text-[10px] font-label-tabular opacity-60">{whale.timeAgo}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant font-label-tabular uppercase">
                  {whale.from} → {whale.to}
                </p>
              </div>
            ))}
          </div>
          
          {/* Sentiment Gauge inside Column 1 */}
          <div className="p-md border-t-4 border-white bg-surface">
            <h4 className="text-[10px] font-black uppercase text-primary mb-md">Sentiment Index</h4>
            <div className="flex items-center gap-md">
              <div className="relative w-16 h-16 border-4 border-primary flex items-center justify-center flex-shrink-0">
                <span className="font-black text-xl">{fearGreedIndex}</span>
              </div>
              <div>
                <span className="text-xs font-black uppercase text-white">Greed</span>
                <p className="text-[10px] leading-tight text-on-surface-variant mt-1">Market is trending towards greed. Caution advised.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Column 2 (50% on desktop, full width on mobile): Central Chart, Positions & Market Pulse */}
        <main className="lg:ml-[20%] lg:w-[50%] lg:border-r-4 border-white min-h-screen bg-background pb-40 lg:pb-32">
          
          {/* Mobile market stats bar */}
          <div className="lg:hidden border-b-4 border-white bg-background px-sm py-1.5 flex flex-wrap gap-2 text-[9px] font-black uppercase text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-primary"></span>
              Mkt Cap: $2.4T
            </span>
            <span>
              F&G: <span className="text-primary">68</span>
            </span>
          </div>

          {/* Live Ticker (Now part of central flow) */}
          <div className="border-b-4 border-white bg-primary text-black py-2 overflow-hidden select-none">
            <div className="animate-ticker-scroll gap-xl px-lg font-label-tabular font-black uppercase text-[10px] lg:text-xs">
              {Object.values(coins).map((c) => {
                const isUp = c.change24h >= 0;
                return (
                  <span 
                    key={c.symbol} 
                    onClick={() => handleSelectCoin(c.symbol)}
                    className={`cursor-pointer px-sm py-1 ${selectedCoin === c.symbol ? 'bg-black text-primary' : ''}`}
                  >
                    {c.symbol}/USDT ${c.price.toLocaleString(undefined, { minimumFractionDigits: c.symbol === 'PEPE' ? 8 : 2 })} ({isUp ? '+' : ''}{c.change24h}%)
                  </span>
                );
              })}
              {/* Duplicate for marquee */}
              {Object.values(coins).map((c) => {
                return (
                  <span 
                    key={`${c.symbol}-dup`} 
                    onClick={() => handleSelectCoin(c.symbol)}
                    className={`cursor-pointer px-sm py-1 ${selectedCoin === c.symbol ? 'bg-black text-primary' : ''}`}
                  >
                    {c.symbol}/USDT ${c.price.toLocaleString(undefined, { minimumFractionDigits: c.symbol === 'PEPE' ? 8 : 2 })}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="p-sm lg:p-lg" id="main-chart">
            <div className="flex justify-between items-center mb-lg gap-sm">
              <div className="flex items-center gap-sm lg:gap-md min-w-0">
                <h2 className="font-display-lg text-lg lg:text-headline-md font-black italic uppercase tracking-tighter truncate">{selectedCoin} / USDT</h2>
                <span className="bg-primary text-black font-black px-sm py-1 text-[8px] lg:text-[10px] animate-pulse flex-shrink-0">LIVE</span>
              </div>
              <div className="flex-shrink-0">
                <select
                  value={selectedCoin}
                  onChange={(e) => handleSelectCoin(e.target.value)}
                  className="bg-background border-4 border-white px-sm lg:px-md py-xs text-[10px] lg:text-xs font-black uppercase focus:border-primary outline-none text-on-surface select-none cursor-pointer"
                >
                  {Object.keys(coins).map((sym) => (
                    <option key={sym} value={sym} className="bg-surface">{sym}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Brutalist Chart */}
            <div className="h-[250px] lg:h-[400px] border-4 border-white bg-surface relative p-sm lg:p-md flex items-end gap-2 overflow-hidden mb-lg lg:mb-xl">
              <ChartContainer />
            </div>

            {/* Signal Intelligence Cards (mobile: stacked, desktop: hidden here - shown in column 3) */}
            <div className="lg:hidden space-y-lg mb-xl">
              {/* Buy Signal SOL */}
              <div className="border-4 border-primary p-md bg-surface">
                <div className="flex justify-between items-start mb-lg gap-sm">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase text-primary mb-2">Top Buy Signal</p>
                    <h3 className="font-display-lg font-black uppercase leading-none text-lg">Solana (SOL)</h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-black text-primary italic leading-none">94%</p>
                    <p className="text-[10px] font-black uppercase opacity-60">Confidence</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-xs mb-xl">
                  <span className="border border-white px-2 py-1 text-[10px] font-black uppercase">RSI OVERSOLD</span>
                  <span className="border border-white px-2 py-1 text-[10px] font-black uppercase">VOLUME BREAKOUT</span>
                </div>
                <button 
                  onClick={() => handleOpenTrade('SOL')}
                  className="w-full py-md bg-primary text-on-primary font-black uppercase hover:bg-white hover:text-black transition-colors border-2 border-primary cursor-pointer text-xs"
                >
                  OPEN LONG POSITION
                </button>
              </div>

              {/* Short Signal PEPE */}
              <div className="border-4 border-white p-md bg-surface">
                <div className="flex justify-between items-start mb-lg gap-sm">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase text-on-surface-variant mb-2">Top Short Signal</p>
                    <h3 className="font-display-lg font-black uppercase leading-none text-lg">Pepe (PEPE)</h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-black text-white italic leading-none">88%</p>
                    <p className="text-[10px] font-black uppercase opacity-60">Confidence</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-xs mb-xl">
                  <span className="border border-white px-2 py-1 text-[10px] font-black uppercase opacity-60">BEARISH DIVERGENCE</span>
                  <span className="border border-white px-2 py-1 text-[10px] font-black uppercase opacity-60">LIQUIDITY GAP</span>
                </div>
                <button 
                  onClick={() => handleOpenTrade('PEPE')}
                  className="w-full py-md bg-white text-black font-black uppercase hover:bg-primary transition-colors cursor-pointer text-xs"
                >
                  OPEN SHORT POSITION
                </button>
              </div>
            </div>

            {/* Simulated positions ledger inside Central Canvas (Brutalist style) */}
            <div className="mb-xl">
              <h3 className="text-xs lg:text-sm font-black uppercase mb-md border-l-4 border-primary pl-md">Active Positions</h3>
              <div className="border-4 border-white bg-surface overflow-x-auto">
                {positions.length === 0 ? (
                  <div className="p-lg text-center text-on-surface-variant text-xs uppercase font-black">
                    No active positions open. Balance: ${accountBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
                  </div>
                ) : (
                  <table className="w-full text-left font-mono text-xs border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b-2 border-white bg-white text-black font-black uppercase text-[10px]">
                        <th className="p-xs">Asset</th>
                        <th className="p-xs">Type</th>
                        <th className="p-xs">Lev</th>
                        <th className="p-xs text-right">Size</th>
                        <th className="p-xs text-right hidden sm:table-cell">Entry</th>
                        <th className="p-xs text-right">Mark</th>
                        <th className="p-xs text-right">PNL</th>
                        <th className="p-xs text-center">Act</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos) => {
                        const isPnlUp = pos.pnl >= 0;
                        return (
                          <tr key={pos.id} className="border-b-2 border-white hover:bg-white/5 transition-colors">
                            <td className="p-xs font-black uppercase">{pos.coin}</td>
                            <td className={`p-xs font-black ${pos.direction === 'LONG' ? 'text-primary' : 'text-white'}`}>{pos.direction}</td>
                            <td className="p-xs font-bold">{pos.leverage}x</td>
                            <td className="p-xs text-right">{pos.size}</td>
                            <td className="p-xs text-right hidden sm:table-cell">${pos.entryPrice.toLocaleString()}</td>
                            <td className="p-xs text-right font-black">${pos.currentPrice.toLocaleString()}</td>
                            <td className={`p-xs text-right font-black ${isPnlUp ? 'text-primary' : 'text-error'}`}>
                              ${isPnlUp ? '+' : ''}{pos.pnl.toLocaleString()} ({isPnlUp ? '+' : ''}{pos.pnlPercent}%)
                            </td>
                            <td className="p-xs text-center">
                              <button
                                onClick={() => closePosition(pos.id)}
                                className="bg-primary text-black font-black uppercase text-[9px] lg:text-[10px] px-1.5 lg:px-2 py-0.5 hover:bg-white transition-colors cursor-pointer border-none"
                              >
                                X
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Trending Momentum inside Column 2 */}
            <div>
              <h4 className="text-xs lg:text-sm font-black uppercase mb-md border-l-4 border-primary pl-md">Trending Momentum</h4>
              <div className="grid grid-cols-1 gap-sm">
                {Object.values(coins).slice(3, 7).map((c) => {
                  const isUp = c.change24h >= 0;
                  return (
                    <div 
                      key={c.symbol}
                      onClick={() => handleSelectCoin(c.symbol)}
                      className="flex items-center justify-between p-sm border-2 border-white bg-surface hover:border-primary cursor-pointer transition-colors"
                    >
                      <span className="font-black font-label-tabular uppercase text-[10px] lg:text-xs">{c.symbol}/USDT</span>
                      <div className="flex items-center gap-sm lg:gap-lg">
                        <div className="w-20 lg:w-32 h-4 bg-white/10 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-full flex-1 ${isUp ? 'bg-primary' : 'bg-error'} transition-all`} 
                              style={{ opacity: i * 0.2 + 0.2 }}
                            />
                          ))}
                        </div>
                        <span className={`font-black text-[10px] lg:text-xs ${isUp ? 'text-primary' : 'text-error'}`}>
                          {isUp ? '+' : ''}{c.change24h}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </main>

        {/* Column 3 (30% on desktop, hidden on mobile - shown in main flow) */}
        <aside className="hidden lg:block w-[30%] bg-background p-lg overflow-y-auto h-[calc(100vh-64px)] pb-24">
          <h2 className="text-xs font-black uppercase text-on-surface-variant mb-lg tracking-[0.2em]">Signal Intelligence</h2>
          
          <div className="space-y-lg mb-xl">
            {/* Buy Signal SOL */}
            <div className="border-4 border-primary p-lg bg-surface">
              <div className="flex justify-between items-start mb-lg">
                <div>
                  <p className="text-[10px] font-black uppercase text-primary mb-2">Top Buy Signal</p>
                  <h3 className="font-display-lg text-headline-sm font-black uppercase leading-none text-xl">Solana (SOL)</h3>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-primary italic leading-none">94%</p>
                  <p className="text-[10px] font-black uppercase opacity-60">Confidence</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-xs mb-xl">
                <span className="border border-white px-2 py-1 text-[10px] font-black uppercase">RSI OVERSOLD</span>
                <span className="border border-white px-2 py-1 text-[10px] font-black uppercase">VOLUME BREAKOUT</span>
              </div>
              <button 
                onClick={() => handleOpenTrade('SOL')}
                className="w-full py-lg bg-primary text-on-primary font-black uppercase hover:bg-white hover:text-black transition-colors border-2 border-primary cursor-pointer text-xs"
              >
                OPEN LONG POSITION
              </button>
            </div>

            {/* Short Signal PEPE */}
            <div className="border-4 border-white p-lg bg-surface">
              <div className="flex justify-between items-start mb-lg">
                <div>
                  <p className="text-[10px] font-black uppercase text-on-surface-variant mb-2">Top Short Signal</p>
                  <h3 className="font-display-lg text-headline-sm font-black uppercase leading-none text-xl">Pepe (PEPE)</h3>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-white italic leading-none">88%</p>
                  <p className="text-[10px] font-black uppercase opacity-60">Confidence</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-xs mb-xl">
                <span className="border border-white px-2 py-1 text-[10px] font-black uppercase opacity-60">BEARISH DIVERGENCE</span>
                <span className="border border-white px-2 py-1 text-[10px] font-black uppercase opacity-60">LIQUIDITY GAP</span>
              </div>
              <button 
                onClick={() => handleOpenTrade('PEPE')}
                className="w-full py-lg bg-white text-black font-black uppercase hover:bg-primary transition-colors cursor-pointer text-xs"
              >
                OPEN SHORT POSITION
              </button>
            </div>
          </div>

          {/* Navigation items in industrial flow */}
          <nav className="pt-xl border-t-2 border-outline-variant space-y-md">
            <a className="flex items-center gap-md p-md bg-white text-black font-black uppercase text-xs" href="#main-chart">
              <span className="material-symbols-outlined text-md">dashboard</span> Command Center
            </a>
            <a className="flex items-center gap-md p-md border-2 border-white hover:bg-primary hover:text-black transition-all font-black uppercase text-xs" href="#signal-intel">
              <span className="material-symbols-outlined text-md">insights</span> Signal Intel
            </a>
            <a className="flex items-center gap-md p-md border-2 border-white hover:bg-primary hover:text-black transition-all font-black uppercase text-xs" href="#portfolio-section">
              <span className="material-symbols-outlined text-md">account_balance_wallet</span> Portfolio
            </a>
          </nav>
        </aside>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t-4 border-white z-50 flex justify-around items-center h-14">
        <a href="#main-chart" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span className="text-[8px] font-black uppercase">Chart</span>
        </a>
        <a href="#signal-intel" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
          <span className="material-symbols-outlined text-lg">insights</span>
          <span className="text-[8px] font-black uppercase">Signals</span>
        </a>
        <a href="#portfolio-section" className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2">
          <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
          <span className="text-[8px] font-black uppercase">Portfolio</span>
        </a>
      </nav>
    </div>
  );
};
export default MonolithLayout;
