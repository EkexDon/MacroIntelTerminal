'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// DEFCON 5 = Normal/Peacetime, DEFCON 1 = Critical/Chaotic
export type DefconLevel = 1 | 2 | 3 | 4 | 5;

interface DefconContextType {
  defcon: DefconLevel;
  setDefcon: (level: DefconLevel) => void;
  registerThreat: (threatScore: number) => void; 
}

const DefconContext = createContext<DefconContextType>({
  defcon: 5,
  setDefcon: () => {},
  registerThreat: () => {}
});

export const useDefcon = () => useContext(DefconContext);

export function DefconProvider({ children }: { children: React.ReactNode }) {
  const [defcon, setDefcon] = useState<DefconLevel>(5);
  const [threatLevel, setThreatLevel] = useState(0); // 0 to 100 master matrix

  // Threat decay over time — must be aggressive enough to counterbalance continuous threat sources
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatLevel(prev => Math.max(0, prev - 10));
    }, 15000); // Decay -10 every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Update DEFCON master state purely based on internal threat level score
  useEffect(() => {
    if (threatLevel >= 80) setDefcon(1);      // 80+ Threat -> DEFCON 1 (Chaos)
    else if (threatLevel >= 60) setDefcon(2); // 60+ Threat -> DEFCON 2 (Severe)
    else if (threatLevel >= 40) setDefcon(3); // 40+ Threat -> DEFCON 3 (Elevated)
    else if (threatLevel >= 20) setDefcon(4); // 20+ Threat -> DEFCON 4 (Guarded)
    else setDefcon(5);                        // < 20 Threat -> DEFCON 5 (Normal)
  }, [threatLevel]);

  // Method accessed by our various subagents (Whale Tracker, Seismic, News Feed) to inject threat
  const registerThreat = (score: number) => {
    setThreatLevel(prev => Math.min(100, prev + score));
  };

  return (
    <DefconContext.Provider value={{ defcon, setDefcon, registerThreat }}>
      <div 
        className={`defcon-wrapper defcon-${defcon} w-full min-h-screen relative transition-colors duration-1000`}
      >
        {/* Pulsing red vignette overlay for extreme threat levels */}
        {(defcon === 1 || defcon === 2) && (
          <div 
            className={`fixed inset-0 pointer-events-none z-[200] transition-opacity duration-1000 ${
              defcon === 1 
                ? 'opacity-30 mix-blend-color-burn bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(255,0,0,0.8)_100%)] animate-pulse' 
                : 'opacity-10 bg-[radial-gradient(ellipse_at_center,_transparent_70%,_rgba(255,50,50,0.5)_100%)]'
            }`} 
          />
        )}
        {children}
      </div>
    </DefconContext.Provider>
  );
}
