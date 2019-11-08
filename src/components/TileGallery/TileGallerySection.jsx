import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionItem } from '../../index';

const TileGallerySection = ({ children, title, isOpen = true, hasAccordion = true, onClick = () => {}, ...rest }) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="tile-gallery--section">
      {hasAccordion ? (
        <Accordion>
          <AccordionItem
            title={title}
            onHeadingClick={evt => {
              setOpen(!open);
              onClick(evt);
            }}
            open={open}
          >
            <div className="tile-gallery--section--items">
              {React.Children.map(children, tileGalleryItem =>
                React.cloneElement(tileGalleryItem, { mode: rest.mode })
              )}
            </div>
          </AccordionItem>
        </Accordion>
      ) : (
        <div className="tile-gallery--section--items">
          {React.Children.map(children, tileGalleryItem =>
            React.cloneElement(tileGalleryItem, { mode: rest.mode })
          )}
        </div>
      )}
    </div>
  );
};

export { TileGallerySection };
