import React from 'react';
import PropTypes from 'prop-types';
import {Scale32} from '@carbon/icons-react';

import Button from '../../../../Button';
import { settings } from '../../../../../constants/Settings';

const { iotPrefix, prefix } = settings;

const propTypes = {
  /* card value */
  cardConfig: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.shape({
      id: PropTypes.string,
      src: PropTypes.string,
      zoomMax: PropTypes.number,
    }),
    interval: PropTypes.string,
    showLegend: PropTypes.bool,
  }),
  /* callback when image input value changes (File object) */
  // onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({}),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    imageFile: 'Image file',
    editImage: 'Edit image',
    image: 'Image',
  },
};

const ImageCardFormItems = ({ cardConfig, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${iotPrefix}--card-edit-form`;
  return (
    <>
      <div className={`${baseClassName}--form-section ${baseClassName}--form-section-image`}>{mergedI18n.image}</div>
      <div className={`${baseClassName}--input`}>
        <label
          id={`${mergedI18n.imageFile}-label`}
          className={`${prefix}--label`}
          htmlFor={mergedI18n.imageFile}>
          {mergedI18n.imageFile}
          <input
            id={mergedI18n.imageFile}
            className={`${prefix}--text-input ${prefix}--text__input ${prefix}--text-input--light ${baseClassName}--form-section-image-input`}
            readOnly
            value={cardConfig.content?.id || ''}
          />
        </label>
        <Button className={`${baseClassName}--form-section-image-btn`} size="small" renderIcon={Scale32}>{mergedI18n.editImage}</Button>
      </div>
    </>
  );
};

ImageCardFormItems.propTypes = propTypes;
ImageCardFormItems.defaultProps = defaultProps;

export default ImageCardFormItems;
