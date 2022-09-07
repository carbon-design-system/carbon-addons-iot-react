import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Edit16, Subtract16 } from '@carbon/icons-react';
import { isEmpty, omit } from 'lodash-es';
import * as uuid from 'uuid';
import hash from 'object-hash';

import { settings } from '../../../../../constants/Settings';
import {
  handleDataSeriesChange,
  DataItemsPropTypes,
  DashboardEditorActionsPropTypes,
} from '../../../../DashboardEditor/editorUtils';
import Button from '../../../../Button';
import List from '../../../../List/List';
import { MultiSelect } from '../../../../MultiSelect';
import ComboBox from '../../../../ComboBox';
import DataSeriesFormItemModal from '../DataSeriesFormItemModal';
import ContentFormItemTitle from '../ContentFormItemTitle';
import { CARD_SIZES, CARD_TYPES } from '../../../../../constants/LayoutConstants';

const { iotPrefix } = settings;

const propTypes = {
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
          type: PropTypes.string,
          dataItemType: PropTypes.string,
        })
      ),
      thresholds: PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.string,
          comparison: PropTypes.string,
          dataSourceId: PropTypes.string,
          icon: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
        })
      ),
    }),
    dataSource: PropTypes.shape({
      groupBy: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  /* callback when any changes are made to the card config, the full updated card JSON is passed as the argument */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    dataItemEditorTitle: PropTypes.string,
    dataItemEditorDataItemTitle: PropTypes.string,
    dataItemEditorDimensionTitle: PropTypes.string,
    dataItemEditorDataItemLabel: PropTypes.string,
    dataItemEditorLegendColor: PropTypes.string,
    tableColumnEditorSectionTitle: PropTypes.string,
    dataItemEditorSectionTableTooltipText: PropTypes.string,
    dataSeriesTitle: PropTypes.string,
    selectDataItems: PropTypes.string,
    selectGroupByDimensions: PropTypes.string,
    dataItem: PropTypes.string,
    edit: PropTypes.string,
    remove: PropTypes.string,
    customize: PropTypes.string,
  }),
  /** an array of dataItems to be included on each card */
  dataItems: DataItemsPropTypes,
  /** if provided, returns an array of strings which are the dataItems to be allowed
   * on each card
   * getValidDataItems(card, selectedTimeRange)
   */
  getValidDataItems: PropTypes.func,
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
  selectedTimeRange: PropTypes.string.isRequired,
  /** list of dataItem names that have been selected to display on the card */
  selectedDataItems: PropTypes.arrayOf(PropTypes.string),
  /** the callback is called with a list of the new data item names selected */
  setSelectedDataItems: PropTypes.func.isRequired,
  /** optional link href's for each card type that will appear in a tooltip */
  dataSeriesItemLinks: PropTypes.shape({
    table: PropTypes.string,
  }),
  translateWithId: PropTypes.func.isRequired,
  actions: DashboardEditorActionsPropTypes,
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    dataItemEditorTitle: 'Edit data series',
    dataItemEditorDataItemTitle: 'Data item',
    dataItemEditorDimensionTitle: 'Group by',
    dataItemEditorDataItemLabel: 'Label',
    dataItemEditorLegendColor: 'Legend color',
    tableColumnEditorSectionTitle: 'Columns',
    dataItemEditorSectionTableTooltipText:
      'Display metrics in columns. Filter the metrics by dimensions or device ID from Group by.',
    selectDataItems: 'Select data item(s)',
    selectGroupByDimensions: 'Select dimension(s)',
    dataItem: 'Data item',
    edit: 'Edit',
    remove: 'Remove',
    filter: 'Filter',
    customize: 'Customize',
  },
  dataItems: [],
  getValidDataItems: null,
  selectedDataItems: [],
  availableDimensions: {},
  dataSeriesItemLinks: null,
  actions: {
    onEditDataItem: null,
    dataSeriesFormActions: {
      hideAggregationsDropDown: null,
      onAddAggregations: null,
    },
  },
};

