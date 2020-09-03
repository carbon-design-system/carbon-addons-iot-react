import { mount } from 'enzyme';
import React from 'react';

import SuiteHeader from './SuiteHeader';

const commonProps = {
  suiteName: 'Application Suite',
  appName: 'Application Name',
  userDisplayName: 'Admin User',
  username: 'adminuser',
  isAdminView: false,
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
      appId: 'monitor',
      name: 'Monitor',
      href: 'https://www.ibm.com',
    },
    {
      appId: 'health',
      name: 'Health',
      href: 'https://www.ibm.com',
      isExternal: true,
    },
  ],
};

describe('SuiteHeader', () => {
  it('renders', () => {
    const wrapper = mount(<SuiteHeader {...commonProps} />);
    expect(wrapper.find('.admin-icon')).toHaveLength(1);
  });
});
