import { NextResponse } from 'next/server';

// Agent Alpha mathematical generation:
// Simulates 6 months of daily data tracking S&P 500 against two major Alternative Datasets
// 1. Tech Sector Job Postings (Leading indicator)
// 2. Retail App Downloads (Vanguard/Coinbase/Trading apps as retail metric)

export async function GET() {
  const data = [];
  const days = 180;
  
  let sp500 = 5000;
  let jobPostings = 12000;
  let appDownloads = 80000;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate macro market movements with correlated alt-data
    const marketMood = Math.random() - 0.48; // Slight upward bias
    
    // App downloads are a hyper-volatile leading indicator for market peaks
    appDownloads += (marketMood * 5000) + (Math.random() * 4000 - 2000);
    
    // Job postings are a slow-moving lagging indicator of economic health
    jobPostings += (marketMood * 200) + (Math.random() * 100 - 50);
    
    // S&P follows jobs loosely, and app downloads tightly
    sp500 += (marketMood * 40) + ((appDownloads - 80000) * 0.0005) + (Math.random() * 10 - 5);

    data.push({
      date: date.toISOString().split('T')[0],
      SP500: Math.round(sp500),
      JobPostings: Math.round(jobPostings),
      AppDownloads: Math.round(appDownloads),
      Sentiment: sp500 > 5100 ? 'Euphoric' : (sp500 < 4900 ? 'Bearish' : 'Neutral')
    });
  }

  // Inject a recent massive anomaly into the alternative data
  data[data.length - 1].AppDownloads += 25000; // "Alpha Spike"
  data[data.length - 1].JobPostings -= 500; // Hiring freeze anomaly

  return NextResponse.json({
    metrics: data,
    anomalyDetected: true,
    alphaTarget: "DIVERGENCE: Mass retail entry + Corporate Hiring Freeze == Incoming Crash"
  });
}
