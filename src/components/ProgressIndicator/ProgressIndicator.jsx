import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ProgressIndicator as CarbonProgressIndicator,
  ProgressStep,
} from 'carbon-components-react';
import styled from 'styled-components';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { prefix, iotPrefix } = settings;

const IDPropTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

const propTypes = {
  /** array of item objects with id and labels */
  items: PropTypes.arrayOf(PropTypes.shape({ id: IDPropTypes, label: PropTypes.string.isRequired }))
    .isRequired,
  /** id of current step */
  currentItemId: IDPropTypes,
  /** function on click, usually to set the currentItemId */
  onClickItem: PropTypes.func,
  /** false to hide labels on non-current steps */
  showLabels: PropTypes.bool,
  /** width of step in px */
  stepWidth: PropTypes.number,
  /** progress indicator is vertical */
  isVerticalMode: PropTypes.bool,
};

const defaultProps = {
  onClickItem: null,
  showLabels: true,
  stepWidth: null,
  currentItemId: null,
  isVerticalMode: false,
};

const StyledProgressIndicator = styled(({ isVerticalMode, ...others }) => (
  <CarbonProgressIndicator {...others} />
))`
  &&& {
    display: ${props => (!props.isVerticalMode ? `inline-flex` : '')};

    .${prefix}--progress-step--complete {
      cursor: pointer;
    }
    .${prefix}--progress-step--incomplete {
      cursor: pointer;
    }
  }
`;

const StyledProgressStep = styled(({ showLabel, stepWidth, isVerticalMode, ...others }) => (
  <ProgressStep {...others} />
))`
  &&& {
    width: ${props => (!props.isVerticalMode && props.stepWidth ? `${props.stepWidth}rem` : '')};
    min-width: ${props =>
      !props.isVerticalMode && props.stepWidth ? `${props.stepWidth}rem` : ''};
    p {
      display: ${props => (!props.showLabel ? 'none' : '')};

      &:hover::after {
        content: attr(data-label);
        width: 100%;
        position: absolute;
        top: 100%;
      }
    }
    ${props => {
      const { isVerticalMode, stepWidth } = props;
      return isVerticalMode
        ? `
        .${prefix}--progress-step-button {
        flex-flow: initial;
      }
      height: ${stepWidth ? `${stepWidth}rem` : 'inherit'};
      min-height: ${stepWidth ? `${stepWidth}rem` : '4rem'};
      `
        : '';
    }}
  }
`;

/**
 * This component extends the default Carbon ProgressIndicator.
 * It adds the ability to hideLabels on non-current steps and set a maximum stepWidth in pixels
 */
const ProgressIndicator = ({
  items,
  showLabels,
  currentItemId,
  onClickItem,
  stepWidth,
  className,
  isVerticalMode,
}) => {
  const handleChange = index => {
    if (onClickItem) {
      // Parent components are expecting the id not the index
      onClickItem(items[index].id);
    }
  };

  const matchingIndex = useMemo(() => items.findIndex(item => item.id === currentItemId), [
    items,
    currentItemId,
  ]);

  // Only recalculate current step if inputs change
  const currentStep = matchingIndex > -1 ? matchingIndex : 0;
  return (
    <StyledProgressIndicator
      className={classnames(className, `${iotPrefix}--progress-indicator`)}
      onChange={handleChange}
      currentIndex={currentStep}
      isVerticalMode={isVerticalMode}
      vertical={isVerticalMode}
    >
      {items.map(({ id, label, secondaryLabel, description }) => (
        <StyledProgressStep
          key={id}
          label={label}
          data-label={label}
          secondaryLabel={secondaryLabel}
          description={description || label}
          showLabel={showLabels || currentItemId === id}
          stepWidth={stepWidth}
          isVerticalMode={isVerticalMode}
        />
      ))}
    </StyledProgressIndicator>
  );
};

ProgressIndicator.propTypes = propTypes;
ProgressIndicator.defaultProps = defaultProps;

export default ProgressIndicator;
