import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import Title from '../../src/components/Title';

describe('Title', () => {
  test('renders the title', async () => {
    render(<Title />);
    expect(screen.getByText('Moshe Bukhman')).toBeInTheDocument();
    // Use waitFor to wait for the DOM to update
    await waitFor(() => {
      // Expect the counter to be 1
      expect(screen.getByText('Moshe Bukhman').innerText).toEqual('Moshe Bukhman');
    });
  });
});
