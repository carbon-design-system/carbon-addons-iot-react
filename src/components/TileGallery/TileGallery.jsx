import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /** Component children's to be rendered */
  children: PropTypes.node.isRequired,
};

const TileGallery = ({ children }) => {
  // otherwise render the dashboards
  return (
    <div className="tile-gallery">
      {React.Children.map(children, tileGallerySection => React.cloneElement(tileGallerySection))}
    </div>
  );
};

TileGallery.propTypes = propTypes;

export default TileGallery;
