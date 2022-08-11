import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MultiWorkspaceSuiteHeaderAppSwitcher from './MultiWorkspaceSuiteHeaderAppSwitcher';

const icon =
  'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIKICAgICB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgogIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0ibGltZSIKICAgICAgc3Ryb2tlPSJibGFjayIgLz4KPC9zdmc+';
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
        icon,
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
        icon,
      },
      {
        id: 'manage',
        name: 'Manage',
        href: 'https://www.ibm.com/2/manage',
        isExternal: true,
        icon,
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
        icon,
      },
      {
        id: 'manage',
        name: 'Manage',
        href: 'https://www.ibm.com/3/manage',
        isExternal: false,
        icon,
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

const workspaceBasedPageWorkspaces = adminPageWorkspaces.map((wo) => ({
  ...wo,
  isCurrent: wo.id === 'workspace3',
}));

const adminPageCommonProps = {
  workspaces: adminPageWorkspaces,
  adminLink: 'https://www.ibm.com',
  noAccessLink: 'https://www.ibm.com',
  globalApplications: [
    {
      id: 'globalapp1',
      name: 'Global App 1',
      href: 'https://www.ibm.com/globalapp1',
      icon,
    },
    {
      id: 'globalapp2',
      name: 'Global App 2',
      href: 'https://www.ibm.com/globalapp2',
      isExternal: true,
    },
  ],
  customApplications: [
    {
      id: 'customapp1',
      name: 'Custom Application 1',
      href: 'https://www.ibm.com/globalapp1',
      icon,
    },
    {
      id: 'customapp2',
      name: 'Custom Application 2',
      href: 'https://www.ibm.com/globalapp2',
      isExternal: true,
    },
  ],
  isAdminView: true,
};

const workspaceBasedPageCommonProps = {
  ...adminPageCommonProps,
  workspaces: workspaceBasedPageWorkspaces,
  isAdminView: false,
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
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    adminPageCommonProps.workspaces.forEach((workspace) =>
      expect(screen.getByTestId(`${testIdPrefix}--workspace-${workspace.id}`)).toBeVisible()
    );
  });
  it('renders app switcher when a workspace is selected in admin page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace3`));
    expect(screen.getByTestId(`${testIdPrefix}--selected-workspace`)).toBeVisible();
    expect(screen.getByTestId(`${testIdPrefix}--all-applications`)).toBeVisible();
    expect(screen.getByTestId(`${testIdPrefix}--admin-workspace`)).toBeVisible();
  });
  it('keyboard navigates to the app switcher by selecting a workspace in admin page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--workspace-workspace3`, '{enter}'));
    expect(screen.getByTestId(`${testIdPrefix}--selected-workspace`)).toBeVisible();
    expect(screen.getByTestId(`${testIdPrefix}--all-applications`)).toBeVisible();
    expect(screen.getByTestId(`${testIdPrefix}--admin-workspace`)).toBeVisible();
  });
  it('renders workspace again when the change workspace button is clicked in admin page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Make sure that the "back to app switcher" is not showing when no workspace has been selected
    expect(screen.queryByTestId(`${testIdPrefix}--back-to-switcher`)).not.toBeInTheDocument();
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace2`));
    // Click the "Change Workspace" button to go back to the workspace picker
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--selected-workspace`));
    // Make sure that the "back to app switcher" is now showing
    expect(screen.getByTestId(`${testIdPrefix}--back-to-switcher`)).toBeVisible();
    // Make sure the selected workspace button has the selected class
    expect(screen.getByTestId(`${testIdPrefix}--workspace-workspace2`)).toHaveClass(
      'bx--side-nav__link--current'
    );
    // Go back to the app switcher apps
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--back-to-switcher`));
    // Check that application buttons are showing
    adminPageCommonProps.workspaces
      .find((wo) => wo.id === 'workspace2')
      .applications.forEach((app) =>
        expect(screen.getByTestId(`${testIdPrefix}--application-${app.id}`)).toBeVisible()
      );
  });
  it('keyboard navigates to the workspace again when the change workspace button is clicked in admin page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Make sure that the "back to app switcher" is not showing when no workspace has been selected
    expect(screen.queryByTestId(`${testIdPrefix}--back-to-switcher`)).not.toBeInTheDocument();
    // Select a workspace
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--workspace-workspace2`, '{enter}'));
    // Click the "Change Workspace" button to go back to the workspace picker
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--selected-workspace`, '{enter}'));
    // Make sure that the "back to app switcher" is now showing
    expect(screen.getByTestId(`${testIdPrefix}--back-to-switcher`)).toBeVisible();
    // Make sure the selected workspace button has the selected class
    expect(screen.getByTestId(`${testIdPrefix}--workspace-workspace2`)).toHaveClass(
      'bx--side-nav__link--current'
    );
    // Go back to the app switcher apps
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--back-to-switcher`, '{enter}'));
    // Check that application buttons are showing
    adminPageCommonProps.workspaces
      .find((wo) => wo.id === 'workspace2')
      .applications.forEach((app) =>
        expect(screen.getByTestId(`${testIdPrefix}--application-${app.id}`)).toBeVisible()
      );
  });
  it('clicks the workspace all applications link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace1`));
    // Click the All Applications button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--all-applications`));
    // Check the page redirection
    expect(window.location.href).toBe(
      adminPageCommonProps.workspaces.find((wo) => wo.id === 'workspace1').href
    );
  });
  it('keyboard navigates the workspace all applications link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace1`));
    // Select the All Applications button using the keyboard
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--all-applications`, '{enter}'));
    // Check the page redirection
    expect(window.location.href).toBe(
      adminPageCommonProps.workspaces.find((wo) => wo.id === 'workspace1').href
    );
  });
  it('clicks the workspace admin link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace1`));
    // Click the Workspace Admin button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--admin-workspace`));
    // Check the page redirection
    expect(window.location.href).toBe(
      adminPageCommonProps.workspaces.find((wo) => wo.id === 'workspace1').adminHref
    );
  });
  it('doesnt show workspace admin button in admin page if the url is not in the workspace data', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace2`));
    // Check that the workspace abmin button does not exist
    expect(screen.queryByTestId(`${testIdPrefix}--admin-workspace`)).not.toBeInTheDocument();
  });
  it('shows the empty state components in the applications section in admin pageif no applications are available', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace4`));
    // Check that the empty state component is rendered
    expect(screen.getByTestId(`${testIdPrefix}--no-app`)).toBeVisible();
  });
  it('clicks a workspace application link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace1`));
    // Click an application button
    const expectedAppId = adminPageCommonProps.workspaces.find((wo) => wo.id === 'workspace1')
      .applications[0].id;
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--application-${expectedAppId}`));
    // Check the page redirection
    expect(window.location.href).toBe(
      adminPageCommonProps.workspaces
        .find((wo) => wo.id === 'workspace1')
        .applications.find((app) => app.id === expectedAppId).href
    );
  });
  it('clicks a workspace application link in admin page (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    render(
      <MultiWorkspaceSuiteHeaderAppSwitcher
        {...adminPageCommonProps}
        onRouteChange={async () => false}
      />
    );
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace1`));
    // Click an application button
    const expectedAppId = adminPageCommonProps.workspaces.find((wo) => wo.id === 'workspace1')
      .applications[0].id;
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--application-${expectedAppId}`));
    // Check that page redirection doesn't happen
    expect(window.location.href).not.toBe(
      adminPageCommonProps.workspaces
        .find((wo) => wo.id === 'workspace1')
        .applications.find((app) => app.id === expectedAppId).href
    );
  });
  it('clicks an external workspace application link in admin page and gets a new tab with the application', async () => {
    delete window.location;
    window.location = { href: '' };
    window.open = jest.fn();
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace2`));
    // Click the Workspace Admin button
    const expectedAppId = adminPageCommonProps.workspaces
      .find((wo) => wo.id === 'workspace2')
      .applications.find((app) => app.isExternal).id;
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--application-${expectedAppId}`));
    // Check the new tab with the app
    expect(window.open).toHaveBeenCalledWith(
      adminPageCommonProps.workspaces
        .find((wo) => wo.id === 'workspace2')
        .applications.find((app) => app.id === expectedAppId).href,
      '_blank',
      'noopener noreferrer'
    );
  });

  it('clicks the suite admin link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace1`));
    // Click the Suite Admin button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--admin`));
    // Check the page redirection
    expect(window.location.href).toBe(adminPageCommonProps.adminLink);
  });

  it('clicks the no access link in admin page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace4`));
    // Click the Suite Admin button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--no-access`));
    // Check the page redirection
    expect(window.location.href).toBe(adminPageCommonProps.noAccessLink);
  });

  it('calls the default onRouteChange in admin page', async () => {
    jest.spyOn(MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps, 'onRouteChange');

    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace1`));
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--all-applications`));
    const expectedHref = adminPageCommonProps.workspaces.find((wo) => wo.id === 'workspace1').href;
    expect(
      MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps.onRouteChange
    ).toHaveBeenCalledWith('NAVIGATOR', expectedHref, { workspaceId: 'workspace1' });
    expect(window.location.href).toBe(expectedHref);
    jest.restoreAllMocks();
  });

  it('renders app global applicatons in admin page', async () => {
    jest.spyOn(MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps, 'onRouteChange');
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace1`));
    expect(screen.getByTestId(`${testIdPrefix}--selected-workspace`)).toBeVisible();
    const globalAppButton = screen.getByTestId(`${testIdPrefix}--global-application-globalapp1`);
    expect(globalAppButton).toBeVisible();
    await userEvent.click(globalAppButton);
    const expectedGlobalAppUrl = adminPageCommonProps.globalApplications.find(
      (app) => app.id === 'globalapp1'
    ).href;
    expect(MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps.onRouteChange).toHaveBeenCalledWith(
      'APPLICATION',
      expectedGlobalAppUrl,
      {
        appId: 'globalapp1',
      }
    );
    jest.restoreAllMocks();
  });
  it('renders app custom applicatons in admin page', async () => {
    jest.spyOn(MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps, 'onRouteChange');
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...adminPageCommonProps} />);
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace1`));
    expect(screen.getByTestId(`${testIdPrefix}--selected-workspace`)).toBeVisible();
    const globalAppButton = screen.getByTestId(`${testIdPrefix}--custom-application-customapp1`);
    expect(globalAppButton).toBeVisible();
    await userEvent.click(globalAppButton);
    const expectedGlobalAppUrl = adminPageCommonProps.customApplications.find(
      (app) => app.id === 'customapp1'
    ).href;
    expect(MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps.onRouteChange).toHaveBeenCalledWith(
      'APPLICATION',
      expectedGlobalAppUrl,
      {
        appId: 'customapp1',
      }
    );
    jest.restoreAllMocks();
  });
  it('renders the app switcher in single workspace mode in admn page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(
      <MultiWorkspaceSuiteHeaderAppSwitcher
        {...adminPageCommonProps}
        workspaces={[adminPageCommonProps.workspaces[0]]}
      />
    );
    // Check that the "back to app switcher" button is not showing because workspace picker is not supposed to show when only 1 workspace is available
    expect(screen.queryByTestId(`${testIdPrefix}--back-to-switcher`)).not.toBeInTheDocument();
    // Check that the "selected workspace" button it is not supposed to show when only 1 workspace is available
    expect(screen.queryByTestId(`${testIdPrefix}--selected-workspace`)).not.toBeInTheDocument();
    // Check that the All Applications button is visible
    expect(screen.getByTestId(`${testIdPrefix}--all-applications`)).toBeVisible();
    // Check that the Workspace Admin button is visible
    expect(screen.getByTestId(`${testIdPrefix}--admin-workspace`)).toBeVisible();
  });

  it('renders app switcher by default in workspace-based page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...workspaceBasedPageCommonProps} />);
    // Workspace picker should not be visible
    workspaceBasedPageCommonProps.workspaces.forEach((workspace) =>
      expect(
        screen.queryByTestId(`${testIdPrefix}--workspace-${workspace.id}`)
      ).not.toBeInTheDocument()
    );
    expect(screen.getByTestId(`${testIdPrefix}--selected-workspace`)).toBeVisible();
    expect(screen.getByTestId(`${testIdPrefix}--all-applications`)).toBeVisible();
    expect(screen.getByTestId(`${testIdPrefix}--admin-workspace`)).toBeVisible();
    // Check that application buttons are showing
    workspaceBasedPageCommonProps.workspaces
      .find((wo) => wo.isCurrent)
      .applications.forEach((app) =>
        expect(screen.getByTestId(`${testIdPrefix}--application-${app.id}`)).toBeVisible()
      );
  });

  it('redirects to the selected workspace in workspace-based page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...workspaceBasedPageCommonProps} />);
    const expectedSelectedWorkspaceName = workspaceBasedPageCommonProps.workspaces.find(
      (wo) => wo.isCurrent
    ).name;
    const { getByText } = within(screen.getByTestId(`${testIdPrefix}--selected-workspace`));
    expect(getByText(expectedSelectedWorkspaceName)).toBeInTheDocument();
    // Select a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--selected-workspace`));
    // Make sure that the "back to app switcher" is showing when a workspace has been selected by the default because of the isCurrent property
    expect(screen.getByTestId(`${testIdPrefix}--back-to-switcher`)).toBeVisible();
    // Navigate tp a workspace
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--workspace-workspace2`));
    // Check that a redirect to the workspace2 url is triggered
    expect(window.location.href).toBe(
      workspaceBasedPageCommonProps.workspaces.find((wo) => wo.id === 'workspace2').href
    );
  });

  it('keyboard navigates to the selected workspace page in workspace-based page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...workspaceBasedPageCommonProps} />);
    const expectedSelectedWorkspaceName = workspaceBasedPageCommonProps.workspaces.find(
      (wo) => wo.isCurrent
    ).name;
    const { getByText } = within(screen.getByTestId(`${testIdPrefix}--selected-workspace`));
    expect(getByText(expectedSelectedWorkspaceName)).toBeInTheDocument();
    // Select a workspace
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--selected-workspace`, '{enter}'));
    // Make sure that the "back to app switcher" is showing when a workspace has been selected by the default because of the isCurrent property
    expect(screen.getByTestId(`${testIdPrefix}--back-to-switcher`)).toBeVisible();
    // Navigate tp a workspace
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--workspace-workspace2`, '{enter}'));
    // Check that a redirect to the workspace2 url is triggered
    expect(window.location.href).toBe(
      workspaceBasedPageCommonProps.workspaces.find((wo) => wo.id === 'workspace2').href
    );
  });

  it('clicks the workspace all applications link in workspace-based page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...workspaceBasedPageCommonProps} />);
    // Click the All Applications button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--all-applications`));
    // Check the page redirection
    expect(window.location.href).toBe(
      workspaceBasedPageCommonProps.workspaces.find((wo) => wo.isCurrent).href
    );
  });
  it('keyboard navigates the workspace all applications link in workspace-based page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...workspaceBasedPageCommonProps} />);
    // Select the All Applications button using the keyboard
    await userEvent.type(screen.getByTestId(`${testIdPrefix}--all-applications`, '{enter}'));
    // Check the page redirection
    expect(window.location.href).toBe(
      workspaceBasedPageCommonProps.workspaces.find((wo) => wo.isCurrent).href
    );
  });
  it('clicks the workspace admin link in workspace-based page and gets redirected to it', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<MultiWorkspaceSuiteHeaderAppSwitcher {...workspaceBasedPageCommonProps} />);
    // Click the Workspace Admin button
    await userEvent.click(screen.getByTestId(`${testIdPrefix}--admin-workspace`));
    // Check the page redirection
    expect(window.location.href).toBe(
      workspaceBasedPageCommonProps.workspaces.find((wo) => wo.isCurrent).adminHref
    );
  });

  it('renders the app switcher in single workspace mode in workspace-based page', async () => {
    delete window.location;
    window.location = { href: '' };
    render(
      <MultiWorkspaceSuiteHeaderAppSwitcher
        {...workspaceBasedPageCommonProps}
        workspaces={[workspaceBasedPageCommonProps.workspaces.find((wo) => wo.isCurrent)]}
      />
    );
    // Check that the "back to app switcher" button is not showing because workspace picker is not supposed to show when only 1 workspace is available
    expect(screen.queryByTestId(`${testIdPrefix}--back-to-switcher`)).not.toBeInTheDocument();
    // Check that the "selected workspace" button it is not supposed to show when only 1 workspace is available
    expect(screen.queryByTestId(`${testIdPrefix}--selected-workspace`)).not.toBeInTheDocument();
    // Check that the All Applications button is visible
    expect(screen.getByTestId(`${testIdPrefix}--all-applications`)).toBeVisible();
    // Check that the Workspace Admin button is visible
    expect(screen.getByTestId(`${testIdPrefix}--admin-workspace`)).toBeVisible();
  });
});
