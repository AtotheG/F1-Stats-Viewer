'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function LapTimeLine({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis dataKey="lap" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="time" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
