'use client';

import { useEffect, useState } from 'react';
import Sparkline from './Sparkline';

export default function MacroIndicators() {
  const generateFlatHistory = (base: number) => Array(20).fill(base);

  const [metrics, setMetrics] = useState({
    fearGreed: { current: 65, history: generateFlatHistory(65) },
    vix: { current: 18.4, history: generateFlatHistory(18.4) },
    btcDominance: { current: 54.2, history: generateFlatHistory(54.2) },
    globalLiquidity: { current: '+1.2%', val: 1.2, history: generateFlatHistory(1.2) },
  });

  const [mounted, setMounted] = useState(false);

  // Simulate subtle live fluctuations pushing into the history array
  useEffect(() => {
    const generateHistory = (base: number, volatility: number) => {
      let current = base;
      return Array.from({ length: 20 }, () => {
        current += (Math.random() * volatility * 2) - volatility;
        return current;
      });
    };

    // Hydrate random data once mounted to prevent SSR hydration mismatch
    setMetrics({
      fearGreed: { current: 65, history: generateHistory(65, 2) },
      vix: { current: 18.4, history: generateHistory(18.4, 0.5) },
      btcDominance: { current: 54.2, history: generateHistory(54.2, 0.1) },
      globalLiquidity: { current: '+1.2%', val: 1.2, history: generateHistory(1.2, 0.05) },
    });
    setMounted(true);

    const interval = setInterval(() => {
      setMetrics(prev => {
        const fg = Math.min(100, Math.max(0, prev.fearGreed.current + (Math.random() > 0.5 ? 1 : -1)));
        const vx = parseFloat((prev.vix.current + (Math.random() * 0.4 - 0.2)).toFixed(2));
        const btc = parseFloat((prev.btcDominance.current + (Math.random() * 0.1 - 0.05)).toFixed(2));
        const liq = parseFloat((prev.globalLiquidity.val + (Math.random() * 0.02 - 0.01)).toFixed(3));
        
        return {
          fearGreed: { current: fg, history: [...prev.fearGreed.history.slice(1), fg] },
          vix: { current: vx, history: [...prev.vix.history.slice(1), vx] },
          btcDominance: { current: btc, history: [...prev.btcDominance.history.slice(1), btc] },
          globalLiquidity: { current: `+${liq.toFixed(1)}%`, val: liq, history: [...prev.globalLiquidity.history.slice(1), liq] },
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 mb-6">
      <h3 className="text-lg font-['Outfit'] font-bold tracking-wider text-gradient uppercase mb-4">
        Macro Parameters
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Fear & Greed */}
        <div className="p-3 bg-black/40 rounded border border-white/5 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <span className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-1 block">Fear/Greed</span>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold font-mono ${metrics.fearGreed.current > 50 ? 'text-primary' : 'text-danger'}`}>
                {metrics.fearGreed.current}
              </span>
              <span className="text-[10px] text-gray-400 mb-1">{metrics.fearGreed.current > 50 ? 'Greed' : 'Fear'}</span>
            </div>
          </div>
          <div className="mt-2 h-8 w-[120%] -ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkline data={metrics.fearGreed.history} color={metrics.fearGreed.current > 50 ? 'var(--primary-color)' : 'var(--danger-color)'} width={150} height={32} />
          </div>
        </div>

        {/* VIX */}
        <div className="p-3 bg-black/40 rounded border border-white/5 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <span className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-1 block">VIX (Vol)</span>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold font-mono ${metrics.vix.current > 20 ? 'text-danger' : 'text-gray-200'}`}>
                {metrics.vix.current}
              </span>
            </div>
          </div>
          <div className="mt-2 h-8 w-[120%] -ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkline data={metrics.vix.history} color={metrics.vix.current > 20 ? 'var(--danger-color)' : 'var(--fg-color)'} width={150} height={32} />
          </div>
        </div>

        {/* BTC Dominance */}
        <div className="p-3 bg-black/40 rounded border border-white/5 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <span className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-1 block">BTC.D</span>
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold font-mono text-warning">
                {metrics.btcDominance.current}%
              </span>
            </div>
          </div>
          <div className="mt-2 h-8 w-[120%] -ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkline data={metrics.btcDominance.history} color="var(--warning-color)" width={150} height={32} />
          </div>
        </div>

        {/* Liquidity */}
        <div className="p-3 bg-black/40 rounded border border-white/5 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <span className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-1 block">Liquidity M2</span>
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold font-mono text-primary">
                {metrics.globalLiquidity.current}
              </span>
            </div>
          </div>
          <div className="mt-2 h-8 w-[120%] -ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkline data={metrics.globalLiquidity.history} color="var(--primary-color)" width={150} height={32} />
          </div>
        </div>
      </div>
    </div>
  );
}
