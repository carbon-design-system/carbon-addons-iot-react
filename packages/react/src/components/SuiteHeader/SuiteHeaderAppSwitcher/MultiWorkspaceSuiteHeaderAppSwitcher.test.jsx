import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../../constants/Settings';

import MultiWorkspaceSuiteHeaderAppSwitcher from './MultiWorkspaceSuiteHeaderAppSwitcher';

const { iotPrefix } = settings;

const adminPageWorkspaces = [
  {
    id: 'workspace1',
    name: 'Workspace 1',
    href: 'https://www.ibm.com/1',
    adminHref: 'https://www.ibm.com/1/admin',
    isCurrent: false,
    applications: [
      {
        id: 'monitor',
        name: 'Monitor',
        href: 'https://www.ibm.com/1/monitor',
        isExternal: false,
      },
      {
        id: 'health',
        name: 'Health',
        href: 'https://www.ibm.com/1/health',
        isExternal: false,
      },
    ],
  },
  {
    id: 'workspace2',
    name: 'Workspace 2',
    href: 'https://www.ibm.com/2',
    isCurrent: false,
    applications: [
      {
        id: 'monitor',
        name: 'Monitor',
        href: 'https://www.ibm.com/2/monitor',
        isExternal: false,
      },
      {
        id: 'manage',
        name: 'Manage',
        href: 'https://www.ibm.com/2/manage',
        isExternal: true,
      },
    ],
  },
  {
    id: 'workspace3',
    name: 'Workspace 3',
    href: 'https://www.ibm.com/3',
    adminHref: 'https://www.ibm.com/3/admin',
    isCurrent: false,
    applications: [
      {
        id: 'health',
        name: 'Health',
        href: 'https://www.ibm.com/3/health',
        isExternal: false,
      },
      {
        id: 'manage',
        name: 'Manage',
        href: 'https://www.ibm.com/3/manage',
        isExternal: false,
      },
    ],
  },
  {
    id: 'workspace4',
    name: 'Workspace 4',
    href: 'https://www.ibm.com/4',
    adminHref: 'https://www.ibm.com/4/admin',
    isCurrent: false,
    applications: [],
  },
];

// const nonWorkspaceBasedPageWorkspaces = [...adminPageWorkspaces];

// const workspaceBasedPageWorkspaces = adminPageWorkspaces.map((wo) => ({
//   ...wo,
//   isCurrent: wo.id === 'workspace3',
// }));

const globalApplications = [
  {
    id: 'appconnect',
    name: 'AppConnect',
    href: 'https://www.ibm.com/appconnect',
    isExternal: true,
  },
];

const commonProps = {
  workspaces: adminPageWorkspaces,
  adminLink: 'https://www.ibm.com',
  noAccessLink: 'https://www.ibm.com',
  globalApplications: [
    {
      id: 'appconnect',
      name: 'AppConnect',
      href: 'https://www.ibm.com/appconnect',
      isExternal: true,
    },
  ],
};

const testIdPrefix = 'multi-workspace-suite-header-app-switcher';

