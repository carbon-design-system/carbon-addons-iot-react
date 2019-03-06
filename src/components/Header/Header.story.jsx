import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Icon } from 'carbon-components-react';
import { rem } from 'polished';
import styled from 'styled-components';

import Header from './Header';

React.Fragment = ({ children }) => children;

const User = styled.p`
   {
    color: white;
    font-size: 0.75rem;
    text-align: left;
    margin-right: ${rem(20)};
  }
`;

const DropItem = styled.span`
   {
    display: flex;
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
          onCLick: action('go to source'),
          content: <p>This is a link</p>,
        },
        {
          onCLick: action('go to source'),
          content: (
            <React.Fragment>
              <DropItem>
                JohnDoe@ibm.com
                <StyledIcon name="header--avatar" fill="white" description="Icon" />
              </DropItem>
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
    },
  ],
};

storiesOf('Header', module).add('Header action buttons with dropdowns', () => (
  <Header {...HeaderProps} />
));
