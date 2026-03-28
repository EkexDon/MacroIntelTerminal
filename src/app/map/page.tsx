'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FullscreenMap from '@/components/FullscreenMap';
import SonarEventList from '@/components/SonarEventList';

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
  const [radarActive, setRadarActive] = useState(true);

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
    const interval = setInterval(fetchData, 30000); // 30s live updates
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-['Inter'] selection:bg-primary/30 selection:text-white relative">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface backdrop-blur-md sticky top-0 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors group z-20"
        >
          <span className="text-primary group-hover:-translate-x-1 transition-transform">←</span> Return Hub
        </Link>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_10px_rgba(255,51,102,0.8)]"></span>
          <h1 className="font-['Outfit'] font-bold tracking-widest text-sm text-danger-gradient uppercase hidden md:block">
            Global Tactical Map
          </h1>
        </div>

        <div className="flex items-center gap-3 z-20">
          <span className={`text-[10px] font-mono tracking-widest uppercase ${radarActive ? 'text-primary drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]' : 'text-gray-500'}`}>
            OSINT RADAR
          </span>
          <button 
            onClick={() => setRadarActive(!radarActive)}
            className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${radarActive ? 'bg-primary/20 border border-primary/50' : 'bg-black border border-white/20'}`}
          >
            <div className={`w-3 h-3 rounded-full absolute top-[3px] transition-transform duration-300 ${radarActive ? 'bg-primary translate-x-[22px] shadow-[0_0_10px_rgba(0,255,136,0.8)]' : 'bg-gray-500 translate-x-[4px]'}`} />
          </button>
        </div>
      </header>

      {/* Main Map Interface */}
      <div className="flex-1 flex flex-col max-w-[1800px] w-full mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex-1 flex items-center justify-center font-mono text-gray-500 tracking-widest animate-pulse">
            CALIBRATING GEOGRAPHIC SENSORS...
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-130px)]">
            <FullscreenMap 
              events={news} 
              osint={radarActive ? osint : null} 
            />
            <SonarEventList events={news} />
          </div>
        )}
      </div>
    </main>
  );
}
