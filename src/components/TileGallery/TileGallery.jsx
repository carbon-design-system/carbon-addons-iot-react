import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

const TileGallery = ({
  children,
  mode = 'grid', // or "list"
}) => {
  // otherwise render the dashboards
  return (
    <div className="tile-gallery">
      {React.Children.map(children, tileGallerySection =>
        React.cloneElement(tileGallerySection, { mode })
      )}
    </div>
  );
};

export { TileGallery };
