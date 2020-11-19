import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit16 } from '@carbon/icons-react';

import { settings } from '../../../../../constants/Settings';
import {
  DATAITEM_COLORS_OPTIONS,
  handleDataSeriesChange,
} from '../../../../DashboardEditor/editorUtils';
import { Button, List, MultiSelect } from '../../../../../index';
import { DataItemsPropTypes } from '../../../../DashboardEditor/DashboardEditor';
import DataSeriesFormItemModal from '../DataSeriesFormItemModal';
import { CARD_TYPES } from '../../../../../constants/LayoutConstants';

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
  dataItems: DataItemsPropTypes,
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
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
  availableDimensions: {},
};

export const formatDataItemsForDropdown = (dataItems) =>
  dataItems?.map(({ dataSourceId }) => ({
    id: dataSourceId,
    text: dataSourceId,
  })) || [];

const DataSeriesFormItem = ({
  cardConfig = {},
  dataItems,
  getValidDataItems,
  onChange,
  setSelectedDataItems,
  selectedTimeRange,
  availableDimensions,
  i18n,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const [showEditor, setShowEditor] = useState(false);
  const [editDataItem, setEditDataItem] = useState({});

  const baseClassName = `${iotPrefix}--card-edit-form`;

  // determine which content section to look at
  const dataSection =
    cardConfig.type === CARD_TYPES.TIMESERIES
      ? cardConfig?.content?.series
      : cardConfig?.content?.attributes;

  const initialSelectedItems = formatDataItemsForDropdown(dataSection);

  const validDataItems = getValidDataItems
    ? getValidDataItems(cardConfig, selectedTimeRange)
    : dataItems;

  return (
    <>
      <DataSeriesFormItemModal
        cardConfig={cardConfig}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editDataItem={editDataItem}
        setEditDataItem={setEditDataItem}
        availableDimensions={availableDimensions}
        onChange={onChange}
        i18n={mergedI18n}
      />
      <div className={`${baseClassName}--form-section`}>
        {mergedI18n.dataSeriesTitle}
      </div>
      <div className={`${baseClassName}--input`}>
        <MultiSelect
          key={cardConfig.id} // need to re-gen if selected card changes
          id={`${cardConfig.id}_dataSourceIds`}
          label={mergedI18n.selectDataItems}
          direction="bottom"
          itemToString={(item) => item.id}
          initialSelectedItems={initialSelectedItems}
          items={formatDataItemsForDropdown(validDataItems)}
          light
          onChange={({ selectedItems }) => {
            const newCard = handleDataSeriesChange(
              selectedItems,
              cardConfig,
              onChange
            );
            setSelectedDataItems(selectedItems.map(({ id }) => id));
            onChange(newCard);
          }}
          titleText={mergedI18n.dataItem}
        />
      </div>
      <List
        // need to force an empty "empty state"
        emptyState={<div />}
        title=""
        items={dataSection?.map((dataItem, i) => ({
          id: dataItem.dataSourceId,
          content: {
            value: dataItem.label,
            icon:
              cardConfig.type === CARD_TYPES.TIMESERIES ? (
                <div
                  style={{
                    width: '1rem',
                    height: '1rem',
                    backgroundColor:
                      dataItem.color ||
                      DATAITEM_COLORS_OPTIONS[
                        i % DATAITEM_COLORS_OPTIONS.length
                      ],
                  }}
                />
              ) : null,
            rowActions: () => [
              <Button
                key={`data-item-${dataItem.dataSourceId}`}
                renderIcon={Edit16}
                hasIconOnly
                kind="ghost"
                size="small"
                onClick={() => {
                  setEditDataItem(dataItem);
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
