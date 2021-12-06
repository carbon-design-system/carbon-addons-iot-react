import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from '../../Modal';
import useMerged from '../../../hooks/useMerged';

const defaultProps = {
  isOpen: false,
  i18n: {
    heading: 'Do you wish to log out?',
    secondaryButton: 'Cancel',
    primaryButton: 'Log out',
    body:
      'Logging out also logs you out of each application that is open in the same browser.  To ensure a secure log out, close all open browser windows.',
    closeButtonLabel: 'Close',
  },
  testId: 'suite-header-logout-modal',
};

const propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    heading: PropTypes.string,
    primaryButton: PropTypes.string,
    secondaryButton: PropTypes.string,
    body: PropTypes.string,
    closeButtonLabel: PropTypes.string,
  }),
  testId: PropTypes.string,
};

const SuiteHeaderLogoutModal = ({ isOpen, onClose, onLogout, i18n, testId }) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
  return (
    <Modal
      open={isOpen}
      modalHeading={mergedI18n.heading}
      primaryButtonText={mergedI18n.primaryButton}
      secondaryButtonText={mergedI18n.secondaryButton}
      onSecondarySubmit={onClose}
      onRequestSubmit={onLogout}
      onRequestClose={onClose}
      data-testid={testId}
      closeButtonLabel={mergedI18n.closeButtonLabel}
    >
      {mergedI18n.body}
    </Modal>
  );
};

SuiteHeaderLogoutModal.propTypes = propTypes;
SuiteHeaderLogoutModal.defaultProps = defaultProps;

export default SuiteHeaderLogoutModal;
