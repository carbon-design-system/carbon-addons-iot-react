import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ProgressIndicator as CarbonProgressIndicator,
  ProgressStep,
} from 'carbon-components-react';
import styled from 'styled-components';

const StyledProgressIndicator = styled(CarbonProgressIndicator)`
  &&& {
    display: inline-flex;
  }
`;

const StyledProgressStep = styled(({ showLabel, stepWidth, ...others }) => (
  <ProgressStep {...others} />
))`
  &&& {
    width: ${props => `${props.stepWidth}px` || 'inherit'};
    min-width: 136px;
    p {
      display: ${props => (!props.showLabel ? 'none' : 'inherit')};
    }
  }
`;

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
};

const defaultProps = {
  onClickItem: null,
  showLabels: true,
  stepWidth: 102,
  currentItemId: null,
};

/** This component extends the default Carbon ProgressIndicator.  It adds the ability to hideLabels on non-current steps and set a maximum stepWidth in pixels */
const ProgressIndicator = ({ items, showLabels, currentItemId, onClickItem, stepWidth }) => {
  const handleChange = index => {
    if (onClickItem) {
      // Parent components are expecting the id not the index
      onClickItem(items[index].id);
    }
  };
  // Only recalculate current step if inputs change
  const currentStep = useMemo(() => items.findIndex(item => item.id === currentItemId), [
    items,
    currentItemId,
  ]);

  return (
    <StyledProgressIndicator onChange={handleChange} currentIndex={currentStep}>
      {items.map(({ id, label }) => (
        <StyledProgressStep
          key={id}
          label={label}
          description={label}
          showLabel={showLabels || currentItemId === id}
          stepWidth={stepWidth}
        />
      ))}
    </StyledProgressIndicator>
  );
};

ProgressIndicator.propTypes = propTypes;
ProgressIndicator.defaultProps = defaultProps;
export default ProgressIndicator;
