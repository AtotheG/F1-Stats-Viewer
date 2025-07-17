'use client';

import { useApi } from '../../lib/useApi';

export default function ConstructorsPage() {
  const { data } = useApi<any[]>('constructors', '/api/constructors');
  return (
    <div>
      <h1>Constructors</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
