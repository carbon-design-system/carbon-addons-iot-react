import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SuiteHeaderAppSwitcher from './SuiteHeaderAppSwitcher';

const commonProps = {
  applications: [
    {
      id: 'monitor',
      name: 'Monitor',
      href: 'https://www.ibm.com/monitor',
    },
    {
      id: 'health',
      name: 'Health',
      href: 'https://www.ibm.com/health',
      isExternal: true,
    },
  ],
  allApplicationsLink: 'https://www.ibm.com',
  noAccessLink: 'https://www.ibm.com',
  onRouteChange: async () => true,
};

describe('SuiteHeaderAppSwitcher', () => {
  let originalWindowLocation;
  beforeEach(() => {
    originalWindowLocation = { ...window.location };
  });

  afterEach(() => {
    window.location = { ...originalWindowLocation };
  });
  it('clicks all applications link', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeaderAppSwitcher {...commonProps} />);
    await userEvent.click(screen.getByTestId('suite-header-app-switcher--all-applications'));
    expect(window.location.href).toBe(commonProps.allApplicationsLink);
  });
  it('clicks all applications link (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeaderAppSwitcher {...commonProps} onRouteChange={async () => false} />);
    await userEvent.click(screen.getByTestId('suite-header-app-switcher--all-applications'));
    expect(window.location.href).not.toBe(commonProps.allApplicationsLink);
  });
  it('clicks an application link', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeaderAppSwitcher {...commonProps} />);
    await userEvent.click(screen.getByTestId('suite-header-app-switcher--monitor'));
    expect(window.location.href).toBe(
      commonProps.applications.find((app) => app.id === 'monitor').href
    );
  });
  it('clicks an external application link', async () => {
    delete window.location;
    window.location = { href: '' };
    window.open = jest.fn();
    render(<SuiteHeaderAppSwitcher {...commonProps} />);
    await userEvent.click(screen.getByTestId('suite-header-app-switcher--health'));
    expect(window.open).toHaveBeenCalledWith(
      commonProps.applications.find((app) => app.id === 'health').href,
      'blank'
    );
  });
  it('clicks an application link (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeaderAppSwitcher {...commonProps} onRouteChange={async () => false} />);
    await userEvent.click(screen.getByTestId('suite-header-app-switcher--monitor'));
    expect(window.location.href).not.toBe(
      commonProps.applications.find((app) => app.id === 'monitor').href
    );
  });
  it('clicks no access link', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeaderAppSwitcher {...commonProps} applications={[]} />);
    await userEvent.click(screen.getByTestId('suite-header-app-switcher--no-access'));
    expect(window.location.href).toBe(commonProps.noAccessLink);
  });
  it('clicks no access link (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    render(
      <SuiteHeaderAppSwitcher
        {...commonProps}
        applications={[]}
        onRouteChange={async () => false}
      />
    );
    await userEvent.click(screen.getByTestId('suite-header-app-switcher--no-access'));
    expect(window.location.href).not.toBe(commonProps.noAccessLink);
  });
  it('shows loading state', async () => {
    delete window.location;
    window.location = { href: '' };
    const wrapper = mount(
      <SuiteHeaderAppSwitcher
        allApplicationsLink="https://www.ibm.com"
        noAccessLink="https://www.ibm.com"
      />
    );
    // Expect skeletons
    expect(wrapper.find('[data-testid="suite-header-app-switcher--loading"]')).toHaveLength(1);
  });
});
