import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import isEqual from 'lodash/isEqual';
import scrollIntoView from 'scroll-into-view-if-needed';

import { caseInsensitiveSearch } from '../../../utils/componentUtilityFunctions';
import List, { ListItemPropTypes } from '../List';
import {
  EditingStyle,
  handleEditModeSelect,
  moveItemsInList,
  DropLocation,
} from '../../../utils/DragAndDropUtils';
import { settings } from '../../../constants/Settings';
import { usePrevious } from '../../../hooks/usePrevious';

import HierarchyListReorderModal from './HierarchyListReorderModal/HierarchyListReorderModal';
import BulkActionHeader from './BulkActionHeader';

const { iotPrefix } = settings;

const propTypes = {
  /** list editing style */
  editingStyle: PropTypes.oneOf([
    EditingStyle.Single,
    EditingStyle.Multiple,
    EditingStyle.SingleNesting,
    EditingStyle.MultipleNesting,
  ]),
  /** List heading */
  title: PropTypes.string,
  /** Determines whether the search function is enabled */
  hasSearch: PropTypes.bool,
  /** Determines whether the pagination should appear */
  hasPagination: PropTypes.bool,
  /** Determines if multi-select is enabled */
  hasMultiSelect: PropTypes.bool,
  /** Determines if items can be deselected, meaning once an item is selected,
   * it can only be deselected by selecting another item */
  hasDeselection: PropTypes.bool,
  /** optional prop to use a virtualized version of the list instead of rendering all items */
  isVirtualList: PropTypes.bool,
  /** Buttons to be presented in List header */
  buttons: PropTypes.arrayOf(PropTypes.node),
  /** ListItems to be displayed */
  items: PropTypes.arrayOf(PropTypes.shape(ListItemPropTypes)),
  /** Internationalization text */
  i18n: PropTypes.shape({
    /** Text displayed in search bar */
    searchPlaceHolderText: PropTypes.string,
    expand: PropTypes.string,
    close: PropTypes.string,
    itemSelected: PropTypes.string,
    /** String e.g. '%d items selected' that gets %d replaced by selected count or
     * function receiving the selectedCount as param:
     * (selectedCount) => `${selectedCount} items selected` */
    itemsSelected: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    move: PropTypes.string,
    cancel: PropTypes.string,
    allRows: PropTypes.string,
    modalTitle: PropTypes.string,
    modalDescription: PropTypes.string,
    itemTitle: PropTypes.string,
    /** String e.g. 'Move %d items underneath' that gets %d replaced by items count or
     * function receiving the selectedCount as param:
     * (itemsCount) => `Move ${itemsCount} items underneath` */
    itemsTitle: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  }),
  /** Displays the List as full height */
  isFullHeight: PropTypes.bool,
  /** optional skeleton to be rendered while loading data */
  isLoading: PropTypes.bool,
  /** optionally makings each list item a large / fat row */
  isLargeRow: PropTypes.bool,
  /** the ids of locked items that cannot be reordered */
  lockedIds: PropTypes.arrayOf(PropTypes.string),
  /** Determines the number of rows per page */
  pageSize: PropTypes.string,
  /** Item id to be pre-selected */
  defaultSelectedId: PropTypes.string,
  /** Item ids to be pre-expanded */
  defaultExpandedIds: PropTypes.arrayOf(PropTypes.string),
  /** Optional function to be called when item is selected */
  onSelect: PropTypes.func,
  /** callback function returned a modified list */
  onListUpdated: PropTypes.func,
  /** callback function returned before a list is modified */
  itemWillMove: PropTypes.func,
  /** callback function to exit edit mode */
  cancelMoveClicked: PropTypes.func,
  /**  Is data currently being sent to the backend */
  sendingData: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /** optional classname to be passed to the dom element */
  className: PropTypes.string,
  /** an optional id string passed to the list search field */
  searchId: PropTypes.string,
  /** content shown if list is empty */
  emptyState: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

const defaultProps = {
  editingStyle: null,
  title: null,
  hasSearch: false,
  hasPagination: true,
  hasMultiSelect: false,
  hasDeselection: true,
  buttons: null,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    expand: 'Expand',
    close: 'Close',
    itemSelected: '1 item selected',
    itemsSelected: (selectedCount) => `${selectedCount} items selected`,
    move: 'Move',
    cancel: 'Cancel',
    allRows: 'All rows',
    itemTitle: 'Move 1 item underneath',
    itemsTitle: (itemsCount) => `Move ${itemsCount} items underneath`,
    modalDescription: 'Select a destination',
  },
  isFullHeight: false,
  isLoading: false,
  isLargeRow: false,
  isVirtualList: false,
  lockedIds: [],
  pageSize: null,
  defaultSelectedId: null,
  defaultExpandedIds: [],
  onSelect: null,
  sendingData: null,
  onListUpdated: () => {},
  cancelMoveClicked: () => {},
  itemWillMove: () => {
    return true;
  },
  className: null,
  items: [],
  searchId: null,
  emptyState: 'No list items to show',
};

