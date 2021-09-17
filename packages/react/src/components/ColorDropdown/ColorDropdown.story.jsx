import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import { red50, blue50, green50, teal70, purple70 } from '@carbon/colors';

import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';

import ColorDropdown from './ColorDropdown';

export const Experimental = () => <StoryNotice componentName="ColorDropdown" experimental />;
Experimental.storyName = experimentalStoryTitle;

export default {
  title: '2 - Watson IoT Experimental/☢️ ColorDropdown',
  decorators: [withKnobs],
  parameters: {
    component: ColorDropdown,
  },
  excludeStories: [],
};

export const DefaultExample = () => (
  <div style={{ width: '200px' }}>
    <ColorDropdown
      id="myColorDropdown"
      label={text('label', 'Select a color')}
      light={boolean('light', false)}
      titleText={text('titleText', 'Color')}
      onChange={action('onChange')}
      disabled={boolean('disabled', false)}
    />
  </div>
);

export const PresetSelectionExample = () => (
  <div style={{ width: '200px' }}>
    <ColorDropdown
      id="myColorDropdown"
      label={text('label', 'Select a color')}
      titleText={text('titleText', 'Color')}
      onChange={action('onChange')}
      selectedColor={{ carbonColor: teal70, name: 'teal70' }}
    />
  </div>
);

export const CustomColorsExample = () => (
  <div style={{ width: '200px' }}>
    <ColorDropdown
      id="myColorDropdown"
      label={text('label', 'Select a color')}
      titleText={text('titleText', 'Color')}
      colors={[
        { carbonColor: red50, name: 'red' },
        { carbonColor: green50, name: 'green' },
        { carbonColor: blue50, name: 'blue' },
      ]}
      onChange={action('onChange')}
    />
  </div>
);

export const NoLabelsExample = () => (
  <div style={{ width: '6rem' }}>
    <ColorDropdown
      id="myColorDropdown"
      label={text('label', 'Select a color')}
      titleText={text('titleText', 'Color')}
      selectedColor={{ carbonColor: purple70, name: 'purple70' }}
      hideLabels={boolean('showLabels', true)}
      onChange={action('onChange')}
    />
  </div>
);

DefaultExample.parameters = {
  info: {
    propTables: [ColorDropdown],
    propTablesExclude: [],
  },
};
