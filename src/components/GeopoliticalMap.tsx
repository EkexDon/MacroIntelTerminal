'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapMarker {
  id: string;
  title: string;
  category: string;
  coordinates: [number, number];
}

export default function GeopoliticalMap() {
  const router = useRouter();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const json = await res.json();
        if (json.news) {
          const validMarkers = json.news
            .filter((n: any) => n.coordinates)
            .map((n: any) => ({
              id: n.id,
              coordinates: n.coordinates,
              title: n.title,
              category: n.category
            }));
          setMarkers(validMarkers);
        }
      } catch (err) {
        console.error("Map data fetch error:", err);
      }
    };
    
    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      onClick={() => router.push('/map')}
      className="glass-panel p-6 flex flex-col mb-6 relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none" />
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-lg font-['Outfit'] font-bold tracking-wider text-gradient uppercase flex items-center gap-2">
          Global <span className="text-white">Hotspots</span>
        </h3>
        <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-black/50 text-danger border border-danger/20 uppercase flex items-center gap-2 group-hover:animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-danger"></span> EXPAND MAP
        </span>
      </div>

      {hoveredMarker && (
        <div className="absolute top-16 left-6 right-6 z-20 p-3 bg-surface/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg pointer-events-none animate-in fade-in duration-200">
          <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-black/50 text-primary uppercase border border-primary/20 mb-1 inline-block">
            {hoveredMarker.category}
          </span>
          <p className="text-sm font-['Outfit'] font-semibold text-white line-clamp-2">
            {hoveredMarker.title}
          </p>
        </div>
      )}
      
      <div className="flex-1 w-full bg-black/40 rounded-lg border border-white/5 overflow-hidden relative z-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0wLDBGMTAsMTBMMjAsMEwzMCwxMEw0MCwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGZpbGw9Im5vbmUiIC8+Cjwvc3ZnPg==')] opacity-30 pointer-events-none" />
        <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400} style={{ width: "100%", height: "auto" }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  strokeWidth={0.5}
                  style={{
                    default: { fill: "var(--fg-color)", fillOpacity: 0.1, stroke: "var(--fg-color)", strokeOpacity: 0.2, outline: "none" },
                    hover: { fill: "var(--fg-color)", fillOpacity: 0.2, stroke: "var(--fg-color)", strokeOpacity: 0.3, outline: "none" },
                    pressed: { fill: "var(--fg-color)", fillOpacity: 0.15, outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map((marker) => {
            const isDanger = marker.category === 'War/Politics' || marker.category === 'Industry';
            return (
              <Marker 
                key={marker.id} 
                coordinates={marker.coordinates}
                onMouseEnter={() => setHoveredMarker(marker)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                <circle r={8} fill="transparent" className="cursor-crosshair" />
                <circle r={6} fill={isDanger ? 'var(--danger-color)' : 'var(--primary-color)'} className="animate-ping opacity-40 pointer-events-none" />
                <circle r={2} fill={isDanger ? 'var(--danger-color)' : 'var(--primary-color)'} className="pointer-events-none" />
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
    </div>
  );
}
