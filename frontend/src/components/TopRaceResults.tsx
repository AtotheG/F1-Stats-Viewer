import { useApi } from '../lib/useApi';
import styles from './TopRaceResults.module.css';

interface ResultItem {
  metric: string;
  value?: string | number;
  race?: string;
  [key: string]: any;
}

export default function TopRaceResults({
  driverId,
}: {
  driverId: string | number;
}) {
  const { data } = useApi<ResultItem[]>(
    `top-results-${driverId}`,
    `/api/driver/${driverId}/top-results`,
    { enabled: Boolean(driverId) }
  );
  const results = data || [];

  if (!results.length) return null;

  return (
    <div className={styles.row}>
      {results.map((res, i) => (
        <div key={i} className={styles.card}>
          <h3 className={styles.metric}>{res.metric}</h3>
          {res.value !== undefined && (
            <p className={styles.value}>{res.value}</p>
          )}
          {res.race && <p className={styles.race}>{res.race}</p>}
        </div>
      ))}
    </div>
  );
}
