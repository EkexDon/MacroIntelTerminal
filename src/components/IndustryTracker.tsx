'use client';

import { useState, useEffect } from 'react';
import Sparkline from './Sparkline';

export default function IndustryTracker() {
  const initialData = [
    { name: 'Defense & Aerospace', flow: '+4.2B', trend: 'up', risk: 'High', vol: '12M', historyVal: 100 },
    { name: 'Cybersecurity', flow: '+2.1B', trend: 'up', risk: 'Moderate', vol: '8.4M', historyVal: 80 },
    { name: 'AI / Semiconductors', flow: '+5.8B', trend: 'up', risk: 'High', vol: '45M', historyVal: 150 },
    { name: 'Energy (Oil & Gas)', flow: '+1.8B', trend: 'up', risk: 'Moderate', vol: '22M', historyVal: 70 },
    { name: 'Precious Metals', flow: '+850M', trend: 'up', risk: 'Low', vol: '5M', historyVal: 50 },
    { name: 'Crypto Ecosystem', flow: '-1.2B', trend: 'down', risk: 'Extreme', vol: '84M', historyVal: 120 },
    { name: 'Global Tech ETFs', flow: '-500M', trend: 'down', risk: 'Moderate', vol: '31M', historyVal: 90 },
  ];

  const generateFlatHistory = (base: number) => Array(20).fill(base);

  const [sectors, setSectors] = useState(() => 
    initialData.map(s => ({ ...s, history: generateFlatHistory(s.historyVal) }))
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const generateHistory = (base: number) => {
      let current = base;
      return Array.from({ length: 20 }, (_, i) => {
        current += (i > 0) ? (Math.random() * 6 - 3) : 0;
        return current;
      });
    };

    // Hydrate random data once mounted to prevent SSR match error
    setSectors(initialData.map(s => ({ ...s, history: generateHistory(s.historyVal) })));
    setMounted(true);

    const interval = setInterval(() => {
      setSectors(prev => prev.map(s => {
        const volatility = s.risk === 'Extreme' ? 8 : s.risk === 'High' ? 5 : 2;
        const shift = s.trend === 'up' ? (Math.random() * volatility) : (-Math.random() * volatility);
        const nextVal = s.history[s.history.length - 1] + shift;
        return { ...s, history: [...s.history.slice(1), nextVal] };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-['Outfit'] font-bold tracking-wider text-danger-gradient uppercase mb-6 flex justify-between items-center">
        Capital Flow Tracker
        <span className="text-[10px] bg-black/50 text-gray-500 border border-white/5 px-2 py-1 rounded font-mono">24H RANGE</span>
      </h2>
      
      <div className="space-y-4">
        {sectors.map((sector, idx) => (
          <div key={idx} className="relative p-4 rounded bg-black/40 border border-white/5 overflow-hidden group hover:border-white/20 transition-all flex items-center justify-between">
            {/* Background progress bar simulation */}
            <div 
              className={`absolute left-0 top-0 bottom-0 opacity-10 transition-all duration-1000 ${sector.trend === 'up' ? 'bg-primary w-2/3' : 'bg-danger w-1/3'}`}
            ></div>
            
            <div className="relative z-10">
              <h4 className="font-semibold text-sm text-gray-200">{sector.name}</h4>
              <div className="flex gap-3 text-xs mt-1">
                <span className="text-gray-500">Risk: <span className={sector.risk === 'Extreme' ? 'text-danger' : 'text-warning'}>{sector.risk}</span></span>
                <span className="text-gray-500">Vol: <span className="text-gray-300">{sector.vol}</span></span>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="hidden sm:block opacity-70 group-hover:opacity-100 transition-opacity">
                 <Sparkline 
                    data={sector.history} 
                    color={sector.trend === 'up' ? 'var(--primary-color)' : 'var(--danger-color)'} 
                    width={80} 
                    height={24} 
                 />
              </div>
              <div className="text-right w-20">
                <div className={`font-mono text-lg font-bold ${sector.trend === 'up' ? 'text-primary' : 'text-danger'}`}>
                  {sector.flow}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Volume</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-500 font-mono tracking-widest text-center">
        REAL-TIME INDUSTRY METRICS • ALGORITHMIC ESTIMATION
      </div>
    </div>
  );
}
