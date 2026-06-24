import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type LayoutTheme = 'standard' | 'flux' | 'monolith';
export type PageTab = 'terminal' | 'intel' | 'whales' | 'portfolio' | 'settings';
export type PriceSource = 'live' | 'simulated';

export interface CoinData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  history: number[];
  lastFlash?: 'up' | 'down';
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
}

const TerminalContext = createContext<TerminalContextProps | undefined>(undefined);

// CoinGecko ID mapping
const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  PEPE: 'pepe',
  BNB: 'binancecoin',
  ADA: 'cardano',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
};

const initialCoins: Record<string, CoinData> = {
  BTC: { symbol: 'BTC', name: 'Bitcoin', price: 64231.50, change24h: 1.2, history: [63800, 63950, 64100, 64050, 64200, 64150, 64300, 64250, 64100, 64231.50] },
  ETH: { symbol: 'ETH', name: 'Ethereum', price: 3452.12, change24h: 0.8, history: [3410, 3420, 3440, 3435, 3450, 3445, 3460, 3455, 3448, 3452.12] },
  SOL: { symbol: 'SOL', name: 'Solana', price: 142.30, change24h: -2.4, history: [146.5, 145.2, 144.8, 143.9, 143.1, 142.0, 142.8, 141.9, 142.5, 142.30] },
  PEPE: { symbol: 'PEPE', name: 'Pepe', price: 0.00001423, change24h: -5.1, history: [0.00001510, 0.00001490, 0.00001480, 0.00001460, 0.00001420, 0.00001435, 0.00001410, 0.00001425, 0.00001423] },
  BNB: { symbol: 'BNB', name: 'BNB', price: 589.44, change24h: 0.0, history: [588.5, 589.0, 589.5, 589.2, 589.4, 589.6, 589.3, 589.5, 589.44] },
  ADA: { symbol: 'ADA', name: 'Cardano', price: 0.452, change24h: 4.2, history: [0.431, 0.435, 0.440, 0.438, 0.445, 0.448, 0.449, 0.450, 0.452] },
  AVAX: { symbol: 'AVAX', name: 'Avalanche', price: 35.80, change24h: 8.4, history: [32.5, 33.1, 33.8, 34.2, 34.9, 35.1, 35.5, 35.6, 35.80] },
  LINK: { symbol: 'LINK', name: 'Chainlink', price: 15.40, change24h: 3.2, history: [14.8, 14.9, 15.1, 15.0, 15.2, 15.3, 15.25, 15.35, 15.40] },
};

const initialWhales: WhaleAlert[] = [
  { id: 'w1', amount: '52,400,000', token: 'USDT', from: 'Unknown Wallet', to: 'Binance', timeAgo: '2m ago', timestamp: Date.now() - 120000 },
  { id: 'w2', amount: '12,850,000', token: 'ETH', from: 'Coinbase', to: 'Cold Wallet', timeAgo: '8m ago', timestamp: Date.now() - 480000 },
  { id: 'w3', amount: '8,200,000', token: 'BTC', from: 'Gemini', to: 'Kraken', timeAgo: '14m ago', timestamp: Date.now() - 840000 },
  { id: 'w4', amount: '100,000,000', token: 'USDC', from: 'Minted at Treasury', to: 'Treasury Wallet', timeAgo: '22m ago', timestamp: Date.now() - 1320000 },
];

// --- CoinGecko fetcher ---
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

  // --- 1. Real-time CoinGecko price fetching (primary) ---
  const fetchAndUpdatePrices = useCallback(async () => {
    const data = await fetchCoinGeckoPrices();
    if (!data) {
      // If the API fails, mark live as failed and let simulation run
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

  // Initial fetch + interval for live prices
  useEffect(() => {
    fetchAndUpdatePrices(); // Fetch immediately on mount
    const interval = setInterval(fetchAndUpdatePrices, 15000); // Refresh every 15s (CoinGecko rate limit friendly)
    return () => clearInterval(interval);
  }, [fetchAndUpdatePrices]);

  // --- 2. Fallback simulation when API is unavailable ---
  useEffect(() => {
    // Only simulate if live fetch failed
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
  }, [priceSource]); // Re-check when source changes

  // Clear flash highlight states after a short duration
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

  // --- 3. Simulating periodic Whale Alerts ---
  useEffect(() => {
    const interval = setInterval(() => {
      const tokens = ['BTC', 'ETH', 'SOL', 'USDT', 'USDC', 'AVAX'];
      const exchanges = ['Binance', 'Coinbase', 'Kraken', 'OKX', 'Cold Wallet', 'Unknown Wallet'];
      const randToken = tokens[Math.floor(Math.random() * tokens.length)];

      let amountVal = 0;
      if (randToken === 'BTC') amountVal = Math.floor(Math.random() * 200 + 50);
      else if (randToken === 'ETH') amountVal = Math.floor(Math.random() * 3000 + 500);
      else if (randToken === 'SOL') amountVal = Math.floor(Math.random() * 50000 + 10000);
      else amountVal = Math.floor(Math.random() * 20000000 + 5000000);

      const formattedAmount = amountVal.toLocaleString(undefined, { maximumFractionDigits: 0 });
      const fromEx = exchanges[Math.floor(Math.random() * exchanges.length)];
      let toEx = exchanges[Math.floor(Math.random() * exchanges.length)];
      while (fromEx === toEx) {
        toEx = exchanges[Math.floor(Math.random() * exchanges.length)];
      }

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

  // Update timeAgo labels for Whale Alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setWhaleAlerts((prevAlerts) =>
        prevAlerts.map((alert) => {
          const diffMs = Date.now() - alert.timestamp;
          const diffSec = Math.floor(diffMs / 1000);
          if (diffSec < 60) return { ...alert, timeAgo: `${diffSec}s ago` };
          const diffMin = Math.floor(diffSec / 60);
          return { ...alert, timeAgo: `${diffMin}m ago` };
        })
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- 4. Position PnL fluctuations ---
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
        const pnlPercent = (pnl / initialCost) * 100;

        return {
          ...pos,
          currentPrice: livePrice,
          pnl: Number(pnl.toFixed(2)),
          pnlPercent: Number(pnlPercent.toFixed(2)),
        };
      });
    });
  }, [coins]);

  // --- 5. Executing Trades ---
  const executeTrade = (
    coin: string,
    direction: 'LONG' | 'SHORT',
    type: 'MARKET' | 'LIMIT',
    amountUSDT: number,
    leverage: number
  ) => {
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

  // --- 6. Closing positions ---
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
