import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ProgressIndicator from '../../../ProgressIndicator/ProgressIndicator';
import WizardSidebar from '../../../WizardInline/WizardLeftSidebar/WizardSidebar';
import { settings } from '../../../../constants/Settings';

const { iotPrefix } = settings;

class DetailWizardSidebar extends Component {
  static propTypes = {
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
    stepWidth: PropTypes.number,
    isClickable: PropTypes.bool,
  };

  static defaultProps = {
    showLabels: true,
    stepWidth: 80,
    isClickable: false,
  };

  state = {};

  render = () => {
    const {
      currentItemId,
      setItem,
      items,
      showLabels,
      stepWidth,
      className,
      isClickable,
    } = this.props;

    const sideBarProgressIndicator = (
      <ProgressIndicator
        currentItemId={currentItemId}
        items={items.map((item) => ({ id: item.id, label: item.name }))}
        showLabels={showLabels}
        onClickItem={setItem}
        stepWidth={stepWidth}
        isVerticalMode
        isClickable={isClickable}
      />
    );
    return (
      <div className={classnames(className, `${iotPrefix}--table-detail-wizard-sidebar--header`)}>
        <WizardSidebar sidebar={sideBarProgressIndicator} width={250} />
      </div>
    );
  };
}

export default DetailWizardSidebar;
