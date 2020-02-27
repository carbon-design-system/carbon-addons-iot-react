import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PageWizard, { childrenPropType } from './PageWizard';

const StatefulPageWizardPropTypes = {
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
  setStep: PropTypes.func.isRequired,
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
  /** Content to render before footer buttons (on left side, in LTR) */
  beforeFooterContent: PropTypes.node,
};

const defaultProps = {
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
  beforeFooterContent: null,
};

const StatefulPageWizard = ({
  currentStepId: currentStepIdProp,
  children,
  onNext,
  onBack,
  setStep,
  ...other
}) => {
  const steps = React.Children.map(children, step => step.props);
  const [currentStepId, setCurrentStepId] = useState(currentStepIdProp || (steps && steps[0].id));
  const currentStepIndex = steps.findIndex(i => i.id === currentStepId);
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : undefined;
  const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : undefined;
  const handleNext = id => {
    setCurrentStepId(id);
    if (onNext) onNext(id);
  };
  const handleBack = id => {
    setCurrentStepId(id);
    if (onBack) onBack(id);
  };

  return (
    <PageWizard
      {...other}
      onBack={() => handleBack(prevStep.id)}
      onNext={() => handleNext(nextStep.id)}
      currentStepId={currentStepId}
      setStep={id => {
        setCurrentStepId(id);
        setStep(id);
      }}
    >
      {children}
    </PageWizard>
  );
};

StatefulPageWizard.propTypes = StatefulPageWizardPropTypes;
StatefulPageWizard.defaultProps = defaultProps;
export default StatefulPageWizard;
