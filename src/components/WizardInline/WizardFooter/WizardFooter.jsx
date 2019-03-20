import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'carbon-components-react';
import styled from 'styled-components';

const StyledFooter = styled.div`
  display: flex;
  position: absolute;
  bottom: 0px;
  width: 100%;
  align-items: center;
  line-height: 40px;

  .bx--modal-footer {
    justify-content: space-between;
    padding: 1rem 3rem 1rem 40px;
    max-height: 72px;
    width: 100%;
  }
`;

const StyledFooterButtons = styled.div`
  display: flex;
  .bx--btn + .bx--btn {
    margin-left: 1rem;
  }
`;

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
};

const defaultProps = {
  footerLeftContent: null,
  nextDisabled: false,
  hasPrev: true,
  hasNext: true,
};

const WizardFooter = ({
  onNext,
  onBack,
  onSubmit,
  onCancel,
  cancelLabel,
  backLabel,
  nextLabel,
  submitLabel,
  hasPrev,
  hasNext,
  footerLeftContent,
  nextDisabled,
  className,
}) => (
  <StyledFooter className={className}>
    <div className="bx--modal-footer">
      <div>{footerLeftContent}</div>
      <StyledFooterButtons>
        <Button onClick={onCancel} kind="secondary">
          {cancelLabel}
        </Button>
        {hasPrev ? (
          <Button onClick={onBack} kind="secondary">
            {backLabel}
          </Button>
        ) : null}
        {hasNext ? (
          <Button onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        ) : (
          <Button onClick={onSubmit} disabled={nextDisabled}>
            {submitLabel}
          </Button>
        )}
      </StyledFooterButtons>
    </div>
  </StyledFooter>
);

WizardFooter.propTypes = propTypes;
WizardFooter.defaultProps = defaultProps;

export default WizardFooter;
