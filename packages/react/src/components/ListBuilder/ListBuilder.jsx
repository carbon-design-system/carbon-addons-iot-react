import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft16, ArrowRight16 } from '@carbon/icons-react';

import HierarchyList from '../List/HierarchyList';
import { settings } from '../../constants/Settings';
import { ListItemPropTypes } from '../List/List';
import Button from '../Button/Button';

const { iotPrefix } = settings;

const propTypes = {
  testID: PropTypes.string,

  items: PropTypes.arrayOf(PropTypes.shape(ListItemPropTypes)),

  selectedItems: PropTypes.arrayOf(PropTypes.shape(ListItemPropTypes)),

  /** (event, id) => void */
  onAdd: PropTypes.func.isRequired,

  /** (event, id) => void */
  onRemove: PropTypes.func.isRequired,

  i18n: PropTypes.shape({
    /** (count) => `Items (${count} available)` */
    allListTitle: PropTypes.func,

    /** (count) => `${count} items selected` */
    selectedListTitle: PropTypes.func,

    /** remove aria label on selected items */
    removeLabel: PropTypes.string,

    /** add aria label on unselected items */
    addLabel: PropTypes.string,
  }),
};

const defaultProps = {
  testID: 'list-builder',

  items: [],

  selectedItems: [],

  i18n: {
    allListTitle: (count) => {
      return `Items (${count} available)`;
    },

    selectedListTitle: (count) => {
      return `${count} Selected`;
    },

    removeLabel: 'Remove item from list',

    addLabel: 'Add item to list',
  },
};

const ListBuilder = ({ testID, items, selectedItems, i18n, onAdd, onRemove }) => {
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
        return {
          ...item,
          content: {
            ...item.content,
            rowActions: () => [
              <Button
                key={`${item.id}-list-item-button`}
                testID={`${testID}-add-button-${item.id}`}
                role="button"
                aria-label={mergedI18n.addLabel}
                renderIcon={ArrowRight16}
                hasIconOnly
                kind="ghost"
                size="small"
                onClick={handleAdd(item.id)}
                iconDescription={mergedI18n.addLabel}
              />,
            ],
          },
        };
      }) ?? [],
    [handleAdd, items, mergedI18n.addLabel, testID]
  );

  const selectedListItems = useMemo(
    () =>
      selectedItems?.map((selectedItem) => {
        return {
          ...selectedItem,
          content: {
            ...selectedItem.content,
            rowActions: () => [
              <Button
                key={`${selectedItem.id}-list-item-button`}
                testID={`${testID}-add-button-${selectedItem.id}`}
                role="button"
                aria-label={mergedI18n.removeLabel}
                renderIcon={ArrowLeft16}
                hasIconOnly
                kind="ghost"
                size="small"
                onClick={handleRemove(selectedItem.id)}
                iconDescription={mergedI18n.removeLabel}
              />,
            ],
          },
        };
      }) ?? [],
    [handleRemove, mergedI18n.removeLabel, selectedItems, testID]
  );

  return (
    <div className={`${iotPrefix}--list-builder__container`}>
      <div className={`${iotPrefix}--list-builder__all`} data-testid={`${testID}__all`}>
        <HierarchyList
          title={allListTitle(allListItems.length)}
          items={allListItems}
          hasSearch
          hasPagination={false}
        />
      </div>
      <div className={`${iotPrefix}--list-builder__selected`} data-testid={`${testID}__selected`}>
        <HierarchyList
          title={selectedListTitle(selectedListItems.length)}
          items={selectedListItems}
          hasSearch
          hasPagination={false}
        />
      </div>
    </div>
  );
};

ListBuilder.propTypes = propTypes;
ListBuilder.defaultProps = defaultProps;
export default ListBuilder;
