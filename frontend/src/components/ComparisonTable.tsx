'use client';

import styles from './ComparisonTable.module.css';

interface Row {
  label: string;
  driver1: string | number;
  driver2: string | number;
}

export default function ComparisonTable({ data }: { data: Row[] }) {
  if (!data || data.length === 0) return null;
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Driver 1</th>
          <th>Driver 2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td>{row.label}</td>
            <td>{row.driver1}</td>
            <td>{row.driver2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
