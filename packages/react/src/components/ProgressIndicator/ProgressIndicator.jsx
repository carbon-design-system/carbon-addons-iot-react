import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Enter, Space } from '@carbon/react/es/internal/keyboard/keys';
import { matches } from '@carbon/react/es/internal/keyboard/match';
import { CheckmarkOutline, Warning, RadioButton, CircleFilled } from '@carbon/react/icons';
import * as Pictograms from '@carbon/pictograms-react';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;
const IDPropTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

const ProgressStep = ({
  id,
  label,
  secondaryLabel,
  description,
  onClick,
  disabled,
  showLabel,
  stepWidth,
  vertical,
  invalid,
  stepNumber,
  lastItem,
  isClickable,
  current,
  complete,
  incomplete,
  mainStep,
  subStep,
  spaceEqually,
  pictogramName,
  hasPictogram,
}) => {
  const accessible = isClickable && !disabled && !current;

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const handleKeyDown = (e) => {
    if (matches(e, [Enter, Space])) {
      handleClick();
    }
  };

  const getStepWidth = () => {
    if (stepWidth != null && stepWidth > 0 && !spaceEqually) {
      return vertical
        ? { height: `${stepWidth}rem`, minHeight: `${stepWidth}rem` }
        : { width: `${stepWidth}rem`, minWidth: `${stepWidth}rem` };
    }

    if (spaceEqually) {
      return { flexGrow: 1 };
    }
    return undefined;
  };

  const StepIcon = () => {
    const completed = complete && !disabled && !invalid;
    let value;

    if (mainStep) {
      if (completed) {
        value = <CheckmarkOutline size={24} />;
      } else if (invalid) {
        value = <Warning size={24} />;
      } else {
        const number = (
          <>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle">
              {stepNumber}
            </text>
          </>
        );
        if (current) {
          value = <CircleFilled size={24}>{number}</CircleFilled>;
        } else {
          value = <RadioButton size={24}>{number}</RadioButton>;
        }
      }
    } else if (completed) {
      value = <CheckmarkOutline />;
    } else if (invalid) {
      value = <Warning />;
    } else if (current) {
      value = <CircleFilled />;
    } else {
      value = <RadioButton />;
    }

    return (
      <span className={`${iotPrefix}--progress-step-icon`} title={description}>
        {value}
      </span>
    );
  };

  const StepLine = () => {
    const classes = classnames({
      [`${iotPrefix}--progress-step-line`]: !complete && !subStep,
      [`${iotPrefix}--progress-step-line--sub`]: !complete && subStep,
      [`${iotPrefix}--progress-step-line--complete`]: complete && !subStep,
      [`${iotPrefix}--progress-step-line--sub-complete`]: complete && subStep,
    });

    return !lastItem ? <div className={classes} /> : null;
  };

  const StepLabel = () => {
    return (
      <p className={`${iotPrefix}--progress-text-label`} value={description} title={label}>
        {label}
      </p>
    );
  };

  const StepSecondaryLabel = () => {
    return secondaryLabel !== null && secondaryLabel !== undefined ? (
      <p className={`${iotPrefix}--progress-text-label--optional`} title={secondaryLabel}>
        {secondaryLabel}
      </p>
    ) : null;
  };

  const StepButton = () => {
    const buttonClasses = classnames({
      [`${iotPrefix}--progress-step-button`]: true,
      [`${iotPrefix}--progress-step-button--main-step`]: mainStep,
      [`${iotPrefix}--progress-step-button--sub-step`]: subStep,
      [`${iotPrefix}--progress-step-button--clickable`]: accessible,
    });

    const textClasses = classnames({
      [`${iotPrefix}--progress-text`]: true,
      [`${iotPrefix}--progress-text--hidden`]: !showLabel && !current,
    });

    // for testing purposes
    const dataTestIdLabel = label.replace(/\s/g, '-').toLowerCase();
    const type = mainStep ? 'main' : 'sub';

    // get pictogram component from name passed in items array via pictogramName property
    const PictogramComponent = pictogramName?.length ? Pictograms[pictogramName] : null;
    return (
      <>
        {
          // reserve space in all steps if even one pictogram is showing to align all the steps correctly
          hasPictogram && (
            <div className={`${iotPrefix}--progress-step--pictogram-item`}>
              {PictogramComponent && <PictogramComponent />}
            </div>
          )
        }
        <button
          className={buttonClasses}
          type="button"
          aria-disabled={disabled}
          disabled={disabled}
          onClick={accessible ? handleClick : null}
          onKeyDown={accessible ? handleKeyDown : null}
          data-testid={`${iotPrefix}--progress-step-button-${type}-${dataTestIdLabel}`}
          tabIndex={current || disabled ? -1 : 0}
        >
          <StepLine />
          <StepIcon />
          <div className={textClasses}>
            <StepLabel />
            <StepSecondaryLabel />
          </div>
        </button>
      </>
    );
  };

  const classes = classnames({
    [`${iotPrefix}--progress-step`]: true,
    [`${iotPrefix}--progress-step--current`]: current && !disabled,
    [`${iotPrefix}--progress-step--complete`]: complete && !disabled && !invalid,
    [`${iotPrefix}--progress-step--incomplete`]: incomplete && !current && !disabled && !invalid,
    [`${iotPrefix}--progress-step--disabled`]: disabled,
    [`${iotPrefix}--progress-step--invalid`]: invalid,
    [`${iotPrefix}--progress-step--pictogram`]: hasPictogram,
  });

  return (
    <li className={classes} style={getStepWidth()}>
      <StepButton />
    </li>
  );
};

