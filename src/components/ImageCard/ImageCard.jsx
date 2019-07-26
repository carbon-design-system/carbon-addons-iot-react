import React from 'react';
import styled from 'styled-components';
import ImageHotspots from 'react-image-hotspots';
import Image32 from '@carbon/icons-react/lib/image/32';

import { ImageCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const ContentWrapper = styled.div`
  height: 100%;
  max-height: 100%;
  padding: 0 16px 16px 16px;
`;

const ImageCard = ({ title, content, size, onCardAction, isEditable, ...others }) => {
  const { src, alt, hotspots } = content;
  const supportedSizes = [CARD_SIZES.MEDIUM, CARD_SIZES.WIDE, CARD_SIZES.LARGE, CARD_SIZES.XLARGE];
  const supportedSize = supportedSizes.includes(size);
  const availableActions = { expand: supportedSize };

  return (
    <Card
      title={title}
      size={size}
      onCardAction={onCardAction}
      availableActions={availableActions}
      {...others}
    >
      {!others.isLoading ? (
        <ContentWrapper>
          {supportedSize ? (
            isEditable && !src ? (
              <Image32 width="100%" height="100%" />
            ) : content && src ? (
              <ImageHotspots src={src} alt={alt} hotspots={hotspots} hideFullscreenControl />
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

ImageCard.propTypes = { ...CardPropTypes, ...ImageCardPropTypes };

ImageCard.defaultProps = {
  size: CARD_SIZES.XLARGE,
};

export default ImageCard;
