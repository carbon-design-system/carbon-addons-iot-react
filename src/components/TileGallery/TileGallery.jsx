import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import IconStar from '@carbon/icons-react/lib/star/16';
import IconStarFav from '@carbon/icons-react/lib/star--filled/16';

import Button from '../Button/Button';
import { OverflowMenu, OverflowMenuItem, Accordion, AccordionItem } from '../../index';

const TileGalleryItem = ({ title, description, thumbnail, href, isFavorite = false, mode }) => {
  const titleSection = !isFavorite ? (
    <Fragment>
      <IconStar onClick={() => alert('favorite')} />
      {title}
    </Fragment>
  ) : (
    <Fragment>
      <IconStarFav onClick={() => alert('unfavorite')} />
      {title}
    </Fragment>
  );

  const optionSets = [['edit', 'share', 'update'], ['remove']];

  const overflowMenu = (
    <OverflowMenu floatingMenu onClick={evt => evt.preventDefault()} style={{ height: '2rem' }}>
      {optionSets.map((options, setIdx) =>
        options.map((option, optionIdx) => (
          <OverflowMenuItem
            hasDivider={optionIdx === 0 && setIdx > 0}
            itemText={option}
            onClick={() => alert(option)}
          />
        ))
      )}
    </OverflowMenu>
  );
  const tile =
    mode === 'grid' ? (
      <div key={`${title}-pinnedsummarydash`}>
        <div>
          <div className="topSection">
            <img className="image" alt="Dashboard Thumbnail" src={thumbnail} />
            <div className="descriptionPinned">
              <span>{description}</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex' }}>
            {titleSection}
            <div className="overflowMenu">{overflowMenu}</div>
          </div>
        </div>
      </div>
    ) : (
      <div key={`${title}-pinnedsummarydash`}>
        <div>
          <div style={{ display: 'flex' }}>
            {titleSection}
            <div className="overflowMenu">{overflowMenu}</div>
          </div>
          <span className="descriptionPinned">{description || 'some description'}</span>
        </div>
      </div>
    );

  return (
    <Fragment>
      <a
        className={`dashboard-tile bx--tile bx--tile--clickable dashboard-pin-${
          mode === 'grid' ? 'card' : 'list'
        }-title`}
        key={`${title}-dashboard-pin-link`}
        to={href}
      >
        {tile}
      </a>
    </Fragment>
  );
};

const TileGallerySection = ({ children, title, isOpen = true, onClick = () => {}, ...rest }) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="tile-gallery--section">
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
    </div>
  );
};

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

export { TileGallery, TileGallerySection, TileGalleryItem };
