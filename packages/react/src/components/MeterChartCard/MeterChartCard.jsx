import React from 'react';

import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';
import { CardPropTypes, MeterChartCardPropTypes } from '../../constants/CardPropTypes';
import Card from '../Card/Card';

const propTypes = {
  ...CardPropTypes,
  ...MeterChartCardPropTypes,
};

const defaultProps = {
  size: CARD_SIZES.MEDIUMWIDE,
  title: '',
  content: {
    peak: null,
    meterTotal: 100,
    meterUnit: 'Unit',
    legendPosition: 'bottom',
    color: {
      pairing: {
        option: 2,
      },
    },
  },
  footerContent: null,
  locale: 'en',
  values: [],
};
const MeterChartCard = ({
  title,
  content,
  values,
  size,
  breakpoint,
  footerContent,
  locale,
  isExpanded,
  isLoading,
  testId,
  i18n,
  ...others
}) => (
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
    type={CARD_TYPES.METER_CHART}
    content={content}
    {...others}
  />
);
MeterChartCard.propTypes = propTypes;
MeterChartCard.defaultProps = defaultProps;
export default MeterChartCard;
