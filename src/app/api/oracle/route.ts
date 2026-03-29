import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Top 10 Active Global Polymarket Events
    const res = await fetch('https://gamma-api.polymarket.com/events?active=true&closed=false&limit=15', {
       next: { revalidate: 60 },
       headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) throw new Error("Polymarket Oracle Offline");
    
    const data = await res.json();
    
    // Parse out the most heavily traded active markets
    const markets = data.slice(0, 5).map((e: any) => {
       const primaryMarket = e.markets?.[0];
       let yesProb = 0;
       
       if (primaryMarket && primaryMarket.outcomePrices) {
         try {
           const prices = JSON.parse(primaryMarket.outcomePrices);
           // prices[0] is typically outcome of index "Yes"
           yesProb = Math.round(parseFloat(prices[0]) * 100);
         } catch(err) {
            console.error(err);
         }
       }
       
       return {
         id: e.id,
         title: e.title,
         yesProbability: yesProb,
         volume: primaryMarket?.volume || 0,
         endDate: e.endDate
       };
    }).sort((a: any, b: any) => b.volume - a.volume); // Sort by highest bet volume

    return NextResponse.json({ markets });
  } catch (error) {
    console.error('Oracle fetch error:', error);
    return NextResponse.json({ error: 'Failed to access prediction oracle' }, { status: 500 });
  }
}
