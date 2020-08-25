import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { Move16 } from '@carbon/icons-react';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { caseInsensitiveSearch } from '../../../utils/componentUtilityFunctions';
import List from '../List';
import { Button } from '../../..';
import {
  EditingStyle,
  handleEditModeSelect,
  moveItemsInList,
  DropLocation,
} from '../../../utils/DragAndDropUtils';
import { settings } from '../../../constants/Settings';

import HierarchyListReorderModal from './HierarchyListReorderModal';

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
  /** Buttons to be presented in List header */
  buttons: PropTypes.arrayOf(PropTypes.node),
  /** ListItems to be displayed */
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  /** Internationalization text */
  i18n: PropTypes.shape({
    /** Text displayed in search bar */
    searchPlaceHolderText: PropTypes.string,
    expand: PropTypes.string,
    close: PropTypes.string,
    itemsSelected: PropTypes.string,
    move: PropTypes.string,
    cancel: PropTypes.string,
    allRows: PropTypes.string,
    modalTitle: PropTypes.string,
    modalDescription: PropTypes.string,
  }),
  /** Displays the List as full height */
  isFullHeight: PropTypes.bool,
  /** optional skeleton to be rendered while loading data */
  isLoading: PropTypes.bool,
  /** Determines the number of rows per page */
  pageSize: PropTypes.string,
  /** Item id to be pre-selected */
  defaultSelectedId: PropTypes.string,
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
};

