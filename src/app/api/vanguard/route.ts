import { NextResponse } from 'next/server';

const VIPS = [
  { name: 'Elon Musk',    baseLng: -95.4,  baseLat: 29.7  },  // Austin/Houston
  { name: 'Tim Cook',     baseLng: -122.0, baseLat: 37.3  },  // Cupertino
  { name: 'Gary Gensler', baseLng: -77.0,  baseLat: 38.9  },  // Washington DC
  { name: 'Jerome Powell', baseLng: -77.0, baseLat: 38.9  },  // Washington DC
  { name: 'Larry Fink',   baseLng: -74.0,  baseLat: 40.7  },  // New York
];

const CONVERGENCE_POINTS = [
  { name: 'Riyadh (FII Institute)', coords: [46.7, 24.7] },
  { name: 'Geneva (WEF)', coords: [6.1, 46.2] },
  { name: 'Singapore (MAS)', coords: [103.8, 1.3] },
  { name: 'Jackson Hole (Fed)', coords: [-110.7, 43.5] }
];

// Deterministic position: VIPs drift slowly from their base using the current hour as seed
// This prevents teleportation between polls
function getDriftedPosition(baseLng: number, baseLat: number, seed: number) {
  const hourSeed = Math.floor(Date.now() / 3600000); // changes once per hour
  const drift = Math.sin(hourSeed * seed) * 15; // max 15 degrees drift
  const driftLat = Math.cos(hourSeed * seed * 1.3) * 8; // max 8 degrees drift
  return {
    lng: Math.max(-170, Math.min(170, baseLng + drift)),
    lat: Math.max(-60, Math.min(70, baseLat + driftLat))
  };
}

export async function GET() {
  // 2% probability per call — with 60s polling this means roughly once every ~50 minutes
  const isConvergence = Math.random() < 0.02;
  
  const target = isConvergence 
    ? CONVERGENCE_POINTS[Math.floor(Math.random() * CONVERGENCE_POINTS.length)]
    : null;

  let meetingAttendees: string[] = [];
  if (isConvergence) {
    meetingAttendees = VIPS.map(v => v.name).sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  const data = VIPS.map((vip, idx) => {
    if (isConvergence && meetingAttendees.includes(vip.name)) {
      return {
        id: vip.name,
        name: vip.name,
        lng: target!.coords[0] + (Math.random() * 0.3 - 0.15),
        lat: target!.coords[1] + (Math.random() * 0.3 - 0.15),
        status: 'LANDED'
      };
    }
    // Deterministic drift from home base — positions are stable between polls
    const pos = getDriftedPosition(vip.baseLng, vip.baseLat, idx + 1);
    return {
      id: vip.name,
      name: vip.name,
      lng: pos.lng,
      lat: pos.lat,
      status: 'AIRBORNE'
    };
  });

  return NextResponse.json({
    vips: data,
    convergenceDetails: isConvergence ? {
      location: target!.name,
      attendees: meetingAttendees,
      timestamp: Date.now()
    } : null
  });
}
