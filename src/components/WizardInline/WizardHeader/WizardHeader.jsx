import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import ProgressIndicator from '../../ProgressIndicator/ProgressIndicator';

class WizardHeader extends Component {
  static propTypes = {
    /** Title in the header  */
    title: PropTypes.string,
    blurb: PropTypes.string,
    currentItemId: PropTypes.string.isRequired,
    setItem: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        component: PropTypes.element.isRequired,
      })
    ).isRequired,
    showLabels: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    stepWidth: PropTypes.number,
  };

  static defaultProps = {
    title: null,
    blurb: null,
    showLabels: true,
    stepWidth: 136,
  };

  state = {};

  render = () => {
    const { currentItemId, setItem, items, showLabels, stepWidth, title, ...others } = this.props;

    return (
      <Fragment>
        <h2 className="wizard-inline-header" {...others}>
          {title}
        </h2>
        <ProgressIndicator
          className="wizard-inline-progress-indicator"
          currentItemId={currentItemId}
          items={items.map(item => ({ id: item.id, label: item.name }))}
          showLabels={showLabels}
          onClickItem={setItem}
          stepWidth={stepWidth}
        />
      </Fragment>
    );
  };
}

export default WizardHeader;
