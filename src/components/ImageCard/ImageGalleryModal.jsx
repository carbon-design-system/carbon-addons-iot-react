import React, { useState } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

import ComposedModal from '../ComposedModal/ComposedModal';
import Search from '../Search';
import { settings } from '../../constants/Settings';

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
    modalTitleInputLabelText: PropTypes.string,
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
  /** Disables the form and shows spinner on save button when true */
  sendingData: PropTypes.bool,
  /** Id that can be used for testing */
  testID: PropTypes.string,
  /** When true it will show that the title field has invalid input */
  titleInputInvalid: PropTypes.bool,
  /** Used to describe the input validation error for the the title field */
  titleInputInvalidText: PropTypes.string,
};

const defaultProps = {
  error: undefined,
  i18n: {
    modalTitle: 'Image gallery',
    modalBodyText: `Select the image you want to display on this card`,
    modalTitleInputLabelText: 'New image card',
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
  testID: 'ImageGalleryModal',
  titleInputInvalid: false,
  titleInputInvalidText: undefined,
  viewDescription: undefined,
};

const ImageGalleryModal = ({
  actions: { onSave, onClose },
  error,
  i18n,
  open,
  sendingData,
  testID,
  titleInputInvalid,
  titleInputInvalidText,
  viewDescription,
}) => {
  const {
    modalTitle,
    modalBodyText,
    closeIconDescription,
    saveButtonLabelText,
    cancelButtonLabelText,
  } = merge({}, defaultProps.i18n, i18n);

  const [selectedImage, setSelectedImage] = useState(null);

  const i18nFooter = {
    primaryButtonLabel: saveButtonLabelText,
    secondaryButtonLabel: cancelButtonLabelText,
  };

  return (
    <ComposedModal
      footer={{
        ...i18nFooter,
        isPrimaryButtonDisabled: false,
      }}
      iconDescription={closeIconDescription}
      data-testid={testID}
      error={error}
      header={{
        title: modalTitle,
      }}
      onClose={onClose}
      onSubmit={() => onSave(selectedImage)}
      open={open}
      sendingData={sendingData}>
      <p className={`${iotPrefix}--save-view-modal__body-text`}>
        {modalBodyText}
      </p>
      <Search />
    </ComposedModal>
  );
};

ImageGalleryModal.propTypes = propTypes;
ImageGalleryModal.defaultProps = defaultProps;
export default ImageGalleryModal;