ProgressStep.propTypes = {
  id: IDPropTypes.isRequired,
  label: PropTypes.string,
  secondaryLabel: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  showLabel: PropTypes.bool,
  stepWidth: PropTypes.number,
  vertical: PropTypes.bool,
  invalid: PropTypes.bool,
  stepNumber: PropTypes.number,
  lastItem: PropTypes.bool,
  isClickable: PropTypes.bool,
  current: PropTypes.bool,
  complete: PropTypes.bool,
  incomplete: PropTypes.bool,
  mainStep: PropTypes.bool,
  subStep: PropTypes.bool,
  onClick: PropTypes.func,
  spaceEqually: PropTypes.bool,
  pictogramName: PropTypes.string,
  hasPictogram: PropTypes.bool,
};

ProgressStep.defaultProps = {
  label: null,
  secondaryLabel: null,
  description: null,
  disabled: false,
  showLabel: false,
  stepWidth: null,
  vertical: false,
  invalid: false,
  stepNumber: 0,
  lastItem: false,
  isClickable: false,
  current: false,
  complete: false,
  incomplete: false,
  mainStep: false,
  subStep: false,
  onClick: null,
  spaceEqually: false,
  pictogramName: null,
  hasPictogram: false,
};

const ProgressIndicator = ({
  className,
  items,
  currentItemId,
  showLabels,
  isVerticalMode,
  stepWidth,
  isClickable,
  onClickItem,
  testId,
  spaceEqually,
}) => {
  const [currentStep, setCurrentStep] = useState(currentItemId || items[0].id);

  const flattenItems = (itemsList, level = 0) => {
    let newList = [];
    let step = 1;
    let newVal;

    itemsList.forEach((item) => {
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
      const index = newItems.findIndex((item) => item.id === currentStep);
      idx = index > -1 ? index : 0;
    }
    return idx;
  };

  const handleChange = (step) => {
    if (step !== currentStep) {
      if (onClickItem) {
        onClickItem(step);
      } else {
        setCurrentStep(step);
      }
    }
  };

  useEffect(() => setCurrentStep(currentItemId), [currentItemId]);

  const classes = classnames({
    [`${iotPrefix}--progress-indicator`]: true,
    [`${iotPrefix}--progress-indicator--vertical`]: isVerticalMode,
    [className]: className,
  });

  // check if any pictogram is to be shown, this will modify styling of all the steps
  const hasPictogram = newItems.some(
    ({ pictogramName }) => pictogramName?.length && typeof Pictograms[pictogramName] !== 'undefined'
  );

  return newItems.length > 1 ? (
    <ul className={classes} data-testid={testId}>
      {newItems.map(
        (
          {
            id,
            label,
            secondaryLabel,
            description,
            disabled,
            invalid,
            stepNumber,
            level,
            pictogramName,
          },
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
            onClick={handleChange}
            stepNumber={stepNumber}
            vertical={isVerticalMode}
            showLabel={showLabels}
            stepWidth={stepWidth}
            lastItem={lastItemId() === id}
            disabled={disabled}
            invalid={invalid}
            isClickable={isClickable}
            spaceEqually={spaceEqually}
            pictogramName={pictogramName}
            hasPictogram={hasPictogram}
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
      pictogramName: PropTypes.string,
    })
  ),
  currentItemId: IDPropTypes,
  showLabels: PropTypes.bool,
  stepWidth: PropTypes.number,
  isVerticalMode: PropTypes.bool,
  isClickable: PropTypes.bool,
  onClickItem: PropTypes.func,
  testId: PropTypes.string,
  /** Specify whether the progress steps should be split equally in size in the div */
  spaceEqually: PropTypes.bool,
};

ProgressIndicator.defaultProps = {
  className: null,
  items: null,
  showLabels: true,
  stepWidth: null,
  currentItemId: null,
  isVerticalMode: false,
  isClickable: false,
  onClickItem: null,
  testId: `${iotPrefix}--progress-indicator-testid`,
  spaceEqually: false,
};

export default ProgressIndicator;
