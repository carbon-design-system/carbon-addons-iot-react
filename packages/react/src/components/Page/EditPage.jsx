import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacing05, spacing07, layout06 } from '@carbon/layout';
import { SkeletonText } from 'carbon-components-react';
import warning from 'warning';

import Button from '../Button/Button';
import Hero, { HeroPropTypes } from '../Hero/Hero';

const StyledEditPage = styled.div`
  &&& {
    width: 100%;
    max-width: 100%;
    max-height: unset;
    border: 0;
    position: relative;
  }
`;

const StyledPageContent = styled.div`
   {
    display: flex;
    flex-flow: column;
    min-height: calc(100vh - 125px);
    padding: ${spacing05} ${spacing07};
    padding-bottom: ${layout06};
  }
`;

const StyledPageFooter = styled.div`
  &&& {
    position: fixed;
    bottom: 0rem;
    left: 0rem;
    right: 2rem;
    display: flex;
    justify-content: flex-end;
  }
`;

const propTypes = {
  ...HeroPropTypes,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  /** Labels needed to support i18n */
  i18n: PropTypes.shape({
    saveLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    closeLabel: PropTypes.string,
  }),
  testId: PropTypes.string,
};

const defaultProps = {
  className: null,
  isLoading: false,
  i18n: {
    saveLabel: 'Save',
    cancelLabel: 'Cancel',
    closeLabel: 'Close,',
  },
  testId: 'edit-page',
};

/**
 * This component gives us a fullscreen editor page, for editing an existing item
 * @param {*} param0
 */
const EditPage = ({
  className,
  onClose,
  onSave,
  children,
  i18n: { saveLabel, cancelLabel },
  i18n,
  isLoading,
  blurb,
  testId,
  ...others
}) => {
  if (__DEV__) {
    warning(
      false,
      'EditPage component has been deprecated and will be removed in the next release of `carbon-addons-iot-react`. \n Refactor to use PageWizard component instead.'
    );
  }
  const [isSaving, setSaving] = useState();
  const handleSave = async () => {
    setSaving(true);
    try {
      // if they return false from onSave don't close and clear the saving bit
      if (await onSave()) {
        onClose();
      } else {
        setSaving(false);
      }
    } catch {
      setSaving(false);
    }
  };
  return (
    <StyledEditPage data-testid={testId} className={className}>
      {isLoading ? (
        <Fragment>
          <Hero
            {...others}
            description={blurb}
            onClose={onClose}
            i18n={i18n}
            isLoading
            testId={`${testId}-hero`}
          />
          <StyledPageContent>
            <SkeletonText width="30%" />
          </StyledPageContent>
        </Fragment>
      ) : (
        <Fragment>
          <Hero
            {...others}
            description={blurb}
            onClose={onClose}
            i18n={i18n}
            testId={`${testId}-hero`}
          />
          <StyledPageContent data-testid={`${testId}-content`}>{children}</StyledPageContent>
          <StyledPageFooter>
            <Button
              kind="secondary"
              onClick={onClose}
              // TODO: pass testId in v3 to override defaults
              // testId={`${testId}-close-button`}
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={handleSave}
              loading={isSaving}
              // TODO: pass testId in v3 to override defaults
              // testId={`${testId}-save-button`}
            >
              {saveLabel}
            </Button>
          </StyledPageFooter>
        </Fragment>
      )}
    </StyledEditPage>
  );
};

EditPage.propTypes = propTypes;
EditPage.defaultProps = defaultProps;
export default EditPage;
