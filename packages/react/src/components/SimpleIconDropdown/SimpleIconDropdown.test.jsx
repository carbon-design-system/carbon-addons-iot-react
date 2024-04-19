import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import SimpleIconDropdown from './SimpleIconDropdown';

describe('SimpleIconDropdown', () => {
  const mockOnChange = jest.fn();

  const commonProps = {
    id: 'myIconDropdown',
    titleText: 'icon',
    onChange: mockOnChange,
  };

  it('Selecting an icon should fire onChange', () => {
    render(<SimpleIconDropdown {...commonProps} />);

    const iconDropdown = screen.getByRole('combobox');
    expect(iconDropdown).toBeInTheDocument();

    fireEvent.click(iconDropdown);

    const secondOption = screen.getAllByRole('option')[1];
    expect(secondOption).toBeInTheDocument();

    fireEvent.click(secondOption);
    expect(mockOnChange).toHaveBeenCalled();
  });
});
