import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  CARD_TYPES,
  CARD_SIZES,
  CARD_DIMENSIONS,
  ALLOWED_CARD_SIZES_PER_TYPE,
} from '../../../constants/LayoutConstants';
import { settings } from '../../../constants/Settings';
import { TextArea, TextInput, Dropdown } from '../../../index';
import { timeRangeToJSON } from '../../DashboardEditor/editorUtils';

import DataSeriesFormItem from './CardEditFormItems/DataSeriesFormItem';

const { iotPrefix } = settings;

const propTypes = {
  /** card data value */
  cardJson: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.shape({
      series: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          dataSourceId: PropTypes.string,
          color: PropTypes.string,
        })
      ),
      xLabel: PropTypes.string,
      yLabel: PropTypes.string,
      unit: PropTypes.string,
      includeZeroOnXaxis: PropTypes.bool,
      includeZeroOnYaxis: PropTypes.bool,
      timeDataSourceId: PropTypes.string,
    }),
    interval: PropTypes.string,
    showLegend: PropTypes.bool,
  }),
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    openEditorButton: PropTypes.string,
    cardSize_SMALL: PropTypes.string,
    cardSize_SMALLWIDE: PropTypes.string,
    cardSize_MEDIUM: PropTypes.string,
    cardSize_MEDIUMTHIN: PropTypes.string,
    cardSize_MEDIUMWIDE: PropTypes.string,
    cardSize_LARGE: PropTypes.string,
    cardSize_LARGETHIN: PropTypes.string,
    cardSize_LARGEWIDE: PropTypes.string,
    chartType_BAR: PropTypes.string,
    chartType_LINE: PropTypes.string,
    barChartType_SIMPLE: PropTypes.string,
    barChartType_GROUPED: PropTypes.string,
    barChartType_STACKED: PropTypes.string,
    barChartLayout_HORIZONTAL: PropTypes.string,
    barChartLayout_VERTICAL: PropTypes.string,
    cardTitle: PropTypes.string,
    description: PropTypes.string,
    size: PropTypes.string,
    selectASize: PropTypes.string,
    timeRange: PropTypes.string,
    selectATimeRange: PropTypes.string,
  }),
  /** if provided, returns an array of strings which are the timeRanges to be allowed
   * on each card
   * getValidTimeRanges(card, selectedDataItems)
   */
  getValidTimeRanges: PropTypes.func,
  /** if provided, returns an array of strings which are the dataItems to be allowed
   * on each card
   * getValidDataItems(card, selectedTimeRange)
   */
  getValidDataItems: PropTypes.func,
  /** an array of dataItem string names to be included on each card
   * this prop will be ignored if getValidDataItems is defined
   */
  dataItems: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  cardJson: {},
  i18n: {
    openEditorButton: 'Open JSON editor',
    cardSize_SMALL: 'Small',
    cardSize_SMALLWIDE: 'Small wide',
    cardSize_MEDIUM: 'Medium',
    cardSize_MEDIUMTHIN: 'Medium thin',
    cardSize_MEDIUMWIDE: 'Medium wide',
    cardSize_LARGE: 'Large',
    cardSize_LARGETHIN: 'Large thin',
    cardSize_LARGEWIDE: 'Large wide',
    chartType_BAR: 'Bar',
    chartType_LINE: 'Line',
    barChartType_SIMPLE: 'Simple',
    barChartType_GROUPED: 'Grouped',
    barChartType_STACKED: 'Stacked',
    barChartLayout_HORIZONTAL: 'Horizontal',
    barChartLayout_VERTICAL: 'Vertical',
    cardTitle: 'Card title',
    description: 'Description (Optional)',
    size: 'Size',
    selectASize: 'Select a size',
    timeRange: 'Time range',
    selectATimeRange: 'Select a time range',
  },
  getValidDataItems: null,
  getValidTimeRanges: null,
  dataItems: [],
};

export const defaultTimeRangeOptions = {
  last24Hours: 'Last 24 hrs',
  last7Days: 'Last 7 days',
  lastMonth: 'Last month',
  lastQuarter: 'Last quarter',
  lastYear: 'Last year',
  thisWeek: 'This week',
  thisMonth: 'This month',
  thisQuarter: 'This quarter',
  thisYear: 'This year',
};

/**
 * Returns card size and dimensions labels
 * @param {string} size
 * @param {Object<string>} i18n
 * @returns {string}
 */
export const getCardSizeText = (size, i18n) => {
  const sizeName = i18n[`cardSize_${size}`];
  const sizeDimensions = `(${CARD_DIMENSIONS[size].lg.w}x${CARD_DIMENSIONS[size].lg.h})`;
  return `${sizeName} ${sizeDimensions}`;
};

const CardEditFormContent = ({
  cardJson,
  onChange,
  i18n,
  dataItems,
  getValidDataItems,
  getValidTimeRanges,
}) => {
  const { title, description, size, type, id } = cardJson;
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const [selectedDataItems, setSelectedDataItems] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');

  const baseClassName = `${iotPrefix}--card-edit-form`;

  const validTimeRanges = getValidTimeRanges
    ? getValidTimeRanges(cardJson, selectedDataItems)
    : Object.keys(defaultTimeRangeOptions);

  return (
    <>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id={`${id}_title`}
          labelText={mergedI18n.cardTitle}
          light
          onChange={(evt) => onChange({ ...cardJson, title: evt.target.value })}
          value={title}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <TextArea
          id={`${id}_description`}
          labelText={mergedI18n.description}
          light
          onChange={(evt) =>
            onChange({ ...cardJson, description: evt.target.value })
          }
          value={description}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <Dropdown
          id={`${id}_size`}
          label={mergedI18n.selectASize}
          direction="bottom"
          itemToString={(item) => item.text}
          items={(
            ALLOWED_CARD_SIZES_PER_TYPE[type] ?? Object.keys(CARD_SIZES)
          ).map((cardSize) => {
            return {
              id: cardSize,
              text: getCardSizeText(cardSize, mergedI18n),
            };
          })}
          light
          selectedItem={{ id: size, text: getCardSizeText(size, mergedI18n) }}
          onChange={({ selectedItem }) => {
            onChange({ ...cardJson, size: selectedItem.id });
          }}
          titleText={mergedI18n.size}
        />
      </div>
      {type === CARD_TYPES.TIMESERIES && (
        <>
          <div className={`${baseClassName}--input`}>
            <Dropdown
              id={`${id}_time_range`}
              label={mergedI18n.selectATimeRange}
              direction="bottom"
              itemToString={(item) => item.text}
              items={
                validTimeRanges
                  ? validTimeRanges.map((range) => ({
                      id: range,
                      text: defaultTimeRangeOptions[range],
                    }))
                  : []
              }
              light
              onChange={({ selectedItem }) => {
                const { range, interval } = timeRangeToJSON[selectedItem.id];
                setSelectedTimeRange(selectedItem.id);
                onChange({
                  ...cardJson,
                  interval,
                  dataSource: { ...cardJson.dataSource, range },
                });
              }}
              titleText={mergedI18n.timeRange}
            />
          </div>
          <DataSeriesFormItem
            cardJson={cardJson}
            onChange={onChange}
            dataItems={dataItems}
            setSelectedDataItems={setSelectedDataItems}
            selectedTimeRange={selectedTimeRange}
            getValidDataItems={getValidDataItems}
            i18n={mergedI18n}
          />
        </>
      )}
    </>
  );
};

CardEditFormContent.propTypes = propTypes;
CardEditFormContent.defaultProps = defaultProps;

export default CardEditFormContent;
