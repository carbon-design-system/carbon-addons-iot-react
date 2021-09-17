import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddCard from './AddCard';

describe('AddCard', () => {
  it('should be selectable by testId', () => {
    const onClick = jest.fn();
    render(<AddCard title="My Title" onClick={onClick} testId="ADDCARD" />);
    expect(screen.getByTestId('ADDCARD')).toBeDefined();
  });

  it('onClick', () => {
    const onClick = jest.fn();
    render(<AddCard title="My Title" onClick={onClick} />);
    userEvent.click(screen.getByTestId('add-card-tile'));
    expect(onClick.mock.calls).toHaveLength(1);
  });
});
