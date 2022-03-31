import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

  it('should call the default getMenuOffset from carbon when none given', () => {
    const onClick = jest.fn();
    render(
      <OverflowMenu testId="overflow_menu" menuOffset={null}>
        <OverflowMenuItem itemText="Option 1" onClick={onClick} />
      </OverflowMenu>
    );

    userEvent.click(
      screen.getByLabelText('open and close list of options', { selector: 'button' })
    );
    userEvent.click(screen.getByText('Option 1'));
    expect(onClick).toHaveBeenCalled();
  });
});
