import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TextInput } from 'carbon-components-react';
import { Time16, EditOff16, WarningAltFilled16, WarningFilled16 } from '@carbon/icons-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import useMerged from '../../hooks/useMerged';

import ListSpinner from './ListSpinner';

const { iotPrefix, prefix } = settings;

const propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  /** Specify the value for input */
  value: PropTypes.string,
  /** Specify the value for secondary input (range) */
  secondaryValue: PropTypes.string,
  /** Specify wehether you watn the input labels to be visually hidden */
  hideLabel: PropTypes.bool,
  /** Specify wehether you watn the secondary label to be visually hidden */
  hideSecondaryLabel: PropTypes.bool,
  /** Input can be for a single time or a range - defaults to single */
  type: PropTypes.oneOf(['single', 'range']),
  i18n: PropTypes.shape({
    /** Label for input (will be first, if range type) */
    labelText: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    /** Label for second input in range */
    secondaryLabelText: PropTypes.string,
    secondaryHelperText: PropTypes.string,
    invalidText: PropTypes.string,
    warnText: PropTypes.string,
    timeIconText: PropTypes.string,
    placeholderText: PropTypes.string,
  }),
  /** Size of input */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Specify whether the control is currently disabled */
  disabled: PropTypes.bool,
  /** Specify whether the control is currently read only */
  readOnly: PropTypes.bool,
  /** Specify whether the control is currently in warning state */
  warn: PropTypes.arrayOf(PropTypes.bool),
  /** Specify whether the control is currently in invalid state */
  invalid: PropTypes.arrayOf(PropTypes.bool),
  /** Boolean to swap for light theme */
  light: PropTypes.bool,
  /** Optional handler that is called whenever <input> is updated - will be called with new value as an argument */
  onChange: PropTypes.func,
  testId: PropTypes.string,
};

/* istanbul ignore next */
const defaultProps = {
  className: undefined,
  hideLabel: false,
  value: undefined,
  secondaryValue: undefined,
  hideSecondaryLabel: false,
  type: 'single',
  i18n: {
    invalidText: 'The time entered is invalid',
    warnText: undefined,
    timeIconText: 'Open time picker',
    placeholderText: 'hh:mm',
    readOnlyBtnText: 'Read only',
  },
  size: 'md',
  disabled: false,
  readOnly: false,
  warn: [false, false],
  invalid: [false, false],
  light: false,
  onChange: () => {},
  testId: 'time-picker',
};

const validate = (newValue) => {
  const isValid12HoursRegex = /^((0[1-9])?|(1[0-2])?)*:[0-5][0-9] (AM|PM)$/;
  return isValid12HoursRegex.test(newValue) || newValue === '';
};

