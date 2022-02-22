import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { keyboardKeys } from '../../../constants/KeyCodeConstants';

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
    fireEvent.keyDown(actionButtonGroup, { key: keyboardKeys.ENTER });

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
  it('it renders an a instead of button if item has href', () => {
    const mockProps = {
      testId: 'my-header-action',
      item: {
        label: 'myhelpLabel',
        btnContent: <span>myButton</span>,
        href: 'https://www.ibm.com',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
      index: 0,
      renderLabel: true,
    };

    render(<HeaderAction {...mockProps} />);
    expect(true).toBeTruthy();
    expect(screen.queryByText('myButton')).not.toBeInTheDocument();
    expect(screen.getByTestId('menu-item-myhelpLabel-global')).toBeVisible();
  });
});
