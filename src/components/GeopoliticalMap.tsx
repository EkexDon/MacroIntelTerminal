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

interface OsintData {
  aviation: any[];
  maritime: any[];
}

interface HoveredNode {
  category: string;
  title: string;
  color?: string;
}

export default function GeopoliticalMap() {
  const router = useRouter();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [osint, setOsint] = useState<OsintData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, osintRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/osint')
        ]);
        const json = await newsRes.json();
        const osintJson = await osintRes.json();

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
        if (osintJson) setOsint(osintJson);
      } catch (err) {
        console.error("Map data fetch error:", err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const PlaneSVG = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";
  const ShipSVG = "M21.99 15c0 3.32-8.62 5-9.99 5-1.38 0-10-1.68-10-5 0-.75.61-1.34 1.34-1.34h17.32c.73 0 1.33.59 1.33 1.34zM10 5L7.5 12h9L14 5h-4z";

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

      {hoveredNode && (
        <div className="absolute top-16 left-6 right-6 z-20 p-3 bg-surface/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg pointer-events-none animate-in fade-in duration-200">
          <span 
            className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-black/50 uppercase border mb-1 inline-block"
            style={{ color: hoveredNode.color || 'var(--primary-color)', borderColor: hoveredNode.color || 'var(--primary-color)' }}
          >
            {hoveredNode.category}
          </span>
          <p className="text-sm font-['Outfit'] font-semibold text-white line-clamp-2">
            {hoveredNode.title}
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

          {/* OSINT LAYER: Maritime */}
          {osint?.maritime.map((ship) => (
            <Marker 
              key={ship.id} 
              coordinates={ship.coordinates}
              onMouseEnter={() => setHoveredNode({
                category: `OSINT: ${ship.type}`,
                title: ship.name,
                color: '#fff'
              })}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <g transform="translate(-10, -10) scale(0.5)">
                <path d={ShipSVG} fill="#ffffff" opacity={0.6} />
              </g>
            </Marker>
          ))}

          {/* OSINT LAYER: Aviation */}
          {osint?.aviation.map((plane) => (
            <Marker 
              key={plane.id} 
              coordinates={[plane.lng, plane.lat]}
              onMouseEnter={() => setHoveredNode({
                category: `OSINT: AIRBORNE`,
                title: plane.callsign,
                color: '#00e5ff'
              })}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <g transform={`translate(-8, -8) scale(0.4) rotate(${plane.heading || 0}, 12, 12)`}>
                <path d={PlaneSVG} fill="#00e5ff" opacity={0.5} />
              </g>
            </Marker>
          ))}

          {/* SONAR LAYER: News Intelligence */}
          {markers.map((marker) => {
            const isDanger = marker.category === 'War/Politics' || marker.category === 'Industry';
            const color = isDanger ? 'var(--danger-color)' : 'var(--primary-color)';
            return (
              <Marker 
                key={marker.id} 
                coordinates={marker.coordinates}
                onMouseEnter={() => setHoveredNode({
                  category: marker.category,
                  title: marker.title,
                  color: color
                })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle r={8} fill="transparent" className="cursor-crosshair" />
                <circle r={6} fill={color} className="animate-ping opacity-40 pointer-events-none" />
                <circle r={2} fill={color} className="pointer-events-none" />
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
    </div>
  );
}
