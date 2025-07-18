'use client';

import { useState } from 'react';
import { useApi } from '../lib/useApi';

interface Season {
  year: number;
  [key: string]: any;
}

interface Race {
  id?: string | number;
  name?: string;
  [key: string]: any;
}

function SeasonRaces({ driverId, year }: { driverId: string | number; year: number }) {
  const { data: races } = useApi<Race[]>(`driver-${driverId}-${year}-races`, `/api/driver/${driverId}/season/${year}/races`);
  if (!races) {
    return (
      <tr>
        <td colSpan={3}>Loading...</td>
      </tr>
    );
  }
  return (
    <>
      {races.map((r) => (
        <tr key={r.id ?? r.name}>
          <td style={{ paddingLeft: '2rem' }} colSpan={3}>
            {r.name}
          </td>
        </tr>
      ))}
    </>
  );
}

export default function DriverSeasonsTable({
  driverId,
  onSeasonSelect,
}: {
  driverId: string | number;
  onSeasonSelect?: (season: number) => void;
}) {
  const { data: seasons } = useApi<Season[]>(`driver-${driverId}-seasons`, `/api/driver/${driverId}/seasons`);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggle = (year: number) => {
    setExpanded((prev) => ({ ...prev, [year]: !prev[year] }));
    onSeasonSelect?.(year);
  };

  if (!seasons) return null;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Year</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Team</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Points</th>
        </tr>
      </thead>
      <tbody>
        {seasons.map((season) => (
          <>
            <tr
              key={season.year}
              style={{ cursor: 'pointer' }}
              onClick={() => toggle(season.year)}
            >
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{season.year}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{season.team ?? season.constructor}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{season.points ?? ''}</td>
            </tr>
            {expanded[season.year] && (
              <SeasonRaces key={`races-${season.year}`} driverId={driverId} year={season.year} />
            )}
          </>
        ))}
      </tbody>
    </table>
  );
}
