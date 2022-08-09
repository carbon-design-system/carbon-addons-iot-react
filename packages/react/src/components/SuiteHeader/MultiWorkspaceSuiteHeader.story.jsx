/* eslint-disable no-script-url */
/* eslint-disable no-alert */

import React, { createElement, useEffect, useState } from 'react';
import { text, object, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ScreenOff16, Switcher24, Home24, RecentlyViewed24, Apps24 } from '@carbon/icons-react';
import Group from '@carbon/icons-react/es/group/24';
import NotificationOn from '@carbon/icons-react/es/notification/24';
import Bee from '@carbon/icons-react/es/bee/24';
import Car from '@carbon/icons-react/es/car/24';
import Chat from '@carbon/icons-react/es/chat/24';
import { partition } from 'lodash-es';

import { settings } from '../../constants/Settings';
import { Tag } from '../Tag';

import SuiteHeader from './SuiteHeader';
import SuiteHeaderI18N from './i18n';
import SuiteHeaderREADME from './SuiteHeader.mdx';

const { prefix } = settings;

const RouterComponent = ({ children, ...rest }) => <div {...rest}>{children}</div>;

const routes = {
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
  workspaceId: 'workspace1',
  domain: '',
};

const workspaces = [
  {
    id: 'workspace1',
    name: 'Workspace 1',
    href: 'https://www.ibm.com',
    adminHref: 'https://www.ibm.com',
    isCurrent: false,
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
        isExternal: false,
      },
    ],
  },
  {
    id: 'workspace2',
    name: 'Workspace 2',
    href: 'https://www.ibm.com',
    adminHref: 'https://www.ibm.com',
    isCurrent: false,
    applications: [
      {
        id: 'monitor',
        name: 'Monitor',
        href: 'https://www.ibm.com',
      },
    ],
  },
  {
    id: 'workspace3',
    name: 'Workspace 3',
    href: 'https://www.ibm.com',
    isCurrent: true,
    applications: [
      {
        id: 'health',
        name: 'Health',
        href: 'https://www.ibm.com',
      },
      {
        id: 'manage',
        name: 'Manage',
        href: 'https://www.ibm.com',
      },
    ],
  },
  {
    id: 'workspace4',
    name: 'Workspace 4',
    href: 'https://www.ibm.com',
    isCurrent: false,
    applications: [],
  },
];

const globalApplications = [
  {
    id: 'appconnect',
    name: 'AppConnect',
    href: 'https://www.ibm.com',
    isExternal: true,
  },
];

const customActionItems = [
  {
    label: 'aHiddenIcon',
    btnContent: <ScreenOff16 id="hidden-button" fill="white" description="hidden-button-icon" />,
  },
  {
    label: 'bell',
    btnContent: (
      <span id="bell-icon">
        <NotificationOn id="notification-button" fill="white" description="Icon" />
      </span>
    ),
    onClick: action('bell clicked'),
  },
  {
    label: 'bee',
    hasHeaderPanel: true,
    btnContent: (
      <span id="bee-icon">
        <Bee
          fill="white"
          description="Icon"
          className={`${prefix}--header__menu-item ${prefix}--header__menu-title`}
        />
      </span>
    ),
    childContent: [
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is a title',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: <span id="a-message">this is my message to you</span>,
      },
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is a title',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: (
          <span id="a-message">
            this is my really long message to you that should be truncated...
          </span>
        ),
      },
      {
        metaData: {
          element: 'button',
        },
        content: (
          <span id="an-email">
            JohnDoe@ibm.com
            <Chat fill="white" description="Icon" />
          </span>
        ),
      },
    ],
  },
  {
    label: 'car',
    btnContent: (
      <span id="car-icon">
        <Car fill="white" description="Icon" />
      </span>
    ),
    childContent: [
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is my message to you',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: <span id="another-message">this is my message to you</span>,
      },
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is my really long message to you that should be truncated...',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: (
          <span id="another-message">
            this is my really long message to you that should be truncated...
          </span>
        ),
      },
      {
        metaData: {
          element: 'button',
        },
        content: (
          <span id="another-email">
            JohnDoe@ibm.com
            <Chat fill="white" description="Icon" />
          </span>
        ),
      },
    ],
  },
];