const TableCardFormContent = ({
  cardConfig,
  dataItems,
  getValidDataItems,
  onChange,
  selectedTimeRange,
  selectedDataItems,
  setSelectedDataItems,
  availableDimensions,
  i18n,
  dataSeriesItemLinks,
  translateWithId,
  actions,
}) => {
  const { onEditDataItem } = actions;
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const {
    content: { columns, thresholds },
  } = cardConfig;

  const [showEditor, setShowEditor] = useState(false);
  // Need to keep track of the data item that's currently being edited so the detailed modal knows which one to show
  const [editDataItem, setEditDataItem] = useState({});
  const [removedDataItems, setRemovedDataItems] = useState([]);

  // Initialize the selected columns if its not currently set
  const dataSection = useMemo(
    () =>
      Array.isArray(columns)
        ? columns.map((column) => ({
            ...column, // dataSection expects the thresholds to be in the column definition, though the table expects them to be in content
            ...(!isEmpty(thresholds) // only set thresholds if they exist
              ? {
                  thresholds: thresholds?.filter(
                    (threshold) => column.dataSourceId === threshold.dataSourceId
                  ),
                }
              : {}),
          }))
        : [],
    [columns, thresholds]
  );

  const baseClassName = `${iotPrefix}--card-edit-form`;

  // find valid dimension data item names
  const validDimensions = useMemo(
    () => Object.keys(availableDimensions).map((i) => ({ id: i, text: i })),
    [availableDimensions]
  );

  const initialSelectedDimensions = useMemo(
    () =>
      cardConfig?.dataSource?.groupBy?.map((dataSourceId) => ({
        id: dataSourceId,
        text: dataSourceId,
      })),
    [cardConfig]
  );

  const validDataItems = getValidDataItems
    ? getValidDataItems(cardConfig, selectedTimeRange)
    : dataItems;

  const validDataItemsForDropdown = useMemo(
    () =>
      validDataItems?.map(({ dataSourceId, dataItemId }) => ({
        id: dataItemId,
        text: dataSourceId,
      })),
    [validDataItems]
  );

  const handleOnDataSeriesChange = (selectedItem) => {
    // ignore the extra value added by the "enter" keypress
    if (selectedItem && !selectedItem.id.includes('iot-input')) {
      const itemWithMetaData = validDataItems?.find(
        ({ dataItemId }) => dataItemId === selectedItem.id
      );
      const selectedItems = [
        ...dataSection,
        {
          ...(itemWithMetaData && { ...itemWithMetaData }),
          // create a unique dataSourceId if it's going into the attributes section
          // if it's going into the groupBy section, then just use the dataItemId
          dataSourceId:
            itemWithMetaData?.destination === 'groupBy'
              ? selectedItem.id
              : `${selectedItem.id}_${uuid.v4()}`,
        },
      ];
      const newCard = handleDataSeriesChange(selectedItems, cardConfig, null, null);
      setSelectedDataItems(selectedItems.map(({ text }) => text));
      onChange(newCard);
    }
  };

  // need to handle thresholds from the DataSeriesFormItemModal and convert it to the right format
  const handleDataItemModalChanges = useCallback(
    (card) => {
      const allThresholds = [];
      // the table card is looking for the thresholds on the main content object
      const updatedColumns = card?.content?.columns?.map(
        // eslint-disable-next-line no-unused-vars
        ({ thresholds: columnThresholds, ...others }) => {
          if (!isEmpty(columnThresholds)) {
            allThresholds.push(
              ...columnThresholds.map((threshold) => ({
                ...threshold,
                dataSourceId: others?.dataSourceId,
              }))
            );
          }
          return others;
        }
      );
      onChange({
        ...card,
        content: {
          ...card.content,
          columns: updatedColumns,
          ...(!isEmpty(allThresholds) ? { thresholds: allThresholds } : {}),
        },
      });
    },
    [onChange]
  );

  const handleRemoveButton = useCallback(
    (dataItem) => {
      const filteredColumns = dataSection.filter(
        (item) => item.dataSourceId !== dataItem.dataSourceId
      );
      // Need to determine whether we should remove these from the groupBy section
      const filteredGroupBy = cardConfig?.dataSource?.groupBy?.filter(
        (groupByItem) => groupByItem !== dataItem.dataSourceId
      );

      setSelectedDataItems(filteredColumns.map((item) => item.dataSourceId));
      setRemovedDataItems([...removedDataItems, dataItem]);

      // if we no longer have a groupBy, then we can exclude the dataSource from the response
      let updatedDataSource = {};
      if (!isEmpty(filteredGroupBy)) {
        updatedDataSource = { dataSource: { ...cardConfig.dataSource, groupBy: filteredGroupBy } };
      } else if (cardConfig.dataSource) {
        updatedDataSource = { dataSource: { ...omit(cardConfig.dataSource, 'groupBy') } };
      }

      onChange({
        ...cardConfig,
        content: {
          ...cardConfig.content,
          columns: filteredColumns,
        },
        ...updatedDataSource,
      });
    },
    [cardConfig, dataSection, onChange, removedDataItems, setSelectedDataItems]
  );

  const handleEditButton = useCallback(
    async (dataItem) => {
      const dataItemWithMetaData = validDataItems?.find(
        ({ dataItemId }) => dataItemId === dataItem.dataItemId
      );
      // Call back function for on click of edit button
      if (onEditDataItem) {
        const aggregationMethods = await onEditDataItem(cardConfig, dataItem, dataItemWithMetaData);
        if (!isEmpty(aggregationMethods)) {
          dataItemWithMetaData.aggregationMethods = aggregationMethods;
        }
      }
      // need to reset the card to include the latest dataSection
      setEditDataItem({
        ...dataItemWithMetaData,
        ...dataItem,
      });
      setShowEditor(true);
    },
    [cardConfig, onEditDataItem, validDataItems]
  );

  const dataListItems = useMemo(
    () =>
      dataSection?.map((dataItem) => ({
        id: dataItem.dataSourceId,
        content: {
          value: dataItem.label || dataItem.dataItemId,
          icon: null,
          rowActions: () => [
            <Button
              key={`data-item-${dataItem.dataSourceId}`}
              renderIcon={Edit16}
              hasIconOnly
              kind="ghost"
              size="small"
              onClick={() => handleEditButton(dataItem)}
              iconDescription={mergedI18n.edit}
              tooltipPosition="left"
              tooltipAlignment="center"
            />,
            <Button
              key={`data-item-${dataItem.dataSourceId}_remove`}
              renderIcon={Subtract16}
              hasIconOnly
              kind="ghost"
              size="small"
              onClick={() => handleRemoveButton(dataItem)}
              iconDescription={mergedI18n.remove}
              tooltipPosition="left"
              tooltipAlignment="center"
            />,
          ],
        },
      })),
    [dataSection, handleEditButton, handleRemoveButton, mergedI18n.edit, mergedI18n.remove]
  );

  return (
    <div className={`${iotPrefix}--table-card-form--content`}>
      <DataSeriesFormItemModal
        cardConfig={cardConfig}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editDataSeries={dataSection}
        editDataItem={editDataItem}
        setEditDataItem={setEditDataItem}
        availableDimensions={availableDimensions}
        onChange={handleDataItemModalChanges}
        i18n={mergedI18n}
        actions={actions}
      />
      <ContentFormItemTitle
        title={mergedI18n.tableColumnEditorSectionTitle}
        tooltip={{
          tooltipText: mergedI18n.dataItemEditorSectionTableTooltipText,
          ...(dataSeriesItemLinks?.table
            ? {
                linkText: mergedI18n.dataItemEditorSectionTooltipLinkText,
                href: dataSeriesItemLinks.table,
              }
            : {}),
        }}
      />
      <div
        className={`${baseClassName}--input`} // data item selector
      >
        <ComboBox
          // need to re-gen if selected card changes or if a dataItem is removed from the list
          key={`data-item-select-${hash(validDataItemsForDropdown || {})}-selected_card-id-${
            cardConfig.id
          }`}
          id={`${cardConfig.id}_dataSourceIds-combobox`}
          items={validDataItemsForDropdown}
          itemToString={(item) => item?.text}
          titleText={mergedI18n.dataItem}
          addToList={false}
          placeholder={mergedI18n.filter}
          translateWithId={translateWithId}
          shouldFilterItem={({ item, inputValue }) => {
            return (
              isEmpty(inputValue) || item?.text?.toLowerCase()?.includes(inputValue?.toLowerCase())
            );
          }}
          // clears out the input field after each selection
          selectedItem={{ id: '', text: '' }}
          onChange={handleOnDataSeriesChange}
          light
        />
      </div>

      {!isEmpty(validDimensions) ? (
        <div
          className={`${baseClassName}--input`} // Dimensions selector
        >
          <MultiSelect
            // need to re-gen if selected card changes or if a dataItem is removed from the list
            key={`data-item-select-${removedDataItems.length}-selected_card-id-${cardConfig.id}`}
            id={`${cardConfig.id}_dataSourceIds`}
            label={mergedI18n.selectGroupByDimensions}
            translateWithId={translateWithId}
            direction="bottom"
            itemToString={(item) => item.id}
            initialSelectedItems={initialSelectedDimensions}
            items={validDimensions}
            light
            onChange={({ selectedItems }) => {
              // Add the new dimensions as dimension columns at the beginning of the table
              const newCard = handleDataSeriesChange(
                selectedItems.map((i) => ({
                  dataItemId: i.id,
                  dataSourceId: i.id,
                  label: i.text,
                  dataItemType: 'DIMENSION',
                  destination: 'groupBy',
                })),
                cardConfig,
                null,
                null
              );
              // setSelectedDataItems(selectedItems.map(({ id }) => id));
              onChange(newCard);
            }}
            titleText={mergedI18n.dataItemEditorDimensionTitle}
          />
        </div>
      ) : null}
      <List
        // Lists the selected dataItem columns in the bottom section and allow additional configuration
        key={`data-item-list${selectedDataItems.length}`}
        // need to force an empty "empty state"
        emptyState={<div />}
        title=""
        items={dataListItems}
      />
    </div>
  );
};
TableCardFormContent.defaultProps = defaultProps;
TableCardFormContent.propTypes = propTypes;
export default TableCardFormContent;
