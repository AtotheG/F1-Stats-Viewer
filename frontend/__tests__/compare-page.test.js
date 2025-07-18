beforeAll(() => { global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; });
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ComparePage from '../src/app/compare/page';

function setupFetch({ drivers = [], comparison = [] }) {
  global.fetch = jest.fn((url) => {
    if (url === '/api/drivers') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(drivers),
      });
    }
    if (url.startsWith('/api/compare')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(comparison),
      });
    }
    return Promise.reject(new Error('Unknown URL'));
  });
}

function renderPage() {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <ComparePage />
    </QueryClientProvider>
  );
}

afterEach(() => {
  jest.resetAllMocks();
});

test('driver dropdown alphabetical ordering', async () => {
  setupFetch({
    drivers: [
      { id: '2', name: 'Verstappen' },
      { id: '1', name: 'Alonso' },
      { id: '3', name: 'Hamilton' },
    ],
  });
  renderPage();
  await screen.findAllByRole('option', { name: 'Alonso' });
  const selects = screen.getAllByRole('combobox');
  const opts1 = within(selects[0]).getAllByRole('option').map((o) => o.textContent);
  const opts2 = within(selects[1]).getAllByRole('option').map((o) => o.textContent);
  expect(opts1).toEqual(['Select Driver 1', 'Alonso', 'Hamilton', 'Verstappen']);
  expect(opts2).toEqual(['Select Driver 2', 'Alonso', 'Hamilton', 'Verstappen']);
});

test('charts and tables appear only after a selection', async () => {
  setupFetch({
    drivers: [
      { id: '1', name: 'Alonso' },
      { id: '2', name: 'Verstappen' },
    ],
    comparison: [{ lap: 1, time: 90 }],
  });
  renderPage();
  await screen.findAllByRole('option', { name: 'Alonso' });

  expect(screen.queryByRole('table')).toBeNull();
  expect(document.querySelector('.recharts-responsive-container')).toBeNull();

  const selects = screen.getAllByRole('combobox');
  fireEvent.change(selects[0], { target: { value: '1' } });
  fireEvent.change(selects[1], { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: /compare/i }));

  await screen.findByRole('table');
  expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
});
