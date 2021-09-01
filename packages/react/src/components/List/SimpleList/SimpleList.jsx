import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  /** optionally renders SimplePagination at the bottom of the list */
  hasPagination: PropTypes.bool,
  /** Optional callback when a item is selected.
   * OnSelect(itemId, parentItemId)
   */
  onSelect: PropTypes.func,

  testId: PropTypes.string,
};

const defaultProps = {
  buttons: [],
  editingStyle: null,
  hasSearch: false,
  onListUpdated: () => {},
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    pageOfPagesText: (page) => `Page ${page}`,
    items: '%d items',
  },
  isLargeRow: false,
  isFullHeight: false,
  isLoading: false,
  pageSize: null,
  hasPagination: true,
  onSelect: null,
  testId: 'simple-list',
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
  hasPagination,
  onSelect,
  title,
  testId,
}) => {
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [editModeSelectedIds, setEditModeSelectedIds] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const numberOfItems = filteredItems.length;
  const rowPerPage = useMemo(() => {
    if (!hasPagination) {
      return numberOfItems;
    }

    switch (pageSize) {
      case 'sm':
        return 5;
      case 'lg':
        return 10;
      case 'xl':
      default:
        return 20;
    }
  }, [hasPagination, numberOfItems, pageSize]);

  const [itemsToShow, setItemsToShow] = useState(filteredItems.slice(0, rowPerPage));

  const handleSearch = useCallback(
    (searchTerm) => {
      setSearchValue(searchTerm);
      const searchFilteredItems = items.filter((item) => {
        if (item.content.value !== '' && item.content.value !== undefined) {
          if (
            item.content.secondaryValue !== '' &&
            item.content.secondaryValue !== undefined &&
            typeof item.content.secondaryValue === 'string'
          ) {
            return (
              item.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1 ||
              item.content.secondaryValue.toLowerCase().search(searchTerm.toLowerCase()) !== -1
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
    [items, pageSize, rowPerPage]
  );

  const onPage = useCallback(
    (page) => {
      const rowUpperLimit = page * rowPerPage;
      const currentItemsOnPage = filteredItems.slice(rowUpperLimit - rowPerPage, rowUpperLimit);
      setCurrentPageNumber(page);
      setItemsToShow(currentItemsOnPage);
    },
    [filteredItems, rowPerPage]
  );

  const maxPage = Math.ceil(numberOfItems / rowPerPage);

  useEffect(() => {
    setFilteredItems(items);
    if (searchValue) {
      handleSearch(searchValue);
    }
  }, [items, handleSearch, searchValue]);

  useEffect(() => {
    if (currentPageNumber > maxPage) {
      onPage(1);
    }
  }, [currentPageNumber, maxPage, onPage, pageSize]);

  const handleSelect = (id, parentId) => {
    if (editingStyle) {
      setEditModeSelectedIds(handleEditModeSelect(items, editModeSelectedIds, id, parentId));
    } else {
      setSelectedIds(
        selectedIds.indexOf(id) !== -1
          ? selectedIds.filter((item) => item !== id)
          : [...selectedIds, id]
      );
      if (onSelect) {
        onSelect(id, parentId);
      }
    }
  };

  const onItemMoved = (dragId, hoverId, target) => {
    let updatedList;

    if (
      editModeSelectedIds.length > 0 &&
      editModeSelectedIds.find((selectionId) => selectionId === dragId)
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
              onChange: (evt) => {
                handleSearch(evt.target.value);
              },
            }
          : null
      }
      buttons={buttons}
      i18n={mergedI18n}
      isFullHeight={isFullHeight}
      items={pageSize !== null ? itemsToShow : filteredItems}
      pagination={
        hasPagination
          ? {
              page: currentPageNumber,
              onPage,
              maxPage,
              pageOfPagesText: (page) => mergedI18n.pageOfPagesText(page),
            }
          : null
      }
      selectedIds={editingStyle ? editModeSelectedIds : selectedIds}
      handleSelect={handleSelect}
      isLargeRow={isLargeRow}
      isLoading={isLoading}
      editingStyle={editingStyle}
      onItemMoved={onItemMoved}
      testId={testId}
    />
  );
};

SimpleList.propTypes = propTypes;
SimpleList.defaultProps = defaultProps;
export default SimpleList;
