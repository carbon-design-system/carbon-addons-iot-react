import { InlineNotification } from 'carbon-components-react';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  type: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
  data: PropTypes.shape({
    message: PropTypes.string.isRequired,
    details: PropTypes.string,
  }),
  onClose: PropTypes.func,
  className: PropTypes.string,
};

const defaultProps = {
  type: 'error',
  data: null,
  className: null,
  onClose: null,
};

/** simple component that wraps the notification box with a default type, and parses a data object, maybe just use the Carbon notification component? */
const MessageBox = props => {
  const { type, data, onClose, ...other } = props;
  return data ? (
    <InlineNotification
      title={data.message}
      subtitle={data.details || ''}
      kind={type}
      onCloseButtonClick={onClose}
      {...other}
    />
  ) : null;
};

MessageBox.propTypes = propTypes;
MessageBox.defaultProps = defaultProps;

export default MessageBox;
