import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ProgressIndicator as CarbonProgressIndicator } from 'carbon-components-react';

import ProgressStep from './ProgressStep';

const IDPropTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
class ProgressIndicator extends Component {
  /* Display name */
  static displayName = 'ProgressIndicator';

  static propTypes = {
    /** array of item objects with id and labels */
    items: PropTypes.arrayOf(
      PropTypes.shape({ id: IDPropTypes, label: PropTypes.string.isRequired })
    ).isRequired,
    /** id of current step */
    currentItemId: IDPropTypes,
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
    currentItemId: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const { items, showLabels, onClickItem, currentItemId, stepWidth } = this.props;

    const currentStep = items.findIndex(item => item.id === currentItemId);

    return (
      <CarbonProgressIndicator currentIndex={currentStep}>
        {items.map(({ id, label }) => (
          <ProgressStep
            key={id}
            label={label}
            description={label}
            showLabel={showLabels}
            onClick={() => onClickItem(id)}
            stepWidth={stepWidth}
          />
        ))}
      </CarbonProgressIndicator>
    );
  };
}

ProgressIndicator.displayName = 'ProgressIndicator';

export default ProgressIndicator;
