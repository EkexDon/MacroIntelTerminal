'use client';

import { useState, useCallback, useEffect } from "react";
import Ticker from "@/components/Ticker";
import NewsFeed from "@/components/NewsFeed";
import IndustryTracker from "@/components/IndustryTracker";
import MacroIndicators from "@/components/MacroIndicators";
import ThemeToggle from "@/components/ThemeToggle";
import GeopoliticalMap from "@/components/GeopoliticalMap";
import KeywordAlerts from "@/components/KeywordAlerts";
import TopNewsBanner from "@/components/TopNewsBanner";

export default function Home() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [alertOverlay, setAlertOverlay] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('macro_intel_keywords');
    if (saved) {
      try {
        setKeywords(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSetKeywords = useCallback((newKeywords: string[]) => {
    setKeywords(newKeywords);
    localStorage.setItem('macro_intel_keywords', JSON.stringify(newKeywords));
  }, []);

  const handleSonarAlert = useCallback(() => {
    // Generate synthesized sonar beep via Web Audio API
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.error("Audio API failed", e);
    }

    // Trigger full screen visual flash
    setAlertOverlay(true);
    setTimeout(() => {
      setAlertOverlay(false);
    }, 2000);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-['Inter'] selection:bg-primary/30 selection:text-white transition-colors duration-500 relative">
      
      {/* Sonar Flash Overlay */}
      <div 
        className={`fixed inset-0 bg-danger pointer-events-none z-[100] transition-opacity duration-1000 mix-blend-overlay ${alertOverlay ? 'opacity-30' : 'opacity-0'}`} 
      />

      {/* Top Navigation / Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.3)]">
            <span className="font-['Outfit'] font-bold text-black text-xl">M</span>
          </div>
          <h1 className="font-['Outfit'] font-bold tracking-widest text-lg uppercase hidden sm:block">
            Macro Intel <span className="text-gray-500">Terminal</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-gray-400">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.5)]"></span>
            SYS: ONLINE
          </div>
          <div className="hidden sm:block px-3 py-1 rounded bg-black/50 border border-white/10 text-white cursor-pointer hover:border-primary/50 transition-colors">
            Connect Wallet
          </div>
        </div>
      </header>

      {/* Live Market Ticker */}
      <Ticker />

      {/* Main Dashboard Grid */}
      <div className="flex-1 p-6 lg:p-10 max-w-[1800px] mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-3xl font-['Outfit'] font-bold uppercase tracking-wider text-white">
            Global Directives
          </h2>
          <p className="text-gray-400 font-mono mt-2 text-sm max-w-2xl">
            Real-time aggregation of geopolitical events, crypto market movements, and industrial capital flows. Noise filtered. Essential intelligence only.
          </p>
        </div>

        <TopNewsBanner />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: News Feed */}
          <div className="lg:col-span-9">
            <NewsFeed keywords={keywords} onAlert={handleSonarAlert} />
          </div>

          {/* Right Column: Trackers */}
          <div className="lg:col-span-3 space-y-6">
            <GeopoliticalMap />
            <KeywordAlerts keywords={keywords} setKeywords={handleSetKeywords} />
            <MacroIndicators />
            <IndustryTracker />

            <div className="glass-panel p-6">
              <h3 className="text-lg font-['Outfit'] font-bold tracking-wider text-gradient uppercase mb-4">
                System Status
              </h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-500">API Connection</span>
                  <span className="text-primary">SECURE</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-500">NLP Filtering</span>
                  <span className="text-primary">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-gray-500">Latency</span>
                  <span className="text-gray-300">24ms</span>
                </div>
              </div>
            </div>
            
             <div className="glass-panel p-6 bg-primary/5 border-primary/20">
              <h3 className="text-sm font-['Outfit'] font-bold tracking-wider text-primary uppercase mb-2">
                Executive Summary
              </h3>
              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                Market volatility remains elevated due to geopolitical friction. Crypto assets show decoupling from traditional equities. Capital is flowing rapidly into defense and energy sectors while exiting high-risk tech ventures. Monitor critical live feeds closely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded API Uplinks Footer */}
      <footer className="border-t border-border mt-auto p-6 bg-surface/50">
        <div className="max-w-[1800px] mx-auto flex flex-wrap justify-center gap-8 text-[10px] font-mono tracking-widest uppercase text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse"></span> CoinCap API (Crypto)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse"></span> BBC World (RSS)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse"></span> Al Jazeera (RSS)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse"></span> CNBC Markets (RSS)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-warning/70 animate-pulse"></span> Algo Intel Proxy (Commodities/Stocks)
          </span>
        </div>
      </footer>
    </main>
  );
}
