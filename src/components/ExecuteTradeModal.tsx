import React, { useState, useEffect } from 'react';
import { useTerminal } from '../context/TerminalState';

export const ExecuteTradeModal: React.FC = () => {
  const { 
    showTradeModal, 
    setShowTradeModal, 
    selectedCoin, 
    coins, 
    executeTrade, 
    accountBalance 
  } = useTerminal();

  const coin = coins[selectedCoin] || coins.BTC;
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [amount, setAmount] = useState<number>(1000);
  const [leverage, setLeverage] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(coin.price);

  useEffect(() => {
    setLimitPrice(coin.price);
  }, [selectedCoin, coin.price]);

  if (!showTradeModal) return null;

  const currentPrice = orderType === 'MARKET' ? coin.price : limitPrice;
  const positionSize = (amount * leverage) / currentPrice;
  const marginRequired = amount;
  
  // Simulated Liquidation price calculation
  // Long Liquidation = Entry * (1 - 1/Leverage + MaintenanceMargin)
  // Short Liquidation = Entry * (1 + 1/Leverage - MaintenanceMargin)
  const maintenanceMargin = 0.05; // 5%
  const estLiqPrice = direction === 'LONG'
    ? currentPrice * (1 - 1 / leverage + maintenanceMargin)
    : currentPrice * (1 + 1 / leverage - maintenanceMargin);

  const handleConfirmTrade = () => {
    if (amount <= 0 || amount > accountBalance) {
      alert("Invalid trade amount or insufficient mock balance.");
      return;
    }
    executeTrade(selectedCoin, direction, orderType, amount, leverage);
    setShowTradeModal(false);
  };

  const isPEPE = selectedCoin === 'PEPE';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-md">
      <div className="glass-panel w-full sm:max-w-md p-sm sm:p-lg rounded-t-2xl sm:rounded-xl flex flex-col relative overflow-hidden transition-all duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Decorative corner glow for Flux */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none opacity-50 FluxOnly" />

        {/* Drag Handle (mobile) */}
        <div className="sm:hidden flex justify-center mb-sm pt-1">
          <div className="w-10 h-1 bg-outline-variant rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-md lg:mb-lg border-b border-outline-variant pb-sm">
          <div className="flex items-center gap-sm min-w-0">
            <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">show_chart</span>
            <h3 className="font-display-lg text-sm lg:text-headline-sm uppercase tracking-tight truncate">
              {selectedCoin}/USDT
            </h3>
          </div>
          <button 
            onClick={() => setShowTradeModal(false)}
            className="p-1 hover:text-primary transition-colors hover:bg-surface-variant/30 rounded-full flex-shrink-0"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Direction Tabs */}
        <div className="grid grid-cols-2 gap-sm mb-md p-1 bg-surface-container-low rounded-lg border border-outline-variant">
          <button
            onClick={() => setDirection('LONG')}
            className={`py-2 text-xs font-bold uppercase rounded-md transition-all ${
              direction === 'LONG'
                ? 'bg-primary text-on-primary shadow-lg'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Long (Buy)
          </button>
          <button
            onClick={() => setDirection('SHORT')}
            className={`py-2 text-xs font-bold uppercase rounded-md transition-all ${
              direction === 'SHORT'
                ? 'bg-error text-on-error shadow-lg'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Short (Sell)
          </button>
        </div>

        {/* Order Type Tabs */}
        <div className="grid grid-cols-2 gap-sm mb-lg">
          <button
            onClick={() => setOrderType('MARKET')}
            className={`py-1 text-xs font-semibold rounded border transition-all ${
              orderType === 'MARKET'
                ? 'bg-surface-container-highest border-primary text-primary'
                : 'bg-transparent border-outline-variant text-on-surface-variant'
            }`}
          >
            Market Order
          </button>
          <button
            onClick={() => setOrderType('LIMIT')}
            className={`py-1 text-xs font-semibold rounded border transition-all ${
              orderType === 'LIMIT'
                ? 'bg-surface-container-highest border-primary text-primary'
                : 'bg-transparent border-outline-variant text-on-surface-variant'
            }`}
          >
            Limit Order
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-md mb-lg">
          {/* Limit Price Input if Limit Order */}
          {orderType === 'LIMIT' && (
            <div className="space-y-xs">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Limit Price (USDT)</label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant rounded p-sm focus:outline-none focus:border-primary text-sm font-mono text-on-surface"
              />
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-xs">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <span>Order Size (USDT)</span>
              <span>Bal: ${accountBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant rounded p-sm pr-12 focus:outline-none focus:border-primary text-sm font-mono text-on-surface"
              />
              <span className="absolute right-3 top-2.5 text-xs text-on-surface-variant">USDT</span>
            </div>
            {/* Quick Amount Tabs */}
            <div className="grid grid-cols-4 gap-xs mt-1">
              {[250, 1000, 5000, 10000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className="py-1 text-[10px] font-semibold bg-surface-container-low hover:bg-surface-container border border-outline-variant hover:border-outline rounded text-on-surface transition-all"
                >
                  ${val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Leverage Slider */}
          <div className="space-y-xs">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <span>Leverage</span>
              <span className="text-primary font-mono">{leverage}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="w-full accent-primary bg-surface-container-low h-1 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-on-surface-variant">
              <span>1x</span>
              <span>10x</span>
              <span>25x</span>
              <span>50x</span>
            </div>
          </div>
        </div>

        {/* Position Metrics Summary */}
        <div className="p-md bg-surface-container-low border border-outline-variant rounded-lg space-y-sm text-xs font-medium mb-lg">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Selected Token:</span>
            <span className="text-on-surface font-bold">{selectedCoin}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Asset Live Price:</span>
            <span className="text-on-surface font-mono">
              ${coin.price.toLocaleString(undefined, { minimumFractionDigits: isPEPE ? 8 : 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Position Size:</span>
            <span className="text-primary font-mono font-bold">
              {positionSize.toLocaleString(undefined, { maximumFractionDigits: isPEPE ? 2 : 4 })} {selectedCoin}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Margin Required:</span>
            <span className="text-on-surface font-mono">${marginRequired.toLocaleString()} USDT</span>
          </div>
          <div className="flex justify-between border-t border-outline-variant/30 pt-sm">
            <span className="text-on-surface-variant">Est. Liquidation Price:</span>
            <span className="text-error font-mono font-bold">
              ${estLiqPrice.toLocaleString(undefined, { minimumFractionDigits: isPEPE ? 8 : 2 })}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleConfirmTrade}
          className={`w-full py-sm text-sm font-bold uppercase rounded transition-all cursor-pointer select-none active:scale-[0.98] ${
            direction === 'LONG'
              ? 'bg-primary text-on-primary hover:brightness-110 shadow-[0_0_15px_rgba(78,222,163,0.3)]'
              : 'bg-error text-on-error hover:brightness-110 shadow-[0_0_15px_rgba(251,146,60,0.3)]'
          }`}
        >
          Confirm {direction === 'LONG' ? 'Long' : 'Short'} Trade
        </button>

      </div>
    </div>
  );
};
