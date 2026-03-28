import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Force aggressive zero-cache or short revalidation for real-time intel
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson', { 
      next: { revalidate: 60 },
      headers: { 'User-Agent': 'MacroIntelTerminal/1.0' }
    });
    
    const data = await res.json();
    
    if (!data.features) {
      throw new Error("Invalid USGS payload format");
    }

    // Extract top 50 highly energetic tectonic anomalies
    const anomalies = data.features.slice(0, 50).map((f: any) => ({
      id: f.id,
      mag: f.properties.mag,
      place: f.properties.place,
      time: f.properties.time,
      url: f.properties.url,
      // USGS provides [longitude, latitude, depth], we only need lon/lat for the 2D SVG Engine
      coordinates: f.geometry.coordinates.slice(0, 2) 
    }));

    // Sort by magnitude, highest first
    anomalies.sort((a: any, b: any) => b.mag - a.mag);

    return NextResponse.json({ anomalies });
  } catch (error) {
    console.error('Seismic fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch seismic anomalies' }, { status: 500 });
  }
}
