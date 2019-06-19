import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProgressIndicator from '../../ProgressIndicator/ProgressIndicator';
import PageHeader from '../../Page/PageHeader';

class WizardHeader extends Component {
  static propTypes = {
    /** Title in the header  */
    title: PropTypes.string.isRequired,
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
    blurb: null,
    showLabels: true,
    stepWidth: 136,
  };

  state = {};

  render = () => {
    const { currentItemId, setItem, items, showLabels, stepWidth, ...others } = this.props;

    return (
      <PageHeader {...others}>
        <ProgressIndicator
          currentItemId={currentItemId}
          items={items.map(item => ({ id: item.id, label: item.name }))}
          showLabels={showLabels}
          onClickItem={setItem}
          stepWidth={stepWidth}
        />
      </PageHeader>
    );
  };
}

export default WizardHeader;
