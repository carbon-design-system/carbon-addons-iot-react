import React from 'react';
import SimpleBarChart from '@carbon/charts-react/bar-chart-simple';
import StackedBarChart from '@carbon/charts-react/bar-chart-stacked';
import GroupedBarChart from '@carbon/charts-react/bar-chart-grouped';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import capitalize from 'lodash/capitalize';

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
 * @returns {array} of formatted values: [group: string, value: number, key: string, date: date]
 */
export const formatChartData = (series, values) => {
  const data = [];
  if (!isNil(values)) {
    if (series.groupDataSourceId) {
      // grouped and stacked
      const uniqueGroupNames = [...new Set(values.map(val => val[series.groupDataSourceId]))];
      const groupedData = uniqueGroupNames.map(group =>
        values.filter(val => val[series.groupDataSourceId] === group)
      );

      groupedData.forEach(group => {
        group.forEach(value => {
          data.push({
            group: value[series.labelDataSourceId], // bar
            value: value[series.dataSourceId], // value
            key: value[series.groupDataSourceId],
            ...(series.timeDataSourceId
              ? { date: new Date(value[series.timeDataSourceId]) } // timestamp
              : null),
          });
        });
      });
    } else if (series.labelDataSourceId) {
      // single bars
      const uniqueDatasetNames = [...new Set(values.map(val => val[series.labelDataSourceId]))];
      const labeledData = uniqueDatasetNames.map(name =>
        values.filter(val => val[series.labelDataSourceId] === name)
      );

      labeledData.forEach(dataset => {
        dataset.forEach(value => {
          data.push({
            group: value[series.labelDataSourceId], // bar
            value: value[series.dataSourceId], // value
          });
        });
      });
    } else if (series.timeDataSourceId) {
      // timestamp
      const uniqueDatasetNames = [...new Set(values.map(val => val[series.timeDataSourceId]))];
      const labeledData = uniqueDatasetNames.map(name =>
        values.filter(val => val[series.timeDataSourceId] === name)
      );
      labeledData.forEach(dataset => {
        dataset.forEach(value => {
          const dataDate = new Date(value[series.timeDataSourceId]);
          data.push({
            group: capitalize(series.dataSourceId), // bar
            value: value[series.dataSourceId], // value
            date: dataDate, // timestamp
          });
        });
      });
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
export const mapValuesToAxes = (series, layout) => {
  // Determine which values the axes map to
  let bottomAxesMapsTo;
  let leftAxesMapsTo;
  if (layout === BAR_CHART_LAYOUTS.VERTICAL) {
    // if vertical and time-based
    if (series.timeDataSourceId) {
      bottomAxesMapsTo = 'date';
      leftAxesMapsTo = 'value';
    } // if vertical and group-based
    else if (series.groupDataSourceId) {
      bottomAxesMapsTo = 'key';
      leftAxesMapsTo = 'value';
    } // if vertical and not group or time-based
    else {
      bottomAxesMapsTo = 'group';
      leftAxesMapsTo = 'value';
    }
  } // if horizontal and time-based
  else if (series.timeDataSourceId) {
    bottomAxesMapsTo = 'value';
    leftAxesMapsTo = 'date';
  } // if horizontal and group-based
  else if (series.groupDataSourceId) {
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

/**
 * Formats and maps the colors to their corresponding datasets in the carbon charts tabular data format
 * @param {Array} series an array of dataset group classifications
 * @param {Array<string>} datasetNames unique dataset bar names
 * @returns {Object} colors - formatted
 */
export const formatColors = (series, datasetNames) => {
  const colors = { identifier: 'group', scale: {} };
  if (series.colors) {
    series.colors.forEach((color, index) => {
      colors.scale[datasetNames[index]] = color;
    });
  }
  return colors;
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

  let ChartComponent = SimpleBarChart;

  if (chartType === BAR_CHART_TYPES.GROUPED) {
    ChartComponent = GroupedBarChart;
  } else if (chartType === BAR_CHART_TYPES.STACKED) {
    ChartComponent = StackedBarChart;
  }

  const scaleType = series && series.timeDataSourceId ? 'time' : 'labels';

  const axes = mapValuesToAxes(series, layout);

  // Set the colors for each dataset
  const uniqueDatasets = [...new Set(chartData.map(dataset => dataset.group))];
  const colors = formatColors(series, uniqueDatasets);

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
                  scaleType: layout === BAR_CHART_LAYOUTS.VERTICAL ? scaleType : null,
                  stacked:
                    chartType === BAR_CHART_TYPES.STACKED &&
                    layout === BAR_CHART_LAYOUTS.HORIZONTAL,
                  mapsTo: axes.bottomAxesMapsTo,
                },
                left: {
                  title: yLabel,
                  scaleType: layout === BAR_CHART_LAYOUTS.HORIZONTAL ? scaleType : null,
                  stacked:
                    chartType === BAR_CHART_TYPES.STACKED && layout === BAR_CHART_LAYOUTS.VERTICAL,
                  mapsTo: axes.leftAxesMapsTo,
                },
              },
              legend: { position: 'bottom', enabled: chartData.length > 1 },
              containerResizable: true,
              tooltip: {
                gridline: {
                  enabled: false,
                },
              },
              color: colors,
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
