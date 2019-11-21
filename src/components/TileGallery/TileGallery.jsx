import React from 'react';
import PropTypes from 'prop-types';

import TileGallerySection from './TileGallerySection';

const propTypes = {
  /** Component children's to be rendered */
  children: PropTypes.instanceOf(TileGallerySection).isRequired,
};

const defaultProps = {};

const TileGallery = ({ children }) => <div className="tile-gallery">{children}</div>;

TileGallery.propTypes = propTypes;
TileGallery.defaultProps = defaultProps;

export default TileGallery;
