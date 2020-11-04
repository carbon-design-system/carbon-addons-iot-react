import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit16 } from '@carbon/icons-react';
import {
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  purple50,
  teal50,
  cyan90,
} from '@carbon/colors';
import classnames from 'classnames';

import { settings } from '../../../../constants/Settings';
import {
  ComposedModal,
  Button,
  List,
  TextInput,
  MultiSelect,
} from '../../../../index';

const { iotPrefix } = settings;

const propTypes = {
  /* card value */
  cardConfig: PropTypes.shape({
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
  /* callback when image input value changes (File object) */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({}),
  /** if provided, returns an array of strings which are the dataItems to be allowed
   * on each card
   * getValidDataItems(card, selectedTimeRange)
   */
  getValidDataItems: PropTypes.func,
  /** an array of dataItems to be included on each card
   * this prop will be ignored if getValidDataItems is defined
   */
  dataItems: PropTypes.arrayOf(
    PropTypes.shape({
      dataSourceId: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  setSelectedDataItems: PropTypes.func.isRequired,
  selectedTimeRange: PropTypes.string.isRequired,
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    dataItemEditorTitle: 'Edit data series',
    dataItemEditorDataItemTitle: 'Data item',
    dataItemEditorDataItemLabel: 'Label',
    dataItemEditorLegendColor: 'Legend color',
    dataSeriesTitle: 'Data series',
    selectDataItems: 'Select data items',
    dataItem: 'Data item',
    edit: 'Edit',
  },
  getValidDataItems: null,
  dataItems: [],
};

const DATAITEM_COLORS_OPTIONS = [
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  purple50,
  teal50,
  cyan90,
];

/**
 * returns a new series array with a generated color if needed, and in the format expected by the JSON payload
 * @param {array} selectedItems
 * @param {object} cardConfig
 */
export const formatSeries = (selectedItems, cardJson) => {
  const cardSeries = cardJson?.content?.series;
  const series = selectedItems.map(({ id, text }, i) => {
    const color =
      cardSeries?.find((dataItem) => dataItem.label === id)?.color ??
      DATAITEM_COLORS_OPTIONS[i % DATAITEM_COLORS_OPTIONS.length];
    return {
      dataSourceId: id,
      label: text,
      color,
    };
  });
  return series;
};

export const formatDataItemsForDropdown = (dataItems) =>
  dataItems?.map(({ dataSourceId, label }) => ({
    id: dataSourceId,
    text: label || dataSourceId,
  })) || [];

const DataSeriesFormItem = ({
  cardConfig = {},
  dataItems,
  getValidDataItems,
  onChange,
  setSelectedDataItems,
  selectedTimeRange,
  i18n,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const [showEditor, setShowEditor] = useState(false);
  const [editDataItem, setEditDataItem] = useState({});

  const baseClassName = `${iotPrefix}--card-edit-form`;

  const initialSelectedItems = formatDataItemsForDropdown(
    cardConfig?.content?.series
  );

  const validDataItems = getValidDataItems
    ? getValidDataItems(cardConfig, selectedTimeRange)
    : dataItems;

  return (
    <>
      {showEditor ? (
        <ComposedModal
          header={{
            title: mergedI18n.dataItemEditorDataItemTitle,
          }}
          size="xs"
          onSubmit={() => {
            const updatedSeries = [...cardConfig.content.series];
            const editDataItemIndex = updatedSeries.findIndex(
              (dataItem) => dataItem.dataSourceId === editDataItem.dataSourceId
            );
            updatedSeries[editDataItemIndex] = editDataItem;
            onChange({
              ...cardConfig,
              content: { ...cardConfig.content, series: updatedSeries },
            });
            setShowEditor(false);
            setEditDataItem(null);
          }}
          onClose={() => {
            setShowEditor(false);
            setEditDataItem(null);
          }}>
          <span className={`bx--label ${baseClassName}--input-label`}>
            {mergedI18n.dataItemEditorDataItemTitle}
          </span>
          <div className={`${baseClassName}--input`}>
            {editDataItem.dataSourceId}
          </div>
          <div className={`${baseClassName}--input`}>
            <TextInput
              id="seriesLabel"
              labelText={mergedI18n.dataItemEditorDataItemLabel}
              light
              onChange={(evt) =>
                setEditDataItem({
                  ...editDataItem,
                  label: evt.target.value,
                })
              }
              value={editDataItem.label}
            />
          </div>
          <div className={`${baseClassName}--input`}>
            <span className={`bx--label ${baseClassName}--input--label`}>
              {mergedI18n.dataItemEditorLegendColor}
            </span>
            <div className="color-picker">
              {DATAITEM_COLORS_OPTIONS.map((color) => (
                <button
                  type="button"
                  style={{ backgroundColor: color }}
                  className={classnames('color-picker-button', {
                    'color-picker-button__selected':
                      color === editDataItem.color,
                  })}
                  onClick={() => setEditDataItem({ ...editDataItem, color })}
                />
              ))}
            </div>
          </div>
        </ComposedModal>
      ) : null}
      <div className={`${baseClassName}--form-section`}>
        {mergedI18n.dataSeriesTitle}
      </div>
      <div className={`${baseClassName}--input`}>
        <MultiSelect
          key={cardConfig.id} // need to re-gen if selected card changes
          id={`${cardConfig.id}_dataSourceIds`}
          label={mergedI18n.selectDataItems}
          direction="bottom"
          itemToString={(item) => item.text}
          initialSelectedItems={initialSelectedItems}
          items={formatDataItemsForDropdown(validDataItems)}
          light
          onChange={({ selectedItems }) => {
            const series = formatSeries(selectedItems, cardConfig);
            setSelectedDataItems(selectedItems.map(({ id }) => id));
            onChange({
              ...cardConfig,
              content: { ...cardConfig.content, series },
            });
          }}
          titleText={mergedI18n.dataItem}
        />
      </div>
      <List
        // need to force an empty "empty state"
        emptyState={<div />}
        title=""
        items={cardConfig?.content?.series?.map((series, i) => ({
          id: series.dataSourceId,
          content: {
            value: series.label,
            icon: (
              <div
                style={{
                  width: '1rem',
                  height: '1rem',
                  backgroundColor:
                    series.color ||
                    DATAITEM_COLORS_OPTIONS[i % DATAITEM_COLORS_OPTIONS.length],
                }}
              />
            ),
            rowActions: [
              <Button
                key={`data-item-${series.dataSourceId}`}
                renderIcon={Edit16}
                hasIconOnly
                kind="ghost"
                size="small"
                onClick={() => {
                  setEditDataItem(series);
                  setShowEditor(true);
                }}
                iconDescription={mergedI18n.edit}
              />,
            ],
          },
        }))}
      />
    </>
  );
};
DataSeriesFormItem.defaultProps = defaultProps;
DataSeriesFormItem.propTypes = propTypes;
export default DataSeriesFormItem;
