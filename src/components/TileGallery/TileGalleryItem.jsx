import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import IconStar from '@carbon/icons-react/lib/star/16';
import IconStarFav from '@carbon/icons-react/lib/star--filled/16';

import { OverflowMenu, OverflowMenuItem } from '../../index';

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

export { TileGalleryItem };
