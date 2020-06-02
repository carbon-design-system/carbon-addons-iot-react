import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';

import DateTimePicker, {
  INTERVAL_VALUES,
  RELATIVE_VALUES,
  PRESET_VALUES,
  PICKER_KINDS,
} from './DateTimePicker';
import { defaultAbsoluteValue, defaultRelativeValue } from './DateTimePicker.story';

const dateTimePickerProps = {
  id: 'datetimepicker',
  renderPresetTooltipText: jest.fn(),
  onCancel: jest.fn(),
  onApply: jest.fn(),
};

const i18n = {
  presetLabels: ['Last 30 minutes', 'Missed in translation'],
  intervalLabels: ['minutes', 'Missed in translation'],
  relativeLabels: ['Missed in translation'],
};

describe('DateTimePicker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    console.error.mockClear();
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it('should not blow up if correct object is passed as default value', () => {
    mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.PRESET,
          timeRangeValue: PRESET_VALUES[1],
        }}
      />
    );
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('should blow up if wrong combo of timeRangeKind and timeRangeValue is passed for defaultValue', () => {
    mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={{
          timeRangeKind: 'some other string',
          timeRangeValue: PRESET_VALUES[1],
        }}
      />
    );
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should have the first preset as value', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} i18n={i18n} />);
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--tooltip__trigger').text()).toEqual(PRESET_VALUES[0].label);
  });

  it('should call onApply', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} />);
    wrapper
      .find('.iot--date-time-picker__menu-btn-apply')
      .first()
      .simulate('click');
    jest.runAllTimers();
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('onCancel should be called', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} />);
    wrapper
      .find('.iot--date-time-picker__menu-btn-cancel')
      .first()
      .simulate('click');
    jest.runAllTimers();
    expect(dateTimePickerProps.onCancel).toHaveBeenCalled();
  });

  it('should render with a predefined preset', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.PRESET,
          timeRangeValue: PRESET_VALUES[1],
        }}
      />
    );
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--tooltip__trigger').text()).toEqual(PRESET_VALUES[1].label);
  });

  it('should render with a predefined relative range', () => {
    const wrapper = mount(
      <DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />
    );
    jest.runAllTimers();
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
    jest.runAllTimers();
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
    jest.runAllTimers();
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
    jest.runAllTimers();
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
    jest.runAllTimers();
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('should render with a predefined absolute range', () => {
    const wrapper = mount(
      <DateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />
    );
    jest.runAllTimers();
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
    jest.runAllTimers();
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
    jest.runAllTimers();
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
    jest.runAllTimers();
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('should switch from relative to absolute', () => {
    const wrapper = mount(
      <DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />
    );
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);

    wrapper
      .find('.bx--radio-button')
      .at(1)
      .simulate('change', { target: { value: PICKER_KINDS.ABSOLUTE } });
    jest.runAllTimers();
    expect(wrapper.find('.iot--time-picker__controls--btn')).toHaveLength(4);
  });

  it('should not show the relative option', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={defaultAbsoluteValue}
        showRelativeOption={false}
      />
    );
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--radio-button')).toHaveLength(0);
  });

  // https://github.com/IBM/carbon-addons-iot-react/issues/1179
  it('should not show the relative option with preset as default value', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={PRESET_VALUES[1]}
        showRelativeOption={false}
      />
    );
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--radio-button')).toHaveLength(0);
  });

  it('should set the value relative to yesterday', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        intervals={[
          {
            label: 'minutes',
            value: INTERVAL_VALUES.MINUTES,
          },
        ]}
        relatives={[
          {
            label: 'Yesterday',
            value: RELATIVE_VALUES.YESTERDAY,
          },
        ]}
      />
    );
    wrapper
      .find('.iot--date-time-picker__listitem--custom')
      .first()
      .simulate('click');
    const today = moment();
    wrapper
      .find('.bx--number__control-btn.up-icon')
      .first()
      .simulate('click');
    jest.runAllTimers();
    expect(
      wrapper
        .find('.iot--date-time-picker__field')
        .first()
        .text()
    ).toEqual(
      `${today.subtract(1, 'days').format('YYYY-MM-DD')} 08:56 to ${today.format(
        'YYYY-MM-DD'
      )} 08:57`
    );
  });

  it('should switch from relative to presets', () => {
    const wrapper = mount(
      <DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />
    );
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    wrapper
      .find('.iot--date-time-picker__field')
      .first()
      .simulate('click');

    wrapper
      .find('.iot--date-time-picker__menu-btn-back')
      .first()
      .simulate('click');
    jest.runAllTimers();
    expect(wrapper.find('.iot--time-picker__controls--btn')).toHaveLength(0);
  });

  it('should keep preset value when switching from presets to relative and back', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} />);
    wrapper
      .find('.iot--date-time-picker__field')
      .first()
      .simulate('click');
    // if you are wondering about hostNodes https://github.com/enzymejs/enzyme/issues/836#issuecomment-401260477
    expect(
      wrapper.find('.iot--date-time-picker__listitem--preset-selected').hostNodes()
    ).toHaveLength(1);

    wrapper
      .find('.iot--date-time-picker__listitem--custom')
      .first()
      .simulate('click');

    wrapper
      .find('.iot--date-time-picker__menu-btn-back')
      .first()
      .simulate('click');

    expect(
      wrapper.find('.iot--date-time-picker__listitem--preset-selected').hostNodes()
    ).toHaveLength(1);
  });
});
