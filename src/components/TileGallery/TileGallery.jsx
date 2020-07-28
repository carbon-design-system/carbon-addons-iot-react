import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /** Component children's to be rendered */
  children: PropTypes.node.isRequired,
};

const defaultProps = {};

const TileGallery = ({ children }) => <div className="tile-gallery">{children}</div>;

TileGallery.propTypes = propTypes;
TileGallery.defaultProps = defaultProps;

export default TileGallery;
