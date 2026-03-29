'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FullscreenMap, { CHOKEPOINTS } from '@/components/FullscreenMap';
import SonarEventList from '@/components/SonarEventList';
import { useWhaleTracker, WhaleEvent } from '@/hooks/useWhaleTracker';
import DefconMeter from '@/components/DefconMeter';
import { useDefcon } from '@/components/DefconContext';
import RadioIntercept from '@/components/RadioIntercept';

interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  summary: string;
  category: string;
  imageUrl?: string | null;
  impacts?: {
    gainer: { symbol: string; change: string; };
    loser: { symbol: string; change: string; };
  } | null;
  coordinates?: [number, number] | null;
}

interface OsintData {
  aviation: any[];
  maritime: any[];
}

export default function MapCommandCenter() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [osint, setOsint] = useState<OsintData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [radarActive, setRadarActive] = useState(false);
  
  const [seismic, setSeismic] = useState<any[]>([]);
  const [seismicActive, setSeismicActive] = useState(true); // Default to SAT-COM active (highly visual)
  
  const [whales, setWhales] = useState<WhaleEvent[]>([]);
  const [whaleActive, setWhaleActive] = useState(true); // Default to Whales active
  const [whaleAlert, setWhaleAlert] = useState<WhaleEvent | null>(null);

  const [chokepointsActive, setChokepointsActive] = useState(true);
  const [logisticsShock, setLogisticsShock] = useState<string | null>(null);

  const { registerThreat } = useDefcon();

  const evaluateLogisticsProximity = (lng: number, lat: number, source: string) => {
    if (!chokepointsActive) return;
    const hit = CHOKEPOINTS.find((c: { name: string; coords: number[] }) => {
      const dx = c.coords[0] - lng;
      const dy = c.coords[1] - lat;
      return Math.sqrt(dx*dx + dy*dy) < 5; // 5 degree radius (~500km threshold)
    });
    
    if (hit) {
      registerThreat(60); // Critical Logistics Failure
      setLogisticsShock(`CRITICAL SHOCK: Massive ${source} anomaly detected within 500km of ${hit.name}. Proceed with extreme caution.`);
      setTimeout(() => setLogisticsShock(null), 8000);
    }
  };

  useWhaleTracker(whaleActive, 1000000, (whale) => {
    setWhales(prev => [whale, ...prev].slice(0, 15));
    setWhaleAlert(whale);
    registerThreat(25); // Massive liquidity shockwave registers to Defcon Matrix
    setTimeout(() => {
        setWhaleAlert(null);
    }, 6000);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, osintRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/osint')
        ]);
        const newsJson = await newsRes.json();
        const osintJson = await osintRes.json();
        
        if (newsJson.news) setNews(newsJson.news);
        if (osintJson) setOsint(osintJson);
      } catch (err) {
        console.error('Failed to load command center data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSeismic = async () => {
      if (!seismicActive) return;
      try {
        const res = await fetch('/api/seismic');
        const json = await res.json();
        if (json.anomalies) {
          setSeismic(json.anomalies);
          
          // Trigger severe threat level on recent (1hr) massive >5.5 magnitude events
          const critical = json.anomalies.find((a: any) => a.mag >= 5.5 && (Date.now() - a.time) < 3600000);
          if (critical) {
            registerThreat(40);
            evaluateLogisticsProximity(critical.lng, critical.lat, 'TECTONIC');
          }
        }
      } catch (e) {
        console.error('Failed to load seismic data', e);
      }
    };
    
    fetchSeismic();
    const interval = setInterval(fetchSeismic, 60000);
    return () => clearInterval(interval);
  }, [seismicActive]);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-['Inter'] selection:bg-primary/30 selection:text-white relative overflow-hidden">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-6 z-20 shrink-0">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors group"
          >
            <span className="text-primary group-hover:-translate-x-1 transition-transform">←</span> Return Hub
          </Link>
          <div className="hidden xl:block transform scale-90 origin-left">
            <DefconMeter />
          </div>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_10px_rgba(255,51,102,0.8)]"></span>
          <h1 className="font-['Outfit'] font-bold tracking-widest text-sm text-danger-gradient uppercase hidden md:block">
            Global Tactical Map
          </h1>
        </div>

        <div className="flex items-center gap-4 md:gap-6 z-20 overflow-x-auto hide-scrollbar">
          <RadioIntercept />
          
          {/* OSINT Toggle */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono tracking-widest uppercase whitespace-nowrap hidden sm:inline ${radarActive ? 'text-[var(--primary-color)] drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]' : 'text-gray-500'}`}>
              OSINT
            </span>
            <button 
              onClick={() => setRadarActive(!radarActive)}
              className={`w-10 h-5 rounded-full relative shrink-0 transition-colors duration-300 ${radarActive ? 'bg-[var(--primary-color)]/20 border border-[var(--primary-color)]/50' : 'bg-black border border-white/20'}`}
            >
              <div className={`w-3 h-3 rounded-full absolute top-[3px] transition-transform duration-300 ${radarActive ? 'bg-[var(--primary-color)] translate-x-[22px] shadow-[0_0_10px_var(--primary-color)]' : 'bg-gray-500 translate-x-[4px]'}`} />
            </button>
          </div>

          {/* Seismic Toggle */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono tracking-widest uppercase whitespace-nowrap hidden sm:inline ${seismicActive ? 'text-[#9933ff] drop-shadow-[0_0_5px_rgba(153,51,255,0.5)]' : 'text-gray-500'}`}>
              SAT-COM
            </span>
            <button 
              onClick={() => setSeismicActive(!seismicActive)}
              className={`w-10 h-5 rounded-full relative shrink-0 transition-colors duration-300 ${seismicActive ? 'bg-[#9933ff]/20 border border-[#9933ff]/50' : 'bg-black border border-white/20'}`}
            >
              <div className={`w-3 h-3 rounded-full absolute top-[3px] transition-transform duration-300 ${seismicActive ? 'bg-[#9933ff] translate-x-[22px] shadow-[0_0_10px_rgba(153,51,255,0.8)]' : 'bg-gray-500 translate-x-[4px]'}`} />
            </button>
          </div>

          {/* Chokepoints Toggle */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono tracking-widest uppercase whitespace-nowrap hidden sm:inline ${chokepointsActive ? 'text-[#ff0033] drop-shadow-[0_0_5px_rgba(255,0,51,0.5)]' : 'text-gray-500'}`}>
              LOGISTICS
            </span>
            <button 
              onClick={() => setChokepointsActive(!chokepointsActive)}
              className={`w-10 h-5 rounded-full relative shrink-0 transition-colors duration-300 ${chokepointsActive ? 'bg-[#ff0033]/20 border border-[#ff0033]/50' : 'bg-black border border-white/20'}`}
            >
              <div className={`w-3 h-3 rounded-full absolute top-[3px] transition-transform duration-300 ${chokepointsActive ? 'bg-[#ff0033] translate-x-[22px] shadow-[0_0_10px_rgba(255,0,51,0.8)]' : 'bg-gray-500 translate-x-[4px]'}`} />
            </button>
          </div>

          {/* Whale Toggle */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono tracking-widest uppercase whitespace-nowrap hidden sm:inline ${whaleActive ? 'text-[#ffcc00] drop-shadow-[0_0_5px_rgba(255,204,0,0.5)]' : 'text-gray-500'}`}>
              WHALENET
            </span>
            <button 
              onClick={() => setWhaleActive(!whaleActive)}
              className={`w-10 h-5 rounded-full relative shrink-0 transition-colors duration-300 ${whaleActive ? 'bg-[#ffcc00]/20 border border-[#ffcc00]/50' : 'bg-black border border-white/20'}`}
            >
              <div className={`w-3 h-3 rounded-full absolute top-[3px] transition-transform duration-300 ${whaleActive ? 'bg-[#ffcc00] translate-x-[22px] shadow-[0_0_10px_rgba(255,204,0,0.8)]' : 'bg-gray-500 translate-x-[4px]'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Map Interface */}
      <div className="flex-1 flex flex-col max-w-[1800px] w-full mx-auto p-4 md:p-8 relative">
        
        {/* Whale Intercept Holographic Overlay */}
        {whaleAlert && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-in fade-in zoom-in slide-in-from-top-10 duration-700">
            <div className="glass-panel border-[#ffcc00]/50 bg-black/80 px-8 py-6 shadow-[0_0_50px_rgba(255,204,0,0.3)] text-center w-[300px] md:w-[450px]">
              <h2 className="text-[#ffcc00] font-mono font-bold tracking-widest uppercase text-xl md:text-2xl animate-pulse mb-2">
                WHALE DETECTED
              </h2>
              <p className="text-white font-['Outfit'] text-lg md:text-xl font-semibold mb-2 drop-shadow-md">
                ${(whaleAlert.valueUsd / 1000000).toFixed(2)}M USD TRANSFER INTERCEPTED
              </p>
              <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest">
                {whaleAlert.isBuyerMaker ? 'Massive Spot Sell' : 'Massive Spot Buy'} • Block {whaleAlert.id}
              </p>
            </div>
            {/* Visual targeting reticle */}
            <div className="absolute -inset-4 border border-[#ffcc00]/30 rounded-lg animate-ping duration-1000"></div>
          </div>
        )}

        {/* Logistics Shock Intercept Hologram */}
        {logisticsShock && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="glass-panel border-[#ff0033]/50 bg-[#1a0000]/90 px-8 py-4 shadow-[0_0_30px_rgba(255,0,51,0.5)] text-center w-[300px] md:w-[600px] flex items-center gap-4">
               <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#ff0033] animate-[spin_3s_linear_infinite] flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 bg-[#ff0033] rounded-full animate-pulse blur-[2px]" />
               </div>
               <div className="text-left font-mono">
                 <h2 className="text-[#ff0033] font-bold tracking-widest uppercase text-lg animate-pulse mb-1">
                   LOGISTICS SHOCK ALERT
                 </h2>
                 <p className="text-gray-300 text-xs">
                   {logisticsShock}
                 </p>
               </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex items-center justify-center font-mono text-gray-500 tracking-widest animate-pulse">
            CALIBRATING GEOGRAPHIC SENSORS...
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-130px)] relative">
            <FullscreenMap 
              events={news} 
              osint={radarActive ? osint : null} 
              seismic={seismicActive ? seismic : null}
              whales={whaleActive ? whales : undefined}
              chokepointsActive={chokepointsActive}
            />
            <SonarEventList events={news} />
          </div>
        )}
      </div>
    </main>
  );
}
