'use client';

import { useState, useEffect, useRef } from 'react';

interface TimelineEvent {
  title: string;
  source: string;
  category: string;
  pubDate: string;
}

interface TimelineDay {
  date: string;
  dayLabel: string;
  dateLabel: string;
  eventCount: number;
  dominantCategory: string;
  sentimentTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  topEvents: TimelineEvent[];
}

const categoryColors: Record<string, string> = {
  'War/Politics': '#ff0033',
  'Crypto': '#FFD700',
  'Markets': '#00e6e6',
  'Commodities': '#ff9900',
  'Tech': '#a855f7',
  'Global': '#00ff88',
};

const sentimentIcons: Record<string, string> = {
  'BULLISH': '▲',
  'BEARISH': '▼',
  'NEUTRAL': '◆',
};

export default function IntelTimeline() {
  const [timeline, setTimeline] = useState<TimelineDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch('/api/timeline');
        const json = await res.json();
        if (json.timeline) {
          setTimeline(json.timeline);
          // Auto-select today
          if (json.timeline.length > 0) {
            setActiveDay(json.timeline[json.timeline.length - 1].date);
          }
        }
      } catch (e) {
        console.error('Timeline offline', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
    // Refresh every 15 minutes
    const interval = setInterval(fetchTimeline, 900000);
    return () => clearInterval(interval);
  }, []);

  const selectedDay = timeline.find(d => d.date === activeDay);

  // Find max event count for bar scaling
  const maxEvents = Math.max(...timeline.map(d => d.eventCount), 1);

  if (loading) {
    return (
      <div className="glass-panel p-6 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-56 mb-4" />
        <div className="flex gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-24 h-28 bg-white/5 rounded shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (timeline.length === 0) return null;

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          7-Day Intelligence Timeline
        </h3>
        <span className="text-[9px] font-mono text-gray-600 tracking-widest">
          {timeline[0]?.dateLabel} — {timeline[timeline.length - 1]?.dateLabel}
        </span>
      </div>

      {/* Horizontal Scrollable Timeline */}
      <div className="relative px-5 py-5">
        {/* Connection Line */}
        <div className="absolute left-8 right-8 top-[4.5rem] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide relative z-10"
          style={{ scrollbarWidth: 'none' }}
        >
          {timeline.map((day) => {
            const isActive = activeDay === day.date;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            const color = categoryColors[day.dominantCategory] || '#00ff88';
            const barHeight = Math.max(12, (day.eventCount / maxEvents) * 48);

            return (
              <button
                key={day.date}
                onClick={() => setActiveDay(isActive ? null : day.date)}
                className={`
                  relative flex flex-col items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-300 shrink-0 min-w-[5.5rem] cursor-pointer select-none
                  ${isActive 
                    ? 'bg-white/5 border-white/20 scale-105' 
                    : 'bg-transparent border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                  }
                  ${isToday ? 'ring-1 ring-primary/30' : ''}
                `}
              >
                {/* Day Name */}
                <span className={`text-[10px] font-mono tracking-widest uppercase ${isToday ? 'text-primary font-bold' : 'text-gray-500'}`}>
                  {isToday ? 'TODAY' : day.dayLabel}
                </span>

                {/* Activity Bar */}
                <div className="w-6 flex flex-col items-center justify-end h-12">
                  <div
                    className="w-full rounded-sm transition-all duration-500"
                    style={{
                      height: `${barHeight}px`,
                      background: `linear-gradient(to top, ${color}40, ${color}15)`,
                      border: `1px solid ${color}30`,
                      boxShadow: isActive ? `0 0 12px ${color}30` : 'none'
                    }}
                  />
                </div>

                {/* Node Dot */}
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive ? 'scale-125' : ''}`}
                  style={{
                    background: day.eventCount > 0 ? color : 'transparent',
                    borderColor: color,
                    boxShadow: isActive ? `0 0 10px ${color}80` : 'none'
                  }}
                />

                {/* Date */}
                <span className="text-[10px] font-mono text-gray-500">
                  {day.dateLabel}
                </span>

                {/* Event Count Badge */}
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{ color, background: `${color}15`, border: `1px solid ${color}20` }}
                >
                  {day.eventCount}
                </span>

                {/* Sentiment Arrow */}
                <span className={`text-[10px] ${
                  day.sentimentTrend === 'BULLISH' ? 'text-primary' :
                  day.sentimentTrend === 'BEARISH' ? 'text-danger' : 'text-gray-500'
                }`}>
                  {sentimentIcons[day.sentimentTrend]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Day Detail Panel */}
      {selectedDay && selectedDay.topEvents.length > 0 && (
        <div className="border-t border-white/5 px-5 py-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-widest uppercase"
              style={{
                color: categoryColors[selectedDay.dominantCategory],
                background: `${categoryColors[selectedDay.dominantCategory]}15`,
                border: `1px solid ${categoryColors[selectedDay.dominantCategory]}30`
              }}
            >
              {selectedDay.dominantCategory}
            </span>
            <span className="text-[10px] font-mono text-gray-500 tracking-widest">
              {selectedDay.dateLabel} — {selectedDay.eventCount} EVENTS LOGGED
            </span>
          </div>

          <div className="space-y-2">
            {selectedDay.topEvents.map((event, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-2 px-3 rounded bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: categoryColors[event.category] || '#00ff88' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 font-mono leading-relaxed line-clamp-2">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-mono text-gray-600 uppercase">{event.source}</span>
                    <span
                      className="text-[9px] font-mono uppercase font-bold"
                      style={{ color: categoryColors[event.category] }}
                    >
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
