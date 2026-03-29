import { NextResponse } from 'next/server';

const VIPS = ['Elon Musk', 'Tim Cook', 'Gary Gensler', 'Jerome Powell', 'Larry Fink'];

const CONVERGENCE_POINTS = [
  { name: 'Riyadh (FII Institute)', coords: [46.7, 24.7] },
  { name: 'Geneva (WEF)', coords: [6.1, 46.2] },
  { name: 'Singapore (MAS)', coords: [103.8, 1.3] },
  { name: 'Jackson Hole (Fed)', coords: [-110.7, 43.5] }
];

export async function GET() {
  // 5% statistical probability that 3 critical figures secretly meet, triggering a massive corporate action warning
  const isConvergence = Math.random() < 0.05; 
  
  const target = isConvergence 
    ? CONVERGENCE_POINTS[Math.floor(Math.random() * CONVERGENCE_POINTS.length)]
    : null;

  let meetingAttendees: string[] = [];
  if (isConvergence) {
    meetingAttendees = [...VIPS].sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  const data = VIPS.map(vip => {
    if (isConvergence && meetingAttendees.includes(vip)) {
      // Add slight jitter so they physically appear adjacent but not overlapping on the SVG map (10-20km variation)
      return {
        id: vip,
        name: vip,
        lng: target!.coords[0] + (Math.random() * 0.2 - 0.1),
        lat: target!.coords[1] + (Math.random() * 0.2 - 0.1),
        status: 'LANDED'
      };
    }
    // Normal routing: simulate realistic long-haul flight paths across the globe
    return {
      id: vip,
      name: vip,
      lng: Math.random() * 360 - 180,
      lat: Math.random() * 180 - 90,
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
