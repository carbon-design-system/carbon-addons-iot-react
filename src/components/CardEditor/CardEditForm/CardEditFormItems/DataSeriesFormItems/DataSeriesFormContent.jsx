import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit16, Subtract16 } from '@carbon/icons-react';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import uuid from 'uuid';

import { settings } from '../../../../../constants/Settings';
import {
  DATAITEM_COLORS_OPTIONS,
  handleDataSeriesChange,
  DataItemsPropTypes,
} from '../../../../DashboardEditor/editorUtils';
import {
  Button,
  List,
  MultiSelect,
  ComboBox,
  Dropdown,
} from '../../../../../index';
import DataSeriesFormItemModal from '../DataSeriesFormItemModal';
import {
  CARD_TYPES,
  BAR_CHART_TYPES,
} from '../../../../../constants/LayoutConstants';

import BarChartDataSeriesContent from './BarChartDataSeriesContent';

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
      showLegend: PropTypes.bool,
    }),
    interval: PropTypes.string,
  }),
  /* callback when image input value changes (File object) */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    dataItemEditorTitle: PropTypes.string,
    dataItemEditorDataItemTitle: PropTypes.string,
    dataItemEditorDataItemLabel: PropTypes.string,
    dataItemEditorLegendColor: PropTypes.string,
    dataSeriesTitle: PropTypes.string,
    selectDataItems: PropTypes.string,
    selectDataItem: PropTypes.string,
    dataItem: PropTypes.string,
    edit: PropTypes.string,
    remove: PropTypes.string,
    customize: PropTypes.string,
    clearAllText: PropTypes.string,
    clearSelectionText: PropTypes.string,
    openMenuText: PropTypes.string,
    closeMenuText: PropTypes.string,
  }),
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
  /** list of dataItem names that have been selected to display on the card */
  selectedDataItems: PropTypes.arrayOf(PropTypes.string),
  setSelectedDataItems: PropTypes.func.isRequired,
  selectedTimeRange: PropTypes.string.isRequired,
  isSummaryDashboard: PropTypes.bool,
  translateWithId: PropTypes.func.isRequired,
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    dataItemEditorTitle: 'Edit data series',
    dataItemEditorDataItemTitle: 'Data item',
    dataItemEditorDataItemLabel: 'Label',
    dataItemEditorLegendColor: 'Legend color',
    dataSeriesTitle: 'Data',
    selectDataItems: 'Select data items',
    selectDataItem: 'Select data item',
    dataItem: 'Data item',
    edit: 'Edit',
    remove: 'Remove',
    customize: 'Customize',
    filter: 'Filter',
    clearAllText: 'Clear all',
    clearSelectionText: 'Clear selection',
    openMenuText: 'Open menu',
    closeMenuText: 'Close menu',
  },
  getValidDataItems: null,
  dataItems: [],
  selectedDataItems: [],
  availableDimensions: {},
  isSummaryDashboard: false,
};

export const formatDataItemsForDropdown = (dataItems) =>
  dataItems?.map(({ dataSourceId }) => ({
    id: dataSourceId,
    text: dataSourceId,
  })) || [];

