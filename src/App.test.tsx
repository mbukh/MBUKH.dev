import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';
import App from './App';

describe('App', () => {
  test('counter increments when button is clicked', async () => {
    render(<App />);
    expect(screen.getByText('Moshe Bukhman')).toBeInTheDocument();
    // Use waitFor to wait for the DOM to update
    await waitFor(() => {
      // Expect the counter to be 1
      expect(screen.getByText('Moshe Bukhman').innerText).toEqual('Moshe Bukhman');
    });
  });
});
