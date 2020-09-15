import { mount } from 'enzyme';
import React from 'react';
import Chip from '@carbon/icons-react/lib/chip/24';

import { SideNav } from '../../index';
import { ToastNotification } from '../Notification';

import SuiteHeader from './SuiteHeader';
import SuiteHeaderI18N from './i18n';
import SuiteHeaderLogoutModal from './SuiteHeaderLogoutModal/SuiteHeaderLogoutModal';

const commonProps = {
  suiteName: 'Application Suite',
  appName: 'Application Name',
  userDisplayName: 'Admin User',
  username: 'adminuser',
  isAdminView: true,
  routes: {
    profile: 'https://www.ibm.com',
    navigator: 'https://www.ibm.com',
    admin: 'https://www.ibm.com',
    logout: 'https://www.ibm.com',
    whatsNew: 'https://www.ibm.com',
    gettingStarted: 'https://www.ibm.com',
    documentation: 'https://www.ibm.com',
    requestEnhancement: 'https://www.ibm.com',
    support: 'https://www.ibm.com',
    about: 'https://www.ibm.com',
  },
  applications: [
    {
      id: 'monitor',
      name: 'Monitor',
      href: 'https://www.ibm.com',
    },
    {
      id: 'health',
      name: 'Health',
      href: 'https://www.ibm.com',
      isExternal: true,
    },
  ],
};

describe('SuiteHeader', () => {
  it('renders in admin context', () => {
    const wrapper = mount(<SuiteHeader {...commonProps} />);
    expect(wrapper.find('button.admin-icon__selected')).toHaveLength(1);
  });
  it('renders with sidenav', () => {
    const wrapper = mount(
      <SuiteHeader
        {...commonProps}
        sideNavProps={{
          links: [
            {
              isEnabled: true,
              icon: Chip,
              metaData: {
                label: 'Devices',
                href: 'https://google.com',
                element: 'a',
                target: '_blank',
              },
              linkContent: 'Devices',
            },
          ],
        }}
      />
    );
    expect(wrapper.find(SideNav)).toBeDefined();
  });
  it('opens and closes logout modal', () => {
    delete window.location;
    window.location = { href: '' };
    const wrapper = mount(<SuiteHeader {...commonProps} />);
    const logoutButton = wrapper.find('[data-testid="suite-header-profile--logout"]').first();
    logoutButton.simulate('click');
    expect(wrapper.find(SuiteHeaderLogoutModal).prop('isOpen')).toBe(true);
    const closeButton = wrapper.find('.bx--modal-footer > [kind="secondary"]');
    closeButton.simulate('click');
    expect(wrapper.find(SuiteHeaderLogoutModal).prop('isOpen')).toBe(false);
  });
  it('clicks logout link', () => {
    delete window.location;
    window.location = { href: '' };
    const wrapper = mount(<SuiteHeader {...commonProps} />);
    const logoutButton = wrapper.find('.bx--modal-footer > [kind="primary"]');
    logoutButton.simulate('click');
    expect(window.location.href).toBe(commonProps.routes.logout);
  });
  it('admin link from admin view takes you to navigator route', () => {
    delete window.location;
    window.location = { href: '' };
    const wrapper = mount(<SuiteHeader {...commonProps} isAdminView />);
    const adminButton = wrapper.find('[data-testid="admin-icon"]').first();
    adminButton.simulate('click');
    expect(window.location.href).toBe(commonProps.routes.navigator);
  });
  it('admin link from non-admin view takes you to admin route', () => {
    delete window.location;
    window.location = { href: '' };
    const wrapper = mount(<SuiteHeader {...commonProps} isAdminView={false} />);
    const adminButton = wrapper.find('[data-testid="admin-icon"]').first();
    adminButton.simulate('click');
    expect(window.location.href).toBe(commonProps.routes.admin);
  });
  it('renders all i18n', () => {
    Object.keys(SuiteHeaderI18N).forEach(language => {
      const wrapper = mount(
        <SuiteHeader {...commonProps} i18n={SuiteHeaderI18N[language]} isAdminView />
      );
      expect(wrapper.find('button.admin-icon__selected')).toHaveLength(1);
    });
  });
  it('shows survey notification', () => {
    delete window.location;
    window.location = { href: '' };
    jest.useFakeTimers();
    const wrapper = mount(
      <SuiteHeader
        {...commonProps}
        survey={{ link: 'www.ibm.com', title: 'Title', text: 'Text' }}
      />
    );
    jest.runAllTimers();
    expect(wrapper.find(ToastNotification).prop('title')).toBe('Title');
  });
});
