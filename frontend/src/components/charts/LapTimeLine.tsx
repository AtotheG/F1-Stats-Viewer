'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function LapTimeLine({ data }: { data: any[] }) {
  return (
    <LineChart width={400} height={200} data={data}>
      <XAxis dataKey="lap" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="time" stroke="#8884d8" />
    </LineChart>
  );
}
