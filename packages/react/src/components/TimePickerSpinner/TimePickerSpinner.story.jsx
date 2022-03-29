import React, { createElement, useState } from 'react';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { spacing05 } from '@carbon/layout';

import TimePickerSpinner, { TIMEGROUPS } from './TimePickerSpinner';

export default {
  title: '1 - Watson IoT/Date time range selector/TimePickerSpinner',

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
        disabled={boolean('Disable input (disabled)', false)}
        spinner={boolean('Enable spinner (spinner)', true)}
        is12hour={boolean('12-hour format (is12hour)', false)}
        invalid={boolean('Invalid value (invalid)', false)}
        onChange={action('onChange')}
      />
    </div>
  );
};

WithSpinner.storyName = 'With spinner';

export const DefaultTimeGroupToMinutes = () => {
  return (
    <div style={{ margin: spacing05 + 4 }}>
      <TimePickerSpinner
        id="timepicker"
        value="19:33"
        aria-label="Pick a time"
        spinner
        defaultTimegroup={TIMEGROUPS.MINUTES}
        onChange={action('onChange')}
      />
    </div>
  );
};

DefaultTimeGroupToMinutes.storyName = 'Default timeGroup to minutes';

export const WithStateForInputvalidation = () => {
  const [invalid, setInvalid] = useState(false);

  return (
    <div style={{ margin: spacing05 + 4 }}>
      <TimePickerSpinner
        labelText={text('Label text (labelText)', 'My label')}
        id="timepicker"
        value="19:33"
        aria-label="Pick a time"
        disabled={boolean('Disable input (disabled)', false)}
        spinner={boolean('Enable spinner (spinner)', true)}
        invalid={invalid}
        is12hour={boolean('12-hour format (is12hour)', false)}
        invalidText={text('Invalid input text (i18n.invalidText)', 'A valid value is required')}
        onChange={(newValue, evt, meta) => {
          setInvalid(meta.invalid);
          action('onChange')(newValue, evt, meta);
        }}
      />
    </div>
  );
};
WithStateForInputvalidation.storyName = 'With state for input validation';
WithStateForInputvalidation.decorators = [createElement];
