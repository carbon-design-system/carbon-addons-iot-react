import React from 'react';

import Card from '../Card/Card';
import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';
import { CardPropTypes, StackedAreaChartCardPropTypes } from '../../constants/CardPropTypes';

const propTypes = {
  ...CardPropTypes,
  ...StackedAreaChartCardPropTypes,
};

const defaultProps = {
  size: CARD_SIZES.MEDIUM,
  title: null,
  testId: 'stacked-area-chart-testId',
  content: {
    xLabel: 'x label',
    yLabel: 'y label',
    pairing: {
      option: 1,
    },
    legendPosition: 'bottom',
    curve: 'curveMonotoneX',
  },
  locale: 'en',
  values: [],
};
const StackedAreaChartCard = ({
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
      type={CARD_TYPES.STACKED_AREA_CHART}
      content={content}
      {...others}
    />
  );
};

StackedAreaChartCard.propTypes = propTypes;
StackedAreaChartCard.defaultProps = defaultProps;
export default StackedAreaChartCard;
