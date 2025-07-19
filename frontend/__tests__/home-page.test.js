beforeAll(() => { global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; });
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../src/app/page';

function setupFetch() {
  global.fetch = jest.fn((url) => {
    if (url === '/api/seasons') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([2025]),
      });
    }
    if (url === '/api/events/2025') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Bahrain GP' }]),
      });
    }
    if (url === '/api/sessions/1') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 10, name: 'Race' }]),
      });
    }
    if (url === '/api/weekend/10/laps') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
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

test('apply fetches laps from selected session', async () => {
  setupFetch();
  renderPage();
  // wait for seasons to load
  await screen.findByRole('option', { name: '2025' });
  const selects = screen.getAllByRole('combobox');
  const seasonSelect = selects[0];
  const raceSelect = selects[1];
  const sessionSelect = selects[2];

  fireEvent.change(seasonSelect, { target: { value: '2025' } });
  await screen.findByRole('option', { name: 'Bahrain GP' });
  fireEvent.change(raceSelect, { target: { value: '1' } });
  await screen.findByRole('option', { name: 'Race' });
  fireEvent.change(sessionSelect, { target: { value: '10' } });

  fireEvent.click(screen.getByRole('button', { name: /apply/i }));

  await waitFor(() =>
    global.fetch.mock.calls.some((c) => c[0] === '/api/weekend/10/laps')
  );
});
