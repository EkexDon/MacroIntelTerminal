'use client';

import { useEffect, useState, useRef } from 'react';

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
}

interface NewsFeedProps {
  keywords?: string[];
  onAlert?: () => void;
}

export default function NewsFeed({ keywords = [], onAlert }: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const json = await res.json();
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

  return (
    <div className="glass-panel p-6 h-full min-h-[800px] max-h-[1200px] overflow-hidden flex flex-col shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-['Outfit'] font-bold tracking-wider text-gradient uppercase">Global Intelligence Memos</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-danger animate-pulse"></div>
          <span className="text-xs text-danger font-mono tracking-widest uppercase">Live Feed</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-3 space-y-5">
        {news.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm text-center mt-10">No critical events detected.</p>
        ) : (
          news.map((item) => (
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
                <div className="mt-4 text-[10px] text-gray-600 uppercase tracking-widest">
                  Secure Uplink: {item.source}
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
          ))
        )}
      </div>
    </div>
  );
}
