import React, { Fragment } from 'react';
import SimpleBarChart from '@carbon/charts-react/bar-chart-simple';
import StackedBarChart from '@carbon/charts-react/bar-chart-stacked';
import GroupedBarChart from '@carbon/charts-react/bar-chart-grouped';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';

import { BarChartCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES, BAR_CHART_TYPES, BAR_CHART_LAYOUTS } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

/**
 * Translates our raw data into a language the carbon-charts understand
 * @param {Object} series, the definition of the plotted series
 * @param {string} series.dataSourceId, the numeric field that identifies the value to display in the main axis
 * @param {string} series.groupDataSourceId, in case of grouped/stacked charts, the field to group by
 * @param {string} series.labelDataSourceId, the field that identifies the value to display in the secondary axis
 * @param {array} series.colors, an array of HEX colors to be used for the chart
 * @param {array} values, the array of values from our data layer
 *
 * @returns {object} with a labels array and a datasets array
 */
export const formatChartData = (series, values) => {
  let labels = [];
  let datasets = [];
  if (!isNil(values)) {
    if (series.groupDataSourceId) {
      // grouped and stacked
      labels = uniqBy(values, series.groupDataSourceId).map(x => x[series.groupDataSourceId]);
      const groupedDatasets = groupBy(values, series.labelDataSourceId);
      Object.keys(groupedDatasets).forEach(dataset => {
        datasets.push({
          label: dataset,
          ...(series.colors && series.colors[datasets.length]
            ? { fillColors: [series.colors[datasets.length]] }
            : {}),
          data: series.timeDataSourceId
            ? groupedDatasets[dataset].map(d => ({
                date: new Date(d[series.timeDataSourceId]),
                value: d[series.dataSourceId],
              }))
            : groupedDatasets[dataset].map(d => d[series.dataSourceId]),
        });
      });
    } else if (series.labelDataSourceId) {
      // single bars
      labels = values.map(v => v[series.labelDataSourceId]);
      datasets = [
        {
          ...(series.colors ? { fillColors: series.colors } : {}),
          data: values.map(v => v[series.dataSourceId]),
        },
      ];
    } else if (series.timeDataSourceId) {
      // timestamp
      labels = values.map(v => v[series.timeDataSourceId]);
      datasets = [
        {
          ...(series.colors ? { fillColors: series.colors } : {}),
          data: values.map(v => ({
            date: new Date(v[series.timeDataSourceId]),
            value: v[series.dataSourceId],
          })),
        },
      ];
    }
  }

  return {
    labels,
    datasets,
  };
};

const BarChartCard = ({
  title,
  content: {
    xLabel,
    yLabel,
    layout = BAR_CHART_LAYOUTS.VERTICAL,
    chartType = BAR_CHART_TYPES.SIMPLE,
    series,
    data, // unmapped in propTypes, feeds already formatted data to the charting library
  },
  size,
  values,
  locale,
  i18n,
  isExpanded,
  isLazyLoading,
  className,
  ...others
}) => {
  let chartData = data;
  if (series && series.dataSourceId && (series.labelDataSourceId || series.timeDataSourceId)) {
    chartData = formatChartData(series, values);
  }

  const isAllValuesEmpty = chartData.datasets.every(set => set.data.every(value => isNil(value)));

  let ChartComponent = SimpleBarChart;

  if (chartType === BAR_CHART_TYPES.GROUPED) {
    ChartComponent = GroupedBarChart;
  } else if (chartType === BAR_CHART_TYPES.STACKED) {
    ChartComponent = StackedBarChart;
  }

  const scaleType = series && series.timeDataSourceId ? 'time' : 'labels';

  return (
    <Card
      title={title}
      className={`${iotPrefix}--bar-chart-card`}
      size={size}
      i18n={i18n}
      {...others}
      isExpanded={isExpanded}
      isEmpty={isAllValuesEmpty}
      isLazyLoading={isLazyLoading}
    >
      {!others.isLoading && !isAllValuesEmpty ? (
        <Fragment>
          <div className={classnames(`${iotPrefix}--bar-chart-container`, className)}>
            <ChartComponent
              data={chartData}
              options={{
                animations: false,
                accessibility: true,
                axes: {
                  bottom: {
                    title: xLabel,
                    scaleType: layout === BAR_CHART_LAYOUTS.VERTICAL ? scaleType : null,
                    primary: true,
                    stacked:
                      chartType === BAR_CHART_TYPES.STACKED &&
                      layout === BAR_CHART_LAYOUTS.HORIZONTAL,
                  },
                  left: {
                    title: yLabel,
                    scaleType: layout === BAR_CHART_LAYOUTS.HORIZONTAL ? scaleType : null,
                    secondary: true,
                    stacked:
                      chartType === BAR_CHART_TYPES.STACKED &&
                      layout === BAR_CHART_LAYOUTS.VERTICAL,
                  },
                },
                legend: { position: 'bottom', enabled: chartData.datasets.length > 1 },
                containerResizable: true,
                tooltip: {
                  gridline: {
                    enabled: false,
                  },
                },
              }}
              width="100%"
              height="100%"
            />
          </div>
        </Fragment>
      ) : null}
    </Card>
  );
};

BarChartCard.propTypes = { ...CardPropTypes, ...BarChartCardPropTypes };

BarChartCard.defaultProps = {
  size: CARD_SIZES.MEDIUMWIDE,
};

export default BarChartCard;
