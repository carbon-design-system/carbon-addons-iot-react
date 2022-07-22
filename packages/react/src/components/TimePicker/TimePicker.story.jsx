/* eslint-disable react/destructuring-assignment */
/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, select, object } from '@storybook/addon-knobs';

import TimePicker, { TimePickerSpinner } from './TimePicker';
import ListSpinner from './ListSpinner';

const props = {
  timepicker: () => ({
    position: [100, 100],
    value: '03:30',
    onChange: action('onChange'),
  }),
};

export default {
  title: '1 - Watson IoT/TimePicker',
  parameters: {
    component: TimePicker,
  },
};

const listItemsForVertical = Array.from(Array(12)).map((el, i) => {
  const index = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
  return { id: index, value: index };
});

export const Default = () => {
  const value = boolean('Default value', false);
  const secondaryValue = boolean('Default secondary value', false);
  return (
    <TimePicker
      key={value + secondaryValue}
      value={value ? '02:33 PM' : undefined}
      secondaryValue={secondaryValue ? '04:33 PM' : undefined}
      readOnly={boolean('Read only', false)}
      hideLabel={boolean('Hide label', false)}
      hideSecondaryLabel={boolean('Hide secondary label', false)}
      className="this that"
      id="time-picker"
      i18n={object('i18n', {
        labelText: 'Start',
        secondaryLabelText: 'End',
        helperText: 'This is some helper text',
        warnText: 'You have been warned',
      })}
      type={select('Type', ['single', 'range'], 'single')}
      invalid={[boolean('First input invalid', false), boolean('Second input invalid', false)]}
      warn={[
        boolean('Show first input warning state', false),
        boolean('Show second input warning state', false),
      ]}
      size={select('Size', ['sm', 'md', 'lg'], 'md')}
      light={boolean('Light variant (light in <TimePicker>)', false)}
      disabled={boolean('Disabled (disabled in <TimePicker>)', false)}
      onChange={action('onChange')}
    />
  );
  // return <TimePickerSpinner id="time-picker" className="my-table-yeah" {...props.timepicker()} />;
};

export const TimePickerSpinnerStory = () => {
  return <TimePickerSpinner {...props.timepicker()} />;
};

TimePickerSpinnerStory.storyName = 'TimePicker spinner';
TimePickerSpinnerStory.parameters = {
  component: TimePickerSpinner,
};

export const ListSpinnerStory = () => {
  return (
    <ListSpinner
      list={listItemsForVertical}
      defaultSelectedId="03"
      onChange={action('onChange called')}
    />
  );
};

ListSpinnerStory.storyName = 'List spinner';
ListSpinnerStory.parameters = {
  component: ListSpinner,
};
