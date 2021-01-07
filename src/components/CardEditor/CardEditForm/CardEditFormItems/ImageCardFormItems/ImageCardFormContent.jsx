import React from 'react';
import PropTypes from 'prop-types';
// import { Scale32 } from '@carbon/icons-react';
import { Close16 } from '@carbon/icons-react';
import { Button } from 'carbon-components-react';
import omit from 'lodash/omit';

import { settings } from '../../../../../constants/Settings';
import ContentFormItemTitle from '../ContentFormItemTitle';

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
  }),
  /* callback when image input value changes (File object) */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    imageFile: PropTypes.string,
    editImage: PropTypes.string,
    image: PropTypes.string,
    close: PropTypes.string,
    dataItemEditorSectionImageTooltipText: PropTypes.string,
  }),
  /** optional link href's for each card type that will appear in a tooltip */
  dataSeriesItemLinks: PropTypes.shape({
    image: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    imageFile: 'Image file',
    editImage: 'Edit image',
    image: 'Image',
    close: 'Close',
    dataItemEditorSectionImageTooltipText:
      'Add tooltips to hotspots on the image. Show metric or dimension values on the tooltips.',
  },
  dataSeriesItemLinks: null,
};

const ImageCardFormItems = ({
  cardConfig,
  i18n,
  onChange,
  dataSeriesItemLinks,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${iotPrefix}--card-edit-form`;
  return (
    <>
      <ContentFormItemTitle
        title={mergedI18n.image}
        tooltip={{
          tooltipText: mergedI18n.dataItemEditorSectionImageTooltipText,
          ...(dataSeriesItemLinks?.image
            ? {
                linkText: mergedI18n.dataItemEditorSectionTooltipLinkText,
                href: dataSeriesItemLinks.image,
              }
            : {}),
        }}
      />
      <div className={`${baseClassName}--form-section-image--input`}>
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
          {cardConfig.content?.id ? (
            <Button
              kind="ghost"
              renderIcon={Close16}
              size="field"
              iconDescription={mergedI18n.close}
              className={`${baseClassName}--form-section ${baseClassName}--form-section-image-clear-button`}
              onClick={() =>
                // close means clear the image info out of the JSON
                onChange(
                  omit(
                    cardConfig,
                    'content.id',
                    'content.src',
                    'content.alt',
                    'content.imgState'
                  )
                )
              }
            />
          ) : null}
        </label>
        {/* TODO enable once hotspot editing is live <Button
          className={`${baseClassName}--form-section-image-btn`}
          size="small"
          renderIcon={Scale32}>
          {mergedI18n.editImage}
        </Button> */}
      </div>
    </>
  );
};

ImageCardFormItems.propTypes = propTypes;
ImageCardFormItems.defaultProps = defaultProps;

export default ImageCardFormItems;
