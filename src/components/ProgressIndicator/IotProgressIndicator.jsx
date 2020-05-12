import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { keys, matches } from 'carbon-components-react/es/internal/keyboard';
import { Checkmark24 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const IDPropTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export const IotProgressStep = ({
  id,
  index,
  label,
  secondaryLabel,
  description,
  currentStep,
  currentIndex,
  onChange,
  disabled,
  showLabel,
  stepWidth,
  vertical,
  invalid,
  level,
  stepNumber,
  lastItem,
}) => {
  const current = currentStep === id;
  const complete = currentIndex > index;
  const incomplete = currentIndex < index;
  const mainStep = level === 0;
  const subStep = level > 0;

  const handleClick = () => {
    onChange(id, index);
  };

  const handleKeyDown = e => {
    if (matches(e, [keys.Enter, keys.Space])) {
      handleClick();
    }
  };

  const StepIcon = () => {
    const classes = classnames({
      [`step-icon`]: mainStep,
      [`step-icon-sub`]: subStep,
    });

    const completed = complete && !disabled && !invalid;
    let value;

    if (mainStep) {
      if (completed) {
        value = <Checkmark24 />;
      } else if (invalid) {
        value = <p>!</p>;
      } else {
        value = <p>{stepNumber}</p>;
      }
    } else if (completed) {
      value = <Checkmark24 />;
    } else if (invalid) {
      value = <p>!</p>;
    }

    return <div className={classes}>{value}</div>;
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
      [`label`]: mainStep,
      [`label-sub`]: subStep,
    });

    return (
      <p className={classes} value={description}>
        {label}
      </p>
    );
  };

  const StepSecondaryLabel = () => {
    const classes = classnames({
      [`label-optional`]: mainStep,
      [`label-sub-optional`]: subStep,
    });

    return secondaryLabel !== null && secondaryLabel !== undefined ? (
      <p className={classes}>{secondaryLabel}</p>
    ) : null;
  };

  const StepButton = () => {
    const classes = classnames({
      [`step-button`]: true,
      [`optional-hidden`]: !showLabel && !current,
    });

    return (
      <button
        className={classes}
        type="button"
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        <StepLine />
        <StepIcon />
        <StepLabel />
        <StepSecondaryLabel />
      </button>
    );
  };

  const getStepWidth = () => {
    if (stepWidth != null && stepWidth >= 0) {
      return vertical
        ? { height: `${stepWidth}rem`, minHeight: `${stepWidth}rem` }
        : { width: `${stepWidth}rem`, minWidth: `${stepWidth}rem` };
    }
    return undefined;
  };

  const classes = classnames({
    [`step-current`]: current && !disabled,
    [`step-complete`]: complete && !disabled && !invalid,
    [`step-incomplete`]: incomplete && !current && !disabled && !invalid,
    [`step-disabled`]: disabled && !invalid,
    [`step-invalid`]: invalid && !disabled,
  });

  return (
    <li className={classes} style={getStepWidth()}>
      <StepButton />
    </li>
  );
};

IotProgressStep.propTypes = {
  id: IDPropTypes.isRequired,
  index: PropTypes.number,
  label: PropTypes.string,
  secondaryLabel: PropTypes.string,
  description: PropTypes.string,
  currentStep: PropTypes.string,
  currentIndex: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  showLabel: PropTypes.bool,
  stepWidth: PropTypes.number,
  vertical: PropTypes.bool,
  invalid: PropTypes.bool,
  level: PropTypes.number,
  stepNumber: PropTypes.number,
  lastItem: PropTypes.bool,
};

IotProgressStep.defaultProps = {
  index: 0,
  label: null,
  secondaryLabel: null,
  description: null,
  currentStep: null,
  currentIndex: null,
  onChange: null,
  disabled: false,
  showLabel: false,
  stepWidth: 8,
  vertical: false,
  invalid: false,
  level: 0,
  stepNumber: 0,
  lastItem: false,
};

export const IotProgressIndicator = ({
  items,
  currentItemId,
  showLabels,
  isVerticalMode,
  spaceEqually,
  stepWidth,
}) => {
  const flattenItems = (itemsList, level = 0) => {
    let newList = [];
    let stepNumber = 1;

    itemsList.forEach(item => {
      if (item.children) {
        const newVal = Object.assign({}, item);
        delete newVal.children;
        newVal.stepNumber = stepNumber;
        newVal.level = level;
        newList.push(newVal);
        stepNumber += 1;
        newList = newList.concat(flattenItems(item.children, level + 1));
      } else {
        item.stepNumber = stepNumber;
        item.level = level;
        newList.push(item);
        stepNumber += 1;
      }
    });
    return newList;
  };

  const newItems = flattenItems(items);

  const getInitialItemId = () => {
    return currentItemId || '';
  };

  const getInitialIndex = () => {
    const index = newItems.findIndex(item => item.id === currentItemId);
    return index > -1 ? index : 0;
  };

  const [currentStep, setCurrentStep] = useState(getInitialItemId);
  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);

  const handleChange = (step, index) => {
    if (currentStep !== step) {
      setCurrentStep(step);
      setCurrentIndex(index);
    }
  };

  const stepList = newList => {
    const list = [];

    newList.forEach(
      ({ id, label, secondaryLabel, description, disabled, invalid, stepNumber, level }, index) => {
        list.push(
          <IotProgressStep
            id={id}
            key={id}
            label={label}
            secondaryLabel={secondaryLabel}
            description={description || label}
            index={index}
            currentStep={currentStep}
            currentIndex={currentIndex}
            onChange={handleChange}
            level={level}
            stepNumber={stepNumber}
            vertical={isVerticalMode}
            showLabel={showLabels}
            stepWidth={stepWidth}
            lastItem={newItems[newItems.length - 1].id === id}
            disabled={disabled}
            invalid={invalid}
          />
        );
      }
    );

    return list;
  };

  const classes = classnames({
    [`${iotPrefix}--progress`]: true,
    [`${iotPrefix}--progress--vertical`]: isVerticalMode,
    [`${iotPrefix}--progress--space-equal`]: spaceEqually && !isVerticalMode,
  });

  return (
    <ul className={classes} data-testid="progress-indicator-testid" onChange={handleChange}>
      {stepList(newItems)}
    </ul>
  );
};

IotProgressIndicator.propTypes = {
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
  spaceEqually: PropTypes.bool,
};

IotProgressIndicator.defaultProps = {
  items: null,
  showLabels: true,
  stepWidth: null,
  currentItemId: null,
  isVerticalMode: false,
  spaceEqually: false,
};

export default IotProgressIndicator;
