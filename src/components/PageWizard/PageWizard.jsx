import React from 'react';
import PropTypes from 'prop-types';
import { ProgressIndicator, ProgressStep } from 'carbon-components-react';
import classNames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix, prefix: carbonPrefix } = settings;

export const childrenPropType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

export const PageWizardPropTypes = {
  children: childrenPropType,
  /** Id of current step */
  currentStepId: PropTypes.string,
  /** action when click next button called with no param */
  onNext: PropTypes.func,
  /** action when click back button called with no param */
  onBack: PropTypes.func,
  /** action if the inline wizard is closed or canceled */
  onClose: PropTypes.func.isRequired,
  /** action triggered if the inline wizard has submitted final step */
  onSubmit: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    /** label to show on the cancel button */
    cancel: PropTypes.string,
    /** label to show on the back button */
    back: PropTypes.string,
    /** label to show on the next button */
    next: PropTypes.string,
    /** label to show on the submit button */
    submit: PropTypes.string,
    /** label to show on the close notification button */
    close: PropTypes.string,
  }),
  /** function to go to step when click ProgressIndicator step. */
  setStep: PropTypes.func,
  /** next button disabled */
  nextDisabled: PropTypes.bool,
  /** show progress indicator on finish button */
  sendingData: PropTypes.bool,
  /** Form Error Details */
  error: PropTypes.string,
  /** required callback to clear the error */
  onClearError: PropTypes.func.isRequired,
  /** use sticky footer to show buttons at the bottom */
  hasStickyFooter: PropTypes.bool,
  /** Displays the progress indicator vertically */
  isProgressIndicatorVertical: PropTypes.bool,
};

export const defaultProps = {
  children: [],
  nextDisabled: false,
  currentStepId: null,
  i18n: {
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    submit: 'Submit',
    close: 'Close',
  },
  sendingData: false,
  error: null,
  hasStickyFooter: false,
  isProgressIndicatorVertical: true,
  onNext: null,
  onBack: null,
  setStep: null,
};

const PageWizard = ({
  children: ch,
  currentStepId,
  onNext,
  onBack,
  setStep,
  onSubmit,
  onClose,
  i18n,
  nextDisabled,
  sendingData,
  className,
  error,
  hasStickyFooter,
  onClearError,
  isProgressIndicatorVertical,
}) => {
  const children = ch.length ? ch : [ch];
  const steps = React.Children.map(children, step => step.props);
  const currentStepIdx = steps.findIndex(i => i.id === currentStepId);
  const hasPrev = currentStepIdx !== 0;
  const hasNext = currentStepIdx !== steps.length - 1;
  const currentStep = children.find((i, idx) => idx === currentStepIdx);
  const currentStepToRender = React.cloneElement(currentStep, {
    hasPrev,
    hasNext,
    onNext,
    onBack,
    onSubmit,
    onClose,
    i18n,
    nextDisabled,
    sendingData,
    error,
    hasStickyFooter,
    onClearError,
  });

  return (
    <div
      className={classNames(
        isProgressIndicatorVertical ? `${iotPrefix}--page-wizard` : null,
        className,
        hasStickyFooter ? `${iotPrefix}--page-wizard__sticky` : null
      )}
    >
      {steps.length > 1 ? (
        <div
          className={
            isProgressIndicatorVertical
              ? `${iotPrefix}--page-wizard--progress--vertical`
              : `${iotPrefix}--page-wizard--progress--horizontal`
          }
        >
          <ProgressIndicator
            className={isProgressIndicatorVertical ? `${carbonPrefix}--progress--vertical` : null}
            currentIndex={currentStepIdx}
            onChange={idx => setStep(steps[idx].id)}
          >
            {steps.map((step, idx) => (
              <ProgressStep key={idx} description={step.description} label={step.label} />
            ))}
          </ProgressIndicator>
        </div>
      ) : null}
      <div className={`${iotPrefix}--page-wizard--content`}>{currentStepToRender}</div>
    </div>
  );
};

PageWizard.propTypes = PageWizardPropTypes;
PageWizard.defaultProps = defaultProps;

export default PageWizard;
