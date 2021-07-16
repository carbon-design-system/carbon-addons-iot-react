import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight16, Subtract16 } from '@carbon/icons-react';

import HierarchyList from '../List/HierarchyList';
import { settings } from '../../constants/Settings';
import Button from '../Button/Button';
import deprecate from '../../internal/deprecate';

const { iotPrefix } = settings;

export const ListBuilderItemPropTypes = {
  /** the id of this item */
  id: PropTypes.string,
  content: PropTypes.shape({
    /** the value of this item */
    value: PropTypes.string,

    /**
     * a function that returns an array of elements to trigger actions if the list builder has complex structure or logic
     * otherwise, this will be populated by the ListBuilder as a simple add or remove button.
     */
    rowActions: PropTypes.func,
  }),

  /** is this item disabled */
  disabled: PropTypes.bool,

  /** allows for groups or categories, see SelectUsersModal for a complex example */
  isCategory: PropTypes.bool,

  /** allows for groups or categories, see SelectUsersModal for a complex example */
  children: PropTypes.arrayOf(PropTypes.object),
};

const propTypes = {
  // TODO: remove deprecated testID in v3.
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  testId: PropTypes.string,

  /** the list of all items available to select in the ListBuilder */
  items: PropTypes.arrayOf(PropTypes.shape(ListBuilderItemPropTypes)),

  /** if the items contain children or groups, a proper count can be passed here. */
  itemCount: PropTypes.number,

  /** an array of all selected items */
  selectedItems: PropTypes.arrayOf(PropTypes.shape(ListBuilderItemPropTypes)),

  /** (event, id) => void */
  onAdd: PropTypes.func,

  /** (event, id) => void */
  onRemove: PropTypes.func,

  i18n: PropTypes.shape({
    /** (count) => `Items (${count} available)` */
    allListTitle: PropTypes.func,

    /** (count) => `${count} items selected` */
    selectedListTitle: PropTypes.func,

    /** remove aria label on selected items */
    removeLabel: PropTypes.string,

    /** add aria label on unselected items */
    addLabel: PropTypes.string,

    /** placeholder text for the search box for all items */
    allListSearchPlaceholderText: PropTypes.string,

    /** placeholder text for the search box for selected items */
    selectedListSearchPlaceholderText: PropTypes.string,

    /** expand aria label when using nested groups */
    expand: PropTypes.string,

    /** close aria label when using nested groups */
    close: PropTypes.string,
  }),
};

const defaultProps = {
  testId: 'list-builder',

  items: [],

  itemCount: null,

  selectedItems: [],

  onAdd: null,

  onRemove: null,

  i18n: {
    allListTitle: (count) => {
      return `Items (${count} available)`;
    },
    selectedListTitle: (count) => {
      return `${count} Selected`;
    },
    removeLabel: 'Remove item from list',
    addLabel: 'Add item to list',
    allListSearchPlaceholderText: 'Enter a value to search all items',
    selectedListSearchPlaceholderText: 'Enter a value to search selected items',
    expand: 'Expand',
    close: 'Close',
  },
};

const ListBuilder = ({
  // TODO: remove deprecated testID in v3.
  testID,
  testId,
  items,
  itemCount,
  selectedItems,
  i18n,
  onAdd,
  onRemove,
}) => {
  const mergedI18n = {
    ...defaultProps.i18n,
    ...i18n,
  };
  const { allListTitle, selectedListTitle } = mergedI18n;

  const handleAdd = useCallback(
    (id) => (event) => {
      event.persist();
      onAdd(event, id);
    },
    [onAdd]
  );
  const handleRemove = useCallback(
    (id) => (event) => {
      event.persist();
      onRemove(event, id);
    },
    [onRemove]
  );

  const allListItems = useMemo(
    () =>
      items?.map((item) => {
        const rowActions =
          item.content.rowActions !== undefined
            ? item.content.rowActions
            : () => [
                <Button
                  key={`${item.id}-list-item-button`}
                  // TODO: remove deprecated testID in v3.
                  testId={`${testID || testId}-add-button-${item.id}`}
                  role="button"
                  aria-label={mergedI18n.addLabel}
                  renderIcon={ArrowRight16}
                  hasIconOnly
                  kind="ghost"
                  size="small"
                  onClick={handleAdd(item.id)}
                  iconDescription={mergedI18n.addLabel}
                />,
              ];

        return {
          ...item,
          content: {
            ...item.content,
            rowActions,
          },
        };
      }) ?? [],
    [handleAdd, items, mergedI18n.addLabel, testID, testId]
  );

  const selectedListItems = useMemo(
    () =>
      selectedItems?.map((selectedItem) => {
        const rowActions =
          selectedItem.content.rowActions !== undefined
            ? selectedItem.content.rowActions
            : () => [
                <Button
                  key={`${selectedItem.id}-list-item-button`}
                  // TODO: remove deprecated testID in v3.
                  testId={`${testID || testId}-add-button-${selectedItem.id}`}
                  role="button"
                  aria-label={mergedI18n.removeLabel}
                  renderIcon={Subtract16}
                  hasIconOnly
                  kind="ghost"
                  size="small"
                  onClick={handleRemove(selectedItem.id)}
                  iconDescription={mergedI18n.removeLabel}
                />,
              ];

        return {
          ...selectedItem,
          content: {
            ...selectedItem.content,
            rowActions,
          },
        };
      }) ?? [],
    [handleRemove, mergedI18n.removeLabel, selectedItems, testID, testId]
  );

  return (
    <div data-testid={testID || testId} className={`${iotPrefix}--list-builder__container`}>
      <div
        className={`${iotPrefix}--list-builder__all`}
        // TODO: remove deprecated testID in v3.
        data-testid={`${testID || testId}__all`}
      >
        <HierarchyList
          title={allListTitle(itemCount ?? allListItems.length)}
          items={allListItems}
          hasSearch
          hasPagination={false}
          searchId={`${iotPrefix}--list-builder__all--search`}
          i18n={{
            searchPlaceHolderText: mergedI18n.allListSearchPlaceholderText,
          }}
        />
      </div>
      <div
        className={`${iotPrefix}--list-builder__selected`}
        // TODO: remove deprecated testID in v3.
        data-testid={`${testID || testId}__selected`}
      >
        <HierarchyList
          title={selectedListTitle(selectedListItems.length)}
          items={selectedListItems}
          hasSearch
          hasPagination={false}
          searchId={`${iotPrefix}--list-builder__selected--search`}
          i18n={{
            searchPlaceHolderText: mergedI18n.selectedListSearchPlaceholderText,
            expand: mergedI18n.expand,
            close: mergedI18n.close,
          }}
        />
      </div>
    </div>
  );
};

ListBuilder.propTypes = propTypes;
ListBuilder.defaultProps = defaultProps;
export default ListBuilder;
