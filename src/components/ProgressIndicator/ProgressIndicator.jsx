import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { keys, matches } from 'carbon-components-react/es/internal/keyboard';
import {
  CheckmarkOutline24,
  CheckmarkOutline16,
  Warning24,
  Warning16,
  RadioButton16,
  RadioButton24,
  CircleFilled16,
  CircleFilled24,
} from '@carbon/icons-react';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;
const IDPropTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

const ProgressStep = ({
  id,
  label,
  secondaryLabel,
  description,
  onChange,
  disabled,
  showLabel,
  stepWidth,
  vertical,
  invalid,
  stepNumber,
  lastItem,
  clickable,
  current,
  complete,
  incomplete,
  mainStep,
  subStep,
}) => {
  const isClickable = clickable && !disabled && !current;

  const handleClick = () => {
    onChange(id);
  };

  const handleKeyDown = e => {
    if (matches(e, [keys.Enter, keys.Space])) {
      handleClick();
    }
  };

  const getStepWidth = () => {
    if (stepWidth != null && stepWidth > 0) {
      return vertical
        ? { height: `${stepWidth}rem`, minHeight: `${stepWidth}rem` }
        : { width: `${stepWidth}rem`, minWidth: `${stepWidth}rem` };
    }
    return undefined;
  };

  const StepIcon = () => {
    const completed = complete && !disabled && !invalid;
    let value;

    if (mainStep) {
      if (completed) {
        value = <CheckmarkOutline24 />;
      } else if (invalid) {
        value = <Warning24 />;
      } else {
        const number = (
          <>
            <text id="icon-numbered" x="50%" y="55%" dominantBaseline="middle" textAnchor="middle">
              {stepNumber}
            </text>
          </>
        );
        if (current) {
          value = <CircleFilled24>{number}</CircleFilled24>;
        } else {
          value = <RadioButton24>{number}</RadioButton24>;
        }
      }
    } else if (completed) {
      value = <CheckmarkOutline16 />;
    } else if (invalid) {
      value = <Warning16 />;
    } else if (current) {
      value = <CircleFilled16 />;
    } else {
      value = <RadioButton16 />;
    }

    return (
      <span className="icon" title={description}>
        {value}
      </span>
    );
  };

  const StepLine = () => {
    const classes = classnames({
      [`line`]: !complete && !subStep,
      [`line-sub`]: !complete && subStep,
      [`line-complete`]: complete && !subStep,
      [`line-sub-complete`]: complete && subStep,
    });

    return !lastItem ? <div className={classes} /> : null;
  };

  const StepLabel = () => {
    const classes = classnames({
      [`label`]: mainStep || subStep,
      [`hidden`]: !showLabel && !current,
    });

    return (
      <p className={classes} value={description}>
        {label}
      </p>
    );
  };

  const StepSecondaryLabel = () => {
    const classes = classnames({
      [`label-optional`]: mainStep || subStep,
      [`hidden`]: !showLabel && !current,
    });

    return secondaryLabel !== null && secondaryLabel !== undefined ? (
      <p className={classes}>{secondaryLabel}</p>
    ) : null;
  };

  const StepButton = () => {
    const classes = classnames({
      [`step-button`]: true,
      [`main-step`]: mainStep,
      [`sub-step`]: subStep,
      [`clickable`]: isClickable,
    });

    // for testing purposes
    const dataTestIdLabel = label.replace(/\s/g, '-').toLowerCase();
    const type = mainStep ? 'main' : 'sub';

    return (
      <>
        <button
          className={classes}
          type="button"
          aria-disabled={disabled}
          disabled={disabled}
          style={getStepWidth()}
          onClick={isClickable ? handleClick : null}
          onKeyDown={isClickable ? handleKeyDown : null}
          data-testid={`step-button-${type}-${dataTestIdLabel}`}
        >
          <StepLine />
          <StepIcon />
          <div className="label-container">
            <StepLabel />
            <StepSecondaryLabel tabIndex="-1" />
          </div>
        </button>
      </>
    );
  };

  const classes = classnames({
    [`step-current`]: current && !disabled,
    [`step-complete`]: complete && !disabled && !invalid,
    [`step-incomplete`]: incomplete && !current && !disabled && !invalid,
    [`step-disabled`]: disabled,
    [`step-invalid`]: invalid,
  });

  return (
    <li className={classes}>
      <StepButton tabIndex="0" />
    </li>
  );
};

