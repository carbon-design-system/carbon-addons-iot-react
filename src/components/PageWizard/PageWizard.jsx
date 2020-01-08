import React from 'react';
import PropTypes from 'prop-types';
import { ProgressIndicator } from 'carbon-components-react';

import { InlineNotification } from '../Notification';
import Button from '../Button/Button';
import { ProgressStep } from '../ProgressIndicator';

const childrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

/* TODO: move these components to separate files */
const PageWizardStep = ({
  children,
  onValidate,
  error,
  onClearError,
  i18n,
  hasStickyFooter,
  onClose,
  hasPrev,
  hasNext,
  onNext,
  nextDisabled,
  onBack,
  sendingData,
  onSubmit,
}) => (
  <div className="page-wizard--step">
    {error ? (
      <InlineNotification
        lowContrast
        title={error}
        subtitle=""
        kind="error"
        onCloseButtonClick={onClearError}
        iconDescription={i18n.close}
      />
    ) : null}
    {children}
    <div
      className={
        hasStickyFooter ? 'page-wizard--content--actions--sticky' : 'page-wizard--content--actions'
      }
    >
      {!hasPrev ? (
        <Button onClick={onClose} kind="secondary">
          {i18n.cancel}
        </Button>
      ) : null}
      {hasPrev ? (
        <Button onClick={onBack} kind="secondary">
          {i18n.back}
        </Button>
      ) : null}
      {hasNext ? (
        <Button onClick={() => onValidate() && onNext()} disabled={nextDisabled}>
          {i18n.next}
        </Button>
      ) : (
        <Button
          onClick={() => onValidate() && onSubmit()}
          disabled={nextDisabled}
          loading={sendingData}
        >
          {i18n.submit}
        </Button>
      )}
    </div>
  </div>
);
PageWizardStep.propTypes = {
  id: PropTypes.string.isRequired, // eslint-disable-line
  onValidate: PropTypes.func, // eslint-disable-line
  children: childrenPropType,
  /** optional error to show for this step */
  error: PropTypes.node,
  /** optional callback to clear the error */
  onClearError: PropTypes.func,
  /** Internationalized strings */
  i18n: PropTypes.objectOf(PropTypes.string).isRequired,
  hasStickyFooter: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  hasPrev: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
  nextDisabled: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  sendingData: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
PageWizardStep.defaultProps = {
  children: [],
  error: null,
  onClearError: null,
  onValidate: () => true,
  hasStickyFooter: false,
  nextDisabled: false,
  sendingData: false,
};

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
    /** label to show on the close notification button */
    close: PropTypes.string,
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
  /** required callback to clear the error */
  onClearError: PropTypes.func.isRequired,

  /** use sticky footer to show buttons at the bottom */
  hasStickyFooter: PropTypes.bool,
};

export const defaultProps = {
  children: [],
  nextDisabled: false,
  currentStepId: null,
  onNext: () => {},
  onBack: () => {},
  setStep: () => {},
  onClose: () => {},
  onSubmit: () => {},
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
