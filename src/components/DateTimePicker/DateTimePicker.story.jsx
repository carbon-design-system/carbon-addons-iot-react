/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

// eslint-disable-next-line no-unused-vars
import DateTimePicker, {
  INTERVAL_VALUES,
  RELATIVE_VALUES,
  PICKER_KINDS,
  PRESET_VALUES,
} from './DateTimePicker';

export const defaultRelativeValue = {
  timeRangeKind: PICKER_KINDS.RELATIVE,
  timeRangeValue: {
    lastNumber: 20,
    lastInterval: INTERVAL_VALUES.MINUTES,
    relativeToWhen: RELATIVE_VALUES.TODAY,
    relativeToTime: '13:30',
  },
};

export const defaultAbsoluteValue = {
  timeRangeKind: PICKER_KINDS.ABSOLUTE,
  timeRangeValue: {
    startDate: '04/01/2020',
    startTime: '12:34',
    endDate: '04/06/2020',
    endTime: '10:49',
  },
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
          hasTimeInput={boolean('hasTimeInput', true)}
        />
      </div>
    );
  })
  .add('Selected preset', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <DateTimePicker
          defaultValue={{
            timeRangeKind: PICKER_KINDS.PRESET,
            timeRangeValue: PRESET_VALUES[3],
          }}
          hasTimeInput={boolean('hasTimeInput', true)}
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
          hasTimeInput={boolean('hasTimeInput', true)}
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
          hasTimeInput={boolean('hasTimeInput', true)}
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
          defaultValue={{
            timeRangeKind: PICKER_KINDS.PRESET,
            timeRangeValue: PRESET_VALUES[3],
          }}
          hasTimeInput={boolean('hasTimeInput', true)}
          showRelativeOption={false}
          onApply={action('onApply')}
          onCancel={action('onCancel')}
        />
      </div>
    );
  });
