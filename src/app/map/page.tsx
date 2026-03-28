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

export default function MapCommandCenter() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const json = await res.json();
        if (json.news) {
          setNews(json.news);
        }
      } catch (err) {
        console.error('Failed to load news for map', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30000); // 30s live updates in command center
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-['Inter'] selection:bg-primary/30 selection:text-white relative">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-border flex items-center px-6 bg-surface backdrop-blur-md sticky top-0 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors group"
        >
          <span className="text-primary group-hover:-translate-x-1 transition-transform">←</span> Return Hub
        </Link>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_10px_rgba(255,51,102,0.8)]"></span>
          <h1 className="font-['Outfit'] font-bold tracking-widest text-sm text-danger-gradient uppercase">
            Global Tactical Map
          </h1>
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
            <FullscreenMap events={news} />
            <SonarEventList events={news} />
          </div>
        )}
      </div>
    </main>
  );
}
