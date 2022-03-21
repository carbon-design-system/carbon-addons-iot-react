import React, { useMemo, useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import { isEmpty, isEqual, defaultsDeep } from 'lodash-es';

import Card from '../Card/Card';
import { AreaChart } from '../AreaChart';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import { CardPropTypes, SparklineChartPropTypes } from '../../constants/CardPropTypes';
import { settings } from '../../constants/Settings';
import { usePrevious } from '../../hooks/usePrevious';
import { getUpdatedCardSize } from '../../utils/cardUtilityFunctions';

const { iotPrefix } = settings;

const propTypes = {
  ...CardPropTypes,
  ...SparklineChartPropTypes,
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
  i18n: { noDataLabel: 'No data available' },
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
  const listRef = useRef(null);
  const chartRef = useRef(null);

  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);

  const newSize = useMemo(() => getUpdatedCardSize(size), [size]);
  const contentWithDefaults = useMemo(() => defaultsDeep({}, content, defaultProps.content), [
    content,
  ]);

  const isChartDataEmpty = isEmpty(values);

  const options = useMemo(
    () => ({
      grid: {
        x: {
          enabled: false,
        },
        y: {
          enabled: false,
        },
      },
      axes: {
        bottom: {
          visible: false,
          title: contentWithDefaults.xLabel,
          mapsTo: contentWithDefaults.xProperty,
          thresholds: contentWithDefaults.xThresholds,
          scaleType: 'time',
        },
        left: {
          visible: false,
          title: contentWithDefaults.yLabel,
          mapsTo: contentWithDefaults.yProperty,
          thresholds: contentWithDefaults.yThresholds,
          scaleType: 'linear',
        },
      },
      color: contentWithDefaults.color,
      points: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      toolbar: {
        enabled: false,
      },
    }),
    [contentWithDefaults]
  );

  const [listHeight, setListHeight] = useState();
  useEffect(() => {
    setListHeight(listRef?.current?.clientHeight);
  }, [listRef]);

  const previousChartData = usePrevious(values);

  /** This is needed to update the chart when the lines and values change */
  useEffect(() => {
    if (chartRef?.current?.chart && !isEqual(values, previousChartData)) {
      chartRef.current.chart.model.setData(values);
    }
  }, [values, previousChartData]);

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
        className={classNames(`${iotPrefix}--sparkline-card--wrapper`, {
          [`${iotPrefix}--sparkline-card--wrapper__expanded`]: isExpanded,
        })}
        style={{
          ...style,
          '--card-list-height':
            contentWithDefaults.listContent?.length > 0 ? `${listHeight}px` : '0px',
        }}
      >
        <AreaChart ref={chartRef} data={values} options={options} />
        {contentWithDefaults.listContent?.length > 0 ? (
          <div ref={listRef} data-testid={`${testId}-list`}>
            {contentWithDefaults.listContent.map(({ label, value }) => (
              <div className={`${iotPrefix}--sparkline-card--wrapper--list`}>
                <p>{label}</p>
                <span>{value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
};
SparklineChartCard.propTypes = propTypes;
SparklineChartCard.defaultProps = defaultProps;
export default SparklineChartCard;
