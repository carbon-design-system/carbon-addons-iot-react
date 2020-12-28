import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Edit16 } from '@carbon/icons-react';

import { settings } from '../../../../../constants/Settings';
import { handleDataSeriesChange } from '../../../../DashboardEditor/editorUtils';
import { Button, List, MultiSelect } from '../../../../../index';
import { DataItemsPropTypes } from '../../../../DashboardEditor/DashboardEditor';
import DataSeriesFormItemModal from '../DataSeriesFormItemModal';
import {
  CARD_SIZES,
  CARD_TYPES,
} from '../../../../../constants/LayoutConstants';

const { iotPrefix } = settings;

const propTypes = {
  /* card value */

  cardConfig: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.oneOf(Object.keys(CARD_SIZES)),
    type: PropTypes.oneOf([CARD_TYPES.TABLE]),
    content: PropTypes.shape({
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          dataSourceId: PropTypes.string,
          // most data item columns won't have types, only dimensions or timestamps
          type: PropTypes.oneOf(['DIMENSION', 'TIMESTAMP']),
        })
      ),
    }),
  }),
  /* callback when any changes are made to the card config, the full updated card JSON is passed as the argument */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({}),
  /** an array of dataItems to be included on each card */
  dataItems: DataItemsPropTypes,
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
  /** list of dataItem names that have been selected to display on the card */
  selectedDataItems: PropTypes.arrayOf(PropTypes.string),
  /** the callback is called with a list of the new data item names selected */
  setSelectedDataItems: PropTypes.func.isRequired,
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    dataItemEditorTitle: 'Edit data series',
    dataItemEditorDataItemTitle: 'Data item',
    dataItemEditorDimensionTitle: 'Group by',
    dataItemEditorDataItemLabel: 'Label',
    dataItemEditorLegendColor: 'Legend color',
    dataSeriesTitle: 'Data',
    selectDataItems: 'Select data item(s)',
    selectGroupByDimensions: 'Select dimension(s)',
    dataItem: 'Data item',
    edit: 'Edit',
    remove: 'Remove',
    customize: 'Customize',
  },
  dataItems: [],
  selectedDataItems: [],
  availableDimensions: {},
};

export const formatDataItemsForDropdown = (dataItems) =>
  dataItems?.map(({ dataSourceId }) => ({
    id: dataSourceId,
    text: dataSourceId,
  }));

const TableCardFormContent = ({
  cardConfig,
  dataItems,
  onChange,
  selectedDataItems,
  setSelectedDataItems,
  availableDimensions,
  i18n,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const {
    content: { columns },
  } = cardConfig;

  const [showEditor, setShowEditor] = useState(false);
  // Need to keep track of the data item that's currently being edited so the detailed modal knows which one to show
  const [editDataItem, setEditDataItem] = useState({});

  const dataSection = useMemo(
    () =>
      Array.isArray(columns) // Filter out the fake columns from the selected data items view
        ? columns.filter((col) => col.label !== '--')
        : [],
    [columns]
  );

  const baseClassName = `${iotPrefix}--card-edit-form`;

  // This is used in the edit case where some of these data items have been selected before
  const initialSelectedItems = useMemo(
    () => formatDataItemsForDropdown(dataSection),
    [dataSection]
  );

  // find valid dimension data item names
  const validDimensions = useMemo(
    () => Object.keys(availableDimensions).map((i) => ({ id: i, text: i })),
    [availableDimensions]
  );

  const initialSelectedDimensions = useMemo(
    () => dataSection.filter((col) => col.type === 'DIMENSION'),
    [dataSection]
  );

  return (
    <>
      <DataSeriesFormItemModal
        cardConfig={cardConfig}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editDataSeries={dataSection}
        // setEditDataSeries={setDataSection}
        editDataItem={editDataItem}
        setEditDataItem={setEditDataItem}
        availableDimensions={availableDimensions}
        onChange={onChange}
        i18n={mergedI18n}
      />
      <div className={`${baseClassName}--form-section`}>
        {mergedI18n.dataSeriesTitle}
      </div>
      <div
        className={`${baseClassName}--input`} // data item selector
      >
        <MultiSelect
          // need to re-gen if selected card changes or if a dataItem is removed from the list
          key={`data-item-select-selected_card-id-${cardConfig.id}`}
          id={`${cardConfig.id}_dataSourceIds`}
          label={mergedI18n.selectDataItems}
          direction="bottom"
          itemToString={(item) => item.id}
          initialSelectedItems={initialSelectedItems}
          items={formatDataItemsForDropdown(dataItems)}
          light
          onChange={({ selectedItems }) => {
            const newCard = handleDataSeriesChange(selectedItems, cardConfig);
            setSelectedDataItems(selectedItems.map(({ id }) => id));
            onChange(newCard);
          }}
          titleText={mergedI18n.dataItem}
        />
      </div>

      <div
        className={`${baseClassName}--input`} // Dimensions selector
      >
        <MultiSelect
          // need to re-gen if selected card changes or if a dataItem is removed from the list
          key={`data-item-select-selected_card-id-${cardConfig.id}`}
          id={`${cardConfig.id}_dataSourceIds`}
          label={mergedI18n.selectGroupByDimensions}
          direction="bottom"
          itemToString={(item) => item.id}
          initialSelectedItems={initialSelectedDimensions}
          items={validDimensions}
          light
          onChange={({ selectedItems }) => {
            // Add the new dimensions as dimension columns at the beginning of the table
            const newCard = handleDataSeriesChange(
              selectedItems.map((i) => ({ ...i, type: 'DIMENSION' })),
              cardConfig
            );
            // setSelectedDataItems(selectedItems.map(({ id }) => id));
            onChange(newCard);
          }}
          titleText={mergedI18n.dataItemEditorDimensionTitle}
        />
      </div>
      <List
        // Lists the selected dataItem columns in the bottom section and allow additional configuration
        key={`data-item-list${selectedDataItems.length}`}
        // need to force an empty "empty state"
        emptyState={<div />}
        title=""
        items={dataSection?.map((dataItem) => ({
          id: dataItem.dataSourceId,
          content: {
            value: dataItem.label,
            icon: null,
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
TableCardFormContent.defaultProps = defaultProps;
TableCardFormContent.propTypes = propTypes;
export default TableCardFormContent;
