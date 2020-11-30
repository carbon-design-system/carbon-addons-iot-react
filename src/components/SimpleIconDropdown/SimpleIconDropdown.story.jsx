import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import { validThresholdIcons } from '../DashboardEditor/editorUtils';

import SimpleIconDropdown from './SimpleIconDropdown';

export default {
  title: 'Watson IoT Experimental/SimpleIconDropdown',
  decorators: [withKnobs],
  parameters: {
    component: SimpleIconDropdown,
  },
  excludeStories: [],
};

export const DefaultExample = () => (
  <div style={{ width: '6rem' }}>
    <SimpleIconDropdown
      id="mySimpleIconDropdown"
      titleText={text('titleText', 'Icon')}
      onChange={action('onChange')}
    />
  </div>
);

export const WithDefinedIconColors = () => (
  <div style={{ width: '6rem' }}>
    <SimpleIconDropdown
      id="mySimpleIconDropdown"
      titleText={text('titleText', 'Icon')}
      icons={validThresholdIcons
        .slice(5)
        .map((icon) => ({ ...icon, color: 'red' }))}
      onChange={action('onChange')}
    />
  </div>
);

export const WithSelectedIcon = () => (
  <div style={{ width: '6rem' }}>
    <SimpleIconDropdown
      id="mySimpleIconDropdown"
      titleText={text('titleText', 'Icon')}
      icons={validThresholdIcons}
      onChange={action('onChange')}
      selectedIcon={validThresholdIcons[8]}
    />
  </div>
);

DefaultExample.story = {
  parameters: {
    info: {
      propTables: [SimpleIconDropdown],
      propTablesExclude: [],
    },
  },
};
