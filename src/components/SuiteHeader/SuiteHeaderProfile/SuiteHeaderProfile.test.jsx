import { mount } from 'enzyme';
import React from 'react';

import SuiteHeaderProfile from './SuiteHeaderProfile';

const commonProps = {
  displayName: 'Test User',
  username: 'myuser',
  onProfileClick: () => {
    window.location.href = 'https://www.ibm.com';
  },
  onRequestLogout: () => {},
};

describe('SuiteHeaderProfile', () => {
  it('renders with no display name', () => {
    const mockOnRequestLogout = jest.fn();
    const wrapper = mount(
      <SuiteHeaderProfile
        {...commonProps}
        displayName={undefined}
        onRequestLogout={mockOnRequestLogout}
      />
    );
    const logoutButton = wrapper.find('[data-testid="suite-header-profile--logout"]').first();
    logoutButton.simulate('click');
    expect(mockOnRequestLogout).toHaveBeenCalled();
  });
  it('clicks profile link', () => {
    delete window.location;
    window.location = { href: '' };
    const mockOnProfileClick = jest.fn();
    const wrapper = mount(
      <SuiteHeaderProfile {...commonProps} onProfileClick={mockOnProfileClick} />
    );
    const profileButton = wrapper.find('[data-testid="suite-header-profile--profile"]').first();
    profileButton.simulate('click');
    expect(mockOnProfileClick).toHaveBeenCalled();
  });
});
