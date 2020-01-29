import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import List from '../List';

const propTypes = {
  title: PropTypes.string,
  hasSearch: PropTypes.bool,
  buttons: PropTypes.arrayOf(PropTypes.node),
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
  }),
  isFullHeight: PropTypes.bool,
  pageSize: PropTypes.string,
};

const defaultProps = {
  title: null,
  hasSearch: false,
  buttons: null,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
  },
  isFullHeight: true,
  pageSize: null,
};

/**
 * Searches an item for a specific value
 * @param {Object} item to be searched
 * @returns {Boolean} found or not
 */
const searchItem = (item, searchTerm) => {
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
  cloneDeep(items).forEach((item, i) => {
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

const searchItems = (items, value) => {
  const filteredItems = searchNestedItems(items, value);
  return filteredItems;
};

const ExpandableList = ({ title, hasSearch, buttons, items, i18n, isFullHeight, pageSize }) => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(cloneDeep(items));
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = id => {
    setSelectedId(selectedId === id ? null : id);
    setSelectedIds(
      selectedId === id ? selectedIds.filter(item => item.id !== id) : [...selectedIds, id]
    );
  };

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
      rowPerPage = 20;
      break;
    default:
      rowPerPage = 5;
  }

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
    pageOfPagesText: page => `Page ${page}`,
  };

  const handleSearch = text => {
    setSearchValue(text);
    /** Once the array is finished, the category
        needs to be expanded to show the found results and the filter children
        array needs to be added to the total filtered array. The next
        category's children then needs to be searched in the same fashion.
     */
    const tempFilteredItems = searchItems(items, text);
    const tempExpandedIds = [];
    // Expand the categories that have found results
    tempFilteredItems.forEach(categoryItem => {
      tempExpandedIds.push(categoryItem.id);
    });
    setExpandedIds(tempExpandedIds);
    setFilteredItems(tempFilteredItems);
    if (pageSize !== null) {
      setItemsToShow(tempFilteredItems.slice(0, rowPerPage));
    }
  };

  return (
    <List
      title={title}
      buttons={buttons}
      search={
        hasSearch
          ? {
              value: searchValue,
              onChange: evt => handleSearch(evt.target.value),
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
      pagination={pagination}
      isFullHeight={isFullHeight}
      selectedId={selectedId}
      selectedIds={selectedIds}
      handleSelect={handleSelect}
    />
  );
};

ExpandableList.propTypes = propTypes;
ExpandableList.defaultProps = defaultProps;

export default ExpandableList;
