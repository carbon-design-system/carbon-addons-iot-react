import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Close from '@carbon/icons-react/lib/close/20';

import ProgressIndicator from '../../ProgressIndicator/ProgressIndicator';

const StyledDivWizardHeader = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 1.5rem;
  padding: 1rem;

  .bx--progress {
    padding: 1rem 1rem;
  }

  .bx--modal-header {
    display: flex;
    margin-bottom: 0.5rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding-left: 0;
    width: 100%;
  }
`;

const StyledDivHeading = styled.div`
  min-width: 200px;
  padding-right: 3rem;
`;

class WizardHeader extends Component {
  static propTypes = {
    /** Title in the header  */
    title: PropTypes.string.isRequired,
    blurb: PropTypes.string,
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
    onClose: PropTypes.func.isRequired,
    stepWidth: PropTypes.number,
  };

  static defaultProps = {
    blurb: null,
    showLabels: true,
    stepWidth: 136,
  };

  state = {};

  render = () => {
    const {
      title,
      blurb,
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
            onClick={onClose}
          >
            <Close className="bx--modal-close__icon" />
          </button>
        </div>
        {blurb ? <div>{blurb}</div> : null}
      </StyledDivWizardHeader>
    );
  };
}

export default WizardHeader;
