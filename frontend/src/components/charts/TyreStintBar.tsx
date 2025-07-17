'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function TyreStintBar({ data }: { data: any[] }) {
  return (
    <BarChart width={400} height={200} data={data}>
      <XAxis dataKey="stint" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="laps" fill="#82ca9d" />
    </BarChart>
  );
}
