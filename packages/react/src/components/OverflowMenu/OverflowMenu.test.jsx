import React from 'react';
import { render, screen } from '@testing-library/react';

import { OverflowMenu, OverflowMenuItem } from '.';

describe('OverflowMenu', () => {
  it('should be selectable by testId', () => {
    render(
      <OverflowMenu testId="overflow_menu">
        <OverflowMenuItem itemText="Option 1" onClick={jest.fn()} />
      </OverflowMenu>
    );

    expect(screen.getByTestId('overflow_menu')).toBeDefined();
  });
});
