import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionItem } from 'carbon-components-react';

const propTypes = {
  /** Component children's to be rendered */
  children: PropTypes.node.isRequired,
  /** Section title */
  title: PropTypes.string,
  /** Section is open or not */
  isOpen: PropTypes.bool,
  /** Callback for accordion item click */
  onClick: PropTypes.func,
  /** i18n strings */
  i18n: PropTypes.shape({
    arrowIconDescription: PropTypes.string,
  }),
};

const defaultProps = {
  isOpen: true,
  onClick: () => {},
  title: null,
  i18n: {
    arrowIconDescription: 'Expand/Collapse',
  },
};

const TileGallerySection = ({ children, title, isOpen, onClick, i18n }) => {
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
            iconDescription={i18n.arrowIconDescription}
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
