'use client';

import { useState, useEffect } from 'react';

interface CortexData {
  timestamp: string;
  generatedAt: string;
  estimatedDefcon: number;
  globalSentiment: { score: number; label: string };
  dominantThreatVector: string;
  topHeadlines: { title: string; category: string; sentiment: string }[];
  tfidfBriefing: string[];
  cryptoMomentum: { btc: number; eth: number; trend: string };
  seismicThreat: { count: number; maxMag: number; active: boolean };
  executiveSummary: string;
}

const defconColors: Record<number, string> = {
  1: '#ff0033', 2: '#ff3300', 3: '#ff9900', 4: '#00e6e6', 5: '#00ff88'
};

export default function CortexBriefing() {
  const [data, setData] = useState<CortexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchCortex = async () => {
      try {
        const res = await fetch('/api/cortex');
        const json = await res.json();
        if (!json.error) setData(json);
      } catch (e) {
        console.error('Cortex offline', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCortex();
    // Refresh every 10 minutes
    const interval = setInterval(fetchCortex, 600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass-panel p-6 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-48 mb-3" />
        <div className="h-3 bg-white/5 rounded w-full mb-2" />
        <div className="h-3 bg-white/5 rounded w-3/4" />
      </div>
    );
  }

  if (!data) return null;

  const dc = data.estimatedDefcon;
  const dcColor = defconColors[dc] || '#00ff88';

  return (
    <div 
      className="glass-panel overflow-hidden transition-all duration-500"
      style={{ borderColor: `${dcColor}30` }}
    >
      {/* Header Bar */}
      <div 
        className="flex items-center justify-between px-5 py-3 cursor-pointer select-none"
        style={{ background: `linear-gradient(135deg, ${dcColor}08 0%, transparent 100%)` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-pulse" 
            style={{ background: dcColor, boxShadow: `0 0 10px ${dcColor}80` }} 
          />
          <h3 className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: dcColor }}>
            Agent Cortex — Morning Briefing
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-gray-500 tracking-widest hidden sm:inline">
            {data.timestamp} | {data.generatedAt}
          </span>
          <div 
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest"
            style={{ 
              color: dcColor, 
              background: `${dcColor}15`, 
              border: `1px solid ${dcColor}40` 
            }}
          >
            DEFCON {dc}
          </div>
          <span className="text-gray-500 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Executive Summary — Always Visible */}
      <div className="px-5 py-3 border-t border-white/5">
        <p className="text-xs font-mono text-gray-400 leading-relaxed">
          {data.executiveSummary}
        </p>
      </div>

      {/* Expanded Intelligence Sections */}
      {expanded && (
        <div className="border-t border-white/5 animate-in slide-in-from-top-2 duration-300">

          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            <div className="p-4 border-r border-b border-white/5">
              <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase mb-1">Sentiment</p>
              <p className={`text-lg font-['Outfit'] font-black ${
                data.globalSentiment.label === 'BULLISH' ? 'text-primary' : 
                data.globalSentiment.label === 'BEARISH' ? 'text-danger' : 'text-gray-400'
              }`}>
                {data.globalSentiment.score}/100
              </p>
              <p className="text-[9px] font-mono text-gray-600 mt-0.5">{data.globalSentiment.label}</p>
            </div>
            <div className="p-4 border-r border-b border-white/5">
              <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase mb-1">Threat Vector</p>
              <p className="text-sm font-mono font-bold text-white">{data.dominantThreatVector}</p>
            </div>
            <div className="p-4 border-r border-b border-white/5">
              <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase mb-1">BTC 24H</p>
              <p className={`text-lg font-['Outfit'] font-black ${data.cryptoMomentum.btc >= 0 ? 'text-primary' : 'text-danger'}`}>
                {data.cryptoMomentum.btc >= 0 ? '+' : ''}{data.cryptoMomentum.btc}%
              </p>
              <p className="text-[9px] font-mono text-gray-600 mt-0.5">{data.cryptoMomentum.trend}</p>
            </div>
            <div className="p-4 border-b border-white/5">
              <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase mb-1">Seismic</p>
              {data.seismicThreat.active ? (
                <>
                  <p className="text-lg font-['Outfit'] font-black text-[#ff9900]">MAG {data.seismicThreat.maxMag}</p>
                  <p className="text-[9px] font-mono text-[#ff9900] mt-0.5">{data.seismicThreat.count} EVENT(S)</p>
                </>
              ) : (
                <p className="text-sm font-mono text-gray-600">STABLE</p>
              )}
            </div>
          </div>

          {/* Top 5 Headlines */}
          <div className="px-5 py-4">
            <h4 className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Priority Intelligence Items
            </h4>
            <div className="space-y-2">
              {data.topHeadlines.map((h, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <span className="text-[10px] font-mono text-gray-600 mt-0.5 shrink-0 w-4">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 font-mono leading-relaxed truncate">{h.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-mono text-gray-600 uppercase">{h.category}</span>
                      <span className={`text-[9px] font-mono uppercase font-bold ${
                        h.sentiment === 'BULLISH' ? 'text-primary' : 
                        h.sentiment === 'BEARISH' ? 'text-danger' : 'text-gray-500'
                      }`}>
                        {h.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TF-IDF Extracted Briefing */}
          {data.tfidfBriefing.length > 0 && (
            <div className="px-5 py-4 border-t border-white/5">
              <h4 className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e6e6]" />
                TF-IDF Extracted Intelligence
              </h4>
              <div className="space-y-2">
                {data.tfidfBriefing.map((sentence, i) => (
                  <p key={i} className="text-[11px] font-mono text-gray-400 leading-relaxed pl-3 border-l-2 border-[#00e6e6]/20">
                    {sentence}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Classification Footer */}
          <div className="px-5 py-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] font-mono text-gray-600 tracking-widest">
              CLASSIFICATION: UNCLASSIFIED // FOUO
            </span>
            <span className="text-[9px] font-mono text-gray-600 tracking-widest">
              CORTEX ENGINE v1.0 — TF-IDF + AFINN SENTIMENT
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
