import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

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
    min-height: calc(100vh - 300px);
  }
`;

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  /** Labels needed to support i18n */
  i18n: PropTypes.shape({
    saveLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    closeLabel: PropTypes.string,
  }),
};

const defaultProps = {
  className: null,
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
      <PageHeader {...others} onClose={onClose} i18n={i18n} />
      <StyledPageContent>{children}</StyledPageContent>
      <div className="bx--modal-footer">
        <ButtonEnhanced kind="secondary" onClick={onClose}>
          {cancelLabel}
        </ButtonEnhanced>
        <ButtonEnhanced onClick={handleSave} loading={isSaving}>
          {saveLabel}
        </ButtonEnhanced>
      </div>
    </StyledEditPage>
  );
};

EditPage.propTypes = propTypes;
EditPage.defaultProps = defaultProps;
export default EditPage;
