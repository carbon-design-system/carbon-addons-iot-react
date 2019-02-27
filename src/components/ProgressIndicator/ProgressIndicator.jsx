import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProgressStep from './ProgressStep';

class ProgressIndicator extends Component {
  /* Display name */
  static displayName = 'ProgressIndicator';

  static propTypes = {
    /** array of item objects with id and labels */
    items: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
    ).isRequired,
    /** id of current step */
    currentItemId: PropTypes.string.isRequired,
    /** function on click, usually to set the currentItemId */
    onClickItem: PropTypes.func,
    /** false to hide labels on non-current steps */
    showLabels: PropTypes.bool,
    /** width of step in px */
    stepWidth: PropTypes.number,
  };

  static defaultProps = {
    onClickItem: null,
    showLabels: true,
    stepWidth: 102,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const { items, showLabels, onClickItem, currentItemId, stepWidth } = this.props;

    const currentStep = items.findIndex(item => item.id === currentItemId);

    return (
      <ul>
        {items.map(({ id, label }, index) => {
          if (index === currentStep) {
            return (
              <ProgressStep
                status="current"
                key={id}
                label={label}
                showLabel={showLabels}
                stepWidth={stepWidth}
              />
            );
          }
          if (index < currentStep) {
            return (
              <ProgressStep
                status="complete"
                key={id}
                label={label}
                showLabel={showLabels}
                onClick={() => onClickItem(id)}
                stepWidth={stepWidth}
              />
            );
          }
          if (index > currentStep) {
            return (
              <ProgressStep
                status="incomplete"
                key={id}
                label={label}
                showLabel={showLabels}
                onClick={() => onClickItem(id)}
                stepWidth={stepWidth}
              />
            );
          }
          return null;
        })}
      </ul>
    );
  };
}

ProgressIndicator.displayName = 'ProgressIndicator';

export default ProgressIndicator;
