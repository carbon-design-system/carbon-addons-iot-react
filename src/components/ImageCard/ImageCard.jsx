import React from 'react';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import Image32 from '@carbon/icons-react/lib/image/32';

import { ImageCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

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
  title,
  content,
  values,
  size,
  onCardAction,
  isEditable,
  isExpanded,
  error,
  isLoading,
  i18n: { loadingDataLabel, ...otherLabels },
  ...others
}) => {
  const { src } = content;
  const hotspots = values ? values.hotspots || [] : [];
  const supportedSizes = [CARD_SIZES.MEDIUM, CARD_SIZES.WIDE, CARD_SIZES.LARGE, CARD_SIZES.XLARGE];
  const supportedSize = supportedSizes.includes(size);
  const availableActions = { expand: supportedSize };

  const isCardLoading = isNil(src) && !isEditable && !error;

  return (
    <Card
      title={title}
      size={size}
      onCardAction={onCardAction}
      availableActions={availableActions}
      isLoading={isCardLoading} // only show the spinner if we don't have an image
      isExpanded={isExpanded}
      {...others}
      error={error}
      i18n={otherLabels}
    >
      {!isCardLoading ? (
        <ContentWrapper>
          {supportedSize ? (
            isEditable ? (
              <EmptyDiv>
                <Image32 width={250} height={250} fill="gray" />
              </EmptyDiv>
            ) : content && src ? (
              <ImageHotspots
                {...content}
                isExpanded={isExpanded}
                hotspots={hotspots}
                isHotspotDataLoading={isLoading}
                loadingHotspotsLabel={loadingDataLabel}
              />
            ) : (
              <p>Error retrieving image.</p>
            )
          ) : (
            <p>Size not supported.</p>
          )}
        </ContentWrapper>
      ) : null}
    </Card>
  );
};

ImageCard.propTypes = propTypes;

ImageCard.defaultProps = defaultProps;

export default ImageCard;
