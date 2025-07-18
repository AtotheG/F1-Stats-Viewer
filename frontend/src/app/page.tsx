'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from './page.module.css';
import { useApi } from '../lib/useApi';

const LapTimeLine = dynamic(() => import('../components/charts/LapTimeLine'), { ssr: false });
const TyreStintBar = dynamic(() => import('../components/charts/TyreStintBar'), { ssr: false });
const StrategyGantt = dynamic(() => import('../components/charts/StrategyGantt'), { ssr: false });
const PositionsWaterfall = dynamic(() => import('../components/charts/PositionsWaterfall'), { ssr: false });
const TrackEvolution = dynamic(() => import('../components/charts/TrackEvolution'), { ssr: false });

export default function Home() {
  const [sessionType, setSessionType] = useState('race');
  const [path, setPath] = useState('');
  const { data: laps } = useApi<any[]>('laps', path, { enabled: Boolean(path) });
  const sample = laps || [];

  const handleApply = () => {
    setPath(`/api/laps?session=${encodeURIComponent(sessionType)}`);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Race Insights</h1>
      <div className={styles.controls}>
        <select
          className={styles.select}
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
        >
          <option value="fp1">FP1</option>
          <option value="fp2">FP2</option>
          <option value="fp3">FP3</option>
          <option value="qualifying">Qualifying</option>
          <option value="race">Race</option>
        </select>
        <button className={styles.button} onClick={handleApply}>Apply</button>
      </div>
      <div className={styles.grid}>
        <div className={styles.chartCard}>
          <LapTimeLine data={sample} />
        </div>
        <div className={styles.chartCard}>
          <TyreStintBar data={sample} />
        </div>
        <div className={styles.chartCard}>
          <StrategyGantt />
        </div>
        <div className={styles.chartCard}>
          <PositionsWaterfall />
        </div>
        <div className={styles.chartCard}>
          <TrackEvolution />
        </div>
      </div>
    </main>
  );
}
