import React from 'react';
import { text, object } from '@storybook/addon-knobs';

import MultiWorkspaceSuiteHeaderAppSwitcher from './MultiWorkspaceSuiteHeaderAppSwitcher';

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

const nonWorkspaceBasedPageWorkspaces = [...adminPageWorkspaces];

const workspaceBasedPageWorkspaces = adminPageWorkspaces.map((wo) => ({
  ...wo,
  isCurrent: wo.id === 'workspace3',
}));

const globalApplications = [
  {
    id: 'appconnect',
    name: 'AppConnect',
    href: 'https://www.ibm.com/appconnect',
    isExternal: true,
  },
];

const customApplications = [
  {
    id: 'customapp1',
    name: 'Custom Application',
    href: 'https://www.ibm.com',
  },
  {
    id: 'customapp2',
    name: 'External Custom Application',
    href: 'https://google.com',
    isExternal: true,
  },
];

export default {
  title: '1 - Watson IoT/UI Shell/SuiteHeader/Multi-workspace/MultiWorkspaceSuiteHeaderAppSwitcher',

  parameters: {
    component: MultiWorkspaceSuiteHeaderAppSwitcher,
  },
};

export const AdminPage = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      isAdminView
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', adminPageWorkspaces)}
      globalApplications={object('globalApplications', globalApplications)}
    />
  </div>
);

AdminPage.storyName = 'Admin page - Many workspaces';

export const WorkspaceBasedPage = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', workspaceBasedPageWorkspaces)}
      globalApplications={object('globalApplications', globalApplications)}
    />
  </div>
);

WorkspaceBasedPage.storyName = 'Workspace-based page - Many workspaces';

export const NonWorkspaceBasedPage = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', nonWorkspaceBasedPageWorkspaces)}
      globalApplications={object('globalApplications', globalApplications)}
    />
  </div>
);

NonWorkspaceBasedPage.storyName = 'Non-workspace-based page - Many workspaces';

export const AdminPageSingleWorkspace = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      isAdminView
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', [nonWorkspaceBasedPageWorkspaces[0]])}
      globalApplications={object('globalApplications', globalApplications)}
    />
  </div>
);

AdminPageSingleWorkspace.storyName = 'Admin page - Single workspace';

export const WorkspaceBasedSingleWorkspace = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', [workspaceBasedPageWorkspaces.find((wo) => wo.isCurrent)])}
      globalApplications={object('globalApplications', globalApplications)}
    />
  </div>
);

WorkspaceBasedSingleWorkspace.storyName = 'Workspace-based page - Single workspace';

export const NonWorkspaceBasedSingleWorkspace = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', [nonWorkspaceBasedPageWorkspaces[0]])}
      globalApplications={object('globalApplications', globalApplications)}
    />
  </div>
);

NonWorkspaceBasedSingleWorkspace.storyName = 'Non-workspace-based page - Single workspace';

export const WithCustomApplications = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', workspaceBasedPageWorkspaces)}
      globalApplications={object('globalApplications', globalApplications)}
      customApplications={object('customApplications', customApplications)}
    />
  </div>
);

WithCustomApplications.storyName = 'With custom applications';

export const LoadingState = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher />
  </div>
);

LoadingState.storyName = 'Loading state';
