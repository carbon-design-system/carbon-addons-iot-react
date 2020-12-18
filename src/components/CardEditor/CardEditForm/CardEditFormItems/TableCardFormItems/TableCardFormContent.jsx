import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Edit16 } from '@carbon/icons-react';
import omit from 'lodash/omit';


import { settings } from '../../../../../constants/Settings';
import {
  DATAITEM_COLORS_OPTIONS,
  handleDataSeriesChange,
} from '../../../../DashboardEditor/editorUtils';
import { Button, List, MultiSelect } from '../../../../../index';
import { DataItemsPropTypes } from '../../../../DashboardEditor/DashboardEditor';
import DataSeriesFormItemModal from '../DataSeriesFormItemModal';
import {
  CARD_TYPES
} from '../../../../../constants/LayoutConstants';

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
  /** list of dataItem names that have been selected to display on the card */
  selectedDataItems: PropTypes.arrayOf(PropTypes.string),
  setSelectedDataItems: PropTypes.func.isRequired,
  selectedTimeRange: PropTypes.string.isRequired,
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
  getValidDataItems: null,
  dataItems: [],
  selectedDataItems: [],
  availableDimensions: {},
};

export const formatDataItemsForDropdown = (dataItems) =>
  dataItems?.map(({ dataSourceId }) => ({
    id: dataSourceId,
    text: dataSourceId,
  })) || [];



const TableCardFormContent = ({
  cardConfig,
  dataItems,
  getValidDataItems,
  onChange,
  selectedDataItems,
  setSelectedDataItems,
  selectedTimeRange,
  availableDimensions,
  i18n,
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
    cardConfig.type === CARD_TYPES.TIMESERIES ||
    cardConfig.type === CARD_TYPES.BAR;


  // determine which content section to look at
  const dataSection =
    cardConfig.type === CARD_TYPES.TIMESERIES ||
    cardConfig.type === CARD_TYPES.BAR
      ? cardConfig?.content?.series
      : cardConfig.type === CARD_TYPES.TABLE
      ? cardConfig?.content?.columns.filter(column => column.label !== '--')
      : cardConfig?.content?.attributes;

  const initialSelectedItems = formatDataItemsForDropdown(dataSection);

  const validDataItems = getValidDataItems
    ? getValidDataItems(cardConfig, selectedTimeRange)
    : dataItems;
  const validDimensions = useMemo(() => Object.keys(availableDimensions).map(i => ({ id: i, text: i})), [availableDimensions]);

  return (
    <>
      <DataSeriesFormItemModal
        cardConfig={cardConfig}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editDataSeries={editDataSeries}
        setEditDataSeries={setEditDataSeries}
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
          // need to re-gen if selected card changes or if a dataItem is removed from the list
          key={`data-item-select-${removedDataItems.length}-selected_card-id-${cardConfig.id}`}
          id={`${cardConfig.id}_dataSourceIds`}
          label={mergedI18n.selectDataItems}
          direction="bottom"
          itemToString={(item) => item.id}
          initialSelectedItems={initialSelectedItems}
          items={formatDataItemsForDropdown(validDataItems)}
          light
          onChange={({ selectedItems }) => {
            console.log({selectedItems})
            const newCard = handleDataSeriesChange(
              selectedItems,
              cardConfig,
              setEditDataSeries
            );
            setSelectedDataItems(selectedItems.map(({ id }) => id));
            onChange(newCard);
          }}
          titleText={mergedI18n.dataItem}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <MultiSelect
          // need to re-gen if selected card changes or if a dataItem is removed from the list
          key={`data-item-select-${removedDataItems.length}-selected_card-id-${cardConfig.id}`}
          id={`${cardConfig.id}_dataSourceIds`}
          label={mergedI18n.selectGroupByDimensions}
          direction="bottom"
          itemToString={(item) => item.id}
          // initialSelectedItems={initialSelectedItems}
          items={validDimensions}
          light
          onChange={({ selectedItems }) => {
            console.log({selectedItems, availableDimensions})
            const newCard = handleDataSeriesChange(
              selectedItems,
              cardConfig,
              setEditDataSeries
            );
            setSelectedDataItems(selectedItems.map(({ id }) => id));
            onChange(newCard);
          }}
          titleText={mergedI18n.dataItemEditorDimensionTitle}
        />
      </div>
      <List
        key={`data-item-list${selectedDataItems.length}`}
        // need to force an empty "empty state"
        emptyState={<div />}
        title=""
        items={dataSection?.map((dataItem, i) => ({
          id: dataItem.dataSourceId,
          content: {
            value: dataItem.label,
            icon: isComplexDataSeries ? (
              <div
                style={{
                  width: '1rem',
                  height: '1rem',
                  backgroundColor:
                    dataItem.color ||
                    DATAITEM_COLORS_OPTIONS[i % DATAITEM_COLORS_OPTIONS.length],
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
                  if (isComplexDataSeries) {
                    const filteredItems = cardConfig.content?.series?.filter(
                      (item) => item.dataSourceId !== dataItem.dataSourceId
                    );
                    setSelectedDataItems(
                      filteredItems.map((item) => item.dataSourceId)
                    );
                    setRemovedDataItems([
                      ...removedDataItems,
                      cardConfig.content?.series?.find(
                        (item) => item.dataSourceId === dataItem.dataSourceId
                      ),
                    ]);
                    setEditDataSeries(filteredItems);
                    onChange({
                      ...cardConfig,
                      content: {
                        ...cardConfig.content,
                        series: filteredItems,
                      },
                    });
                  } else {
                    setEditDataItem(dataItem);
                    setShowEditor(true);
                  }
                }}
                iconDescription={
                  isComplexDataSeries ? mergedI18n.remove : mergedI18n.edit
                }
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
TableCardFormContent.defaultProps = defaultProps;
TableCardFormContent.propTypes = propTypes;
export default TableCardFormContent;