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

import { useState, useEffect, useRef, useCallback } from 'react';

export function useVanguardTracker(active: boolean, onConvergence?: (data: VanguardConvergence) => void) {
  const [vips, setVips] = useState<VanguardEvent[]>([]);
  // Stable ref to avoid re-triggering the effect on every render
  const onConvergenceRef = useRef(onConvergence);
  onConvergenceRef.current = onConvergence;

  // Cooldown: prevent spamming alerts
  const lastAlertRef = useRef(0);

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
        
        // Only fire convergence alert if we haven't alerted in the last 60 seconds
        const now = Date.now();
        if (json.convergenceDetails && onConvergenceRef.current && (now - lastAlertRef.current > 60000)) {
          lastAlertRef.current = now;
          onConvergenceRef.current(json.convergenceDetails);
        }
      } catch (e) {
        console.error("Vanguard tracker failed offline", e);
      }
    };

    fetchVanguard();
    const interval = setInterval(fetchVanguard, 60000); // Poll every 60s (not 20s)
    return () => clearInterval(interval);
  }, [active]); // Only depends on active, not on the callback

  return { vips };
}