const DataSeriesFormItem = ({
  cardConfig,
  isSummaryDashboard,
  dataItems,
  getValidDataItems,
  onChange,
  selectedDataItems,
  setSelectedDataItems,
  selectedTimeRange,
  availableDimensions,
  i18n,
  translateWithId,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const [showEditor, setShowEditor] = useState(false);
  const [editDataItem, setEditDataItem] = useState({});
  const [editDataSeries, setEditDataSeries] = useState(
    cardConfig.content?.series || []
  );
  const [removedDataItems, setRemovedDataItems] = useState([]);

  const baseClassName = `${iotPrefix}--card-edit-form`;

  const isComplexDataSeries =
    cardConfig.content?.type === BAR_CHART_TYPES.GROUPED;

  const canMultiSelectDataItems =
    cardConfig.content?.type !== BAR_CHART_TYPES.SIMPLE;

  // determine which content section to look at
  const data =
    cardConfig.type === CARD_TYPES.TIMESERIES ||
    cardConfig.type === CARD_TYPES.BAR
      ? cardConfig?.content?.series
      : cardConfig?.content?.attributes;

  // initialize items with a unique id if not present
  const dataSection = data?.map((item) =>
    !item.uuid ? { ...item, uuid: uuid.v4() } : item
  );

  const initialSelectedItems = formatDataItemsForDropdown(dataSection);

  const validDataItems = getValidDataItems
    ? getValidDataItems(cardConfig, selectedTimeRange)
    : dataItems;

  return (
    <>
      <DataSeriesFormItemModal
        cardConfig={cardConfig}
        isSummaryDashboard={isSummaryDashboard}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editDataSeries={editDataSeries}
        setEditDataSeries={setEditDataSeries}
        editDataItem={editDataItem}
        setEditDataItem={setEditDataItem}
        validDataItems={validDataItems}
        availableDimensions={availableDimensions}
        dataSection={dataSection}
        onChange={onChange}
        i18n={mergedI18n}
      />
      <div className={`${baseClassName}--form-section`}>
        {mergedI18n.dataSeriesTitle}
      </div>
      {cardConfig.type === CARD_TYPES.BAR ? (
        <BarChartDataSeriesContent
          cardConfig={cardConfig}
          onChange={onChange}
          availableDimensions={availableDimensions}
          i18n={mergedI18n}
          translateWithId={translateWithId}
        />
      ) : null}
      {canMultiSelectDataItems ? (
        isComplexDataSeries ? (
          <div className={`${baseClassName}--input`}>
            <MultiSelect
              // need to re-gen if selected card changes or if a dataItem is removed from the list
              key={`data-item-select-${removedDataItems.length}-selected_card-id-${cardConfig.id}`}
              id={`${cardConfig.id}_dataSourceIds-select`}
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
                  setEditDataSeries
                );
                setSelectedDataItems(selectedItems.map(({ id }) => id));
                onChange(newCard);
              }}
              titleText={mergedI18n.dataItem}
              translateWithId={translateWithId}
            />
          </div>
        ) : (
          <div className={`${baseClassName}--input`}>
            <ComboBox
              // need to re-gen if selected card changes or if a dataItem is removed from the list
              key={`data-item-select-${removedDataItems.length}-selected_card-id-${cardConfig.id}`}
              id={`${cardConfig.id}_dataSourceIds-combobox`}
              items={formatDataItemsForDropdown(validDataItems)}
              itemToString={(item) => item.id}
              titleText={mergedI18n.dataItemEditorDataItemTitle}
              addToList={false}
              placeholder={mergedI18n.filter}
              // clears out the input field after each selection
              selectedItem={{ id: '', text: '' }}
              onChange={(selectedItem) => {
                // ignore the value added by the "enter" keypress
                if (selectedItem && !selectedItem.id.includes('iot-input')) {
                  const itemWithMetaData = validDataItems?.find(
                    ({ dataSourceId }) => dataSourceId === selectedItem.id
                  );

                  const selectedItems = [
                    ...dataSection.map((item) => ({
                      ...item,
                      ...(!item.uuid && { uuid: uuid.v4() }),
                      id: item.dataSourceId,
                    })),
                    {
                      ...selectedItem,
                      ...(itemWithMetaData && { ...itemWithMetaData }),
                      uuid: uuid.v4(),
                    },
                  ];
                  // need to remove the category if the card is a stacked timeseries bar
                  const card =
                    cardConfig.content.type === BAR_CHART_TYPES.STACKED &&
                    cardConfig.content.timeDataSourceId &&
                    selectedItems.length > 1
                      ? omit(cardConfig, 'content.categoryDataSourceId')
                      : cardConfig;
                  const newCard = handleDataSeriesChange(
                    selectedItems,
                    card,
                    setEditDataSeries
                  );
                  setSelectedDataItems(selectedItems.map(({ id }) => id));
                  onChange(newCard);
                }
              }}
              light
            />
          </div>
        )
      ) : (
        // Can't select more than one dataItem
        <div className={`${baseClassName}--input`}>
          <Dropdown
            id={`${cardConfig.id}_dataSourceId`}
            direction="bottom"
            label={mergedI18n.selectDataItem}
            light
            translateWithId={translateWithId}
            titleText={mergedI18n.dataItem}
            items={validDataItems.map(({ dataSourceId }) => dataSourceId)}
            selectedItem={
              !isEmpty(cardConfig.content?.series)
                ? cardConfig.content?.series[0].dataSourceId
                : null
            }
            onChange={({ selectedItem }) => {
              const itemWithMetaData = validDataItems?.find(
                ({ dataSourceId }) => dataSourceId === selectedItem
              );
              const newCard = handleDataSeriesChange(
                [
                  {
                    id: selectedItem,
                    ...(itemWithMetaData && { ...itemWithMetaData }),
                  },
                ],
                cardConfig,
                setEditDataSeries
              );
              setSelectedDataItems([selectedItem]);
              onChange(newCard);
            }}
          />
        </div>
      )}
      <List
        key={`data-item-list${selectedDataItems.length}`}
        // need to force an empty "empty state"
        emptyState={<div />}
        title=""
        items={dataSection?.map((dataItem, i) => ({
          id: dataItem.dataSourceId,
          content: {
            value: dataItem.label,
            icon:
              cardConfig.type === CARD_TYPES.TIMESERIES ||
              cardConfig.type === CARD_TYPES.BAR ? (
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
              !isComplexDataSeries && [
                <Button
                  key={`data-item-${dataItem.dataSourceId}_edit`}
                  renderIcon={Edit16}
                  hasIconOnly
                  kind="ghost"
                  size="small"
                  onClick={() => {
                    const dataItemWithMetaData = validDataItems?.find(
                      ({ dataSourceId }) =>
                        dataSourceId === dataItem.dataSourceId
                    );
                    setEditDataItem({
                      ...omit(dataItemWithMetaData, 'uuid'),
                      ...dataItem,
                      ...(cardConfig.type === CARD_TYPES.TIMESERIES ||
                      cardConfig.type === CARD_TYPES.BAR
                        ? {
                            color:
                              dataItem.color ||
                              DATAITEM_COLORS_OPTIONS[
                                i % DATAITEM_COLORS_OPTIONS.length
                              ],
                          }
                        : {}),
                    });
                    // need to reset the card to include the unique id's
                    onChange({
                      ...cardConfig,
                      content: {
                        ...cardConfig.content,
                        ...(cardConfig.type === CARD_TYPES.VALUE
                          ? { attributes: dataSection }
                          : { series: dataSection }),
                      },
                    });
                    setShowEditor(true);
                  }}
                  iconDescription={mergedI18n.edit}
                />,
              ],
              <Button
                key={`data-item-${dataItem.dataSourceId}_remove`}
                renderIcon={Subtract16}
                hasIconOnly
                kind="ghost"
                size="small"
                onClick={() => {
                  const filteredItems = dataSection.filter(
                    (item) => item.uuid !== dataItem.uuid
                  );
                  setSelectedDataItems(
                    filteredItems.map((item) => item.dataSourceId)
                  );
                  setRemovedDataItems([...removedDataItems, dataItem]);
                  setEditDataSeries(filteredItems);
                  onChange({
                    ...cardConfig,
                    content: {
                      ...cardConfig.content,
                      ...(cardConfig.type === CARD_TYPES.VALUE
                        ? { attributes: filteredItems }
                        : { series: filteredItems }),
                    },
                  });
                }}
                iconDescription={mergedI18n.remove}
              />,
            ],
          },
        }))}
      />
      {isComplexDataSeries && dataSection.length ? (
        <Button
          renderIcon={Edit16}
          kind="ghost"
          size="small"
          onClick={() => {
            setShowEditor(true);
          }}
          iconDescription={mergedI18n.customize}>
          {mergedI18n.customize}
        </Button>
      ) : null}
    </>
  );
};
DataSeriesFormItem.defaultProps = defaultProps;
DataSeriesFormItem.propTypes = propTypes;
export default DataSeriesFormItem;
