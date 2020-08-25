import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  EditingStyle,
  handleEditModeSelect,
  moveItemsInList,
} from '../../../utils/DragAndDropUtils';
import List from '../List';

const itemPropTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    value: PropTypes.string,
    icon: PropTypes.node,
  }),
  children: PropTypes.arrayOf(PropTypes.any), // TODO: make this recursive
  isSelectable: PropTypes.bool,
};

const propTypes = {
  /** list title */
  title: PropTypes.string.isRequired,
  /** use search with default behavior */
  hasSearch: PropTypes.bool,
  /** action buttons on right side of list title */
  buttons: PropTypes.arrayOf(PropTypes.node),
  /** list editing style */
  editingStyle: PropTypes.oneOf([
    EditingStyle.Single,
    EditingStyle.Multiple,
    EditingStyle.SingleNesting,
    EditingStyle.MultipleNesting,
  ]),
  /** data source of list items */
  items: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)).isRequired,
  /** use full height in list */
  isFullHeight: PropTypes.bool,
  /** use large/fat row in list */
  isLargeRow: PropTypes.bool,
  /** optional skeleton to be rendered while loading data */
  isLoading: PropTypes.bool,
  /** i18n strings */
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
    pageOfPagesText: PropTypes.func,
    expand: PropTypes.string,
    close: PropTypes.string,
  }),
  /** pageSize */
  pageSize: PropTypes.string,
  /** callback function returned a modified list */
  onListUpdated: PropTypes.func,
};

const defaultProps = {
  buttons: [],
  editingStyle: null,
  hasSearch: false,
  onListUpdated: () => {},
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    pageOfPagesText: page => `Page ${page}`,
    items: '%d items',
  },
  isLargeRow: false,
  isFullHeight: false,
  isLoading: false,
  pageSize: null,
};

const SimpleList = ({
  buttons,
  editingStyle,
  hasSearch,
  i18n,
  isFullHeight,
  isLargeRow,
  isLoading,
  items,
  onListUpdated,
  pageSize,
  title,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [editModeSelectedIds, setEditModeSelectedIds] = useState([]);

  const numberOfItems = filteredItems.length;
  let rowPerPage = numberOfItems;
  switch (pageSize) {
    case 'sm':
      rowPerPage = 5;
      break;
    case 'lg':
      rowPerPage = 10;
      break;
    case 'xl':
    default:
      rowPerPage = 20;
      break;
  }

  const handleSelect = (id, parentId = null) => {
    if (editingStyle) {
      setEditModeSelectedIds(handleEditModeSelect(items, editModeSelectedIds, id, parentId));
    } else {
      setSelectedIds(
        selectedIds.indexOf(id) !== -1
          ? selectedIds.filter(item => item !== id)
          : [...selectedIds, id]
      );
    }
  };

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [itemsToShow, setItemsToShow] = useState(filteredItems.slice(0, rowPerPage));

  const onPage = page => {
    const rowUpperLimit = page * rowPerPage;
    const currentItemsOnPage = filteredItems.slice(rowUpperLimit - rowPerPage, rowUpperLimit);
    setCurrentPageNumber(page);
    setItemsToShow(currentItemsOnPage);
  };

  const pagination = {
    page: currentPageNumber,
    onPage,
    maxPage: Math.ceil(numberOfItems / rowPerPage),
    pageOfPagesText: page => i18n.pageOfPagesText(page),
  };

  /* istanbul ignore next */
  const onItemMoved = (dragId, hoverId, target) => {
    let updatedList;

    if (
      editModeSelectedIds.length > 0 &&
      editModeSelectedIds.find(selectionId => selectionId === dragId)
    ) {
      updatedList = moveItemsInList(items, editModeSelectedIds, hoverId, target);
    } else {
      updatedList = moveItemsInList(items, [dragId], hoverId, target);
    }

    onListUpdated(updatedList);
    setFilteredItems(updatedList);
  };

  return (
    <List
      title={title}
      search={
        hasSearch
          ? {
              value: searchValue,
              onChange: evt => {
                setSearchValue(evt.target.value);
                const searchTerm = evt.target.value === undefined ? '' : evt.target.value;
                const searchFilteredItems = items.filter(item => {
                  if (item.content.value !== '' && item.content.value !== undefined) {
                    if (
                      item.content.secondaryValue !== '' &&
                      item.content.secondaryValue !== undefined
                    ) {
                      return (
                        item.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1 ||
                        item.content.secondaryValue
                          .toLowerCase()
                          .search(searchTerm.toLowerCase()) !== -1
                      );
                    }
                    return item.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1;
                  }
                  return false;
                });
                setFilteredItems(searchFilteredItems);
                setSearchValue(searchTerm);
                if (pageSize !== null) {
                  setItemsToShow(searchFilteredItems.slice(0, rowPerPage));
                }
              },
            }
          : null
      }
      buttons={buttons}
      i18n={i18n}
      isFullHeight={isFullHeight}
      items={pageSize != null ? itemsToShow : filteredItems}
      pagination={pagination}
      selectedIds={editingStyle ? editModeSelectedIds : selectedIds}
      handleSelect={handleSelect}
      isLargeRow={isLargeRow}
      isLoading={isLoading}
      editingStyle={editingStyle}
      onItemMoved={onItemMoved}
    />
  );
};

SimpleList.propTypes = propTypes;
SimpleList.defaultProps = defaultProps;
export default SimpleList;
