import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit16 } from '@carbon/icons-react';
import { MultiSelect } from 'carbon-components-react';

import DataSeriesFormItemModal from '../../CardEditor/CardEditForm/CardEditFormItems/DataSeriesFormItemModal';
import List from '../../List/List';
import Button from '../../Button/Button';
// import {formatDataItemsForDropdown} from '../../CardEditor/CardEditForm/CardEditFormItems/DataSeriesFormItems/DataSeriesFormContent';
// import { OverridePropTypes } from '../../../constants/SharedPropTypes';
import { settings } from '../../../constants/Settings';
import { handleDataSeriesChange } from '../../DashboardEditor/editorUtils';

const { iotPrefix } = settings;

const propTypes = {
  title: PropTypes.string.isRequired,
  cardConfig: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.shape({
      alt: PropTypes.string,
      src: PropTypes.string,
      image: PropTypes.string,
      hideMinimap: PropTypes.bool,
      hideHotspots: PropTypes.bool,
      hideZoomControls: PropTypes.bool,
      id: PropTypes.string,
    }),
    description: PropTypes.string,
    values: PropTypes.shape({
      hotspots: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  i18n: PropTypes.shape({}),
  /* callback when image input value changes */
  onChange: PropTypes.func.isRequired,
  /** Id that can be used for testing */
  testID: PropTypes.string,
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
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    selectDataItemsText: 'Select data items',
    dataItemText: 'Data items',
    editText: 'Edit',
    // items for data item modal
    dataItemEditorDataItemTitle: 'Data items',
    dataItemEditorDataItemCustomLabel: 'Custom label',
    dataItemEditorDataItemUnit: 'Unit',
    dataItemEditorDataItemFilter: 'Data filter',
    dataItemEditorDataItemThresholds: 'Thresholds',
    dataItemEditorDataItemAddThreshold: 'Add threshold',
  },
  getValidDataItems: null,
  dataItems: [],
  availableDimensions: {},
  testID: 'HotspotEditorDataSourceTab',
};

export const formatDataItemsForDropdown = (dataItems) =>
  dataItems?.map(({ dataSourceId }) => ({
    id: dataSourceId,
    text: dataSourceId,
  })) || [];

const HotspotEditorDataSourceTab = ({
  title,
  cardConfig,
  dataItems,
  getValidDataItems,
  i18n,
  onChange,
  availableDimensions,
  testID,
  ...other
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const [showEditor, setShowEditor] = useState(false);
  const [editDataItem, setEditDataItem] = useState({});
  const [selectedItemsArray, setSelectedItemsArray] = useState(
    () =>
      cardConfig?.content?.hotspots?.find((hotspot) => hotspot.title === title)
        ?.content?.attributes || []
  );

  const baseClassName = `${iotPrefix}--card-edit-form`;
  const initialSelectedItems = formatDataItemsForDropdown(selectedItemsArray);
  const validDataItems = getValidDataItems
    ? getValidDataItems(cardConfig, other.selectedTimeRange)
    : dataItems;

  const handleSelectionChange = ({ selectedItems }) => {
    const newArray = [];
    // loop through  selected Items and find their selectedItemsArray object or the dataItem object with same id
    selectedItems.forEach((item) => {
      const containedItem = selectedItemsArray.find(
        (selectedItem) => selectedItem.dataSourceId === item.id
      );
      const containedDataItem = dataItems.find(
        (selectedItem) => selectedItem.dataSourceId === item.id
      );
      if (containedItem) {
        newArray.push(containedItem);
      } else if (containedDataItem) {
        newArray.push(containedDataItem);
      }
    });
    setSelectedItemsArray(newArray);
    const newCard = handleDataSeriesChange(newArray, cardConfig, title);
    onChange(newCard);
  };

  return (
    <div data-testid={testID}>
      <DataSeriesFormItemModal
        isLarge
        cardConfig={cardConfig}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editDataItem={editDataItem}
        setEditDataItem={setEditDataItem}
        availableDimensions={availableDimensions}
        onChange={onChange}
        i18n={mergedI18n}
      />
      <div className={`${baseClassName}--input`}>
        <MultiSelect
          key={cardConfig.id} // need to re-gen if selected card changes
          id={`${cardConfig.id}_dataSourceIds`}
          label={mergedI18n.selectDataItemsText}
          direction="bottom"
          itemToString={(item) => item.id}
          initialSelectedItems={initialSelectedItems}
          items={formatDataItemsForDropdown(validDataItems)}
          light
          onChange={handleSelectionChange}
          titleText={mergedI18n.dataItemText}
        />
      </div>
      <List
        // need to force an empty "empty state"
        emptyState={<div />}
        title=""
        items={selectedItemsArray?.map((dataItem) => {
          const thresholds =
            cardConfig?.thresholds?.filter(
              (threshold) => threshold.dataSourceId === dataItem.dataSourceId
            ) || [];
          return {
            id: dataItem.dataSourceId,
            content: {
              value: dataItem.label,
              rowActions: () => [
                <Button
                  key={`data-item-${dataItem.dataSourceId}`}
                  renderIcon={Edit16}
                  hasIconOnly
                  kind="ghost"
                  size="small"
                  onClick={() => {
                    setEditDataItem({
                      ...dataItem,
                      thresholds,
                    });
                    setShowEditor(true);
                  }}
                  iconDescription={mergedI18n.editText}
                />,
              ],
            },
          };
        })}
      />
    </div>
  );
};

HotspotEditorDataSourceTab.propTypes = propTypes;
HotspotEditorDataSourceTab.defaultProps = defaultProps;

export default HotspotEditorDataSourceTab;
