import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  DatePicker,
  DatePickerInput,
  RadioButtonGroup,
  RadioButton,
  FormGroup,
  Select,
  SelectItem,
  NumberInput,
  TooltipDefinition,
  OrderedList,
  ListItem,
} from 'carbon-components-react';
import moment from 'moment';
import { Calendar16 } from '@carbon/icons-react';
import classnames from 'classnames';

import TimePickerSpinner from '../TimePickerSpinner/TimePickerSpinner';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

export const PICKER_KINDS = {
  PRESET: 'PRESET',
  RELATIVE: 'RELATIVE',
  ABSOLUTE: 'ABSOLUTE',
};

export const PRESETS_VALUES = [
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
  {
    label: 'Last 24 hours',
    offset: 1440,
  },
];

export const INTERVAL_VALUES = {
  MINUTES: 'MINUTES',
  HOURS: 'HOURS',
  DAYS: 'DAYS',
  WEEKS: 'WEEKS',
  MONTHS: 'MONTHS',
  YEARS: 'YEARS',
};
export const RELATIVE_VALUES = {
  YESTERDAY: 'YESTERDAY',
  TODAY: 'TODAY',
};

const propTypes = {
  /** default value for the picker */
  defaultValue: PropTypes.shape({
    kind: PropTypes.oneOf([PICKER_KINDS.PRESET, PICKER_KINDS.RELATIVE, PICKER_KINDS.ABSOLUTE]),
    preset: PropTypes.shape({
      label: PropTypes.string,
      offset: PropTypes.number,
    }),
    relative: PropTypes.shape({
      lastNumber: PropTypes.number,
      lastInterval: PropTypes.string,
      relativeToWhen: PropTypes.string,
      relativeToTime: PropTypes.string,
    }),
    absolute: PropTypes.shape({
      startDate: PropTypes.instanceOf(Date),
      startTime: PropTypes.string,
      endDate: PropTypes.instanceOf(Date),
      endTime: PropTypes.string,
    }),
  }),
  /** a list of options to for the default presets */
  presets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      offset: PropTypes.number,
    })
  ),
  /** a list of options to put on the 'Last' interval dropdown */
  intervals: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  /** a list of options to put on the 'Relative to' dropdown */
  relatives: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  /** show the picker in the expanded state */
  expanded: PropTypes.bool,
  /** disable the input */
  disabled: PropTypes.bool,
  /** show the relative custom range picker */
  showRelativeOption: PropTypes.bool,
  /** triggered on cancel */
  onCancel: PropTypes.func,
  /** triggered on apply with this returning object */
  /*
  {
    kind: String // the type of selection, one of PICKER_KINDS (PRESET, RELATIVE, ABSOLUTE)
    preset: {
      label: String // the label of the selected preset
      offset: Number // the offset in minute
    },
    relative: {
      start: Date // the start point in time
      end: Date // the end point in time
      lastNumber: Number // quantity of interval
      lastInterval: String // one of INTERVAL_VALUES
      relativeToWhen: String // one of RELATIVE_VALUES, indicates to what point in time the selection is relative to
      relativeToTime: String // in the HH:MM format
    },
    absolute: {
      start: Date // the start point in time
      end: Date // the end point in time
      startDate: String // start date in the mask or default format
      startTime: String // in the HH:MM format
      endDate:  // end date in the mask or default format
      endTime: String // in the HH:MM format
    },
  } */
  onApply: PropTypes.func,
};

const defaultProps = {
  defaultValue: null,
  presets: PRESETS_VALUES,
  intervals: [
    {
      label: 'minutes',
      value: INTERVAL_VALUES.MINUTES,
    },
    {
      label: 'hours',
      value: INTERVAL_VALUES.HOURS,
    },
    {
      label: 'days',
      value: INTERVAL_VALUES.DAYS,
    },
    {
      label: 'weeks',
      value: INTERVAL_VALUES.WEEKS,
    },
    {
      label: 'months',
      value: INTERVAL_VALUES.MONTHS,
    },
    {
      label: 'years',
      value: INTERVAL_VALUES.YEARS,
    },
  ],
  relatives: [
    {
      label: '',
      value: '',
    },
    {
      label: 'Yesterday',
      value: RELATIVE_VALUES.YESTERDAY,
    },
    {
      label: 'Today',
      value: RELATIVE_VALUES.TODAY,
    },
  ],
  expanded: false,
  disabled: false,
  showRelativeOption: true,
  onCancel: null,
  onApply: null,
};

