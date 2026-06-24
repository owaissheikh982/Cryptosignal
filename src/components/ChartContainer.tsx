import React from 'react';
import { useTerminal } from '../context/TerminalState';

export const ChartContainer: React.FC = () => {
  const { currentTheme, coins, selectedCoin } = useTerminal();
  const coin = coins[selectedCoin] || coins.BTC;
  const history = coin.history;

  // Calculate coordinates for SVG
  const minVal = Math.min(...history) * 0.9995;
  const maxVal = Math.max(...history) * 1.0005;
  const range = maxVal - minVal || 1;
  const width = 1000;
  const height = 300;

  const points = history.map((val, index) => {
    const x = (index / (history.length - 1)) * width;
    const y = height - ((val - minVal) / range) * height;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  // Draw chart based on active layout theme
  const renderChart = () => {
    const isUp = coin.change24h >= 0;
    const color = isUp ? 'var(--color-primary)' : 'var(--color-secondary)';
    
    if (currentTheme === 'flux') {
      // Fluid Flux: Organic area chart with smooth gradient
      return (
        <div className="w-full h-full flex flex-col justify-between">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[320px] overflow-visible">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Grid Dots */}
            <pattern id="gridDots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(218, 226, 253, 0.05)" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#gridDots)" />
            
            {/* Smooth SVG Area */}
            <path d={areaD} fill="url(#chartGrad)" className="transition-all duration-500 ease-in-out" />
            <path d={pathD} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500 ease-in-out" />
            
            {/* Live Indicator Dot */}
            {points.length > 0 && (
              <g transform={`translate(${points[points.length - 1].x}, ${points[points.length - 1].y})`}>
                <circle r="8" fill="var(--color-primary)" className="animate-ping opacity-75" />
                <circle r="4" fill="var(--color-primary)" />
              </g>
            )}
          </svg>
        </div>
      );
    }

    if (currentTheme === 'monolith') {
      // Monolith: Brutalist grid columns with heavy borders
      return (
        <div className="w-full h-full flex flex-col justify-between">
          <div className="w-full h-[320px] flex items-end gap-3 px-2 border-b border-outline-variant relative">
            {/* Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 pointer-events-none opacity-10">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="border border-outline"></div>
              ))}
            </div>

            {history.map((val, idx) => {
              const barHeight = ((val - minVal) / range) * 90 + 10; // 10% to 100%
              const valPrev = idx > 0 ? history[idx - 1] : val;
              const isBarUp = val >= valPrev;
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full items-center group relative z-10">
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-2 bg-white text-black font-mono text-[10px] py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    ${val.toLocaleString(undefined, { minimumFractionDigits: coin.symbol === 'PEPE' ? 8 : 2 })}
                  </span>
                  <div 
                    style={{ height: `${barHeight}%` }}
                    className={`w-full border-2 transition-all duration-500 ${
                      isBarUp 
                        ? 'bg-primary/20 border-primary' 
                        : 'bg-white/10 border-white'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Default: Standard Layout Terminal Line chart
    return (
      <div className="w-full h-full flex flex-col justify-between">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[320px] overflow-visible">
          <defs>
            <linearGradient id="stdChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Subtle Grid Lines */}
          <g stroke="rgba(134, 148, 138, 0.05)" strokeWidth="1">
            <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} />
            <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} />
            <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} />
            {points.map((p, idx) => (
              <line key={idx} x1={p.x} y1={0} x2={p.x} y2={height} />
            ))}
          </g>
          
          {/* Glowing Area under line */}
          <path d={areaD} fill="url(#stdChartGrad)" className="transition-all duration-500 ease-in-out" />
          
          {/* Glowing Line */}
          <path 
            d={pathD} 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            strokeLinecap="round" 
            className="transition-all duration-500 ease-in-out filter drop-shadow-[0_0_4px_rgba(78,222,163,0.3)]" 
          />

          {/* Dots on nodes on hover */}
          {points.map((p, idx) => (
            <g key={idx} className="group/node cursor-pointer">
              <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="3.5" 
                fill={color} 
                className="opacity-0 group-hover/node:opacity-100 transition-opacity" 
              />
            </g>
          ))}
          
          {/* Live Tick Marker */}
          {points.length > 0 && (
            <g transform={`translate(${points[points.length - 1].x}, ${points[points.length - 1].y})`}>
              <circle r="6" fill={color} className="animate-ping opacity-60" />
              <circle r="3" fill={color} />
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {renderChart()}
    </div>
  );
};
