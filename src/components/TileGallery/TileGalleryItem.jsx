import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ClickableTile } from 'carbon-components-react';

const propTypes = {
  /** Card title */
  title: PropTypes.string.isRequired,
  /** Card description/content */
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /** Bottom left  icon  */
  icon: PropTypes.oneOfType([
    PropTypes.shape({
      width: PropTypes.string,
      height: PropTypes.string,
      viewBox: PropTypes.string.isRequired,
      svgData: PropTypes.object.isRequired,
    }),
    PropTypes.node,
  ]),
  /** Bottom right content for component */
  afterContent: PropTypes.node,
  /** Card display mode */
  mode: PropTypes.oneOf(['grid', 'list']),
  /** When grid type - thumbnail content */
  thumbnail: PropTypes.node,
  /** onClick card */
  onClick: PropTypes.func,
  /** Specify an optional className to be applied to the container node */
  className: PropTypes.string,
};

const defaultProps = {
  description: 'Some description',
  icon: null,
  afterContent: null,
  mode: 'grid',
  thumbnail: null,
  onClick: () => {},
  className: null,
};

const TileGalleryItem = ({
  title,
  description,
  icon,
  afterContent,
  mode,
  thumbnail,
  onClick,
  className,
}) => {
  console.log(React.isValidElement(description));
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
        <div className="topSection">
          <div className="thumbnail">{thumbnail}</div>
          <div className="descriptionCard">
            {!React.isValidElement(description) ? <span>{description}</span> : description}
          </div>
        </div>
        {content}
      </div>
    ) : (
      <div key={`${title}-card`}>
        <Fragment>
          {content}
          <div className="descriptionCard">
            {!React.isValidElement(description) ? <span>{description}</span> : description}
          </div>
        </Fragment>
      </div>
    );

  return (
    <Fragment>
      <ClickableTile
        className={`${className} dashboard-tile bx--tile bx--tile--clickable dashboard-pin-${
          mode === 'grid' ? 'card' : 'list'
        }-title`}
        key={`${title}-card-link`}
        handleClick={evt => onClick(evt)}
      >
        {tile}
      </ClickableTile>
    </Fragment>
  );
};

TileGalleryItem.propTypes = propTypes;
TileGalleryItem.defaultProps = defaultProps;

export default TileGalleryItem;
