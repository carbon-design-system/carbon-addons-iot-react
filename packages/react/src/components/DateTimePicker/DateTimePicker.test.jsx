import React from 'react';
import { mount } from 'enzyme';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';
import dayjs from '../../utils/dayjs';
import {
  INTERVAL_VALUES,
  RELATIVE_VALUES,
  PRESET_VALUES,
  PICKER_KINDS,
} from '../../constants/DateConstants';

import DateTimePicker from './DateTimePicker';
import { defaultAbsoluteValue, defaultRelativeValue } from './DateTimePicker.story';

const { iotPrefix, prefix } = settings;

const defaultPresets = [
  ...PRESET_VALUES,
  {
    label: 'Last 70 minutes',
    offset: 70,
  },
];

const dateTimePickerProps = {
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
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should not blow up if correct object is passed as default value', () => {
    mount(
      <DateTimePicker
        {...dateTimePickerProps}
        presets={[
          {
            label: 'Last 30 minutes',
            offset: 30,
          },
          {
            label: 'Last 1 hour',
            offset: 60,
          },
        ]}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.PRESET,
          // test not having id
          timeRangeValue: {
            label: 'Last 30 minutes',
            offset: 30,
          },
        }}
      />
    );
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('should blow up if wrong combo of timeRangeKind and timeRangeValue is passed for defaultValue', () => {
    mount(
      <DateTimePicker
        {...dateTimePickerProps}
        preset={defaultPresets}
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
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    expect(wrapper.find(`.${prefix}--tooltip__trigger`).text()).toEqual(PRESET_VALUES[0].label);
  });

  it('should change to another preset value when clicked', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        presets={[
          {
            label: 'Last 30 minutes',
            offset: 30,
          },
          {
            label: 'Last 1 hour',
            offset: 60,
          },
        ]}
      />
    );
    userEvent.click(screen.getByTestId('date-time-picker__field'));
    userEvent.click(screen.getByText(/Last 1 hour/));
    expect(screen.getByTitle(/Last 1 hour/)).toBeInTheDocument();
  });

  it('should show the user defined tooltip for preset', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        renderPresetTooltipText={() => 'User tooltip'}
        preset={defaultPresets}
      />
    );
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    expect(wrapper.find(`.${prefix}--assistive-text`).text()).toEqual('User tooltip');
  });

  it('should call onApply', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} preset={defaultPresets} />);
    wrapper.find(`.${iotPrefix}--date-time-picker__menu-btn-apply`).first().simulate('click');
    jest.runAllTimers();
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('onCancel should be called', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} />);
    wrapper.find(`.${iotPrefix}--date-time-picker__menu-btn-cancel`).first().simulate('click');
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
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    expect(wrapper.find(`.${prefix}--tooltip__trigger`).text()).toEqual(PRESET_VALUES[1].label);
  });

  it('should render with a predefined relative range', () => {
    const wrapper = mount(
      <DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />
    );
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);

    wrapper
      .find(`.${prefix}--select-input`)
      .first()
      .simulate('change', { target: { value: INTERVAL_VALUES.DAYS } });

    wrapper
      .find(`.${prefix}--select-input`)
      .at(1)
      .simulate('change', { target: { value: RELATIVE_VALUES.YESTERDAY } });

    const today = dayjs();
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      `${today.format('YYYY-MM-DD')} 13:10 to ${today.format('YYYY-MM-DD')} 13:30`
    );

    wrapper.find(`.${prefix}--number__control-btn.up-icon`).first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      `${today.format('YYYY-MM-DD')} 13:09 to ${today.format('YYYY-MM-DD')} 13:30`
    );

    wrapper.find(`.${iotPrefix}--time-picker__controls--btn.up-icon`).first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      `${today.format('YYYY-MM-DD')} 14:09 to ${today.format('YYYY-MM-DD')} 14:30`
    );

    wrapper.find(`.${iotPrefix}--date-time-picker__menu-btn-apply`).first().simulate('click');
    jest.runAllTimers();
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('should render with a predefined absolute range', () => {
    const wrapper = mount(
      <DateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />
    );
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      '2020-04-01 12:34 to 2020-04-06 10:49'
    );

    wrapper.find(`.${iotPrefix}--time-picker__controls--btn.up-icon`).first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      '2020-04-01 13:34 to 2020-04-06 10:49'
    );

    wrapper.find(`.${iotPrefix}--time-picker__controls--btn.up-icon`).at(1).simulate('click');
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      '2020-04-01 13:34 to 2020-04-06 11:49'
    );

    wrapper.find(`.${iotPrefix}--time-picker__controls--btn.up-icon`).at(1).simulate('click');
    wrapper.find(`.${iotPrefix}--time-picker__controls--btn.up-icon`).at(1).simulate('click');
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      '2020-04-01 13:34 to 2020-04-06 13:49'
    );

    wrapper.find(`.${iotPrefix}--date-time-picker__menu-btn-apply`).first().simulate('click');
    jest.runAllTimers();
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('should go back to presets when cancel button is picked on Absolute screen', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />);
    userEvent.click(screen.getByText(/Back/));
    expect(screen.getByText(/Custom Range/)).toBeInTheDocument();
  });

  it('should switch from relative to absolute and then to preset', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />);
    // There should only be one on the relative page
    expect(screen.getAllByTitle(/Increment hours/).length).toEqual(1);

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    userEvent.click(screen.getAllByText('Absolute')[0]);

    // There should be two on the Absolute page
    expect(screen.getAllByTitle(/Increment hours/).length).toEqual(2);

    userEvent.click(screen.getAllByText('Absolute')[0]);
  });

  it('should not show the relative option', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={defaultAbsoluteValue}
        showRelativeOption={false}
        hasTimeInput={false}
      />
    );
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    expect(wrapper.find(`.${prefix}--radio-button`)).toHaveLength(0);
  });

  // https://github.com/IBM/carbon-addons-iot-react/issues/1179
  it('should not show the relative option with preset as default value', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.PRESET,
          timeRangeValue: PRESET_VALUES[1],
        }}
        showRelativeOption={false}
      />
    );
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    expect(wrapper.find(`.${prefix}--radio-button`)).toHaveLength(0);
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
    wrapper.find(`.${iotPrefix}--date-time-picker__listitem--custom`).first().simulate('click');
    const today = dayjs().subtract(1, 'days');
    wrapper.find(`.${prefix}--number__control-btn.up-icon`).first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      `${today.subtract(1, 'minute').format('YYYY-MM-DD HH:mm')} to ${today.format(
        'YYYY-MM-DD HH:mm'
      )}`
    );
  });

  it('should switch from relative to presets', () => {
    const wrapper = mount(
      <DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />
    );
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().simulate('click');

    wrapper.find(`.${iotPrefix}--date-time-picker__menu-btn-back`).first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--time-picker__controls--btn`)).toHaveLength(0);
  });

  it('should keep preset value when switching from presets to relative and back', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} />);
    wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().simulate('click');
    // if you are wondering about hostNodes https://github.com/enzymejs/enzyme/issues/836#issuecomment-401260477
    expect(
      wrapper.find(`.${iotPrefix}--date-time-picker__listitem--preset-selected`).hostNodes()
    ).toHaveLength(1);

    wrapper.find(`.${iotPrefix}--date-time-picker__listitem--custom`).first().simulate('click');

    wrapper.find(`.${iotPrefix}--date-time-picker__menu-btn-back`).first().simulate('click');

    expect(
      wrapper.find(`.${iotPrefix}--date-time-picker__listitem--preset-selected`).hostNodes()
    ).toHaveLength(1);
  });

  it('should render with programmatically set absolute range', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} />);
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    expect(wrapper.find(`.${prefix}--tooltip__trigger`).text()).toEqual(PRESET_VALUES[0].label);

    wrapper.setProps({ defaultValue: defaultAbsoluteValue });
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      '2020-04-01 12:34 to 2020-04-06 10:49'
    );

    wrapper.find(`.${iotPrefix}--date-time-picker__icon`).first().simulate('click');
    jest.runAllTimers();

    wrapper.find(`.${iotPrefix}--time-picker__controls--btn.up-icon`).first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      '2020-04-01 13:34 to 2020-04-06 10:49'
    );

    wrapper.find(`.${iotPrefix}--date-time-picker__menu-btn-back`).first().simulate('click');
    jest.runAllTimers();
    wrapper.find(`.${iotPrefix}--date-time-picker__menu-btn-cancel`).first().simulate('click');
    jest.runAllTimers();

    expect(dateTimePickerProps.onCancel).toHaveBeenCalled();
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`)).toHaveLength(1);
    expect(wrapper.find(`.${iotPrefix}--date-time-picker__field`).first().text()).toEqual(
      '2020-04-01 12:34 to 2020-04-06 10:49'
    );
  });

  it('i18n string test', () => {
    const i18nTest = {
      toLabel: 'to-label',
      toNowLabel: 'to-now-label',
      calendarLabel: 'calendar-label',
      presetLabels: ['last-30-min', 'last-1-hour', 'last-6-hour', 'last-12-hour', 'last-24-hour'],
      intervalLabels: ['mins', 'hrs', 'dys', 'wks', 'mths', 'yrs'],
      relativeLabels: ['today', 'yesterday'],
      customRangeLinkLabel: 'custom-range',
      customRangeLabel: 'custom-range-2',
      relativeLabel: 'relative',
      lastLabel: 'last',
      invalidNumberLabel: 'number-is-not-valid',
      relativeToLabel: 'relative-to',
      absoluteLabel: 'absolute',
      startTimeLabel: 'start-time',
      endTimeLabel: 'end-time',
      applyBtnLabel: 'apply',
      cancelBtnLabel: 'cancel',
      backBtnLabel: 'back',
    };

    const presets = [
      {
        id: 'item-01',
        label: 'last-30-min',
        offset: 30,
      },
      {
        id: 'item-02',
        label: 'last-1-hour',
        offset: 60,
      },
      {
        id: 'item-03',
        label: 'last-6-hour',
        offset: 360,
      },
      {
        id: 'item-04',
        label: 'last-12-hour',
        offset: 720,
      },
      {
        id: 'item-05',
        label: 'last-24-hour',
        offset: 1440,
      },
    ];

    const i18nDefault = DateTimePicker.defaultProps.i18n;

    const relatives = [
      {
        label: 'today',
        value: RELATIVE_VALUES.TODAY,
      },
      {
        label: 'yesterday',
        value: RELATIVE_VALUES.YESTERDAY,
      },
    ];

    render(
      <DateTimePicker id="datetimepicker" presets={presets} i18n={i18nTest} relatives={relatives} />
    );
    i18nTest.presetLabels.forEach((label) => {
      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
    expect(screen.getAllByText(i18nTest.toNowLabel, { exact: false })[0]).toBeInTheDocument();
    expect(screen.getByLabelText(i18nTest.calendarLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.customRangeLinkLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.applyBtnLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.cancelBtnLabel)).toBeInTheDocument();

    i18nDefault.presetLabels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
    expect(screen.queryByText(i18nDefault.toNowLabel, { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.calendarLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.customRangeLinkLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.applyBtnLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.cancelBtnLabel)).not.toBeInTheDocument();
    // custom relative range screen
    fireEvent.click(screen.getByText(i18nTest.customRangeLinkLabel));
    i18nTest.intervalLabels.forEach((label) => {
      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
    i18nTest.relativeLabels.forEach((label) => {
      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
    expect(screen.getByText(i18nTest.customRangeLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.backBtnLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.relativeLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.lastLabel)).toBeInTheDocument();

    i18nDefault.intervalLabels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
    i18nDefault.relativeLabels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
    expect(screen.queryByText(i18nDefault.customRangeLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.backBtnLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.relativeLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.lastLabel)).not.toBeInTheDocument();
    // custom range absolute screen.
    fireEvent.click(screen.getByText(i18nTest.absoluteLabel));
    expect(screen.getByText(i18nTest.startTimeLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.endTimeLabel)).toBeInTheDocument();

    expect(screen.queryByText(i18nDefault.startTimeLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.endTimeLabel)).not.toBeInTheDocument();
    // click apply
    const times = screen.getAllByTestId('time-picker-spinner');
    fireEvent.change(times[1], { target: { value: '03:00' } });
    fireEvent.click(screen.getByText(i18nTest.applyBtnLabel));
    expect(screen.getAllByTitle(new RegExp(`.*${i18nTest.toLabel}.*`))[0]).toBeInTheDocument();

    expect(
      screen.queryByTitle(new RegExp(`.*\\s${i18nDefault.toLabel}\\s.*`))
    ).not.toBeInTheDocument();
  });

  it('should parse default values with start/end', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        hasTimeInput
        defaultValue={{
          timeRangeKind: PICKER_KINDS.ABSOLUTE,
          timeRangeValue: {
            start: '2021-08-01 12:34',
            end: '2021-08-06 10:49',
          },
        }}
      />
    );

    expect(screen.getByText('2021-08-01 12:34 to 2021-08-06 10:49')).toBeVisible();
  });

  it('should not render a time picker if hasTimeInput:false', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        id="picker-test"
        hasTimeInput={false}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.ABSOLUTE,
          timeRangeValue: {
            start: new Date(2021, 7, 1, 12, 34, 0),
            end: new Date(2021, 7, 6, 10, 49, 0),
          },
        }}
      />
    );

    userEvent.click(screen.getByText('2021-08-01 12:34 to 2021-08-06 10:49'));
    expect(screen.queryByLabelText('Start time')).toBeNull();
    expect(screen.queryByLabelText('End time')).toBeNull();
  });

  it('should fallback to minute intervals if none given in a relative defaultValue', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        id="picker-test"
        hasTimeInput={false}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.RELATIVE,
          timeRangeValue: {
            lastNumber: 20,
            relativeToWhen: RELATIVE_VALUES.TODAY,
            relativeToTime: '13:30',
          },
        }}
      />
    );
    jest.runAllTimers();

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    expect(screen.getByText('minutes')).toBeVisible();
  });
  it('should render light when given', () => {
    const { container } = render(
      <DateTimePicker
        {...dateTimePickerProps}
        id="picker-test"
        hasTimeInput={false}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.RELATIVE,
          timeRangeValue: {
            lastNumber: 20,
            relativeToWhen: RELATIVE_VALUES.TODAY,
            relativeToTime: '13:30',
          },
        }}
        light
      />
    );
    jest.runAllTimers();

    expect(container.querySelectorAll(`.${iotPrefix}--date-time-picker__box--light`)).toHaveLength(
      1
    );
  });
  it('should fallback to 00:00 for absolute times when none given', () => {
    render(<DateTimePicker {...dateTimePickerProps} id="picker-test" />);
    jest.runAllTimers();

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    userEvent.click(screen.getByText('Custom Range'));
    userEvent.click(screen.getByText('Absolute'));
    expect(screen.getAllByTestId('time-picker-spinner')[0]).toHaveValue('00:00');
  });
  it('should not show the Custom Range link when showCustomRangeLink:false', () => {
    render(
      <DateTimePicker {...dateTimePickerProps} showCustomRangeLink={false} id="picker-test" />
    );
    jest.runAllTimers();

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    expect(screen.queryByText('Custom Range')).toBeNull();
  });
  it('should show relative labels', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        relatives={[
          {
            label: 'Quarter',
            value: 'quarter',
          },
        ]}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.ABSOLUTE,
          timeRangeValue: {
            start: '2021-08-01 12:34',
            end: '2021-08-06 10:49',
          },
        }}
        id="picker-test"
      />
    );
    jest.runAllTimers();

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    userEvent.click(screen.getByText('Relative'));
    expect(screen.getByText('Quarter')).toBeVisible();
  });

  it('should disable apply button when number input is invalid', () => {
    render(<DateTimePicker {...dateTimePickerProps} id="picker-test" />);
    jest.runAllTimers();

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    userEvent.click(screen.queryByText(DateTimePicker.defaultProps.i18n.customRangeLinkLabel));
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    const numberInput = screen.queryByRole('spinbutton', {
      name: 'Numeric input field with increment and decrement buttons',
    });
    expect(numberInput).toBeValid();

    // Empty value is invalid
    userEvent.type(numberInput, '{backspace}');
    expect(numberInput).toBeInvalid();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();

    // 0 is valid
    userEvent.type(numberInput, '1');
    expect(numberInput).toBeValid();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();

    // -1 is invalid
    userEvent.type(numberInput, '{backspace}-1');
    expect(numberInput).toBeInvalid();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('should disable apply button when relative TimePickerSpinner input is invalid', () => {
    const { i18n } = DateTimePicker.defaultProps;
    render(<DateTimePicker {...dateTimePickerProps} id="picker-test" />);
    jest.runAllTimers();

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    userEvent.click(screen.queryByText(DateTimePicker.defaultProps.i18n.customRangeLinkLabel));
    const applyBytton = screen.getByRole('button', { name: i18n.applyBtnLabel });
    expect(applyBytton).toBeEnabled();
    const relativeToTime = screen.getByPlaceholderText('hh:mm');
    expect(relativeToTime).toBeValid();

    // set time to 1
    userEvent.type(relativeToTime, '1');
    expect(relativeToTime).toBeInvalid();
    expect(applyBytton).toBeDisabled();

    // set time to 11:11
    userEvent.type(relativeToTime, '1:11');
    expect(relativeToTime).toBeValid();
    expect(applyBytton).toBeEnabled();

    // set time to 11:61
    userEvent.type(relativeToTime, '{backspace}{backspace}61');
    expect(relativeToTime).toBeInvalid();
    expect(applyBytton).toBeDisabled();
  });

  it('should disable apply button when absolute TimePickerSpinner input is invalid on the same day', () => {
    const { i18n } = DateTimePicker.defaultProps;

    render(
      <DateTimePicker
        {...dateTimePickerProps}
        id="picker-test"
        hasTimeInput
        defaultValue={{
          timeRangeKind: PICKER_KINDS.ABSOLUTE,
          timeRangeValue: {
            start: new Date(2020, 3, 1, 12, 34, 0),
            end: new Date(2020, 3, 1, 11, 49, 0),
            startDate: '2020-04-01',
            startTime: '12:34',
            endDate: '2020-04-01',
            endTime: '11:49',
          },
        }}
      />
    );
    jest.runAllTimers();

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    const applyBytton = screen.getByRole('button', { name: i18n.applyBtnLabel });

    // Get start and end time inputs
    const startTime = screen.getAllByTestId('time-picker-spinner')[0];
    const endTime = screen.getAllByTestId('time-picker-spinner')[1];

    const timeRange = screen.getByTestId('date-time-picker__field');

    expect(timeRange).toHaveTextContent('2020-04-01 12:34 to 2020-04-01 11:49');
    expect(applyBytton).toBeEnabled();

    // 2020-04-01 13:34 to 2020-04-01 11:49
    userEvent.type(startTime, '{backspace}{backspace}{backspace}{backspace}{backspace}13:34');
    expect(startTime).toHaveValue('13:34');
    expect(endTime).toHaveValue('11:49');
    expect(timeRange).toHaveTextContent('2020-04-01 13:34 to 2020-04-01 11:49');
    expect(applyBytton).toBeDisabled();

    // 2020-04-01 13:34 to 2020-04-01 12:49
    userEvent.type(endTime, '{backspace}{backspace}{backspace}{backspace}{backspace}12:49');
    expect(startTime).toHaveValue('13:34');
    expect(endTime).toHaveValue('12:49');
    expect(timeRange).toHaveTextContent('2020-04-01 13:34 to 2020-04-01 12:49');
    expect(applyBytton).toBeDisabled();

    // // 2020-04-01 13:34 to 2020-04-01 13:49
    userEvent.type(endTime, '{backspace}{backspace}{backspace}{backspace}{backspace}13:49');
    expect(startTime).toHaveValue('13:34');
    expect(endTime).toHaveValue('13:49');
    expect(timeRange).toHaveTextContent('2020-04-01 13:34 to 2020-04-01 13:49');
    expect(applyBytton).toBeEnabled();

    // // 2020-04-01 13:50 to 2020-04-01 13:49
    userEvent.type(startTime, '{backspace}{backspace}50');
    expect(startTime).toHaveValue('13:50');
    expect(endTime).toHaveValue('13:49');
    expect(timeRange).toHaveTextContent('2020-04-01 13:50 to 2020-04-01 13:49');
    expect(applyBytton).toBeDisabled();

    userEvent.type(endTime, '{backspace}{backspace}{backspace}{backspace}{backspace}9999');
    userEvent.type(startTime, '{backspace}{backspace}51');
    expect(startTime).toHaveValue('13:51');
    expect(endTime).toHaveValue('9999');
    expect(applyBytton).toBeDisabled();
  });

  it('should enabe apply button when absolute DatePicker input has start and end date in different dates', () => {
    const { i18n } = DateTimePicker.defaultProps;

    render(
      <DateTimePicker
        {...dateTimePickerProps}
        id="picker-test"
        hasTimeInput
        defaultValue={{
          timeRangeKind: PICKER_KINDS.ABSOLUTE,
          timeRangeValue: {
            start: new Date(2020, 3, 1, 12, 34, 0),
            end: new Date(2020, 3, 6, 11, 49, 0),
            startDate: '2020-04-01',
            startTime: '12:34',
            endDate: '2020-04-06',
            endTime: '11:49',
          },
        }}
      />
    );
    jest.runAllTimers();

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    const applyBytton = screen.getByRole('button', { name: i18n.applyBtnLabel });

    // Get start and end time inputs
    const startTime = screen.getAllByTestId('time-picker-spinner')[0];
    const endTime = screen.getAllByTestId('time-picker-spinner')[1];

    const timeRange = screen.getByTestId('date-time-picker__field');

    expect(timeRange).toHaveTextContent('2020-04-01 12:34 to 2020-04-06 11:49');
    expect(applyBytton).toBeEnabled();

    // 2020-04-01 13:34 to 2020-04-06 11:49
    userEvent.type(startTime, '{backspace}{backspace}{backspace}{backspace}{backspace}13:34');
    expect(startTime).toHaveValue('13:34');
    expect(endTime).toHaveValue('11:49');
    expect(timeRange).toHaveTextContent('2020-04-01 13:34 to 2020-04-06 11:49');
    expect(applyBytton).toBeEnabled();

    // 2020-04-01 13:34 to 2020-04-06 12:49
    userEvent.type(endTime, '{backspace}{backspace}{backspace}{backspace}{backspace}12:49');
    expect(startTime).toHaveValue('13:34');
    expect(endTime).toHaveValue('12:49');
    expect(timeRange).toHaveTextContent('2020-04-01 13:34 to 2020-04-06 12:49');
    expect(applyBytton).toBeEnabled();

    // 2020-04-01 13:34 to 2020-04-06 13:49
    userEvent.type(endTime, '{backspace}{backspace}{backspace}{backspace}{backspace}13:49');
    expect(startTime).toHaveValue('13:34');
    expect(endTime).toHaveValue('13:49');
    expect(timeRange).toHaveTextContent('2020-04-01 13:34 to 2020-04-06 13:49');
    expect(applyBytton).toBeEnabled();

    // 2020-04-01 13:50 to 2020-04-06 13:49
    userEvent.type(startTime, '{backspace}{backspace}50');
    expect(startTime).toHaveValue('13:50');
    expect(endTime).toHaveValue('13:49');
    expect(timeRange).toHaveTextContent('2020-04-01 13:50 to 2020-04-06 13:49');
    expect(applyBytton).toBeEnabled();

    userEvent.type(endTime, '{backspace}{backspace}{backspace}{backspace}{backspace}9999');
    userEvent.type(startTime, '{backspace}{backspace}51');
    expect(startTime).toHaveValue('13:51');
    expect(endTime).toHaveValue('9999');
    expect(applyBytton).toBeDisabled();
  });

  it('should close picker when escape is pressed', () => {
    render(<DateTimePicker {...dateTimePickerProps} id="picker-test" />);
    userEvent.click(screen.getByTestId('date-time-picker__field'));
    expect(screen.getByRole('button', { name: 'Apply' })).toBeVisible();
    userEvent.click(screen.getByText('Last 6 hours'));
    fireEvent.keyDown(screen.getByTestId('date-time-picker'), {
      key: 'Escape',
      code: 'Escape',
    });
    expect(screen.getByRole('listbox')).not.toHaveClass(
      `${iotPrefix}--date-time-picker__menu-expanded`
    );
  });

  it('should select a preset when hitting enter', () => {
    render(<DateTimePicker {...dateTimePickerProps} id="picker-test" />);
    userEvent.click(screen.getByTestId('date-time-picker__field'));
    expect(screen.getByRole('button', { name: 'Apply' })).toBeVisible();
    const last6HoursLabel = screen.getByText('Last 6 hours');
    fireEvent.keyDown(last6HoursLabel, {
      key: 'Enter',
      code: 'Enter',
    });
    expect(last6HoursLabel).toHaveClass(
      `${iotPrefix}--date-time-picker__listitem--preset-selected`
    );
  });

  it('should allow keyboard navigation of presets', () => {
    const { container } = render(<DateTimePicker {...dateTimePickerProps} id="picker-test" />);
    userEvent.click(screen.getByTestId('date-time-picker__field'));
    expect(screen.getByRole('button', { name: 'Apply' })).toBeVisible();
    fireEvent.keyUp(screen.getByTestId(`date-time-picker__field`), {
      key: 'ArrowDown',
      code: 'ArrowDown',
    });
    expect(screen.getByText('Custom Range')).toHaveFocus();
    fireEvent.keyDown(
      container.querySelector(`.${iotPrefix}--date-time-picker__menu-scroll > div`),
      {
        key: 'ArrowDown',
        code: 'ArrowDown',
      }
    );
    expect(screen.getByText('Last 30 minutes', { selector: 'li' })).toHaveFocus();

    fireEvent.keyDown(
      container.querySelector(`.${iotPrefix}--date-time-picker__menu-scroll > div`),
      {
        key: 'ArrowUp',
        code: 'ArrowUp',
      }
    );
    expect(screen.getByText('Custom Range')).toHaveFocus();

    fireEvent.keyDown(
      container.querySelector(`.${iotPrefix}--date-time-picker__menu-scroll > div`),
      {
        key: 'ArrowRight',
        code: 'ArrowRight',
      }
    );
    expect(screen.getByText('Custom Range')).toHaveFocus();

    fireEvent.keyDown(
      container.querySelector(`.${iotPrefix}--date-time-picker__menu-scroll > div`),
      {
        key: 'ArrowUp',
        code: 'ArrowUp',
      }
    );
    expect(screen.getByText('Last 24 hours')).toHaveFocus();

    fireEvent.keyDown(
      container.querySelector(`.${iotPrefix}--date-time-picker__menu-scroll > div`),
      {
        key: 'ArrowDown',
        code: 'ArrowDown',
      }
    );
    expect(screen.getByText('Custom Range')).toHaveFocus();

    fireEvent.keyUp(screen.getByTestId(`date-time-picker__field`), {
      key: 'Escape',
      code: 'Escape',
    });
    expect(screen.getByRole('listbox')).not.toHaveClass(
      `${iotPrefix}--date-time-picker__menu-expanded`
    );
  });

  it('should allow keyboard navigation of absolute/relative types', () => {
    render(<DateTimePicker {...dateTimePickerProps} id="picker-test" />);
    userEvent.click(screen.getByTestId('date-time-picker__field'));
    userEvent.click(screen.getByText('Custom Range'));
    // relative → absolute
    userEvent.type(screen.getByLabelText('Relative'), '{arrowright}');
    expect(screen.getByLabelText('Absolute')).toBeChecked();

    // absolute ← relative
    userEvent.type(screen.getByLabelText('Absolute'), '{arrowleft}');
    expect(screen.getByLabelText('Relative')).toBeChecked();

    // relative ↑ absolute
    userEvent.type(screen.getByLabelText('Relative'), '{arrowup}');
    expect(screen.getByLabelText('Absolute')).toBeChecked();

    // absolute ↓ relative
    userEvent.type(screen.getByLabelText('Absolute'), '{arrowdown}');
    expect(screen.getByLabelText('Relative')).toBeChecked();
  });
});
