'use client';

import { useEffect, useState } from 'react';

interface Asset {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

interface MarketData {
  crypto: Asset[];
  commodities: Asset[];
  stocks: Asset[];
}

export default function Ticker() {
  const [data, setData] = useState<MarketData | null>(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch('/api/market');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to load market data', err);
      }
    };

    fetchMarket();
    const interval = setInterval(fetchMarket, 30000); // live updates every 30s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="h-12 w-full bg-black flex items-center px-4 border-b border-white/10 text-xs text-gray-500">INITIALIZING SECURE UPLINK...</div>;

  const safeData = data as any;
  const cryptoAssets = safeData.crypto || safeData.fallback?.crypto || [];
  const commodityAssets = safeData.commodities || safeData.fallback?.commodities || [];
  const stockAssets = safeData.stocks || safeData.fallback?.stocks || [];

  const allAssets = [...cryptoAssets, ...commodityAssets, ...stockAssets];

  if (allAssets.length === 0) {
    return <div className="h-12 w-full bg-[#0a0a0c] border-b border-white/10 flex items-center px-4 text-xs text-danger">MARKET UPLINK OFFLINE</div>;
  }

  return (
    <div className="h-12 w-full bg-[#0a0a0c] border-b border-white/10 flex items-center overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0c] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0c] to-transparent z-10" />
      
      <div className="flex whitespace-nowrap animate-ticker" data-animated="true">
        {allAssets.map((asset, i) => (
          <div key={i} className="flex items-center mx-6 gap-2 font-mono text-sm tracking-widest pl-4">
            <span className="text-gray-400">{asset.symbol}</span>
            <span className="text-white">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={asset.changePercent >= 0 ? "text-primary" : "text-danger"}>
              {asset.changePercent >= 0 ? '▲' : '▼'} {Math.abs(asset.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
         {/* Duplicate for infinite seamless scroll */}
         {allAssets.map((asset, i) => (
          <div key={`dup-${i}`} className="flex items-center mx-6 gap-2 font-mono text-sm tracking-widest pl-4">
            <span className="text-gray-400">{asset.symbol}</span>
            <span className="text-white">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={asset.changePercent >= 0 ? "text-primary" : "text-danger"}>
              {asset.changePercent >= 0 ? '▲' : '▼'} {Math.abs(asset.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
