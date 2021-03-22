import { SelectableTile, Button } from 'carbon-components-react';
import { TrashCan16 } from '@carbon/icons-react';
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
  i18n: PropTypes.shape({
    deleteButtonLabel: PropTypes.string,
  }),
  /** function called with the image id if they click the delete button */
  onDelete: PropTypes.func,
};

const defaultProps = {
  alt: undefined,
  isSelected: false,
  isWide: false,
  title: undefined,
  i18n: {
    deleteButtonLabel: 'Delete',
  },
  onDelete: null,
};

const matchFilename = /([^\\/]+)\.(\w+)$/;
const extractFileName = (path) => {
  const fileNameGroupIndex = 1;
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
  onDelete,
  i18n: { deleteButtonLabel },
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
      light
    >
      <div className={`${iotPrefix}--image-tile__title`}>
        <span>{title ?? extractFileName(src) ?? src}</span>
      </div>
      <div className={`${iotPrefix}--image-tile__image-container`}>
        <img src={src} alt={alt} />
        {onDelete ? (
          <Button
            className={`${iotPrefix}--image-tile__title__delete`}
            renderIcon={TrashCan16}
            hasIconOnly
            iconDescription={deleteButtonLabel}
            kind="ghost"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(id);
            }}
          />
        ) : null}
      </div>
    </SelectableTile>
  );
};

ImageTile.propTypes = propTypes;
ImageTile.defaultProps = defaultProps;

export default ImageTile;
