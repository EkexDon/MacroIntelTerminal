import { NextResponse } from 'next/server';
import { analyzeSentiment, generateBriefing } from '@/lib/aiAnalyst';

export async function GET(request: Request) {
  try {
    // ──── PARALLEL DATA ACQUISITION ────────────────────────────
    const [newsRes, cryptoRes, seismicRes] = await Promise.allSettled([
      fetch(new URL('/api/news', request.url)),
      fetch(new URL('/api/market', request.url)),
      fetch(new URL('/api/seismic', request.url)),
    ]);

    // ──── NEWS INTELLIGENCE ────────────────────────────────────
    let topHeadlines: { title: string; category: string; sentiment: string }[] = [];
    let globalSentimentAvg = 50;
    let briefingSentences: string[] = [];
    let dominantCategory = 'Global';

    if (newsRes.status === 'fulfilled') {
      const newsJson = await newsRes.value.json();
      const news = newsJson.news || [];

      // Top 5 headlines
      topHeadlines = news.slice(0, 5).map((n: any) => ({
        title: n.title,
        category: n.category || 'Global',
        sentiment: n.sentiment?.label || 'NEUTRAL'
      }));

      // Calculate aggregate market sentiment across ALL articles
      const sentiments = news
        .filter((n: any) => n.sentiment?.score)
        .map((n: any) => n.sentiment.score);
      
      if (sentiments.length > 0) {
        globalSentimentAvg = Math.round(
          sentiments.reduce((a: number, b: number) => a + b, 0) / sentiments.length
        );
      }

      // Category distribution to find dominant threat vector
      const catCounts: Record<string, number> = {};
      news.forEach((n: any) => {
        const cat = n.category || 'Global';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });
      dominantCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Global';

      // Use existing TF-IDF briefing engine
      if (newsJson.briefing && newsJson.briefing.length > 0) {
        briefingSentences = newsJson.briefing.slice(0, 5);
      }
    }

    // ──── CRYPTO MOMENTUM ──────────────────────────────────────
    let cryptoMomentum = { btc: 0, eth: 0, trend: 'STABLE' };

    if (cryptoRes.status === 'fulfilled') {
      const cryptoJson = await cryptoRes.value.json();
      const assets = cryptoJson.assets || [];
      
      const btc = assets.find((a: any) => a.symbol === 'BTC');
      const eth = assets.find((a: any) => a.symbol === 'ETH');
      
      const btcChange = btc ? parseFloat(btc.changePercent24Hr || '0') : 0;
      const ethChange = eth ? parseFloat(eth.changePercent24Hr || '0') : 0;
      
      cryptoMomentum = {
        btc: Math.round(btcChange * 100) / 100,
        eth: Math.round(ethChange * 100) / 100,
        trend: btcChange > 3 ? 'EUPHORIC RALLY' :
               btcChange > 0 ? 'BULLISH' :
               btcChange > -3 ? 'BEARISH' : 'CAPITULATION'
      };
    }

    // ──── SEISMIC THREAT LEVEL ─────────────────────────────────
    let seismicThreat = { count: 0, maxMag: 0, active: false };

    if (seismicRes.status === 'fulfilled') {
      const seismicJson = await seismicRes.value.json();
      const quakes = seismicJson.anomalies || [];
      
      const significant = quakes.filter((q: any) => q.mag >= 4.5);
      const maxMag = significant.length > 0 
        ? Math.max(...significant.map((q: any) => q.mag)) 
        : 0;
      
      seismicThreat = {
        count: significant.length,
        maxMag: Math.round(maxMag * 10) / 10,
        active: significant.length > 0
      };
    }

    // ──── DEFCON ESTIMATION ────────────────────────────────────
    let estimatedDefcon = 5;
    let threatScore = 0;
    
    // Bearish sentiment pushes threat up
    if (globalSentimentAvg < 40) threatScore += 20;
    if (globalSentimentAvg < 25) threatScore += 20;
    
    // War-heavy news cycle
    if (dominantCategory === 'War/Politics') threatScore += 25;
    
    // Seismic instability
    if (seismicThreat.maxMag >= 6.0) threatScore += 20;
    if (seismicThreat.maxMag >= 7.0) threatScore += 20;
    
    // Crypto panic
    if (cryptoMomentum.btc < -5) threatScore += 15;

    if (threatScore >= 70) estimatedDefcon = 1;
    else if (threatScore >= 50) estimatedDefcon = 2;
    else if (threatScore >= 35) estimatedDefcon = 3;
    else if (threatScore >= 15) estimatedDefcon = 4;

    // ──── GENERATE BRIEFING HEADLINE ───────────────────────────
    const sentimentLabel = globalSentimentAvg >= 60 ? 'BULLISH' :
                           globalSentimentAvg <= 35 ? 'BEARISH' : 'NEUTRAL';
    
    const briefingDate = new Date().toISOString().split('T')[0];
    const briefingHour = new Date().getUTCHours().toString().padStart(2, '0') + ':00 UTC';

    return NextResponse.json({
      timestamp: briefingDate,
      generatedAt: briefingHour,
      estimatedDefcon,
      globalSentiment: {
        score: globalSentimentAvg,
        label: sentimentLabel,
      },
      dominantThreatVector: dominantCategory,
      topHeadlines,
      tfidfBriefing: briefingSentences,
      cryptoMomentum,
      seismicThreat,
      executiveSummary: generateExecutiveSummary(
        sentimentLabel, dominantCategory, cryptoMomentum.trend, 
        seismicThreat.active, estimatedDefcon
      )
    });

  } catch (error) {
    console.error('Cortex briefing generation failed:', error);
    return NextResponse.json({ error: 'Cortex offline' }, { status: 500 });
  }
}

function generateExecutiveSummary(
  sentiment: string, dominantCat: string, cryptoTrend: string, 
  seismicActive: boolean, defcon: number
): string {
  const parts: string[] = [];

  // Opening
  if (defcon <= 2) {
    parts.push('CRITICAL ALERT: Global threat assessment is at an elevated state.');
  } else {
    parts.push('Global operating environment remains within monitored parameters.');
  }

  // Sentiment
  if (sentiment === 'BEARISH') {
    parts.push('Aggregate news sentiment across all sources is trending negative, indicating macro uncertainty.');
  } else if (sentiment === 'BULLISH') {
    parts.push('Market-facing intelligence signals are predominantly optimistic. Risk appetite is elevated.');
  }

  // Dominant category
  if (dominantCat === 'War/Politics') {
    parts.push('The dominant intelligence vector is WAR/POLITICS. Military and geopolitical events are dominating the global feed.');
  } else if (dominantCat === 'Crypto') {
    parts.push('Digital asset movements are dominating the global intelligence cycle.');
  } else if (dominantCat === 'Markets') {
    parts.push('Traditional equity markets are the primary focus of global attention.');
  }

  // Crypto
  if (cryptoTrend === 'CAPITULATION' || cryptoTrend === 'BEARISH') {
    parts.push('Crypto momentum: BTC is under pressure. Monitor for contagion into traditional risk assets.');
  } else if (cryptoTrend === 'EUPHORIC RALLY') {
    parts.push('Crypto momentum: BTC is surging with euphoric momentum. Retail participation is likely peaking.');
  }

  // Seismic
  if (seismicActive) {
    parts.push('Tectonic activity has been detected. Evaluate proximity to critical supply chain chokepoints.');
  }

  return parts.join(' ');
}