ProgressStep.propTypes = {
  id: IDPropTypes.isRequired,
  label: PropTypes.string,
  secondaryLabel: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  showLabel: PropTypes.bool,
  stepWidth: PropTypes.number,
  vertical: PropTypes.bool,
  invalid: PropTypes.bool,
  stepNumber: PropTypes.number,
  lastItem: PropTypes.bool,
  clickable: PropTypes.bool,
  current: PropTypes.bool,
  complete: PropTypes.bool,
  incomplete: PropTypes.bool,
  mainStep: PropTypes.bool,
  subStep: PropTypes.bool,
};

ProgressStep.defaultProps = {
  label: null,
  secondaryLabel: null,
  description: null,
  onChange: null,
  disabled: false,
  showLabel: false,
  stepWidth: null,
  vertical: false,
  invalid: false,
  stepNumber: 0,
  lastItem: false,
  clickable: false,
  current: false,
  complete: false,
  incomplete: false,
  mainStep: false,
  subStep: false,
};

const ProgressIndicator = ({
  className,
  items,
  currentItemId,
  showLabels,
  isVerticalMode,
  stepWidth,
  clickable,
  setStep,
}) => {
  const [currentStep, setCurrentStep] = useState(currentItemId || items[0].id);

  const flattenItems = (itemsList, level = 0) => {
    let newList = [];
    let step = 1;
    let newVal;

    itemsList.forEach(item => {
      newVal = Object.assign({}, item);
      if (item.children) {
        delete newVal.children;
        newVal.stepNumber = step;
        newVal.level = level;
        newList.push(newVal);
        step += 1;
        newList = newList.concat(flattenItems(item.children, level + 1));
      } else {
        newVal.stepNumber = step;
        newVal.level = level;
        newList.push(newVal);
        step += 1;
      }
    });
    return newList;
  };

  const newItems = items && flattenItems(items);

  const lastItemId = () => newItems[newItems.length - 1].id;

  const getCurrentIndex = () => {
    let idx = 0;
    if (currentStep) {
      const index = newItems.findIndex(item => item.id === currentStep);
      idx = index > -1 ? index : 0;
    }
    return idx;
  };

  const handleChange = step => {
    if (step !== currentStep) {
      if (setStep) {
        setStep(step);
      } else {
        setCurrentStep(step);
      }
    }
  };

  useEffect(() => setCurrentStep(currentItemId), [currentItemId]);

  const hasItems = () => newItems.length > 1;

  const classes = classnames({
    [`${iotPrefix}--progress-indicator`]: true,
    [`${iotPrefix}--progress-indicator--vertical`]: isVerticalMode,
    [className]: className,
  });

  return hasItems() ? (
    <ul className={classes} data-testid="iot-progress-indicator-testid" onChange={handleChange}>
      {newItems.map(
        (
          { id, label, secondaryLabel, description, disabled, invalid, stepNumber, level },
          index
        ) => (
          <ProgressStep
            id={id}
            key={id}
            label={label}
            secondaryLabel={secondaryLabel}
            description={description || label}
            current={currentStep === id}
            complete={getCurrentIndex() > index}
            incomplete={getCurrentIndex() < index}
            mainStep={level === 0}
            subStep={level > 0}
            onChange={handleChange}
            stepNumber={stepNumber}
            vertical={isVerticalMode}
            showLabel={showLabels}
            stepWidth={stepWidth}
            lastItem={lastItemId() === id}
            disabled={disabled}
            invalid={invalid}
            clickable={clickable}
          />
        )
      )}
    </ul>
  ) : null;
};

ProgressIndicator.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: IDPropTypes,
      label: PropTypes.string.isRequired,
      secondaryLabel: PropTypes.string,
      description: PropTypes.string,
      disabled: PropTypes.bool,
      invalid: PropTypes.bool,
    })
  ),
  currentItemId: IDPropTypes,
  showLabels: PropTypes.bool,
  stepWidth: PropTypes.number,
  isVerticalMode: PropTypes.bool,
  clickable: PropTypes.bool,
  setStep: PropTypes.func,
};

ProgressIndicator.defaultProps = {
  className: null,
  items: null,
  showLabels: true,
  stepWidth: null,
  currentItemId: null,
  isVerticalMode: false,
  clickable: false,
  setStep: null,
};

export default ProgressIndicator;
