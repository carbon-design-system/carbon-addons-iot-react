import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'carbon-components-react';
import {
  ChevronUp16,
  ChevronDown16,
  Time16,
  EditOff16,
  WarningAlt16,
  WarningFilled,
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
  hideLabel,
  hideSecondaryLabel,
  ...other
}) => {
  const {
    labelText,
    secondaryLabelText,
    helperText,
    invalidText,
    warnText,
    timeIconText,
    placeholderText,
  } = useMerged(defaultProps.i18n, i18n);

  const helpText = useMemo(
    () => (invalid[0] || invalid[1] ? invalidText : warn[0] || warn[1] ? warnText : helperText),
    [invalid, warn, invalidText, warnText, helperText]
  );

  const icon = useMemo(() => {}, []);

  return (
    <div
      className={classnames(`${iotPrefix}--time-picker`, {
        [className]: className,
        [`${iotPrefix}--time-picker--light`]: light,
        [`${iotPrefix}--time-picker--disabled`]: disabled,
        [`${iotPrefix}--time-picker-range`]: type === 'range',
        [`${iotPrefix}--time-picker--invalid`]: invalid[0] || invalid[1],
        [`${iotPrefix}--time-picker--warn`]: warn[0] || warn[1],
      })}
    >
      {type === 'single' ? (
        <>
          <div className={`${iotPrefix}--time-picker__wrapper`}>
            <TextInput
              hideLabel={hideLabel}
              labelText={labelText}
              placeholder={placeholderText}
              size={size}
              warn={warn[0]}
              invalid={invalid[0]}
              light={light}
              disabled={disabled}
            />
            <Time16 className={classnames(`${iotPrefix}--time-picker__icon`)} />
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
            {helpText}
          </p>
        </>
      ) : hideSecondaryLabel && !hideLabel ? (
        <fieldset>
          <legend
            id={`${id}-label`}
            className={classnames(`${prefix}--label`, { [`${prefix}--label--disabled`]: disabled })}
          >
            {labelText}
          </legend>
          <div className={`${iotPrefix}--time-picker__wrapper`}>
            <TextInput
              id={`${id}-1`}
              hideLabel={hideSecondaryLabel || hideLabel}
              ariaLabledBy={hideSecondaryLabel ? `${id}-1` : undefined}
              className={`${iotPrefix}--time-picker-range__text-input-wrapper`}
              labelText={!hideSecondaryLabel ? labelText : ''}
              placeholder={placeholderText}
              size={size}
              warn={warn[0] === 'true'}
              invalid={invalid[0] === 'true'}
              light={light}
              disabled={disabled}
              invalidText={invalidText}
              warnText={warnText}
              // {...other}
            />
            <Time16 className={classnames(`${iotPrefix}--time-picker__icon`)} />
          </div>
          <div className={`${iotPrefix}--time-picker__wrapper`}>
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
            <Time16 className={classnames(`${iotPrefix}--time-picker__icon`)} />
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
            {helpText}
          </p>
        </fieldset>
      ) : (
        <>
          <div className={`${iotPrefix}--time-picker__wrapper`}>
            <TextInput
              id={`${id}-1`}
              ariaLabledBy={hideSecondaryLabel ? `${id}-label` : undefined}
              hideLabel={hideLabel}
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
            <Time16 className={classnames(`${iotPrefix}--time-picker__icon`)} />
          </div>
          <div className={`${iotPrefix}--time-picker__wrapper`}>
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
            <Time16 className={classnames(`${iotPrefix}--time-picker__icon`)} />
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
            {helpText}
          </p>
        </>
      )}
    </div>
  );
};

