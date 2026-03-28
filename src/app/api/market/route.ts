import { NextResponse } from 'next/server';

// Fallback mock data if API fails to ensure it always works
const MOCK_DATA = {
  commodities: [
    { symbol: 'GOLD', name: 'Gold', price: 2350.40, changePercent: 1.2 },
    { symbol: 'SILVER', name: 'Silver', price: 31.25, changePercent: -0.5 },
    { symbol: 'NGAS', name: 'Natural Gas', price: 2.15, changePercent: 3.4 },
  ],
  stocks: [
    { symbol: 'SPY', name: 'S&P 500 ETF', price: 530.12, changePercent: 0.8 },
    { symbol: 'QQQ', name: 'Nasdaq 100', price: 460.50, changePercent: 1.1 },
    { symbol: 'LMT', name: 'Lockheed Martin', price: 475.20, changePercent: 2.3 }, // War/Industry tracker
    { symbol: 'XLE', name: 'Energy ETF', price: 92.15, changePercent: 1.5 },
  ]
};

export async function GET() {
  try {
    // Fetch live crypto data from CoinCap (Free, no key required for basic)
    const cryptoRes = await fetch('https://api.coincap.io/v2/assets?limit=10', {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    let cryptoData = [];
    if (cryptoRes.ok) {
      const json = await cryptoRes.json();
      cryptoData = json.data.map((coin: any) => ({
        symbol: coin.symbol,
        name: coin.name,
        price: parseFloat(coin.priceUsd),
        changePercent: parseFloat(coin.changePercent24Hr)
      }));
    }

    // Combine crypto with mock/static market data
    // In a full production env we'd use Alpha Vantage or Yahoo Finance here
    const marketData = {
      crypto: cryptoData.length > 0 ? cryptoData : [
        { symbol: 'BTC', name: 'Bitcoin', price: 65000, changePercent: 2.5 },
        { symbol: 'ETH', name: 'Ethereum', price: 3500, changePercent: 1.8 }
      ],
      commodities: MOCK_DATA.commodities,
      stocks: MOCK_DATA.stocks,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json({ error: 'Failed to fetch market data', fallback: MOCK_DATA }, { status: 500 });
  }
}
