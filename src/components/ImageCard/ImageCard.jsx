import React from 'react';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import Image32 from '@carbon/icons-react/es/image/32';

import { ImageCardPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import { getUpdatedCardSize, handleVariables } from '../../utils/cardUtilityFunctions';

import ImageHotspots from './ImageHotspots';

const ContentWrapper = styled.div`
  height: 100%;
  max-height: 100%;
  padding: 0 16px 16px 16px;
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
  },
};

const ImageCard = ({
  title: titleProp,
  content: contentProp,
  values: valuesProp,
  size,
  onCardAction,
  isEditable,
  isExpanded,
  error,
  isLoading,
  i18n: { loadingDataLabel, ...otherLabels },
  renderIconByName,
  ...others
}) => {
  const { title, content, values } = handleVariables(
    CARD_TYPES.IMAGE,
    titleProp,
    contentProp,
    valuesProp,
    others
  );
  const { src } = content;
  const hotspots = values ? values.hotspots || [] : [];

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
  const availableActions = { expand: supportedSize };

  const isCardLoading = isNil(src) && !isEditable && !error;

  return (
    <Card
      title={title}
      size={newSize}
      onCardAction={onCardAction}
      availableActions={availableActions}
      isLoading={isCardLoading} // only show the spinner if we don't have an image
      isExpanded={isExpanded}
      {...others}
      error={error}
      i18n={otherLabels}
    >
      {!isCardLoading
        ? (
            // Get width and height from parent card
            { width, height } // eslint-disable-line
          ) => (
            <ContentWrapper>
              {supportedSize ? (
                isEditable ? (
                  <EmptyDiv>
                    <Image32 width={250} height={250} fill="gray" />
                  </EmptyDiv>
                ) : content && src ? (
                  <ImageHotspots
                    {...content}
                    width={width - 16 * 2} // Need to adjust for card chrome
                    height={height - (48 + 16)} // Need to adjust for card chrome
                    isExpanded={isExpanded}
                    hotspots={hotspots}
                    isHotspotDataLoading={isLoading}
                    loadingHotspotsLabel={loadingDataLabel}
                    renderIconByName={renderIconByName}
                  />
                ) : (
                  <p>Error retrieving image.</p>
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
