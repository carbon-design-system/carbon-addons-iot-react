import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AppSwitcher from '@carbon/icons-react/lib/app-switcher/24';
import Chip from '@carbon/icons-react/lib/chip/24';
import Dashboard from '@carbon/icons-react/lib/dashboard/24';
import Group from '@carbon/icons-react/lib/group/24';
import { HeaderContainer } from 'carbon-components-react/lib/components/UIShell';

import Header from '../Header';

import SideNav from './SideNav';

React.Fragment = ({ children }) => children;

const RouterComponent = ({ children, ...rest }) => <div {...rest}>{children}</div>;

/* eslint-disable*/
const links = [
  {
    icon: AppSwitcher,
    isEnabled: true,
    metaData: {
      onClick: action('menu click'),
      tabIndex: 0,
      label: 'Boards',
      element: RouterComponent,
    },
    linkContent: 'Boards',
  },
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
  {
    isEnabled: false,
    icon: Dashboard,
    metaData: {
      label: 'Dashboards',
      href: 'https://google.com',
      element: 'a',
      target: '_blank',
    },
    linkContent: 'Dashboards',
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
          label: 'Devices',
          onClick: action('inner menu click'),
          element: 'button',
        },
        content: 'Yet another link',
        isActive: true,
      },
    ],
  },
];

const switcherProps = {
  options: ['ExampleOne', 'ExampleTwo'],
  labelText: 'ExampleOne',
  onChange: () => {},
  className: 'class',
  switcherTitle: 'Applications',
};

// const link = <Icon name="header--help" fill="white" description="Icon" />;
const HeaderProps = {
  user: 'JohnDoe@ibm.com',
  tenant: 'TenantId: Acme',
  className: 'custom-class-name',
  appName: 'Watson IoT Platform ',
  actionItems: [
    {
      label: 'user',
      onClick: action('click'),
      btnContent: (
        <Group
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
    },
  ],
};

storiesOf('Watson IoT|SideNav', module).add(
  'SideNav component',
  () => (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header
            {...HeaderProps}
            isSideNavExpanded={isSideNavExpanded}
            onClickSideNavExpand={onClickSideNavExpand}
          />
          <SideNav
            links={links}
            isSideNavExpanded={isSideNavExpanded}
            onClickSideNavExpand={onClickSideNavExpand}
            switcherProps={switcherProps}
          />
        </>
      )}
    />
  ),
  {
    info: {
      text: `
      When implementing the Header and SideNav components you must utilized the HeaderContainer component

      <br/>

      ~~~js
      <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header
            {...HeaderProps}
            isSideNavExpanded={isSideNavExpanded}
            onClickSideNavExpand={onClickSideNavExpand}
          />
          <SideNav
            links={links}
            isSideNavExpanded={isSideNavExpanded}
            onClickSideNavExpand={onClickSideNavExpand}
          />
        </>
      )}
    />

      ~~~

      `,
    },
  }
);
