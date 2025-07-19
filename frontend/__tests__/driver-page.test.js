beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DriverPage from '../src/app/drivers/[id]/page';

function setupFetch({ driver, seasons = {}, races = {} }) {
  global.fetch = jest.fn((url) => {
    if (url === `/api/driver/${driver.id}`) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(driver) });
    }
    if (url === `/api/driver/${driver.id}/seasons`) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(Object.values(seasons)) });
    }
    const raceMatch = url.match(new RegExp(`/api/driver/${driver.id}/season/(\\d+)/races`));
    if (raceMatch) {
      const year = raceMatch[1];
      return Promise.resolve({ ok: true, json: () => Promise.resolve(races[year] || []) });
    }
    return Promise.reject(new Error('Unknown URL ' + url));
  });
}

function renderPage(id) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <DriverPage params={{ id }} />
    </QueryClientProvider>
  );
}

afterEach(() => {
  jest.resetAllMocks();
});

test('driver summary updates when season row is selected', async () => {
  const driver = { id: 'ham', givenName: 'Lewis', familyName: 'Hamilton', team: 'Mercedes' };
  setupFetch({
    driver,
    seasons: {
      2023: { year: 2023, team: 'Mercedes' },
      2022: { year: 2022, team: 'McLaren' },
    },
    races: {
      2022: [],
      2023: [],
    },
  });
  renderPage('ham');
  await screen.findByText('Lewis Hamilton');
  expect(screen.getAllByText('Mercedes')[0]).toBeInTheDocument();
  fireEvent.click(screen.getByText('2022'));
  await waitFor(() => {
    const elements = screen.getAllByText('McLaren');
    expect(elements.length).toBeGreaterThan(0);
  });
  expect(global.fetch.mock.calls.some((c) => c[0] === '/api/driver/ham/season/2022/races')).toBe(true);
});
