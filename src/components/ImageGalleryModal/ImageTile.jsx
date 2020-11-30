import { SelectableTile } from 'carbon-components-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  alt: PropTypes.string,
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  isWide: PropTypes.bool,
  toggleImageSelection: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
};

const defaultProps = {
  alt: undefined,
  isSelected: false,
  isWide: false,
  title: undefined,
};

const matchFilename = /^(.+\/)*(.+)\.(.+)$/;
const extractFileName = (path) => {
  const fileNameGroupIndex = 2;
  const result = matchFilename.exec(path);
  return result && result[fileNameGroupIndex];
};

const ImageTile = ({
  alt,
  id,
  isSelected,
  isWide,
  toggleImageSelection,
  src,
  title,
}) => {
  return (
    <SelectableTile
      className={classNames(`${iotPrefix}--image-tile`, {
        [`${iotPrefix}--image-tile--wide`]: isWide,
      })}
      id={id}
      selected={isSelected}
      onChange={toggleImageSelection}
      light>
      <div className={`${iotPrefix}--image-tile__title`}>
        <span>{title ?? extractFileName(src) ?? src}</span>
      </div>
      <div className={`${iotPrefix}--image-tile__image-container`}>
        <img src={src} alt={alt} />
      </div>
    </SelectableTile>
  );
};

ImageTile.propTypes = propTypes;
ImageTile.defaultProps = defaultProps;

export default ImageTile;
