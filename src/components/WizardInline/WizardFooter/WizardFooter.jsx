import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'carbon-components-react';
import styled from 'styled-components';

import ButtonEnhanced from '../../ButtonEnhanced/ButtonEnhanced';

const StyledFooterButtons = styled.div`
  display: flex;
  * + * {
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
  sendingData: PropTypes.bool,
};

const defaultProps = {
  footerLeftContent: null,
  nextDisabled: false,
  hasPrev: true,
  hasNext: true,
  sendingData: false,
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
  sendingData,
}) => (
  <Fragment>
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
        <ButtonEnhanced onClick={onSubmit} disabled={nextDisabled} loading={sendingData}>
          {submitLabel}
        </ButtonEnhanced>
      )}
    </StyledFooterButtons>
  </Fragment>
);

WizardFooter.propTypes = propTypes;
WizardFooter.defaultProps = defaultProps;

export default WizardFooter;
