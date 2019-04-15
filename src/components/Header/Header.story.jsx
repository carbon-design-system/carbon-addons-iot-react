import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Icon } from 'carbon-components-react';
import { rem } from 'polished';
import styled from 'styled-components';

import Header from './Header';

React.Fragment = ({ children }) => children;

const StyledHeader = styled(Header)`
   {
    .bx--header__menu-item[role='menuitem'] {
      align-items: center;
      color: #f3f3f3;
      display: flex;
      padding: 0 1rem;
      height: 100%;
      font-size: 0.875rem;
      font-weight: 400;
      letter-spacing: 0;
      line-height: 1.125rem;
      text-decoration: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border: 4px solid transparent;
    }

    button.bx--header__menu-item {
      background: none;
      width: 100%;
    }

    .bx--text-truncate--end * {
      display: inline-block;
      vertical-align: middle;
    }
  }
`;

const User = styled.p`
   {
    color: white;
    font-size: 0.75rem;
    text-align: left;
    margin-right: ${rem(20)};
  }
`;

const StyledIcon = styled(Icon)`
   {
    width: 25px;
    height: 25px;
  }
`;

// const link = <Icon name="header--help" fill="white" description="Icon" />;
const HeaderProps = {
  user: 'JohnDoe@ibm.com',
  tenant: 'TenantId: Acme',
  className: 'custom-class-name',
  appName: 'Watson IoT Platform ',
  actionItems: [
    {
      label: 'alerts',
      onClick: action('pop alert modal'),
      btnContent: <StyledIcon name="notification-on" fill="white" description="Icon" />,
    },
    {
      label: 'help',
      onClick: action('help drop open'),
      btnContent: (
        <StyledIcon
          name="header--help"
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
            <React.Fragment>
              JohnDoe@ibm.com
              <StyledIcon name="header--avatar" fill="white" description="Icon" />
            </React.Fragment>
          ),
        },
      ],
    },
    {
      label: 'user',
      onClick: action('click'),
      btnContent: (
        <React.Fragment>
          <User>
            JohnDoe@ibm.com<span>TenantId: Acme</span>
          </User>
          <StyledIcon name="header--avatar" fill="white" description="Icon" />
        </React.Fragment>
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
            <React.Fragment>
              JohnDoe@ibm.com
              <StyledIcon name="header--avatar" fill="white" description="Icon" />
            </React.Fragment>
          ),
        },
      ],
    },
  ],
};

storiesOf('Header', module).add('Header action buttons with dropdowns', () => (
  <StyledHeader {...HeaderProps} />
));
