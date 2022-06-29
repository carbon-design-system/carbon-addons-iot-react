import React, { useMemo, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TextInput, Menu } from 'carbon-components-react';
import {
  ChevronUp16,
  ChevronDown16,
  Time16,
  EditOff16,
  WarningAltFilled16,
  WarningFilled16,
} from '@carbon/icons-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import useMerged from '../../hooks/useMerged';
import Button from '../Button';

const { iotPrefix, prefix } = settings;

const propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  /** Optional default value for input */
  defaultValue: PropTypes.oneOfType([
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  /** Specify the value for input */
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
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
  /** Optional handler that is called whenever <input> is updated */
  onChange: PropTypes.func,
  /** Optional handler that is called whenever <input> is clicked */
  onClick: PropTypes.func,
  testId: PropTypes.string,
};

const defaultProps = {
  className: undefined,
  hideLabel: false,
  defaultValue: undefined,
  value: undefined,
  hideSecondaryLabel: false,
  type: 'single',
  i18n: {
    invalidText: 'The time entered is invalid',
    warnText: undefined,
    timeIconText: 'Open time picker',
    placeholderText: 'hh:mm',
  },
  size: 'md',
  disabled: false,
  readOnly: false,
  warn: [false, false],
  invalid: [false, false],
  onChange: () => {},
  onClick: () => {},
  testId: 'timer-picker',
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
  defaultValue,
}) => {
  const inputRef = useRef();
  const dropDownRef = useRef();
  const [openState, setOpenState] = useState(false);
  const [position, setPosition] = useState([0, 0]);
  const container = inputRef.current;

  useEffect(() => {
    console.log('I be running');
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
  } = useMerged(defaultProps.i18n, i18n);

  const handleFocus = () => {
    setOpenState((prev) => !prev);
    setTimeout(() => dropDownRef.current?.focus(), 0);
  };

  const inputState = useMemo(() => {
    console.log('how many times am I rendering');
    return {
      state:
        invalid[0] || (invalid[1] && !readOnly)
          ? 'invalid'
          : warn[0] || (warn[1] && !readOnly)
          ? 'warn'
          : readOnly
          ? 'readOnly'
          : 'default',
      firstIcon:
        invalid[0] && !readOnly
          ? WarningFilled16
          : warn[0] && !readOnly
          ? WarningAltFilled16
          : readOnly
          ? EditOff16
          : Time16,
      secondIcon:
        invalid[1] && !readOnly
          ? WarningFilled16
          : warn[1] && !readOnly
          ? WarningAltFilled16
          : readOnly
          ? EditOff16
          : Time16,
      text:
        !readOnly && (invalid[0] || invalid[1])
          ? invalidText
          : !readOnly && (warn[0] || warn[1])
          ? warnText
          : helperText,
      callback: !readOnly ? handleFocus : undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalid[0], invalid[1], warn[0], warn[1], readOnly, invalidText, warnText, helperText]);

  return (
    <div
      className={classnames(`${iotPrefix}--time-picker`, {
        [className]: className,
        [`${iotPrefix}--time-picker--light`]: light,
        [`${iotPrefix}--time-picker--disabled`]: disabled,
        [`${iotPrefix}--time-picker-range`]: type === 'range',
        [`${iotPrefix}--time-picker--invalid`]: inputState.state === 'invalid',
        [`${iotPrefix}--time-picker--warn`]: inputState.state === 'warn',
      })}
      ref={inputRef}
    >
      {type === 'single' ? (
        <>
          <div
            className={`${iotPrefix}--time-picker__wrapper ${iotPrefix}--time-picker__wrapper-${size}`}
          >
            <TextInput
              defaultValue={defaultValue[0]}
              readOnly={readOnly}
              hideLabel={hideLabel}
              labelText={labelText}
              placeholder={placeholderText}
              size={size}
              warn={warn[0]}
              invalid={invalid[0]}
              light={light}
              disabled={disabled}
            />
            <button
              tabIndex="0"
              type="button"
              className={classnames(`${iotPrefix}--time-picker__icon`, {
                [`${iotPrefix}--time-picker__icon--invalid`]: invalid[0],
                [`${iotPrefix}--time-picker__icon--warn`]: warn[0],
              })}
              onClick={inputState.callback}
            >
              <inputState.firstIcon
                ariaHidden="true"
                focusable={false}
                // className={classnames(`${iotPrefix}--time-picker__icon`, {
                //   [`${iotPrefix}--time-picker__icon--invalid`]: inputState.state === 'invalid',
                //   [`${iotPrefix}--time-picker__icon--warn`]: inputState.state === 'warn',
                // })}
              />
            </button>
          </div>
          <p
            className={classnames(`${prefix}--form__helper-text`, {
              [`${iotPrefix}--time-picker__helper-text`]: invalid[0],
              [`${prefix}--form__helper-text--disabled`]: disabled,
            })}
          >
            {!readOnly && invalid[0] ? invalidText : !readOnly && warn[0] ? warnText : helperText}
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
            className={`${iotPrefix}--time-picker__wrapper ${iotPrefix}--time-picker__wrapper-${size}`}
          >
            <TextInput
              id={`${id}-1`}
              readOnly={readOnly}
              defaultValue={defaultValue[0]}
              hideLabel={hideSecondaryLabel || hideLabel}
              aria-labelledby={hideSecondaryLabel ? `${id}-label` : undefined}
              className={`${iotPrefix}--time-picker-range__text-input-wrapper`}
              labelText={!hideSecondaryLabel ? labelText : ''}
              placeholder={placeholderText}
              size={size}
              warn={warn[0]}
              invalid={invalid[0]}
              light={light}
              disabled={disabled}
              // {...other}
            />
            <button
              tabIndex="0"
              type="button"
              className={classnames(`${iotPrefix}--time-picker__icon`, {
                [`${iotPrefix}--time-picker__icon--invalid`]: invalid[0],
                [`${iotPrefix}--time-picker__icon--warn`]: warn[0],
              })}
              onClick={inputState.callback}
            >
              <inputState.firstIcon
                aria-hidden="true"
                focusable={false}
                // className={classnames(`${iotPrefix}--time-picker__icon`, {
                //   [`${iotPrefix}--time-picker__icon--invalid`]: invalid[0],
                //   [`${iotPrefix}--time-picker__icon--warn`]: warn[0],
                // })}
                // onClick={() => console.log('click')}
              />
            </button>
          </div>
          <div
            className={`${iotPrefix}--time-picker__wrapper ${iotPrefix}--time-picker__wrapper-${size}`}
          >
            <TextInput
              id={`${id}-2`}
              readOnly={readOnly}
              defaultValue={defaultValue[1]}
              hideLabel={hideSecondaryLabel || hideLabel}
              aria-labelledby={hideSecondaryLabel ? `${id}-label` : undefined}
              className={`${iotPrefix}--time-picker-range__text-input-wrapper`}
              labelText={!hideSecondaryLabel ? secondaryLabelText : ''}
              placeholder={placeholderText}
              size={size}
              warn={warn[1]}
              invalid={invalid[1]}
              light={light}
              disabled={disabled}
              // {...other}
            />
            <button
              tabIndex="0"
              type="button"
              className={classnames(`${iotPrefix}--time-picker__icon`, {
                [`${iotPrefix}--time-picker__icon--invalid`]: invalid[1],
                [`${iotPrefix}--time-picker__icon--warn`]: warn[1],
              })}
              onClick={inputState.callback}
            >
              <inputState.secondIcon
                aria-hidden="true"
                focusable={false}
                // className={classnames(`${iotPrefix}--time-picker__icon`, {
                //   [`${iotPrefix}--time-picker__icon--invalid`]: invalid[1],
                //   [`${iotPrefix}--time-picker__icon--warn`]: warn[1],
                // })}
              />
            </button>
          </div>
          <p
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
      {openState ? <TimePickerSpinner position={position} ref={dropDownRef} /> : null}
    </div>
  );
};

export const TimePickerSpinner = React.forwardRef(({ position }, ref) => {
  const [selected, setSelected] = useState(['03', '03', 'AM']);
  const observer = React.useRef();

  const handleClick = (e, item, index) => {
    e.target.parentNode.parentNode.scrollTo({
      top: e.target.offsetTop - 80,
      left: 0,
      behavior: 'smooth',
    });
    setSelected((prev) => {
      /* eslint-disable-next-line no-param-reassign */
      prev[index] = item;
      return [...prev];
    });
  };

  const dropdown = (
    <div
      className={`${iotPrefix}--time-picker-spinner`}
      style={{
        left: `${position[0]}px`,
        top: `${position[1]}px`,
      }}
    >
      <button type="button" ref={ref}>
        This is the dropdown
      </button>
    </div>
  );
  return ReactDOM.createPortal(dropdown, document.body);
});

TimePicker.propTypes = propTypes;
TimePicker.defaultProps = defaultProps;
export default TimePicker;
