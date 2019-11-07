import React from 'react';
import styled from 'styled-components';

import { CustomCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
// import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const ContentWrapper = styled.div`
  height: 100%;
  max-height: 100%;
  padding: 16px 16px 16px 16px;
`;

const propTypes = { ...CardPropTypes, ...CustomCardPropTypes };

const defaultProps = {
  i18n: {
    loadingDataLabel: 'Loading data',
  },
  cardClick: () => {},
};

const CustomCard = ({
  // title,
  content,
  values,
  size,
  onCardAction,
  isEditable,
  isExpanded,
  error,
  i18n: { loadingDataLabel, ...otherLabels },
  cardClick,
  ...others
}) => {
  const { element } = content;
  // const supportedSizes = [CARD_SIZES.MEDIUM, CARD_SIZES.WIDE, CARD_SIZES.LARGE, CARD_SIZES.XLARGE];
  // const supportedSize = supportedSizes.includes(size);
  // const availableActions = { expand: supportedSize };

  // const isCardLoading = isNil(src) && !isEditable && !error;

  return (
    <Card
      className="customCard"
      // title={title}
      size={size}
      onCardAction={onCardAction}
      // availableActions={availableActions}
      isExpanded={isExpanded}
      {...others}
      error={error}
      i18n={otherLabels}
      onClick={() => cardClick()}
    >
      <ContentWrapper>{element}</ContentWrapper>
    </Card>
  );
};

CustomCard.propTypes = propTypes;

CustomCard.defaultProps = defaultProps;

export default CustomCard;
