'use client';

import { useEffect, useState, useRef } from 'react';
import AIBriefingBanner from './AIBriefingBanner';

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
  sentiment?: {
    score: number;
    label: string;
    triggers: string[] | null;
  };
}

interface NewsFeedProps {
  keywords?: string[];
  onAlert?: () => void;
}

export default function NewsFeed({ keywords = [], onAlert }: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [briefing, setBriefing] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const json = await res.json();
        
        if (json.briefing) {
          setBriefing(json.briefing);
        }
        
        if (json.news) {
          const fetchedNews: NewsItem[] = json.news;
          const newItems = fetchedNews.filter(n => !seenIds.current.has(n.id));
          
          if (newItems.length > 0 && seenIds.current.size > 0 && keywords.length > 0 && onAlert) {
            const hasMatch = newItems.some(n => 
              keywords.some(kw => `${n.title} ${n.summary}`.toLowerCase().includes(kw.toLowerCase()))
            );
            if (hasMatch) onAlert();
          }

          fetchedNews.forEach(n => seenIds.current.add(n.id));
          setNews(fetchedNews);
        }
      } catch (err) {
        console.error('Failed to load news', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="glass-panel p-6 h-full min-h-[800px] flex flex-col gap-4 animate-pulse">
      <div className="h-6 w-1/3 bg-white/10 rounded"></div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 w-full bg-white/5 rounded"></div>
      ))}
    </div>
  );

  const filteredNews = news.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(query) || 
           item.summary.toLowerCase().includes(query) || 
           item.category.toLowerCase().includes(query) || 
           item.source.toLowerCase().includes(query);
  });

  return (
    <div className="glass-panel p-6 h-full min-h-[800px] max-h-[1200px] overflow-hidden flex flex-col shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-0 gap-4">
        <h2 className="text-2xl font-['Outfit'] font-bold tracking-wider text-gradient uppercase">Global Intelligence Memos</h2>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Dynamic Search Bar */}
          <div className="relative flex-1 md:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Query Feed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-foreground text-xs font-mono rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-danger animate-pulse"></div>
            <span className="text-xs text-danger font-mono tracking-widest uppercase hidden sm:inline">Live Feed</span>
          </div>
        </div>
      </div>

      <AIBriefingBanner briefing={briefing} />

      <div className="flex-1 overflow-y-auto pr-3 space-y-5">
        {filteredNews.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm text-center mt-10">No critical events matching "{searchQuery}" detected.</p>
        ) : (
          filteredNews.map((item) => {
            // Determine sentiment badge styling
            let sentimentColor = 'text-gray-400 border-gray-600';
            if (item.sentiment?.label === 'BULLISH') sentimentColor = 'text-primary border-primary/30';
            if (item.sentiment?.label === 'BEARISH') sentimentColor = 'text-warning border-warning/30';
            if (item.sentiment?.label === 'RADIOLOGICAL') sentimentColor = 'text-danger border-danger/40 shadow-[0_0_10px_rgba(255,51,102,0.3)] animate-pulse';

            return (
              <a 
                key={item.id} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 rounded-lg bg-surface border border-white/5 hover:border-primary/40 hover:bg-black/40 transition-all duration-500 hover:transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,255,136,0.1)] group relative overflow-hidden gap-6"
              >
                <div className="relative z-10 flex-1">
                  <div className="flex items-start mb-3 gap-2 flex-wrap">
                    <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-black/60 text-primary uppercase border border-primary/20">
                      {item.category}
                    </span>
                    
                    {item.sentiment && (
                      <span className={`text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-black/60 uppercase border ${sentimentColor} flex items-center`}>
                        {item.sentiment.label} ({item.sentiment.score.toFixed(0)})
                      </span>
                    )}

                    {item.impacts && (
                      <div className="flex gap-1">
                        <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-black/60 border text-primary border-primary/20 uppercase flex items-center">
                          ▲ {item.impacts.gainer.symbol} <span className="ml-1 opacity-80">{item.impacts.gainer.change}</span>
                        </span>
                        <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-black/60 border text-danger border-danger/20 uppercase flex items-center">
                          ▼ {item.impacts.loser.symbol} <span className="ml-1 opacity-80">{item.impacts.loser.change}</span>
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500 font-mono hidden sm:block ml-auto self-center tracking-widest">
                      {new Date(item.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <h3 className="font-['Outfit'] font-semibold text-gray-100 text-lg mb-2 leading-snug group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
                    <span>Secure Uplink: {item.source}</span>
                    {item.sentiment?.triggers && item.sentiment.triggers.length > 0 && (
                      <span className="text-primary/60 hidden sm:inline">Triggers: {item.sentiment.triggers.join(', ')}</span>
                    )}
                  </div>
                </div>

                {item.imageUrl && (
                  <div className="hidden sm:block w-48 h-32 flex-shrink-0 relative rounded-md overflow-hidden border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
                    <div 
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url(${item.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  </div>
                )}
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
