import React from 'react';
import styled from 'styled-components';
import ImageHotspots from 'react-image-hotspots';

import { ImageCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const ContentWrapper = styled.div`
  height: 100%;
  max-height: 100%;
  padding: 0 16px 16px 16px;
`;

const ImageCard = ({ title, content, content: { data: image }, size, ...others }) => {
  const supportedSizes = [CARD_SIZES.MEDIUM, CARD_SIZES.WIDE, CARD_SIZES.LARGE, CARD_SIZES.XLARGE];
  const supportedSize = supportedSizes.includes(size);
  const availableActions = { expand: supportedSize };

  return (
    <Card title={title} size={size} availableActions={availableActions} {...others}>
      {!others.isLoading ? (
        <ContentWrapper>
          {supportedSize ? (
            image && image.src ? (
              <ImageHotspots src={image.src} alt={image.alt} />
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