describe('MultiWorkspaceSuiteHeaderAppSwitcher', () => {
  let originalWindowLocation;
  beforeEach(() => {
    originalWindowLocation = { ...window.location };
  });

  afterEach(() => {
    window.location = { ...originalWindowLocation };
  });
  it('renders workspace picker by default in admin page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    commonProps.workspaces.forEach((workspace) =>
      expect(screen.queryByTestId(`${testIdPrefix}--${workspace.id}`)).toBeTruthy()
    );
  });
  it('renders app switcher when a workspace is selected in admin page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace3`));
    expect(screen.queryByTestId(`${testIdPrefix}--selected-workspace`)).toBeTruthy();
    expect(screen.queryByTestId(`${testIdPrefix}--all-applications`)).toBeTruthy();
  });
  it('keyboard navigates to the app switcher by selecting a workspace in admin page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--workspace3`, '{enter}'));
    expect(screen.queryByTestId(`${testIdPrefix}--selected-workspace`)).toBeTruthy();
    expect(screen.queryByTestId(`${testIdPrefix}--all-applications`)).toBeTruthy();
  });
  it('renders workspace again when the change workspace button is clicked in admin page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Make sure that the "back to app switcher" is not showing when no workspace has been selected
    expect(screen.queryByTestId(`${testIdPrefix}--back-to-switcher`)).toBeFalsy();
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace2`));
    // Click the "Change Workspace" button to go back to the workspace picker
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--selected-workspace`));
    // Make sure that the "back to app switcher" is now showing
    expect(screen.queryByTestId(`${testIdPrefix}--back-to-switcher`)).toBeTruthy();
    // Make sure the selected workspace button has the selected class
    expect(screen.queryByTestId(`${testIdPrefix}--workspace2`)).toHaveClass(
      `${iotPrefix}--btn-icon-selection--selected`
    );
  });
  it('clicks the workspace all applications link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace1`));
    // Click the All Applications button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--all-applications`));
    // Check the page redirection
    expect(window.location.href).toBe(
      commonProps.workspaces.find((wo) => wo.id === 'workspace1').href
    );
  });
  it('keyboard navigates the workspace all applications link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace1`));
    // Select the All Applications button using the keyboard
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--all-applications`, '{enter}'));
    // Check the page redirection
    expect(window.location.href).toBe(
      commonProps.workspaces.find((wo) => wo.id === 'workspace1').href
    );
  });
  it('clicks the workspace admin link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace1`));
    // Click the Workspace Admin button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-admin`));
    // Check the page redirection
    expect(window.location.href).toBe(
      commonProps.workspaces.find((wo) => wo.id === 'workspace1').adminHref
    );
  });
  it('doesnt show workspace admin button if the url is not in the workspace data', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace2`));
    // Check that the workspace abmin button does not exist
    expect(screen.queryByTestId(`${testIdPrefix}--workspace-admin`)).toBeFalsy();
  });
  it('shows the empty state components in the applications section if no applications are available', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace4`));
    // Check that the empty state component is rendered
    expect(screen.queryByTestId(`${testIdPrefix}--no-app`)).toBeTruthy();
  });
  it('clicks a workspace application link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace1`));
    // Click an application button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--health`));
    // Check the page redirection
    expect(window.location.href).toBe(
      commonProps.workspaces
        .find((wo) => wo.id === 'workspace1')
        .applications.find((app) => app.id === 'health').href
    );
  });
  it('clicks a workspace application link in admin page (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    render(
      <MultiWorkspaceSuiteHeaderAppSwitcher
        isAdminView
        {...commonProps}
        onRouteChange={async () => false}
      />
    );
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace1`));
    // Click an application button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--health`));
    // Check that page redirection doesn't happen
    expect(window.location.href).not.toBe(
      commonProps.workspaces
        .find((wo) => wo.id === 'workspace1')
        .applications.find((app) => app.id === 'health').href
    );
  });
  it('clicks an external workspace application link in admin page and gets a new tab with the application', async () => {
    delete window.location;
    window.location = { href: '' };
    window.open = jest.fn();
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace2`));
    // Click the Workspace Admin button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--manage`));
    // Check the new tab with the app
    expect(window.open).toHaveBeenCalledWith(
      commonProps.workspaces
        .find((wo) => wo.id === 'workspace2')
        .applications.find((app) => app.id === 'manage').href,
      '_blank',
      'noopener noreferrer'
    );
  });

  it('clicks the suite admin link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace1`));
    // Click the Suite Admin button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--admin`));
    // Check the page redirection
    expect(window.location.href).toBe(commonProps.adminLink);
  });

  it('clicks the no access link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace4`));
    // Click the Suite Admin button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--no-access`));
    // Check the page redirection
    expect(window.location.href).toBe(commonProps.noAccessLink);
  });

  it('shows loading state', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher />);
    // Expect skeletons
    expect(screen.getByTestId(`${testIdPrefix}--loading`)).toBeVisible();
  });

  it('calls the default onRouteChange in admin page', async () => {
    jest.spyOn(MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps, 'onRouteChange');

    render(<MultiWorkspaceSuiteHeaderAppSwitcher isAdminView {...commonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace1`));
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--all-applications`));
    const expectedHref = commonProps.workspaces.find((wo) => wo.id === 'workspace1').href;
    expect(
      MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps.onRouteChange
    ).toHaveBeenCalledWith('NAVIGATOR', expectedHref, { workspaceId: 'workspace1' });
    expect(window.location.href).toBe(expectedHref);
    jest.restoreAllMocks();
  });

  it('renders app global applicatons in admin page', async () => {
    jest.spyOn(MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps, 'onRouteChange');
    render(
      <MultiWorkspaceSuiteHeaderAppSwitcher
        isAdminView
        {...commonProps}
        globalApplications={globalApplications}
      />
    );
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace1`));
    expect(screen.queryByTestId(`${testIdPrefix}--selected-workspace`)).toBeTruthy();
    const globalAppButton = screen.getByTestId(`${testIdPrefix}--global-appconnect`);
    expect(globalAppButton).toBeVisible();
    await userEvent.click(globalAppButton);
    const expectedGlobalAppUrl = globalApplications.find((app) => app.id === 'appconnect').href;
    expect(MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps.onRouteChange).toHaveBeenCalledWith(
      'APPLICATION',
      expectedGlobalAppUrl,
      {
        appId: 'appconnect',
      }
    );
    jest.restoreAllMocks();
  });
});
