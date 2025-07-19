'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface LapData {
  lap: number;
  driver: string;
}

export default function StrategyGantt({ data }: { data: LapData[] }) {
  if (!data || data.length === 0) return null;
  const lapsByDriver: Record<string, number> = {};
  data.forEach((d) => {
    lapsByDriver[d.driver] = Math.max(lapsByDriver[d.driver] || 0, d.lap);
  });
  const chartData = Object.entries(lapsByDriver).map(([driver, laps]) => ({ driver, laps }));

  return (
    <ResponsiveContainer width="100%" height={50 * chartData.length} data-testid="gantt-chart">
      <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
        <XAxis type="number" allowDecimals={false} />
        <YAxis type="category" dataKey="driver" />
        <Tooltip />
        <Bar dataKey="laps" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
