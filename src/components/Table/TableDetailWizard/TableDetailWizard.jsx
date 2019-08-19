import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InlineNotification } from 'carbon-components-react';

import WizardFooter from '../../WizardInline/WizardFooter/WizardFooter';
import WizardContent from '../../WizardInline/WizardContent/WizardContent';
import { COLORS } from '../../../styles/styles';

import TableDetailWizardHeader from './TableDetailWizardHeader/TableDetailWizardHeader';
import DetailWizardSidebar from './TableDetailWizardSidebar/TableDetailWizardSidebar';

const StyledWizardWrapper = styled.div`
  background-color: ${COLORS.gray10};
  display: flex;
  flex-flow: column;
  align-items: left;
  border: 1px solid #a2a2a28c;

  .bx--inline-notification {
    max-width: none;
    width: calc(100% - 2rem);
    margin: 1rem;
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
  .bx--modal-footer {
    justify-content: flex-end;

    & > div {
      width: 100%;
    }
  }
`;

const StyledContentContainer = styled.div`
  padding-top: 30px;
  padding-right: 50px;
  padding-left: 40px;
`;

export const propTypes = {
  /** Title in the header */
  title: PropTypes.string.isRequired,
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
  showLabels: true,
  nextDisabled: false,
  currentItemId: null,
  stepWidth: 7,
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

const TableDetailWizard = ({
  title,
  currentItemId,
  items,
  onNext,
  onBack,
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
      <TableDetailWizardHeader title={title} onClose={onClose} />
      <StyledWizardContainer>
        <DetailWizardSidebar
          currentItemId={currentItemId}
          // only go if current step passes validation
          setItem={id => isValid(() => setItem(id))}
          items={items}
          showLabels={showLabels}
          stepWidth={stepWidth}
        />
        <StyledContentContainer>
          <WizardContent component={currentItemObj.component} />
        </StyledContentContainer>
      </StyledWizardContainer>
      {error ? (
        <StyledMessageBox
          title={error}
          subtitle=""
          kind="error"
          onCloseButtonClick={handleClearError}
        />
      ) : null}
      <StyledFooter className={className}>
        <div className="bx--modal-footer">
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
            nextDisabled={nextDisabled || false}
            sendingData={sendingData}
          />
        </div>
      </StyledFooter>
    </StyledWizardWrapper>
  );
};

TableDetailWizard.propTypes = propTypes;
TableDetailWizard.defaultProps = defaultProps;
export default TableDetailWizard;
