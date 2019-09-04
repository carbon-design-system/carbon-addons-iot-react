import { ToastNotification } from 'carbon-components-react';
import PropTypes from 'prop-types';
import React from 'react';

export const deprecatedStoryTitle = '️⛔ Deprecation Notice ';

const propTypes = {
  /** Name of the deprecated component */
  deprecatedComponentName: PropTypes.string.isRequired,
  /** Name of the component replacing the deprecated component */
  replacementComponentName: PropTypes.string,
};

const defaultProps = {
  replacementComponentName: '',
};

const DeprecationNotice = ({ deprecatedComponentName, replacementComponentName }) => (
  <ToastNotification
    caption={
      replacementComponentName
        ? `Refactor usages of ${deprecatedComponentName} to use ${replacementComponentName} instead.`
        : null
    }
    hideCloseButton
    iconDescription=""
    kind="warning"
    notificationType="toast"
    role="alert"
    style={{
      marginBottom: '.5rem',
      minWidth: '30rem',
    }}
    subtitle={`${deprecatedComponentName} has been deprecated and will be removed in the next major version of carbon-addons-iot-react.`}
    timeout={0}
    title="Deprecation Notice"
  />
);

DeprecationNotice.propTypes = propTypes;
DeprecationNotice.defaultProps = defaultProps;

export default DeprecationNotice;
