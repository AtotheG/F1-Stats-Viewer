import styles from './DriverCard.module.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle className={styles.name}>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {driver.team && <p className={styles.team}>{driver.team}</p>}
        {driver.constructor && <p className={styles.team}>{driver.constructor}</p>}
      </CardContent>
    </Card>
  );
}
