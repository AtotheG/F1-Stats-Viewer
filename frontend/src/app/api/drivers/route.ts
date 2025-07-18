import { NextResponse } from 'next/server';

function lastTenYears(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current; y >= current - 9; y--) {
    years.push(y);
  }
  return years;
}

async function fetchDrivers(year: number) {
  const res = await fetch(`https://ergast.com/api/f1/${year}/drivers.json?limit=1000`);
  if (!res.ok) throw new Error(`Failed fetching ${year} drivers`);
  const data = await res.json();
  return data?.MRData?.DriverTable?.Drivers || [];
}

export async function GET() {
  const years = lastTenYears();
  const map: Record<string, any> = {};
  try {
    for (const y of years) {
      const drivers = await fetchDrivers(y);
      for (const d of drivers) {
        if (!map[d.driverId]) {
          map[d.driverId] = d;
        }
      }
    }
    return NextResponse.json(Object.values(map));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
