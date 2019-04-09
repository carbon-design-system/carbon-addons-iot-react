import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { rem } from 'polished';
import styled from 'styled-components';
import AppSwitcher from '@carbon/icons-react/lib/app-switcher/24';
import Chip from '@carbon/icons-react/lib/chip/24';
import Group from '@carbon/icons-react/lib/group/24';
import UserAvatar from '@carbon/icons-react/lib/user--avatar/24';

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

/* eslint-disable*/
const links = [
  {
    label: 'Boards',
    icon: (
      <AppSwitcher
        fill="white"
        description="Icon"
        className="bx--header__menu-item bx--header__menu-title"
      />
    ),
    onClick: action('menu click'),
    href: 'javascript:void(0)',
    linkContent: 'Boards',
  },
  {
    current: true,
    label: 'Devices',
    icon: (
      <Chip
        fill="white"
        description="Icon"
        className="bx--header__menu-item bx--header__menu-title"
      />
    ),
    onClick: null,
    href: 'javascript:void(0)',
    linkContent: 'Devices',
  },
  {
    label: 'Members',
    icon: (
      <Group
        fill="white"
        description="Icon"
        className="bx--header__menu-item bx--header__menu-title"
      />
    ),
    onClick: null,
    href: 'javascript:void(0)',
    linkContent: 'Members',
    childContent: [
      {
        onClick: action('inner menu click'),
        href: 'javascript:void(0)',
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
          <UserAvatar fill="white" description="Icon" />
        </React.Fragment>
      ),
    },
  ],
};

storiesOf('SideNav', module).add('SideNav component', () => (
  <>
    <Header {...HeaderProps} />
    <SideNav links={links} />
  </>
));
