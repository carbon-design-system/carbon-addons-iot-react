import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Tooltip } from '.';

describe('Tooltip', () => {
  it('should be selectable by testId', () => {
    render(<Tooltip testId="__tooltip">test</Tooltip>);
    // data-testid is only passed to the div containing the tooltip--not the button, so
    // the tooltip must be open for the test to pass.
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('__tooltip')).toBeDefined();
  });
});
