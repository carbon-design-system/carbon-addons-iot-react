import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { rem } from 'polished';
import styled from 'styled-components';
import AppSwitcher from '@carbon/icons-react/lib/app-switcher/24';
import Chip from '@carbon/icons-react/lib/chip/24';
import Group from '@carbon/icons-react/lib/group/24';
import { HeaderContainer } from 'carbon-components-react/lib/components/UIShell';

import Header from '../Header';

import SideNav from './SideNav';

React.Fragment = ({ children }) => children;

const User = styled.p`
   {
    color: white;
    font-size: 0.75rem;
    text-align: left;
    margin-right: ${rem(20)};
  }
`;

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
    current: true,
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
      },
    ],
  },
];

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
        <React.Fragment>
          <User>
            JohnDoe@ibm.com<span>TenantId: Acme</span>
          </User>
          <Group
            fill="white"
            description="Icon"
            className="bx--header__menu-item bx--header__menu-title"
          />
        </React.Fragment>
      ),
    },
  ],
};

storiesOf('Watson IoT|SideNav', module).add('SideNav component', () => (
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
));
