import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('renders the label for a found status', () => {
    render(<StatusBadge status="found" />);
    expect(screen.getByText('Retrouvé')).toBeInTheDocument();
  });

  it('renders an urgent badge when is_urgent is true', () => {
    render(<StatusBadge status="missing" is_urgent />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
    expect(screen.getByText('Disparu')).toBeInTheDocument();
  });

  it('omits the urgent badge when is_urgent is false', () => {
    render(<StatusBadge status="searching" />);
    expect(screen.queryByText('Urgent')).not.toBeInTheDocument();
    expect(screen.getByText('En cours de recherche')).toBeInTheDocument();
  });
});
