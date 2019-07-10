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
  return (
    <Card title={title} size={size} {...others}>
      {!others.isLoading ? (
        <ContentWrapper>
          <ImageHotspots src={image.src} alt={image.alt} />
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
