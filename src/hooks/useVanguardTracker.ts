export interface VanguardEvent {
  id: string;
  name: string;
  lng: number;
  lat: number;
  status: string;
}

export interface VanguardConvergence {
  location: string;
  attendees: string[];
  timestamp: number;
}

import { useState, useEffect } from 'react';

export function useVanguardTracker(active: boolean, onConvergance?: (data: VanguardConvergence) => void) {
  const [vips, setVips] = useState<VanguardEvent[]>([]);

  useEffect(() => {
    if (!active) {
      setVips([]);
      return;
    }

    const fetchVanguard = async () => {
      try {
        const res = await fetch('/api/vanguard');
        const json = await res.json();
        
        if (json.vips) {
          setVips(json.vips);
        }
        
        // If the math detected 3+ CEOs landing together, trigger the payload
        if (json.convergenceDetails && onConvergance) {
          onConvergance(json.convergenceDetails);
        }
      } catch (e) {
        console.error("Vanguard tracker failed offline", e);
      }
    };

    fetchVanguard();
    const interval = setInterval(fetchVanguard, 20000); // Poll every 20s
    return () => clearInterval(interval);
  }, [active, onConvergance]);

  return { vips };
}
