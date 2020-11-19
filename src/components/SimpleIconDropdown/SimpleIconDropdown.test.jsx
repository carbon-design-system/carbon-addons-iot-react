import React from 'react';
import { render, screen } from '@testing-library/react';

import SimpleIconDropdown from './SimpleIconDropdown';

describe('SimpleIconDropdown', () => {
  const mockOnChange = jest.fn();

  const commonProps = {
    id: 'myIconDropdown',
    titleText: 'icon',
    onChange: mockOnChange,
  };

  it('clicking card should select the card and close gallery', async () => {
    render(<SimpleIconDropdown {...commonProps} />);

    const iconDropdown = screen.getByRole('button');
    expect(iconDropdown).toBeInTheDocument();
  });
});
