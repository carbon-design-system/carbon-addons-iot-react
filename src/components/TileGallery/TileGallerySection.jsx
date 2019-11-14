import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionItem } from '../../index';

const propTypes = {
  /** Component children's to be rendered */
  children: PropTypes.node.isRequired,
  /** Section title */
  title: PropTypes.string,
  /** Section is open or not */
  isOpen: PropTypes.bool,
  /** Callback for accordion item click */
  onClick: PropTypes.func,
};

const defaultProps = {
  isOpen: true,
  onClick: () => {},
  title: null,
};

const TileGallerySection = ({ children, title, isOpen, onClick }) => {
  const [open, setOpen] = useState(isOpen);

  const galleryItems = (
    <div className="tile-gallery--section--items">
      {React.Children.map(children, tileGalleryItem => React.cloneElement(tileGalleryItem))}
    </div>
  );

  return (
    <div className="tile-gallery--section">
      {title ? (
        <Accordion>
          <AccordionItem
            title={title}
            onHeadingClick={evt => {
              setOpen(!open);
              onClick(evt);
            }}
            open={open}
          >
            {galleryItems}
          </AccordionItem>
        </Accordion>
      ) : (
        galleryItems
      )}
    </div>
  );
};

TileGallerySection.propTypes = propTypes;
TileGallerySection.defaultProps = defaultProps;

export default TileGallerySection;
