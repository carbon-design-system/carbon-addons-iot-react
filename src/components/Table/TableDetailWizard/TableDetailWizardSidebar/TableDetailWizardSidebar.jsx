import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ProgressIndicator from '../../../ProgressIndicator/ProgressIndicator';
import WizardSidebar from '../../../WizardInline/WizardLeftSidebar/WizardSidebar';

const StyledDivWizardHeader = styled.div`
  display: flex;
  flex-flow: column nowrap;
  border-right: 1px solid #dadada8c;

  .bx--progress {
    padding: 30px 50px 0px 80px;
  }
`;

class DetailWizardSidebar extends Component {
  static propTypes = {
    currentItemId: PropTypes.string.isRequired,
    setItem: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        component: PropTypes.element.isRequired,
      })
    ).isRequired,
    showLabels: PropTypes.bool,
    stepWidth: PropTypes.number,
  };

  static defaultProps = {
    showLabels: true,
    stepWidth: 80,
  };

  state = {};

  render = () => {
    const { currentItemId, setItem, items, showLabels, stepWidth, className } = this.props;

    const sideBarProgressIndicator = (
      <ProgressIndicator
        currentItemId={currentItemId}
        items={items.map(item => ({ id: item.id, label: item.name }))}
        showLabels={showLabels}
        onClickItem={setItem}
        stepWidth={stepWidth}
        isVerticalMode
      />
    );
    return (
      <StyledDivWizardHeader className={className}>
        <WizardSidebar sidebar={sideBarProgressIndicator} width={250} />
      </StyledDivWizardHeader>
    );
  };
}

export default DetailWizardSidebar;
