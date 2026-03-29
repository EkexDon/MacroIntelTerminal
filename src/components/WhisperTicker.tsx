'use client';

import { useState, useEffect } from 'react';
import { useDefcon } from './DefconContext';

const CHATTER = ["BLOCKADE", "EXPLOIT", "LIQUIDATION", "RANSOMWARE", "STRIKE", "TARIFFS", "SUPPLY SHOCK", "CHIP BAN"];

export default function WhisperTicker() {
  const [ticker, setTicker] = useState("AGENT WHISPER: INITIALIZING DARK WEB SCRAPERS...");
  const [isSpiking, setIsSpiking] = useState(false);
  const { registerThreat } = useDefcon();

  useEffect(() => {
    const inter = setInterval(() => {
      const isSpike = Math.random() < 0.08; // 8% chance per tick
      
      if (isSpike) {
        const word = CHATTER[Math.floor(Math.random() * CHATTER.length)];
        setTicker(`[DARKINT ALERT] +8400% VELOCITY SPIKE DETECTED ON KEYWORD: "${word}" ACROSS ENCRYPTED FORUMS.`);
        setIsSpiking(true);
        // Automatically link this alternative data intelligence into the global Terminal DEFCON status
        if (["BLOCKADE", "EXPLOIT", "STRIKE"].includes(word)) {
            registerThreat(15); // Moderate push — won't solo max out DEFCON
        }
      } else {
        setTicker(`INDEXING: ${Math.floor(Math.random() * 5000) + 1000} ENCRYPTED PACKETS ANALYZED / MINUTE... NOBNET CLEAR.`);
        setIsSpiking(false);
      }
    }, 6000);
    return () => clearInterval(inter);
  }, [registerThreat]);

  return (
    <div className={`w-full overflow-hidden whitespace-nowrap transition-colors duration-1000 flex items-center px-4 py-1.5 ${isSpiking ? 'bg-[#ff0033]/20 border-b border-[#ff0033]' : 'bg-[#1a0000] border-b border-danger/30'}`}>
      <div className={`w-2 h-2 rounded-full mr-4 shrink-0 transition-colors ${isSpiking ? 'bg-[#ff0033] animate-ping' : 'bg-danger animate-pulse'}`} />
      <div className={`font-mono tracking-[0.2em] uppercase text-[10px] md:text-xs animate-[marquee_20s_linear_infinite] inline-block ${isSpiking ? 'text-[#ff0033] font-bold drop-shadow-[0_0_8px_rgba(255,0,51,0.8)]' : 'text-danger/80'}`}>
        {ticker}
      </div>
    </div>
  );
}
