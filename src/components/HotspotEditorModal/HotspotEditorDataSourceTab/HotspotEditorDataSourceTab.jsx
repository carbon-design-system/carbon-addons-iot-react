import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit16 } from '@carbon/icons-react';
import { MultiSelect } from 'carbon-components-react';

import DataSeriesFormItemModal from '../../CardEditor/CardEditForm/CardEditFormItems/DataSeriesFormItemModal';
import List from '../../List/List';
import Button from '../../Button/Button';
import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  hotspot: PropTypes.shape({}),
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
  i18n: PropTypes.shape({
    selectDataItemsText: PropTypes.string,
    dataItemText: PropTypes.string,
    editText: PropTypes.string,
    // items for data item modal
    dataItemEditorDataItemTitle: PropTypes.string,
    dataItemEditorDataItemCustomLabel: PropTypes.string,
    dataItemEditorDataItemUnit: PropTypes.string,
    dataItemEditorDataItemFilter: PropTypes.string,
    dataItemEditorDataItemThresholds: PropTypes.string,
    dataItemEditorDataItemAddThreshold: PropTypes.string,
    primaryButtonLabelText: PropTypes.string,
    secondaryButtonLabelText: PropTypes.string,
  }),
  /** callback called when hotspot data source changes, if new attributes are added it's called with an object only with attributes.
   * If an existing data item is modified, this callback is called with the whole updated card
   * TODO: ideally these two operations would be split into two different callbacks
   */
  onChange: PropTypes.func.isRequired,
  /** Id that can be used for testing */
  testID: PropTypes.string,
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
  hotspot: {},
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
    primaryButtonLabelText: 'Update',
    secondaryButtonLabelText: 'Cancel',
  },
  dataItems: [],
  availableDimensions: {},
  testID: 'HotspotEditorDataSourceTab',
};

export const formatDataItemsForDropdown = (dataItems) =>
  dataItems?.map(({ dataSourceId }) => ({
    id: dataSourceId,
    text: dataSourceId,
  }));

const HotspotEditorDataSourceTab = ({
  hotspot,
  cardConfig,
  dataItems,
  i18n,
  onChange,
  availableDimensions,
  testID,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const [showEditor, setShowEditor] = useState(false);
  const [editDataItem, setEditDataItem] = useState({});
  const selectedItemsArray = hotspot.content?.attributes || [];

  const baseClassName = `${iotPrefix}--card-edit-form`;
  const initialSelectedItems = formatDataItemsForDropdown(selectedItemsArray);

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
    onChange({ attributes: newArray });
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
        setEditDataSeries={setEditDataItem}
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
          items={formatDataItemsForDropdown(dataItems)}
          light
          onChange={handleSelectionChange}
          titleText={mergedI18n.dataItemText}
        />
      </div>
      <List
        // need to force an empty "empty state"
        emptyState={<div />}
        title=""
        items={selectedItemsArray?.map((dataItem) => ({
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
                  });
                  setShowEditor(true);
                }}
                iconDescription={mergedI18n.editText}
              />,
            ],
          },
        }))}
      />
    </div>
  );
};

HotspotEditorDataSourceTab.propTypes = propTypes;
HotspotEditorDataSourceTab.defaultProps = defaultProps;

export default HotspotEditorDataSourceTab;
