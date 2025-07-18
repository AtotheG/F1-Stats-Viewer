'use client';

import { useApi } from '../../lib/useApi';
import ConstructorCard from '../../components/ConstructorCard';
import styles from './constructors.module.css';

export default function ConstructorsPage() {
  const { data } = useApi<any[]>('constructors', '/api/constructors');
  return (
    <div>
      <h1>Constructors</h1>
      <div className={styles.grid}>
        {data?.map((c: any) => (
          <ConstructorCard key={c.constructorId ?? c.name} constructor={c} />
        ))}
      </div>
    </div>
  );
}
