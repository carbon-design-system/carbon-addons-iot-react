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
import classNames from 'classnames';
import styled from 'styled-components';
import { rem } from 'polished';

import { PADDING } from '../../styles/styles';
import { scrollErrorIntoView } from '../../utils/componentUtilityFunctions';
import Button from '../Button';

const StyledModal = styled(CarbonComposedModal)`
   {
    .bx--modal-container {
      @media (min-height: ${rem(515)}) {
        overflow-y: auto;
      }
    }

    /* support large modals for ll the sizes */
    &.big-modal {
      .bx--modal-header {
        margin-bottom: 0rem;
      }
      .bx--modal-container {
        min-height: ${rem(600)};
        min-width: ${rem(800)};
        max-height: 80%;
        @media (min-width: ${rem(600)}) {
          height: auto;
        }
        @media (min-width: ${rem(1024)}) {
          max-width: 80%;
        }
        @media (min-width: ${rem(1200)}) {
          max-width: 60%;
        }
      }
    }

    /* Needed for buttons when they're next to each other */

    .bx--modal-header__heading {
      margin-bottom: 0.75rem;
    }

    .bx--modal-content {
      min-height: ${rem(200)};
    }
  }
`;

const StyledMessageBox = styled(InlineNotification)`
  &&& {
    width: calc(100% - ${PADDING.horizontalWrapPadding} * 2);
    margin: ${PADDING.verticalPadding} auto;
  }
`;

const StyledModalFooter = styled(ModalFooter)`
   {
    justify-content: flex-end;

    & > * {
      width: 100%;
    }

    .modal-greedy-spacer {
      flex-grow: 2;
      text-align: left; // needed to override the dialog style
    }
  }
`;

export const ComposedModalPropTypes = {
  /** Header Props
   * label: goes on top of the dialog
   * title: Heading of the dialog
   * helpText, additional information will stay at the top of the screen when scrolling dialog content
   */
  header: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
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
    }),
  ]),
  /** NEW PROP: Type of dialog, affects colors, styles of dialog */
  type: PropTypes.oneOf(['warn', 'normal']),
  /** NEW PROP: Whether this particular dialog needs to be very large */
  isLarge: PropTypes.bool,

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
  /** switchc to render footer buttons or not (carbon consistency) */
  passiveModal: PropTypes.bool,
};

/**
 * Renders a carbon modal dialog.  This dialog adds these additional features on top of the base carbon dialog:
 *  adds header.helpText prop to explain dialog
 *  adds type prop for warning and error type dialogs
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
    isLarge: false,
    submitFailed: false,
    onSubmit: null,
    invalid: false,
    children: null,
    header: {},
    iconDescription: 'Close',
    passiveModal: true,
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
      isLarge,
      onSubmit,
      iconDescription,
      passiveModal,
      onClearError,
      submitFailed,
      invalid,
      ...props
    } = this.props;
    const { label, title, helpText } = header;
    // First check for dataErrors as they are worse than form errors

    return isFetchingData ? (
      <Loading />
    ) : (
      <StyledModal
        {...props}
        open={open}
        onClose={this.doNotClose}
        className={classNames(className, {
          'error-modal': type === 'warn',
          'big-modal': isLarge,
        })}
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
        {children ? <ModalBody>{children}</ModalBody> : null}
        {error ? (
          <StyledMessageBox
            title={error}
            subtitle=""
            kind="error"
            onCloseButtonClick={this.handleClearError}
          />
        ) : null}
        {(!passiveModal && footer) || onSubmit ? (
          <StyledModalFooter>
            {React.isValidElement(footer) ? (
              footer
            ) : (
              <Fragment>
                <Button kind="secondary" onClick={onClose}>
                  {(footer && footer.secondaryButtonLabel) || 'Cancel'}
                </Button>
                <Button
                  kind={type === 'warn' ? 'danger' : 'primary'}
                  loading={
                    (typeof sendingData === 'boolean' && sendingData) ||
                    typeof sendingData === 'string'
                  }
                  onClick={onSubmit}
                >
                  {(footer && footer.primaryButtonLabel) || 'Save'}
                </Button>
              </Fragment>
            )}
          </StyledModalFooter>
        ) : null}
      </StyledModal>
    );
  }
}

export default ComposedModal;
