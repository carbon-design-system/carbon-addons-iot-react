import React from 'react';

import { CustomCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
// import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const propTypes = { ...CardPropTypes, ...CustomCardPropTypes };

const defaultProps = {
  i18n: {
    loadingDataLabel: 'Loading data',
  },
  onClick: () => {},
};

const CustomCard = ({
  // title,
  content,
  values,
  size,
  isEditable,
  isExpanded,
  error,
  i18n: { loadingDataLabel, ...otherLabels },
  onClick,
  ...others
}) => {
  // const supportedSizes = [CARD_SIZES.MEDIUM, CARD_SIZES.WIDE, CARD_SIZES.LARGE, CARD_SIZES.XLARGE];
  // const supportedSize = supportedSizes.includes(size);
  // const availableActions = { expand: supportedSize };

  // const isCardLoading = isNil(src) && !isEditable && !error;

  return (
    <Card
      className="customCard"
      // title={title}
      size={size}
      // availableActions={availableActions}
      isExpanded={isExpanded}
      {...others}
      error={error}
      i18n={otherLabels}
      onClick={onClick}
    >
      {content}
    </Card>
  );
};

CustomCard.propTypes = propTypes;

CustomCard.defaultProps = defaultProps;

export default CustomCard;
