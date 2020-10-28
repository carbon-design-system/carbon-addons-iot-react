import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, object } from '@storybook/addon-knobs';

import SuiteHeaderAppSwitcher from './SuiteHeaderAppSwitcher';

storiesOf('Watson IoT/SuiteHeader/SuiteHeaderAppSwitcher', module)
  .addParameters({
    component: SuiteHeaderAppSwitcher,
  })
  .add('default', () => (
    <div style={{ width: '15rem', background: 'white' }}>
      <SuiteHeaderAppSwitcher
        applications={object('applications', [
          {
            id: 'monitor',
            name: 'Monitor',
            href: 'https://www.ibm.com',
          },
          {
            id: 'health',
            name: 'Health',
            href: 'https://www.ibm.com',
            isExternal: true,
          },
        ])}
        allApplicationsLink={text('allApplicationsLink', 'https://www.ibm.com')}
        noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      />
    </div>
  ))
  .add('No applications', () => (
    <div style={{ width: '15rem', background: 'white' }}>
      <SuiteHeaderAppSwitcher
        applications={[]}
        allApplicationsLink="https://www.ibm.com"
        noAccessLink="https://www.ibm.com"
      />
    </div>
  ));
