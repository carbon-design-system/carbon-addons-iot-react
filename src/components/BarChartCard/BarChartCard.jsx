import React from 'react';
import SimpleBarChart from '@carbon/charts-react/bar-chart-simple';
import StackedBarChart from '@carbon/charts-react/bar-chart-stacked';
import GroupedBarChart from '@carbon/charts-react/bar-chart-grouped';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import memoize from 'lodash/memoize';

import { BarChartCardPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
import { CARD_SIZES, BAR_CHART_TYPES, BAR_CHART_LAYOUTS } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import { settings } from '../../constants/Settings';
import { chartValueFormatter, handleCardVariables } from '../../utils/cardUtilityFunctions';
import StatefulTable from '../Table/StatefulTable';
import { csvDownloadHandler } from '../../utils/componentUtilityFunctions';

import {
  generateSampleValues,
  formatChartData,
  mapValuesToAxes,
  formatColors,
  handleTooltip,
  generateTableColumns,
  formatTableData,
} from './barChartUtils';

const { iotPrefix } = settings;

const memoizedGenerateSampleValues = memoize(generateSampleValues);

const BarChartCard = ({
  title: titleProp,
  content,
  size: sizeProp,
  values: initialValues,
  locale,
  i18n,
  isExpanded,
  isLazyLoading,
  isEditable,
  isLoading,
  interval,
  className,
  domainRange,
  ...others
}) => {
  const { noDataLabel } = i18n;
  const {
    title,
    content: {
      series,
      timeDataSourceId,
      categoryDataSourceId,
      layout = BAR_CHART_LAYOUTS.VERTICAL,
      xLabel,
      yLabel,
      unit,
      type = BAR_CHART_TYPES.SIMPLE,
    },
    values: valuesProp,
  } = handleCardVariables(titleProp, content, initialValues, others);

  // Charts render incorrectly if size is too small, so change their size to MEDIUM
  let size = sizeProp;
  if (sizeProp === CARD_SIZES.SMALL) {
    size = CARD_SIZES.MEDIUM;
  } else if (sizeProp === CARD_SIZES.SMALLWIDE) {
    size = CARD_SIZES.MEDIUMWIDE;
  }

  // If editable, show sample presentation data
  const values = isEditable
    ? memoizedGenerateSampleValues(series, timeDataSourceId, interval, categoryDataSourceId)
    : valuesProp;

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
  const colors = formatColors(series, uniqueDatasets, isEditable);

  let tableColumns = [];
  let tableData = [];

  if (!isAllValuesEmpty) {
    tableColumns = tableColumns.concat(
      generateTableColumns(
        timeDataSourceId,
        categoryDataSourceId,
        type,
        uniqueDatasets,
        i18n.defaultFilterStringPlaceholdText
      )
    );

    tableData = tableData.concat(
      formatTableData(timeDataSourceId, categoryDataSourceId, type, values, chartData)
    );
  }

  return (
    <Card
      title={title}
      className={`${iotPrefix}--bar-chart-card`}
      size={size}
      i18n={i18n}
      isExpanded={isExpanded}
      isEmpty={isAllValuesEmpty}
      isLazyLoading={isLazyLoading}
      isEditable={isEditable}
      isLoading={isLoading}
      {...others}
    >
      {!isAllValuesEmpty ? (
        <div
          className={classnames(
            `${iotPrefix}--bar-chart-container`,
            {
              [`${iotPrefix}--bar-chart-container--expanded`]: isExpanded,
              [`${iotPrefix}--bar-chart-container--editable`]: isEditable,
            },
            className
          )}
        >
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
                    type === BAR_CHART_TYPES.STACKED &&
                    layout === BAR_CHART_LAYOUTS.HORIZONTAL &&
                    timeDataSourceId,
                  mapsTo: axes.bottomAxesMapsTo,
                  ...(domainRange && layout === BAR_CHART_LAYOUTS.VERTICAL
                    ? { domain: domainRange }
                    : {}),
                },
                left: {
                  title: `${yLabel || ''} ${
                    layout === BAR_CHART_LAYOUTS.VERTICAL ? (unit ? `(${unit})` : '') : ''
                  }`,
                  scaleType: layout === BAR_CHART_LAYOUTS.HORIZONTAL ? scaleType : null,
                  stacked:
                    type === BAR_CHART_TYPES.STACKED && layout === BAR_CHART_LAYOUTS.VERTICAL,
                  mapsTo: axes.leftAxesMapsTo,
                  ...(domainRange && layout === BAR_CHART_LAYOUTS.HORIZONTAL && timeDataSourceId
                    ? { domain: domainRange }
                    : {}),
                },
              },
              legend: { position: 'bottom', enabled: chartData.length > 1, clickable: !isEditable },
              containerResizable: true,
              color: colors,
              tooltip: {
                valueFormatter: tooltipValue =>
                  chartValueFormatter(tooltipValue, size, unit, locale),
                customHTML: (...args) => handleTooltip(...args, timeDataSourceId, colors, locale),
              },
            }}
            width="100%"
            height="100%"
          />
          {isExpanded ? (
            <StatefulTable
              className={`${iotPrefix}--bar-chart-card--stateful-table`}
              columns={tableColumns}
              data={tableData}
              options={{
                hasPagination: true,
                hasSearch: true,
                hasFilter: true,
              }}
              actions={{
                toolbar: {
                  onDownloadCSV: filteredData => csvDownloadHandler(filteredData, title),
                },
              }}
              view={{
                pagination: {
                  pageSize: 10,
                  pageSizes: [10, 20, 30],
                },
                toolbar: {
                  activeBar: null,
                },
                filters: [],
                table: {
                  sort: {
                    columnId: timeDataSourceId,
                    direction: 'DESC',
                  },
                  emptyState: {
                    message: noDataLabel,
                  },
                },
              }}
              i18n={i18n}
            />
          ) : null}
        </div>
      ) : null}
    </Card>
  );
};

BarChartCard.propTypes = { ...CardPropTypes, ...BarChartCardPropTypes };

BarChartCard.defaultProps = {
  size: CARD_SIZES.MEDIUMWIDE,
  i18n: {
    noDataLabel: 'No data',
  },
  domainRange: null,
  content: {
    type: BAR_CHART_TYPES.SIMPLE,
    layout: BAR_CHART_LAYOUTS.VERTICAL,
  },
  locale: 'en',
};

export default BarChartCard;
