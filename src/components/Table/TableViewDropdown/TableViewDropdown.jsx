import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'carbon-components-react';
import { Settings16 } from '@carbon/icons-react';
import withSize from 'react-sizeme';

import { settings } from '../../../constants/Settings';

import TableViewItemPropType from './TableViewItemPropTypes';
import TableViewDropdownItem from './TableViewDropdownItem';

const { iotPrefix } = settings;

const propTypes = {
  /** Set to true if the user has modfied filters etc since the view was loaded */
  activeViewEdited: PropTypes.bool,
  /** The id of the view that is currently selected */
  selectedViewId: PropTypes.string,
  disabled: PropTypes.bool,
  /** An array of items representing the user generated views */
  views: PropTypes.arrayOf(TableViewItemPropType),
  i18n: PropTypes.shape({
    view: PropTypes.string,
    edited: PropTypes.string,
    viewAll: PropTypes.string,
    saveAsNewView: PropTypes.string,
    saveView: PropTypes.string,
    manageViews: PropTypes.string,
    ariaLabel: PropTypes.string,
    tableViewMenu: PropTypes.string,
  }),

  actions: PropTypes.shape({
    /** Callback for when the user selected save new View */
    onSaveAsNewView: PropTypes.func,
    /** Callback for when the user selected save View */
    onSaveView: PropTypes.func,
    /** Callback for when the user selected Manage views */
    onManageViews: PropTypes.func,
    /** Callback for when the current view is changed by the user */
    onChangeView: PropTypes.func,
  }).isRequired,
  /** Used to overide the internal components and props of the TableViewDropdown */
  overrides: PropTypes.shape({
    dropdown: PropTypes.shape({
      props: PropTypes.object,
      component: PropTypes.elementType,
    }),
    dropdownItem: PropTypes.shape({
      props: PropTypes.object,
      component: PropTypes.elementType,
    }),
  }),
  testID: PropTypes.string,
};

const defaultProps = {
  views: [],
  selectedViewId: undefined,
  i18n: {
    view: 'View',
    edited: 'Edited',
    viewAll: 'View All',
    saveAsNewView: 'Save as new view',
    saveView: 'Save view',
    manageViews: 'Manage views',
    ariaLabel: 'Select view',
    tableViewMenu: 'Table view menu',
  },
  activeViewEdited: false,
  disabled: false,
  overrides: undefined,
  testID: 'TableViewDropdown',
};

const TableViewDropdown = ({
  selectedViewId,
  activeViewEdited,
  views,
  actions: { onSaveView, onSaveAsNewView, onManageViews, onChangeView },
  disabled,
  i18n,
  overrides,
  testID,
}) => {
  const viewAllItem = {
    id: 'view-all',
    text: i18n.viewAll,
  };
  const allItems = useMemo(
    () => {
      const saveAsNewItem = {
        id: 'save-new-view',
        text: i18n.saveAsNewView,
        customAction: onSaveAsNewView,
      };
      const saveItem = {
        id: 'save-view',
        text: i18n.saveView,
        customAction: onSaveView,
      };
      const manageViewsItem = {
        id: 'manage-views',
        text: i18n.manageViews,
        customAction: onManageViews,
        icon: Settings16,
      };
      const dialogItems = [saveAsNewItem, saveItem, manageViewsItem];
      return [viewAllItem, ...views, ...dialogItems];
    },
    [
      i18n.saveAsNewView,
      i18n.saveView,
      i18n.manageViews,
      onSaveAsNewView,
      onSaveView,
      onManageViews,
      viewAllItem,
      views,
    ]
  );

  const mySelectedItem = allItems.find(item => item.id === selectedViewId) || viewAllItem;
  const MyDropDown = overrides?.dropdown?.component || Dropdown;
  const MyTableViewDropDownItem = overrides?.dropdownItem?.component || TableViewDropdownItem;

  const onSelectionChange = change => {
    const item = change.selectedItem;
    if (item) {
      if (item.customAction) {
        item.customAction(item);
      } else {
        onChangeView(item);
      }
    }
  };

  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        return (
          <MyDropDown
            label={i18n.tableViewMenu}
            data-testid={testID}
            selectedItem={mySelectedItem}
            ariaLabel={i18n.ariaLabel}
            disabled={disabled}
            id={`${iotPrefix}--view-dropdown`}
            // We are using itemToString instead of itemToElement since we need the custom
            // rendering to also happen when the item is selected. See closed PR
            // https://github.com/carbon-design-system/carbon/pull/5578
            itemToString={itemData => {
              return (
                <MyTableViewDropDownItem
                  testID={`TableViewDropdownItem-${itemData.id}`}
                  isCompact={measuredSize?.width < 200}
                  item={itemData}
                  isSelected={itemData.id === mySelectedItem.id}
                  activeViewEdited={activeViewEdited}
                  i18n={i18n}
                  {...overrides?.dropdownItem?.props}
                />
              );
            }}
            items={allItems}
            light={false}
            onChange={onSelectionChange}
            {...overrides?.dropdown?.props}
          />
        );
      }}
    </withSize.SizeMe>
  );
};

TableViewDropdown.propTypes = propTypes;
TableViewDropdown.defaultProps = defaultProps;

export default TableViewDropdown;
