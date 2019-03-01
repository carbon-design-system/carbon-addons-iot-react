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
`;

const propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  backLabel: PropTypes.node,
  nextLabel: PropTypes.node,
  footerLeftContent: PropTypes.node,
  nextDisabled: PropTypes.bool,
};

const defaultProps = {
  backLabel: 'Back',
  nextLabel: 'Next',
  footerLeftContent: null,
  nextDisabled: false,
};

const WizardFooter = ({
  onNext,
  onBack,
  backLabel,
  nextLabel,
  footerLeftContent,
  nextDisabled,
  className,
}) => (
  <StyledFooter className={className}>
    <div className="bx--modal-footer">
      <div>{footerLeftContent}</div>
      <StyledFooterButtons>
        <Button onClick={onBack} kind="secondary">
          {backLabel}
        </Button>
        <Button onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
      </StyledFooterButtons>
    </div>
  </StyledFooter>
);

WizardFooter.propTypes = propTypes;
WizardFooter.defaultProps = defaultProps;

export default WizardFooter;
