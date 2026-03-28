'use client';

import { useEffect, useState } from 'react';

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

export default function TopNewsBanner() {
  const [lead, setLead] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadNews = async () => {
      try {
        const res = await fetch('/api/news');
        const json = await res.json();
        if (json.news && json.news.length > 0) {
          // Prioritize top story with an image for maximum visual impact
          const topStory = json.news.find((n: NewsItem) => n.imageUrl) || json.news[0];
          setLead(topStory);
        }
      } catch (err) {
        console.error('Failed to load top news banner', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadNews();
    const interval = setInterval(fetchLeadNews, 60000); // 1-minute updates
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-80 lg:h-96 glass-panel border-white/5 animate-pulse flex items-center justify-center mb-8">
        <span className="font-mono text-sm tracking-widest text-gray-500">ACQUIRING CRITICAL INTEL...</span>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <a 
      href={lead.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block relative w-full h-80 lg:h-96 glass-panel mb-8 overflow-hidden group border-danger/30 hover:border-danger hover:shadow-[0_0_50px_rgba(255,51,102,0.2)] transition-all duration-700"
    >
      {/* Deep Background Image blur */}
      {lead.imageUrl ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${lead.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-danger/10 to-transparent" />
      )}

      {/* Target Crosshair Decoration */}
      <div className="absolute top-6 right-6 w-16 h-16 border border-white/10 rounded-full flex items-center justify-center opacity-50 group-hover:rotate-90 transition-transform duration-1000">
        <div className="w-2 h-2 bg-danger shadow-[0_0_10px_rgba(255,51,102,1)]" />
        <div className="absolute inset-0 border border-danger/30 rounded-full animate-ping" />
      </div>

      <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full max-w-5xl z-10 flex flex-col justify-end h-full">
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-2 text-xs font-mono tracking-widest px-3 py-1 rounded bg-danger/20 text-danger border border-danger/50 uppercase shadow-[0_0_15px_rgba(255,51,102,0.3)]">
            <span className="w-2 h-2 bg-danger animate-pulse" /> CRITICAL DIRECTIVE
          </span>
          <span className="text-xs font-mono tracking-widest text-gray-400 border border-white/10 px-3 py-1 rounded bg-black/50 uppercase">
            {lead.category}
          </span>
          <span className="text-xs font-mono tracking-widest text-gray-500 uppercase">
            UPLINK: {lead.source}
          </span>
        </div>

        <h2 className="text-3xl lg:text-5xl font-['Outfit'] font-bold text-white mb-4 leading-tight group-hover:text-danger-gradient transition-colors duration-500 drop-shadow-md">
          {lead.title}
        </h2>

        <p className="text-base lg:text-lg text-gray-300 font-['Inter'] max-w-3xl line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
          {lead.summary}
        </p>

        {lead.impacts && (
          <div className="flex gap-4 mt-6">
            <div className="flex flex-col border-l-2 border-primary/50 pl-3">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">IMPACT: LONG</span>
              <span className="text-primary font-bold font-mono text-sm tracking-wider">▲ {lead.impacts.gainer.symbol} <span className="text-white ml-2">{lead.impacts.gainer.change}</span></span>
            </div>
            <div className="flex flex-col border-l-2 border-danger/50 pl-3">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">IMPACT: SHORT</span>
              <span className="text-danger font-bold font-mono text-sm tracking-wider">▼ {lead.impacts.loser.symbol} <span className="text-white ml-2">{lead.impacts.loser.change}</span></span>
            </div>
          </div>
        )}
      </div>
    </a>
  );
}
