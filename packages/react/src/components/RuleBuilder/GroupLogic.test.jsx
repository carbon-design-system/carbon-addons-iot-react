import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GroupLogic from './GroupLogic';

describe('GroupLogic', () => {
  it('should fallback when i18n is null', async () => {
    const id = 'render-test';
    render(<GroupLogic id={id} i18n={null} />);

    expect(screen.getByTestId(`${id}-group-logic-dropdown`)).toBeDefined();
    expect((await screen.findAllByText('ALL')).length).toEqual(1);
  });

  it('should call the default  onChange when none given', async () => {
    jest.spyOn(GroupLogic.defaultProps, 'onChange');
    const id = 'render-test';
    render(<GroupLogic id={id} i18n={null} />);

    userEvent.click(screen.getByTitle('Open menu'));
    userEvent.click(screen.getByText('ANY'));
    expect(GroupLogic.defaultProps.onChange).toHaveBeenCalledWith({
      selectedItem: { id: 'ANY', name: 'ANY' },
    });
    jest.resetAllMocks();
  });
});