const TimePicker = ({
  id,
  className,
  type,
  i18n,
  size,
  disabled,
  testId,
  warn,
  invalid,
  light,
  readOnly,
  hideLabel,
  hideSecondaryLabel,
  value,
  secondaryValue,
  onChange,
}) => {
  const init = useRef(false);
  const inputRef = useRef();
  const secondaryInputRef = useRef();
  const dropDownRef = useRef();
  const container = inputRef.current;
  const invalidProp = invalid[0];
  const secondaryInvalidProp = invalid[1];
  const warnProp = warn[0];
  const secondaryWarnProp = warn[1];
  // Component state
  const [openState, setOpenState] = useState(false);
  const [position, setPosition] = useState([0, 0]);
  const [focusedInput, setFocusedInput] = useState(0);
  const [valueState, setValueState] = useState(value || '');
  const [secondaryValueState, setSecondaryValueState] = useState(secondaryValue || '');
  const [invalidState, setInvalidState] = useState(invalidProp);
  const [secondaryInvalidState, setSecondaryInvalidState] = useState(secondaryInvalidProp);

  useEffect(() => {
    if (init.current) {
      onChange(valueState, secondaryValueState);
    } else {
      init.current = true;
    }
  }, [valueState, secondaryValueState, onChange, init]);

  useEffect(() => {
    setInvalidState(invalidProp);
    setSecondaryInvalidState(secondaryInvalidProp);
  }, [invalidProp, secondaryInvalidProp]);

  useEffect(() => {
    if (container) {
      const { left, bottom } = container.getBoundingClientRect();
      setPosition([left, bottom]);
    }
  }, [container, hideLabel]);

  const {
    labelText,
    secondaryLabelText,
    helperText,
    invalidText,
    warnText,
    timeIconText,
    placeholderText,
    readOnlyBtnText,
  } = useMerged(defaultProps.i18n, i18n);

  useEffect(() => {
    if (openState) {
      // eslint-disable-next-line no-unused-expressions
      dropDownRef.current?.focus();
      const { left, bottom, top } = container.getBoundingClientRect();
      const dropdownHeight = 280;
      const dropdownBottom = bottom + dropdownHeight;
      const dropdownPos = top - dropdownHeight;
      if (dropdownBottom > window.innerHeight && dropdownPos > 0) {
        setPosition([left, dropdownPos]);
      } else {
        setPosition([left, bottom]);
      }
    }
  }, [container, openState]);

  const handleFocus = (index) => {
    if (focusedInput === index && openState === true) {
      setOpenState(false);
    } else {
      setOpenState(true);
    }
    setFocusedInput(index);
  };

  const handleOnKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpenState(false);
    }
  };

  const handleOnChange = (e) => {
    let val = e;
    if (typeof e === 'object') {
      val = e.target.value;
    }
    const isValid = /[0-9: APM]/.test(val.substring(val.length - 1));
    // @TODO: detect the length and run validation for as many as we can
    // This value is pasted in or autocompleted
    // istanbul ignore else
    if (val.length > 1) {
      if (focusedInput === 0) {
        setValueState(val);
      } else {
        setSecondaryValueState(val);
      }
    } else if (isValid || val === '') {
      if (focusedInput === 0) {
        setValueState(val);
      } else {
        setSecondaryValueState(val);
      }
    }
  };

  const handleOnBlur = (e) => {
    const contained =
      dropDownRef.current?.contains(e.relatedTarget) ||
      e.currentTarget.contains(e.relatedTarget) ||
      e.relatedTarget?.parentNode?.classList[0].includes('iot--list-spinner') ||
      e.relatedTarget?.parentNode?.classList[0].includes('iot--list-spinner');

    if (!contained) {
      // close dropdown and validate
      setOpenState(false);
      setInvalidState(!validate(inputRef.current.value));
      /* istanbul ignore else */
      if (secondaryInputRef.current) {
        setSecondaryInvalidState(!validate(secondaryInputRef.current.value));
      }
    }
  };

  const inputState = useMemo(() => {
    return {
      state:
        invalidState || (secondaryInvalidState && !readOnly)
          ? 'invalid'
          : warnProp || (secondaryWarnProp && !readOnly)
          ? 'warn'
          : readOnly
          ? 'readOnly'
          : 'default',
      firstIcon:
        invalidState && !readOnly
          ? WarningFilled16
          : warnProp && !readOnly
          ? WarningAltFilled16
          : readOnly
          ? EditOff16
          : Time16,
      secondIcon:
        secondaryInvalidState && !readOnly
          ? WarningFilled16
          : secondaryWarnProp && !readOnly
          ? WarningAltFilled16
          : readOnly
          ? EditOff16
          : Time16,
      text:
        !readOnly && (invalidState || secondaryInvalidState)
          ? invalidText
          : !readOnly && (warnProp || secondaryWarnProp)
          ? warnText
          : helperText,
    };
  }, [
    invalidState,
    secondaryInvalidState,
    warnProp,
    secondaryWarnProp,
    readOnly,
    invalidText,
    warnText,
    helperText,
  ]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={openState ? 0 : -1}
      onBlur={handleOnBlur}
      onKeyDown={handleOnKeyDown}
      data-testid={testId}
      className={classnames(`${iotPrefix}--time-picker`, {
        [className]: className,
        [`${iotPrefix}--time-picker--light`]: light,
        [`${iotPrefix}--time-picker--disabled`]: disabled,
        [`${iotPrefix}--time-picker-range`]: type === 'range',
        [`${iotPrefix}--time-picker--invalid`]: inputState.state === 'invalid',
        [`${iotPrefix}--time-picker--warn`]: inputState.state === 'warn' || warn[0] || warn[1],
      })}
    >
      {type === 'single' ? (
        <>
          <div
            className={classnames(
              `${iotPrefix}--time-picker__wrapper ${iotPrefix}--time-picker__wrapper-${size}`,
              { [`${iotPrefix}--time-picker__wrapper--selected`]: focusedInput === 0 && openState }
            )}
          >
            <TextInput
              onChange={handleOnChange}
              data-testid={`${testId}-input`}
              id={id}
              value={valueState}
              onFocus={() => setFocusedInput(0)}
              readOnly={readOnly}
              hideLabel={hideLabel}
              labelText={labelText}
              placeholder={placeholderText}
              pattern={/[0-9: APM]/}
              size={size}
              warn={warnProp}
              invalid={invalidState}
              light={light}
              disabled={disabled}
              ref={inputRef}
            />
            <button
              data-testid={`${testId}-time-btn`}
              tabIndex="0"
              type="button"
              title={readOnly ? readOnlyBtnText : timeIconText}
              aria-label={timeIconText}
              className={classnames(`${iotPrefix}--time-picker__icon`, {
                [`${iotPrefix}--time-picker__icon--invalid`]: invalidState,
                [`${iotPrefix}--time-picker__icon--warn`]: warnProp,
                [`${iotPrefix}--time-picker__icon--readonl`]: readOnly,
              })}
              onClick={() => (!readOnly ? handleFocus(0) : undefined)}
            >
              <inputState.firstIcon aria-hidden="true" focusable={false} />
            </button>
          </div>
          <p
            data-testid={`${testId}-helpertext`}
            className={classnames(`${prefix}--form__helper-text`, {
              [`${iotPrefix}--time-picker__helper-text`]: invalidState,
              [`${prefix}--form__helper-text--disabled`]: disabled,
            })}
          >
            {!readOnly && invalidState
              ? invalidText
              : !readOnly && warnProp
              ? warnText
              : helperText}
          </p>
        </>
      ) : (
        <fieldset>
          {hideSecondaryLabel && !hideLabel ? (
            <legend
              id={`${id}-label`}
              className={classnames(`${prefix}--label`, {
                [`${prefix}--label--disabled`]: disabled,
              })}
            >
              {labelText}
            </legend>
          ) : null}
          <div
            className={classnames(
              `${iotPrefix}--time-picker__wrapper ${iotPrefix}--time-picker__wrapper-${size}`,
              { [`${iotPrefix}--time-picker__wrapper--selected`]: focusedInput === 0 && openState }
            )}
          >
            <TextInput
              onChange={handleOnChange}
              data-testid={`${testId}-input-1`}
              onFocus={() => setFocusedInput(0)}
              id={`${id}-1`}
              readOnly={readOnly}
              value={valueState}
              hideLabel={hideSecondaryLabel || hideLabel}
              aria-labelledby={hideSecondaryLabel ? `${id}-label` : undefined}
              className={`${iotPrefix}--time-picker-range__text-input-wrapper`}
              labelText={!hideSecondaryLabel ? labelText : ''}
              placeholder={placeholderText}
              size={size}
              warn={warnProp}
              invalid={invalidState}
              light={light}
              disabled={disabled}
              ref={inputRef}
            />
            <button
              data-testid={`${testId}-time-btn-1`}
              tabIndex="0"
              type="button"
              title={readOnly ? readOnlyBtnText : timeIconText}
              aria-label={timeIconText}
              className={classnames(`${iotPrefix}--time-picker__icon`, {
                [`${iotPrefix}--time-picker__icon--invalid`]: invalidState,
                [`${iotPrefix}--time-picker__icon--warn`]: warnProp,
                [`${iotPrefix}--time-picker__icon--readonl`]: readOnly,
              })}
              onClick={() => (!readOnly ? handleFocus(0) : undefined)}
            >
              <inputState.firstIcon aria-hidden="true" focusable={false} />
            </button>
          </div>
          <div
            className={classnames(
              `${iotPrefix}--time-picker__wrapper ${iotPrefix}--time-picker__wrapper-${size}`,
              { [`${iotPrefix}--time-picker__wrapper--selected`]: focusedInput === 1 && openState }
            )}
          >
            <TextInput
              data-testid={`${testId}-input-2`}
              id={`${id}-2`}
              onChange={handleOnChange}
              onFocus={() => setFocusedInput(1)}
              readOnly={readOnly}
              value={secondaryValueState}
              hideLabel={hideSecondaryLabel || hideLabel}
              aria-labelledby={hideSecondaryLabel ? `${id}-label` : undefined}
              className={`${iotPrefix}--time-picker-range__text-input-wrapper`}
              labelText={!hideSecondaryLabel ? secondaryLabelText : ''}
              placeholder={placeholderText}
              size={size}
              warn={secondaryWarnProp}
              invalid={secondaryInvalidState}
              light={light}
              disabled={disabled}
              ref={secondaryInputRef}
            />
            <button
              data-testid={`${testId}-time-btn-2`}
              tabIndex="0"
              type="button"
              title={readOnly ? readOnlyBtnText : timeIconText}
              aria-label={timeIconText}
              className={classnames(`${iotPrefix}--time-picker__icon`, {
                [`${iotPrefix}--time-picker__icon--invalid`]: secondaryInvalidState,
                [`${iotPrefix}--time-picker__icon--warn`]: secondaryWarnProp,
                [`${iotPrefix}--time-picker__icon--readonly`]: readOnly,
              })}
              onClick={() => (!readOnly ? handleFocus(1) : undefined)}
            >
              <inputState.secondIcon aria-hidden="true" focusable={false} />
            </button>
          </div>
          <p
            data-testid={`${testId}-range__helper-text`}
            className={classnames(
              `${prefix}--form__helper-text`,
              `${iotPrefix}--time-picker-range__helper-text`,
              {
                [`${prefix}--form__helper-text--disabled`]: disabled,
              }
            )}
          >
            {inputState.text}
          </p>
        </fieldset>
      )}
      {openState ? (
        <TimePickerSpinner
          onChange={handleOnChange}
          focusedInput={focusedInput}
          value={focusedInput === 0 ? valueState : secondaryValueState}
          testId={`${testId}-spinner`}
          position={position}
          ref={dropDownRef}
        />
      ) : null}
    </div>
  );
};