const customHelpLinks = [
  {
    metaData: {
      href: 'http://www.ibm.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      element: 'a',
    },
    content: <span id="custom-help-link">{'{A custom help link}'}</span>,
  },
  {
    metaData: {
      href: 'http://google.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      element: 'a',
    },
    content: <span id="another-custom-help-link">{'{Another custom help link}'}</span>,
  },
  {
    metaData: {
      element: 'a',
      href: 'javascript:void(0)',
      onClick: () => alert('custom help menu action'),
    },
    content: (
      <span id="yet-another-custom-help-link">
        {'{Yet another custom help link that is really long and should be truncated...}'}
      </span>
    ),
  },
];

const customProfileLinks = [
  {
    metaData: {
      href: 'http://www.ibm.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      element: 'a',
    },
    content: <span id="custom-profile-link">{'{A custom profile link}'}</span>,
  },
  {
    metaData: {
      href: 'http://google.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      element: 'a',
    },
    content: <span id="another-custom-profile-link">{'{Another custom profile link}'}</span>,
  },
  {
    metaData: {
      element: 'a',
      href: 'javascript:void(0)',
      onClick: () => alert('custom profile menu action'),
    },
    content: (
      <span id="yet-another-custom-profile-link">
        {'{Yet another custom profile link that is really long and should be truncated...}'}
      </span>
    ),
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
  title: '1 - Watson IoT/UI shell/SuiteHeader/Multi-workspace',

  parameters: {
    component: SuiteHeader,
    docs: {
      page: SuiteHeaderREADME,
    },
  },
};

export const AdminView = () => {
  const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
  return (
    <SuiteHeader
      suiteName={text('suiteName', 'Application Suite')}
      appName={text('appName', 'Application Name')}
      userDisplayName={text('userDisplayName', 'Admin User')}
      username={text('username', 'adminuser')}
      isAdminView
      routes={object('routes', routes)}
      i18n={SuiteHeaderI18N[language]}
      workspaces={object('workspaces', workspaces)}
      globalApplications={object('globalApplications', globalApplications)}
    />
  );
};

AdminView.storyName = 'Admin view';

export const NonAdminView = () => {
  const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
  return (
    <SuiteHeader
      suiteName={text('suiteName', 'Application Suite')}
      appName={text('appName', 'Application Name')}
      userDisplayName={text('userDisplayName', 'Standard User')}
      username={text('username', 'standard')}
      isAdminView={false}
      routes={object('routes', routes)}
      i18n={SuiteHeaderI18N[language]}
      workspaces={object('workspaces', workspaces)}
      globalApplications={object('globalApplications', globalApplications)}
    />
  );
};

NonAdminView.storyName = 'Non-admin view';

export const AdminViewSingleWorkspace = () => {
  const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
  return (
    <SuiteHeader
      suiteName={text('suiteName', 'Application Suite')}
      appName={text('appName', 'Application Name')}
      userDisplayName={text('userDisplayName', 'Admin User')}
      username={text('username', 'adminuser')}
      isAdminView
      routes={object('routes', routes)}
      i18n={SuiteHeaderI18N[language]}
      workspaces={object('workspaces', [workspaces[0]])}
      globalApplications={object('globalApplications', globalApplications)}
    />
  );
};

AdminViewSingleWorkspace.storyName = 'Admin view - Single workspace';

export const NonAdminViewSingleWorkspace = () => {
  const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
  return (
    <SuiteHeader
      suiteName={text('suiteName', 'Application Suite')}
      appName={text('appName', 'Application Name')}
      userDisplayName={text('userDisplayName', 'Standard User')}
      username={text('username', 'standard')}
      isAdminView={false}
      routes={object('routes', routes)}
      i18n={SuiteHeaderI18N[language]}
      workspaces={object('workspaces', [workspaces[0]])}
      globalApplications={object('globalApplications', globalApplications)}
    />
  );
};

NonAdminViewSingleWorkspace.storyName = 'Non-admin view - Single workspace';

export const NavigationalActionsBlocked = () => {
  const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
  return (
    <SuiteHeader
      suiteName={text('suiteName', 'Application Suite')}
      appName={text('appName', 'Application Name')}
      userDisplayName={text('userDisplayName', 'Admin User')}
      username={text('username', 'adminuser')}
      isAdminView={boolean('isAdminView', true)}
      routes={object('routes', routes)}
      i18n={SuiteHeaderI18N[language]}
      workspaces={object('workspaces', workspaces)}
      globalApplications={object('globalApplications', globalApplications)}
      onRouteChange={() => Promise.resolve(false)}
    />
  );
};

NavigationalActionsBlocked.storyName = 'Navigational actions blocked';

export const HeaderWithExtraContent = () => {
  const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
  return (
    <SuiteHeader
      suiteName={text('suiteName', 'Application Suite')}
      appName={text('appName', 'Application Name')}
      userDisplayName={text('userDisplayName', 'Admin User')}
      username={text('username', 'adminuser')}
      isAdminView={boolean('isAdminView', true)}
      routes={object('routes', routes)}
      i18n={SuiteHeaderI18N[language]}
      workspaces={object('workspaces', workspaces)}
      globalApplications={object('globalApplications', globalApplications)}
      extraContent={<Tag size="sm">Extra content</Tag>}
    />
  );
};
HeaderWithExtraContent.storyName = 'Header with extra content';

export const HeaderWithSideNav = () => {
  const demoMostRecentLinks = boolean('Demo most recent links', true);
  const [linksState, setLinksState] = useState([]);
  const [recentLinksState, setRecentLinksState] = useState([]);

  const onSideNavMenuItemClick = (linkLabel) => {
    let activeLink;
    setLinksState((currentLinks) =>
      currentLinks.map((group) => {
        if (group.childContent) {
          return {
            ...group,
            childContent: group.childContent.map((child) => {
              if (linkLabel === child.metaData.label) {
                activeLink = {
                  ...child,
                  isActive: false,
                };
              }
              return {
                ...child,
                isActive: linkLabel === child.metaData.label,
              };
            }),
          };
        }

        return group;
      })
    );

    setRecentLinksState((currentLinks) => {
      return currentLinks.map((group) => {
        const recentLinks =
          activeLink &&
          group.childContent.filter((child) => child.metaData.label === linkLabel).length === 0
            ? [activeLink, ...group.childContent]
            : group.childContent;

        const [firstChild, restChildren] = partition(
          recentLinks,
          (child) => child.content === linkLabel
        );

        if (group.childContent) {
          return {
            ...group,
            isActive: false,
            childContent: [...firstChild, ...restChildren],
          };
        }
        return group;
      });
    });
  };

  useEffect(() => {
    setLinksState([
      {
        icon: Home24,
        isEnabled: true,
        isPinned: true,
        metaData: {
          onClick: () => onSideNavMenuItemClick('Home'),
          tabIndex: 0,
          label: 'Home',
        },
        linkContent: 'Home',
      },
      {
        isEnabled: true,
        icon: Switcher24,
        metaData: {
          label: 'Dashboards',
          element: 'button',
        },
        linkContent: 'Dashboards',
        childContent: [
          {
            metaData: {
              label: 'Link 1',
              title: 'Link 1',
              onClick: () => onSideNavMenuItemClick('Link 1'),
              element: 'button',
            },
            content: 'Link 1',
          },
          {
            metaData: {
              label: 'Link 2',
              title: 'Link 2',
              onClick: () => onSideNavMenuItemClick('Link 2'),
            },
            content: 'Link 2',
          },
        ],
      },
      {
        isEnabled: true,
        icon: Group,
        metaData: {
          label: 'Members',
          element: 'button',
        },
        linkContent: 'Members',
        childContent: [
          {
            metaData: {
              label: 'Link 3',
              title: 'Link 3',
              onClick: () => onSideNavMenuItemClick('Link 3'),
              element: 'button',
            },
            content: 'Link 3',
            isActive: true,
          },
          {
            metaData: {
              label: 'Link 4',
              title: 'Link 4',
              onClick: () => onSideNavMenuItemClick('Link 4'),
              element: 'button',
            },
            content: 'Link 4',
            isActive: false,
          },
        ],
      },
      demoMostRecentLinks
        ? {
            icon: Apps24,
            isEnabled: true,
            metaData: {
              onClick: action('menu click'),
              tabIndex: 0,
              label: 'Apps',
              element: RouterComponent,
            },
            linkContent: 'Apps',
            childContent: [
              {
                metaData: {
                  label: 'App 1',
                  title: 'App 1',
                  onClick: () => onSideNavMenuItemClick('App 1'),
                  element: 'button',
                },
                content: 'App 1',
              },
              {
                metaData: {
                  label: 'App 2',
                  title: 'App 2',
                  onClick: () => onSideNavMenuItemClick('App 2'),
                  element: 'button',
                },
                content: 'App 2',
              },
              {
                metaData: {
                  label: 'App 3',
                  title: 'App 3',
                  onClick: () => onSideNavMenuItemClick('App 3'),
                  element: 'button',
                },
                content: 'App 3',
              },
            ],
          }
        : {},
    ]);

    setRecentLinksState([
      {
        icon: RecentlyViewed24,
        isEnabled: true,
        metaData: {
          onClick: action('menu click'),
          tabIndex: 0,
          label: 'My recent links',
          element: RouterComponent,
        },
        linkContent: 'My recent links',
        childContent: [
          {
            metaData: {
              label: 'App 1',
              title: 'App 1',
              onClick: () => onSideNavMenuItemClick('App 1'),
              element: 'button',
            },
            content: 'App 1',
          },
          {
            metaData: {
              label: 'App 2',
              title: 'App 2',
              onClick: () => onSideNavMenuItemClick('App 2'),
              element: 'button',
            },
            content: 'App 2',
          },
          {
            metaData: {
              label: 'App 3',
              title: 'App 3',
              onClick: () => onSideNavMenuItemClick('App 3'),
              element: 'button',
            },
            content: 'App 3',
          },
        ],
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SuiteHeader
        suiteName="Application Suite"
        appName="Application Name"
        userDisplayName="Admin User"
        username="adminuser"
        isAdminView={boolean('isAdminView', true)}
        routes={routes}
        workspaces={object('workspaces', workspaces)}
        sideNavProps={{
          links: linksState,
          recentLinks: demoMostRecentLinks ? recentLinksState : [],
        }}
      />
    </>
  );
};

HeaderWithSideNav.decorators = [createElement];
HeaderWithSideNav.storyName = 'Header with side nav';

export const HeaderWithCustomSideNav = () => (
  <SuiteHeader
    suiteName="Application Suite"
    appName="Application Name"
    userDisplayName="Admin User"
    username="adminuser"
    routes={routes}
    workspaces={workspaces}
    globalApplications={globalApplications}
    hasSideNav
    onSideNavToggled={() => alert('onSideNavToggled')}
  />
);
HeaderWithCustomSideNav.storyName = 'Header with application-controlled side nav';

export const HeaderWithCustomActionItems = () => (
  <SuiteHeader
    suiteName="Application Suite"
    appName="Application Name"
    userDisplayName="Admin User"
    username="adminuser"
    routes={routes}
    workspaces={workspaces}
    globalApplications={globalApplications}
    customActionItems={customActionItems}
    customHelpLinks={customHelpLinks}
    customProfileLinks={customProfileLinks}
    customApplications={customApplications}
    // isActionItemVisible={(item) => {
    //   if (item.label === 'aHiddenIcon' || item.id === 'app-switcher') {
    //     return false;
    //   }
    //   return true;
    // }}
  />
);

HeaderWithCustomActionItems.storyName = 'Header with custom action items and hidden icons';

export const HeaderWithSurveyNotification = () => {
  const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
  return (
    <SuiteHeader
      suiteName={text('suiteName', 'Application Suite')}
      appName={text('appName', 'Application Name')}
      userDisplayName={text('userDisplayName', 'Admin User')}
      username={text('username', 'adminuser')}
      isAdminView={boolean('isAdminView', false)}
      routes={object('routes', routes)}
      i18n={{
        ...SuiteHeaderI18N[language],
        surveyTitle: (solutionName) =>
          SuiteHeaderI18N[language].surveyTitle.replace('{solutionName}', solutionName),
        profileLogoutModalBody: (solutionName, userName) =>
          SuiteHeaderI18N[language].profileLogoutModalBody
            .replace('{solutionName}', solutionName)
            .replace('{userName}', userName),
      }}
      workspaces={workspaces}
      globalApplications={globalApplications}
      surveyData={object('survey', {
        surveyLink: 'https://www.ibm.com',
        privacyLink: 'https://www.ibm.com',
      })}
    />
  );
};

HeaderWithSurveyNotification.storyName = 'Header with survey notification';

export const LoadingState = () => {
  return <SuiteHeader suiteName="Application Suite" appName="Application Name" />;
};

LoadingState.storyName = 'Loading state';

export const HeaderWithIdleLogoutConfirmation = () => (
  <>
    <SuiteHeader
      suiteName="Application Suite"
      appName="Application Name"
      userDisplayName="Admin User"
      username="adminuser"
      routes={routes}
      idleTimeoutData={{
        timeout: 10,
        countdown: 10,
        cookieName: '_user_inactivity_timeout',
      }}
      workspaces={workspaces}
      globalApplications={globalApplications}
    />
    <p>The logout confirmation dialog will show up after 10 seconds of inactivity.</p>
    <p>
      Open this story in another tab, wait for the dialog to show up in both tabs, then click
      &ldquo;Stay logged in&ldquo; to see the other dialog go away.
    </p>
  </>
);

HeaderWithIdleLogoutConfirmation.storyName = 'Header with idle user detection';
