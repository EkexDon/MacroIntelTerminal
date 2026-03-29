'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend, ReferenceLine
} from 'recharts';
import DefconMeter from '@/components/DefconMeter';

interface AlphaDataPoint {
  date: string;
  SP500: number;
  JobPostings: number;
  AppDownloads: number;
  Sentiment: string;
}

export default function AlphaTerminal() {
  const [data, setData] = useState<AlphaDataPoint[]>([]);
  const [anomaly, setAnomaly] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlpha = async () => {
      try {
        const res = await fetch('/api/alpha');
        const json = await res.json();
        if (json.metrics) {
          setData(json.metrics);
        }
        if (json.anomalyDetected) {
          setAnomaly(json.alphaTarget);
        }
      } catch (e) {
        console.error('Alpha feed failed', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlpha();
  }, []);

  const latestSP = data.length > 0 ? data[data.length - 1].SP500 : 0;
  const latestJobs = data.length > 0 ? data[data.length - 1].JobPostings : 0;
  const latestApps = data.length > 0 ? data[data.length - 1].AppDownloads : 0;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-['Inter'] selection:bg-primary/30 selection:text-white relative overflow-hidden">
      
      {/* Top Bar */}
      <header className="min-h-[56px] md:h-16 border-b border-border flex flex-wrap items-center justify-between px-3 sm:px-6 py-2 md:py-0 bg-surface backdrop-blur-md sticky top-0 z-50 gap-2">
        <div className="flex items-center gap-3 sm:gap-6 z-20 shrink-0">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors group"
          >
            <span className="text-primary group-hover:-translate-x-1 transition-transform">←</span> Hub
          </Link>
          <div className="hidden xl:block transform scale-90 origin-left">
            <DefconMeter />
          </div>
        </div>

        <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#00e6e6] animate-pulse shadow-[0_0_10px_rgba(0,230,230,0.8)]"></span>
          <h1 className="font-['Outfit'] font-bold tracking-widest text-sm text-[#00e6e6] uppercase hidden md:block">
            Agent Alpha: Quant Terminal
          </h1>
        </div>

        <div className="flex items-center gap-4 z-20 text-[10px] font-mono text-gray-500 tracking-widest uppercase">
          <span className="hidden sm:inline">RECHARTS ENGINE v4.2</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        </div>
      </header>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-border">
        <div className="p-4 border-r border-border">
          <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">S&P 500 (Simulated)</p>
          <p className="text-lg sm:text-2xl font-['Outfit'] font-black text-white">{latestSP.toLocaleString()}</p>
        </div>
        <div className="p-4 border-r border-border">
          <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">Tech Job Postings</p>
          <p className="text-lg sm:text-2xl font-['Outfit'] font-black text-[#ff6b6b]">{latestJobs.toLocaleString()}</p>
        </div>
        <div className="p-4 border-r border-border">
          <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">Retail App Downloads</p>
          <p className="text-lg sm:text-2xl font-['Outfit'] font-black text-[#00e6e6]">{latestApps.toLocaleString()}</p>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">Alpha Signal</p>
          {anomaly ? (
            <p className="text-sm font-mono text-danger font-bold animate-pulse">⚠ DIVERGENCE</p>
          ) : (
            <p className="text-sm font-mono text-primary">NOMINAL</p>
          )}
        </div>
      </div>

      {/* Anomaly Banner */}
      {anomaly && (
        <div className="w-full bg-danger/10 border-b border-danger px-6 py-3 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-danger animate-ping shrink-0" />
          <p className="font-mono text-xs text-danger tracking-widest uppercase">{anomaly}</p>
        </div>
      )}

      {/* Charts */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center font-mono text-gray-500 tracking-widest animate-pulse">
          CALIBRATING QUANT ENGINES...
        </div>
      ) : (
        <div className="flex-1 p-3 sm:p-6 lg:p-10 space-y-4 sm:space-y-8 overflow-y-auto">
          
          {/* Primary Chart: S&P 500 Price Action */}
          <div className="glass-panel p-3 sm:p-6">
            <h3 className="font-mono text-xs text-gray-500 tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e6e6]" />
              S&P 500 Index — 180-Day Trajectory
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="sp500Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e6e6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00e6e6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} interval={30} />
                <YAxis tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }}
                  labelStyle={{ color: '#888' }}
                />
                <Area type="monotone" dataKey="SP500" stroke="#00e6e6" fill="url(#sp500Grad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Secondary Chart: Alternative Data Overlay */}
          <div className="glass-panel p-6">
            <h3 className="font-mono text-xs text-gray-500 tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff6b6b]" />
              Alternative Data Overlay — Job Postings vs. App Downloads
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} interval={30} />
                <YAxis yAxisId="left" tick={{ fill: '#ff6b6b', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#00e6e6', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }}
                  labelStyle={{ color: '#888' }}
                />
                <Legend
                  wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#888', paddingTop: '10px' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="JobPostings" stroke="#ff6b6b" strokeWidth={2} dot={false} name="Tech Job Postings" />
                <Line yAxisId="right" type="monotone" dataKey="AppDownloads" stroke="#00e6e6" strokeWidth={2} dot={false} name="Retail App Downloads" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Combined Divergence Analysis */}
          <div className="glass-panel p-6">
            <h3 className="font-mono text-xs text-gray-500 tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
              Divergence Overlay — S&P 500 vs Alternative Data Composite
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="spGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e6e6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00e6e6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} interval={30} />
                <YAxis yAxisId="price" tick={{ fill: '#00e6e6', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="alt" orientation="right" tick={{ fill: '#FFD700', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }}
                  labelStyle={{ color: '#888' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#888', paddingTop: '10px' }} />
                <Area yAxisId="price" type="monotone" dataKey="SP500" stroke="#00e6e6" fill="url(#spGrad2)" strokeWidth={2} dot={false} name="S&P 500" />
                <Line yAxisId="alt" type="monotone" dataKey="AppDownloads" stroke="#FFD700" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="App Downloads (Leading)" />
                <Line yAxisId="alt" type="monotone" dataKey="JobPostings" stroke="#ff6b6b" strokeWidth={1.5} dot={false} strokeDasharray="3 3" name="Job Postings (Lagging)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Data Intelligence Table */}
          <div className="glass-panel p-3 sm:p-6">
            <h3 className="font-mono text-xs text-gray-500 tracking-widest uppercase mb-4">
              Latest 7-Day Quant Snapshot
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 uppercase tracking-widest">
                    <th className="text-left py-2 px-3">Date</th>
                    <th className="text-right py-2 px-3">S&P 500</th>
                    <th className="text-right py-2 px-3">Jobs</th>
                    <th className="text-right py-2 px-3">Apps</th>
                    <th className="text-right py-2 px-3">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(-7).map((row) => (
                    <tr key={row.date} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2 px-3 text-gray-400">{row.date}</td>
                      <td className="py-2 px-3 text-right text-[#00e6e6]">{row.SP500.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-[#ff6b6b]">{row.JobPostings.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-[#FFD700]">{row.AppDownloads.toLocaleString()}</td>
                      <td className={`py-2 px-3 text-right font-bold ${row.Sentiment === 'Euphoric' ? 'text-primary' : row.Sentiment === 'Bearish' ? 'text-danger' : 'text-gray-500'}`}>
                        {row.Sentiment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
