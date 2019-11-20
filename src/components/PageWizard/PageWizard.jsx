import React from 'react';
import PropTypes from 'prop-types';
import { InlineNotification, ProgressIndicator, ProgressStep } from 'carbon-components-react';

import Button from '../Button/Button';

const childrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

/* TODO: move these components to separate files */
const PageWizardStep = ({ children, onValidate = () => true, ...other }) => (
  <div className="page-wizard--step">
    {other.error ? (
      <InlineNotification
        title={other.error}
        subtitle=""
        kind="error"
        onCloseButtonClick={other.handleClearError}
      />
    ) : null}
    {children}
    <div
      className={
        other.hasStickyFooter
          ? 'page-wizard--content--actions--sticky'
          : 'page-wizard--content--actions'
      }
    >
      {!other.hasPrev ? (
        <Button onClick={other.onClose} kind="secondary">
          {other.i18n.cancel}
        </Button>
      ) : null}
      {other.hasPrev ? (
        <Button onClick={other.onBack} kind="secondary">
          {other.i18n.back}
        </Button>
      ) : null}
      {other.hasNext ? (
        <Button onClick={() => onValidate() && other.onNext()} disabled={other.nextDisabled}>
          {other.i18n.next}
        </Button>
      ) : (
        <Button
          onClick={() => onValidate() && other.onSubmit()}
          disabled={other.nextDisabled}
          loading={other.sendingData}
        >
          {other.i18n.submit}
        </Button>
      )}
    </div>
  </div>
);
PageWizardStep.propTypes = {
  id: PropTypes.string.isRequired, // eslint-disable-line
  onValidate: PropTypes.func, // eslint-disable-line
  children: childrenPropType,
};
PageWizardStep.defaultProps = { children: [] };

const PageWizardStepTitle = ({ children }) => (
  <div className="page-wizard--step--title">{children}</div>
);
PageWizardStepTitle.propTypes = { children: childrenPropType };
PageWizardStepTitle.defaultProps = { children: [] };

const PageWizardStepDescription = ({ children }) => (
  <div className="page-wizard--step--description">{children}</div>
);
PageWizardStepDescription.propTypes = { children: childrenPropType };
PageWizardStepDescription.defaultProps = { children: [] };

const PageWizardStepContent = ({ children }) => (
  <div className="page-wizard--step--content">{children}</div>
);
PageWizardStepContent.propTypes = { children: childrenPropType };
PageWizardStepContent.defaultProps = { children: [] };

const PageWizardStepExtraContent = ({ children }) => (
  <div className="page-wizard--step--extra-content">{children}</div>
);
PageWizardStepExtraContent.propTypes = { children: childrenPropType };
PageWizardStepExtraContent.defaultProps = { children: [] };

export const propTypes = {
  children: childrenPropType,
  /** Id of current step */
  currentStepId: PropTypes.string,
  /** action when click next button called with no param */
  onNext: PropTypes.func,
  /** action when click back button called with no param */
  onBack: PropTypes.func,
  /** action if the inline wizard is closed or canceled */
  onClose: PropTypes.func,
  /** action triggered if the inline wizard has submitted final step */
  onSubmit: PropTypes.func,
  i18n: PropTypes.shape({
    /** label to show on the cancel button */
    cancel: PropTypes.string,
    /** label to show on the back button */
    back: PropTypes.string,
    /** label to show on the next button */
    next: PropTypes.string,
    /** label to show on the submit button */
    submit: PropTypes.string,
  }),
  /** label to show on the cancel button */
  /** function to go to step when click ProgressIndicator step. */
  setStep: PropTypes.func,
  /** next button disabled */
  nextDisabled: PropTypes.bool,
  /** show progress indicator on finish button */
  sendingData: PropTypes.bool,

  /** Form Error Details */
  error: PropTypes.string,

  /** use sticky footer to show buttons at the bottom */
  hasStickyFooter: PropTypes.bool,
};

export const defaultProps = {
  children: [],
  nextDisabled: false,
  currentStepId: null,
  onNext: null,
  onBack: null,
  setStep: null,
  onClose: null,
  onSubmit: null,
  i18n: {
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    submit: 'Submit',
  },
  sendingData: false,
  error: null,
  hasStickyFooter: false,
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
  });

  return (
    <div
      className={['page-wizard', className, hasStickyFooter ? 'page-wizard__sticky' : ''].join(' ')}
    >
      {steps.length > 1 ? (
        <div className="page-wizard--progress">
          <ProgressIndicator
            className="bx--progress--vertical"
            currentIndex={currentStepIdx}
            onChange={idx => setStep(steps[idx].id)}
          >
            {steps.map((i, idx) => (
              <ProgressStep key={idx} description={i.description} label={i.label} />
            ))}
          </ProgressIndicator>
        </div>
      ) : null}
      <div className="page-wizard--content">{currentStepToRender}</div>
    </div>
  );
};

PageWizard.propTypes = propTypes;
PageWizard.defaultProps = defaultProps;
export {
  PageWizard,
  PageWizardStep,
  PageWizardStepTitle,
  PageWizardStepDescription,
  PageWizardStepContent,
  PageWizardStepExtraContent,
};
