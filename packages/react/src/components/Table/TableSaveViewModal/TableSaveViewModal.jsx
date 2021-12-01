import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash-es';

import ComposedModal from '../../ComposedModal/ComposedModal';
import { settings } from '../../../constants/Settings';
import { OverridePropTypes } from '../../../constants/SharedPropTypes';
import deprecate from '../../../internal/deprecate';

import TableSaveViewForm from './TableSaveViewForm';

const { iotPrefix } = settings;

const propTypes = {
  /**
   * Callbacks for the actions of the modal
   * onSave : Called with { title: string, defaultView: boolean, publicView: boolean} on save button click
   * onClose : Called on cancel button click and on the top right close icon click
   * onClearError : Called when the error msg is cleared
   * onChange : Called when view title input value is changed
   */
  actions: PropTypes.shape({
    onSave: PropTypes.func,
    onClose: PropTypes.func,
    onClearError: PropTypes.func,
    onChange: PropTypes.func,
  }).isRequired,
  /** Shows this string as a general modal error when present */
  error: PropTypes.string,
  /** Internationalisation strings object */
  i18n: PropTypes.shape({
    modalTitle: PropTypes.string,
    modalBodyText: PropTypes.string,
    titleInputLabelText: PropTypes.string,
    defaultCheckboxLabelText: PropTypes.string,
    publicCheckboxLabelText: PropTypes.string,
    closeIconDescription: PropTypes.string,
    saveButtonLabelText: PropTypes.string,
    cancelButtonLabelText: PropTypes.string,
  }),
  /**
   * The initial values of the form elements e.g: { title: 'My view 1', isDefault: true }.
   * Can be extended to contain any key-value pair needed for a custom form.
   */
  initialFormValues: PropTypes.oneOfType([
    PropTypes.shape({
      title: PropTypes.string,
      isDefault: PropTypes.bool,
      isPublic: PropTypes.bool,
    }),
    PropTypes.object,
  ]),
  /** Determines if the modal is open or closed (i.e. visible or not to the user) */
  open: PropTypes.bool.isRequired,
  /** Used to overide the internal components and props for advanced customisation */
  overrides: PropTypes.shape({
    composedModal: OverridePropTypes,
    tableSaveViewForm: OverridePropTypes,
  }),
  /** Disables the form and shows spinner on save button when true */
  sendingData: PropTypes.bool,
  // TODO: remove deprecated 'testID' in v3
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  /** Id that can be used for testing */
  testId: PropTypes.string,
  /** When true it will show that the title field has invalid input */
  titleInputInvalid: PropTypes.bool,
  /** Used to describe the input validation error for the the title field */
  titleInputInvalidText: PropTypes.string,
  /** A string that describes what this view contains */
  viewDescription: PropTypes.string,
};

const defaultProps = {
  error: undefined,
  i18n: {
    modalTitle: 'Save new view',
    modalBodyText: `You can save the current view's settings including applied filters and search.`,
    titleInputLabelText: 'View title',
    defaultCheckboxLabelText: 'Save as my default view',
    publicCheckboxLabelText: 'Public view',
    closeIconDescription: 'Close',
    saveButtonLabelText: 'Save',
    cancelButtonLabelText: 'Cancel',
  },
  initialFormValues: {
    title: '',
    isDefault: false,
    isPublic: false,
  },
  overrides: undefined,
  sendingData: false,
  testId: 'TableSaveViewModal',
  titleInputInvalid: false,
  titleInputInvalidText: undefined,
  viewDescription: undefined,
};

const TableSaveViewModal = ({
  actions: { onSave: onSaveCallback, onClose, onClearError, onChange: onChangeCallback },
  error,
  i18n,
  initialFormValues,
  open,
  overrides,
  sendingData,
  testID,
  testId,
  titleInputInvalid,
  titleInputInvalidText,
  viewDescription,
}) => {
  const [formValues, setFormValues] = useState(initialFormValues);

  const {
    modalTitle,
    modalBodyText,
    titleInputLabelText,
    defaultCheckboxLabelText,
    publicCheckboxLabelText,
    closeIconDescription,
    saveButtonLabelText,
    cancelButtonLabelText,
  } = merge({}, defaultProps.i18n, i18n);

  const onSave = () => onSaveCallback({ ...formValues, description: viewDescription });

  const onChange = (modifiedFormValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      ...modifiedFormValue,
    }));
    onChangeCallback(modifiedFormValue);
  };

  const primaryInputId = 'save-view-modal-view-title';
  const i18nFooter = {
    primaryButtonLabel: saveButtonLabelText,
    secondaryButtonLabel: cancelButtonLabelText,
  };

  const MyComposedModal = overrides?.composedModal?.component || ComposedModal;
  const MyTableSaveViewForm = overrides?.tableSaveViewForm?.component || TableSaveViewForm;

  return (
    <MyComposedModal
      footer={{
        ...i18nFooter,
        isPrimaryButtonDisabled: formValues.title === '',
      }}
      iconDescription={closeIconDescription}
      // TODO: remove deprecated 'testID' in v3
      testID={testID || testId}
      error={error}
      header={{
        title: modalTitle,
      }}
      onClearError={onClearError}
      onClose={onClose}
      onSubmit={onSave}
      open={open}
      sendingData={sendingData}
      selectorPrimaryFocus={`#${primaryInputId}`}
      {...overrides?.composedModal?.props}
    >
      <p className={`${iotPrefix}--save-view-modal__body-text`}>{modalBodyText}</p>
      <MyTableSaveViewForm
        viewDescription={viewDescription}
        titleInputInvalid={titleInputInvalid}
        titleInputInvalidText={titleInputInvalidText}
        onChange={onChange}
        formValues={formValues}
        disabled={sendingData}
        primaryInputId={primaryInputId}
        i18n={{
          titleInputLabelText,
          defaultCheckboxLabelText,
          publicCheckboxLabelText,
        }}
        // TODO: remove deprecated 'testID' in v3
        testID={`${testID || testId}-form`}
        {...overrides?.tableSaveViewForm?.props}
      />
    </MyComposedModal>
  );
};

TableSaveViewModal.propTypes = propTypes;
TableSaveViewModal.defaultProps = defaultProps;
export default TableSaveViewModal;
