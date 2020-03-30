import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import TimePickerSpinner, { TIMEGROUPS } from './TimePickerSpinner';

export {
  default as TimePickerStory,
} from 'carbon-components-react/lib/components/TimePicker/TimePicker-story';

storiesOf('Watson IoT Experimental/TimePickerSpinner', module)
  .add('With spinner', () => {
    return (
      <div style={{ margin: 20 }}>
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
  })
  .add('Default timeGroup to minutes', () => {
    return (
      <div style={{ margin: 20 }}>
        <TimePickerSpinner
          id="timepicker"
          value="19:33"
          aria-label="Pick a time"
          spinner
          defaultTimegroup={TIMEGROUPS.MINUTES}
        />
      </div>
    );
  });
