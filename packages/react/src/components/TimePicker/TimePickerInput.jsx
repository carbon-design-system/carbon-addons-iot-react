import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'carbon-components-react';
import { ChevronUp16, ChevronDown16 } from '@carbon/icons-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import useMerged from '../../hooks/useMerged';
import Button from '../Button';

const { iotPrefix, prefix } = settings;

const propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  /** Specify wehether you want the input labels to be visually hidden */
  hideLabel: PropTypes.bool,
  /** Optional default value for input */
  defaultValue: PropTypes.oneOfType([
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  /** Specify the value for input */
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
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
    warnTextr: PropTypes.string,
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

const TimePickerInput = ({
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
  hideLabel,
  hideSecondaryLabel,
}) => {
  const {
    labelText,
    secondaryLabelText,
    helperText,
    errorMessage,
    warningMessage,
    timeIconText,
    placeholderText,
  } = useMerged(defaultProps.i18n, i18n);

  return (
    <>
      {type === 'single' ? (
        <TextInput
          hideLabel={hideLabel}
          labelText={labelText}
          placeholder={placeholderText}
          size={size}
          warn={warn[0]}
          invalid={invalid[0]}
          light={light}
          disabled={disabled}
          helperText={helperText}
          // {...other}
        />
      ) : hideSecondaryLabel && !hideLabel ? (
        <fieldset>
          <legend
            id={`${id}-label`}
            className={classnames(`${prefix}--label`, { [`${prefix}--label--disabled`]: disabled })}
          >
            {labelText}
          </legend>
          <TextInput
            id={`${id}-1`}
            hideLabel={hideSecondaryLabel || hideLabel}
            ariaLabledBy={hideSecondaryLabel ? `${id}-1` : undefined}
            className={`${iotPrefix}--time-picker-range__text-input-wrapper`}
            labelText={!hideSecondaryLabel ? labelText : ''}
            placeholder={placeholderText}
            warnText="this is cool"
            size={size}
            warn={warn[0]}
            invalid={invalid[0]}
            light={light}
            disabled={disabled}
            // {...other}
          />
          <TextInput
            id={`${id}-2`}
            hideLabel={hideSecondaryLabel || hideLabel}
            ariaLabledBy={hideSecondaryLabel ? `${id}-1` : undefined}
            className={`${iotPrefix}--time-picker-range__text-input-wrapper`}
            labelText={secondaryLabelText}
            placeholder={placeholderText}
            size={size}
            warn={warn[1]}
            invalid={invalid[1]}
            light={light}
            disabled={disabled}
            // {...other}
          />
          <p
            className={classnames(
              `${prefix}--form__helper-text`,
              `${iotPrefix}--time-picker-range__helper-text`,
              {
                [`${prefix}--form__helper-text--disabled`]: disabled,
              }
            )}
          >
            {helperText}
          </p>
        </fieldset>
      ) : (
        <>
          <TextInput
            id={`${id}-1`}
            ariaLabledBy={hideSecondaryLabel ? `${id}-label` : undefined}
            hideLabel={hideLabel}
            className={`${iotPrefix}--time-picker-range__text-input-wrapper`}
            labelText={!hideSecondaryLabel ? labelText : ''}
            placeholder={placeholderText}
            warnText="this is cool"
            size={size}
            warn={warn[0]}
            invalid={invalid[0]}
            light={light}
            disabled={disabled}
            // {...other}
          />
          <TextInput
            id={`${id}-2`}
            ariaLabledBy={hideSecondaryLabel ? `${id}-label` : undefined}
            hideLabel={hideSecondaryLabel || hideLabel}
            className={`${iotPrefix}--time-picker-range__text-input-wrapper`}
            labelText={secondaryLabelText}
            placeholder={placeholderText}
            size={size}
            warn={warn[1]}
            invalid={invalid[1]}
            light={light}
            disabled={disabled}
            // {...other}
          />
          <p
            className={classnames(
              `${prefix}--form__helper-text`,
              `${iotPrefix}--time-picker-range__helper-text`,
              {
                [`${prefix}--form__helper-text--disabled`]: disabled,
              }
            )}
          >
            {helperText}
          </p>
        </>
      )}
    </>
  );
};

TimePickerInput.propTypes = propTypes;
TimePickerInput.defaultProps = defaultProps;
export default TimePickerInput;
