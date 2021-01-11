import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Close16, Scale32 } from '@carbon/icons-react';
import { Button } from 'carbon-components-react';
import omit from 'lodash/omit';

import { DataItemsPropTypes } from '../../../../DashboardEditor/editorUtils';
import HotspotEditorModal from '../../../../HotspotEditorModal/HotspotEditorModal';
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
  }),
  /* callback when image cardConfig needs to be updated */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    imageFile: PropTypes.string,
    editImage: PropTypes.string,
    image: PropTypes.string,
    close: PropTypes.string,
  }),
  /** an array of dataItems to be included on each card */
  dataItems: DataItemsPropTypes,
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    imageFile: 'Image file',
    editImage: 'Edit image',
    image: 'Image',
    close: 'Close',
  },
  dataItems: [],
  availableDimensions: {},
};

const ImageCardFormItems = ({
  cardConfig,
  i18n,
  onChange,
  dataItems,
  availableDimensions,
}) => {
  const [isHotspotModalShowing, setIsHotspotModalShowing] = useState(false);
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${iotPrefix}--card-edit-form`;
  const handleShowHotspotEditor = useCallback(() => {
    // if this image card doesn't have a hotspots field, set it
    if (!cardConfig.values) {
      onChange({ ...cardConfig, values: { hotspots: [] } });
    }
    setIsHotspotModalShowing(true);
  }, [cardConfig, onChange]);
  const handleCloseHotspotEditor = useCallback(
    () => setIsHotspotModalShowing(false),
    []
  );

  const handleSaveHotspotEditor = useCallback(
    (cardConfigWithHotspots) => {
      handleCloseHotspotEditor();
      onChange(cardConfigWithHotspots);
    },
    [handleCloseHotspotEditor, onChange]
  );
  return (
    <>
      {isHotspotModalShowing ? (
        <HotspotEditorModal
          cardConfig={cardConfig}
          dataItems={dataItems}
          availableDimensions={availableDimensions}
          onSave={handleSaveHotspotEditor}
          onClose={handleCloseHotspotEditor}
          // TODO go get the hotspots from the real data layer
          onFetchDynamicHotspots={() => Promise.resolve([{ x: 10, y: 10 }])}
        />
      ) : null}
      <div
        className={`${baseClassName}--form-section ${baseClassName}--form-section-image`}>
        {mergedI18n.image}
      </div>
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
        {cardConfig.content?.id ? (
          <Button
            className={`${baseClassName}--form-section-image-btn`}
            size="small"
            renderIcon={Scale32}
            onClick={handleShowHotspotEditor}>
            {mergedI18n.editImage}
          </Button>
        ) : null}
      </div>
    </>
  );
};

ImageCardFormItems.propTypes = propTypes;
ImageCardFormItems.defaultProps = defaultProps;

export default ImageCardFormItems;
