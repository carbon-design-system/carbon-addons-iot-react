import React, { useState } from 'react';
import merge from 'lodash/merge';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import {
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  purple50,
  teal50,
  cyan90,
} from '@carbon/colors';

import HotspotTextStyleTab from './HotspotTextStyleTab';

export default {
  title: 'Watson IoT Experimental/HotSpotEditorModal/HotspotTextStyleTab',
  decorators: [withKnobs],

  parameters: {
    component: HotspotTextStyleTab,
  },
};

const colors = [
  { id: purple70, text: 'purple70' },
  { id: cyan50, text: 'cyan50' },
  { id: teal70, text: 'teal70' },
  { id: magenta70, text: 'magenta70' },
  { id: red50, text: 'red50' },
  { id: red90, text: 'red90' },
  { id: green60, text: 'green60' },
  { id: blue80, text: 'blue80' },
  { id: magenta50, text: 'magenta50' },
  { id: purple50, text: 'purple50' },
  { id: teal50, text: 'teal50' },
  { id: cyan90, text: 'cyan90' },
];

export const Default = () => {
  const WithState = () => {
    const [formValues, setFormValues] = useState({});

    return (
      <HotspotTextStyleTab
        minFontSize={1}
        maxFontSize={50}
        minOpacity={0}
        maxOpacity={100}
        minBorderWidth={0}
        maxBorderWidth={50}
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={formValues}
        onChange={(change) => {
          setFormValues(merge({}, formValues, change));
          action('onChange')(change);
        }}
        onDelete={(change) => {
          action('onDelete')(change);
        }}
        translateWithId={() => {}}
      />
    );
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <WithState />
    </div>
  );
};

Default.story = {
  name: 'default',

  parameters: {
    info: {
      propTables: [HotspotTextStyleTab],
      text: `This is an example of the <HotspotTextStyleTab> HotSpot sub component. The state needs to be managed by the consuming application.
        
      ~~~js
    const [formValues, setFormValues] = useState({});

      return (
        <HotspotTextStyleTab
          fontColors={colors}
          backgroundColors={colors}
          borderColors={colors}
          formValues={formValues}
          onChange={(change) => {
            setFormValues(merge({}, formValues, change));
            action('onChange')(change);
          }}
        />
      );
      ~~~       
      `,
    },
  },
};
