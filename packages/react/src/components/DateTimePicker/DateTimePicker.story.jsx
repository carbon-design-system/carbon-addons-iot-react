/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { boolean, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { spacing06 } from '@carbon/layout';

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
    startDate: '2020-04-01',
    startTime: '12:34',
    endDate: '2020-04-06',
    endTime: '10:49',
  },
};

export default {
  title: 'Watson IoT Experimental/DateTime Picker',
  excludeStories: ['defaultRelativeValue', 'defaultAbsoluteValue'],
};

export const Default = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}>
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
};

export const SelectedPreset = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}>
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
};

SelectedPreset.story = {
  name: 'Selected preset',
};

export const SelectedRelative = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}>
      <DateTimePicker
        defaultValue={defaultRelativeValue}
        hasTimeInput={boolean('hasTimeInput', true)}
        onApply={action('onApply')}
        onCancel={action('onCancel')}
      />
    </div>
  );
};

SelectedRelative.story = {
  name: 'Selected relative',
};

export const SelectedAbsolute = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}>
      <DateTimePicker
        defaultValue={defaultAbsoluteValue}
        hasTimeInput={boolean('hasTimeInput', true)}
        onApply={action('onApply')}
        onCancel={action('onCancel')}
      />
    </div>
  );
};

SelectedAbsolute.story = {
  name: 'Selected absolute',
};

export const WithoutARelativeOption = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}>
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
};

WithoutARelativeOption.story = {
  name: 'Without a relative option',
};

export const LightVersion = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}>
      <DateTimePicker
        dateTimeMask={text('dateTimeMask', 'YYYY-MM-DD HH:mm')}
        relatives={[
          {
            label: 'Yesterday',
            value: RELATIVE_VALUES.YESTERDAY,
          },
        ]}
        light
        hasTimeInput={boolean('hasTimeInput', true)}
      />
    </div>
  );
};

LightVersion.story = {
  name: 'Light version',
};
