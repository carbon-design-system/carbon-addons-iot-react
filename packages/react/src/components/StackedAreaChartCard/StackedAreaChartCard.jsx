import React, { useMemo } from 'react';
import classNames from 'classnames';
import { isEmpty, defaultsDeep } from 'lodash-es';

import Card from '../Card/Card';
import { StackedAreaChart } from '../StackedAreaChart';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import { CardPropTypes, StackedAreaPropTypes } from '../../constants/CardPropTypes';
import { getUpdatedCardSize } from '../../utils/cardUtilityFunctions';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  ...CardPropTypes,
  ...StackedAreaPropTypes,
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
  i18n: {
    noDataLabel: 'No data available',
  },
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
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);

  const newSize = useMemo(() => getUpdatedCardSize(size), [size]);
  const isChartDataEmpty = isEmpty(values);
  const contentWithDefaults = useMemo(() => defaultsDeep({}, content, defaultProps.content), [
    content,
  ]);

  const options = useMemo(
    () => ({
      animations: false,
      accessibility: false,
      axes: {
        left: {
          stacked: true,
          title: contentWithDefaults.yLabel,
          mapsTo: contentWithDefaults.yProperty,
          thresholds: contentWithDefaults.yThresholds,
          scaleType: 'linear',
        },
        bottom: {
          title: contentWithDefaults.xLabel,
          mapsTo: contentWithDefaults.xProperty,
          thresholds: contentWithDefaults.xThresholds,
          scaleType: 'time',
        },
      },
      color: contentWithDefaults.color,
      curve: contentWithDefaults.curve,
      toolbar: {
        enabled: false,
      },
      legend: {
        position: contentWithDefaults.legendPosition,
      },
    }),
    [contentWithDefaults]
  );

  return (
    <Card
      title={title}
      size={newSize}
      breakpoint={breakpoint}
      locale={locale}
      isExpanded={isExpanded}
      isEmpty={isChartDataEmpty}
      isLoading={isLoading}
      testId={testId}
      footerContent={!isExpanded ? footerContent : null}
      i18n={mergedI18n}
      {...others}
    >
      <div
        className={classNames(`${iotPrefix}--stacked-area-card--wrapper`, {
          [`${iotPrefix}--stacked-area-card--wrapper__expanded`]: isExpanded,
        })}
      >
        {!isChartDataEmpty ? <StackedAreaChart data={values} options={options} /> : null}
      </div>
    </Card>
  );
};

StackedAreaChartCard.propTypes = propTypes;
StackedAreaChartCard.defaultProps = defaultProps;
export default StackedAreaChartCard;
