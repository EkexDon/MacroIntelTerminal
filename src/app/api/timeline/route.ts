import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { extractCoordinates } from '@/lib/geoCoder';

const parser = new Parser();

const RSS_SOURCES = [
  'http://feeds.bbci.co.uk/news/world/rss.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',
  'https://cointelegraph.com/rss',
  'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://www.theguardian.com/world/rss',
  'https://techcrunch.com/feed/'
];

interface TimelineEvent {
  title: string;
  source: string;
  category: string;
  pubDate: string;
  coordinates: [number, number] | null;
}

interface TimelineDay {
  date: string;          // YYYY-MM-DD
  dayLabel: string;      // "Mon", "Tue", etc
  dateLabel: string;     // "Mar 28"
  eventCount: number;
  dominantCategory: string;
  sentimentTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  topEvents: TimelineEvent[];
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'War/Politics': ['war', 'conflict', 'military', 'politics', 'troops', 'strike', 'attack', 'missile', 'army', 'defense'],
  'Crypto': ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'token', 'defi'],
  'Markets': ['stock', 'market', 'etf', 'trading', 'wall street', 'hedge', 'investor'],
  'Commodities': ['oil', 'gold', 'silver', 'gas', 'crude', 'commodity'],
  'Tech': ['ai', 'artificial intelligence', 'chip', 'semiconductor', 'tech', 'software'],
};

function categorize(text: string): string {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return 'Global';
}

export async function GET() {
  try {
    // Fetch all RSS feeds in parallel
    const feedPromises = RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source);
        return { title: feed.title || 'Unknown', items: feed.items };
      } catch {
        return { title: 'Unknown', items: [] };
      }
    });

    const feeds = await Promise.all(feedPromises);

    // Flatten all items and assign dates
    const allEvents: (TimelineEvent & { dateKey: string })[] = [];

    for (const feed of feeds) {
      for (const item of feed.items) {
        const pubDate = item.pubDate ? new Date(item.pubDate) : null;
        if (!pubDate || isNaN(pubDate.getTime())) continue;

        // Only include events from the last 7 days
        const now = new Date();
        const diffDays = (now.getTime() - pubDate.getTime()) / (86400000);
        if (diffDays > 7) continue;

        const titleAndDesc = `${item.title || ''} ${item.contentSnippet || ''}`;
        const dateKey = pubDate.toISOString().split('T')[0];

        allEvents.push({
          title: item.title || 'Untitled',
          source: feed.title || 'Unknown',
          category: categorize(titleAndDesc),
          pubDate: pubDate.toISOString(),
          coordinates: extractCoordinates(titleAndDesc),
          dateKey
        });
      }
    }

    // Group by day
    const dayMap = new Map<string, typeof allEvents>();
    for (const event of allEvents) {
      const existing = dayMap.get(event.dateKey) || [];
      existing.push(event);
      dayMap.set(event.dateKey, existing);
    }

    // Build 7-day timeline (always show 7 days, even if some are empty)
    const timeline: TimelineDay[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const events = dayMap.get(dateKey) || [];

      // Find dominant category
      const catCounts: Record<string, number> = {};
      events.forEach(e => {
        catCounts[e.category] = (catCounts[e.category] || 0) + 1;
      });
      const dominantCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Global';

      // Simple sentiment heuristic based on category mix
      const warCount = catCounts['War/Politics'] || 0;
      const ratio = events.length > 0 ? warCount / events.length : 0;
      const sentimentTrend = ratio > 0.5 ? 'BEARISH' : ratio > 0.25 ? 'NEUTRAL' : 'BULLISH';

      // Top 5 events for this day (prioritize War, then Markets, then everything else)
      const sorted = [...events].sort((a, b) => {
        const priority: Record<string, number> = { 'War/Politics': 4, 'Commodities': 3, 'Markets': 2, 'Crypto': 1 };
        return (priority[b.category] || 0) - (priority[a.category] || 0);
      });

      timeline.push({
        date: dateKey,
        dayLabel: dayNames[d.getDay()],
        dateLabel: `${monthNames[d.getMonth()]} ${d.getDate()}`,
        eventCount: events.length,
        dominantCategory,
        sentimentTrend,
        topEvents: sorted.slice(0, 5).map(({ dateKey: _, ...rest }) => rest),
      });
    }

    return NextResponse.json({ timeline });

  } catch (error) {
    console.error('Timeline generation failed:', error);
    return NextResponse.json({ error: 'Timeline offline' }, { status: 500 });
  }
}
