import React, { useEffect, useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
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
import { Calendar16, WarningFilled16 } from '@carbon/icons-react';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import warning from 'warning';
import { useLangDirection } from 'use-lang-direction';

import TimePickerSpinner from '../TimePickerSpinner/TimePickerSpinner';
import TimePickerDropdown from '../TimePicker/TimePickerDropdown';
import { settings } from '../../constants/Settings';
import dayjs from '../../utils/dayjs';
import {
  PICKER_KINDS,
  PRESET_VALUES,
  INTERVAL_VALUES,
  RELATIVE_VALUES,
} from '../../constants/DateConstants';
import Button from '../Button/Button';
import FlyoutMenu, { FlyoutMenuDirection } from '../FlyoutMenu/FlyoutMenu';
import { handleSpecificKeyDown } from '../../utils/componentUtilityFunctions';
import { Tooltip } from '../Tooltip';

import {
  getIntervalValue,
  invalidEndDate,
  invalidStartDate,
  onDatePickerClose,
  parseValue,
  useAbsoluteDateTimeValue,
  useDateTimePickerFocus,
  useDateTimePickerKeyboardInteraction,
  useDateTimePickerRangeKind,
  useDateTimePickerRef,
  useDateTimePickerTooltip,
  useRelativeDateTimeValue,
} from './dateTimePickerUtils';

const { iotPrefix, prefix } = settings;

export const DateTimePickerDefaultValuePropTypes = PropTypes.oneOfType([
  PropTypes.exact({
    timeRangeKind: PropTypes.oneOf([PICKER_KINDS.PRESET]).isRequired,
    timeRangeValue: PropTypes.exact({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      /** offset is in minutes */
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
      /** Can be a full parsable DateTime string or a Date object */
      start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      /** Can be a full parsable DateTime string or a Date object */
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      endDate: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  PropTypes.exact({
    timeRangeKind: PropTypes.oneOf([PICKER_KINDS.SINGLE]).isRequired,
    timeSingleValue: PropTypes.exact({
      /** Can be a full parsable DateTime string or a Date object */
      start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      startDate: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
]);

export const propTypes = {
  testId: PropTypes.string,
  /** default value for the picker */
  defaultValue: DateTimePickerDefaultValuePropTypes,
  /** the dayjs.js format for the human readable interval value */
  dateTimeMask: PropTypes.string,
  /** a list of options to for the default presets */
  presets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
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
  /** specify the input in invalid state */
  invalid: PropTypes.bool,
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
    resetBtnLabel: PropTypes.string,
    increment: PropTypes.string,
    decrement: PropTypes.string,
    hours: PropTypes.string,
    minutes: PropTypes.string,
    number: PropTypes.string,
    timePickerInvalidText: PropTypes.string,
    invalidText: PropTypes.string,
  }),
  /** Light version  */
  light: PropTypes.bool,
  /** The language locale used to format the days of the week, months, and numbers. */
  locale: PropTypes.string,
  /** Unique id of the component */
  id: PropTypes.string,
  /** Optionally renders only an icon rather than displaying the current selected time */
  hasIconOnly: PropTypes.bool,
  /** Allow repositioning the flyout menu */
  menuOffset: PropTypes.shape({ left: PropTypes.number, top: PropTypes.number }),
  /** Date picker types are single and range, default is range */
  datePickerType: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string),
};

export const defaultProps = {
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
  invalid: false,
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
    presetLabels: [],
    intervalLabels: [],
    relativeLabels: [],
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
    resetBtnLabel: 'Clear',
    increment: 'Increment',
    decrement: 'Decrement',
    hours: 'hours',
    minutes: 'minutes',
    number: 'number',
    timePickerInvalidText: undefined,
    invalidText: 'The date time entered is invalid',
  },
  light: false,
  locale: 'en',
  id: undefined,
  hasIconOnly: false,
  menuOffset: undefined,
  datePickerType: 'range',
  style: {},
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
  invalid,
  showRelativeOption,
  showCustomRangeLink,
  hasTimeInput,
  renderPresetTooltipText,
  onCancel,
  onApply,
  i18n,
  light,
  locale,
  id = uuidv4(),
  hasIconOnly,
  menuOffset,
  datePickerType,
  style,
  ...others
}) => {
  React.useEffect(() => {
    if (__DEV__) {
      warning(
        false,
        'The `DateTimePickerV2` is an experimental component and could be lacking unit test and documentation. Be aware that minor version bumps could introduce breaking changes. For the reasons listed above use of this component in production is highly discouraged'
      );
    }
  }, []);

  const langDir = useLangDirection();
  const strings = useMemo(
    () => ({
      ...defaultProps.i18n,
      ...i18n,
    }),
    [i18n]
  );
  const isSingleSelect = useMemo(() => datePickerType === 'single', [datePickerType]);

  // initialize the dayjs locale
  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  // State
  const [customRangeKind, setCustomRangeKind, onCustomRangeChange] = useDateTimePickerRangeKind(
    showRelativeOption
  );
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [currentValue, setCurrentValue] = useState(null);
  const [lastAppliedValue, setLastAppliedValue] = useState(null);
  const [humanValue, setHumanValue] = useState(null);
  const [defaultSingleDateValue, SetDefaultSingleDateValue] = useState(false);
  const [invalidState, setInvalidState] = useState(invalid);
  const [datePickerElem, handleDatePickerRef] = useDateTimePickerRef({ id, v2: true });
  const [focusOnFirstField, setFocusOnFirstField] = useDateTimePickerFocus(datePickerElem);
  const relativeSelect = useRef(null);
  const {
    absoluteValue,
    setAbsoluteValue,
    resetAbsoluteValue,
    format12hourTo24hour,
    isValid12HourTime,
  } = useAbsoluteDateTimeValue();

  const {
    relativeValue,
    setRelativeValue,
    relativeToTimeInvalid,
    resetRelativeValue,
    relativeLastNumberInvalid,
    onRelativeLastNumberChange,
    onRelativeLastIntervalChange,
    onRelativeToWhenChange,
    onRelativeToTimeChange,
  } = useRelativeDateTimeValue({
    defaultInterval: intervals[0].value,
    defaultRelativeTo: relatives[0].value,
  });

  const {
    isExpanded,
    setIsExpanded,
    presetListRef,
    onFieldInteraction,
    onNavigateRadioButton,
    onNavigatePresets,
  } = useDateTimePickerKeyboardInteraction({ expanded, setCustomRangeKind });
  const [isTooltipOpen, toggleTooltip] = useDateTimePickerTooltip({ isExpanded });

  const [singleDateValue, setSingleDateValue] = useState(null);
  const [singleTimeValue, setSingleTimeValue] = useState(null);
  const [rangeStartTimeValue, setRangeStartTimeValue] = useState('');
  const [rangeEndTimeValue, setRangeEndTimeValue] = useState('');
  const [invalidRangeStartTime, setInvalidRangeStartTime] = useState(false);
  const [invalidRangeEndTime, setInvalidRangeEndTime] = useState(false);

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
    single: {
      startDate: null,
      startTime: null,
    },
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
      } else if (customRangeKind === PICKER_KINDS.ABSOLUTE) {
        value.absolute = {
          ...absoluteValue,
          startTime: hasTimeInput ? format12hourTo24hour(rangeStartTimeValue) : '00:00',
          endTime: hasTimeInput ? format12hourTo24hour(rangeEndTimeValue) : '00:00',
        };
      } else {
        value.single = {
          ...singleDateValue,
          startTime:
            hasTimeInput && singleTimeValue !== '' ? format12hourTo24hour(singleTimeValue) : null,
        };
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
      if (
        absoluteValue ||
        relativeValue ||
        singleDateValue ||
        singleTimeValue ||
        rangeStartTimeValue ||
        rangeEndTimeValue
      ) {
        renderValue();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      absoluteValue,
      relativeValue,
      singleDateValue,
      singleTimeValue,
      rangeStartTimeValue,
      rangeEndTimeValue,
    ]
  );

  const onDatePickerChange = ([start, end], _, flatpickr) => {
    const calendarInFocus = document?.activeElement?.closest(
      `.${iotPrefix}--date-time-picker__datepicker`
    );

    const daysDidntChange =
      start &&
      end &&
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
      // again, but the dates reset to where both start and end are the same. This fixes that.
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
        flatpickr.jumpToDate(newAbsolute.start, true);
      } else {
        flatpickr.jumpToDate(newAbsolute.end, true);
      }
    } else {
      setFocusOnFirstField(false);
      flatpickr.jumpToDate(newAbsolute.start, true);
    }

    setAbsoluteValue(newAbsolute);
    setInvalidRangeStartTime(
      invalidStartDate(newAbsolute.startTime, newAbsolute.endTime, newAbsolute)
    );
    setInvalidRangeEndTime(
      invalidStartDate(newAbsolute.startTime, newAbsolute.endTime, newAbsolute)
    );
  };

  const onSingleDatePickerChange = (start) => {
    const newSingleDate = { ...singleDateValue };
    newSingleDate.start = start;
    newSingleDate.startDate = dayjs(newSingleDate.start).format('MM/DD/YYYY');

    setSingleDateValue(newSingleDate);
  };

  const onPresetClick = (preset) => {
    setSelectedPreset(preset.id ?? preset.offset);
    renderValue(preset);
  };

  const parseDefaultValue = (parsableValue) => {
    const currentCustomRangeKind = showRelativeOption
      ? PICKER_KINDS.RELATIVE
      : datePickerType === 'range'
      ? PICKER_KINDS.ABSOLUTE
      : PICKER_KINDS.SINGLE;
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
        // range
        const absolute = { ...parsableValue.timeRangeValue };
        resetRelativeValue();
        setIsCustomRange(true);
        setCustomRangeKind(PICKER_KINDS.ABSOLUTE);
        if (!absolute.hasOwnProperty('start')) {
          absolute.start = dayjs(`${absolute.startDate} ${absolute.startTime}`).valueOf();
        }
        if (!absolute.hasOwnProperty('end')) {
          absolute.end = dayjs(`${absolute.endDate} ${absolute.endTime}`).valueOf();
        }
        absolute.startDate = dayjs(absolute.start).format('MM/DD/YYYY');
        absolute.startTime = dayjs(absolute.start).format('hh:mm A');
        absolute.endDate = dayjs(absolute.end).format('MM/DD/YYYY');
        absolute.endTime = dayjs(absolute.end).format('hh:mm A');
        setAbsoluteValue(absolute);
        setRangeStartTimeValue(absolute.startTime);
        setRangeEndTimeValue(absolute.endTime);
      }

      if (parsableValue.timeRangeKind === PICKER_KINDS.SINGLE) {
        // single
        const single = { ...parsableValue.timeSingleValue };
        resetRelativeValue();
        setIsCustomRange(true);
        setCustomRangeKind(PICKER_KINDS.SINGLE);
        if (!single.hasOwnProperty('start') && single.startDate && single.startTime) {
          single.start = dayjs(`${single.startDate} ${single.startTime}`).valueOf();
        }
        single.startDate = single.start ? dayjs(single.start).format('MM/DD/YYYY') : null;
        single.startTime = single.start ? dayjs(single.start).format('hh:mm A') : null;
        setSingleDateValue(single);
        setSingleTimeValue(single.startTime ?? '');
      }
    } else {
      resetAbsoluteValue();
      resetRelativeValue();
      setCustomRangeKind(currentCustomRangeKind);
      onPresetClick(presets[0]);
    }
  };

  const toggleIsCustomRange = (event) => {
    // stop the event from bubbling
    event.stopPropagation();
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

  const tooltipValue = renderPresetTooltipText
    ? renderPresetTooltipText(currentValue)
    : datePickerType === 'range'
    ? getIntervalValue({ currentValue, strings, dateTimeMask, humanValue })
    : isSingleSelect
    ? humanValue
    : dateTimeMask;

  const disableRelativeApply =
    isCustomRange &&
    customRangeKind === PICKER_KINDS.RELATIVE &&
    (relativeLastNumberInvalid || relativeToTimeInvalid);

  const disableAbsoluteApply =
    isCustomRange &&
    customRangeKind === PICKER_KINDS.ABSOLUTE &&
    (invalidRangeStartTime || invalidRangeEndTime);

  const disableSingleApply =
    isCustomRange && customRangeKind === PICKER_KINDS.SINGLE && invalidRangeStartTime;

  const disableApply = disableRelativeApply || disableAbsoluteApply || disableSingleApply;

  useEffect(() => setInvalidState(invalid || disableApply), [invalid, disableApply]);

  const onApplyClick = () => {
    setIsExpanded(false);
    const value = renderValue();
    setLastAppliedValue(value);
    const returnValue = {
      timeRangeKind: value.kind,
      timeRangeValue: null,
      timeSingleValue: null,
    };
    switch (value.kind) {
      case PICKER_KINDS.ABSOLUTE:
        returnValue.timeRangeValue = {
          ...value.absolute,
          humanValue,
          tooltipValue,
        };
        break;
      case PICKER_KINDS.SINGLE:
        returnValue.timeSingleValue = {
          ...value.single,
          humanValue,
          tooltipValue,
        };
        break;
      case PICKER_KINDS.RELATIVE:
        returnValue.timeRangeValue = {
          ...value.relative,
          humanValue,
          tooltipValue,
        };
        break;
      default:
        returnValue.timeRangeValue = {
          ...value.preset,
          tooltipValue,
        };
        break;
    }

    if (onApply) {
      onApply(returnValue);
    }
  };

  const onCancelClick = () => {
    parseDefaultValue(lastAppliedValue);
    setIsExpanded(false);

    /* istanbul ignore else */
    if (onCancel) {
      onCancel();
    }
  };

  const onClearClick = () => {
    setSingleDateValue({ start: null, startDate: null });
    setSingleTimeValue('');
    SetDefaultSingleDateValue(true);
    setIsExpanded(false);
  };

  // eslint-disable-next-line react/prop-types
  const CustomFooter = () => {
    return (
      <div className={`${iotPrefix}--date-time-picker__menu-btn-set`}>
        {isCustomRange && !isSingleSelect ? (
          <Button
            kind="secondary"
            className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-back`}
            size="field"
            {...others}
            onClick={toggleIsCustomRange}
            onKeyUp={handleSpecificKeyDown(['Enter', ' '], toggleIsCustomRange)}
          >
            {strings.backBtnLabel}
          </Button>
        ) : isSingleSelect ? (
          <Button
            kind="secondary"
            className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-reset`}
            size="field"
            {...others}
            onClick={onClearClick}
            onMouseDown={(e) => e.preventDefault()}
            onKeyUp={handleSpecificKeyDown(['Enter', ' '], onClearClick)}
          >
            {strings.resetBtnLabel}
          </Button>
        ) : (
          <Button
            kind="secondary"
            className={`${iotPrefix}--date-time-picker__menu-btn ${iotPrefix}--date-time-picker__menu-btn-cancel`}
            onClick={onCancelClick}
            size="field"
            {...others}
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
          onKeyUp={handleSpecificKeyDown(['Enter', ' '], onApplyClick)}
          onMouseDown={(e) => e.preventDefault()}
          size="field"
          disabled={disableApply}
        >
          {strings.applyBtnLabel}
        </Button>
      </div>
    );
  };

  const menuOffsetLeft = menuOffset?.left
    ? menuOffset.left
    : langDir === 'ltr'
    ? 0
    : hasIconOnly
    ? -15
    : 274;
  const menuOffsetTop = menuOffset?.top ? menuOffset.top : 0;

  const handleRangeTimeValueChange = (startState, endState) => {
    setRangeStartTimeValue(startState);
    setRangeEndTimeValue(endState);
    setInvalidRangeStartTime(
      (absoluteValue && invalidStartDate(startState, endState, absoluteValue)) ||
        !isValid12HourTime(startState)
    );
    setInvalidRangeEndTime(
      (absoluteValue && invalidEndDate(startState, endState, absoluteValue)) ||
        !isValid12HourTime(endState)
    );
  };

  const handleSingleTimeValueChange = (startState) => {
    setSingleTimeValue(startState);
    setInvalidRangeStartTime(!isValid12HourTime(startState));
  };

  return (
    <>
      <div
        data-testid={testId}
        id={`${id}-${iotPrefix}--date-time-pickerv2__wrapper`}
        className={`${iotPrefix}--date-time-pickerv2__wrapper`}
        style={{ '--wrapper-width': hasIconOnly ? '3rem' : '20rem' }}
        role="button"
        onClick={onFieldInteraction}
        onKeyDown={handleSpecificKeyDown(['Enter', ' ', 'Escape', 'ArrowDown'], (event) => {
          // the onApplyClick event gets blocked when called via the keyboard from the flyout menu's
          // custom footer. This is a catch to ensure the onApplyCLick is called correctly for preset
          // ranges via the keyboard.
          if (
            (event.key === 'Enter' || event.key === ' ') &&
            event.target.classList.contains(`${iotPrefix}--date-time-picker__menu-btn-apply`) &&
            !isCustomRange
          ) {
            onApplyClick();
          }

          onFieldInteraction(event);
        })}
        onFocus={toggleTooltip}
        onBlur={toggleTooltip}
        onMouseEnter={toggleTooltip}
        onMouseLeave={toggleTooltip}
        tabIndex={0}
      >
        <div
          className={classnames({
            [`${iotPrefix}--date-time-picker__box--full`]: !hasIconOnly,
            [`${iotPrefix}--date-time-picker__box--light`]: light,
            [`${iotPrefix}--date-time-picker__box--invalid`]: invalidState,
          })}
        >
          {!hasIconOnly ? (
            <div
              data-testid={`${testId}__field`}
              className={`${iotPrefix}--date-time-picker__field`}
            >
              {isExpanded || (currentValue && currentValue.kind !== PICKER_KINDS.PRESET) ? (
                <span
                  className={classnames({
                    [`${iotPrefix}--date-time-picker__disabled`]:
                      isSingleSelect && !singleDateValue.startDate,
                  })}
                  title={humanValue}
                >
                  {humanValue}
                </span>
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
              {!isExpanded && isTooltipOpen ? (
                <Tooltip
                  open={isTooltipOpen}
                  showIcon={false}
                  focusTrap={false}
                  menuOffset={{ top: 16, left: 16 }}
                  triggerClassName={`${iotPrefix}--date-time-picker__tooltip-trigger`}
                  className={`${iotPrefix}--date-time-picker__tooltip`}
                >
                  {tooltipValue}
                </Tooltip>
              ) : null}
            </div>
          ) : null}

          <FlyoutMenu
            isOpen={isExpanded}
            buttonSize={hasIconOnly ? 'default' : 'small'}
            renderIcon={invalidState ? WarningFilled16 : Calendar16}
            disabled={false}
            buttonProps={{
              tooltipPosition: 'top',
              tabIndex: -1,
              className: invalidState
                ? `${iotPrefix}--date-time-picker--trigger-button-invalid`
                : '',
            }}
            hideTooltip
            iconDescription={strings.calendarLabel}
            passive={false}
            triggerId="test-trigger-id-2"
            light={light}
            menuOffset={{
              top: menuOffsetTop,
              left: menuOffsetLeft,
            }}
            testId={`${testId}-datepicker-flyout`}
            direction={FlyoutMenuDirection.BottomEnd}
            customFooter={CustomFooter}
            tooltipFocusTrap={false}
            renderInPortal
            tooltipClassName={classnames(`${iotPrefix}--date-time-picker--tooltip`, {
              [`${iotPrefix}--date-time-picker--tooltip--icon`]: hasIconOnly,
            })}
            tooltipContentClassName={`${iotPrefix}--date-time-picker--menu`}
            style={style}
          >
            <div
              className={`${iotPrefix}--date-time-picker__menu-scroll`}
              style={{ '--wrapper-width': '20rem' }}
              role="listbox"
              onClick={(event) => event.stopPropagation()} // need to stop the event so that it will not close the menu
              onKeyDown={(event) => event.stopPropagation()} // need to stop the event so that it will not close the menu
              tabIndex="-1"
            >
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
                        className={`${iotPrefix}--date-time-picker__listitem ${iotPrefix}--date-time-picker__listitem--preset ${iotPrefix}--date-time-picker__listitem--custom`}
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
                          className={classnames(
                            `${iotPrefix}--date-time-picker__listitem ${iotPrefix}--date-time-picker__listitem--preset`,
                            {
                              [`${iotPrefix}--date-time-picker__listitem--preset-selected`]:
                                selectedPreset === (preset.id ?? preset.offset),
                            }
                          )}
                          tabIndex={0}
                        >
                          {strings.presetLabels[i] || preset.label}
                        </ListItem>
                      );
                    })}
                  </OrderedList>
                </div>
              ) : (
                <div
                  className={`${iotPrefix}--date-time-picker__custom-wrapper`}
                  style={{ '--wrapper-width': '20rem' }}
                >
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
                    <>
                      <FormGroup
                        legendText={strings.lastLabel}
                        className={`${iotPrefix}--date-time-picker__menu-formgroup`}
                      >
                        <div className={`${iotPrefix}--date-time-picker__fields-wrapper`}>
                          <NumberInput
                            id={`${id}-last-number`}
                            invalidText={strings.invalidNumberLabel}
                            step={1}
                            min={0}
                            value={relativeValue ? relativeValue.lastNumber : 0}
                            onChange={onRelativeLastNumberChange}
                            translateWithId={(messageId) =>
                              messageId === 'increment.number'
                                ? `${i18n.increment} ${i18n.number}`
                                : messageId === 'decrement.number'
                                ? `${i18n.decrement} ${i18n.number}`
                                : null
                            }
                            light
                          />
                          <Select
                            {...others}
                            id={`${id}-last-interval`}
                            defaultValue={
                              relativeValue ? relativeValue.lastInterval : INTERVAL_VALUES.MINUTES
                            }
                            onChange={onRelativeLastIntervalChange}
                            hideLabel
                            light
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
                            id={`${id}-relative-to-when`}
                            defaultValue={relativeValue ? relativeValue.relativeToWhen : ''}
                            onChange={onRelativeToWhenChange}
                            hideLabel
                            light
                          >
                            {relatives.map((relative, i) => {
                              return (
                                <SelectItem
                                  key={i}
                                  value={relative.value}
                                  text={strings.relativeLabels[i] || relative.label}
                                />
                              );
                            })}
                          </Select>
                          {hasTimeInput ? (
                            <TimePickerSpinner
                              id={`${id}-relative-to-time`}
                              invalid={relativeToTimeInvalid}
                              value={relativeValue ? relativeValue.relativeToTime : ''}
                              i18n={i18n}
                              onChange={onRelativeToTimeChange}
                              spinner
                              autoComplete="off"
                              light
                            />
                          ) : null}
                        </div>
                      </FormGroup>
                    </>
                  ) : (
                    <div data-testid={`${testId}-datepicker`}>
                      <div
                        id={`${id}-${iotPrefix}--date-time-picker__datepicker`}
                        className={`${iotPrefix}--date-time-picker__datepicker`}
                      >
                        <DatePicker
                          datePickerType={datePickerType}
                          dateFormat="m/d/Y"
                          ref={handleDatePickerRef}
                          onChange={
                            datePickerType === 'single'
                              ? onSingleDatePickerChange
                              : onDatePickerChange
                          }
                          onClose={onDatePickerClose}
                          value={
                            absoluteValue && datePickerType === 'range'
                              ? [absoluteValue.startDate, absoluteValue.endDate]
                              : singleDateValue && datePickerType === 'single'
                              ? [singleDateValue.startDate]
                              : null
                          }
                          locale={locale}
                        >
                          <DatePickerInput
                            labelText=""
                            id={`${id}-date-picker-input-start`}
                            hideLabel
                          />

                          {datePickerType === 'range' ? (
                            <DatePickerInput
                              labelText=""
                              id={`${id}-date-picker-input-end`}
                              hideLabel
                            />
                          ) : null}
                        </DatePicker>
                      </div>
                      {hasTimeInput ? (
                        <TimePickerDropdown
                          className={`${iotPrefix}--time-picker-dropdown`}
                          id={id}
                          key={defaultSingleDateValue}
                          value={isSingleSelect ? singleTimeValue : rangeStartTimeValue}
                          secondaryValue={rangeEndTimeValue}
                          hideLabel={!strings.startTimeLabel}
                          hideSecondaryLabel={!strings.endTimeLabel}
                          onChange={(startState, endState) =>
                            isSingleSelect
                              ? handleSingleTimeValueChange(startState)
                              : handleRangeTimeValueChange(startState, endState)
                          }
                          type={isSingleSelect ? 'single' : 'range'}
                          invalid={[invalidRangeStartTime, invalidRangeEndTime]}
                          i18n={{
                            labelText: strings.startTimeLabel,
                            secondaryLabelText: strings.endTimeLabel,
                            invalidText: strings.timePickerInvalidText,
                          }}
                          size="sm"
                          testId={testId}
                          style={{ zIndex: (style.zIndex ?? 0) + 6000 }}
                        />
                      ) : (
                        <div className={`${iotPrefix}--date-time-picker__no-formgroup`} />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </FlyoutMenu>
        </div>
        {invalidState && !hasIconOnly ? (
          <p
            className={classnames(
              `${prefix}--form__helper-text`,
              `${iotPrefix}--date-time-picker__helper-text--invalid`
            )}
          >
            {strings.invalidText}
          </p>
        ) : null}
      </div>
    </>
  );
};

DateTimePicker.propTypes = propTypes;
DateTimePicker.defaultProps = defaultProps;

export default DateTimePicker;
