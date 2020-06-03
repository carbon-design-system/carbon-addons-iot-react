import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import NotificationOn from '@carbon/icons-react/lib/notification/16';
import HeaderHelp from '@carbon/icons-react/lib/help/16';
import Avatar from '@carbon/icons-react/lib/user--avatar/16';

import Header from './Header';

React.Fragment = ({ children }) => children;

const StyledHeader = styled(Header)`
   {
    .bx--text-truncate--end span {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    .bx--header__menu-title[role='menuitem'][aria-expanded='true'] + .bx--header__menu {
      z-index: 6001;
    }
  }
`;

const HeaderProps = {
  user: 'JohnDoe@ibm.com',
  tenant: 'TenantId: Acme',
  url: 'http://localhost:8989',
  className: 'custom-class-name',
  appName: 'Watson IoT Platform ',
  skipto: 'skip',
  actionItems: [
    {
      label: 'alerts',
      onClick: action('click fired'),
      btnContent: <NotificationOn fill="white" description="Icon" />,
    },
    {
      label: 'help',
      hasHeaderPanel: true,
      btnContent: (
        <HeaderHelp
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
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
          content: 'this is my message to you',
        },
        {
          metaData: {
            onClick: action('do another action'),
            className: 'this',
            element: 'button',
          },
          content: (
            <span>
              JohnDoe@ibm.com
              <Avatar fill="white" description="Icon" />
            </span>
          ),
        },
      ],
    },
    {
      label: 'user',
      btnContent: <Avatar fill="white" description="Icon" />,
      childContent: [
        {
          metaData: {
            href: 'http://google.com',
            title: 'this is a title',
            target: '_blank',
            rel: 'noopener noreferrer',
            element: 'a',
          },
          content: 'this is my message to you',
        },
        {
          metaData: {
            onClick: action('do another action'),
            className: 'this',
            element: 'button',
          },
          content: (
            <span>
              JohnDoe@ibm.com
              <Avatar fill="white" description="Icon" />
            </span>
          ),
        },
      ],
    },
  ],
};

const HeaderMenuProps = {
  user: 'JohnDoe@ibm.com',
  tenant: 'TenantId: Acme',
  url: 'http://localhost:8989',
  className: 'custom-class-name',
  appName: 'Watson IoT Platform ',
  skipto: 'skip',
  actionItems: [
    {
      label: 'user',
      btnContent: <Avatar fill="white" description="Icon" />,
      childContent: [
        {
          metaData: {
            href: 'http://google.com',
            title: 'this is a title',
            target: '_blank',
            rel: 'noopener noreferrer',
            element: 'a',
          },
          content: 'this is my message to you',
        },
        {
          metaData: {
            onClick: action('do another action'),
            className: 'this',
            element: 'button',
          },
          content: (
            <span>
              JohnDoe@ibm.com
              <Avatar fill="white" description="Icon" />
            </span>
          ),
        },
      ],
    },
  ],
};

const headerPanel = {
  className: 'header-panel',

  content: React.forwardRef((props, ref) => (
    // eslint-disable-next-line
    <a href="#" ref={ref} {...props}>
      Header panel content
    </a>
  )),
};

storiesOf('Watson IoT/Header', module)
  .add('Header action buttons with dropdowns', () => (
    <div style={{ width: '100%', height: '100vh' }}>
      <StyledHeader {...HeaderProps} headerPanel={headerPanel} />
      <div id="skip" />
    </div>
  ))
  .add('header submenu', () => (
    <div style={{ width: '100%', height: '100vh' }}>
      <StyledHeader {...HeaderMenuProps} />
    </div>
  ))
  .add('Header no submenu', () => (
    <StyledHeader
      {...HeaderProps}
      actionItems={[
        {
          label: 'user',
          onClick: action('click'),
          btnContent: <Avatar fill="white" description="Icon" />,
        },
      ]}
    />
  ))
  .add('header subtitle', () => (
    <div style={{ width: '100%', height: '100vh' }}>
      <StyledHeader {...HeaderMenuProps} subtitle="Monitor" />
    </div>
  ));
