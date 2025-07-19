'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface LapData {
  lap: number;
  driver: string;
  time: number;
}

export default function PositionsWaterfall({ data }: { data: LapData[] }) {
  if (!data || data.length === 0) return null;

  const driver = data[0].driver;
  const laps: Record<number, LapData[]> = {};
  data.forEach((d) => {
    if (!laps[d.lap]) laps[d.lap] = [];
    laps[d.lap].push(d);
  });
  const chart = Object.keys(laps)
    .map((lap) => {
      const entries = laps[Number(lap)].sort((a, b) => a.time - b.time);
      const pos = entries.findIndex((l) => l.driver === driver) + 1;
      return { lap: Number(lap), position: pos };
    })
    .sort((a, b) => a.lap - b.lap);

  return (
    <ResponsiveContainer width="100%" height={300} data-testid="waterfall-chart">
      <LineChart data={chart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis dataKey="lap" />
        <YAxis reversed allowDecimals={false} />
        <Tooltip />
        <Line type="stepAfter" dataKey="position" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
