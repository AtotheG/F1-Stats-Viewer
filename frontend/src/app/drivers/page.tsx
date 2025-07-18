'use client';

import { useState } from 'react';
import DriverCard from '../../components/DriverCard';
import DriverSummaryCards from '../../components/DriverSummaryCards';
import TopRaceResults from '../../components/TopRaceResults';
import { useApi } from '../../lib/useApi';
import Link from 'next/link';
import styles from './drivers.module.css';

export default function DriversPage() {
  const { data: driversData } = useApi<any[]>('drivers', '/api/drivers');
  const [selected, setSelected] = useState('');
  const drivers = (driversData || [])
    .slice()
    .sort((a, b) => {
      const nameA =
        a.name ||
        a.fullName ||
        `${a.givenName ?? ''} ${a.familyName ?? ''}`.trim();
      const nameB =
        b.name ||
        b.fullName ||
        `${b.givenName ?? ''} ${b.familyName ?? ''}`.trim();
      return nameA.localeCompare(nameB);
    });

  const { data: summary } = useApi<any[]>(
    'driver-summary',
    selected ? `/api/driver/${selected}/summary` : '',
    { enabled: Boolean(selected) }
  );

  const getDriverName = (d: any) =>
    d.name || d.fullName || `${d.givenName ?? ''} ${d.familyName ?? ''}`.trim();
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Drivers</h1>
      <div className={styles.form}>
        <select
          className={styles.select}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select Driver</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {getDriverName(d)}
            </option>
          ))}
        </select>
      </div>
      <DriverSummaryCards summary={summary || []} />
      <div className={styles.grid}>
        {drivers.map((driver, i) => (
          <Link
            key={driver.id ?? driver.code ?? driver.name ?? i}
            href={`/drivers/${driver.id ?? driver.code ?? i}`}
          >
            <DriverCard driver={driver} />
          </Link>
        ))}
      </div>
      {selected && <TopRaceResults driverId={selected} />}
    </main>
  );
}
