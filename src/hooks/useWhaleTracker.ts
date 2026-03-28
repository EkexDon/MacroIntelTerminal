'use client';

import { useEffect, useRef } from 'react';

export interface WhaleEvent {
  id: string;
  price: number;
  qty: number;
  valueUsd: number;
  time: number;
  coordinates: [number, number];
  isBuyerMaker: boolean; // true = sell, false = buy
}

// Global liquidity nodes (NY, London, Tokyo, Singapore, Dubai, Hong Kong, Zurich, Cayman, Frankfurt, Shanghai, Mumbai)
const WHALE_NODES: [number, number][] = [
  [-74.006, 40.7128], [-0.1276, 51.5074], [139.6917, 35.6895], 
  [103.8198, 1.3521], [55.2708, 25.2048], [114.1694, 22.3193], 
  [8.5417, 47.3769], [-81.3792, 19.3220], [8.6821, 50.1109],
  [121.4737, 31.2304], [72.8777, 19.0760]
];

export function useWhaleTracker(active: boolean, thresholdUsd: number = 500000, onWhale: (whale: WhaleEvent) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!active) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    try {
      wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.e === 'trade') {
          const p = parseFloat(data.p);
          const q = parseFloat(data.q);
          const valueUsd = p * q;

          // If the single block transaction crosses the configured USD threshold
          if (valueUsd >= thresholdUsd) {
            const whale: WhaleEvent = {
              id: `w-${data.t}`,
              price: p,
              qty: q,
              valueUsd,
              time: data.T,
              isBuyerMaker: data.m,
              coordinates: WHALE_NODES[Math.floor(Math.random() * WHALE_NODES.length)]
            };
            onWhale(whale);
          }
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WhaleTracker WebSocket Error:", error);
      };
    } catch (e) {
      console.error("Failed to connect Whale Sonar:", e);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [active, thresholdUsd, onWhale]);
}
