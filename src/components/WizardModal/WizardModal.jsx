import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { Button } from 'carbon-components-react';

import BaseModal from '../BaseModal/BaseModal';
import ButtonEnhanced from '../ButtonEnhanced/ButtonEnhanced';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';

const StyledModal = styled(BaseModal)`
   {
    .bx--progress-step {
      max-width: 150px;
    }
    > div + div {
      padding-top: 1rem;
    }
  }
`;

const StyledWizardContent = styled.div`
   {
    padding-top: 1rem;
    padding-left: 1rem;
    padding-bottom: 7rem;
  }
`;

/**
 * Extends BaseModal to add wizard, refer to that component for common props
 */
class WizardModal extends Component {
  static propTypes = {
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
    footer: {
      leftContent: null,
      nextButtonLabel: 'Next',
      previousButtonLabel: 'Previous',
      submitButtonLabel: 'Submit',
      cancelButtonLabel: 'Cancel',
    },
  };

  state = { step: 0 };

  handleNext = () => {
    if (this.validateCurrentStep()) {
      this.setState(state => ({ step: state.step + 1 }));
    }
  };

  handlePrevious = () => {
    this.setState(state => ({ step: state.step - 1 }));
  };

  handleClick = key => {
    this.setState({ step: key });
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

    const finalStep = step === steps.length - 1;

    return (
      <Fragment>
        {leftContent}
        <Button kind="secondary" onClick={onClose}>
          {cancelButtonLabel || defaultFooterProps.cancelButtonLabel}
        </Button>
        {step !== 0 ? (
          <Button kind="secondary" onClick={this.handlePrevious}>
            {previousButtonLabel || defaultFooterProps.previousButtonLabel}
          </Button>
        ) : null}
        {!finalStep ? (
          <Button kind="primary" onClick={this.handleNext}>
            {nextButtonLabel || defaultFooterProps.nextButtonLabel}
          </Button>
        ) : (
          <ButtonEnhanced
            kind="primary"
            onClick={this.handleSubmit}
            loading={
              (typeof sendingData === 'boolean' && sendingData) || typeof sendingData === 'string'
            }>
            {submitButtonLabel || defaultFooterProps.submitButtonLabel}
          </ButtonEnhanced>
        )}
      </Fragment>
    );
  };

  render() {
    const { steps, className, ...other } = this.props;
    // Transform object to be what Progress Indicator expects
    const items = steps.map((step, index) => ({ id: index, label: step.label }));
    const { step: stepIndex } = this.state;
    return (
      <StyledModal {...other} className={className} footer={this.renderFooter()}>
        <ProgressIndicator
          items={items}
          currentItemId={!isNil(stepIndex) ? items[stepIndex] && items[stepIndex].id : undefined}
          onClickItem={this.handleClick}
        />
        <StyledWizardContent>{steps[stepIndex].content}</StyledWizardContent>
      </StyledModal>
    );
  }
}

export default WizardModal;
