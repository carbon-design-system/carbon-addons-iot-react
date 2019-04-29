import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'carbon-components-react';

const StyledDivWizardHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #dadada8c;
`;

const StyledDivHeading = styled.h2`
  padding-left: 80px;
  font-size: 28px;
  line-height: 50px;
  vertical-align: middle;
`;

const StyledButton = styled.div`
  margin-left: auto;
  margin-right: 12px;
  line-height: 56px;

  .bx--btn__icon {
    margin-left: 5px;
    margin-right: 5px;
  }
`;

class WizardHeader extends Component {
  static propTypes = {
    /** Title in the header  */
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    blurb: null,
  };

  state = {};

  render = () => {
    const { title, onClose, className } = this.props;

    return (
      <StyledDivWizardHeader className={className}>
        <StyledDivHeading>{title}</StyledDivHeading>
        <StyledButton>
          <Button kind="ghost" icon="close" small onClick={() => onClose()} />
        </StyledButton>
      </StyledDivWizardHeader>
    );
  };
}

export default WizardHeader;
