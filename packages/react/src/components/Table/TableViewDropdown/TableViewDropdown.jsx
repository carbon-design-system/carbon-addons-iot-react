import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'carbon-components-react';
import { Settings16 } from '@carbon/icons-react';
import withSize from 'react-sizeme';

import { settings } from '../../../constants/Settings';
import { OverridePropTypes } from '../../../constants/SharedPropTypes';
import { useDropdownTitleFixer } from '../../IconDropdown/dropdownHooks';

import TableViewItemPropType from './TableViewItemPropTypes';
import TableViewDropdownItem from './TableViewDropdownItem';

const { iotPrefix } = settings;

const propTypes = {
  /** Set to true if the user has modified filters etc since the view was loaded */
  selectedViewEdited: PropTypes.bool,
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
    saveChanges: PropTypes.string,
    manageViews: PropTypes.string,
    ariaLabel: PropTypes.string,
    tableViewMenu: PropTypes.string,
  }),

  actions: PropTypes.shape({
    /** Callback for when the user selected save new View */
    onSaveAsNewView: PropTypes.func,
    /** Callback for when the user selected save View */
    onSaveChanges: PropTypes.func,
    /** Callback for when the user selected Manage views */
    onManageViews: PropTypes.func,
    /** Callback for when the current view is changed by the user */
    onChangeView: PropTypes.func,
  }).isRequired,
  /** Used to override the internal components and props of the TableViewDropdown */
  overrides: PropTypes.shape({
    dropdown: OverridePropTypes,
    dropdownItem: OverridePropTypes,
  }),
  style: PropTypes.objectOf(PropTypes.string),
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
    saveChanges: 'Save changes',
    manageViews: 'Manage views',
    ariaLabel: 'Select view',
    tableViewMenu: 'Table view menu',
  },
  selectedViewEdited: false,
  disabled: false,
  overrides: undefined,
  style: undefined,
  testID: 'TableViewDropdown',
};

const TableViewDropdown = ({
  selectedViewId,
  selectedViewEdited,
  views,
  actions: { onSaveChanges, onSaveAsNewView, onManageViews, onChangeView },
  disabled,
  i18n,
  overrides,
  style,
  testID,
}) => {
  const viewAllItem = {
    id: 'view-all',
    text: i18n.viewAll,
  };
  const allItems = useMemo(() => {
    const saveAsNewItem = {
      id: 'save-new-view',
      text: i18n.saveAsNewView,
      customAction: onSaveAsNewView,
    };
    const saveItem = {
      id: 'save-changes',
      text: i18n.saveChanges,
      customAction: onSaveChanges,
    };
    const manageViewsItem = {
      id: 'manage-views',
      text: i18n.manageViews,
      customAction: onManageViews,
      icon: Settings16,
    };
    // Save changes button show only appear if the view has been edited and the current view is not 'View all'
    // 'View all' is equivalent to a "default view", which would not be able to get re-saved. The user should supply
    // their own default views that can be changed if they would like that functionality
    const dialogItems =
      selectedViewEdited && selectedViewId && selectedViewId !== 'view-all'
        ? [saveAsNewItem, saveItem, manageViewsItem]
        : [saveAsNewItem, manageViewsItem];

    // move the action / dialog items to the top so that they are always easily accessible in the case that there are
    // many views. The user would need to scroll all the way to the bottom to find the actions
    return [...dialogItems, viewAllItem, ...views];
  }, [
    i18n.saveAsNewView,
    i18n.saveChanges,
    i18n.manageViews,
    onSaveAsNewView,
    onSaveChanges,
    onManageViews,
    selectedViewEdited,
    selectedViewId,
    viewAllItem,
    views,
  ]);

  const mySelectedItem = allItems.find((item) => item.id === selectedViewId) || viewAllItem;
  const MyDropDown = overrides?.dropdown?.component || Dropdown;
  const MyTableViewDropDownItem = overrides?.dropdownItem?.component || TableViewDropdownItem;
  const [dropdownRef, updateTitle] = useDropdownTitleFixer();

  useEffect(() => {
    if (mySelectedItem?.text && dropdownRef?.current) {
      updateTitle(
        selectedViewEdited ? `${mySelectedItem.text} - ${i18n.edited}` : mySelectedItem.text
      );
    }
  }, [dropdownRef, i18n.edited, mySelectedItem, selectedViewEdited, updateTitle]);

  const onSelectionChange = (change) => {
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
          <div className={`${iotPrefix}--view-dropdown__container`} style={style}>
            <MyDropDown
              ref={dropdownRef}
              label={i18n.tableViewMenu}
              data-testid={testID}
              selectedItem={mySelectedItem}
              ariaLabel={i18n.ariaLabel}
              disabled={disabled}
              id={`${iotPrefix}--view-dropdown`}
              // We are using itemToString instead of itemToElement since we need the custom
              // rendering to also happen when the item is selected. See closed PR
              // https://github.com/carbon-design-system/carbon/pull/5578
              itemToString={(itemData) => {
                return (
                  <MyTableViewDropDownItem
                    testID={`TableViewDropdownItem-${itemData.id}`}
                    isCompact={measuredSize?.width < 200}
                    item={itemData}
                    isSelected={itemData.id === mySelectedItem.id}
                    activeViewEdited={selectedViewEdited}
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
          </div>
        );
      }}
    </withSize.SizeMe>
  );
};

TableViewDropdown.propTypes = propTypes;
TableViewDropdown.defaultProps = defaultProps;

export default TableViewDropdown;
