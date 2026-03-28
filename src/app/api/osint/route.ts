import { NextResponse } from 'next/server';

// Interface for maritime simulation nodes
interface Vessel {
  id: string;
  name: string;
  type: string;
  start: [number, number];
  end: [number, number];
}

// Pre-defined static global shipping arteries (Long, Lat)
const GLOBAL_VESSELS: Vessel[] = [
  { id: 'SHP-01', name: 'MSC GULSUN (Cargo)', type: 'Logistics', start: [114.1, 22.3], end: [-118.2, 33.7] }, // HK to LA
  { id: 'SHP-02', name: 'USS GERALD FORD (CVN-78)', type: 'Military', start: [14.5, 35.9], end: [34.7, 31.9] }, // Med Sea
  { id: 'SHP-03', name: 'EVER GIVEN (Cargo)', type: 'Logistics', start: [32.3, 29.9], end: [4.4, 51.9] }, // Suez to Rotterdam
  { id: 'SHP-04', name: 'FRONT ALTAIR (Tanker)', type: 'Energy', start: [55.3, 25.2], end: [121.5, 31.2] }, // Dubai to Shanghai
  { id: 'SHP-05', name: 'UK HMS QUEEN ELIZABETH', type: 'Military', start: [115.0, 15.0], end: [125.0, 20.0] }, // South China Sea
];

// Helper to simulate smooth movement based on time of day mapping to a 24-hour cycle
function calculateShipPosition(vessel: Vessel, progress: number): [number, number] {
  // progress between 0 and 1
  const lng = vessel.start[0] + (vessel.end[0] - vessel.start[0]) * progress;
  const lat = vessel.start[1] + (vessel.end[1] - vessel.start[1]) * progress;
  return [lng, lat];
}

export async function GET() {
  try {
    // 1. Fetch live OpenSky Aviation Data
    // We restrict to a massive bounding box covering Europe, Med, and Middle East to ensure high density of OSINT target flights while preventing massive payloads.
    const lamin = 25.0, lomin = -10.0, lamax = 55.0, lomax = 55.0;
    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
    
    let aviation = [];
    try {
      const flightRes = await fetch(url, { next: { revalidate: 30 } }); // Cache for 30 seconds
      const flightData = await flightRes.json();
      
      if (flightData && flightData.states) {
        // Map raw arrays to object structure, filter flights heavily to fake "recon" or critical flights
        aviation = flightData.states
          .filter((state: any[]) => state[5] && state[6] && state[7] && state[7] > 5000) // Must have coords and be airborne > 5000ft
          .slice(0, 50) // Extract top 50 active flights dynamically
          .map((state: any[]) => ({
            id: state[0],
            callsign: (state[1] || 'UNKNOWN').trim(),
            country: state[2],
            lng: state[5],
            lat: state[6],
            altitude: state[7],
            velocity: state[9], // m/s
            heading: state[10]
          }));
      }
    } catch (err) {
      console.warn("OpenSky fetch failed, defaulting to empty aviation layer.", err);
    }

    // 2. Simulate Maritime Logistics Vectors
    // Use the current minute of the hour (0-59) and map it into a generic progress loop for vessels.
    const now = new Date();
    // A single loop equals 60 minutes.
    const progress = (now.getMinutes() * 60 + now.getSeconds()) / 3600;
    
    const maritime = GLOBAL_VESSELS.map(v => {
      // Create a cyclic ping-pong progress 0->1->0
      const cyclicProgress = progress <= 0.5 ? progress * 2 : (1 - progress) * 2;
      return {
        id: v.id,
        name: v.name,
        type: v.type,
        coordinates: calculateShipPosition(v, cyclicProgress)
      };
    });

    return NextResponse.json({ aviation, maritime });

  } catch (error) {
    console.error('OSINT Pipeline execution failure:', error);
    return NextResponse.json({ error: 'Failed to aggregate OSINT data.' }, { status: 500 });
  }
}
