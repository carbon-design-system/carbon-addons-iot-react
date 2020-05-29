/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

// eslint-disable-next-line no-unused-vars
import DateTimePicker, { INTERVAL_VALUES, RELATIVE_VALUES } from './DateTimePicker';

const customPresets = [
  {
    label: 'Last 30 minutes',
    offset: 30,
  },
  {
    label: 'Last 1 hour',
    offset: 60,
  },
  {
    label: 'Last 6 hours',
    offset: 360,
  },
  {
    label: 'Last 12 hours',
    offset: 720,
  },
];

const defaultRelativeValue = {
  lastNumber: 20,
  lastInterval: INTERVAL_VALUES.MINUTES,
  relativeToWhen: RELATIVE_VALUES.TODAY,
  relativeToTime: '13:30',
};

const defaultAbsoluteValue = {
  startDate: '04/01/2020',
  startTime: '12:34',
  endDate: '04/06/2020',
  endTime: '10:49',
};

storiesOf('Watson IoT Experimental/DateTime Picker', module)
  .add('Default', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <DateTimePicker
          dateTimeMask={text('dateTimeMask', 'YYYY-MM-DD HH:mm')}
          relatives={[
            {
              label: 'Yesterday',
              value: RELATIVE_VALUES.YESTERDAY,
            },
          ]}
          hasTooltip={boolean('hasTooltip', true)}
        />
      </div>
    );
  })
  .add('Selected preset', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <DateTimePicker
          defaultValue={customPresets[3]}
          hasTooltip={boolean('hasTooltip', true)}
          onApply={action('onApply')}
          onCancel={action('onCancel')}
        />
      </div>
    );
  })
  .add('Selected relative', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <DateTimePicker
          defaultValue={defaultRelativeValue}
          hasTooltip={boolean('hasTooltip', true)}
          onApply={action('onApply')}
          onCancel={action('onCancel')}
        />
      </div>
    );
  })
  .add('Selected absolute', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <DateTimePicker
          defaultValue={defaultAbsoluteValue}
          hasTooltip={boolean('hasTooltip', true)}
          onApply={action('onApply')}
          onCancel={action('onCancel')}
        />
      </div>
    );
  })
  .add('Without a relative option', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <DateTimePicker
          defaultValue={customPresets[3]}
          hasTooltip={boolean('hasTooltip', true)}
          showRelativeOption={false}
          onApply={action('onApply')}
          onCancel={action('onCancel')}
        />
      </div>
    );
  });
