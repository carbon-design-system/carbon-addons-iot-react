/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';

import __unstableDateTimePicker, {
  INTERVAL_VALUES,
  RELATIVE_VALUES,
  PRESET_VALUES,
  PICKER_KINDS,
} from './DateTimePicker';

const dateTimePickerProps = {
  id: 'datetimepicker',
  onCancel: jest.fn(),
  onApply: jest.fn(),
};

const i18n = {
  presetLabels: 'Last 30 minutes|Missed in translation',
  intervalLabels: 'minutes|Missed in translation',
  relativeLabels: 'Missed in translation',
};

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

describe('DateTimePicker tests', () => {
  jest.useFakeTimers();

  test('it should have the first preset as value', () => {
    const wrapper = mount(<__unstableDateTimePicker {...dateTimePickerProps} i18n={i18n} />);
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--tooltip__trigger').text()).toEqual(PRESET_VALUES[0].label);
  });

  test('onApply should be called', () => {
    const wrapper = mount(<__unstableDateTimePicker {...dateTimePickerProps} />);
    wrapper
      .find('.iot--date-time-picker__menu-btn-apply')
      .first()
      .simulate('click');
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  test('onCancel should be called', () => {
    const wrapper = mount(<__unstableDateTimePicker {...dateTimePickerProps} />);
    wrapper
      .find('.iot--date-time-picker__menu-btn-cancel')
      .first()
      .simulate('click');
    expect(dateTimePickerProps.onCancel).toHaveBeenCalled();
  });

  test('it should render with a predefined preset', () => {
    const wrapper = mount(
      <__unstableDateTimePicker {...dateTimePickerProps} defaultValue={PRESET_VALUES[1]} />
    );
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--tooltip__trigger').text()).toEqual(PRESET_VALUES[1].label);
  });

  test('it should render with a predefined relative range', () => {
    const wrapper = mount(
      <__unstableDateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />
    );
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);

    wrapper
      .find('.bx--select-input')
      .first()
      .simulate('change', { target: { value: INTERVAL_VALUES.DAYS } });

    wrapper
      .find('.bx--select-input')
      .at(1)
      .simulate('change', { target: { value: RELATIVE_VALUES.YESTERDAY } });

    const today = moment();
    expect(
      wrapper
        .find('.iot--date-time-picker__field')
        .first()
        .text()
    ).toEqual(`${today.format('YYYY-MM-DD')} 13:10 to ${today.format('YYYY-MM-DD')} 13:30`);

    wrapper
      .find('.bx--number__control-btn.up-icon')
      .first()
      .simulate('click');

    expect(
      wrapper
        .find('.iot--date-time-picker__field')
        .first()
        .text()
    ).toEqual(`${today.format('YYYY-MM-DD')} 13:09 to ${today.format('YYYY-MM-DD')} 13:30`);

    wrapper
      .find('.iot--time-picker__controls--btn.up-icon')
      .first()
      .simulate('click');

    expect(
      wrapper
        .find('.iot--date-time-picker__field')
        .first()
        .text()
    ).toEqual(`${today.format('YYYY-MM-DD')} 14:09 to ${today.format('YYYY-MM-DD')} 14:30`);

    wrapper
      .find('.iot--date-time-picker__menu-btn-apply')
      .first()
      .simulate('click');
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  test('it should render with a predefined absolute range', () => {
    const wrapper = mount(
      <__unstableDateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />
    );
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(
      wrapper
        .find('.iot--date-time-picker__field')
        .first()
        .text()
    ).toEqual('2020-04-01 12:34 to 2020-04-06 10:49');

    wrapper
      .find('.iot--time-picker__controls--btn.up-icon')
      .first()
      .simulate('click');

    expect(
      wrapper
        .find('.iot--date-time-picker__field')
        .first()
        .text()
    ).toEqual('2020-04-01 13:34 to 2020-04-06 10:49');

    wrapper
      .find('.iot--time-picker__controls--btn.up-icon')
      .at(1)
      .simulate('click');

    expect(
      wrapper
        .find('.iot--date-time-picker__field')
        .first()
        .text()
    ).toEqual('2020-04-01 13:34 to 2020-04-06 11:49');

    wrapper
      .find('.iot--date-time-picker__menu-btn-apply')
      .first()
      .simulate('click');
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  test('it should switch from relative to absolute', () => {
    const wrapper = mount(
      <__unstableDateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />
    );
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);

    wrapper
      .find('.bx--radio-button')
      .at(1)
      .simulate('change', { target: { value: PICKER_KINDS.ABSOLUTE } });

    expect(wrapper.find('.iot--time-picker__controls--btn')).toHaveLength(4);
  });

  test('it should not show the relative option', () => {
    const wrapper = mount(
      <__unstableDateTimePicker
        {...dateTimePickerProps}
        defaultValue={defaultAbsoluteValue}
        showRelativeOption={false}
      />
    );
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--radio-button')).toHaveLength(0);
  });

  test('it should switch from relative to presets', () => {
    const wrapper = mount(
      <__unstableDateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />
    );
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    wrapper
      .find('.iot--date-time-picker__field')
      .first()
      .simulate('click');

    wrapper
      .find('.iot--date-time-picker__menu-btn-back')
      .first()
      .simulate('click');

    expect(wrapper.find('.iot--time-picker__controls--btn')).toHaveLength(0);
  });
});
