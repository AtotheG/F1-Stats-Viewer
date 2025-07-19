beforeAll(() => { global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; });
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import LapTimeLine from '../src/components/charts/LapTimeLine';
import TyreStintBar from '../src/components/charts/TyreStintBar';
import StrategyGantt from '../src/components/charts/StrategyGantt';
import PositionsWaterfall from '../src/components/charts/PositionsWaterfall';
import TrackEvolution from '../src/components/charts/TrackEvolution';

test('charts render with sample data', () => {
  const sample = [
    { lap: 1, driver: 'HAM', time: 90 },
    { lap: 1, driver: 'VER', time: 91 },
    { lap: 2, driver: 'HAM', time: 89 },
    { lap: 2, driver: 'VER', time: 90 },
  ];

  expect(render(<LapTimeLine data={sample} />).container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  expect(render(<TyreStintBar data={sample} />).container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  expect(render(<StrategyGantt data={sample} />).container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  expect(render(<PositionsWaterfall data={sample} />).container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  expect(render(<TrackEvolution data={sample} />).container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
});
