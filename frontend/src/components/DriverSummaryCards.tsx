import styles from './DriverSummaryCards.module.css';

interface SummaryItem {
  label: string;
  value: string | number;
}

export default function DriverSummaryCards({
  summary,
}: {
  summary: SummaryItem[];
}) {
  if (!summary || summary.length === 0) return null;
  return (
    <div className={styles.grid}>
      {summary.map((item, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.value}>{item.value}</div>
          <div className={styles.label}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
