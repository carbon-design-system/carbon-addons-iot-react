/* eslint-disable no-underscore-dangle */
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

export const PRESET_VALUES = [
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
  defaultValue: PropTypes.oneOfType([
    PropTypes.exact({
      timeRangeKind: PropTypes.oneOf([PICKER_KINDS.PRESET]).isRequired,
      timeRangeValue: PropTypes.exact({
        label: PropTypes.string.isRequired,
        offset: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    PropTypes.exact({
      timeRangeKind: PropTypes.oneOf([PICKER_KINDS.RELATIVE]).isRequired,
      timeRangeValue: PropTypes.exact({
        lastNumber: PropTypes.number.isRequired,
        lastInterval: PropTypes.string.isRequired,
        relativeToWhen: PropTypes.string.isRequired,
        relativeToTime: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    PropTypes.exact({
      timeRangeKind: PropTypes.oneOf([PICKER_KINDS.ABSOLUTE]).isRequired,
      timeRangeValue: PropTypes.exact({
        startDate: PropTypes.string.isRequired,
        startTime: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        endTime: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ]),
  /** the moment.js format for the human readable interval value */
  dateTimeMask: PropTypes.string,
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
  /** triggered on apply with returning object with similar signature to defaultValue */
  onApply: PropTypes.func,
  /** All the labels that need translation */
  i18n: PropTypes.shape({
    toLabel: PropTypes.string,
    toNowLabel: PropTypes.string,
    calendarLabel: PropTypes.string,
    presetLabels: PropTypes.arrayOf(PropTypes.string),
    intervalLabels: PropTypes.arrayOf(PropTypes.string),
    relativeLabels: PropTypes.arrayOf(PropTypes.string),
    customRangeLinkLabel: PropTypes.string,
    customRangeLabel: PropTypes.string,
    relativeLabel: PropTypes.string,
    lastLabel: PropTypes.string,
    invalidNumberLabel: PropTypes.string,
    relativeToLabel: PropTypes.string,
    absoluteLabel: PropTypes.string,
    startTimeLabel: PropTypes.string,
    endTimeLabel: PropTypes.string,
    applyBtnLabel: PropTypes.string,
    cancelBtnLabel: PropTypes.string,
    backBtnLabel: PropTypes.string,
  }),
};

const defaultProps = {
  defaultValue: null,
  dateTimeMask: 'YYYY-MM-DD HH:mm',
  presets: PRESET_VALUES,
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
      label: 'Today',
      value: RELATIVE_VALUES.TODAY,
    },
    {
      label: 'Yesterday',
      value: RELATIVE_VALUES.YESTERDAY,
    },
  ],
  expanded: false,
  disabled: false,
  showRelativeOption: true,
  onCancel: null,
  onApply: null,
  i18n: {
    toLabel: 'to',
    toNowLabel: 'to Now',
    calendarLabel: 'Calendar',
    presetLabels: [
      'Last 30 minutes',
      'Last 1 hour',
      'Last 6 hours',
      'Last 12 hours',
      'Last 24 hours',
    ],
    intervalLabels: ['minutes', 'hours', 'days', 'weeks', 'months', 'years'],
    relativeLabels: ['Today', 'Yesterday'],
    customRangeLinkLabel: 'Custom Range',
    customRangeLabel: 'Custom range',
    relativeLabel: 'Relative',
    lastLabel: 'Last',
    invalidNumberLabel: 'Number is not valid',
    relativeToLabel: 'Relative to',
    absoluteLabel: 'Absolute',
    startTimeLabel: 'Start time',
    endTimeLabel: 'End time',
    applyBtnLabel: 'Apply',
    cancelBtnLabel: 'Cancel',
    backBtnLabel: 'Back',
  },
};

const DateTimePicker = ({
  defaultValue,
  dateTimeMask,
  presets,
  intervals,
  relatives,
  expanded,
  disabled,
  showRelativeOption,
  onCancel,
  onApply,
  i18n,
  ...others
}) => {
  const strings = {
    ...defaultProps.i18n,
    ...i18n,
  };

  // State
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [customRangeKind, setCustomRangeKind] = useState(
    showRelativeOption ? PICKER_KINDS.RELATIVE : PICKER_KINDS.ABSOLUTE
  );
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [currentValue, setCurrentValue] = useState(null);
  const [lastAppliedValue, setLastAppliedValue] = useState(null);
  const [humanValue, setHumanValue] = useState(null);
  const [relativeValue, setRelativeValue] = useState(null);
  const [absoluteValue, setAbsoluteValue] = useState(null);
  const [focusOnFirstField, setFocusOnFirstField] = useState(true);

  // Refs
  const datePickerRef = React.createRef();
  const relativeSelect = React.createRef(null);

  const dateTimePickerBaseValue = {
    kind: '',
    preset: {
      label: presets[0].label,
      offset: presets[0].offset,
    },
    relative: {
      lastNumber: null,
      lastInterval: intervals[0].value,
      relativeToWhen: relatives[0].value,
      relativeToTime: null,
    },
    absolute: {
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
    },
  };

  useEffect(
    () => {
      const timeout = setTimeout(() => {
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
      return () => {
        clearTimeout(timeout);
      };
    },
    [datePickerRef]
  );

  /**
   * Parses a value object into a human readable value
   * @param {Object} value - the currently selected value
   * @param {string} value.kind - preset/relative/absolute
   * @param {Object} value.preset - the preset selection
   * @param {Object} value.relative - the relative time selection
   * @param {Object} value.absolute - the absolute time selection
   * @returns {Object} a human readable value and a furtherly augmented value object
   */
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
        readableValue = `${moment(startDate).format(dateTimeMask)} ${strings.toLabel} ${moment(
          endDate
        ).format(dateTimeMask)}`;
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
        readableValue = `${moment(startDate).format(dateTimeMask)} ${strings.toLabel} ${moment(
          endDate
        ).format(dateTimeMask)}`;
        break;
      }
      default:
        readableValue = value.preset.label;
        break;
    }
    setHumanValue(readableValue);
    return { readableValue, ...returnValue };
  };

  /**
   * Transforms a default or selected value into a full blown returnable object
   * @param {Object} [preset] clicked preset
   * @param {string} preset.label preset label
   * @param {number} preset.offset preset offset in minutes
   * @returns {Object} the augmented value itself and the human readable value
   */
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

  useEffect(
    () => {
      if (
        datePickerRef.current &&
        datePickerRef.current.inputField &&
        datePickerRef.current.toInputField
      ) {
        if (focusOnFirstField) {
          datePickerRef.current.inputField.focus();
        } else {
          datePickerRef.current.toInputField.focus();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focusOnFirstField]
  );

  const onDatePickerChange = range => {
    if (range.length > 1) {
      setFocusOnFirstField(!focusOnFirstField);
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
    if (flatpickr) {
      flatpickr.open();
    }
  };

  const onCustomRangeChange = kind => {
    setCustomRangeKind(kind);
  };

  const onPresetClick = preset => {
    setSelectedPreset(preset.offset);
    renderValue(preset);
  };

  const resetRelativeValue = () => {
    setRelativeValue({
      lastNumber: 0,
      lastInterval: intervals[0].value,
      relativeToWhen: relatives[0].value,
      relativeToTime: '',
    });
  };

  const resetAbsoluteValue = () => {
    setAbsoluteValue({
      startDate: '',
      startTime: '00:00',
      endDate: '',
      endTime: '00:00',
    });
  };

  const parseDefaultValue = (lastValue = null) => {
    const parsableValue = lastValue || defaultValue;
    const currentCustomRangeKind = showRelativeOption
      ? PICKER_KINDS.RELATIVE
      : PICKER_KINDS.ABSOLUTE;
    if (parsableValue !== null) {
      if (parsableValue.timeRangeKind === PICKER_KINDS.PRESET) {
        // preset
        resetAbsoluteValue();
        resetRelativeValue();
        setCustomRangeKind(currentCustomRangeKind);
        onPresetClick(parsableValue.timeRangeValue);
      }
      if (parsableValue.timeRangeKind === PICKER_KINDS.RELATIVE) {
        // relative
        resetAbsoluteValue();
        setIsCustomRange(true);
        setCustomRangeKind(currentCustomRangeKind);
        setRelativeValue(parsableValue.timeRangeValue);
      }

      if (parsableValue.timeRangeKind === PICKER_KINDS.ABSOLUTE) {
        // absolute
        const absolute = { ...parsableValue.timeRangeValue };
        resetRelativeValue();
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
      resetAbsoluteValue();
      resetRelativeValue();
      setCustomRangeKind(currentCustomRangeKind);
      onPresetClick(presets[0]);
    }
  };

  const toggleIsCustomRange = () => {
    setIsCustomRange(!isCustomRange);

    // If value was changed reset when going back to Preset
    if (absoluteValue.startDate !== '' || relativeValue.lastNumber > 0) {
      if (selectedPreset) {
        onPresetClick(presets.filter(x => x.offset === selectedPreset)[0]);
        resetAbsoluteValue();
        resetRelativeValue();
      } else {
        onPresetClick(presets[0]);
        resetAbsoluteValue();
        resetRelativeValue();
      }
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
    parseDefaultValue(lastAppliedValue);

    if (onCancel) {
      onCancel();
    }
  };

  const onApplyClick = () => {
    setIsExpanded(false);
    const value = renderValue();
    const returnValue = {
      timeRangeKind: value.kind,
      timeRangeValue: null,
    };
    switch (value.kind) {
      case PICKER_KINDS.ABSOLUTE:
        returnValue.timeRangeValue = value.absolute;
        setLastAppliedValue(value.absolute);
        break;
      case PICKER_KINDS.RELATIVE:
        returnValue.timeRangeValue = value.relative;
        setLastAppliedValue(value.relative);
        break;
      default:
        returnValue.timeRangeValue = value.preset;
        setLastAppliedValue(value.preset);
        break;
    }

    if (onApply) {
      onApply(returnValue);
    }
  };

  /**
   * Get an alternative human readable value for a preset to show in tooltips and dropdown
   * ie. 'Last 30 minutes' displays '2020-04-01 11:30 to Now' on the tooltip
   * @returns {string} an interval string, starting point in time to now
   */
  const getIntervalValue = () => {
    if (currentValue) {
      if (currentValue.kind === PICKER_KINDS.PRESET) {
        return `${moment()
          .subtract(currentValue.preset.offset, 'minutes')
          .format(dateTimeMask)} ${strings.toNowLabel}`;
      }
    }
    return '';
  };

  // Util func to update the relative value
  const changeRelativePropertyValue = (property, value) => {
    const newRelative = { ...relativeValue };
    newRelative[property] = value;
    setRelativeValue(newRelative);
  };

  // on change functions that trigger a relative value update
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

  // Util func to update the absolute value
  const changeAbsolutePropertyValue = (property, value) => {
    const newAbsolute = { ...absoluteValue };
    newAbsolute[property] = value;
    setAbsoluteValue(newAbsolute);
  };

  // on change functions that trigger a absolute value update
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
            <span title={humanValue}>{humanValue}</span>
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
          <Calendar16
            aria-label={strings.calendarLabel}
            className={`${iotPrefix}--date-time-picker__icon`}
          />
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
                  {strings.customRangeLinkLabel}
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
                      {strings.presetLabels[i] || preset.label}
                    </ListItem>
                  );
                })}
              </OrderedList>
            ) : (
              <div>
                {showRelativeOption ? (
                  <FormGroup
                    legendText={strings.customRangeLabel}
                    className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                  >
                    <RadioButtonGroup
                      valueSelected={customRangeKind}
                      onChange={onCustomRangeChange}
                      name="radiogroup"
                    >
                      <RadioButton
                        value={PICKER_KINDS.RELATIVE}
                        id="relative"
                        labelText={strings.relativeLabel}
                      />
                      <RadioButton
                        value={PICKER_KINDS.ABSOLUTE}
                        id="absolute"
                        labelText={strings.absoluteLabel}
                      />
                    </RadioButtonGroup>
                  </FormGroup>
                ) : null}
                {showRelativeOption && customRangeKind === PICKER_KINDS.RELATIVE ? (
                  <div>
                    <FormGroup
                      legendText={strings.lastLabel}
                      className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                    >
                      <div className={`${iotPrefix}--date-time-picker__fields-wrapper`}>
                        <NumberInput
                          id="last-number"
                          invalidText={strings.invalidNumberLabel}
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
                              <SelectItem
                                key={i}
                                value={interval.value}
                                text={strings.intervalLabels[i] || interval.label}
                              />
                            );
                          })}
                        </Select>
                      </div>
                    </FormGroup>
                    <FormGroup
                      legendText={strings.relativeToLabel}
                      className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                    >
                      <div className={`${iotPrefix}--date-time-picker__fields-wrapper`}>
                        <Select
                          {...others}
                          ref={relativeSelect}
                          id="relative-to-when"
                          defaultValue={relativeValue ? relativeValue.relativeToWhen : ''}
                          onChange={onRelativeToWhenChange}
                          hideLabel
                        >
                          {relatives.map((relative, i) => {
                            return (
                              <SelectItem
                                key={i}
                                value={relative.value}
                                text={
                                  strings.relativeLabels.filter(x => x === relative.label)[0] ||
                                  relative.label
                                }
                              />
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
                          labelText={strings.startTimeLabel}
                          value={absoluteValue ? absoluteValue.startTime : '00:00'}
                          onChange={onAbsoluteStartTimeChange}
                          spinner
                          autoComplete="off"
                        />
                        <TimePickerSpinner
                          id="end-time"
                          labelText={strings.endTimeLabel}
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
                {strings.backBtnLabel}
              </Button>
            ) : (
              <Button
                kind="secondary"
                className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-cancel`}
                onClick={onCancelClick}
                {...others}
              >
                {strings.cancelBtnLabel}
              </Button>
            )}
            <Button
              kind="primary"
              className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-apply`}
              {...others}
              onClick={onApplyClick}
            >
              {strings.applyBtnLabel}
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
