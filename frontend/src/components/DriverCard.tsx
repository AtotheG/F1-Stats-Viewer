import styles from './DriverCard.module.css';

interface Driver {
  id?: string | number;
  code?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  constructor?: string;
  team?: string;
  [key: string]: any;
}

export default function DriverCard({ driver }: { driver: Driver }) {
  const name =
    driver.name ||
    driver.fullName ||
    `${driver.givenName ?? ''} ${driver.familyName ?? ''}`.trim();
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{name}</h3>
      {driver.team && <p className={styles.team}>{driver.team}</p>}
      {driver.constructor && <p className={styles.team}>{driver.constructor}</p>}
    </div>
  );
}
