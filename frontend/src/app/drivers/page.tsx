'use client';

import { useState } from 'react';
import DriverCard from '../../components/DriverCard';
import TopRaceResults from '../../components/TopRaceResults';
import { useApi } from '../../lib/useApi';
import styles from './drivers.module.css';

export default function DriversPage() {
  const { data } = useApi<any[]>('drivers', '/api/drivers');
  const drivers = data || [];
  const [selected, setSelected] = useState('');
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Drivers</h1>
      <select
        className={styles.select}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select Driver</option>
        {drivers.map((d) => {
          const name =
            d.name ||
            d.fullName ||
            `${d.givenName ?? ''} ${d.familyName ?? ''}`.trim();
          return (
            <option key={d.id ?? d.code ?? name} value={d.id}>
              {name}
            </option>
          );
        })}
      </select>
      <div className={styles.grid}>
        {drivers.map((driver, i) => (
          <DriverCard
            key={driver.id ?? driver.code ?? driver.name ?? i}
            driver={driver}
          />
        ))}
      </div>
      {selected && <TopRaceResults driverId={selected} />}
    </main>
  );
}
