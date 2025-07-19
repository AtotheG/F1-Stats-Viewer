'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface LapData {
  lap: number;
  driver: string;
  time: number;
}

export default function TrackEvolution({ data }: { data: LapData[] }) {
  if (!data || data.length === 0) return null;
  const grouped: Record<number, { sum: number; count: number }> = {};
  data.forEach(({ lap, time }) => {
    if (!grouped[lap]) grouped[lap] = { sum: 0, count: 0 };
    grouped[lap].sum += time;
    grouped[lap].count += 1;
  });
  const chartData = Object.keys(grouped)
    .map((lap) => {
      const key = Number(lap);
      const { sum, count } = grouped[key];
      return { lap: key, time: sum / count };
    })
    .sort((a, b) => a.lap - b.lap);

  return (
    <ResponsiveContainer width="100%" height={300} data-testid="evolution-chart">
      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis dataKey="lap" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="time" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
}
