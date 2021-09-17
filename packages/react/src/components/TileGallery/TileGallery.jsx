import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /** Component children's to be rendered */
  children: PropTypes.node.isRequired,

  testId: PropTypes.string,
};

const defaultProps = {
  testId: 'tile-gallery',
};
const TileGallery = ({ children, testId }) => (
  <div data-testid={testId} className="tile-gallery">
    {children}
  </div>
);

TileGallery.propTypes = propTypes;
TileGallery.defaultProps = defaultProps;

export default TileGallery;
