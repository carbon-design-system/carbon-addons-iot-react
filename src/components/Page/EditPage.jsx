import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { SkeletonText } from 'carbon-components-react';

import ButtonEnhanced from '../ButtonEnhanced/ButtonEnhanced';

import PageHeader from './PageHeader';

const StyledEditPage = styled.div`
  &&& {
    width: 100%;
    max-width: 100%;
    max-height: unset;
  }
`;

const StyledPageContent = styled.div`
   {
    display: flex;
    flex-flow: column;
    min-height: calc(100vh - 250px);
    padding-bottom: 7rem;
  }
`;

const StyledPageFooter = styled.div`
  &&& {
    position: fixed;
    bottom: 0rem;
    left: 0rem;
    right: 2rem;
  }
`;

const propTypes = {
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
};

const defaultProps = {
  className: null,
  isLoading: false,
  i18n: {
    saveLabel: 'Save',
    cancelLabel: 'Cancel',
    closeLabel: 'Close,',
  },
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
  ...others
}) => {
  const [isSaving, setSaving] = useState();
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      onClose();
    } catch {
      setSaving(false);
    }
  };
  return (
    <StyledEditPage className={classNames('bx--modal-container', className)}>
      {isLoading ? (
        <Fragment>
          <PageHeader {...others} onClose={onClose} i18n={i18n} isLoading />
          <StyledPageContent>
            <SkeletonText width="30%" />
          </StyledPageContent>
        </Fragment>
      ) : (
        <Fragment>
          <PageHeader {...others} onClose={onClose} i18n={i18n} />
          <StyledPageContent>{children}</StyledPageContent>
          <StyledPageFooter className="bx--modal-footer">
            <ButtonEnhanced kind="secondary" onClick={onClose}>
              {cancelLabel}
            </ButtonEnhanced>
            <ButtonEnhanced onClick={handleSave} loading={isSaving}>
              {saveLabel}
            </ButtonEnhanced>
          </StyledPageFooter>
        </Fragment>
      )}
    </StyledEditPage>
  );
};

EditPage.propTypes = propTypes;
EditPage.defaultProps = defaultProps;
export default EditPage;
