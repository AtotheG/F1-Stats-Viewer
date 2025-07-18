import { NextResponse } from 'next/server';

function lastTenYears(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current; y >= current - 9; y--) {
    years.push(y);
  }
  return years;
}

export async function GET() {
  const years = lastTenYears();
  try {
    const res = await fetch('https://ergast.com/api/f1/seasons.json?limit=1000');
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch seasons' }, { status: 502 });
    }
    const data = await res.json();
    const all: number[] = data?.MRData?.SeasonTable?.Seasons?.map((s: any) => parseInt(s.season)) || [];
    const filtered = all.filter((s) => years.includes(s)).sort((a, b) => b - a);
    return NextResponse.json(filtered);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