export const TimePickerSpinner = () => {
  const [selected, setSelected] = useState(['03', '03', 'AM']);
  const observer = React.useRef();
  React.useEffect(
    () => () => {
      // Disconnect from any old observers
      if (observer.current) {
        observer.current.disconnect();
      }
    },
    []
  );
  const lastItem = React.useCallback((node) => {
    // Disconnect from any old observers
    if (observer.current) {
      observer.current.disconnect();
    }
    // Create a new observer
    observer.current = new IntersectionObserver((entries) => {
      // If lastItem is in veiwport & we have a pageToken
      // trigger a new GET by updating pageToken state
      if (entries[0].isIntersecting && pageToken !== null) {
        setPageNumber(pageToken);
      }
    });
    // Once component mounts tell our observer to observe it
    if (node) {
      observer.current?.observe(node);
    }
  }, []);
  const handleClick = (e, item, index) => {
    console.log(e.target);
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
  return (
    <div className={`${iotPrefix}--time-picker-spinner`}>
      <div className={`${iotPrefix}--time-picker-spinner-section`}>
        <Button
          className={`${iotPrefix}--time-picker-spinner-button`}
          renderIcon={ChevronUp16}
          kind="ghost"
        />
        <ul className={`${iotPrefix}--time-picker-spinner-list`}>
          <li>
            <Button
              id="hour-01"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '01',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '01', 0)}
            >
              01
            </Button>
          </li>
          <li>
            <Button
              id="hour-02"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '02',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '02', 0)}
            >
              02
            </Button>
          </li>
          <li>
            <Button
              id="hour-03"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '03',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '03', 0)}
            >
              03
            </Button>
          </li>
          <li>
            <Button
              id="hour-04"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '04',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '04', 0)}
            >
              04
            </Button>
          </li>
          <li>
            <Button
              id="hour-05"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '05',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '05', 0)}
            >
              05
            </Button>
          </li>
          <li>
            <Button
              id="hour-06"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '06',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '06', 0)}
            >
              06
            </Button>
          </li>
          <li>
            <Button
              id="hour-07"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '07',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '07', 0)}
            >
              07
            </Button>
          </li>
          <li>
            <Button
              id="hour-08"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '08',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '08', 0)}
            >
              08
            </Button>
          </li>
          <li>
            <Button
              id="hour-09"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '09',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '09', 0)}
            >
              09
            </Button>
          </li>
          <li>
            <Button
              id="hour-10"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '10',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '10', 0)}
            >
              10
            </Button>
          </li>
          <li>
            <Button
              id="hour-11"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '11',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '11', 0)}
            >
              11
            </Button>
          </li>
          <li>
            <Button
              id="hour-12"
              className={classnames(`${iotPrefix}--time-picker-spinner-button`, {
                [`${iotPrefix}--time-picker-spinner-button--selected`]: selected[0] === '12',
              })}
              kind="ghost"
              onClick={(e) => handleClick(e, '12', 0)}
            >
              12
            </Button>
          </li>
        </ul>
        <Button
          className={`${iotPrefix}--time-picker-spinner-button`}
          renderIcon={ChevronDown16}
          kind="ghost"
        />
      </div>

      <div className={`${iotPrefix}--time-picker-spinner-section`}>
        <Button
          className={`${iotPrefix}--time-picker-spinner-button`}
          renderIcon={ChevronUp16}
          kind="ghost"
        />
        <ul className={`${iotPrefix}--time-picker-spinner-list`}>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              01
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              02
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              03
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              04
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              05
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              06
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              07
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              08
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              09
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              10
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              11
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              12
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              13
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              14
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              15
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              16
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              17
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              18
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              19
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              20
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              21
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              22
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              23
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              24
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              25
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              26
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              27
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              28
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              29
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              30
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              31
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              32
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              33
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              34
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              35
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              36
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              37
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              38
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              39
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              40
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              41
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              42
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              43
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              44
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              45
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              46
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              47
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              48
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              49
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              50
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              51
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              52
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              53
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              54
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              55
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              56
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              57
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              58
            </Button>
          </li>
          <li>
            <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
              59
            </Button>
          </li>
        </ul>
        <Button
          className={`${iotPrefix}--time-picker-spinner-button`}
          renderIcon={ChevronDown16}
          kind="ghost"
        />
      </div>
      <ul
        className={`${iotPrefix}--time-picker-spinner-section ${iotPrefix}--time-picker-spinner-list`}
      >
        <li>
          <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
            AM
          </Button>
        </li>
        <li>
          <Button className={`${iotPrefix}--time-picker-spinner-button`} kind="ghost">
            PM
          </Button>
        </li>
      </ul>
    </div>
  );
};

const ListSpinner = ({ className, children }) => {
  const listItems = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      name: props.name,
    });
  });

  return (
    <div className={`${className}-spinner__section`}>
      <Button className={`${className}-spinner__button`} renderIcon={ChevronUp16} kind="ghost" />
      <ul className={`${iotPrefix}--time-picker-spinner-list`}>{listItems}</ul>
      <Button
        className={`${iotPrefix}--time-picker-spinner-button`}
        renderIcon={ChevronDown16}
        kind="ghost"
      />
    </div>
  );
};

TimePicker.propTypes = propTypes;
TimePicker.defaultProps = defaultProps;
export default TimePicker;
