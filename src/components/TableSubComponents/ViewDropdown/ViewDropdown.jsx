import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'carbon-components-react';
import { Settings16 } from '@carbon/icons-react';
import withSize from 'react-sizeme';

import { settings } from '../../../constants/Settings';

import ViewItemPropType from './ViewItemPropTypes';
import ViewDropdownItem from './ViewDropdownItem';

const { iotPrefix } = settings;

const propTypes = {
  /** Set to true if the user has modfied filters etc since the view was loaded */
  activeViewEdited: PropTypes.bool,
  /** The id of the view that is currently selected */
  selectedViewId: PropTypes.string,
  disabled: PropTypes.bool,
  /** An array of items representing the user generated views */
  views: PropTypes.arrayOf(ViewItemPropType),
  i18n: PropTypes.shape({
    view: PropTypes.string,
    edited: PropTypes.string,
    viewAll: PropTypes.string,
    saveAsNewView: PropTypes.string,
    manageViews: PropTypes.string,
    ariaLabel: PropTypes.string,
    tableViewMenu: PropTypes.string,
  }),

  actions: PropTypes.shape({
    /** Callback for when the user selected save new View */
    onSaveAsNewView: PropTypes.func,
    /** Callback for when the user selected Manage views */
    onManageViews: PropTypes.func,
    /** Callback for when the current view is changed by the user */
    onChangeView: PropTypes.func,
  }).isRequired,
  /** Used to overide the internal components and props of the ViewDropdown */
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
};

const defaultProps = {
  views: [],
  selectedViewId: undefined,
  i18n: {
    view: 'View',
    edited: 'Edited',
    viewAll: 'View All',
    saveAsNewView: 'Save as new view',
    manageViews: 'Manage views',
    ariaLabel: 'Select view',
    tableViewMenu: 'Table view menu',
  },
  activeViewEdited: false,
  disabled: false,
  overrides: undefined,
};

const ViewDropdown = ({
  selectedViewId,
  activeViewEdited,
  views,
  actions: { onSaveAsNewView, onManageViews, onChangeView },
  disabled,
  i18n,
  overrides,
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
      const manageViewsItem = {
        id: 'manage-views',
        text: i18n.manageViews,
        customAction: onManageViews,
        icon: Settings16,
      };
      const dialogItems = [...(activeViewEdited ? [saveAsNewItem] : []), manageViewsItem];
      return [viewAllItem, ...views, ...dialogItems];
    },
    [
      activeViewEdited,
      views,
      onManageViews,
      onSaveAsNewView,
      i18n.saveAsNewView,
      i18n.manageViews,
      viewAllItem,
    ]
  );

  const mySelectedItem = allItems.find(item => item.id === selectedViewId) || viewAllItem;
  const MyDropDown = overrides?.dropdown?.component || Dropdown;
  const MyViewDropDownItem = overrides?.dropdownItem?.component || ViewDropdownItem;

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
            data-testid="table-view-dropdown"
            selectedItem={mySelectedItem}
            ariaLabel={i18n.ariaLabel}
            disabled={disabled}
            id={`${iotPrefix}--view-dropdown`}
            // We are using itemToString instead of itemToElement since we need the custom
            // rendering to also happen when the item is selected. See closed PR
            // https://github.com/carbon-design-system/carbon/pull/5578
            itemToString={itemData => {
              return (
                <MyViewDropDownItem
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

ViewDropdown.propTypes = propTypes;
ViewDropdown.defaultProps = defaultProps;

export default ViewDropdown;
