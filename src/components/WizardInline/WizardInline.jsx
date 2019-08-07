import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InlineNotification } from 'carbon-components-react';

import WizardHeader from './WizardHeader/WizardHeader';
import WizardFooter from './WizardFooter/WizardFooter';
import WizardSidebar from './WizardLeftSidebar/WizardSidebar';
import WizardContent from './WizardContent/WizardContent';

const StyledWizardWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;

  .bx--modal-content[data-id='WizardInlineContent'] {
    padding: 0rem 1rem;
    margin-bottom: 48px;
    max-height: 80vh;
    overflow: auto;
    width: 100%;
  }

  .bx--modal-container[data-id='WizardInlineContainer'] {
    min-width: 630px;
    max-width: 90%;
    width: 90%;
    margin-top: 24px;
    padding-top: 32px;
    padding-bottom: 72px;
  }
`;

const StyledWizardContainer = styled.div`
  display: flex;
`;

const StyledMessageBox = styled(InlineNotification)`
   {
    width: 100%;
  }
`;

const StyledFooter = styled.div`
  display: flex;
  position: absolute;
  bottom: 0px;
  width: 100%;
  align-items: center;
  line-height: 40px;

  .bx--modal-footer[data-id='WizardInlineFooter'] {
    justify-content: space-between;
    padding: 1rem 3rem 1rem 40px;
    max-height: 72px;
    width: 100%;
  }
`;

export const propTypes = {
  /** Title in the header */
  title: PropTypes.string.isRequired,
  blurb: PropTypes.string,
  /** Id of current step */
  currentItemId: PropTypes.string,
  /** Array of items representing pages of wizard. Must contain id, name, component. Optional: backLabel, nextLabel, nextDisabled */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      component: PropTypes.node.isRequired,
      /** if you return false the onNext or setItem functions will not be called to change the current step */
      onValidate: PropTypes.func,
    })
  ).isRequired,
  /** action when click next button called with no param */
  onNext: PropTypes.func,
  /** action when click back button called with no param */
  onBack: PropTypes.func,
  /** action if the inline wizard is closed or canceled */
  onClose: PropTypes.func,
  /** action triggered if the inline wizard has submitted final step */
  onSubmit: PropTypes.func,
  /** label to show on the cancel button */
  cancelLabel: PropTypes.node,
  /** label to show on the back button */
  backLabel: PropTypes.node,
  /** label to show on the next button */
  nextLabel: PropTypes.node,
  /** label to show on the submit button */
  submitLabel: PropTypes.node,
  /** optional component to show in sidebar */
  sidebar: PropTypes.element,
  /** component to show in footer on the left of the buttons */
  footerLeftContent: PropTypes.element,
  /** function to go to item when click ProgressIndicator items. */
  setItem: PropTypes.func,
  /** show labels in Progress Indicator */
  showLabels: PropTypes.bool,
  /** next button disabled */
  nextDisabled: PropTypes.bool,
  /** width of each step in px.  Circle is 24px. Passed to Header */
  stepWidth: PropTypes.number,
  /** is the wizard actively sending data should disable the button */
  sendingData: PropTypes.bool,

  /** Form Error Details */
  error: PropTypes.string,
  /**  Clear the currently shown error, triggered if the user closes the ErrorNotification */
  onClearError: PropTypes.func,
};

export const defaultProps = {
  sidebar: null,
  footerLeftContent: null,
  showLabels: true,
  nextDisabled: false,
  currentItemId: null,
  blurb: null,
  stepWidth: 136,
  onNext: null,
  onBack: null,
  setItem: null,
  onClose: null,
  onSubmit: null,
  backLabel: 'Back',
  nextLabel: 'Next',
  cancelLabel: 'Cancel',
  submitLabel: 'Add',
  sendingData: false,
  error: null,
  onClearError: null,
};

const WizardInline = ({
  title,
  blurb,
  currentItemId,
  items,
  onNext,
  onBack,
  sidebar,
  footerLeftContent,
  setItem,
  showLabels,
  backLabel,
  nextLabel,
  cancelLabel,
  submitLabel,
  onSubmit,
  onClose,
  nextDisabled,
  sendingData,
  stepWidth,
  className,
  error,
  onClearError,
}) => {
  const currentItemObj = items.find(({ id }) => currentItemId === id) || items[0];
  const currentItemIndex = items.findIndex(({ id }) => currentItemId === id);
  const hasNext = currentItemIndex !== items.length - 1;
  const hasPrev = currentItemIndex !== 0;

  const handleClearError = () => {
    if (onClearError) {
      onClearError();
    }
  };

  const isValid = callback => {
    if (currentItemObj && currentItemObj.onValidate) {
      if (currentItemObj.onValidate(currentItemId)) {
        callback();
      } else return;
    }
    callback();
  };

  return (
    <StyledWizardWrapper className={className}>
      <div data-id="WizardInlineContainer" className="bx--modal-container">
        <WizardHeader
          title={title}
          blurb={blurb}
          currentItemId={currentItemId}
          // only go if current step passes validation
          setItem={id => isValid(() => setItem(id))}
          items={items}
          showLabels={showLabels}
          onClose={onClose}
          stepWidth={stepWidth}
        />
        {error ? (
          <StyledMessageBox
            title={error}
            subtitle=""
            kind="error"
            onCloseButtonClick={handleClearError}
          />
        ) : null}

        <StyledWizardContainer>
          {sidebar ? <WizardSidebar sidebar={sidebar} /> : null}
          <div data-id="WizardInlineContent" className="bx--modal-content">
            <WizardContent component={currentItemObj.component} />
          </div>
        </StyledWizardContainer>

        <StyledFooter className={className}>
          <div data-id="WizardInlineFooter" className="bx--modal-footer">
            <WizardFooter
              backLabel={backLabel}
              nextLabel={nextLabel}
              hasNext={hasNext}
              hasPrev={hasPrev}
              cancelLabel={cancelLabel}
              submitLabel={submitLabel}
              // Validate before next
              onNext={event => isValid(() => onNext(event))}
              onBack={onBack}
              onSubmit={onSubmit}
              onCancel={onClose}
              footerLeftContent={footerLeftContent}
              nextDisabled={nextDisabled || false}
              sendingData={sendingData}
            />
          </div>
        </StyledFooter>
      </div>
    </StyledWizardWrapper>
  );
};

WizardInline.propTypes = propTypes;
WizardInline.defaultProps = defaultProps;
export default WizardInline;
