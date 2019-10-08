import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InlineNotification } from 'carbon-components-react';

import { PADDING } from '../../styles/styles';

import WizardHeader from './WizardHeader/WizardHeader';
import WizardFooter from './WizardFooter/WizardFooter';
import WizardSidebar from './WizardLeftSidebar/WizardSidebar';
import WizardContent from './WizardContent/WizardContent';

const StyledWizardWrapper = styled.div`
  .bx--modal-content[data-id='WizardInlineContent'] {
    max-height: 80vh;
    overflow: auto;
    width: auto;
  }

  .bx--modal-container[data-id='WizardInlineContainer'] {
    min-width: 630px;
    max-width: 90%;
    margin: ${PADDING.verticalPadding} auto;
    width: 90%;
    padding-bottom: 4.5rem;
  }
`;

const StyledWizardContainer = styled.div`
  display: flex;
  padding: 0 ${PADDING.horizontalWrapPadding} 0 0;
`;

const StyledMessageBox = styled(InlineNotification)`
  &&& {
    width: calc(100% - ${PADDING.horizontalWrapPadding} * 2);
    margin: ${PADDING.verticalPadding} auto;
    max-width: unset;
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
    width: 100%;

    & > * {
      width: 100%;
    }
  }
`;

export const propTypes = {
  /** Title in the header */
  title: PropTypes.string,
  blurb: PropTypes.string,
  /** Breadcrumbs to show */
  breadcrumb: PropTypes.arrayOf(PropTypes.node),
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
  /** should we show the close button at the top of the screen */
  showCloseButton: PropTypes.bool,

  /** Form Error Details */
  error: PropTypes.string,
  /**  Clear the currently shown error, triggered if the user closes the ErrorNotification */
  onClearError: PropTypes.func,
};

export const defaultProps = {
  title: null,
  breadcrumb: null,
  sidebar: null,
  footerLeftContent: null,
  showCloseButton: true,
  showLabels: true,
  nextDisabled: false,
  currentItemId: null,
  blurb: null,
  stepWidth: 8,
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
  breadcrumb,
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
  showCloseButton,
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
          breadcrumb={breadcrumb}
          // only go if current step passes validation
          setItem={id => isValid(() => setItem(id))}
          items={items}
          showLabels={showLabels}
          onClose={showCloseButton ? onClose : null}
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
