'use client';

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

export const CHOKEPOINTS = [
  { name: 'Suez Canal', coords: [32.33, 30.60] },
  { name: 'Panama Canal', coords: [-79.91, 9.08] },
  { name: 'Strait of Hormuz', coords: [56.28, 26.56] },
  { name: 'Strait of Malacca', coords: [101.30, 2.90] },
  { name: 'Bab-el-Mandeb', coords: [43.33, 12.58] }
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  coordinates?: [number, number] | null;
}

interface OsintData {
  aviation: any[];
  maritime: any[];
}

interface SeismicAnomaly {
  id: string;
  mag: number;
  place: string;
  time: number;
  coordinates: [number, number];
}

interface WhaleEvent {
  id: string;
  price: number;
  qty: number;
  valueUsd: number;
  time: number;
  coordinates: [number, number];
  isBuyerMaker: boolean;
}

interface FullscreenMapProps {
  events: NewsItem[];
  osint?: OsintData | null;
  seismic?: SeismicAnomaly[] | null;
  whales?: WhaleEvent[] | null;
  chokepointsActive?: boolean;
  vips?: any[] | null;
}

interface HoveredNode {
  category: string;
  title: string;
  subtitle?: string;
  color?: string;
}

export default function FullscreenMap({ events, osint, seismic, whales, chokepointsActive, vips }: FullscreenMapProps) {
  const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);
  
  const validMarkers = events.filter(e => e.coordinates);

  // SVGs for OSINT
  const PlaneSVG = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";
  const ShipSVG = "M21.99 15c0 3.32-8.62 5-9.99 5-1.38 0-10-1.68-10-5 0-.75.61-1.34 1.34-1.34h17.32c.73 0 1.33.59 1.33 1.34zM10 5L7.5 12h9L14 5h-4z";

  return (
    <div className="glass-panel p-2 md:p-6 mb-0 relative overflow-hidden group rounded-b-none border-b-0 flex items-center justify-center min-h-[40vh] md:min-h-[60vh] bg-black/20">
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0wLDBGMTAsMTBMMjAsMEwzMCwxMEw0MCwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGZpbGw9Im5vbmUiIC8+Cjwvc3ZnPg==')] opacity-40 pointer-events-none" />

      {hoveredNode && (
        <div className="absolute top-4 left-4 max-w-sm z-20 p-4 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <span 
            className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-black/80 uppercase border mb-2 inline-block"
            style={{ color: hoveredNode.color || 'var(--primary-color)', borderColor: hoveredNode.color || 'var(--primary-color)' }}
          >
            {hoveredNode.category}
          </span>
          <p className="text-base font-['Outfit'] font-semibold text-white leading-snug">
            {hoveredNode.title}
          </p>
          {hoveredNode.subtitle && (
            <p className="text-xs font-mono text-gray-400 mt-1">{hoveredNode.subtitle}</p>
          )}
          <div className="mt-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            TARGET ACQUIRED
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl relative z-10 transition-transform duration-1000">
        <ComposableMap projectionConfig={{ scale: 160 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
          <ZoomableGroup>
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

            {/* OSINT LAYER: Maritime shipping vectors */}
            {osint?.maritime.map((ship) => (
              <Marker 
                key={ship.id} 
                coordinates={ship.coordinates}
                onMouseEnter={() => setHoveredNode({
                  category: `OSINT: ${ship.type}`,
                  title: ship.name,
                  subtitle: `Lat: ${ship.coordinates[1].toFixed(2)} | Lng: ${ship.coordinates[0].toFixed(2)}`,
                  color: '#fff'
                })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <g transform="translate(-12, -12) scale(0.6)">
                  <path d={ShipSVG} fill="#ffffff" opacity={0.8} />
                </g>
                <circle r={12} fill="transparent" className="cursor-crosshair" />
              </Marker>
            ))}

            {/* OSINT LAYER: Aviation active flights */}
            {osint?.aviation.map((plane) => (
              <Marker 
                key={plane.id} 
                coordinates={[plane.lng, plane.lat]}
                onMouseEnter={() => setHoveredNode({
                  category: `OSINT: AIRBORNE`,
                  title: `FLIGHT ${plane.callsign}`,
                  subtitle: `ALT: ${plane.altitude}m | VEL: ${Math.round(plane.velocity * 3.6)}km/h | LOC: ${plane.country}`,
                  color: '#00e5ff'
                })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <g transform={`translate(-12, -12) scale(0.5) rotate(${plane.heading || 0}, 12, 12)`}>
                  <path d={PlaneSVG} fill="#00e5ff" opacity={0.6} className="drop-shadow-[0_0_5px_#00e5ff]" />
                </g>
                <circle r={10} fill="transparent" className="cursor-crosshair" />
              </Marker>
            ))}

            {/* SEISMIC LAYER: Global Tectonic/Radiological Anomalies */}
            {seismic?.map((anomaly) => {
              const radius = Math.max(anomaly.mag * 1.5, 3);
              return (
                <Marker 
                  key={anomaly.id} 
                  coordinates={anomaly.coordinates}
                  onMouseEnter={() => setHoveredNode({
                    category: `USGS MAG ${anomaly.mag.toFixed(1)} ANOMALY`,
                    title: anomaly.place,
                    subtitle: `Tectonics Registered: ${new Date(anomaly.time).toLocaleTimeString()}`,
                    color: '#9933ff' 
                  })}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle r={radius * 2} fill="transparent" className="cursor-crosshair z-30" />
                  <circle r={radius} fill="#9933ff" className="animate-ping opacity-70 pointer-events-none" />
                  <circle r={radius / 2} fill="#9933ff" className="pointer-events-none drop-shadow-[0_0_15px_#9933ff]" />
                </Marker>
              );
            })}

            {/* WHALE LAYER: Web3 Real-Time Capital Transfers */}
            {whales?.map((whale) => (
              <Marker 
                key={whale.id} 
                coordinates={whale.coordinates}
                onMouseEnter={() => setHoveredNode({
                  category: `WEB3 LIQUIDITY: ${whale.isBuyerMaker ? 'SELL OFF' : 'BUY WALL'}`,
                  title: `$${(whale.valueUsd / 1000000).toFixed(2)}M USD TRANSFER`,
                  subtitle: `${whale.qty.toFixed(2)} BTC @ $${whale.price.toFixed(2)} / BLOCK: ${whale.id}`,
                  color: '#ffcc00'
                })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle r={15} fill="transparent" className="cursor-crosshair z-50" />
                <circle r={8} fill="#ffcc00" className="animate-ping opacity-80 pointer-events-none duration-1000" />
                <circle r={4} fill="#ffcc00" className="pointer-events-none drop-shadow-[0_0_20px_#ffcc00]" />
              </Marker>
            ))}

            {/* VANGUARD LAYER: VIP Flight Tracking & Convergence */}
            {vips?.map((vip) => (
              <Marker 
                key={`vip-${vip.id}`} 
                coordinates={[vip.lng, vip.lat]}
                onMouseEnter={() => setHoveredNode({
                  category: `VANGUARD: CORPORATE VIP`,
                  title: vip.name,
                  subtitle: `TARGET VELOCITY LOCKED | LOCATION: ${vip.lng.toFixed(2)}, ${vip.lat.toFixed(2)}`,
                  color: '#FFD700'
                })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Visuals: Very sharp, tiny golden star/triangle indicating a private jet */}
                <polygon points="0,-6 4,4 -5,0 5,0 -4,4" fill="#FFD700" className="drop-shadow-[0_0_10px_#FFD700]" />
                <circle r={15} fill="transparent" className="cursor-crosshair z-50" />
                <text
                   textAnchor="middle"
                   y={12}
                   style={{
                     fontFamily: 'monospace',
                     fontSize: '5px',
                     fill: '#FFD700',
                     fontWeight: 'bold',
                     filter: 'drop-shadow(0px 0px 4px rgba(255, 215, 0, 0.8))'
                   }}
                 >
                   [{vip.name.split(' ')[0]}]
                 </text>
              </Marker>
            ))}

            {/* SONAR LAYER: News Intelligence Locations */}
            {validMarkers.map((marker) => {
              const isDanger = marker.category === 'War/Politics' || marker.category === 'Industry';
              const color = isDanger ? 'var(--danger-color)' : 'var(--primary-color)';
              return (
                <Marker 
                  key={marker.id} 
                  coordinates={marker.coordinates!}
                  onMouseEnter={() => setHoveredNode({
                    category: marker.category,
                    title: marker.title,
                    color: color
                  })}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle r={10} fill="transparent" className="cursor-crosshair" />
                  <circle r={6} fill={color} className="animate-ping opacity-60 pointer-events-none" />
                  <circle r={3} fill={color} className="pointer-events-none drop-shadow-[0_0_8px_currentColor]" />
                </Marker>
              );
            })}

            {/* OMNISCIENT MATRIX: GLOBAL CHOKEPOINT GEOFENCES */}
            {chokepointsActive && CHOKEPOINTS.map((choke: any, i: number) => (
              <Marker key={`choke-${i}`} coordinates={choke.coords as [number, number]}>
                 {/* Danger Zone Radius */}
                 <circle r={15} fill="none" stroke="#ff0033" strokeWidth={1} strokeDasharray="2,2" className="animate-[spin_10s_linear_infinite]" />
                 <circle r={5} fill="#ff0033" fillOpacity={0.3} />
                 <circle r={2} fill="#ff0033" />
                 <text
                   textAnchor="middle"
                   y={25}
                   style={{
                     fontFamily: 'monospace',
                     fontSize: '6px',
                     fill: '#ff0033',
                     fontWeight: 'bold',
                     filter: 'drop-shadow(0px 0px 2px rgba(255,0,51,0.8))'
                   }}
                 >
                   {choke.name.toUpperCase()}
                 </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}
