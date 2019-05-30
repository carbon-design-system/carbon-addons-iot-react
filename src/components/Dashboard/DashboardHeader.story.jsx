import React from 'react';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import DashboardHeader from './DashboardHeader';

storiesOf('Dashboard Header (Experimental)', module).add('basic', () => {
  return (
    <DashboardHeader
      title={text('title', 'Monthly Building: Munich')}
      description={text('description', 'Shows an overview of monthly data for a building')}
      lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
    />
  );
});
