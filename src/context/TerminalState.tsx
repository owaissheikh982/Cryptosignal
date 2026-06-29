import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type LayoutTheme = 'standard' | 'flux' | 'monolith';
export type PageTab = 'terminal' | 'intel' | 'whales' | 'portfolio' | 'settings';
export type PriceSource = 'live' | 'simulated';

// ─────────────────────────────────────────────────────────────────────────────
// 🟢 QUANT EXTENSIONS — Backend Data Structural Alignment
// ─────────────────────────────────────────────────────────────────────────────

export interface IndicatorData {
  rsi: { value: number; zone: string; rising: boolean } | null;
  macd: { bullish: boolean; crossover: boolean } | null;
  ema: { score: number; trend: string } | null;
  bb: { pctB: number; squeeze: boolean; nearUpper: boolean; nearLower: boolean } | null; 
  atr: { pct: number; volatility: string } | null;
  volume: { relativeVolume: number; spike: boolean } | null;
  structure: { uptrendStructure: boolean; downtrendStructure: boolean } | null; 
  mtf: { macroBullish: boolean; guardActive: boolean }; 
}

export interface CoinSignal {
  coin: string;
  action: string;
  confidence: number;
  trend: string;
  entry: number;
  stop_loss: number;
  take_profit: number[];
  risk_reward: string;
  risk_score: number;
  suggestedPositionSizePct: number; 
  reasons: string[];
  indicators: IndicatorData;
}

// Global State Shape for Backend Sync
export interface BackendIntelState {
  requestedTimeframe: string;
  marketTrend: string;
  recommendedStance: string;
  strongestSectors: string[];
  weakestSectors: string[];
  buySignal: { symbol: string; price: number; confidence: number; reason: string; type: string } | null;
  shortSignal: { symbol: string; price: number; confidence: number; reason: string; type: string } | null;
  allSignals: CoinSignal[];
  lastSyncTimestamp: string | null;
  engineStatus: string;
}

export interface CoinData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  history: number[];
  lastFlash?: 'up' | 'down';
  // Quantitative Signal Connection Node
  signalContext?: CoinSignal | null; 
}

export interface WhaleAlert {
  id: string;
  amount: string;
  token: string;
  from: string;
  to: string;
  timeAgo: string;
  timestamp: number;
}

export interface Position {
  id: string;
  coin: string;
  direction: 'LONG' | 'SHORT';
  type: 'MARKET' | 'LIMIT';
  entryPrice: number;
  currentPrice: number;
  size: number;
  leverage: number;
  margin: number;
  pnl: number;
  pnlPercent: number;
}

interface TerminalContextProps {
  currentTheme: LayoutTheme;
  setTheme: (theme: LayoutTheme) => void;
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  coins: Record<string, CoinData>;
  selectedCoin: string;
  setSelectedCoin: (symbol: string) => void;
  whaleAlerts: WhaleAlert[];
  positions: Position[];
  executeTrade: (coin: string, direction: 'LONG' | 'SHORT', type: 'MARKET' | 'LIMIT', amountUSDT: number, leverage: number) => void;
  closePosition: (id: string) => void;
  accountBalance: number;
  fearGreedIndex: number;
  showTradeModal: boolean;
  setShowTradeModal: (show: boolean) => void;
  priceSource: PriceSource;
  // 🟢 Naye Dynamic Parameters exposed to Layouts
  selectedTimeframe: string;
  setSelectedTimeframe: (tf: string) => void;
  intelState: BackendIntelState | null;
}

const TerminalContext = createContext<TerminalContextProps | undefined>(undefined);

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  PEPE: 'pepe',
  LINK: 'chainlink',
};

const initialCoins: Record<string, CoinData> = {
  BTC: { symbol: 'BTC', name: 'Bitcoin', price: 64231.50, change24h: 1.2, history: [63800, 63950, 64100, 64050, 64200, 64150, 64300, 64250, 64100, 64231.50] },
  ETH: { symbol: 'ETH', name: 'Ethereum', price: 3452.12, change24h: 0.8, history: [3410, 3420, 3440, 3435, 3450, 3445, 3460, 3455, 3448, 3452.12] },
  SOL: { symbol: 'SOL', name: 'Solana', price: 142.30, change24h: -2.4, history: [146.5, 145.2, 144.8, 143.9, 143.1, 142.0, 142.8, 141.9, 142.5, 142.30] },
  PEPE: { symbol: 'PEPE', name: 'Pepe', price: 0.00001423, change24h: -5.1, history: [0.00001510, 0.00001490, 0.00001480, 0.00001460, 0.00001420, 0.00001435, 0.00001410, 0.00001425, 0.00001423] },
  LINK: { symbol: 'LINK', name: 'Chainlink', price: 15.40, change24h: 3.2, history: [14.8, 14.9, 15.1, 15.0, 15.2, 15.3, 15.25, 15.35, 15.40] },
};

