import { useApi } from '../../lib/useApi';

export default function DriversPage() {
  const { data } = useApi<any[]>('drivers', '/api/drivers');
  return (
    <div>
      <h1>Drivers</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
