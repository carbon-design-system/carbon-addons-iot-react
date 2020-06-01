import React from 'react';
import SimpleBarChart from '@carbon/charts-react/bar-chart-simple';
import StackedBarChart from '@carbon/charts-react/bar-chart-stacked';
import GroupedBarChart from '@carbon/charts-react/bar-chart-grouped';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { BarChartCardPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
import { CARD_SIZES, BAR_CHART_TYPES, BAR_CHART_LAYOUTS } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import { settings } from '../../constants/Settings';
import { valueFormatter } from '../../utils/cardUtilityFunctions';

const { iotPrefix } = settings;

/**
 * Translates our raw data into a language the carbon-charts understand
 * @param {Array<Object>} series, the definition of the plotted series
 * @param {string} series.dataSourceId, the numeric field that identifies the value to display in the main axis
 * @param {string} series.label, the displayed name of the dataset
 * @param {array} values, the array of values from our data layer
 * @param {string} categoryDataSourceId, in case of grouped/stacked charts, the field to group by
 * @param {string} timeDataSourceId, time-based attribute to group by
 * @param {string} type of chart i.e. simple, grouped, stacked
 *
 * @returns {array} of formatted values: [group: string, value: number, key: string, date: date]
 */
export const formatChartData = (series, values, categoryDataSourceId, timeDataSourceId, type) => {
  const data = [];
  if (!isNil(values)) {
    // grouped or stacked
    if (type === BAR_CHART_TYPES.GROUPED || type === BAR_CHART_TYPES.STACKED) {
      let uniqueDatasetNames;
      let groupedData;
      // Get the unique values for each x-label grouping
      if (timeDataSourceId) {
        uniqueDatasetNames = [...new Set(values.map(val => val[timeDataSourceId]))];
        groupedData = uniqueDatasetNames.map(name =>
          values.filter(val => val[timeDataSourceId] === name)
        );
      } else {
        uniqueDatasetNames = [...new Set(values.map(val => val[categoryDataSourceId]))];
        groupedData = uniqueDatasetNames.map(group =>
          values.filter(val => val[categoryDataSourceId] === group)
        );
      }

      groupedData.forEach(group => {
        group.forEach(value => {
          series.forEach(dataset => {
            data.push({
              // if there's a dataset label, use it
              group: dataset.label ? dataset.label : value[categoryDataSourceId], // bar this data belongs to
              value: value[dataset.dataSourceId], // value
              key: timeDataSourceId ? value[timeDataSourceId] : value[categoryDataSourceId],
              ...(timeDataSourceId
                ? { date: new Date(value[timeDataSourceId]) } // timestamp
                : null),
            });
          });
        });
      });
    } // single bars and not time-based
    else if (categoryDataSourceId) {
      const uniqueDatasetNames = [...new Set(values.map(val => val[categoryDataSourceId]))];
      const labeledData = uniqueDatasetNames.map(name =>
        values.filter(val => val[categoryDataSourceId] === name)
      );

      labeledData.forEach(dataset => {
        dataset.forEach(value => {
          data.push({
            group: value[categoryDataSourceId], // bar this data belongs to
            value: value[series[0].dataSourceId], // there should only be one series here because its a simple bar
          });
        });
      });
    } // time-based and not grouped
    else {
      const uniqueDatasetNames = [...new Set(values.map(val => val[timeDataSourceId]))];
      const labeledData = uniqueDatasetNames.map(name =>
        values.filter(val => val[timeDataSourceId] === name)
      );
      labeledData.forEach(dataset => {
        dataset.forEach(value => {
          const dataDate = new Date(value[timeDataSourceId]);
          data.push({
            group: series[0].dataSourceId, // bar this data belongs to
            value: value[series[0].dataSourceId], // there should only be one series here because its a simple bar
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
 * @param {string} categoryDataSourceId attribute to be grouped / categorized by
 * @param {string} timeDatasourceId time-based attribute
 * @param {string} type of chart i.e. simple, grouped, stacked
 *
 * @returns {object} { bottomAxesMapsTo: string, leftAxesMapsTo: string }
 */
export const mapValuesToAxes = (layout, categoryDataSourceId, timeDataSourceId, type) => {
  // Determine which values the axes map to
  let bottomAxesMapsTo;
  let leftAxesMapsTo;
  if (layout === BAR_CHART_LAYOUTS.VERTICAL) {
    // if vertical and time-based
    if (timeDataSourceId) {
      bottomAxesMapsTo = 'date';
      leftAxesMapsTo = 'value';
    } // if vertical and group-based
    else if (categoryDataSourceId && type !== BAR_CHART_TYPES.SIMPLE) {
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
  else if (categoryDataSourceId && type !== BAR_CHART_TYPES.SIMPLE) {
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
 * If there are no colors or incomplete colors set, carbon charts will use their default colors
 * @param {Array} series an array of dataset group classifications
 * @param {Array || string || Object} series[i].color
 * @param {Array<string>} datasetNames unique dataset bar names to be used if color is an object
 *
 * @returns {Object} colors - formatted
 */
export const formatColors = (series, datasetNames) => {
  // first set the carbon charts config defaults
  const colors = { identifier: 'group', scale: {} };
  // if color is an array, order doesn't matter so just map as many as possible
  if (Array.isArray(series[0].color)) {
    series[0].color.forEach((color, index) => {
      colors.scale[datasetNames[index]] = color;
    });
  } else {
    series.forEach(dataset => {
      if (dataset.color) {
        // if its a string, set the color to this line
        if (typeof dataset.color === 'string') {
          colors.scale[dataset.label] = dataset.color;
        } // If its an object, use it, but the keys must match the labels provided from series.label
        else {
          colors.scale = dataset.color;
        }
      }
    });
  }

  return colors;
};

/**
 * Extends default tooltip with additional date information if the graph is time-based
 * @param {object} data data object for this particular datapoint
 * @param {string} defaultTooltip Default HTML generated for this tooltip that needs to be marked up
 * @param {string} timeDatasourceId time-based attribute
 */
export const handleTooltip = (dataOrHoveredElement, defaultTooltip, timeDataSourceId) => {
  // First add the dataset name as the current implementation only shows the value
  let updatedTooltip = defaultTooltip.replace(
    `<p class="value">`,
    `<p class="value">${dataOrHoveredElement.group}: `
  );
  // If theres a time attribute, add an extra list item with the formatted date
  if (timeDataSourceId) {
    const timeStamp = dataOrHoveredElement.date;
    const dateLabel = `<li class='datapoint-tooltip'>
                      <p class='label'>${moment(timeStamp).format('L HH:mm:ss')}</p>
                   </li>`;

    // wrap to make single a multi-tooltip
    updatedTooltip = `<ul class='multi-tooltip'>${dateLabel}<li>${updatedTooltip}</li></ul>`;
  }

  return updatedTooltip;
};

const BarChartCard = ({
  title,
  content: {
    layout = BAR_CHART_LAYOUTS.VERTICAL,
    type = BAR_CHART_TYPES.SIMPLE,
    xLabel,
    yLabel,
    series,
    categoryDataSourceId,
    timeDataSourceId,
    unit,
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
  const chartData = formatChartData(series, values, categoryDataSourceId, timeDataSourceId, type);

  const isAllValuesEmpty = isEmpty(chartData);

  let ChartComponent = SimpleBarChart;
  if (type === BAR_CHART_TYPES.GROUPED) {
    ChartComponent = GroupedBarChart;
  } else if (type === BAR_CHART_TYPES.STACKED) {
    ChartComponent = StackedBarChart;
  }

  const scaleType = timeDataSourceId ? 'time' : 'labels';

  const axes = mapValuesToAxes(layout, categoryDataSourceId, timeDataSourceId, type);

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
                  title: `${xLabel || ''} ${
                    layout === BAR_CHART_LAYOUTS.HORIZONTAL ? (unit ? `(${unit})` : '') : ''
                  }`,
                  scaleType: layout === BAR_CHART_LAYOUTS.VERTICAL ? scaleType : null,
                  stacked:
                    type === BAR_CHART_TYPES.STACKED && layout === BAR_CHART_LAYOUTS.HORIZONTAL,
                  mapsTo: axes.bottomAxesMapsTo,
                },
                left: {
                  title: `${yLabel || ''} ${
                    layout === BAR_CHART_LAYOUTS.VERTICAL ? (unit ? `(${unit})` : '') : ''
                  }`,
                  scaleType: layout === BAR_CHART_LAYOUTS.HORIZONTAL ? scaleType : null,
                  stacked:
                    type === BAR_CHART_TYPES.STACKED && layout === BAR_CHART_LAYOUTS.VERTICAL,
                  mapsTo: axes.leftAxesMapsTo,
                },
              },
              legend: { position: 'bottom', enabled: chartData.length > 1 },
              containerResizable: true,
              color: colors,
              tooltip: {
                valueFormatter: tooltipValue => valueFormatter(tooltipValue, size, unit, locale),
                customHTML: (...args) => handleTooltip(...args, timeDataSourceId, locale),
              },
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
