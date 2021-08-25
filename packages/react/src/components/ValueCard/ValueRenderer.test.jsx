import { render, screen } from '@testing-library/react';
import React from 'react';

import { PREVIEW_DATA } from './valueCardUtils';
import ValueRenderer from './ValueRenderer';

const commonProps = {
  isNumberValueCompact: true,
  fontSize: 48,
  testId: 'value-renderer-test',
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
});
