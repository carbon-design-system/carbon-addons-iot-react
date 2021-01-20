import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import pick from 'lodash/pick';
import { Image32, Warning24 } from '@carbon/icons-react';
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
import {
  validThresholdIcons,
  validHotspotIcons,
} from '../DashboardEditor/editorUtils';

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
    errorTitle: 'Upload error: ',
    fileTooLarge: 'Image file is too large',
    wrongFileType: (accept) =>
      `This file is not one of the accepted file types, ${accept.join(', ')}`,
  },
  locale: 'en',
  content: {},
  maxFileSizeInBytes: 1048576,
  accept: null,
  validateUploadedImage: null,
  onUpload: () => {},
  onBrowseClick: null,
  renderIconByName: (iconName, iconProps) => {
    // first search the validHotspot Icons
    const matchingHotspotIcon = validHotspotIcons.find(
      (icon) => icon.id === iconName
    );

    // then search the validThresholdIcons
    const matchingThresholdIcon = validThresholdIcons.find(
      (icon) => icon.name === iconName
    );
    const iconToRender = matchingHotspotIcon
      ? React.createElement(matchingHotspotIcon.icon, {
          ...iconProps,
          title: matchingHotspotIcon.text,
        })
      : matchingThresholdIcon
      ? React.cloneElement(matchingThresholdIcon.carbonIcon, {
          ...iconProps,
          title: matchingThresholdIcon.name,
        })
      : React.createElement(Warning24, {
          ...iconProps,
          title: 'Warning',
        });
    // otherwise default to Warning24
    // eslint-disable-next-line react/prop-types
    return <div style={{ color: iconProps.fill }}>{iconToRender}</div>;
  },
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
  maxFileSizeInBytes,
  i18n,
  i18n: { loadingDataLabel },
  renderIconByName,
  locale,
  onUpload,
  validateUploadedImage,
  onBrowseClick,
  ...others
}) => {
  const [imgContent, setImgContent] = useState(content);
  const hotspots = values ? values.hotspots || [] : [];

  const { hasInsertFromUrl } = content || {};
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);

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
      i18n={mergedI18n}>
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
                    maxFileSizeInBytes={maxFileSizeInBytes}
                    onUpload={handleOnUpload}
                    i18n={pick(
                      mergedI18n,
                      'dropContainerLabelText',
                      'dropContainerDescText',
                      'uploadByURLCancel',
                      'uploadByURLButton',
                      'browseImages',
                      'insertUrl',
                      'urlInput',
                      'fileTooLarge',
                      'errorTitle',
                      'wrongFileType'
                    )}
                    hasInsertFromUrl={hasInsertFromUrl}
                    validateUploadedImage={validateUploadedImage}
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
                    i18n={pick(
                      mergedI18n,
                      'zoomIn',
                      'zoomOut',
                      'zoomToFit',
                      'titlePlaceholderText',
                      'titleEditableHintText'
                    )}
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
