import { mount } from 'enzyme';
import React from 'react';

import SuiteHeaderLogoutModal from './SuiteHeaderLogoutModal';

const commonProps = {
  suiteName: 'Application Suite',
  displayName: 'Test User',
  isOpen: true,
};

describe('SuiteHeaderLogoutModal', () => {
  it('renders and callbacks are triggered', () => {
    const mockOnClose = jest.fn();
    const mockOnLogout = jest.fn();
    const wrapper = mount(
      <SuiteHeaderLogoutModal
        {...commonProps}
        onClose={mockOnClose}
        onLogout={mockOnLogout}
      />
    );

    const modalCloseButton = wrapper.find('.bx--modal-close');
    modalCloseButton.simulate('click');
    expect(mockOnClose).toHaveBeenCalled();

    const closeButton = wrapper.find('.bx--modal-footer > [kind="secondary"]');
    closeButton.simulate('click');
    expect(mockOnClose).toHaveBeenCalled();

    const logoutButton = wrapper.find('.bx--modal-footer > [kind="primary"]');
    logoutButton.simulate('click');
    expect(mockOnLogout).toHaveBeenCalled();
  });
});
