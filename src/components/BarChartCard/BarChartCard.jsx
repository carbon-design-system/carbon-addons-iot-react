import React from 'react';
import SimpleBarChart from '@carbon/charts-react/bar-chart-simple';
import StackedBarChart from '@carbon/charts-react/bar-chart-stacked';
import GroupedBarChart from '@carbon/charts-react/bar-chart-grouped';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';

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
export const formatChartData = (series, values, groupDataSourceId, timeDataSourceId) => {
  const data = [];
  if (!isNil(values)) {
    if (series.groupDataSourceId || groupDataSourceId) {
      // grouped and stacked
      const groupedDatasets = [
        ...new Set(
          values.map(val => {
            if (groupDataSourceId) {
              return val[groupDataSourceId];
            }
            // old prop
            return val[series.groupDataSourceId];
          })
        ),
      ];

      // Make sure groupedDatasets returned values
      if (!isEmpty(groupedDatasets)) {
        groupedDatasets.forEach(group => {
          if (Array.isArray(series)) {
            // Series is an array of bar datasets
            series.forEach(({ dataSourceId, dataFilter = {}, label }) => {
              const filteredBarData = values.filter(val => val[groupDataSourceId] === group);
              const filteredGroupedBarData = filter(filteredBarData, dataFilter);
              if (!isEmpty(filteredBarData)) {
                filteredGroupedBarData.forEach(barData => {
                  // Time-based
                  if (timeDataSourceId) {
                    data.push({
                      group: label,
                      key: barData[groupDataSourceId],
                      date: new Date(barData[timeDataSourceId]),
                      value: barData[dataSourceId],
                    });
                  } else {
                    // Not time-based
                    data.push({
                      group: label,
                      key: barData[groupDataSourceId],
                      value: barData[dataSourceId],
                    });
                  }
                });
              }
            });
          } // Series is not an array so treat it as a single bar
          else {
            const filteredBarData = values.filter(val => val[groupDataSourceId] === group);
            const filteredGroupedBarData = filter(filteredBarData, series.dataFilter);
            if (!isEmpty(filteredBarData)) {
              filteredGroupedBarData.forEach(barData => {
                // Time-based
                if (timeDataSourceId) {
                  data.push({
                    group: series.label,
                    key: barData[groupDataSourceId],
                    date: new Date(barData[timeDataSourceId]),
                    value: barData[series.dataSourceId],
                  });
                } else {
                  // Not time-based
                  data.push({
                    group: series.label,
                    key: barData[groupDataSourceId],
                    value: barData[series.dataSourceId],
                  });
                }
              });
            }
          }
        });
      }
    } else if (series.timeDataSourceId || timeDataSourceId) {
      // Get unique timestamps
      const timestamps = [...new Set(values.map(val => val[timeDataSourceId]))];
      // timestamp
      if (Array.isArray(series)) {
        // Series is an array of bar datasets
        series.forEach(({ dataSourceId, dataFilter = {}, label }) => {
          if (!isEmpty(timestamps)) {
            timestamps.forEach(timestamp => {
              const filteredData = filter(values, dataFilter);
              if (!isEmpty(filteredData)) {
                filteredData
                  .filter(dataItem => {
                    return (
                      !isNil(dataItem[dataSourceId]) && dataItem[timeDataSourceId] === timestamp
                    );
                  })
                  .forEach(dataItem => {
                    data.push({
                      date: new Date(dataItem[timeDataSourceId]),
                      value: dataItem[dataSourceId],
                      group: label,
                    });
                  });
              }
            });
          }
        });
      } else if (!isEmpty(timestamps)) {
        timestamps.forEach(timestamp => {
          const filteredData = filter(values, series.dataFilter);
          if (!isEmpty(filteredData)) {
            filteredData
              .filter(dataItem => {
                return (
                  !isNil(dataItem[series.dataSourceId]) && dataItem[timeDataSourceId] === timestamp
                );
              })
              .forEach(dataItem => {
                data.push({
                  date: new Date(dataItem[timeDataSourceId]),
                  value: dataItem[series.dataSourceId],
                  group: series.label,
                });
              });
          }
        });
      }
    } else if (Array.isArray(series)) {
      // Series is an array of bar datasets
      series.forEach(({ dataSourceId, dataFilter = {}, label }) => {
        const filteredBarData = filter(values, dataFilter);
        if (!isEmpty(filteredBarData)) {
          filteredBarData.forEach(barData => {
            data.push({
              group: label,
              value: barData[dataSourceId],
            });
          });
        }
      });
    } // Series is not an array so treat it as a single bar
    else {
      const filteredBarData = filter(values, series.dataFilter);
      if (!isEmpty(filteredBarData)) {
        filteredBarData.forEach(barData => {
          data.push({
            group: series.label,
            key: barData[groupDataSourceId],
            value: barData[series.dataSourceId],
          });
        });
      }
    }
  }
  return data;
};

/**
 * Maps values to left and bottom axes based on whether layout is vertical
 * or horizontal, and if the series is grouped or time-based
 *
 * @param {Object} series the definition of the plotted series
 * @param {string} layout vertical or horizontal
 *
 * @returns {object} { bottomAxesMapsTo: string, leftAxesMapsTo: string }
 */
export const mapValuesToAxes = (series, layout, groupDataSourceId, timeDataSourceId) => {
  // Determine which values the axes map to
  let bottomAxesMapsTo;
  let leftAxesMapsTo;
  if (layout === BAR_CHART_LAYOUTS.VERTICAL) {
    // if vertical and time-based
    if (timeDataSourceId) {
      bottomAxesMapsTo = 'date';
      leftAxesMapsTo = 'value';
    } // if vertical and group-based
    else if (groupDataSourceId) {
      bottomAxesMapsTo = 'key';
      leftAxesMapsTo = 'value';
    } // if vertical and not group or time-based
    else {
      bottomAxesMapsTo = 'group';
      leftAxesMapsTo = 'value';
    }
  } // if horizontal and time-based
  else if (timeDataSourceId) {
    bottomAxesMapsTo = 'value';
    leftAxesMapsTo = 'date';
  } // if horizontal and group-based
  else if (groupDataSourceId) {
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
    groupDataSourceId,
    timeDataSourceId,
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
  let chartData;
  if (data) {
    chartData = data;
  } else {
    /** This caches the chart value */
    chartData = formatChartData(series, values, groupDataSourceId, timeDataSourceId);
  }

  const isAllValuesEmpty = isEmpty(chartData);
  console.log(chartData);

  let ChartComponent = SimpleBarChart;

  if (chartType === BAR_CHART_TYPES.GROUPED) {
    ChartComponent = GroupedBarChart;
  } else if (chartType === BAR_CHART_TYPES.STACKED) {
    ChartComponent = StackedBarChart;
  }

  const scaleType = series && (series.timeDataSourceId || timeDataSourceId) ? 'time' : 'labels';

  // Set the colors for each dataset
  const colors = { identifier: 'group', scale: {} };
  // If colors is an array, it is the deprecated format
  // TODO: remove this first conditional block in next major version
  const datasetGroups = [...new Set(chartData.map(dataset => dataset.group))];
  if (series.colors) {
    datasetGroups.forEach((dataset, index) => {
      colors.scale[dataset] = series.colors[index];
    });
  } else if (Array.isArray(series)) {
    series.forEach(dataset => {
      colors.scale[dataset.label] = dataset.color;
    });
  } else {
    colors.scale[series.label] = series.color;
  }

  // console.log(colors);

  const axesMap = mapValuesToAxes(series, layout, groupDataSourceId, timeDataSourceId);

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
