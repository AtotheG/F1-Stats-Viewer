beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../src/app/page';

function setupFetch({ seasons = [], races = {}, sessions = {}, laps = {} } = {}) {
  global.fetch = jest.fn((url) => {
    if (url === '/api/seasons') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(seasons) });
    }
    const eventsMatch = url.match(/^\/api\/events\/(\d+)/);
    if (eventsMatch) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(races[eventsMatch[1]] || []),
      });
    }
    const sessionsMatch = url.match(/^\/api\/sessions\/(\d+)/);
    if (sessionsMatch) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(sessions[sessionsMatch[1]] || []),
      });
    }
    const lapsMatch = url.match(/^\/api\/weekend\/(\d+)\/laps/);
    if (lapsMatch) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(laps[lapsMatch[1]] || []),
      });
    }
    return Promise.reject(new Error('Unknown URL ' + url));
  });
}

function renderPage() {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <HomePage />
    </QueryClientProvider>
  );
}

afterEach(() => {
  jest.resetAllMocks();
});

test('seasons dropdown populates from API', async () => {
  setupFetch({ seasons: [2025, 2024] });
  renderPage();
  const seasonSelect = screen.getAllByRole('combobox')[0];
  await screen.findByRole('option', { name: '2025' });
  const opts = within(seasonSelect).getAllByRole('option').map((o) => o.textContent);
  expect(opts).toEqual(['Season', '2025', '2024']);
});

test('races filter based on selected season', async () => {
  setupFetch({
    seasons: [2025, 2024],
    races: {
      2025: [{ id: 1, name: 'Bahrain GP' }],
      2024: [{ id: 2, name: 'Imola GP' }],
    },
  });
  renderPage();
  const [seasonSelect, raceSelect] = screen.getAllByRole('combobox');
  fireEvent.change(seasonSelect, { target: { value: '2025' } });
  await waitFor(() =>
    global.fetch.mock.calls.some((c) => c[0] === '/api/events/2025')
  );
  fireEvent.change(seasonSelect, { target: { value: '2024' } });
  await waitFor(() =>
    global.fetch.mock.calls.some((c) => c[0] === '/api/events/2024')
  );
  expect(raceSelect.value).toBe('');
});

test('sessions load when race is selected', async () => {
  setupFetch({
    seasons: [2025],
    races: { 2025: [{ id: 1, name: 'Bahrain GP' }] },
    sessions: { 1: [{ id: 10, name: 'Race' }] },
  });
  renderPage();
  const [seasonSelect, raceSelect, sessionSelect] = screen.getAllByRole('combobox');
  fireEvent.change(seasonSelect, { target: { value: '2025' } });
  await waitFor(() =>
    global.fetch.mock.calls.some((c) => c[0] === '/api/events/2025')
  );
  fireEvent.change(raceSelect, { target: { value: '1' } });
  await waitFor(() =>
    global.fetch.mock.calls.some((c) => c[0] === '/api/sessions/1')
  );
});

test('apply fetches laps from selected session', async () => {
  setupFetch({
    seasons: [2025],
    races: { 2025: [{ id: 1, name: 'Bahrain GP' }] },
    sessions: { 1: [{ id: 10, name: 'Race' }] },
    laps: { 10: [] },
  });
  renderPage();
  await screen.findByRole('option', { name: '2025' });
  const [seasonSelect, raceSelect, sessionSelect] = screen.getAllByRole('combobox');
  fireEvent.change(seasonSelect, { target: { value: '2025' } });
  await screen.findByRole('option', { name: 'Bahrain GP' });
  fireEvent.change(raceSelect, { target: { value: '1' } });
  await screen.findByRole('option', { name: 'Race' });
  fireEvent.change(sessionSelect, { target: { value: '10' } });
  fireEvent.click(screen.getByRole('button', { name: /apply/i }));
  await waitFor(() => global.fetch.mock.calls.some((c) => c[0] === '/api/weekend/10/laps'));
});