const DateTimePicker = ({
  defaultValue,
  presets,
  intervals,
  relatives,
  expanded,
  disabled,
  showRelativeOption,
  onCancel,
  onApply,
  ...others
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [customRangeKind, setCustomRangeKind] = useState(
    showRelativeOption ? PICKER_KINDS.RELATIVE : PICKER_KINDS.ABSOLUTE
  );

  const [isCustomRange, setIsCustomRange] = useState(false);

  const datePickerRef = React.createRef();

  const [selectedPreset, setSelectedPreset] = useState(null);

  const [currentValue, setCurrentValue] = useState(null);
  const [humanValue, setHumanValue] = useState(null);

  const [relativeValue, setRelativeValue] = useState(null);
  const [absoluteValue, setAbsoluteValue] = useState(null);

  const dateTimePickerBaseValue = {
    kind: '',
    preset: {
      label: null,
      offset: null,
    },
    relative: {
      lastNumber: null,
      lastInterval: null,
      relativeToWhen: null,
      relativeToTime: null,
    },
    absolute: {
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
    },
  };

  useEffect(() => {
    window.setTimeout(() => {
      /* istanbul ignore next */
      if (datePickerRef && datePickerRef.current) {
        datePickerRef.current.cal.open();
        // while waiting for https://github.com/carbon-design-system/carbon/issues/5713
        // the only way to display the calendar inline is to reparent its DOM to our component
        const wrapper = document.getElementById(`${iotPrefix}--date-time-picker__wrapper`);
        if (typeof wrapper !== 'undefined' && wrapper !== null) {
          const dp = document
            .getElementById(`${iotPrefix}--date-time-picker__wrapper`)
            .getElementsByClassName(`${iotPrefix}--date-time-picker__datepicker`)[0];
          dp.appendChild(datePickerRef.current.cal.calendarContainer);
        }
      }
    }, 0);
  });

  const parseValue = value => {
    setCurrentValue(value);
    let readableValue = '';
    const returnValue = { ...value };
    switch (value.kind) {
      case PICKER_KINDS.RELATIVE: {
        let endDate = moment();
        if (value.relative.relativeToWhen !== '') {
          endDate =
            value.relative.relativeToWhen === RELATIVE_VALUES.YESTERDAY
              ? moment().add(-1, INTERVAL_VALUES.DAYS)
              : moment();
          if (value.relative.relativeToTime) {
            endDate.hours(value.relative.relativeToTime.split(':')[0]);
            endDate.minutes(value.relative.relativeToTime.split(':')[1]);
          }
        }
        const startDate = endDate
          .clone()
          .subtract(
            value.relative.lastNumber,
            value.relative.lastInterval ? value.relative.lastInterval : INTERVAL_VALUES.MINUTES
          );
        returnValue.relative.start = new Date(startDate.valueOf());
        returnValue.relative.end = new Date(endDate.valueOf());
        readableValue = `${moment(startDate).format('YYYY-MM-DD HH:mm')} to ${moment(
          endDate
        ).format('YYYY-MM-DD HH:mm')}`;
        break;
      }
      case PICKER_KINDS.ABSOLUTE: {
        const startDate = moment(value.absolute.start);
        if (value.absolute.startTime) {
          startDate.hours(value.absolute.startTime.split(':')[0]);
          startDate.minutes(value.absolute.startTime.split(':')[1]);
        }
        returnValue.absolute.start = new Date(startDate.valueOf());
        const endDate = moment(value.absolute.end);
        if (value.absolute.endTime) {
          endDate.hours(value.absolute.endTime.split(':')[0]);
          endDate.minutes(value.absolute.endTime.split(':')[1]);
        }
        returnValue.absolute.end = new Date(endDate.valueOf());
        readableValue = `${moment(startDate).format('YYYY-MM-DD HH:mm')} to ${moment(
          endDate
        ).format('YYYY-MM-DD HH:mm')}`;
        break;
      }
      default:
        readableValue = value.preset.label;
        break;
    }
    setHumanValue(readableValue);
    return { readableValue, ...returnValue };
  };

  const renderValue = (clickedPreset = null) => {
    const value = { ...dateTimePickerBaseValue };
    if (isCustomRange) {
      if (customRangeKind === PICKER_KINDS.RELATIVE) {
        value.relative = relativeValue;
      } else {
        value.absolute = absoluteValue;
      }
      value.kind = customRangeKind;
    } else {
      const preset = presets
        .filter(p => p.offset === (clickedPreset ? clickedPreset.offset : selectedPreset))
        .pop();
      value.preset = preset;
      value.kind = PICKER_KINDS.PRESET;
    }
    return {
      ...value,
      ...parseValue(value),
    };
  };

  useEffect(
    () => {
      if (absoluteValue || relativeValue) {
        renderValue();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [absoluteValue, relativeValue]
  );

  const onFieldClick = () => {
    setIsExpanded(!isExpanded);
  };

  let focusOnFirstField = true;
  /* istanbul ignore next */
  const onDatePickerChange = range => {
    if (range.length > 1) {
      focusOnFirstField = !focusOnFirstField;
    }
    if (focusOnFirstField && datePickerRef.current.inputField) {
      datePickerRef.current.inputField.focus();
    } else {
      datePickerRef.current.toInputField.focus();
    }

    const newAbsolute = { ...absoluteValue };
    [newAbsolute.start] = range;
    newAbsolute.startDate = moment(newAbsolute.start).format('MM/DD/YYYY');
    newAbsolute.end = range[range.length - 1];
    newAbsolute.endDate = moment(newAbsolute.end).format('MM/DD/YYYY');
    setAbsoluteValue(newAbsolute);
  };

  const onDatePickerClose = (range, single, flatpickr) => {
    // force it to stay open
    /* istanbul ignore next */
    if (flatpickr) {
      flatpickr.open();
    }
  };

  const onCustomRangeChange = kind => {
    setCustomRangeKind(kind);
  };

  const toggleIsCustomRange = () => {
    setIsCustomRange(!isCustomRange);
    setSelectedPreset(null);
  };

  const onPresetClick = preset => {
    setSelectedPreset(preset.offset);
    renderValue(preset);
  };

  const parseDefaultValue = () => {
    if (defaultValue !== null) {
      if (defaultValue.hasOwnProperty('offset')) {
        // preset
        onPresetClick(defaultValue);
      }
      if (defaultValue.hasOwnProperty('lastNumber')) {
        // relative
        setIsCustomRange(true);
        setCustomRangeKind(PICKER_KINDS.RELATIVE);
        setRelativeValue(defaultValue);
      }

      if (defaultValue.hasOwnProperty('startDate')) {
        // absolute
        const absolute = { ...defaultValue };
        setIsCustomRange(true);
        setCustomRangeKind(PICKER_KINDS.ABSOLUTE);
        if (!absolute.hasOwnProperty('start')) {
          absolute.start = moment(absolute.startDate).valueOf();
        }
        if (!absolute.hasOwnProperty('end')) {
          absolute.end = moment(absolute.endDate).valueOf();
        }
        setAbsoluteValue(absolute);
      }
    } else {
      onPresetClick(presets[0]);
    }
  };

  useEffect(
    () => {
      if (defaultValue || humanValue === null) {
        parseDefaultValue();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultValue]
  );

  const onCancelClick = () => {
    setIsExpanded(false);
    parseDefaultValue();
    if (onCancel) {
      onCancel();
    }
  };

  const onApplyClick = () => {
    setIsExpanded(false);
    const value = renderValue();
    if (onApply) {
      onApply(value);
    }
  };

  const getIntervalValue = () => {
    if (currentValue) {
      if (currentValue.kind === PICKER_KINDS.PRESET) {
        return `${moment()
          .subtract(currentValue.preset.offset, 'minutes')
          .format('YYYY-MM-DD HH:mm')} to Now`;
      }
    }
    return '';
  };

  const changeRelativePropertyValue = (property, value) => {
    const newRelative = { ...relativeValue };
    newRelative[property] = value;
    setRelativeValue(newRelative);
  };

  const onRelativeLastNumberChange = event => {
    changeRelativePropertyValue('lastNumber', Number(event.imaginaryTarget.value));
  };

  const onRelativeLastIntervalChange = event => {
    changeRelativePropertyValue('lastInterval', event.currentTarget.value);
  };

  const onRelativeToWhenChange = event => {
    changeRelativePropertyValue('relativeToWhen', event.currentTarget.value);
  };

  const onRelativeToTimeChange = pickerValue => {
    changeRelativePropertyValue('relativeToTime', pickerValue);
  };

  const changeAbsolutePropertyValue = (property, value) => {
    const newAbsolute = { ...absoluteValue };
    newAbsolute[property] = value;
    setAbsoluteValue(newAbsolute);
  };

  const onAbsoluteStartTimeChange = pickerValue => {
    changeAbsolutePropertyValue('startTime', pickerValue);
  };

  const onAbsoluteEndTimeChange = pickerValue => {
    changeAbsolutePropertyValue('endTime', pickerValue);
  };

  return (
    <div
      id={`${iotPrefix}--date-time-picker__wrapper`}
      className={`${iotPrefix}--date-time-picker__wrapper`}
    >
      <div className={`${iotPrefix}--date-time-picker__box`}>
        <div
          className={`${iotPrefix}--date-time-picker__field`}
          role="button"
          onClick={onFieldClick}
          onKeyPress={onFieldClick}
          tabIndex={0}
        >
          {isExpanded || (currentValue && currentValue.kind !== PICKER_KINDS.PRESET) ? (
            <span>{humanValue}</span>
          ) : humanValue ? (
            <TooltipDefinition
              align="start"
              direction="bottom"
              tooltipText={getIntervalValue()}
              triggerClassName=""
            >
              {humanValue}
            </TooltipDefinition>
          ) : null}
          <Calendar16 aria-label="Calendar" className={`${iotPrefix}--date-time-picker__icon`} />
        </div>
        <div
          className={classnames(`${iotPrefix}--date-time-picker__menu`, {
            [`${iotPrefix}--date-time-picker__menu-expanded`]: isExpanded,
          })}
          role="listbox"
        >
          <div className={`${iotPrefix}--date-time-picker__menu-scroll`}>
            {!isCustomRange ? (
              <OrderedList nested={false}>
                {getIntervalValue() ? (
                  <ListItem
                    className={`${iotPrefix}--date-time-picker__listitem ${iotPrefix}--date-time-picker__listitem--current`}
                  >
                    {getIntervalValue()}
                  </ListItem>
                ) : null}
                <ListItem
                  onClick={toggleIsCustomRange}
                  className={`${iotPrefix}--date-time-picker__listitem ${iotPrefix}--date-time-picker__listitem--custom`}
                >
                  Custom Range
                </ListItem>
                {presets.map((preset, i) => {
                  return (
                    <ListItem
                      key={i}
                      onClick={() => onPresetClick(preset)}
                      className={classnames(
                        `${iotPrefix}--date-time-picker__listitem ${iotPrefix}--date-time-picker__listitem--preset`,
                        {
                          [`${iotPrefix}--date-time-picker__listitem--preset-selected`]:
                            selectedPreset === preset.offset,
                        }
                      )}
                    >
                      {preset.label}
                    </ListItem>
                  );
                })}
              </OrderedList>
            ) : (
              <div>
                {showRelativeOption ? (
                  <FormGroup
                    legendText="Custom range"
                    className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                  >
                    <RadioButtonGroup
                      defaultSelected={customRangeKind}
                      onChange={onCustomRangeChange}
                      name="radiogroup"
                    >
                      <RadioButton
                        value={PICKER_KINDS.RELATIVE}
                        id="relative"
                        labelText="Relative"
                      />
                      <RadioButton
                        value={PICKER_KINDS.ABSOLUTE}
                        id="absolute"
                        labelText="Absolute"
                      />
                    </RadioButtonGroup>
                  </FormGroup>
                ) : null}
                {customRangeKind === PICKER_KINDS.RELATIVE ? (
                  <div>
                    <FormGroup
                      legendText="Last"
                      className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                    >
                      <div className={`${iotPrefix}--date-time-picker__fields-wrapper`}>
                        <NumberInput
                          id="last-number"
                          invalidText="Number is not valid"
                          step={1}
                          min={0}
                          value={relativeValue ? relativeValue.lastNumber : 0}
                          onChange={onRelativeLastNumberChange}
                        />
                        <Select
                          {...others}
                          id="last-interval"
                          defaultValue={
                            relativeValue ? relativeValue.lastInterval : INTERVAL_VALUES.MINUTES
                          }
                          onChange={onRelativeLastIntervalChange}
                          hideLabel
                        >
                          {intervals.map((interval, i) => {
                            return (
                              <SelectItem key={i} value={interval.value} text={interval.label} />
                            );
                          })}
                        </Select>
                      </div>
                    </FormGroup>
                    <FormGroup
                      legendText="Relative to"
                      className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                    >
                      <div className={`${iotPrefix}--date-time-picker__fields-wrapper`}>
                        <Select
                          {...others}
                          id="relative-to-when"
                          defaultValue={relativeValue ? relativeValue.relativeToWhen : ''}
                          onChange={onRelativeToWhenChange}
                          hideLabel
                        >
                          {relatives.map((relative, i) => {
                            return (
                              <SelectItem key={i} value={relative.value} text={relative.label} />
                            );
                          })}
                        </Select>
                        <TimePickerSpinner
                          id="relative-to-time"
                          value={relativeValue ? relativeValue.relativeToTime : ''}
                          onChange={onRelativeToTimeChange}
                          spinner
                          autoComplete="off"
                        />
                      </div>
                    </FormGroup>
                  </div>
                ) : (
                  <div>
                    <div className={`${iotPrefix}--date-time-picker__datepicker`}>
                      <DatePicker
                        datePickerType="range"
                        dateFormat="m/d/Y"
                        ref={datePickerRef}
                        onChange={onDatePickerChange}
                        onClose={onDatePickerClose}
                      >
                        <DatePickerInput
                          labelText=""
                          id="date-picker-input-start"
                          hideLabel
                          value={absoluteValue ? absoluteValue.startDate : ''}
                        />
                        <DatePickerInput
                          labelText=""
                          id="date-picker-input-end"
                          hideLabel
                          value={absoluteValue ? absoluteValue.endDate : ''}
                        />
                      </DatePicker>
                    </div>
                    <FormGroup
                      legendText=""
                      className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                    >
                      <div className={`${iotPrefix}--date-time-picker__fields-wrapper`}>
                        <TimePickerSpinner
                          id="start-time"
                          labelText="Start time"
                          value={absoluteValue ? absoluteValue.startTime : '00:00'}
                          onChange={onAbsoluteStartTimeChange}
                          spinner
                          autoComplete="off"
                        />
                        <TimePickerSpinner
                          id="end-time"
                          labelText="End time"
                          value={absoluteValue ? absoluteValue.endTime : '00:00'}
                          onChange={onAbsoluteEndTimeChange}
                          spinner
                          autoComplete="off"
                        />
                      </div>
                    </FormGroup>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={`${iotPrefix}--date-time-picker__menu-btn-set`}>
            {isCustomRange ? (
              <Button
                kind="secondary"
                className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-back`}
                {...others}
                onClick={toggleIsCustomRange}
              >
                Back
              </Button>
            ) : (
              <Button
                kind="secondary"
                className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-cancel`}
                onClick={onCancelClick}
                {...others}
              >
                Cancel
              </Button>
            )}
            <Button
              kind="primary"
              className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-apply`}
              {...others}
              onClick={onApplyClick}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

DateTimePicker.propTypes = propTypes;
DateTimePicker.defaultProps = defaultProps;

export default DateTimePicker;
