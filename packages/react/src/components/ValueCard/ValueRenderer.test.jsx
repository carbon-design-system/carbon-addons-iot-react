import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { blue60 } from '@carbon/colors';

import { PREVIEW_DATA } from './valueCardUtils';
import ValueRenderer from './ValueRenderer';

const commonProps = {
  isNumberValueCompact: true,
  fontSize: 48,
  testId: 'value-renderer-test',
  dataSourceId: 'π',
};

describe('ValueRenderer', () => {
  it('should render preview data if the value is null', () => {
    render(<ValueRenderer {...commonProps} value={null} />);
    expect(screen.getByText(PREVIEW_DATA)).toBeVisible();
  });

  it('has the correct styles', () => {
    const { rerender } = render(
      <ValueRenderer {...commonProps} value={Math.PI} fontSize={19} color="red" />
    );
    const value = screen.getByTestId('value-renderer-test');
    expect(value).toHaveStyle('--value-renderer-max-lines:2');
    expect(value).toHaveStyle('--value-renderer-font-size:19px');
    expect(value).toHaveStyle('--value-renderer-color:red');

    rerender(<ValueRenderer {...commonProps} value={Math.PI} fontSize={48} />);
    expect(value).toHaveStyle('--value-renderer-max-lines:1');
    expect(value).toHaveStyle('--value-renderer-font-size:48px');
    expect(value).not.toHaveStyle('--value-renderer-color:null');
  });

  it('should handle onClick when provided', () => {
    const onClick = jest.fn();
    render(<ValueRenderer {...commonProps} precision={5} value={Math.PI} onClick={onClick} />);

    const button = screen.getByRole('button', { name: '3.14159' });
    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({ value: Math.PI, dataSourceId: 'π' });
    expect(button).toHaveStyle(`--value-renderer-color:${blue60}`);
  });

  it('should handle onClick and colors together', () => {
    const onClick = jest.fn();
    render(
      <ValueRenderer {...commonProps} precision={5} color="red" value={Math.PI} onClick={onClick} />
    );

    const button = screen.getByRole('button', { name: '3.14159' });
    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({ value: Math.PI, dataSourceId: 'π' });
    expect(button).toHaveStyle(`--value-renderer-color:red`);
  });
});
