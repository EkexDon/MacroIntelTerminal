'use client';

import React, { useEffect, useState } from 'react';

interface BriefingProps {
  briefing: string[];
}

export default function AIBriefingBanner({ briefing }: BriefingProps) {
  const [typedLines, setTypedLines] = useState<string[]>([]);

  useEffect(() => {
    if (!briefing || briefing.length === 0) return;
    
    // Simple typewriter effect for the briefing lines
    let currentLine = 0;
    const interval = setInterval(() => {
      setTypedLines(prev => {
        if (prev.length < briefing.length) {
          return [...prev, briefing[currentLine]];
        }
        return prev;
      });
      currentLine++;
      if (currentLine >= briefing.length) clearInterval(interval);
    }, 800);

    return () => clearInterval(interval);
  }, [briefing]);

  if (!briefing || briefing.length === 0) return null;

  return (
    <div className="glass-panel p-4 md:p-6 mb-6 mt-4 relative overflow-hidden group border-l-4 border-l-primary/80 shadow-[0_5px_30px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-black/60 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,255,136,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="text-[10px] font-mono tracking-widest text-primary mt-2 uppercase animate-pulse">
            AI ANALYST
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            Global Situation Report (SITREP)
          </h3>
          <div className="space-y-2 mt-3">
            {typedLines.map((line, idx) => (
              <p key={idx} className="text-sm md:text-base font-['Outfit'] text-white/90 leading-relaxed border-b border-white/5 pb-2 animate-in fade-in slide-in-from-left-4 duration-500">
                <span className="text-primary font-mono mr-2 opacity-60">[{idx+1}]</span>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
