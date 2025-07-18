import { NextResponse } from 'next/server';

function lastTenYears(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current; y >= current - 9; y--) {
    years.push(y);
  }
  return years;
}

async function fetchConstructors(year: number) {
  const res = await fetch(`https://ergast.com/api/f1/${year}/constructors.json?limit=1000`);
  if (!res.ok) throw new Error(`Failed fetching ${year} constructors`);
  const data = await res.json();
  return data?.MRData?.ConstructorTable?.Constructors || [];
}

export async function GET() {
  const years = lastTenYears();
  const map: Record<string, any> = {};
  try {
    for (const y of years) {
      const constructors = await fetchConstructors(y);
      for (const c of constructors) {
        if (!map[c.constructorId]) {
          map[c.constructorId] = c; // keep latest name by processing years desc
        }
      }
    }
    return NextResponse.json(Object.values(map));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
