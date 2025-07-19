'use client';
import { useState } from 'react';
import { useApi } from '../../../lib/useApi';
import DriverCard from '../../../components/DriverCard';
import DriverSeasonsTable from '../../../components/DriverSeasonsTable';
export default function DriverPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const { data: driver } = useApi<any>(`driver-${id}`, `/api/driver/${id}`);
  const { data: seasons } = useApi<any[]>(`driver-${id}-seasons`, `/api/driver/${id}/seasons`);
  const [selected, setSelected] = useState<number | null>(null);

  const summary = selected && seasons ? seasons.find((s) => s.year === selected) : driver;

  return (
    <main style={{ padding: '1rem' }}>
      {summary && <DriverCard driver={summary} />}
      <DriverSeasonsTable driverId={id} onSeasonSelect={setSelected} />
    </main>
  );
}