const listItemsForVertical = Array.from(Array(12)).map((el, i) => {
  const index = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
  return { id: index, value: index };
});

const listItemsForVertical2 = Array.from(Array(60)).map((el, i) => {
  const index = i < 10 ? `0${i}` : `${i}`;
  return { id: index, value: index };
});

const listItemsForVertical3 = [
  { id: 'AM', value: 'AM' },
  { id: 'PM', value: 'PM' },
];

const spinnerPropTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  testId: PropTypes.string,
};

/* istanbul ignore next */
const defaultSpinnerProps = {
  value: '',
  testId: 'time-picker-spinner',
  onChange: () => {},
};

export const TimePickerSpinner = React.forwardRef(({ onChange, position, value, testId }, ref) => {
  const firstVal = useMemo(() => {
    return /(0[1-9])|(1[0-2])/.test(value.substring(0, 2)) ? value.substring(0, 2) : '03';
  }, [value]);
  const secondVal = useMemo(
    () => (/[0-5][0-9]/.test(value.substring(3, 5)) ? value.substring(3, 5) : '02'),
    [value]
  );
  const thirdVal = useMemo(
    () =>
      /AM|PM/.test(value.substring(value.length - 2)) ? value.substring(value.length - 2) : 'AM',
    [value]
  );
  const [selected, setSelected] = useState([firstVal, secondVal, thirdVal]);
  const [callbackValue, setCallbackValue] = useState(value);

  useEffect(() => {
    setSelected([firstVal, secondVal, thirdVal]);
  }, [firstVal, secondVal, thirdVal]);
  useEffect(() => {
    onChange(callbackValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackValue]);

  const handleOnClick = useCallback((str, index) => {
    setSelected((prev) => {
      const arr = [...prev];
      arr[index] = str;
      const newValue = `${arr[0]}:${arr[1]} ${arr[2]}`;
      setCallbackValue(newValue);
      return arr;
    });
  }, []);

  const listSpinner1 = useMemo(
    () => (
      <ListSpinner
        testId={`${testId}-list-spinner-1`}
        ref={ref}
        onClick={(e) => handleOnClick(e, 0)}
        list={listItemsForVertical}
        defaultSelectedId={selected[0]}
      />
    ),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [selected[0]]
  );
  const listSpinner2 = useMemo(
    () => (
      <ListSpinner
        testId={`${testId}-list-spinner-2`}
        onClick={(e) => handleOnClick(e, 1)}
        list={listItemsForVertical2}
        defaultSelectedId={selected[1]}
      />
    ),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [selected[1]]
  );
  const listSpinner3 = useMemo(
    () => {
      return (
        <ListSpinner
          testId={`${testId}-list-spinner-3`}
          className={`${iotPrefix}--time-picker-spinner-last-list-spinner`}
          onClick={(e) => handleOnClick(e, 2)}
          list={listItemsForVertical3}
          defaultSelectedId={selected[2]}
        />
      );
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [selected[2]]
  );

  const dropdown = (
    <div
      data-testid={testId}
      className={`${iotPrefix}--time-picker-spinner`}
      style={{
        left: `${position[0]}px`,
        top: `${position[1]}px`,
      }}
    >
      {listSpinner1}
      {listSpinner2}
      {listSpinner3}
    </div>
  );
  return ReactDOM.createPortal(dropdown, document.body);
});

TimePickerSpinner.propTypes = spinnerPropTypes;
TimePickerSpinner.defaultProps = defaultSpinnerProps;

TimePicker.propTypes = propTypes;
TimePicker.defaultProps = defaultProps;
export default TimePicker;
