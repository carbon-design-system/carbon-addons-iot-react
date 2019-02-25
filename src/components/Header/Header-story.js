import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { Icon } from 'carbon-components-react';

import Header from './Header';

// const link = <Icon name="header--help" fill="white" description="Icon" />;
const HeaderProps = {
  onClick: action('click'),
  user: 'JohnDoe@ibm.com',
  tenant: 'TenantId: Acme',
  className: 'custom-class-name',
  appName: 'Watson IoT Platform ',
};

storiesOf('Header', module).add('handles click', () => <Header {...HeaderProps} />);
