import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { keys, matches } from 'carbon-components-react/es/internal/keyboard';
import { Checkmark24 } from '@carbon/icons-react';
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
  const isClickable = clickable && !disabled;

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

    return (
      <span className={classes} title={description}>
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
      [`clickable`]: isClickable,
    });

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
        >
          <StepLine />
          <StepIcon />
          <div
            className="label-container"
            onMouseEnter={() => labelHover(true)}
            onMouseLeave={() => labelHover(false)}
          >
            <StepLabel />
            <StepSecondaryLabel />
            <Tooltip open={showTooltip} showIcon={false} direction={vertical ? 'right' : 'bottom'}>
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
    [`step-disabled`]: disabled && !invalid,
    [`step-invalid`]: invalid && !disabled,
  });

  return (
    <li className={classes}>
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
}) => {
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

  const newItems = flattenItems(items);
  const lastItemId = newItems[newItems.length - 1].id;

  const getInitialIndex = () => {
    const index = newItems.findIndex(item => item.id === currentItemId);
    return index > -1 ? index : 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);

  const getInitialItemId = () => {
    return newItems[currentIndex].id;
  };

  const [currentStep, setCurrentStep] = useState(getInitialItemId);

  const handleChange = (step, index) => {
    if (currentStep !== step) {
      setCurrentStep(step);
      setCurrentIndex(index);
    }
  };

  const classes = classnames({
    [`${iotPrefix}--progress-indicator-new`]: true,
    [`vertical`]: isVerticalMode,
  });

  return (
    <ul className={classes} data-testid="iot-progress-indicator-testid" onChange={handleChange}>
      {newItems.map(
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
            currentIndex={currentIndex}
            onChange={handleChange}
            level={level}
            stepNumber={stepNumber}
            vertical={isVerticalMode}
            showLabel={showLabels}
            stepWidth={stepWidth}
            lastItem={lastItemId === id}
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
};

IotProgressIndicator.defaultProps = {
  items: null,
  showLabels: true,
  stepWidth: null,
  currentItemId: null,
  isVerticalMode: false,
  clickable: false,
};

export default IotProgressIndicator;