/**
 * Assumes that the first level of items is not searchable and is only uses to categorize the
 * items. Because of that, only search through the children. If a child is found while filtering,
 * it needs to be returned to the filtered array. Deep clone is required because spread syntax is
 * only a shallow clone
 * @param {Array<Object>} items
 * @param {String} value what to search for
 * @returns {Array<Object>}
 */
export const searchForNestedItemValues = (items, value) => {
  const filteredItems = [];
  items.forEach((item) => {
    // if the item has children, recurse and search children
    if (item.children) {
      // if the parent matches the search then add the parent and all children
      if (caseInsensitiveSearch([item.content.value], value)) {
        filteredItems.push(item);
      } else {
        const matchingChildren = searchForNestedItemValues(item.children, value);
        // if it's children did, we still need the item
        if (matchingChildren.length > 0) {
          filteredItems.push({ ...item, children: matchingChildren });
        }
      }
    } // if the item matches, add it to the filterItems array
    else if (
      !isNil(item.content.secondaryValue) &&
      typeof item.content.secondaryValue === 'string' &&
      caseInsensitiveSearch([item.content.value, item.content.secondaryValue], value)
    ) {
      filteredItems.push(item);
    } else if (caseInsensitiveSearch([item.content.value], value)) {
      filteredItems.push(item);
    }
  });
  return filteredItems;
};

/**
 * Assumes that the first level of items is not searchable and is only uses to categorize the
 * items. Because of that, only search through the children. If a child is found while filtering,
 * it needs to be returned to the filtered array. Deep clone is required because spread syntax is
 * only a shallow clone
 * @param {Array<Object>} items
 * @param {String} value what to search for
 * @returns {Array<Object>}
 */
export const searchForNestedItemIds = (items, value) => {
  const filteredItems = [];
  items.forEach((item) => {
    // if the item has children, recurse and search children
    if (item.children) {
      const matchingChildren = searchForNestedItemIds(item.children, value);
      // if it's children did, we still need the item
      if (matchingChildren.length > 0) {
        filteredItems.push({ ...item, children: matchingChildren });
      }
    } // if the item matches, add it to the filterItems array
    else if (item.id === value) {
      filteredItems.push(item);
    }
  });
  return filteredItems;
};

const reduceItems = (items) =>
  items.reduce((carry, { id, children }) => {
    return [
      ...carry,
      {
        id,
        children: children ? reduceItems(children) : undefined,
      },
    ];
  }, []);

