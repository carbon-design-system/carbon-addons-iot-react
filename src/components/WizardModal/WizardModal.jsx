import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';

import ComposedModal from '../ComposedModal/ComposedModal';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
import WizardFooter from '../WizardInline/WizardFooter/WizardFooter';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

/**
 * Extends ComposedModal to add wizard, refer to that component for common props
 */
class WizardModal extends Component {
  static propTypes = {
    /**
     * Header to pass through to Modal
     */
    header: PropTypes.shape({
      label: PropTypes.string,
      title: PropTypes.string.isRequired,
      helpText: PropTypes.string,
    }).isRequired,
    /**
     * steps for the wizard to take you through
     *  label: the label of each step up in the progress bar,
     *  content: the wizard page content for each step
     *  onValidate: is the callback called to validate that we can leave this step
     */
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.node.isRequired,
        content: PropTypes.node.isRequired,
        onValidate: PropTypes.func,
      })
    ).isRequired,

    /** optionally pass in the current Step */
    currentStepIndex: PropTypes.number,

    /** Make the progress indicator clickable */
    isClickable: PropTypes.bool,

    /** callback when dialog is submitted */
    onSubmit: PropTypes.func.isRequired,

    /**
     * leftContent: Anything that will placed to the left of the buttons inside the footer
     * labels: Internationalized string labels for the buttons in the footer
     */
    footer: PropTypes.shape({
      leftContent: PropTypes.node,
      nextButtonLabel: PropTypes.node,
      previousButtonLabel: PropTypes.node,
      submitButtonLabel: PropTypes.node,
      cancelButtonLabel: PropTypes.node,
    }),
  };

  static defaultProps = {
    currentStepIndex: 0,
    isClickable: false,
    footer: {
      leftContent: null,
      nextButtonLabel: 'Next',
      previousButtonLabel: 'Previous',
      submitButtonLabel: 'Submit',
      cancelButtonLabel: 'Cancel',
    },
  };

  state = { step: this.props.currentStepIndex };

  handleNext = () => {
    if (this.validateCurrentStep()) {
      this.setState(state => ({ step: state.step + 1 }));
    }
  };

  handlePrevious = () => {
    this.setState(state => ({ step: state.step - 1 }));
  };

  handleClick = key => {
    const { step } = this.state;
    // If you're trying to go higher then validate

    if (key < step || this.validateCurrentStep()) {
      this.setState({ step: key });
    }
  };

  validateCurrentStep = () => {
    const { steps } = this.props;
    const { step } = this.state;
    const { onValidate } = steps[step];
    if (onValidate) {
      const isValid = onValidate();
      return isNil(isValid) || isValid;
    }
    return true;
  };

  handleSubmit = () => {
    const { onSubmit } = this.props; // eslint-disable-line react/prop-types
    if (this.validateCurrentStep()) {
      onSubmit();
    }
  };

  renderFooter = () => {
    const {
      onClose, // eslint-disable-line react/prop-types
      sendingData, // eslint-disable-line react/prop-types
      footer: {
        leftContent,
        submitButtonLabel,
        cancelButtonLabel,
        nextButtonLabel,
        previousButtonLabel,
      },
      steps,
    } = this.props;
    const { step } = this.state;
    const {
      defaultProps: { footer: defaultFooterProps },
    } = WizardModal;

    const hasNext = step !== steps.length - 1;
    const hasPrev = step !== 0;

    return (
      <WizardFooter
        hasPrev={hasPrev}
        hasNext={hasNext}
        onCancel={onClose}
        onBack={this.handlePrevious}
        onNext={this.handleNext}
        onSubmit={this.handleSubmit}
        footerLeftContent={leftContent}
        cancelLabel={cancelButtonLabel || defaultFooterProps.cancelButtonLabel}
        nextLabel={nextButtonLabel || defaultFooterProps.nextButtonLabel}
        backLabel={previousButtonLabel || defaultFooterProps.previousButtonLabel}
        submitLabel={submitButtonLabel || defaultFooterProps.submitButtonLabel}
        sendingData={
          (typeof sendingData === 'boolean' && sendingData) || typeof sendingData === 'string'
        }
        className={`${iotPrefix}--wizard-modal__footer`}
      />
    );
  };

  render() {
    const { steps, className, currentStepIndex, isClickable, ...other } = this.props;
    // Transform object to be what Progress Indicator expects
    const items = steps.map((step, index) => ({ id: index, label: step.label }));
    const { step: stepIndex } = this.state;
    return (
      <ComposedModal
        {...other}
        className={classnames(`${iotPrefix}--wizard-modal`, className)}
        footer={this.renderFooter()}
      >
        <ProgressIndicator
          items={items}
          currentItemId={!isNil(stepIndex) ? items[stepIndex] && items[stepIndex].id : null}
          setStep={this.handleClick}
          isClickable={isClickable}
        />
        <div className={`${iotPrefix}--wizard-modal__content`}>{steps[stepIndex].content}</div>
      </ComposedModal>
    );
  }
}

export default WizardModal;
