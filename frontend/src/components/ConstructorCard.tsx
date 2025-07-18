import styles from './ConstructorCard.module.css';

export interface Constructor {
  constructorId?: string | number;
  name: string;
  nationality?: string;
  points?: number;
}

export default function ConstructorCard({ constructor }: { constructor: Constructor }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.name}>{constructor.name}</h2>
      {constructor.nationality && (
        <p className={styles.nationality}>{constructor.nationality}</p>
      )}
      {constructor.points !== undefined && (
        <p className={styles.points}>{constructor.points} pts</p>
      )}
    </div>
  );
}