const initialWhales: WhaleAlert[] = [
  { id: 'w1', amount: '52,400,000', token: 'USDT', from: 'Unknown Wallet', to: 'Binance', timeAgo: '2m ago', timestamp: Date.now() - 120000 },
  { id: 'w2', amount: '12,850,000', token: 'ETH', from: 'Coinbase', to: 'Cold Wallet', timeAgo: '8m ago', timestamp: Date.now() - 480000 },
];

async function fetchCoinGeckoPrices(): Promise<Record<string, { usd: number; usd_24h_change: number }> | null> {
  const ids = Object.values(COINGECKO_IDS).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setTheme] = useState<LayoutTheme>('standard');
  const [activeTab, setActiveTab] = useState<PageTab>('terminal');
  const [coins, setCoins] = useState<Record<string, CoinData>>(initialCoins);
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC');
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>(initialWhales);
  const [positions, setPositions] = useState<Position[]>([]);
  const [accountBalance, setAccountBalance] = useState<number>(154230.50);
  const [showTradeModal, setShowTradeModal] = useState<boolean>(false);
  const [priceSource, setPriceSource] = useState<PriceSource>('simulated');
  const fearGreedIndex = 68;
  const liveFetchFailed = useRef(false);

  // ── 🟢 NEW: Persistent Dropdown Staging & Intelligence State ──
  const [intelState, setIntelState] = useState<BackendIntelState | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(() => {
    return localStorage.getItem('user_timeframe') || '1h';
  });

  // ── 📡 REAL-TIME LIVE RAILWAY SYNC ENGINE ──
  const fetchLiveSignals = useCallback(async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/signals?timeframe=${selectedTimeframe}`);
      
      if (response.ok) {
        const data: BackendIntelState = await response.json();
        setIntelState(data);
        localStorage.setItem('user_timeframe', selectedTimeframe);

        // Map live signals right into the active token tracking registry
        setCoins((prevCoins) => {
          const nextCoins = { ...prevCoins };
          data.allSignals.forEach((sig) => {
            if (nextCoins[sig.coin]) {
              nextCoins[sig.coin] = {
                ...nextCoins[sig.coin],
                signalContext: sig // dynamic signal injector node
              };
            }
          });
          return nextCoins;
        });
      }
    } catch (error) {
      console.error("Market Intelligence Engine offline:", error);
    }
  }, [selectedTimeframe]);

  // Hook into network polling intervals based on user selection mutations
  useEffect(() => {
    fetchLiveSignals();
    const interval = setInterval(fetchLiveSignals, 30000); // Polling sync loop every 30s
    return () => clearInterval(interval);
  }, [fetchLiveSignals]);

  // --- Real-time CoinGecko price fetching (fallback tracking node) ---
  const fetchAndUpdatePrices = useCallback(async () => {
    const data = await fetchCoinGeckoPrices();
    if (!data) {
      if (!liveFetchFailed.current) {
        liveFetchFailed.current = true;
        setPriceSource('simulated');
      }
      return;
    }

    liveFetchFailed.current = false;
    setPriceSource('live');

    setCoins((prevCoins) => {
      const nextCoins = { ...prevCoins };
      for (const [symbol, geckoId] of Object.entries(COINGECKO_IDS)) {
        const priceData = data[geckoId];
        if (!priceData) continue;

        const oldPrice = nextCoins[symbol].price;
        const newPrice = priceData.usd;
        const change24h = Number((priceData.usd_24h_change ?? 0).toFixed(2));
        const direction: 'up' | 'down' | undefined = newPrice > oldPrice ? 'up' : newPrice < oldPrice ? 'down' : undefined;
        const newHistory = [...nextCoins[symbol].history.slice(-11), newPrice];

        nextCoins[symbol] = {
          ...nextCoins[symbol],
          price: newPrice,
          change24h,
          history: newHistory,
          lastFlash: direction,
        };
      }
      return nextCoins;
    });
  }, []);

  useEffect(() => {
    fetchAndUpdatePrices();
    const interval = setInterval(fetchAndUpdatePrices, 15000);
    return () => clearInterval(interval);
  }, [fetchAndUpdatePrices]);

  // --- Fallback price random simulation ---
  useEffect(() => {
    if (!liveFetchFailed.current) return;
    const interval = setInterval(() => {
      setCoins((prevCoins) => {
        const nextCoins = { ...prevCoins };
        const keys = Object.keys(nextCoins);
        const coinsToChange = keys.filter(() => Math.random() > 0.4);

        coinsToChange.forEach((key) => {
          const coin = nextCoins[key];
          const pct = (Math.random() * 0.4 - 0.2) / 100;
          const oldPrice = coin.price;
          const newPrice = Number((oldPrice * (1 + pct)).toFixed(key === 'PEPE' ? 8 : 4));
          const direction = newPrice > oldPrice ? 'up' : 'down';
          const newHistory = [...coin.history.slice(1), newPrice];

          nextCoins[key] = {
            ...coin,
            price: newPrice,
            change24h: Number((coin.change24h + pct * 100).toFixed(2)),
            history: newHistory,
            lastFlash: direction,
          };
        });
        return nextCoins;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [priceSource]);

  // Flash reset node execution
  useEffect(() => {
    const timer = setTimeout(() => {
      setCoins((prevCoins) => {
        const resetCoins = { ...prevCoins };
        Object.keys(resetCoins).forEach((key) => {
          if (resetCoins[key].lastFlash) {
            resetCoins[key] = { ...resetCoins[key], lastFlash: undefined };
          }
        });
        return resetCoins;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [coins]);

  // --- Whale Simulation Node ---
  useEffect(() => {
    const interval = setInterval(() => {
      const tokens = ['BTC', 'ETH', 'SOL', 'LINK', 'PEPE'];
      const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Cold Wallet', 'Unknown Wallet'];
      const randToken = tokens[Math.floor(Math.random() * tokens.length)];
      let amountVal = Math.floor(Math.random() * 20000000 + 5000000);
      const formattedAmount = amountVal.toLocaleString(undefined, { maximumFractionDigits: 0 });
      const fromEx = exchanges[Math.floor(Math.random() * exchanges.length)];
      let toEx = exchanges[Math.floor(Math.random() * exchanges.length)];
      while (fromEx === toEx) { toEx = exchanges[Math.floor(Math.random() * exchanges.length)]; }

      const newAlert: WhaleAlert = {
        id: `w-${Date.now()}`,
        amount: formattedAmount,
        token: randToken,
        from: fromEx,
        to: toEx,
        timeAgo: 'Just now',
        timestamp: Date.now(),
      };
      setWhaleAlerts((prev) => [newAlert, ...prev.slice(0, 15)]);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWhaleAlerts((prevAlerts) =>
        prevAlerts.map((alert) => {
          const diffMs = Date.now() - alert.timestamp;
          const diffSec = Math.floor(diffMs / 1000);
          if (diffSec < 60) return { ...alert, timeAgo: `${diffSec}s ago` };
          return { ...alert, timeAgo: `${Math.floor(diffSec / 60)}m ago` };
        })
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Dynamic Position PnL calculations ---
  useEffect(() => {
    setPositions((prevPositions) => {
      if (prevPositions.length === 0) return prevPositions;
      return prevPositions.map((pos) => {
        const livePrice = coins[pos.coin]?.price || pos.entryPrice;
        let pnl = 0;
        if (pos.direction === 'LONG') {
          pnl = (livePrice - pos.entryPrice) * pos.size * pos.leverage;
        } else {
          pnl = (pos.entryPrice - livePrice) * pos.size * pos.leverage;
        }
        const initialCost = pos.margin;
        return {
          ...pos,
          currentPrice: livePrice,
          pnl: Number(pnl.toFixed(2)),
          pnlPercent: Number(((pnl / initialCost) * 100).toFixed(2)),
        };
      });
    });
  }, [coins]);

  const executeTrade = (coin: string, direction: 'LONG' | 'SHORT', type: 'MARKET' | 'LIMIT', amountUSDT: number, leverage: number) => {
    const price = coins[coin]?.price || 100;
    const margin = amountUSDT;
    const size = (margin * leverage) / price;

    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      coin,
      direction,
      type,
      entryPrice: price,
      currentPrice: price,
      size: Number(size.toFixed(coin === 'PEPE' ? 2 : 4)),
      leverage,
      margin,
      pnl: 0,
      pnlPercent: 0,
    };
    setAccountBalance((prev) => prev - margin);
    setPositions((prev) => [...prev, newPosition]);
  };

  const closePosition = (id: string) => {
    const position = positions.find((pos) => pos.id === id);
    if (!position) return;
    const returns = position.margin + position.pnl;
    setAccountBalance((prev) => Number((prev + returns).toFixed(2)));
    setPositions((prev) => prev.filter((pos) => pos.id !== id));
  };

  return (
    <TerminalContext.Provider
      value={{
        currentTheme,
        setTheme,
        activeTab,
        setActiveTab,
        coins,
        selectedCoin,
        setSelectedCoin,
        whaleAlerts,
        positions,
        executeTrade,
        closePosition,
        accountBalance,
        fearGreedIndex,
        showTradeModal,
        setShowTradeModal,
        priceSource,
        // 🟢 Exposed New Control Pipelines
        selectedTimeframe,
        setSelectedTimeframe,
        intelState,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};