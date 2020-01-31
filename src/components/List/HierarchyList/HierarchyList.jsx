import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

import List from '../List';

const propTypes = {
  /** List heading */
  title: PropTypes.string,
  /** Determines whether the search function is enabled */
  hasSearch: PropTypes.bool,
  /** Determines whether the pagination should appear */
  hasPagination: PropTypes.bool,
  /** Buttons to be presented in List header */
  buttons: PropTypes.arrayOf(PropTypes.node),
  /** ListItems to be displayed */
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  /** Internationalization text */
  i18n: PropTypes.shape({
    /** Text displayed in search bar */
    searchPlaceHolderText: PropTypes.string,
  }),
  /** Displays the List as full height */
  isFullHeight: PropTypes.bool,
  /** Determines the number of rows per page */
  pageSize: PropTypes.string,
  /** Item id to be pre-selected */
  defaultSelectedId: PropTypes.string,
  /** Optional function to be called when item is selected */
  onSelect: PropTypes.func,
};

const defaultProps = {
  title: null,
  hasSearch: false,
  hasPagination: true,
  buttons: null,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
  },
  isFullHeight: true,
  pageSize: null,
  defaultSelectedId: null,
  onSelect: null,
};

/**
 * Searches an item for a specific value
 * @param {Object} item to be searched
 * @returns {Boolean} found or not
 */
export const searchItem = (item, searchTerm) => {
  // Check that the value is not empty
  if (item.content.value !== '' && item.content.value !== undefined) {
    // Check that the secondary value is not empty
    if (
      item.content.secondaryValue !== '' &&
      item.content.secondaryValue !== undefined &&
      // Check if the value or secondary value has a match
      (item.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1 ||
        item.content.secondaryValue.toLowerCase().search(searchTerm.toLowerCase()) !== -1)
    ) {
      return true;
    }
    if (item.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1) {
      return true;
    }
    return false;
  }
  return false;
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
export const searchNestedItems = (items, value) => {
  const filteredItems = [];
  cloneDeep(items).forEach(item => {
    // if the item has children, recurse and search children
    if (item.children) {
      // eslint-disable-next-line
      item.children = searchNestedItems(item.children, value);
      // if it's children did, we still need the item
      if (item.children.length > 0) {
        filteredItems.push(item);
      }
    } // if the item matches, add it to the filterItems array
    else if (searchItem(item, value)) {
      filteredItems.push(item);
    }
  });
  return filteredItems;
};

const HierarchyList = ({
  title,
  hasSearch,
  hasPagination,
  buttons,
  items,
  i18n,
  isFullHeight,
  pageSize,
  defaultSelectedId,
  onSelect,
}) => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(cloneDeep(items));
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedId, setSelectedId] = useState(defaultSelectedId);

  const handleSelect = id => {
    setSelectedId(selectedId === id ? null : id);
    setSelectedIds(
      selectedId === id ? selectedIds.filter(item => item.id !== id) : [...selectedIds, id]
    );
    if (onSelect) {
      onSelect(id);
    }
  };

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

  /**
   * Once the array is finished, the category needs to be expanded to show
   * the found results and the filter children array needs to be added to
   * the total filtered array. The next category's children then needs to
   * be searched in the same fashion.
   * @param {String} text keyed values from search input
   */
  const handleSearch = text => {
    /**
     */
    const tempFilteredItems = searchNestedItems(items, text);
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
   * be typed. UseRef is needed because the component is being re-rendered on
   * search value changes, meaning the onChange event is being thrown away. The
   * ref holds on to the last event's information the event.target.value
   */
  const delayedSearch = useRef(debounce(textInput => handleSearch(textInput), 150)).current;

  return (
    <List
      title={title}
      buttons={buttons}
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
      i18n={i18n}
      pagination={hasPagination ? pagination : null}
      isFullHeight={isFullHeight}
      selectedId={selectedId}
      selectedIds={selectedIds}
      handleSelect={handleSelect}
    />
  );
};

HierarchyList.propTypes = propTypes;
HierarchyList.defaultProps = defaultProps;

export default HierarchyList;
