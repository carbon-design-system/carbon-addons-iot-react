import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ValueCardFormSettings from './ValueCardFormSettings';

const valueCardConfig = {
  id: 'Standard',
  title: 'value card',
  type: 'VALUE',
  size: 'MEDIUM',
  content: {
    attributes: [
      {
        dataSourceId: 'key1',
        unit: '%',
        label: 'Key 1',
      },
      {
        dataSourceId: 'key2',
        unit: 'lb',
        label: 'Key 2',
      },
    ],
  },
  fontSize: 16,
};

const mockOnChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('Value form fields', () => {
  it('should update JSON for the font size', () => {
    render(<ValueCardFormSettings cardConfig={valueCardConfig} onChange={mockOnChange} />);
    const fontSizeInput = screen.getByDisplayValue('16');
    expect(fontSizeInput).toBeInTheDocument();

    fireEvent.change(fontSizeInput, {
      target: { value: 30 },
    });
    expect(mockOnChange).toHaveBeenCalledWith({
      content: {
        attributes: [
          {
            dataSourceId: 'key1',
            label: 'Key 1',
            unit: '%',
          },
          {
            dataSourceId: 'key2',
            label: 'Key 2',
            unit: 'lb',
          },
        ],
      },
      fontSize: 30,
      id: 'Standard',
      size: 'MEDIUM',
      title: 'value card',
      type: 'VALUE',
    });
  });
  it('should validate input for the invalid font size', () => {
    render(<ValueCardFormSettings cardConfig={valueCardConfig} onChange={mockOnChange} />);
    const fontSizeInput = screen.getByDisplayValue('16');
    expect(fontSizeInput).toBeInTheDocument();

    fireEvent.change(fontSizeInput, {
      target: { value: 'bogus size' },
    });

    const invalidText = screen.getByText('Provide invalidText');
    expect(invalidText).toBeInTheDocument();
  });
  it('should handle undefined content', () => {
    render(
      <ValueCardFormSettings
        cardConfig={{
          id: 'Standard',
          title: 'value card',
          type: 'VALUE',
          size: 'MEDIUM',
        }}
        onChange={mockOnChange}
      />
    );
    const fontSizeInput = screen.getByText('Font size');
    expect(fontSizeInput).toBeInTheDocument();
  });

  it('should update JSON for the isNumberCompact', () => {
    const { container } = render(
      <ValueCardFormSettings cardConfig={valueCardConfig} onChange={mockOnChange} />
    );

    const numberCompactInput = container.querySelector("input[type='checkbox'");
    expect(numberCompactInput).toBeInTheDocument();

    fireEvent.click(numberCompactInput);
    expect(mockOnChange).toHaveBeenCalledWith({
      content: {
        attributes: [
          {
            dataSourceId: 'key1',
            label: 'Key 1',
            unit: '%',
          },
          {
            dataSourceId: 'key2',
            label: 'Key 2',
            unit: 'lb',
          },
        ],
      },
      fontSize: 16,
      isNumberValueCompact: true,
      id: 'Standard',
      size: 'MEDIUM',
      title: 'value card',
      type: 'VALUE',
    });
  });
});
