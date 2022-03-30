import React from 'react';

import Card from '../Card/Card';
import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';
import { CardPropTypes, SparklineChartCardPropTypes } from '../../constants/CardPropTypes';

const propTypes = {
  ...CardPropTypes,
  ...SparklineChartCardPropTypes,
};

const defaultProps = {
  size: CARD_SIZES.MEDIUMWIDE,
  title: null,
  content: {
    xLabel: 'x label',
    yLabel: 'y label',
  },
  footerContent: null,
  locale: 'en',
  values: [],
};

const SparklineChartCard = ({
  title,
  values,
  content,
  size,
  breakpoint,
  locale,
  isLoading,
  testId,
  footerContent,
  isExpanded,
  i18n,
  style,
  ...others
}) => {
  return (
    <Card
      title={title}
      size={size}
      breakpoint={breakpoint}
      locale={locale}
      isExpanded={isExpanded}
      isLoading={isLoading}
      testId={testId}
      footerContent={!isExpanded ? footerContent : null}
      i18n={i18n}
      data={values}
      type={CARD_TYPES.SPARKLINE_CHART}
      content={content}
      {...others}
    />
  );
};
SparklineChartCard.propTypes = propTypes;
SparklineChartCard.defaultProps = defaultProps;
export default SparklineChartCard;