const HierarchyList = ({
  editingStyle,
  title,
  hasSearch,
  hasPagination,
  hasMultiSelect,
  hasDeselection,
  buttons,
  items,
  i18n,
  isFullHeight,
  isLoading,
  isLargeRow,
  isVirtualList,
  lockedIds,
  pageSize,
  defaultSelectedId,
  defaultExpandedIds,
  onSelect,
  onListUpdated,
  itemWillMove,
  cancelMoveClicked,
  sendingData,
  className,
  searchId,
  emptyState,
}) => {
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);

  const [expandedIds, setExpandedIds] = useState(defaultExpandedIds);
  const [searchValue, setSearchValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editModeSelectedIds, setEditModeSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // these are used in filtering, and since items may contain nodes or react elements
  // we don't want to do equality checks against those, so we strip the items down to
  // the basics need for filtering checks and memoize them for use in the useEffect below
  const itemsStrippedOfNodeElements = useMemo(() => reduceItems(items), [items]);
  const previousItems = usePrevious(items);
  useEffect(() => {
    if (!isEqual(items, previousItems)) {
      setFilteredItems(items);
    }
  }, [items, previousItems]);

  const selectedItemRef = useCallback(
    (node) => {
      if (node && node.parentNode && !isVirtualList) {
        scrollIntoView(node.parentNode, {
          scrollMode: 'if-needed',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    },
    [isVirtualList]
  );

  const setSelected = (id, parentId = null) => {
    if (editingStyle) {
      setEditModeSelectedIds(handleEditModeSelect(items, editModeSelectedIds, id, parentId));
    } else if (selectedIds.includes(id) && hasDeselection) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
      // else, no-op because the item can't be deselected
    } else if (hasMultiSelect) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  const handleSelect = (id, parentId = null) => {
    setSelected(id, parentId);

    // only select if the item is not already selected
    if (onSelect && (!selectedIds.includes(id) || hasDeselection)) {
      onSelect(id);
    }
  };

  const handleBulkModalCancel = () => {
    setEditModeSelectedIds([]);
    cancelMoveClicked();
  };

  useEffect(
    () => {
      // Expand the parent elements of the defaultSelectedId
      if (defaultSelectedId) {
        const tempFilteredItems = searchForNestedItemIds(
          itemsStrippedOfNodeElements,
          defaultSelectedId
        );
        const tempExpandedIds = [...expandedIds];
        // Expand the categories that have found results
        tempFilteredItems.forEach((categoryItem) => {
          tempExpandedIds.push(categoryItem.id);
        });
        setExpandedIds(tempExpandedIds);

        /* istanbul ignore else */
        if (!isEqual(selectedIds, [defaultSelectedId])) {
          // If the defaultSelectedId prop is updated from the outside, we need to use it
          setSelected(defaultSelectedId);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultSelectedId, itemsStrippedOfNodeElements]
  );

  const numberOfItems = filteredItems.length;
  let rowsPerPage;
  switch (pageSize) {
    case 'sm':
      rowsPerPage = 5;
      break;
    case 'lg':
      rowsPerPage = 10;
      break;
    case 'xl':
      rowsPerPage = 20;
      break;
    default:
      rowsPerPage = numberOfItems;
  }

  const [itemsToShow, setItemsToShow] = useState(filteredItems.slice(0, rowsPerPage));

  // Needed for updates to the filteredItems state on pageSize change
  useEffect(() => {
    const startIndex = (currentPageNumber - 1) * rowsPerPage;
    setItemsToShow(filteredItems.slice(startIndex, startIndex + rowsPerPage));
  }, [currentPageNumber, filteredItems, rowsPerPage]);

  const maxPage = Math.ceil(numberOfItems / rowsPerPage);

  const onPage = useCallback(
    (page) => {
      const rowUpperLimit = page * rowsPerPage;
      const currentItemsOnPage = filteredItems.slice(rowUpperLimit - rowsPerPage, rowUpperLimit);
      setCurrentPageNumber(page);
      setItemsToShow(currentItemsOnPage);
    },
    [filteredItems, rowsPerPage]
  );

  /**
   * If we were on a higher page and the number of items drop, we need to ensure we
   * reset to the first page when the number of items drops below our previous max page.
   */
  useEffect(() => {
    if (currentPageNumber > maxPage) {
      onPage(1);
    } else {
      onPage(currentPageNumber);
    }
  }, [currentPageNumber, maxPage, onPage, pageSize]);

  const pagination = {
    page: currentPageNumber,
    onPage,
    maxPage,
    pageOfPagesText: (page) => `Page ${page}`,
  };

  /**
   * Once the array is finished, the category needs to be expanded to show
   * the found results and the filter children array needs to be added to
   * the total filtered array. The next category's children then needs to
   * be searched in the same fashion.
   * @param {String} text keyed values from search input
   * @param {Array} searchItems the current state of items. Used to maintain state when the list
   *     is updated (drag and drop) and there's a current search value
   */
  const handleSearch = (text, searchItems) => {
    const tempFilteredItems = searchForNestedItemValues(searchItems, text);
    const tempExpandedIds = [];
    // Expand the categories that have found results
    tempFilteredItems.forEach((categoryItem) => {
      tempExpandedIds.push(categoryItem.id);
    });
    setExpandedIds(tempExpandedIds);
    setFilteredItems(tempFilteredItems);
    if (pageSize !== null) {
      setItemsToShow(tempFilteredItems.slice(0, rowsPerPage));
    }
  };

  /**
   * Searching the nested items array is computationally expensive so delay the
   * search by 150ms which is a reasonable amount of time for a single word to
   * be typed.
   */
  const delayedSearch = useCallback(
    debounce((textInput) => handleSearch(textInput, items), 150),
    [items]
  );

  const handleMove = (dragIds, hoverId, target) => {
    const updatedList = moveItemsInList(items, dragIds, hoverId, target);

    onListUpdated(updatedList);
    setFilteredItems(updatedList);
    if (searchValue) {
      handleSearch(searchValue, updatedList);
    }
  };

  const handleDrag = (dragId, hoverId, target) => {
    if (
      editModeSelectedIds.length > 0 &&
      editModeSelectedIds.find((selectionId) => selectionId === dragId)
    ) {
      handleMove(editModeSelectedIds, hoverId, target);
    } else {
      handleMove([dragId], hoverId, target);
    }
  };

  return (
    <>
      {editingStyle ? (
        <HierarchyListReorderModal
          open={showModal}
          items={items}
          selectedIds={editModeSelectedIds}
          i18n={mergedI18n}
          onClose={() => {
            setShowModal(false);
          }}
          onSubmit={(dropId) => {
            if (dropId !== null) {
              handleMove(editModeSelectedIds, dropId, DropLocation.Nested);
            }

            setShowModal(false);
          }}
          sendingData={sendingData}
        />
      ) : null}
      <List
        title={title}
        buttons={buttons}
        editingStyle={editingStyle}
        search={
          hasSearch
            ? {
                id: searchId,
                value: searchValue,
                onChange: (evt) => {
                  setSearchValue(evt.target.value);
                  delayedSearch(evt.target.value);
                },
              }
            : null
        }
        items={pageSize !== null ? itemsToShow : filteredItems}
        expandedIds={expandedIds}
        toggleExpansion={(id) => {
          if (expandedIds.filter((rowId) => rowId === id).length > 0) {
            // remove id from array
            setExpandedIds(expandedIds.filter((rowId) => rowId !== id));
          } else {
            setExpandedIds(expandedIds.concat([id]));
          }
        }}
        overrides={{
          header: {
            component:
              editingStyle === EditingStyle.MultipleNesting && editModeSelectedIds.length > 0
                ? BulkActionHeader
                : null,
            props: {
              mergedI18n,
              editModeSelectedIds,
              cancelMoveClicked: handleBulkModalCancel,
              setShowModal,
              className: `${iotPrefix}--hierarchy-list-bulk-header`,
            },
          },
        }}
        i18n={mergedI18n}
        pagination={hasPagination ? pagination : null}
        isFullHeight={isFullHeight}
        isLoading={isLoading}
        isLargeRow={isLargeRow}
        isVirtualList={isVirtualList}
        itemWillMove={itemWillMove}
        lockedIds={lockedIds}
        selectedIds={editingStyle ? editModeSelectedIds : selectedIds}
        handleSelect={handleSelect}
        ref={selectedItemRef}
        onItemMoved={handleDrag}
        className={className}
        emptyState={emptyState}
      />
    </>
  );
};

HierarchyList.propTypes = propTypes;
HierarchyList.defaultProps = defaultProps;

export default HierarchyList;
