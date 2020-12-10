import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import pick from 'lodash/pick';
import { Image32 } from '@carbon/icons-react';
import { spacing05 } from '@carbon/layout';

import {
  ImageCardPropTypes,
  CardPropTypes,
} from '../../constants/CardPropTypes';
import { CARD_SIZES, CARD_ACTIONS } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import {
  getResizeHandles,
  getUpdatedCardSize,
} from '../../utils/cardUtilityFunctions';

import ImageHotspots from './ImageHotspots';
import ImageUploader from './ImageUploader';

const ContentWrapper = styled.div`
  height: 100%;
  max-height: 100%;
  padding: 0 ${spacing05} ${spacing05};
`;

const EmptyDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const propTypes = { ...CardPropTypes, ...ImageCardPropTypes };

const defaultProps = {
  i18n: {
    loadingDataLabel: 'Loading hotspot data',
    dropContainerLabelText: 'Drag file here or click to upload file',
    dropContainerDescText:
      'Max file size is 1MB. Supported file types are: APNG, AVIF, GIF, JPEG, PNG, WebP',
    uploadByURLCancel: 'Cancel',
    uploadByURLButton: 'OK',
    browseImages: 'Add from gallery',
    insertUrl: 'Insert from URL',
    urlInput: 'Type or insert URL',
    errorTitle: 'Error: ',
  },
  locale: 'en',
  content: {},
  accept: null,
  onUpload: () => {},
  onBrowseClick: null,
};

const ImageCard = ({
  title,
  content,
  children,
  values,
  size,
  onCardAction,
  availableActions,
  isEditable,
  isExpanded,
  isResizable,
  error,
  isLoading,
  i18n: { loadingDataLabel, ...otherLabels },
  renderIconByName,
  locale,
  onUpload,
  onBrowseClick,
  ...others
}) => {
  const [imgContent, setImgContent] = useState(content);
  const hotspots = values ? values.hotspots || [] : [];

  const { hasInsertFromUrl } = content || {};

  useEffect(() => {
    setImgContent(content);
  }, [content]);

  const handleOnUpload = (imageData) => {
    const newData = {
      ...imgContent,
      src: imageData.dataURL,
      id: imageData.files?.addedFiles[0]?.name,
    };
    onCardAction(others.id, CARD_ACTIONS.ON_CARD_CHANGE, {
      content: {
        id: { $set: newData.id },
        src: { $set: newData.src },
        imgState: { $set: 'new' },
      },
    });
    onUpload(imageData.files);
    setImgContent(newData);
  };

  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const supportedSizes = [
    CARD_SIZES.MEDIUMTHIN,
    CARD_SIZES.MEDIUM,
    CARD_SIZES.MEDIUMWIDE,
    CARD_SIZES.LARGE,
    CARD_SIZES.LARGEWIDE,
  ];
  const supportedSize = supportedSizes.includes(newSize);
  const mergedAvailableActions = { expand: supportedSize, ...availableActions };

  const isCardLoading = isNil(imgContent.src) && !isEditable && !error;
  const resizeHandles = isResizable ? getResizeHandles(children) : [];

  return (
    <Card
      title={title}
      size={newSize}
      onCardAction={onCardAction}
      availableActions={mergedAvailableActions}
      isLoading={isCardLoading} // only show the spinner if we don't have an image
      isExpanded={isExpanded}
      isEditable={isEditable}
      resizeHandles={resizeHandles}
      {...others}
      error={error}
      i18n={otherLabels}>
      {!isCardLoading
        ? (
            // Get width and height from parent card
            { width, height } // eslint-disable-line react/prop-types
          ) => (
            <ContentWrapper>
              {supportedSize ? (
                isEditable && !imgContent.src ? (
                  <ImageUploader
                    onBrowseClick={onBrowseClick}
                    width={width}
                    height={height}
                    onUpload={handleOnUpload}
                    i18n={pick(
                      otherLabels,
                      'dropContainerLabelText',
                      'dropContainerDescText',
                      'uploadByURLCancel',
                      'uploadByURLButton',
                      'browseImages',
                      'insertUrl',
                      'urlInput'
                    )}
                    hasInsertFromUrl={hasInsertFromUrl}
                  />
                ) : imgContent.src ? (
                  <ImageHotspots
                    {...imgContent}
                    width={width - 16 * 2} // Need to adjust for card chrome
                    height={height - (48 + 16)} // Need to adjust for card chrome
                    isExpanded={isExpanded}
                    hotspots={hotspots}
                    isHotspotDataLoading={isLoading}
                    loadingHotspotsLabel={loadingDataLabel}
                    renderIconByName={renderIconByName}
                    locale={locale}
                  />
                ) : (
                  <EmptyDiv>
                    <Image32 width={250} height={250} fill="gray" />
                  </EmptyDiv>
                )
              ) : (
                <p>Size not supported.</p>
              )}
            </ContentWrapper>
          )
        : null}
    </Card>
  );
};

ImageCard.propTypes = propTypes;

ImageCard.defaultProps = defaultProps;

export default ImageCard;
