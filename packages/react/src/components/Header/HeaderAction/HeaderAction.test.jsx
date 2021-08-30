import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { keyCodes } from '../../../constants/KeyCodeConstants';

import HeaderAction from './HeaderAction';

describe('HeaderAction', () => {
  it('should expand on enter key', () => {
    const mockProps = {
      testId: 'my-header-action',
      item: {
        label: 'help',
        hasHeaderPanel: true,
        btnContent: <span>myButton</span>,
        childContent: [
          {
            onClick: jest.fn(),
            content: <p>This is a link</p>,
          },
        ],
      },
      index: 0,
    };

    render(<HeaderAction {...mockProps} />);
    expect(screen.getByRole('button', { name: /help/i })).toHaveAttribute('aria-expanded', 'false');

    const actionButtonGroup = screen.getByTestId('action-btn__group');
    fireEvent.keyDown(actionButtonGroup, { keyCode: keyCodes.ENTER });

    expect(screen.getByRole('button', { name: /help/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('it renders label instead of button content if renderLabel: true', () => {
    const mockProps = {
      testId: 'my-header-action',
      item: {
        label: 'myhelpLabel',
        btnContent: <span>myButton</span>,
      },
      index: 0,
      renderLabel: true,
    };

    render(<HeaderAction {...mockProps} />);
    expect(screen.queryByText('myButton')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /myhelpLabel/i })).toBeVisible();
  });
});
