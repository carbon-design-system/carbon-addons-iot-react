import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { settings } from '../../../constants/Settings';

import SuiteHeaderLogoutModal from './SuiteHeaderLogoutModal';

const { prefix } = settings;

const commonProps = {
  suiteName: 'Application Suite',
  displayName: 'Test User',
  isOpen: true,
};

describe('SuiteHeaderLogoutModal', () => {
  it('renders and callbacks are triggered', () => {
    const mockOnClose = jest.fn();
    const mockOnLogout = jest.fn();
    const { container } = render(
      <SuiteHeaderLogoutModal {...commonProps} onClose={mockOnClose} onLogout={mockOnLogout} />
    );

    const modalCloseButton = within(
      container.querySelector(`.${prefix}--modal-header`)
    ).getByLabelText(/close/i);
    userEvent.click(modalCloseButton);
    expect(mockOnClose).toHaveBeenCalled();

    const closeButton = screen.getByText('Cancel');
    userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();

    const logoutButton = screen.getByText('Log out');
    userEvent.click(logoutButton);
    expect(mockOnLogout).toHaveBeenCalled();
  });
});
