import React, { useMemo } from 'react';
import PieChart from '@carbon/charts-react/pie-chart';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import assign from 'lodash/assign';

import { PieCardPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';
import {
  getResizeHandles,
  handleCardVariables,
  increaseSmallCardSize,
} from '../../utils/cardUtilityFunctions';
import {
  csvDownloadHandler,
  getOverrides,
} from '../../utils/componentUtilityFunctions';
import Card from '../Card/Card';
import Table from '../Table/Table';

const { iotPrefix } = settings;

const getColor = (colors, datasetLabel, label, data, defaultStrokeColor) => {
  return colors ? colors[datasetLabel] : defaultStrokeColor;
};

const generateSampleData = (sampleSlicesCount, groupDataSourceId) => {
  const sample = Array(sampleSlicesCount)
    .fill(0)
    .map((obj, index) => ({
      [groupDataSourceId]: `Sample ${index}`,
      value: Math.floor(Math.random() * 10) + 1,
    }));
  return sample;
};

const getColorsForSampleData = (colorsProp, sampleValues, groupDataSourceId) => {
  const colorValues = Object.values(colorsProp);
  const sampleColors = Object.create(null);
  sampleValues.forEach((sliceData, index) => {
    const key = sliceData[groupDataSourceId];
    sampleColors[key] = colorValues[index];
  });
  return sampleColors;
};

const generateTableRows = (id, values, groupDataSourceId) => {
  const tableRowValues = Object.fromEntries(
    values.map(({ value, [groupDataSourceId]: columnName }) => [columnName, value])
  );
  return isEmpty(values) ? [] : [{ id: `${id}-table-row`, values: tableRowValues }];
};

const generateTableColumns = (values, groupDataSourceId) => {
  return values.map((slice) => ({
    id: slice[groupDataSourceId],
    name: slice[groupDataSourceId],
  }));
};

const propTypes = { ...CardPropTypes, ...PieCardPropTypes };

const defaultProps = {
  size: CARD_SIZES.MEDIUMWIDE,
  i18n: {
    noDataLabel: 'No data',
  },
  content: {
    colors: undefined,
    groupDataSourceId: 'group',
    legendPosition: 'bottom',
  },
  overrides: undefined,
};

const PieChartCard = ({
  children,
  content,
  i18n: { noDataLabel },
  i18n,
  id,
  isExpanded,
  isEditable,
  isLoading,
  isResizable,
  overrides,
  size: sizeProp,
  title: titleProp,
  values: initialValuesProp,
  testID,
  ...others
}) => {
  const contentWithDefaults = assign({}, PieChartCard.defaultProps.content, content);
  const {
    title,
    content: {
      colors: colorsProp,
      customTooltip,
      groupDataSourceId,
      labelsFormatter,
      legendPosition,
    },
    values: valuesProp,
  } = handleCardVariables(titleProp, contentWithDefaults, initialValuesProp, others);

  const values = useMemo(() => {
    const sampleSlicesCount = colorsProp ? Object.keys(colorsProp).length : 4;
    return isEditable
      ? generateSampleData(sampleSlicesCount, groupDataSourceId)
      : valuesProp;
  }, [colorsProp, groupDataSourceId, valuesProp, isEditable]);

  const colors =
    isEditable && colorsProp
      ? getColorsForSampleData(colorsProp, values, groupDataSourceId)
      : colorsProp;

  const resizeHandles = isResizable ? getResizeHandles(children) : [];

  const chartProps = {
    // Changes to some options does not update the chart so we modify the key for these
    // specific props, please see https://github.com/carbon-design-system/carbon-charts/issues/817
    key: `pie-chart-${groupDataSourceId}-${legendPosition}-${isEditable}-${sizeProp}`,
    data: values,
    options: {
      accessibility: true,
      animations: false,
      data: {
        groupMapsTo: groupDataSourceId,
        loading: isLoading,
      },
      getFillColor: (...args) => getColor(colors, ...args),
      getStrokeColor: (...args) => getColor(colors, ...args),
      legend: {
        alignment: 'center',
        position: legendPosition,
        enabled: values.length > 1,
        clickable: !isEditable,
      },
      pie: {
        labels: {
          formatter: labelsFormatter,
        },
        alignment: 'center',
      },
      resizable: true,
      tooltip: {
        // Will work properly after upgrade to @carbon/charts-react 0.38.2, please see
        // https://github.com/carbon-design-system/carbon-charts/issues/808
        customHTML: isEditable ? () => {} : customTooltip,
      },
    },
  };

  const tableProps = {
    'data-testid': `${testID}-table`,
    id: `${id}-table`,
    className: `${iotPrefix}--pie-chart-card--stateful-table`,
    columns: generateTableColumns(values, groupDataSourceId),
    data: generateTableRows(id, values, groupDataSourceId),
    actions: {
      table: {},
      toolbar: {
        onDownloadCSV: (tableData) => csvDownloadHandler(tableData, title),
      },
    },
    view: {
      table: {
        emptyState: {
          message: noDataLabel,
        },
      },
    },
    i18n,
  };

  const size = increaseSmallCardSize(sizeProp, 'PieChartCard');
  const isAllValuesEmpty = isEmpty(values);
  const MyCard = overrides?.card?.component || Card;
  const MyPieChart = overrides?.pieChart?.component || PieChart;
  const MyTable = overrides?.table?.component || Table;

  return (
    <MyCard
      title={title}
      className={`${iotPrefix}--pie-chart-card`}
      size={size}
      i18n={i18n}
      id={id}
      isExpanded={isExpanded}
      // The Card has its own isEmpty rendering, but if the data is being loaded we want to use
      // the loading skeleton from the PieChart instead.
      isEmpty={isAllValuesEmpty && !isLoading}
      isEditable={isEditable}
      isResizable={isResizable}
      resizeHandles={resizeHandles}
      testID={testID}
      {...others}
      {...overrides?.card?.props}
    >
      {isLoading || !isAllValuesEmpty ? (
        <div
          className={classNames(`${iotPrefix}--pie-chart-container`, {
            [`${iotPrefix}--pie-chart-container__expanded`]: isExpanded,
          })}
        >
          <MyPieChart {...chartProps} {...getOverrides(overrides?.pieChart?.props, chartProps)} />
          {isExpanded && !isLoading ? (
            <MyTable {...tableProps} {...getOverrides(overrides?.table?.props, tableProps)} />
          ) : null}
        </div>
      ) : null}
      {resizeHandles}
    </MyCard>
  );
};

PieChartCard.propTypes = propTypes;
PieChartCard.defaultProps = defaultProps;
export default PieChartCard;
