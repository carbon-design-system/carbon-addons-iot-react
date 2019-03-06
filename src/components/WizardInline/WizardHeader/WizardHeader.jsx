import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ProgressIndicator from '../../ProgressIndicator/ProgressIndicator';

const StyledDivWizardHeader = styled.div`
  .bx--modal-header {
    display: flex;
  }
`;

const StyledDivHeading = styled.div`
  min-width: 200px;
`;

class WizardHeader extends Component {
  static propTypes = {
    /** Title in the header  */
    title: PropTypes.string.isRequired,
    currentItemId: PropTypes.string.isRequired,
    setItem: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        backLabel: PropTypes.string,
        nextLabel: PropTypes.string,
        component: PropTypes.element.isRequired,
      })
    ).isRequired,
    showLabels: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    stepWidth: PropTypes.number,
  };

  static defaultProps = {
    showLabels: true,
    stepWidth: 136,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const {
      title,
      currentItemId,
      setItem,
      items,
      showLabels,
      onClose,
      stepWidth,
      className,
    } = this.props;

    return (
      <StyledDivWizardHeader className={className}>
        <div className="bx--modal-header">
          <StyledDivHeading>
            <p className="bx--modal-header__heading bx--type-beta">{title}</p>
          </StyledDivHeading>
          <ProgressIndicator
            currentItemId={currentItemId}
            items={items.map(item => ({ id: item.id, label: item.name }))}
            showLabels={showLabels}
            onClickItem={setItem}
            stepWidth={stepWidth}
          />

          <button
            className="bx--modal-close"
            type="button"
            data-modal-close
            aria-label="close modal"
            onClick={onClose}>
            <svg
              className="bx--modal-close__icon"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              xmlns="http://www.w3.org/2000/svg">
              <title>Close</title>
              <path
                d="M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z"
                fillRule="nonzero"
              />
            </svg>
          </button>
        </div>
      </StyledDivWizardHeader>
    );
  };
}

export default WizardHeader;
