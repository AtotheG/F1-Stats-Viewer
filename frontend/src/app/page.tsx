'use client';

import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { useApi } from '../lib/useApi';

const LapTimeLine = dynamic(() => import('../components/charts/LapTimeLine'), { ssr: false });
const TyreStintBar = dynamic(() => import('../components/charts/TyreStintBar'), { ssr: false });
const StrategyGantt = dynamic(() => import('../components/charts/StrategyGantt'), { ssr: false });
const PositionsWaterfall = dynamic(() => import('../components/charts/PositionsWaterfall'), { ssr: false });
const TrackEvolution = dynamic(() => import('../components/charts/TrackEvolution'), { ssr: false });

export default function Home() {
  const { data: laps } = useApi<any[]>('laps', '/api/laps');
  const sample = laps || [];
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Race Insights</h1>
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
