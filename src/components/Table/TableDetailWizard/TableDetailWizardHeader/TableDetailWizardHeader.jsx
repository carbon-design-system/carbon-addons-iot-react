import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'carbon-components-react';
import Close from '@carbon/icons-react/lib/close/20';

const StyledDivWizardHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #dadada8c;
`;

const StyledDivHeading = styled.h2`
  padding-left: 80px;
  font-size: 1.25rem;
  line-height: 50px;
  vertical-align: middle;
`;

const StyledButton = styled.div`
  margin-left: auto;

  .bx--btn__icon {
    margin-left: 5px;
    margin-right: 5px;
  }
`;

const TableDetailWizardHeader = ({ title, onClose, className }) => (
  <StyledDivWizardHeader className={className}>
    <StyledDivHeading>{title}</StyledDivHeading>
    <StyledButton>
      <Button
        kind="ghost"
        renderIcon={() => <Close />}
        iconDescription={title}
        onClick={() => onClose()}
      />
    </StyledButton>
  </StyledDivWizardHeader>
);

TableDetailWizardHeader.propTypes = {
  /** Title in the header  */
  title: PropTypes.string.isRequired,
  /** Close button callback  */
  onClose: PropTypes.func.isRequired,
};

export default TableDetailWizardHeader;
