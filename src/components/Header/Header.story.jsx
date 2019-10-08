import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import NotificationOn from '@carbon/icons-react/lib/notification/20';
import HeaderHelp from '@carbon/icons-react/lib/help/20';
import Avatar from '@carbon/icons-react/lib/user--avatar/20';

import Header from './Header';

React.Fragment = ({ children }) => children;

const StyledHeader = styled(Header)`
   {
    .bx--header__menu .bx--header__menu-item[role='menuitem'] {
      align-items: center;
      border: 0.125rem solid transparent;
      color: #f3f3f3;
      display: flex;
      padding: 1rem;
      height: 100%;
      font-size: 0.875rem;
      font-weight: 400;
      letter-spacing: 0;
      line-height: 1.125rem;
      text-decoration: none;
      user-select: none;
    }

    button.bx--header__menu-item {
      background: none;
      width: 100%;
    }

    .bx--text-truncate--end * {
      display: inline-block;
      vertical-align: middle;
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
  actionItems: [
    {
      label: 'alerts',
      onClick: action('click fired'),
      btnContent: <NotificationOn fill="white" description="Icon" />,
    },
    {
      label: 'help',
      onClick: action('help drop open'),
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
      onClick: action('click'),
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
            <React.Fragment>
              JohnDoe@ibm.com
              <Avatar fill="white" description="Icon" />
            </React.Fragment>
          ),
        },
      ],
    },
  ],
};

const headerPanel = {
  className: 'header-panel',
  /* eslint-disable */

  content: React.forwardRef((props, ref) => (
    <a href="#" ref={ref} {...props}>
      Header panel content
    </a>
  )),
  /* eslint-enable */
};

storiesOf('Watson IoT|Header', module)
  .add('Header action buttons with dropdowns', () => (
    <StyledHeader {...HeaderProps} headerPanel={headerPanel} />
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
  ));