const defaultProps = {
  editingStyle: null,
  title: null,
  hasSearch: false,
  hasPagination: true,
  hasMultiSelect: false,
  buttons: null,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    expand: 'Expand',
    close: 'Close',
    itemSelected: '%d item selected',
    itemsSelected: '%d items selected',
    move: 'Move',
    cancel: 'Cancel',
    allRows: 'All rows',
    itemTitle: 'Move %d item underneath',
    itemsTitle: 'Move %d items underneath',
    modalDescription: 'Select a destination',
  },
  isFullHeight: false,
  isLoading: false,
  pageSize: null,
  defaultSelectedId: null,
  onSelect: null,
  sendingData: null,
  onListUpdated: () => {},
  cancelMoveClicked: () => {},
  itemWillMove: () => {
    return true;
  },
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
  cloneDeep(items).forEach(item => {
    // if the item has children, recurse and search children
    if (item.children) {
      // eslint-disable-next-line no-param-reassign
      item.children = searchForNestedItemValues(item.children, value);
      // if it's children did, we still need the item
      if (item.children.length > 0) {
        filteredItems.push(item);
      }
    } // if the item matches, add it to the filterItems array
    else if (
      !isNil(item.content.secondaryValue) &&
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
  cloneDeep(items).forEach(item => {
    // if the item has children, recurse and search children
    if (item.children) {
      // eslint-disable-next-line no-param-reassign
      item.children = searchForNestedItemIds(item.children, value);
      // if it's children did, we still need the item
      if (item.children.length > 0) {
        filteredItems.push(item);
      }
    } // if the item matches, add it to the filterItems array
    else if (item.id === value) {
      filteredItems.push(item);
    }
  });
  return filteredItems;
};

const HierarchyList = ({
  editingStyle,
  title,
  hasSearch,
  hasPagination,
  hasMultiSelect,
  buttons,
  items,
  i18n,
  isFullHeight,
  isLoading,
  pageSize,
  defaultSelectedId,
  onSelect,
  onListUpdated,
  itemWillMove,
  cancelMoveClicked,
  sendingData,
}) => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(cloneDeep(items));
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editModeSelectedIds, setEditModeSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useDeepCompareEffect(
    () => {
      setFilteredItems(items);
    },
    [items]
  );

  const selectedItemRef = useCallback(
    node => {
      // eslint-disable-next-line no-unused-expressions
      node?.parentNode?.scrollIntoView();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultSelectedId]
  );

  const handleSelect = (id, parentId = null) => {
    if (editingStyle) {
      setEditModeSelectedIds(handleEditModeSelect(items, editModeSelectedIds, id, parentId));
    } else if (selectedIds.includes(id)) {
      if (hasMultiSelect) {
        setSelectedIds(selectedIds.filter(item => item !== id));
      } else {
        setSelectedIds([]);
      }
    } else {
      if (hasMultiSelect) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds([id]);
      }

      if (onSelect) {
        onSelect(id);
      }
    }
  };

  useEffect(
    () => {
      // Expand the parent elements of the defaultSelectedId
      if (defaultSelectedId) {
        const tempFilteredItems = searchForNestedItemIds(items, defaultSelectedId);
        const tempExpandedIds = [...expandedIds];
        // Expand the categories that have found results
        tempFilteredItems.forEach(categoryItem => {
          tempExpandedIds.push(categoryItem.id);
        });
        setExpandedIds(tempExpandedIds);

        // If the defaultSelectedId prop is updated from the outside, we need to use it
        handleSelect(defaultSelectedId);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultSelectedId, items]
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
  useEffect(
    () => {
      setItemsToShow(filteredItems.slice(0, rowsPerPage));
    },
    [filteredItems, rowsPerPage]
  );

  const onPage = page => {
    const rowUpperLimit = page * rowsPerPage;
    const currentItemsOnPage = filteredItems.slice(rowUpperLimit - rowsPerPage, rowUpperLimit);
    setCurrentPageNumber(page);
    setItemsToShow(currentItemsOnPage);
  };

  const pagination = {
    page: currentPageNumber,
    onPage,
    maxPage: Math.ceil(numberOfItems / rowsPerPage),
    pageOfPagesText: page => `Page ${page}`,
  };

  const headerOverride = () => {
    return editingStyle === EditingStyle.MultipleNesting && editModeSelectedIds.length > 0 ? (
      <div className={`${iotPrefix}--hierarchy-list-bulk-header`}>
        <div className={`${iotPrefix}--hierarchy-list-bulk-header--title`}>
          {editModeSelectedIds.length > 1
            ? i18n.itemsSelected.replace('%d', editModeSelectedIds.length)
            : i18n.itemSelected.replace('%d', editModeSelectedIds.length)}
        </div>
        <div className={`${iotPrefix}--hierarchy-list-bulk-header--button-container`}>
          <Button
            className={`${iotPrefix}--hierarchy-list-bulk-header--button`}
            renderIcon={Move16}
            onClick={() => {
              setShowModal(true);
            }}
          >
            {i18n.move}
          </Button>

          <div className={`${iotPrefix}--hierarchy-list-bulk-header--divider`} />

          <Button
            className={`${iotPrefix}--hierarchy-list-bulk-header--button-no-icon`}
            onClick={cancelMoveClicked}
          >
            {i18n.cancel}
          </Button>
        </div>
      </div>
    ) : null;
  };

  /**
   * Once the array is finished, the category needs to be expanded to show
   * the found results and the filter children array needs to be added to
   * the total filtered array. The next category's children then needs to
   * be searched in the same fashion.
   * @param {String} text keyed values from search input
   */
  const handleSearch = text => {
    const tempFilteredItems = searchForNestedItemValues(items, text);
    const tempExpandedIds = [];
    // Expand the categories that have found results
    tempFilteredItems.forEach(categoryItem => {
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
  const delayedSearch = useCallback(debounce(textInput => handleSearch(textInput), 150), [items]);

  const handleMove = (dragIds, hoverId, target) => {
    const updatedList = moveItemsInList(items, dragIds, hoverId, target);

    onListUpdated(updatedList);
    setFilteredItems(updatedList);
  };

  const handleDrag = (dragId, hoverId, target) => {
    if (
      editModeSelectedIds.length > 0 &&
      editModeSelectedIds.find(selectionId => selectionId === dragId)
    ) {
      handleMove(editModeSelectedIds, hoverId, target);
    } else {
      handleMove([dragId], hoverId, target);
    }
  };

  return (
    <>
      <HierarchyListReorderModal
        open={showModal}
        items={items}
        selectedIds={editModeSelectedIds}
        i18n={i18n}
        onClose={() => {
          setShowModal(false);
        }}
        onSubmit={dropId => {
          if (dropId !== null) {
            handleMove(editModeSelectedIds, dropId, DropLocation.Nested);
          }

          setShowModal(false);
        }}
        sendingData={sendingData}
      />
      <List
        title={title}
        buttons={buttons}
        editingStyle={editingStyle}
        search={
          hasSearch
            ? {
                value: searchValue,
                onChange: evt => {
                  setSearchValue(evt.target.value);
                  delayedSearch(evt.target.value);
                },
              }
            : null
        }
        items={pageSize != null ? itemsToShow : filteredItems}
        expandedIds={expandedIds}
        toggleExpansion={id => {
          if (expandedIds.filter(rowId => rowId === id).length > 0) {
            // remove id from array
            setExpandedIds(expandedIds.filter(rowId => rowId !== id));
          } else {
            setExpandedIds(expandedIds.concat([id]));
          }
        }}
        headerOverride={headerOverride()}
        i18n={i18n}
        pagination={hasPagination ? pagination : null}
        isFullHeight={isFullHeight}
        isLoading={isLoading}
        itemWillMove={itemWillMove}
        selectedIds={editingStyle ? editModeSelectedIds : selectedIds}
        handleSelect={handleSelect}
        ref={selectedItemRef}
        onItemMoved={handleDrag}
      />
    </>
  );
};

HierarchyList.propTypes = propTypes;
HierarchyList.defaultProps = defaultProps;

export default HierarchyList;
