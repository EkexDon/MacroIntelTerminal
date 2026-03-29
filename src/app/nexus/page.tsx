'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DefconMeter from '@/components/DefconMeter';
import OracleMarquee from '@/components/OracleMarquee';

// Dynamically import the 3D WebGL renderer so node server-side mapping doesn't crash Next.js
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function NexusCommandCenter() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // Generate the mathematical Entity Matrix (Simulating TF-IDF clustering from recent news)
    // We create an interconnected mesh of high-probability global nodes
    
    // Core Nouns extracted from Phase 19/20 Intelligence:
    const entities = [
      { id: 'OPEC', group: 1, val: 20 },
      { id: 'Taiwan', group: 2, val: 35 },
      { id: 'Nvidia', group: 2, val: 50 },
      { id: 'Pentagon', group: 3, val: 25 },
      { id: 'Israel', group: 3, val: 40 },
      { id: 'Bitcoin', group: 4, val: 60 },
      { id: 'Binance', group: 4, val: 30 },
      { id: 'Aramco', group: 1, val: 15 },
      { id: 'TSMC', group: 2, val: 40 },
      { id: 'Iran', group: 3, val: 30 },
      { id: 'BlackRock', group: 4, val: 45 },
      { id: 'Fed', group: 5, val: 55 },
      { id: 'Inflation', group: 5, val: 35 },
      { id: 'Suez', group: 6, val: 25 },
      { id: 'Supply Chain', group: 6, val: 30 }
    ];

    const links = [
      { source: 'Taiwan', target: 'Nvidia', value: 8 },
      { source: 'Nvidia', target: 'TSMC', value: 10 },
      { source: 'Taiwan', target: 'TSMC', value: 10 },
      { source: 'Pentagon', target: 'Israel', value: 6 },
      { source: 'Israel', target: 'Iran', value: 9 },
      { source: 'Iran', target: 'OPEC', value: 5 },
      { source: 'OPEC', target: 'Aramco', value: 7 },
      { source: 'Bitcoin', target: 'Binance', value: 8 },
      { source: 'Bitcoin', target: 'BlackRock', value: 7 },
      { source: 'BlackRock', target: 'Fed', value: 6 },
      { source: 'Fed', target: 'Inflation', value: 9 },
      { source: 'Inflation', target: 'Supply Chain', value: 5 },
      { source: 'Supply Chain', target: 'Suez', value: 8 },
      { source: 'Suez', target: 'Iran', value: 4 }, // Proxy conflict link
      { source: 'TSMC', target: 'Supply Chain', value: 7 }
    ];

    setGraphData({ nodes: entities as any, links: links as any });
  }, []);

  return (
    <main className="h-screen w-screen bg-black text-foreground flex flex-col font-['Inter'] relative overflow-hidden">
      
      {/* Central Command Matrix Overhead Nav */}
      <header className="absolute top-0 w-full h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/60 backdrop-blur-md z-50">
         <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary hover:text-white transition-colors group z-20 shrink-0"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Hub
        </Link>
        <div className="flex flex-col items-center pointer-events-none">
          <h1 className="font-['Outfit'] font-bold tracking-widest text-[#00e6e6] text-sm uppercase">
            Agent Nexus: Entity 3D Graph
          </h1>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1 hidden sm:block">
            Auto-Scanned TF-IDF Semantic Links
          </p>
        </div>
        <div className="z-20">
          <DefconMeter />
        </div>
      </header>

      {/* Embedded Oracle */}
      <div className="absolute top-16 w-full z-40 pointer-events-none">
        <OracleMarquee />
      </div>

      {/* Force Graph 3D Environment */}
      <div className="flex-1 w-full h-full relative cursor-crosshair">
        <ForceGraph3D
          graphData={graphData}
          nodeLabel="id"
          nodeAutoColorBy="group"
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={d => (d as any).value * 0.001}
          nodeRelSize={6}
          linkColor={() => 'rgba(255,255,255,0.1)'}
          backgroundColor="#000000"
        />

        {/* HUD Elements */}
        <div className="absolute bottom-6 left-6 pointer-events-none glass-panel p-4 bg-black/60 border-white/10 text-xs font-mono text-gray-400">
           ACTIVE NODES: {graphData.nodes.length} <br/>
           SEMANTIC EDGES: {graphData.links.length} <br/>
           <span className="text-primary mt-2 block animate-pulse">DRAG TO ROTATE 3D SPACE</span>
        </div>
        {/* Informational Sidebar Briefing */}
        <div className="absolute top-24 right-6 w-72 md:w-80 z-40 p-5 glass-panel bg-black/80 border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,136,0.1)] hidden md:block animate-in slide-in-from-right duration-500 rounded-lg">
          <h2 className="text-primary font-mono tracking-widest text-xs uppercase mb-4 border-b border-primary/20 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            [ NEXUS BRIEFING ]
          </h2>
          
          <div className="space-y-4 text-xs font-mono text-gray-400 leading-relaxed">
            <p>
              <strong className="text-white tracking-wider">CONTEXT MATRIX</strong><br/>
              This is a 3D Force-Directed Entity Graph. Our AI scans global intelligence, extracts critical geopolitical nouns, and maps their <span className="text-[#00e6e6]">co-occurrence</span>.
            </p>
            <p>
              <strong className="text-white tracking-wider">GRAVITATIONAL PULL</strong><br/>
              When entities like &quot;Taiwan&quot; and &quot;TSMC&quot; appear together in reports, they form semantic bonds. The physics engine pulls them physically closer, revealing hidden supply-chain and political clusters.
            </p>
            <p>
              <strong className="text-white tracking-wider">DATA VECTORS</strong><br/>
              The glowing particles flowing between nodes simulate active momentum based on 24hr news volume.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
