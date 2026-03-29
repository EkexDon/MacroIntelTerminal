'use client';

import { useEffect, useState } from 'react';

interface OracleMarket {
  id: string;
  title: string;
  yesProbability: number;
  volume: number;
  endDate?: string;
}

export default function OracleMarquee() {
  const [markets, setMarkets] = useState<OracleMarket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOracle = async () => {
      try {
        const res = await fetch('/api/oracle');
        const json = await res.json();
        if (json.markets) {
          setMarkets(json.markets);
        }
      } catch (e) {
        console.error('Oracle stream failed to connect', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOracle();
    // Poll the Web3 Oracle every 60 seconds
    const interval = setInterval(fetchOracle, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || markets.length === 0) return null;

  return (
    <div className="w-full bg-black/80 border-b border-primary/20 overflow-hidden relative flex items-center h-8">
      <div className="absolute left-0 top-0 bottom-0 bg-primary/20 text-primary font-mono text-[10px] tracking-widest px-3 flex items-center z-10 font-bold uppercase border-r border-primary/50 shadow-[0_0_10px_rgba(0,255,136,0.3)] backdrop-blur-md">
        <span className="animate-pulse mr-2 h-1.5 w-1.5 bg-primary rounded-full"></span>
        ORACLE ODDS
      </div>
      
      {/* Marquee Animation Container */}
      <div className="flex animate-ticker whitespace-nowrap pl-32 items-center h-full">
        {markets.map((market, idx) => {
          // Color code probability
          let probColor = 'text-gray-400';
          if (market.yesProbability > 60) probColor = 'text-primary drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]';
          if (market.yesProbability < 40) probColor = 'text-danger drop-shadow-[0_0_5px_rgba(255,51,102,0.5)]';

          return (
            <div key={idx} className="inline-flex items-center gap-2 mx-8 text-xs font-mono">
              <span className="text-gray-300">
                {market.title}
              </span>
              <span className={`font-bold ${probColor}`}>
                {market.yesProbability}% YES
              </span>
              <span className="text-[10px] text-gray-600 ml-2">
                VOL: ${(market.volume / 1000000).toFixed(1)}M
              </span>
              <span className="text-gray-600 mx-4">•</span>
            </div>
          );
        })}
      </div>

      {/* Fade edges */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/90 to-transparent pointer-events-none z-10" />
    </div>
  );
}
