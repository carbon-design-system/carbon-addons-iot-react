import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /** Card title */
  title: PropTypes.string.isRequired,
  /** Card description */
  description: PropTypes.string,
  /** More info link */
  moreInfoLink: PropTypes.string,
  /** More info text */
  descriptionMoreInfo: PropTypes.string,
  /** Bottom left content for component  */
  icon: PropTypes.node,
  /** Bottom right content for component */
  afterContent: PropTypes.node,
  /** Card display mode */
  mode: PropTypes.oneOf(['grid', 'tile']),
  /** When grid type - thumbnail content */
  thumbnail: PropTypes.node,
  /** Href when click in card */
  href: PropTypes.string,
  /** Card width */
  width: PropTypes.string,
  /** Card height */
  height: PropTypes.string,
  /** Specify an optional className to be applied to the container node */
  className: PropTypes.string,
};

const defaultProps = {
  description: 'Some description',
  moreInfoLink: null,
  descriptionMoreInfo: 'More info...',
  icon: null,
  afterContent: null,
  mode: 'grid',
  thumbnail: null,
  href: null,
  width: '305px',
  height: '272px',
  className: null,
};

const TileGalleryItem = ({
  title,
  description,
  descriptionMoreInfo,
  moreInfoLink,
  icon,
  afterContent,
  mode,
  thumbnail,
  href,
  width,
  height,
  className,
}) => {
  const content = (
    <div style={{ display: 'flex', minHeight: '24px' }}>
      {icon}
      <span className="titleCard">{title}</span>
      {afterContent && <div className="overflowMenu">{afterContent}</div>}
    </div>
  );

  const tile =
    mode === 'grid' ? (
      <div key={`${title}-card`}>
        <div>
          <div className="topSection" style={{ height: `calc(${height} - 63px )` }}>
            <Fragment className="thumbnail">{thumbnail}</Fragment>
            <div className="descriptionCard">
              <span>{description}</span>
              <a href={moreInfoLink}>{descriptionMoreInfo}</a>
            </div>
          </div>
        </div>
        {content}
      </div>
    ) : (
      <div key={`${title}-card`}>
        <Fragment>
          {content}
          <span className="descriptionCard">{description}</span>
        </Fragment>
      </div>
    );

  return (
    <Fragment>
      <a
        style={mode === 'grid' ? { width, height } : { minWidth: width }}
        className={`${className} dashboard-tile bx--tile bx--tile--clickable dashboard-pin-${
          mode === 'grid' ? 'card' : 'list'
        }-title`}
        key={`${title}-card-link`}
        href={href}
      >
        {tile}
      </a>
    </Fragment>
  );
};

TileGalleryItem.propTypes = propTypes;
TileGalleryItem.defaultProps = defaultProps;

export default TileGalleryItem;
