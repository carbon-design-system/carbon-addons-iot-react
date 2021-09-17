import {
  ComposedModal as CarbonComposedModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Loading,
  InlineNotification,
} from 'carbon-components-react';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import classnames from 'classnames';
import warning from 'warning';

import { settings } from '../../constants/Settings';
import { scrollErrorIntoView } from '../../utils/componentUtilityFunctions';
import Button from '../Button';
import deprecate from '../../internal/deprecate';

const { iotPrefix } = settings;

export const ComposedModalPropTypes = {
  /** Header Props
   * label: goes on top of the dialog
   * title: Heading of the dialog
   * helpText, additional information will stay at the top of the screen when scrolling dialog content
   */
  header: PropTypes.shape({
    label: PropTypes.node,
    title: PropTypes.node,
    helpText: PropTypes.node,
  }),
  /** ability to add translation string to close icon */
  iconDescription: PropTypes.string,

  /** Content to render inside Modal */
  children: PropTypes.node,
  /** Footer Props
   * Either supply your own footer element or supply an object with button labels and submit handlers and we will make a footer with two buttons for you
   */
  footer: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.shape({
      primaryButtonLabel: PropTypes.node,
      secondaryButtonLabel: PropTypes.node,
      /** should the primary button be hidden (i.e. only show Cancel) */
      isPrimaryButtonHidden: PropTypes.bool,
      /** should the primary button be disabled */
      isPrimaryButtonDisabled: PropTypes.bool,
    }),
  ]),
  /** NEW PROP: Type of dialog, affects colors, styles of dialog */
  type: PropTypes.oneOf(['warn', 'normal']),
  /** NEW PROP: Whether this particular dialog needs to be very large */
  isLarge: PropTypes.bool,
  /** NEW PROP: Whether this particular dialog needs to be full width */
  isFullScreen: PropTypes.bool,
  /** Should the dialog be open or not */
  open: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  /**   Close the dialog */
  onClose: PropTypes.func.isRequired,

  /**  Is data currently being sent to the backend */
  sendingData: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /**  Is my data actively loading? */
  isFetchingData: PropTypes.bool,

  /** Form Error Details */
  error: PropTypes.string,
  /**  Clear the currently shown error, triggered if the user closes the ErrorNotification */
  onClearError: PropTypes.func,

  /** Did the form submission fail */
  submitFailed: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  /** Is the form currently invalid */
  invalid: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  /** Callback to submit the dialog/form */
  onSubmit: PropTypes.func,
  /** Hide the footer */
  passiveModal: PropTypes.bool,
  // TODO: remove deprecated testID in v3.
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  /** Id that can be used for testing */
  testId: PropTypes.string,
};

/**
 * Renders a carbon modal dialog.  This dialog adds these additional features on top of the base carbon dialog:
 *  adds header.helpText prop to explain dialog
 *  adds type prop for warning and error type dialogs
 *  adds isFullScreen prop to have the modal appear in full width using class styling
 *  adds isLarge prop for large and small class styling dialogs
 *  adds isFetchingData props for loading state
 *  adds error and dataError prop to display notification about error at bottom of dialog
 *  if submitFailed prop, it will find and scroll the failing carbon element into view
 *  shows spinner on primary dialog button if sendingData prop is true
 *
 * We also prevent the dialog from closing if you click outside it.
 *
 */
class ComposedModal extends React.Component {
  static propTypes = ComposedModalPropTypes;

  static defaultProps = {
    open: true,
    error: null,
    isFetchingData: false,
    sendingData: null,
    onClearError: null,
    type: null,
    footer: null,
    isFullScreen: false,
    isLarge: false,
    submitFailed: false,
    onSubmit: null,
    invalid: false,
    children: null,
    header: {},
    iconDescription: 'Close',
    passiveModal: false,
    testId: 'ComposedModal',
  };

  componentDidUpdate(prevProps) {
    const { submitFailed, invalid } = this.props;
    if (invalid && submitFailed !== prevProps.submitFailed) {
      scrollErrorIntoView(true);
    }
  }

  handleClearError = () => {
    const { onClearError } = this.props;
    if (onClearError) {
      onClearError();
    }
  };

  /** TODO: This is needed to keep the ComposedModal from closing if you click outside it this supports our dialogs on top of dialogs issue */
  doNotClose = () => false;

  render() {
    const {
      header,
      error,
      sendingData,
      children,
      footer,
      open,
      className,
      type,
      onClose,
      isFetchingData,
      isFullScreen,
      isLarge,
      onSubmit,
      iconDescription,
      onClearError,
      submitFailed,
      invalid,
      passiveModal,
      // TODO: remove deprecated testID in v3.
      testID,
      testId,
      ...props
    } = this.props;
    const { label, title, helpText } = header;
    // First check for dataErrors as they are worse than form errors

    if (__DEV__ && passiveModal && (footer || onSubmit)) {
      warning(
        false,
        'You have set passiveModal to true, but also passed a footer or onSubmit handler.  Your footer will not be rendered.'
      );
    }

    return isFetchingData ? (
      <Loading />
    ) : (
      <CarbonComposedModal
        {...props}
        // TODO: remove deprecated testID in v3.
        data-testid={testID || testId}
        open={open}
        onClose={this.doNotClose}
        data-floating-menu-container // TODO: Can remove once this issue is fixed: https://github.com/carbon-design-system/carbon/issues/6662
        className={classnames(
          className,
          {
            [`${iotPrefix}--composed-modal--large`]: isLarge,
            [`${iotPrefix}--composed-modal--full-screen`]: isFullScreen,
          },
          `${iotPrefix}--composed-modal`
        )}
      >
        <ModalHeader
          label={label}
          title={title}
          closeModal={onClose}
          buttonOnClick={onClose}
          iconDescription={iconDescription}
        >
          {helpText ? <p className="bx--modal-content__text">{helpText}</p> : null}
        </ModalHeader>
        {children ? (
          <ModalBody
            className={classnames({
              // Prevent double scrollbars
              [`${iotPrefix}--composed-modal__body--small-margin-bottom`]: error,
            })}
          >
            {children}
          </ModalBody>
        ) : null}
        {error ? (
          <InlineNotification
            title={error}
            subtitle=""
            kind="error"
            onCloseButtonClick={this.handleClearError}
            className={`${iotPrefix}--composed-modal--inline-notification`}
            data-testid={`${testID || testId}-notification`}
          />
        ) : null}
        {!passiveModal ? (
          <ModalFooter className={`${iotPrefix}--composed-modal-footer`}>
            {React.isValidElement(footer) ? (
              footer
            ) : (
              <Fragment>
                <Button
                  kind="secondary"
                  onClick={onClose}
                  testId={`${testID || testId}-modal-secondary-button`}
                >
                  {(footer && footer.secondaryButtonLabel) || 'Cancel'}
                </Button>
                {!footer?.isPrimaryButtonHidden ? (
                  <Button
                    disabled={footer?.isPrimaryButtonDisabled}
                    kind={type === 'warn' ? 'danger' : 'primary'}
                    loading={
                      (typeof sendingData === 'boolean' && sendingData) ||
                      typeof sendingData === 'string'
                    }
                    onClick={onSubmit}
                    testId={`${testID || testId}-modal-${
                      type === 'warn' ? 'danger' : 'primary'
                    }-button`}
                  >
                    {(footer && footer.primaryButtonLabel) || 'Save'}
                  </Button>
                ) : null}
              </Fragment>
            )}
          </ModalFooter>
        ) : null}
      </CarbonComposedModal>
    );
  }
}

export default ComposedModal;
