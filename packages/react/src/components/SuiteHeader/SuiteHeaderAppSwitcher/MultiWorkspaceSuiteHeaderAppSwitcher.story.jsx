import React from 'react';
import { text, object } from '@storybook/addon-knobs';

import MultiWorkspaceSuiteHeaderAppSwitcher from './MultiWorkspaceSuiteHeaderAppSwitcher';
import SuiteHeaderAppSwitcherLoading from './SuiteHeaderAppSwitcherLoading';

const icon =
  'PHN2ZyBpZD0iTWF4aW1vTW9uaXRvciIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0ibzJ5MXBlZWUxYSIgeDE9Ii03ODciIHkxPSI1NjkuNSIgeDI9Ii03ODIiIHkyPSI1NjkuNSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg4MTIgLTU1NikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4zIi8+PHN0b3Agb2Zmc2V0PSIuOSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImM1ZzBzcG5kNGMiIHgxPSItLjAwMiIgeTE9IjMyLjAwNCIgeDI9IjMxLjk5OCIgeTI9Ii4wMDQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLjAwMiAtLjAwNCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4xIiBzdG9wLWNvbG9yPSIjYTM2ZWZkIi8+PHN0b3Agb2Zmc2V0PSIuOSIgc3RvcC1jb2xvcj0iIzEwNjJmYyIvPjwvbGluZWFyR3JhZGllbnQ+PG1hc2sgaWQ9IjVmOGVxODYxeWIiIHg9IjAiIHk9IjAiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTExIDIzYTEgMSAwIDAgMS0uODk1LS41NTNMNi4zODIgMTVIMnYtMmg1YTEgMSAwIDAgMSAuODk1LjU1M2wyLjg5NSA1Ljc5MUwxNi4wNDcgMi43YTEgMSAwIDAgMSAuOTMyLS43IDEuMDEgMS4wMSAwIDAgMSAuOTYuNjU4TDIxLjcgMTNIMjl2MmgtOGExIDEgMCAwIDEtLjkzOS0uNjU4bC0zLTguMjMzTDExLjk1MyAyMi4zYTEgMSAwIDAgMS0uODc0LjdIMTF6IiBzdHlsZT0iZmlsbDojZmZmIi8+PHBhdGggdHJhbnNmb3JtPSJyb3RhdGUoMTgwIDI3LjUgMTMuNSkiIHN0eWxlPSJmaWxsOnVybCgjbzJ5MXBlZWUxYSkiIGQ9Ik0yNSAxMWg1djVoLTV6Ii8+PC9tYXNrPjwvZGVmcz48ZyBzdHlsZT0ibWFzazp1cmwoIzVmOGVxODYxeWIpIj48cGF0aCBzdHlsZT0iZmlsbDp1cmwoI2M1ZzBzcG5kNGMpIiBkPSJNMCAwaDMydjMySDB6Ii8+PC9nPjxjaXJjbGUgY3g9IjIzLjUiIGN5PSIyNSIgcj0iMiIgc3R5bGU9ImZpbGw6IzAwMWQ2YyIvPjxwYXRoIGQ9Ik0zMC43OTEgMjQuNTYxYTguMTA4IDguMTA4IDAgMCAwLTE0LjU4MiAwTDE2IDI1bC4yMDkuNDM5YTguMTA4IDguMTA4IDAgMCAwIDE0LjU4MiAwTDMxIDI1em0tNy4yOTEgNC40N0E0LjAzMSA0LjAzMSAwIDEgMSAyNy41MzIgMjVhNC4wMzUgNC4wMzUgMCAwIDEtNC4wMzIgNC4wMzF6IiBzdHlsZT0iZmlsbDojMDAxZDZjIi8+PC9zdmc+';
// const icon =
//   'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMzM2IDI3MSI';
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
        icon,
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
    icon,
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
    <SuiteHeaderAppSwitcherLoading />
  </div>
);

LoadingState.storyName = 'Loading state';
