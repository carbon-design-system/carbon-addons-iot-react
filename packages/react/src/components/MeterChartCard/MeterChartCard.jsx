import React, { useMemo, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { isEmpty, isEqual, defaultsDeep } from 'lodash-es';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { CardPropTypes, MeterChartPropTypes } from '../../constants/CardPropTypes';
import Card from '../Card/Card';
import { MeterChart } from '../MeterChart';
import { settings } from '../../constants/Settings';
import { usePrevious } from '../../hooks/usePrevious';
import { getUpdatedCardSize } from '../../utils/cardUtilityFunctions';

const { iotPrefix } = settings;

const propTypes = {
  ...CardPropTypes,
  ...MeterChartPropTypes,
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
  i18n: {
    noDataLabel: 'No data available',
  },
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
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const chartRef = useRef(null);
  const contentWithDefaults = useMemo(() => defaultsDeep({}, content, defaultProps.content), [
    content,
  ]);

  const isChartDataEmpty = isEmpty(values);

  const options = useMemo(
    () => ({
      animations: false,
      accessibility: true,
      legend: {
        position: contentWithDefaults.legendPosition,
        enabled: values.length > 1,
        truncation: contentWithDefaults.truncation,
      },
      containerResizable: true,
      color: contentWithDefaults.colors,
      meter: {
        peak: contentWithDefaults.peak,
        proportional: {
          total: contentWithDefaults.meterTotal,
          unit: contentWithDefaults.meterUnit,
        },
        status: {
          ranges: [
            ...(contentWithDefaults?.status?.success
              ? [
                  {
                    range: contentWithDefaults.status.success,
                    status: 'success',
                  },
                ]
              : []),
            ...(contentWithDefaults?.status?.warning
              ? [
                  {
                    range: contentWithDefaults.status.warning,
                    status: 'warning',
                  },
                ]
              : []),
            ...(contentWithDefaults?.status?.danger
              ? [
                  {
                    range: contentWithDefaults.status.danger,
                    status: 'danger',
                  },
                ]
              : []),
          ],
        },
      },
      toolbar: {
        enabled: false,
      },
    }),
    [contentWithDefaults, values]
  );
  const newSize = useMemo(() => getUpdatedCardSize(size), [size]);
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
      {!isChartDataEmpty ? (
        <div
          className={classNames(`${iotPrefix}--meter-card--wrapper`, {
            [`${iotPrefix}--meter-card--wrapper__expanded`]: isExpanded,
          })}
        >
          <MeterChart ref={chartRef} data={values} options={options} width="100%" height="100%" />
        </div>
      ) : null}
    </Card>
  );
};
MeterChartCard.propTypes = propTypes;
MeterChartCard.defaultProps = defaultProps;
export default MeterChartCard;
