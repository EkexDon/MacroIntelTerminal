'use client';

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  coordinates?: [number, number] | null;
}

interface FullscreenMapProps {
  events: NewsItem[];
}

export default function FullscreenMap({ events }: FullscreenMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<NewsItem | null>(null);
  
  const validMarkers = events.filter(e => e.coordinates);

  return (
    <div className="glass-panel p-2 md:p-6 mb-0 relative overflow-hidden group rounded-b-none border-b-0 flex items-center justify-center min-h-[40vh] md:min-h-[60vh] bg-black/20">
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0wLDBGMTAsMTBMMjAsMEwzMCwxMEw0MCwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGZpbGw9Im5vbmUiIC8+Cjwvc3ZnPg==')] opacity-40 pointer-events-none" />

      {hoveredMarker && (
        <div className="absolute top-4 left-4 max-w-sm z-20 p-4 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-black/80 text-primary uppercase border border-primary/30 mb-2 inline-block shadow-[0_0_10px_rgba(0,255,136,0.2)]">
            {hoveredMarker.category}
          </span>
          <p className="text-base font-['Outfit'] font-semibold text-white leading-snug">
            {hoveredMarker.title}
          </p>
          <div className="mt-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            TARGET ACQUIRED
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl relative z-10 transition-transform duration-1000">
        <ComposableMap projectionConfig={{ scale: 160 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  strokeWidth={0.3}
                  style={{
                    default: { fill: "var(--fg-color)", fillOpacity: 0.08, stroke: "var(--fg-color)", strokeOpacity: 0.15, outline: "none" },
                    hover: { fill: "var(--primary-color)", fillOpacity: 0.2, stroke: "var(--primary-color)", strokeOpacity: 0.5, outline: "none" },
                    pressed: { fill: "var(--primary-color)", fillOpacity: 0.1, outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {validMarkers.map((marker) => {
            const isDanger = marker.category === 'War/Politics' || marker.category === 'Industry';
            return (
              <Marker 
                key={marker.id} 
                coordinates={marker.coordinates!}
                onMouseEnter={() => setHoveredMarker(marker)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                <circle r={10} fill="transparent" className="cursor-crosshair" />
                <circle r={6} fill={isDanger ? 'var(--danger-color)' : 'var(--primary-color)'} className="animate-ping opacity-60 pointer-events-none" />
                <circle r={3} fill={isDanger ? 'var(--danger-color)' : 'var(--primary-color)'} className="pointer-events-none drop-shadow-[0_0_8px_currentColor]" />
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
    </div>
  );
}
