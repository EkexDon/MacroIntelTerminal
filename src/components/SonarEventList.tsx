import React from 'react';

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

interface SonarEventListProps {
  events: NewsItem[];
}

export default function SonarEventList({ events }: SonarEventListProps) {
  const geoEvents = events.filter(e => e.coordinates);

  if (geoEvents.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-gray-500 font-mono tracking-widest text-sm flex-1">
        NO GEOGRAPHIC SONAR ANOMALIES DETECTED.
      </div>
    );
  }

  return (
    <div className="glass-panel border-t-0 rounded-t-none flex-1 overflow-hidden flex flex-col min-h-[300px]">
      <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
        <h3 className="font-['Outfit'] font-bold tracking-wider text-gradient uppercase">Detected Anomalies</h3>
        <span className="text-[10px] font-mono text-gray-400">GEO-LINKED INTEL</span>
      </div>
      
      <div className="overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {geoEvents.map(item => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded bg-surface border border-white/5 hover:border-primary/50 transition-colors group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-black/50 text-white uppercase border border-white/10 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                {item.category}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {item.coordinates ? `COORD: ${item.coordinates[0].toFixed(2)}, ${item.coordinates[1].toFixed(2)}` : ''}
              </span>
            </div>
            
            <h4 className="font-['Outfit'] font-semibold text-gray-200 text-sm mb-1 group-hover:text-primary transition-colors">
              {item.title}
            </h4>
            
            <p className="text-xs text-gray-400 line-clamp-1 mb-3">
              {item.summary}
            </p>

            {item.impacts && (
              <div className="flex gap-2">
                <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-black/50 border text-primary border-primary/20 uppercase flex items-center">
                  ▲ {item.impacts.gainer.symbol} <span className="ml-1 opacity-80">{item.impacts.gainer.change}</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-black/50 border text-danger border-danger/20 uppercase flex items-center">
                  ▼ {item.impacts.loser.symbol} <span className="ml-1 opacity-80">{item.impacts.loser.change}</span>
                </span>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
