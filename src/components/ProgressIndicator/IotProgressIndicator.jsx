import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { keys, matches } from 'carbon-components-react/es/internal/keyboard';
import {
  CheckmarkOutline24,
  CheckmarkOutline16,
  Warning24,
  Warning16,
  RadioButton16,
  CircleFilled16,
} from '@carbon/icons-react';
import { Tooltip } from 'carbon-components-react';

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
  clickable,
}) => {
  const current = currentStep === id;
  const complete = currentIndex > index;
  const incomplete = currentIndex < index;
  const mainStep = level === 0;
  const subStep = level > 0;
  const isClickable = clickable && !disabled && !current;

  const labelContainerRef = React.useRef(null);
  const secondaryLabelContainerRef = React.useRef(null);
  const [overflow, setOverflow] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(
    () => {
      const e = labelContainerRef.current;
      const i = secondaryLabelContainerRef.current;
      const hasOverflow =
        e.offsetWidth < e.scrollWidth || (i !== null && i.offsetWidth < i.scrollWidth);
      setOverflow(hasOverflow);
    },
    [stepWidth]
  );

  const labelHover = hover => {
    if (hover && overflow) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };

  const handleClick = () => {
    onChange(id, index);
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

  const getTooltipLabel = () => {
    return secondaryLabel ? `${label} - ${secondaryLabel}` : `${label}`;
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
        value = <p>{stepNumber}</p>;
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
      <p className={classes} value={description} ref={labelContainerRef}>
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
      <p className={classes} ref={secondaryLabelContainerRef}>
        {secondaryLabel}
      </p>
    ) : null;
  };

  const StepButton = () => {
    const classes = classnames({
      [`step-button`]: true,
      [`main-step`]: mainStep,
      [`sub-step`]: subStep,
      [`clickable`]: isClickable,
    });

    const dataTestId = label.replace(/\s/g, '-').toLowerCase();

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
          data-testid={`step-button-${dataTestId}`}
        >
          <StepLine />
          <StepIcon />
          <div
            className="label-container"
            onMouseEnter={() => labelHover(true)}
            onMouseLeave={() => labelHover(false)}
          >
            <StepLabel />
            <StepSecondaryLabel tabIndex="-1" />
            <Tooltip
              open={showTooltip}
              triggerId={`${dataTestId}-tooltip`}
              showIcon={false}
              direction={vertical ? 'right' : 'bottom'}
              tabIndex={-1}
            >
              {getTooltipLabel()}
            </Tooltip>
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
  clickable: PropTypes.bool,
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
  stepWidth: null,
  vertical: false,
  invalid: false,
  level: 0,
  stepNumber: 0,
  lastItem: false,
  clickable: false,
};

export const IotProgressIndicator = ({
  items,
  currentItemId,
  showLabels,
  isVerticalMode,
  stepWidth,
  clickable,
  setStep,
}) => {
  const [currentStep, setCurrentStep] = useState(currentItemId);

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

  const handleChange = (step, index) => {
    if (step && step !== currentStep) {
      setCurrentStep(step);
      if (setStep) setStep(index);
    } else {
      setCurrentStep(currentItemId);
    }
  };

  useEffect(() => handleChange(), [currentItemId]);

  const hasItems = () => newItems.length > 0;

  const classes = classnames({
    [`${iotPrefix}--progress-indicator-new`]: true,
    [`vertical`]: isVerticalMode,
  });

  return (
    <ul className={classes} data-testid="iot-progress-indicator-testid" onChange={handleChange}>
      {hasItems() &&
        newItems.map(
          (
            { id, label, secondaryLabel, description, disabled, invalid, stepNumber, level },
            index
          ) => (
            <IotProgressStep
              id={id}
              key={id}
              label={label}
              secondaryLabel={secondaryLabel}
              description={description || label}
              index={index}
              currentStep={currentStep}
              currentIndex={getCurrentIndex()}
              onChange={handleChange}
              level={level}
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
  clickable: PropTypes.bool,
  setStep: PropTypes.func,
};

IotProgressIndicator.defaultProps = {
  items: null,
  showLabels: true,
  stepWidth: null,
  currentItemId: null,
  isVerticalMode: false,
  clickable: false,
  setStep: null,
};

export default IotProgressIndicator;
