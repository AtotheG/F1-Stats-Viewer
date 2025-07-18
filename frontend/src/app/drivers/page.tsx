'use client';

import DriverCard from '../../components/DriverCard';
import { useApi } from '../../lib/useApi';
import styles from './drivers.module.css';

export default function DriversPage() {
  const { data } = useApi<any[]>('drivers', '/api/drivers');
  const drivers = data || [];
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Drivers</h1>
      <div className={styles.grid}>
        {drivers.map((driver, i) => (
          <DriverCard
            key={driver.id ?? driver.code ?? driver.name ?? i}
            driver={driver}
          />
        ))}
      </div>
    </main>
  );
}
