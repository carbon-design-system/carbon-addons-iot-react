import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { spacing05 } from '@carbon/layout';

import TimePickerSpinner, { TIMEGROUPS } from './TimePickerSpinner';

export default {
  title: 'Watson IoT/TimePickerSpinner',

  parameters: {
    component: TimePickerSpinner,
  },

  excludeStories: ['TimePickerStory'],
};

export const WithSpinner = () => {
  return (
    <div style={{ margin: spacing05 + 4 }}>
      <TimePickerSpinner
        id="timepicker"
        value="19:33"
        aria-label="Pick a time"
        disabled={boolean('Disable input', false)}
        spinner={boolean('Enable spinner', true)}
        is12hour={boolean('12-hour format', false)}
      />
    </div>
  );
};

WithSpinner.story = {
  name: 'With spinner',
};

export const DefaultTimeGroupToMinutes = () => {
  return (
    <div style={{ margin: spacing05 + 4 }}>
      <TimePickerSpinner
        id="timepicker"
        value="19:33"
        aria-label="Pick a time"
        spinner
        defaultTimegroup={TIMEGROUPS.MINUTES}
      />
    </div>
  );
};

DefaultTimeGroupToMinutes.story = {
  name: 'Default timeGroup to minutes',
};
