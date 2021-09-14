import React from 'react';
import PropTypes from 'prop-types';

// Utility component that is used to render stories at full width
// eslint-disable-next-line react/prop-types
const FullWidthWrapper = ({ withPadding, style, children }) => {
  const styles = withPadding
    ? { width: 'calc(100vw - 6rem)', ...style }
    : {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto',
        ...style,
      };

  return <div style={children?.type?.name === 'DeprecationNotice' ? {} : styles}>{children}</div>;
};

FullWidthWrapper.propTypes = {
  /**
   * if stories need to be fullscreen and not use the container padding that is applied ot all stories
   */
  withPadding: PropTypes.bool,
  /**
   * allow for over rides and additional styles to wrapper
   */
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

FullWidthWrapper.defaultProps = {
  style: null,
  withPadding: true,
};

export default FullWidthWrapper;
