import React from 'react';
import SimpleBarChart from '@carbon/charts-react/bar-chart-simple';
import StackedBarChart from '@carbon/charts-react/bar-chart-stacked';
import GroupedBarChart from '@carbon/charts-react/bar-chart-grouped';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';

import { BarChartCardPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
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
  const data = [];
  if (!isNil(values)) {
    if (series.groupDataSourceId) {
      // grouped and stacked
      const groupedDatasets = groupBy(values, series.labelDataSourceId);
      if (!isEmpty(groupedDatasets)) {
        console.log(groupedDatasets);
        Object.keys(groupedDatasets).forEach(dataset => {
          groupedDatasets[dataset].forEach(d => {
            // Time-based
            if (series.timeDataSourceId) {
              data.push({
                group: dataset,
                key: d[series.groupDataSourceId],
                date: new Date(d[series.timeDataSourceId]),
                value: d[series.dataSourceId],
              });
            } else {
              // Not time-based
              data.push({
                group: dataset,
                key: d[series.groupDataSourceId],
                value: d[series.dataSourceId],
              });
            }
          });
        });
      }
    } else if (series.labelDataSourceId) {
      values.forEach(v => {
        data.push({
          group: v[series.labelDataSourceId],
          value: v[series.dataSourceId],
        });
      });
    } else if (series.timeDataSourceId) {
      // timestamp
      values.forEach(v => {
        data.push({
          group: v[series.dataSourceId],
          date: new Date(v[series.timeDataSourceId]),
          value: v[series.dataSourceId],
        });
      });
    }
  }
  return data;
};

export const mapValuesToAxes = (series, layout) => {
  // Determine which values the axes map to
  let bottomAxesMapsTo;
  let leftAxesMapsTo;
  if (layout === BAR_CHART_LAYOUTS.VERTICAL) {
    if (series?.timeDataSourceId) {
      bottomAxesMapsTo = 'date';
      leftAxesMapsTo = 'group';
    } else if (series?.groupDataSourceId) {
      bottomAxesMapsTo = 'key';
      leftAxesMapsTo = 'value';
    } // not group or time-based
    else {
      bottomAxesMapsTo = 'group';
      leftAxesMapsTo = 'value';
    }
  } // if horizontal and time-based
  else if (series?.timeDataSourceId) {
    bottomAxesMapsTo = 'group';
    leftAxesMapsTo = 'date';
  } else if (series?.groupDataSourceId) {
    bottomAxesMapsTo = 'value';
    leftAxesMapsTo = 'key';
  } // if horizontal, not time-based or group
  else {
    bottomAxesMapsTo = 'value';
    leftAxesMapsTo = 'group';
  }

  return {
    bottomAxesMapsTo,
    leftAxesMapsTo,
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
  const isAllValuesEmpty = isEmpty(chartData);
  console.log(chartData);

  let ChartComponent = SimpleBarChart;

  if (chartType === BAR_CHART_TYPES.GROUPED) {
    ChartComponent = GroupedBarChart;
  } else if (chartType === BAR_CHART_TYPES.STACKED) {
    ChartComponent = StackedBarChart;
  }

  const scaleType = series && series.timeDataSourceId ? 'time' : 'labels';

  // // Set the colors for each dataset
  // const colors = { identifier: 'group', scale: {} };
  // series.forEach(dataset => {
  //   colors.scale[dataset.label] = dataset.color;
  // });

  const axesMap = mapValuesToAxes(series, layout);
  // console.log(bottomAxesMapsTo);
  // console.log(leftAxesMapsTo);

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
        <div className={classnames(`${iotPrefix}--bar-chart-container`, className)}>
          <ChartComponent
            data={chartData}
            options={{
              animations: false,
              accessibility: true,
              axes: {
                bottom: {
                  title: xLabel,
                  mapsTo: axesMap.bottomAxesMapsTo,
                  scaleType: layout === BAR_CHART_LAYOUTS.VERTICAL ? scaleType : null,
                  stacked:
                    chartType === BAR_CHART_TYPES.STACKED &&
                    layout === BAR_CHART_LAYOUTS.HORIZONTAL,
                },
                left: {
                  title: yLabel,
                  mapsTo: axesMap.leftAxesMapsTo,
                  scaleType: layout === BAR_CHART_LAYOUTS.HORIZONTAL ? scaleType : null,
                  stacked:
                    chartType === BAR_CHART_TYPES.STACKED && layout === BAR_CHART_LAYOUTS.VERTICAL,
                },
              },
              legend: { position: 'bottom', enabled: chartData.length > 1 },
              containerResizable: true,
              tooltip: {
                gridline: {
                  enabled: false,
                },
              },
              // color: colors,
            }}
            width="100%"
            height="100%"
          />
        </div>
      ) : null}
    </Card>
  );
};

BarChartCard.propTypes = { ...CardPropTypes, ...BarChartCardPropTypes };

BarChartCard.defaultProps = {
  size: CARD_SIZES.MEDIUMWIDE,
};

export default BarChartCard;
