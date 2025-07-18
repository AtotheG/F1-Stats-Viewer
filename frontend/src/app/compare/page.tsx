'use client';

import { useState } from 'react';
import { useApi } from '../../lib/useApi';
import ComparisonTable from '../../components/ComparisonTable';
import LapTimeLine from '../../components/charts/LapTimeLine';
import styles from './compare.module.css';

export default function ComparePage() {
  const { data: drivers } = useApi<any[]>('drivers', '/api/drivers');
  const sortedDrivers = (drivers || []).slice().sort((a, b) => {
    const nameA = (a.name ?? '').toLowerCase();
    const nameB = (b.name ?? '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
  const [driver1, setDriver1] = useState('');
  const [driver2, setDriver2] = useState('');
  const [path, setPath] = useState('');
  const { data: comparison } = useApi<any[]>('comparison', path, {
    enabled: Boolean(path),
  });

  const handleCompare = () => {
    if (driver1 && driver2) {
      setPath(`/api/compare?driver1=${driver1}&driver2=${driver2}`);
    }
  };

  return (
    <div>
      <h1>Compare Drivers</h1>
      <div className={styles.form}>
        <select
          className={styles.select}
          value={driver1}
          onChange={(e) => setDriver1(e.target.value)}
        >
          <option value="">Select Driver 1</option>
          {sortedDrivers.map((d: any) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={driver2}
          onChange={(e) => setDriver2(e.target.value)}
        >
          <option value="">Select Driver 2</option>
          {sortedDrivers.map((d: any) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button className={styles.button} onClick={handleCompare}>
          Compare
        </button>
      </div>
      {comparison && comparison.length > 0 && (
        <>
          <ComparisonTable data={comparison} />
          <LapTimeLine data={comparison} />
        </>
      )}
    </div>
  );
}
