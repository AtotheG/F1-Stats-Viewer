'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useApi } from '../lib/useApi';

const LapTimeLine = dynamic(() => import('../components/charts/LapTimeLine'), { ssr: false });
const TyreStintBar = dynamic(() => import('../components/charts/TyreStintBar'), { ssr: false });
const StrategyGantt = dynamic(() => import('../components/charts/StrategyGantt'), { ssr: false });
const PositionsWaterfall = dynamic(() => import('../components/charts/PositionsWaterfall'), { ssr: false });
const TrackEvolution = dynamic(() => import('../components/charts/TrackEvolution'), { ssr: false });

export default function Home() {
  const { data: seasons } = useApi<number[]>('seasons', '/api/seasons');
  const [season, setSeason] = useState('');
  const [race, setRace] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [path, setPath] = useState('');

  const { data: races } = useApi<any[]>(
    `events-${season}`,
    season ? `/api/events/${season}` : '',
    { enabled: Boolean(season) }
  );

  const { data: sessions } = useApi<any[]>(
    `sessions-${race}`,
    race ? `/api/sessions/${race}` : '',
    { enabled: Boolean(race) }
  );

  const { data: laps } = useApi<any[]>('laps', path, { enabled: Boolean(path) });
  const sample = laps || [];

  useEffect(() => {
    setRace('');
    setSessionId('');
  }, [season]);

  useEffect(() => {
    setSessionId('');
  }, [race]);

  const handleApply = () => {
    if (sessionId) {
      setPath(`/api/weekend/${sessionId}/laps`);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Session Insights</h1>
      <div className={styles.controls}>
        <select
          className={styles.select}
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        >
          <option value="">Season</option>
          {(seasons || []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={race}
          onChange={(e) => setRace(e.target.value)}
          disabled={!season}
        >
          <option value="">Race</option>
          {(races || []).map((r: any) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          disabled={!race}
        >
          <option value="">Session</option>
          {(sessions || []).map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
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
          <StrategyGantt data={sample} />
        </div>
        <div className={styles.chartCard}>
          <PositionsWaterfall data={sample} />
        </div>
        <div className={styles.chartCard}>
          <TrackEvolution data={sample} />
        </div>
      </div>
    </main>
  );
}
