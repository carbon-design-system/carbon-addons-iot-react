import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Close } from "@carbon/react/icons";

import PageTitleBar from '../../PageTitleBar/PageTitleBar';
import Button from '../../Button/Button';
import ProgressIndicator from '../../ProgressIndicator/ProgressIndicator';
import { settings } from '../../../constants/Settings';

const { prefix, iotPrefix } = settings;

class WizardHeader extends Component {
  static propTypes = {
    /** Title in the header  */
    title: PropTypes.string,
    description: PropTypes.string,
    blurb: PropTypes.string,
    onClose: PropTypes.func,
    closeButtonTitle: PropTypes.string,
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
    testId: PropTypes.string,
  };

  static defaultProps = {
    title: null,
    blurb: null,
    description: null,
    showLabels: true,
    stepWidth: 136,
    onClose: null,
    closeButtonTitle: 'Close',
    isClickable: false,
    testId: 'wizard-header',
  };

  state = {};

  render = () => {
    const {
      currentItemId,
      setItem,
      items,
      showLabels,
      stepWidth,
      title,
      blurb,
      description,
      onClose,
      closeButtonTitle,
      isClickable,
      testId,
    } = this.props;

    const closeButton = (
      <Button
        className={`${prefix}--modal-close`}
        title={closeButtonTitle}
        type="button"
        // TODO: pass testId in v3 to override defaults
        // testId={`${testId}-close-button`}
      >
        <Close size={20} onClick={onClose} />
      </Button>
    );

    return (
      <Fragment>
        <PageTitleBar
          className={`${iotPrefix}--wizard-inline__header`}
          title={title}
          description={blurb || description}
          extraContent={onClose ? closeButton : null}
          testId={`${testId}-page-title-bar`}
        />
        <ProgressIndicator
          className={`${iotPrefix}--wizard-inline__progress-indicator`}
          currentItemId={currentItemId}
          items={items.map((item) => ({ id: item.id, label: item.name }))}
          showLabels={showLabels}
          onClickItem={setItem}
          stepWidth={stepWidth}
          isClickable={isClickable}
          // TODO: pass testId in v3 to override defaults
          // testId={`${testId}-progress-indicator`}
        />
      </Fragment>
    );
  };
}

export default WizardHeader;
