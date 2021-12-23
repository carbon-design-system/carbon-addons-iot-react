import React from 'react';
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
  it('keyboard navigates an application link', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeaderAppSwitcher {...commonProps} />);
    await userEvent.type(screen.getByTestId('suite-header-app-switcher--monitor'), '{enter}');
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
      '_blank',
      'noopener noreferrer'
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
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<SuiteHeaderAppSwitcher {...commonProps} applications={[]} />);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: A future version of React will block javascript: URLs as a security precaution.'
      ),
      `"javascript:void(0)"`,
      expect.stringContaining('SuiteHeaderAppSwitcher')
    );
    console.error.mockReset();
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
    render(
      <SuiteHeaderAppSwitcher
        allApplicationsLink="https://www.ibm.com"
        noAccessLink="https://www.ibm.com"
      />
    );
    // Expect skeletons
    expect(screen.getByTestId('suite-header-app-switcher--loading')).toBeVisible();
  });

  it('calls the default onRouteChange', async () => {
    jest.spyOn(SuiteHeaderAppSwitcher.defaultProps, 'onRouteChange');
    render(
      <SuiteHeaderAppSwitcher
        allApplicationsLink="https://www.ibm.com"
        noAccessLink="https://www.ibm.com"
        customApplications={[]}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'All applications' }));
    expect(SuiteHeaderAppSwitcher.defaultProps.onRouteChange).toHaveBeenCalledWith(
      'NAVIGATOR',
      'https://www.ibm.com'
    );
    expect(window.location.href).toBe('https://www.ibm.com');
    jest.restoreAllMocks();
  });

  it('shows custom applications', async () => {
    const onRouteChange = jest.fn();
    render(
      <SuiteHeaderAppSwitcher
        allApplicationsLink="https://www.ibm.com"
        noAccessLink="https://www.ibm.com"
        customApplications={[
          {
            id: 'custom',
            name: 'Custom application',
            href: 'https://www.ibm.com',
            isExternal: false,
          },
        ]}
        onRouteChange={onRouteChange}
      />
    );

    const customAppButton = screen.getByRole('button', { name: 'Custom application' });
    expect(customAppButton).toBeVisible();
    await userEvent.click(customAppButton);
    expect(onRouteChange).toHaveBeenCalledWith('APPLICATION', 'https://www.ibm.com', {
      appId: 'custom',
    });
  });
});
