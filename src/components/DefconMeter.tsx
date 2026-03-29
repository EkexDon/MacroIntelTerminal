'use client';

import { useDefcon, DefconLevel } from './DefconContext';

export default function DefconMeter() {
  const { defcon } = useDefcon();
  
  const defconColors: Record<DefconLevel, string> = {
    1: 'text-[#ff0033] bg-[#ff0033]/20 border-[#ff0033] drop-shadow-[0_0_15px_rgba(255,0,51,0.8)]',
    2: 'text-[#ff3300] bg-[#ff3300]/20 border-[#ff3300] drop-shadow-[0_0_10px_rgba(255,51,0,0.6)]',
    3: 'text-[#ff9900] bg-[#ff9900]/20 border-[#ff9900]',
    4: 'text-[#00e6e6] bg-[#00e6e6]/20 border-[#00e6e6]',
    5: 'text-[var(--primary-color)] bg-[var(--primary-color)]/20 border-[var(--primary-color)] drop-shadow-[0_0_5px_rgba(0,255,136,0.3)]'
  };

  const threatTexts: Record<DefconLevel, string> = {
    1: 'CRITICAL',
    2: 'SEVERE',
    3: 'ELEVATED',
    4: 'GUARDED',
    5: 'NORMAL'
  };

  return (
    <div className="flex flex-col items-end">
      <div className={`flex items-center gap-3 border px-4 py-1 rounded backdrop-blur-md transition-all duration-1000 ${defconColors[defcon]} min-w-[150px] justify-between cursor-help`}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full animate-pulse bg-current`} />
          <span className="font-mono font-bold tracking-widest uppercase text-sm">
            DEFCON {defcon}
          </span>
        </div>
      </div>
      <span className={`text-[10px] font-mono tracking-widest mt-1 opacity-70 uppercase ${defconColors[defcon] && defconColors[defcon].split(' ')[0]}`}>
        THREAT: {threatTexts[defcon]}
      </span>
    </div>
  );
}
