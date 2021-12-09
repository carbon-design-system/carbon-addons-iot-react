import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  OrderedList,
  ListItem,
  TooltipDefinition,
} from 'carbon-components-react';
import { Calendar16 } from '@carbon/icons-react';
import classnames from 'classnames';
import uuid from 'uuid';

import TimePickerSpinner from '../TimePickerSpinner/TimePickerSpinner';
import { settings } from '../../constants/Settings';
import dayjs from '../../utils/dayjs';
import { handleSpecificKeyDown } from '../../utils/componentUtilityFunctions';
import { Tooltip } from '../Tooltip';

import { parseValue } from './dateTimePickerUtils';

const { iotPrefix } = settings;

export const PICKER_KINDS = {
  PRESET: 'PRESET',
  RELATIVE: 'RELATIVE',
  ABSOLUTE: 'ABSOLUTE',
};

export const PRESET_VALUES = [
  {
    id: 'item-01',
    label: 'Last 30 minutes',
    offset: 30,
  },
  {
    id: 'item-02',
    label: 'Last 1 hour',
    offset: 60,
  },
  {
    id: 'item-03',
    label: 'Last 6 hours',
    offset: 360,
  },
  {
    id: 'item-04',
    label: 'Last 12 hours',
    offset: 720,
  },
  {
    id: 'item-05',
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
  testId: PropTypes.string,
  /** default value for the picker */
  defaultValue: PropTypes.oneOfType([
    PropTypes.exact({
      timeRangeKind: PropTypes.oneOf([PICKER_KINDS.PRESET]).isRequired,
      timeRangeValue: PropTypes.exact({
        id: PropTypes.string,
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
        /** Can be a full parseable DateTime string or a Date object */
        start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        /** Can be a full parseable DateTime string or a Date object */
        end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        endDate: PropTypes.string.isRequired,
        endTime: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ]),
  /** the dayjs.js format for the human readable interval value */
  dateTimeMask: PropTypes.string,
  /** a list of options to for the default presets */
  presets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      offset: PropTypes.number,
      id: PropTypes.string,
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
  /** show the custom range link */
  showCustomRangeLink: PropTypes.bool,
  /** show time input fields */
  hasTimeInput: PropTypes.bool,
  /**
   * Function hook used to provide the appropriate tooltip content for the preset time
   * picker. This function takes in the currentValue and should return a string message.
   */
  renderPresetTooltipText: PropTypes.func,
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
    increment: PropTypes.string,
    decrement: PropTypes.string,
    hours: PropTypes.string,
    minutes: PropTypes.string,
    number: PropTypes.string,
  }),
  /** Light version  */
  light: PropTypes.bool,
  /** The language locale used to format the days of the week, months, and numbers. */
  locale: PropTypes.string,
  /** Unique id of the component */
  id: PropTypes.string,
};

const defaultProps = {
  testId: 'date-time-picker',
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
  showCustomRangeLink: true,
  hasTimeInput: true,
  renderPresetTooltipText: null,
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
    increment: 'Increment',
    decrement: 'Decrement',
    hours: 'hours',
    minutes: 'minutes',
    number: 'number',
  },
  light: false,
  locale: 'en',
  id: undefined,
};

const DateTimePicker = ({
  testId,
  defaultValue,
  dateTimeMask,
  presets,
  intervals,
  relatives,
  expanded,
  disabled,
  showRelativeOption,
  showCustomRangeLink,
  hasTimeInput,
  renderPresetTooltipText,
  onCancel,
  onApply,
  i18n,
  light,
  locale,
  id = uuid.v4(),
  ...others
}) => {
  const strings = {
    ...defaultProps.i18n,
    ...i18n,
  };
  // initialize the dayjs locale
  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [relativeLastNumberInvalid, setRelativeLastNumberInvalid] = useState(false);
  const [relativeToTimeInvalid, setRelativeToTimeInvalid] = useState(false);
  const [absoluteStartTimeInvalid, setAbsoluteStartTimeInvalid] = useState(true);
  const [absoluteEndTimeInvalid, setAbsoluteEndTimeInvalid] = useState(false);

  // Refs
  const [datePickerElem, setDatePickerElem] = useState(null);
  const relativeSelect = useRef(null);
  const presetListRef = useRef(null);
  const previousActiveElement = useRef(null);

  const dateTimePickerBaseValue = {
    kind: '',
    preset: {
      id: presets[0].id,
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

  /**
   * A callback ref to capture the DateTime node. When a user changes from Relative to Absolute
   * the calendar would capture focus and move the users position adding confusion to where they
   * are on the page. This also checks if they're currently focused on the Absolute radio button
   * and captures it so focus can be restored after the calendar has been reparented below.
   */
  const handleDatePickerRef = useCallback((node) => {
    if (document.activeElement?.getAttribute('value') === PICKER_KINDS.ABSOLUTE) {
      previousActiveElement.current = document.activeElement;
    }

    setDatePickerElem(node);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (datePickerElem) {
        datePickerElem.cal.open();
        // while waiting for https://github.com/carbon-design-system/carbon/issues/5713
        // the only way to display the calendar inline is to reparent its DOM to our component
        const wrapper = document.getElementById(`${id}-${iotPrefix}--date-time-picker__wrapper`);
        if (typeof wrapper !== 'undefined' && wrapper !== null) {
          const dp = document
            .getElementById(`${id}-${iotPrefix}--date-time-picker__wrapper`)
            .getElementsByClassName(`${iotPrefix}--date-time-picker__datepicker`)[0];
          dp.appendChild(datePickerElem.cal.calendarContainer);
        }

        // if we were focused on the Absolute radio button previously, restore focus to it.
        /* istanbul ignore if */
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
          previousActiveElement.current = null;
        }
      }
    }, 0);
    return () => {
      clearTimeout(timeout);
    };
  }, [datePickerElem, id]);

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
        .filter((p) => {
          let filteredPreset;
          if (p.id) {
            filteredPreset = p.id === (clickedPreset ? clickedPreset.id : selectedPreset);
          } else {
            filteredPreset = p.offset === (clickedPreset ? clickedPreset.offset : selectedPreset);
          }
          return filteredPreset;
        })
        .pop();
      value.preset = preset;
      value.kind = PICKER_KINDS.PRESET;
    }
    setCurrentValue(value);
    const parsedValue = parseValue(value, dateTimeMask, strings.toLabel);
    setHumanValue(parsedValue.readableValue);

    return {
      ...value,
      ...parsedValue,
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

  const getFocusableSiblings = () => {
    /* istanbul ignore else */
    if (presetListRef?.current) {
      const siblings = presetListRef.current.querySelectorAll('[tabindex]');
      return Array.from(siblings).filter(
        (sibling) => parseInt(sibling.getAttribute('tabindex'), 10) !== -1
      );
    }

    return [];
  };

  const onFieldInteraction = ({ key }) => {
    switch (key) {
      case 'Escape':
        setIsExpanded(false);
        break;
      // if the input box is focused and a down arrow is pressed this
      // moves focus to the first item in the preset list that has a tabindex
      case 'ArrowDown':
        /* istanbul ignore else */
        if (presetListRef?.current) {
          const listItems = getFocusableSiblings();
          /* istanbul ignore else */
          if (listItems?.[0]?.focus) {
            listItems[0].focus();
          }
        }
        break;
      default:
        setIsExpanded(!isExpanded);
        break;
    }
  };

  /**
   * Moves up the preset list to the previous focusable element or wraps around to the bottom
   * if already at the top.
   */
  const moveToPreviousElement = () => {
    const siblings = getFocusableSiblings();
    const index = siblings.findIndex((elem) => elem === document.activeElement);
    const previous = siblings[index - 1];
    if (previous) {
      previous.focus();
    } else {
      siblings[siblings.length - 1].focus();
    }
  };

  /**
   * Moves down the preset list to the next focusable element or wraps around to the top
   * if already at the bottom
   */
  const moveToNextElement = () => {
    const siblings = getFocusableSiblings();
    const index = siblings.findIndex((elem) => elem === document.activeElement);
    const next = siblings[index + 1];
    if (next) {
      next.focus();
    } else {
      siblings[0].focus();
    }
  };

  const onNavigatePresets = ({ key }) => {
    switch (key) {
      case 'ArrowUp':
        moveToPreviousElement();
        break;
      case 'ArrowDown':
        moveToNextElement();
        break;
      default:
        break;
    }
  };

  /**
   * Allows navigation back and forth between the radio buttons for Relative/Absolute
   *
   * @param {KeyboardEvent} e
   */
  const onNavigateRadioButton = (e) => {
    if (e.target.getAttribute('id').includes('absolute')) {
      setCustomRangeKind(PICKER_KINDS.RELATIVE);
      document.activeElement.parentNode.previousSibling
        .querySelector('input[type="radio"]')
        .focus();
    } else {
      setCustomRangeKind(PICKER_KINDS.ABSOLUTE);
      document.activeElement.parentNode.nextSibling.querySelector('input[type="radio"]').focus();
    }
  };

  useEffect(() => {
    if (datePickerElem && datePickerElem.inputField && datePickerElem.toInputField) {
      if (focusOnFirstField) {
        datePickerElem.inputField.click();
      } else {
        datePickerElem.toInputField.click();
      }
    }
  }, [datePickerElem, focusOnFirstField]);

  const onDatePickerChange = ([start, end], _, flatpickr) => {
    const calendarInFocus = document.activeElement.closest(
      `.${iotPrefix}--date-time-picker__datepicker`
    );

    const daysDidntChange =
      dayjs(absoluteValue.start).isSame(dayjs(start)) &&
      dayjs(absoluteValue.end).isSame(dayjs(end));

    if (daysDidntChange || !calendarInFocus) {
      // jump back to start to fix bug where flatpickr will change the month to the start
      // after it loses focus if you click outside the calendar
      if (focusOnFirstField) {
        flatpickr.jumpToDate(start);
      } else {
        flatpickr.jumpToDate(end);
      }

      // In some situations, when the calendar loses focus flatpickr is firing the onChange event
      // twice, but the dates reset to where both start and end are the same. This fixes that.
      if (!calendarInFocus && dayjs(start).isSame(dayjs(end))) {
        flatpickr.setDate([absoluteValue.start, absoluteValue.end]);
      }
      return;
    }

    const newAbsolute = { ...absoluteValue };
    newAbsolute.start = start;
    newAbsolute.startDate = dayjs(newAbsolute.start).format('MM/DD/YYYY');
    const prevFocusOnFirstField = focusOnFirstField;
    if (end) {
      setFocusOnFirstField(!focusOnFirstField);
      newAbsolute.start = start;
      newAbsolute.startDate = dayjs(newAbsolute.start).format('MM/DD/YYYY');
      newAbsolute.end = end;
      newAbsolute.endDate = dayjs(newAbsolute.end).format('MM/DD/YYYY');
      if (prevFocusOnFirstField) {
        flatpickr.jumpToDate(newAbsolute.start);
      } else {
        flatpickr.jumpToDate(newAbsolute.end);
      }
    } else {
      setFocusOnFirstField(false);
      flatpickr.jumpToDate(newAbsolute.start);
    }

    setAbsoluteValue(newAbsolute);
  };

  const onDatePickerClose = (range, single, flatpickr) => {
    // force it to stay open
    /* istanbul ignore else */
    if (flatpickr) {
      flatpickr.open();
    }
  };

  const onCustomRangeChange = (kind) => {
    setCustomRangeKind(kind);
  };

  const onPresetClick = (preset) => {
    setSelectedPreset(preset.id ?? preset.offset);
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

  const parseDefaultValue = (parsableValue) => {
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
          absolute.start = dayjs(absolute.startDate).valueOf();
        }
        if (!absolute.hasOwnProperty('end')) {
          absolute.end = dayjs(absolute.endDate).valueOf();
        }
        absolute.startDate = dayjs(absolute.start).format('MM/DD/YYYY');
        absolute.endDate = dayjs(absolute.end).format('MM/DD/YYYY');
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
        onPresetClick(presets.filter((p) => p.id ?? p.offset === selectedPreset)[0]);
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
      /* istanbul ignore else */
      if (defaultValue || humanValue === null) {
        parseDefaultValue(defaultValue);
        setLastAppliedValue(defaultValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultValue]
  );

  const onCancelClick = () => {
    setIsExpanded(false);
    parseDefaultValue(lastAppliedValue);

    /* istanbul ignore else */
    if (onCancel) {
      onCancel();
    }
  };

  const onApplyClick = () => {
    setIsExpanded(false);
    const value = renderValue();
    setLastAppliedValue(value);
    const returnValue = {
      timeRangeKind: value.kind,
      timeRangeValue: null,
    };
    switch (value.kind) {
      case PICKER_KINDS.ABSOLUTE:
        returnValue.timeRangeValue = value.absolute;
        break;
      case PICKER_KINDS.RELATIVE:
        returnValue.timeRangeValue = value.relative;
        break;
      default:
        returnValue.timeRangeValue = value.preset;
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
        return `${dayjs().subtract(currentValue.preset.offset, 'minutes').format(dateTimeMask)} ${
          strings.toNowLabel
        }`;
      }
      return humanValue;
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
  const onRelativeLastNumberChange = (event) => {
    const valid = !event.imaginaryTarget.getAttribute('data-invalid');
    setRelativeLastNumberInvalid(!valid);
    if (valid) {
      changeRelativePropertyValue('lastNumber', Number(event.imaginaryTarget.value));
    }
  };
  const onRelativeLastIntervalChange = (event) => {
    changeRelativePropertyValue('lastInterval', event.currentTarget.value);
  };
  const onRelativeToWhenChange = (event) => {
    changeRelativePropertyValue('relativeToWhen', event.currentTarget.value);
  };
  const onRelativeToTimeChange = (pickerValue, evt, meta) => {
    setRelativeToTimeInvalid(meta.invalid);
    changeRelativePropertyValue('relativeToTime', pickerValue);
  };

  // Util func to update the absolute value
  const changeAbsolutePropertyValue = (property, value) => {
    const newAbsolute = { ...absoluteValue };
    newAbsolute[property] = value;
    setAbsoluteValue(newAbsolute);
  };

  // Validate that the start time if less than the end time
  const validateStartEndTime = (startTime, endTime) => {
    const timefrom = new Date();
    let temp = startTime.split(':');
    timefrom.setHours(Number(temp[0]));
    timefrom.setMinutes(Number(temp[1]));

    const timeto = new Date();
    temp = endTime.split(':');
    timeto.setHours(Number(temp[0]));
    timeto.setMinutes(Number(temp[1]));

    return timefrom >= timeto;
  };

  // on change functions that trigger a absolute value update
  const onAbsoluteStartTimeChange = (pickerValue, evt, meta) => {
    const invalidStartEndTime = validateStartEndTime(pickerValue, absoluteValue.endTime);
    setAbsoluteStartTimeInvalid(meta.invalid || invalidStartEndTime);
    setAbsoluteEndTimeInvalid(absoluteEndTimeInvalid && invalidStartEndTime);
    changeAbsolutePropertyValue('startTime', pickerValue);
  };
  const onAbsoluteEndTimeChange = (pickerValue, evt, meta) => {
    const invalidStartEndTime = validateStartEndTime(absoluteValue.startTime, pickerValue);
    setAbsoluteEndTimeInvalid(meta.invalid || invalidStartEndTime);
    setAbsoluteStartTimeInvalid(absoluteStartTimeInvalid && invalidStartEndTime);

    changeAbsolutePropertyValue('endTime', pickerValue);
  };

  const tooltipValue = renderPresetTooltipText
    ? renderPresetTooltipText(currentValue)
    : getIntervalValue();

  const disableRelativeApply =
    isCustomRange &&
    customRangeKind === PICKER_KINDS.RELATIVE &&
    (relativeLastNumberInvalid || relativeToTimeInvalid);

  const disableAbsoluteApply =
    isCustomRange &&
    customRangeKind === PICKER_KINDS.ABSOLUTE &&
    (absoluteStartTimeInvalid || absoluteEndTimeInvalid);

  const disableApply = disableRelativeApply || disableAbsoluteApply;

  /**
   * Shows and hides the tooltip with the humanValue (Relative) or full-range (Absolute) when
   * the user focuses or hovers on the input
   */
  const toggleTooltip = () => {
    if (isExpanded) {
      setIsTooltipOpen(false);
    } else {
      setIsTooltipOpen((prev) => !prev);
    }
  };

  return (
    // Escape handler added to allow pressing escape to close the picker from any via event bubbling
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      data-testid={testId}
      id={`${id}-${iotPrefix}--date-time-picker__wrapper`}
      className={`${iotPrefix}--date-time-picker__wrapper`}
      onKeyDown={handleSpecificKeyDown(['Escape'], () => setIsExpanded(false))}
    >
      <div
        className={`${iotPrefix}--date-time-picker__box ${
          light ? `${iotPrefix}--date-time-picker__box--light` : ''
        }`}
      >
        <div
          data-testid={`${testId}__field`}
          className={`${iotPrefix}--date-time-picker__field`}
          role="button"
          onClick={onFieldInteraction}
          /* using on onKeyUp b/c something is preventing onKeyDown from firing with 'Enter' when the calendar is displayed */
          onKeyUp={handleSpecificKeyDown(['Enter', ' ', 'Escape', 'ArrowDown'], onFieldInteraction)}
          onFocus={toggleTooltip}
          onBlur={toggleTooltip}
          onMouseEnter={toggleTooltip}
          onMouseLeave={toggleTooltip}
          tabIndex={0}
        >
          {isExpanded || (currentValue && currentValue.kind !== PICKER_KINDS.PRESET) ? (
            <span title={humanValue}>{humanValue}</span>
          ) : humanValue ? (
            <TooltipDefinition
              align="start"
              direction="bottom"
              tooltipText={tooltipValue}
              triggerClassName=""
            >
              {humanValue}
            </TooltipDefinition>
          ) : null}
          <Calendar16
            aria-label={strings.calendarLabel}
            className={`${iotPrefix}--date-time-picker__icon`}
          />
          {!isExpanded && isTooltipOpen ? (
            <Tooltip
              open={isTooltipOpen}
              showIcon={false}
              focusTrap={false}
              triggerClassName={`${iotPrefix}--date-time-picker__tooltip-trigger`}
              className={`${iotPrefix}--date-time-picker__tooltip`}
            >
              {tooltipValue}
            </Tooltip>
          ) : null}
        </div>
        <div
          className={classnames(`${iotPrefix}--date-time-picker__menu`, {
            [`${iotPrefix}--date-time-picker__menu-expanded`]: isExpanded,
          })}
          role="listbox"
        >
          <div className={`${iotPrefix}--date-time-picker__menu-scroll`}>
            {!isCustomRange ? (
              // Catch bubbled Up/Down keys from the preset list and move focus.
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <div
                ref={presetListRef}
                onKeyDown={handleSpecificKeyDown(['ArrowUp', 'ArrowDown'], onNavigatePresets)}
              >
                <OrderedList nested={false}>
                  {tooltipValue ? (
                    <ListItem
                      className={`${iotPrefix}--date-time-picker__listitem ${iotPrefix}--date-time-picker__listitem--current`}
                    >
                      {tooltipValue}
                    </ListItem>
                  ) : null}
                  {showCustomRangeLink ? (
                    <ListItem
                      onClick={toggleIsCustomRange}
                      onKeyDown={handleSpecificKeyDown(['Enter', ' '], toggleIsCustomRange)}
                      className={`${iotPrefix}--date-time-picker__listitem ${iotPrefix}--date-time-picker__listitem--custom`}
                      tabIndex={0}
                    >
                      {strings.customRangeLinkLabel}
                    </ListItem>
                  ) : null}
                  {presets.map((preset, i) => {
                    return (
                      <ListItem
                        key={i}
                        onClick={() => onPresetClick(preset)}
                        onKeyDown={handleSpecificKeyDown(['Enter', ' '], () =>
                          onPresetClick(preset)
                        )}
                        tabIndex={0}
                        className={classnames(
                          `${iotPrefix}--date-time-picker__listitem ${iotPrefix}--date-time-picker__listitem--preset`,
                          {
                            [`${iotPrefix}--date-time-picker__listitem--preset-selected`]:
                              selectedPreset === (preset.id ?? preset.offset),
                          }
                        )}
                      >
                        {strings.presetLabels[i] || preset.label}
                      </ListItem>
                    );
                  })}
                </OrderedList>
              </div>
            ) : (
              <div className={`${iotPrefix}--date-time-picker__custom-wrapper`}>
                {showRelativeOption ? (
                  <FormGroup
                    legendText={strings.customRangeLabel}
                    className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                  >
                    <RadioButtonGroup
                      valueSelected={customRangeKind}
                      onChange={onCustomRangeChange}
                      name={`${id}-radiogroup`}
                    >
                      <RadioButton
                        value={PICKER_KINDS.RELATIVE}
                        id={`${id}-relative`}
                        labelText={strings.relativeLabel}
                        onKeyDown={handleSpecificKeyDown(
                          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
                          onNavigateRadioButton
                        )}
                      />
                      <RadioButton
                        value={PICKER_KINDS.ABSOLUTE}
                        id={`${id}-absolute`}
                        labelText={strings.absoluteLabel}
                        onKeyDown={handleSpecificKeyDown(
                          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
                          onNavigateRadioButton
                        )}
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
                      <div
                        className={classnames(
                          `${iotPrefix}--date-time-picker__fields-wrapper`,
                          `${iotPrefix}--date-time-picker__fields-wrapper--with-gap`
                        )}
                      >
                        <NumberInput
                          id={`${id}-last-number`}
                          invalidText={strings.invalidNumberLabel}
                          step={1}
                          min={0}
                          light
                          value={relativeValue ? relativeValue.lastNumber : 0}
                          onChange={onRelativeLastNumberChange}
                          translateWithId={(messageId) =>
                            messageId === 'increment.number'
                              ? `${i18n.increment} ${i18n.number}`
                              : messageId === 'decrement.number'
                              ? `${i18n.decrement} ${i18n.number}`
                              : null
                          }
                        />
                        <Select
                          {...others}
                          id={`${id}-last-interval`}
                          light
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
                      <div
                        className={classnames(
                          `${iotPrefix}--date-time-picker__fields-wrapper`,
                          `${iotPrefix}--date-time-picker__fields-wrapper--with-gap`,
                          {
                            [`${iotPrefix}--date-time-picker__fields-wrapper--without-time`]: !hasTimeInput,
                          }
                        )}
                      >
                        <Select
                          {...others}
                          ref={relativeSelect}
                          id={`${id}-relative-to-when`}
                          light
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
                                  strings.relativeLabels.filter((x) => x === relative.label)[0] ||
                                  relative.label
                                }
                              />
                            );
                          })}
                        </Select>
                        {hasTimeInput ? (
                          <TimePickerSpinner
                            key={`${id}-relative-to-time`}
                            id={`${id}-relative-to-time`}
                            invalid={relativeToTimeInvalid}
                            value={relativeValue ? relativeValue.relativeToTime : ''}
                            i18n={i18n}
                            light
                            onChange={onRelativeToTimeChange}
                            spinner
                            autoComplete="off"
                          />
                        ) : null}
                      </div>
                    </FormGroup>
                  </div>
                ) : (
                  <div data-testid={`${testId}-datepicker`}>
                    <div className={`${iotPrefix}--date-time-picker__datepicker`}>
                      <DatePicker
                        datePickerType="range"
                        dateFormat="m/d/Y"
                        ref={handleDatePickerRef}
                        onChange={onDatePickerChange}
                        onClose={onDatePickerClose}
                        value={
                          absoluteValue ? [absoluteValue.startDate, absoluteValue.endDate] : ''
                        }
                        locale={locale}
                      >
                        <DatePickerInput
                          labelText=""
                          id={`${id}-date-picker-input-start`}
                          hideLabel
                        />
                        <DatePickerInput
                          labelText=""
                          id={`${id}-date-picker-input-end`}
                          hideLabel
                        />
                      </DatePicker>
                    </div>
                    {hasTimeInput ? (
                      <FormGroup
                        legendText=""
                        className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                      >
                        <div className={`${iotPrefix}--date-time-picker__fields-wrapper`}>
                          <TimePickerSpinner
                            id={`${id}-start-time`}
                            invalid={absoluteStartTimeInvalid}
                            labelText={strings.startTimeLabel}
                            value={absoluteValue ? absoluteValue.startTime : '00:00'}
                            i18n={i18n}
                            onChange={onAbsoluteStartTimeChange}
                            spinner
                            light
                            autoComplete="off"
                          />
                          <TimePickerSpinner
                            id={`${id}-end-time`}
                            invalid={absoluteEndTimeInvalid}
                            labelText={strings.endTimeLabel}
                            value={absoluteValue ? absoluteValue.endTime : '00:00'}
                            i18n={i18n}
                            onChange={onAbsoluteEndTimeChange}
                            spinner
                            light
                            autoComplete="off"
                          />
                        </div>
                      </FormGroup>
                    ) : (
                      <div className={`${iotPrefix}--date-time-picker__no-formgroup`} />
                    )}
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
                size="field"
                {...others}
                onClick={toggleIsCustomRange}
                /* using on onKeyUp b/c something is preventing onKeyDown from firing with 'Enter' when the calendar is displayed */
                onKeyUp={handleSpecificKeyDown(['Enter', ' '], toggleIsCustomRange)}
              >
                {strings.backBtnLabel}
              </Button>
            ) : (
              <Button
                kind="secondary"
                className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-cancel`}
                size="field"
                {...others}
                onClick={onCancelClick}
                /* using on onKeyUp b/c something is preventing onKeyDown from firing with 'Enter' when the calendar is displayed */
                onKeyUp={handleSpecificKeyDown(['Enter', ' '], onCancelClick)}
              >
                {strings.cancelBtnLabel}
              </Button>
            )}
            <Button
              kind="primary"
              className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-apply`}
              {...others}
              onClick={onApplyClick}
              /* using on onKeyUp b/c something is preventing onKeyDown from firing with 'Enter' when the calendar is displayed */
              onKeyUp={handleSpecificKeyDown(['Enter', ' '], onApplyClick)}
              size="field"
              disabled={disableApply}
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
