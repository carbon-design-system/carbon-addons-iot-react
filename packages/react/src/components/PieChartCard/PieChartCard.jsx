import React, { useMemo } from 'react';
import { PieChart } from '@carbon/charts-react';
import classNames from 'classnames';
import { isEmpty, defaultsDeep } from 'lodash-es';

import { PieCardPropTypes, CardPropTypes, CHART_COLORS } from '../../constants/CardPropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';
import {
  getResizeHandles,
  handleCardVariables,
  increaseSmallCardSize,
} from '../../utils/cardUtilityFunctions';
import { csvDownloadHandler, getOverrides } from '../../utils/componentUtilityFunctions';
import Card from '../Card/Card';
import Table from '../Table/Table';
import useMerged from '../../hooks/useMerged';

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

/**
 * Formats and maps the colors to their corresponding datasets in the carbon pie chart card expected format
 * @param {Array} values, an array of group, value objects for each pie label
 * @param {string} groupDataSourceId, the group id to use to find the value
 * @param {Object} colors an object of colors
 * @returns {Object} colors - formatted
 */
export const formatColors = (values, groupDataSourceId, colors) => {
  const formattedColors = {
    scale: {},
  };
  if (Array.isArray(values)) {
    values.forEach((value, index) => {
      formattedColors.scale[value[groupDataSourceId]] = colors?.[value[groupDataSourceId]]
        ? colors[value[groupDataSourceId]] // look to find a matching color entry in our colors otherwise use defaults
        : CHART_COLORS[index % CHART_COLORS.length];
    });
  } else if (!isEmpty(values)) {
    // values is an object
    Object.keys(values).forEach((key, index) => {
      formattedColors.scale[key] = colors?.[key]
        ? colors?.[key]
        : CHART_COLORS[index % CHART_COLORS.length];
    });
  }

  return formattedColors;
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
    legendAlignment: 'left',
    legendPosition: 'bottom',
    truncation: {
      type: 'end_line',
      threshold: 20,
      numCharacter: 20,
    },
  },
  overrides: undefined,
};

const PieChartCard = ({
  children,
  content,
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
  // TODO: remove deprecated 'testID' in v3.
  testID,
  testId,
  ...others
}) => {
  // need to deep merge the nested content default props as default props only uses a shallow merge natively
  const contentWithDefaults = useMemo(() => defaultsDeep({}, content, defaultProps.content), [
    content,
  ]);
  const mergedI18n = useMerged(defaultProps.i18n, i18n);

  const {
    title,
    content: {
      colors: colorsProp,
      customTooltip,
      groupDataSourceId,
      labelsFormatter,
      legendAlignment,
      legendPosition,
      truncation,
    },
    values: valuesProp,
  } = handleCardVariables(titleProp, contentWithDefaults, initialValuesProp, others);

  const values = useMemo(() => {
    const sampleSlicesCount = colorsProp ? Object.keys(colorsProp).length : 4;
    return isEditable ? generateSampleData(sampleSlicesCount, groupDataSourceId) : valuesProp;
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
      color: formatColors(values, groupDataSourceId, colors),
      getFillColor: (...args) => getColor(colors, ...args),
      getStrokeColor: (...args) => getColor(colors, ...args),
      legend: {
        alignment: legendAlignment,
        position: legendPosition,
        enabled: values.length > 1,
        clickable: !isEditable,
        truncation,
      },
      pie: {
        labels: {
          formatter: labelsFormatter,
        },
        alignment: 'center',
      },
      resizable: true,
      tooltip: {
        customHTML: customTooltip,
      },
      toolbar: {
        enabled: false,
      },
    },
  };

  const tableProps = {
    // TODO: remove deprecated 'testID' in v3.
    'data-testid': `${testID || testId}-table`,
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
          message: mergedI18n.noDataLabel,
        },
      },
    },
    i18n: mergedI18n,
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
      i18n={mergedI18n}
      id={id}
      isExpanded={isExpanded}
      // The Card has its own isEmpty rendering, but if the data is being loaded we want to use
      // the loading skeleton from the PieChart instead.
      isEmpty={isAllValuesEmpty && !isLoading}
      isEditable={isEditable}
      isResizable={isResizable}
      resizeHandles={resizeHandles}
      // TODO: remove deprecated 'testID' in v3.
      testId={testID || testId}
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
