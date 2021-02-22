import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import { purple70 } from '@carbon/colors';

import ColorDropdown from './ColorDropdown';

export default {
  title: 'Watson IoT Experimental/ColorDropdown',
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
      light={boolean('light', false)}
      onChange={action('onChange')}
      hideLabels={boolean('hideLabels', false)}
      selectedColor={object('selectedColor', null)}
      testID="color-dropdown"
      i18n={object('i18n', {
        titleText: 'Color',
        helperText: '',
        placeholder: 'Filter colors',
        invalidText: 'Invalid color',
      })}
      allowCustomColors={boolean('allowCustomColors', false)}
      disabled={boolean('disabled', false)}
    />
  </div>
);

export const PresetSelectionExample = () => (
  <div style={{ width: '200px' }}>
    <ColorDropdown
      id="myColorDropdown"
      onChange={action('onChange')}
      hideLabels={boolean('hideLabels', false)}
      selectedColor={object('selectedColor', { id: 'yellow', text: 'yellow' })}
      testID="color-dropdown"
      i18n={object('i18n', {
        titleText: 'Color',
        helperText: '',
        placeholder: 'Filter colors',
        invalidText: 'Invalid color',
      })}
      allowCustomColors={boolean('allowCustomColors', true)}
      disabled={boolean('disabled', false)}
    />
  </div>
);

export const CustomColorsExample = () => (
  <div style={{ width: '200px' }}>
    <ColorDropdown
      id="myColorDropdown"
      colors={[
        { id: 'red', text: 'red' },
        { id: 'green', text: 'green' },
        { id: 'blue', text: 'blue' },
      ]}
      hideLabels={boolean('hideLabels', false)}
      onChange={action('onChange')}
      testID="color-dropdown"
      i18n={object('i18n', {
        titleText: 'Color',
        helperText: '',
        placeholder: 'Filter colors',
        invalidText: 'Invalid color',
      })}
      allowCustomColors={boolean('allowCustomColors', false)}
      disabled={boolean('disabled', false)}
    />
  </div>
);

export const NoLabelsExample = () => (
  <div style={{ width: '6rem' }}>
    <ColorDropdown
      id="myColorDropdown"
      selectedColor={{ id: purple70, text: 'purple70' }}
      hideLabels={boolean('hideLabels', true)}
      onChange={action('onChange')}
      testID="color-dropdown"
      i18n={object('i18n', {
        titleText: 'Color',
        helperText: '',
        placeholder: 'Filter colors',
        invalidText: 'Invalid color',
      })}
      allowCustomColors={boolean('allowCustomColors', false)}
      disabled={boolean('disabled', false)}
    />
  </div>
);

DefaultExample.story = {
  parameters: {
    info: {
      propTables: [ColorDropdown],
      propTablesExclude: [],
    },
  },
};
