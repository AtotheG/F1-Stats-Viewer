'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function TyreStintBar({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis dataKey="stint" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="laps" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
