import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Edit16 } from '@carbon/icons-react';


import { settings } from '../../../../../constants/Settings';
import {
  handleDataSeriesChange,
} from '../../../../DashboardEditor/editorUtils';
import { Button, List, MultiSelect } from '../../../../../index';
import { DataItemsPropTypes } from '../../../../DashboardEditor/DashboardEditor';
import DataSeriesFormItemModal from '../DataSeriesFormItemModal';

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
  /** an array of dataItems to be included on each card */
  dataItems: DataItemsPropTypes,
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
  /** list of dataItem names that have been selected to display on the card */
  selectedDataItems: PropTypes.arrayOf(PropTypes.string),
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
  const { content: { columns }} = cardConfig;

  const [showEditor, setShowEditor] = useState(false);
  const [editDataItem, setEditDataItem] = useState({});
  const [editDataSeries, setEditDataSeries] = useState(
    cardConfig.content?.series || []
  );

  const baseClassName = `${iotPrefix}--card-edit-form`;


  // determine which content section to look at
  const dataSection = cardConfig?.content?.columns.filter(column => column.label !== '--');

  const initialSelectedItems = formatDataItemsForDropdown(dataSection);

  const validDimensions = useMemo(() => Object.keys(availableDimensions).map(i => ({ id: i, text: i})), [availableDimensions]);
  const timeStampColumn = cardConfig.content?.columns?.filter(col => col.type === 'TIMESTAMP').map(i => ({id: i.dataSourceId, text: i.label, type: 'TIMESTAMP'}));
  const dataItemColumns = cardConfig.content?.columns?.filter(col => !col?.hasOwnProperty('type'));

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
          key={`data-item-select-selected_card-id-${cardConfig.id}`}
          id={`${cardConfig.id}_dataSourceIds`}
          label={mergedI18n.selectDataItems}
          direction="bottom"
          itemToString={(item) => item.id}
          initialSelectedItems={initialSelectedItems}
          items={formatDataItemsForDropdown(dataItems)}
          light
          onChange={({ selectedItems }) => {
            console.log({selectedItems})
            const newCard = handleDataSeriesChange(
              selectedItems,
              cardConfig,
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
          key={`data-item-select-selected_card-id-${cardConfig.id}`}
          id={`${cardConfig.id}_dataSourceIds`}
          label={mergedI18n.selectGroupByDimensions}
          direction="bottom"
          itemToString={(item) => item.id}
          // initialSelectedItems={initialSelectedItems}
          items={validDimensions}
          light
          onChange={({ selectedItems }) => {
            console.log({selectedItems: selectedItems.map(i => ({...i, type: 'DIMENSION'})), availableDimensions})
            const newCard = handleDataSeriesChange(
              [
                ...timeStampColumn.map(i => ({id: i.dataSourceId, text: i.label, type: 'TIMESTAMP'})) || [],
                ...selectedItems.map(i => ({...i, type: 'DIMENSION'})),
                ...dataItemColumns
                  .map(i => ({id: i.dataSourceId, text: i.label})) || []
              ],
              cardConfig,
            );
            // setSelectedDataItems(selectedItems.map(({ id }) => id));
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