import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from '../../Button/Button';
import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  backLabel: PropTypes.node.isRequired,
  nextLabel: PropTypes.node.isRequired,
  cancelLabel: PropTypes.node.isRequired,
  submitLabel: PropTypes.node.isRequired,
  hasPrev: PropTypes.bool,
  hasNext: PropTypes.bool,
  footerLeftContent: PropTypes.node,
  nextDisabled: PropTypes.bool,
  sendingData: PropTypes.bool,
  testId: PropTypes.string,
};

const defaultProps = {
  footerLeftContent: null,
  nextDisabled: false,
  hasPrev: true,
  hasNext: true,
  sendingData: false,
  testId: 'wizard-footer',
};

const WizardFooter = ({
  onNext,
  onBack,
  onSubmit,
  className,
  onCancel,
  cancelLabel,
  backLabel,
  nextLabel,
  submitLabel,
  hasPrev,
  hasNext,
  footerLeftContent,
  nextDisabled,
  sendingData,
  testId,
}) => (
  <Fragment>
    {footerLeftContent && (
      <div className="WizardInline-custom-footer-content">{footerLeftContent}</div>
    )}
    <div
      data-testid={testId}
      className={classnames(className, `${iotPrefix}--wizard-footer__buttons`)}
    >
      {!hasPrev ? (
        <Button
          onClick={onCancel}
          kind="secondary"
          // TODO: pass testId in v3 to override defaults
          // testId={`${testId}-cancel-button`}
        >
          {cancelLabel}
        </Button>
      ) : null}
      {hasPrev ? (
        <Button
          onClick={onBack}
          kind="secondary"
          // TODO: pass testId in v3 to override defaults
          // testId={`${testId}-previous-button`}
        >
          {backLabel}
        </Button>
      ) : null}
      {hasNext ? (
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          // TODO: pass testId in v3 to override defaults
          // testId={`${testId}-next-button`}
        >
          {nextLabel}
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={nextDisabled}
          loading={sendingData}
          // TODO: pass testId in v3 to override defaults
          // testId={`${testId}-submit-button`}
        >
          {submitLabel}
        </Button>
      )}
    </div>
  </Fragment>
);

WizardFooter.propTypes = propTypes;
WizardFooter.defaultProps = defaultProps;

export default WizardFooter;
