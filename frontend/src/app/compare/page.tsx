'use client';

import { useApi } from '../../lib/useApi';

export default function ComparePage() {
  const { data } = useApi<any>('compare', '/api/compare');
  return (
    <div>
      <h1>Compare</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
