import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import WizardHeader from './WizardHeader/WizardHeader';
import WizardFooter from './WizardFooter/WizardFooter';
import WizardSidebar from './WizardLeftSidebar/WizardSidebar';
import WizardContent from './WizardContent/WizardContent';

const StyledWizardWrapper = styled.div`
  .bx--modal-content {
    margin-bottom: 48px;
    max-height: 80vh;
    overflow: auto;
  }
  .bx--modal-container {
    min-width: 630px;
    max-width: 100%;
    margin-top: 24px;
    padding-top: 32px;
    padding-bottom: 72px;
  }
`;

const StyledWizardContainer = styled.div`
  display: flex;
`;

class WizardInline extends Component {
  static propTypes = {
    /** Title in the header */
    title: PropTypes.string.isRequired,
    /** Id of current step */
    currentItemId: PropTypes.string.isRequired,
    /** Array of items representing pages of wizard. Must contain id, name, component. Optional: backLabel, nextLabel, nextDisabled */
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        backLabel: PropTypes.string,
        nextLabel: PropTypes.string,
        component: PropTypes.element.isRequired,
      })
    ).isRequired,
    /** action when click next button */
    onNext: PropTypes.func.isRequired,
    /** action when click back button */
    onBack: PropTypes.func.isRequired,
    /** component to show in sidebar */
    sidebar: PropTypes.element,
    /** component to show in footer. Passed to Sidebar */
    footerLeftContent: PropTypes.element,
    /** function to go to item when click ProgressIndicator items. Passed to Footer */
    setItem: PropTypes.func.isRequired,
    /** show labels in Progress Indicator. Passed to Header */
    showLabels: PropTypes.bool,
    /** action when click X in top right. Passed to Header */
    onClose: PropTypes.func.isRequired,
    /** next button disabled */
    nextDisabled: PropTypes.bool,
    /** width of each step in px.  Circle is 24px. Passed to Header */
    stepWidth: PropTypes.number,
  };

  static defaultProps = {
    sidebar: null,
    footerLeftContent: null,
    showLabels: true,
    nextDisabled: false,
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
      items,
      onNext,
      onBack,
      sidebar,
      footerLeftContent,
      setItem,
      showLabels,
      onClose,
      nextDisabled,
      stepWidth,
      className,
    } = this.props;

    const currentItemObj = items.find(({ id }) => currentItemId === id);

    return (
      <StyledWizardWrapper className={className}>
        <div className="bx--modal-container">
          <WizardHeader
            title={title}
            currentItemId={currentItemId}
            setItem={setItem}
            items={items}
            showLabels={showLabels}
            onClose={onClose}
            stepWidth={stepWidth}
          />

          <StyledWizardContainer>
            <WizardSidebar sidebar={sidebar} />

            <div className="bx--modal-content">
              <WizardContent component={currentItemObj.component} />
            </div>
          </StyledWizardContainer>
          <WizardFooter
            backLabel={currentItemObj.backLabel}
            nextLabel={currentItemObj.nextLabel}
            onNext={onNext}
            onBack={onBack}
            footerLeftContent={footerLeftContent}
            nextDisabled={nextDisabled || false}
          />
        </div>
      </StyledWizardWrapper>
    );
  };
}

export default WizardInline;
