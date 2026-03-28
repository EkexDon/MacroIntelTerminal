'use client';

import { useState } from 'react';

interface KeywordAlertsProps {
  keywords: string[];
  setKeywords: (kw: string[]) => void;
}

export default function KeywordAlerts({ keywords, setKeywords }: KeywordAlertsProps) {
  const [input, setInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = input.trim().toLowerCase();
    if (val && !keywords.includes(val)) {
      setKeywords([...keywords, val]);
      setInput('');
    }
  };

  const handleRemove = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-['Outfit'] font-bold tracking-wider text-gradient uppercase flex items-center gap-2 mb-4">
        Sonar Ping <span className="text-gray-500">Alerts</span>
      </h3>
      
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Uranium, Cyberattack..."
          className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-danger transition-colors"
        />
        <button 
          type="submit" 
          className="bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30 px-3 py-2 rounded text-xs font-mono uppercase tracking-widest transition-colors"
        >
          Track
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {keywords.length === 0 ? (
          <span className="text-xs text-gray-500 font-mono tracking-widest">NO ACTIVE PARAMETERS...</span>
        ) : (
          keywords.map(kw => (
            <span 
              key={kw} 
              className="group flex items-center gap-2 bg-black/40 border border-danger/30 text-danger px-2 py-1 rounded text-xs font-mono tracking-widest uppercase cursor-pointer hover:bg-danger/10 transition-colors"
              onClick={() => handleRemove(kw)}
              title="Click to remove"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></span>
              {kw}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">×</span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
