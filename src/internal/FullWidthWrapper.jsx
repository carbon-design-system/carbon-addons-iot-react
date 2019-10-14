import React from 'react';
import PropTypes from 'prop-types';

// Utility component that is used to render stories at full width
const FullWidthWrapper = ({ children }) => (
  <div
    style={
      children && children.type && children.type.name !== 'DeprecationNotice'
        ? { width: 'calc(100vw - 6rem)' }
        : {}
    }
  >
    {children}
  </div>
);

FullWidthWrapper.propTypes = {
  children: PropTypes.node,
};

FullWidthWrapper.defaultProps = {
  children: null,
};

export default FullWidthWrapper;
