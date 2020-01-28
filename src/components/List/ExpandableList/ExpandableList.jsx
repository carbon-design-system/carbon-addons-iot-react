import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import List from '../List';

const propTypes = {
  title: PropTypes.string,
  hasSearch: PropTypes.bool,
  buttons: PropTypes.arrayOf(PropTypes.node),
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  i18n: PropTypes.shape(PropTypes.any),
  isFullHeight: PropTypes.bool,
  pageSize: PropTypes.any,
};

const defaultProps = {
  title: null,
  hasSearch: false,
  buttons: null,
  isFullHeight: true,
  pageSize: null,
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
    const searchTerm = text;
    /** Since the first hierachy level is categories, we only want to search
          through the children. If a child is found while filtering, it needs to
          be returned to the filtered array. Once the array is finished, the category
          needs to be expanded to show the found results and the filter children
          array needs to be added to the total filtered array. The next
          category's children then needs to be searched in the same fashion.
       */

    const tempFilteredItems = cloneDeep(items);
    items.forEach((item, i) => {
      // if the item has children, filter the children
      if (item.children) {
        // eslint-disable-next-line
        const filteredChildren = item.children.filter(childItem => {
          if (childItem.content.value !== '' && childItem.content.value !== undefined) {
            if (
              childItem.content.secondaryValue !== '' &&
              childItem.content.secondaryValue !== undefined
            ) {
              return (
                childItem.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1 ||
                childItem.content.secondaryValue.toLowerCase().search(searchTerm.toLowerCase()) !==
                  -1
              );
            }
            return childItem.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1;
          }
        });
        // If there was a match, add children to result
        if (filteredChildren.length > 0) {
          tempFilteredItems[i].children = cloneDeep(filteredChildren);
        } else {
          tempFilteredItems[i].children = [];
        }
      }
    });
    // Remove categories that were did not have results
    // eslint-disable-next-line
    const totalFilteredItems = tempFilteredItems.filter(categoryItem => {
      if (categoryItem.children.length > 0) {
        return categoryItem;
      }
    });
    const tempExpandedIds = [];
    totalFilteredItems.forEach(categoryItem => {
      // Expand the categories that have found results
      tempExpandedIds.push(categoryItem.id);
    });
    setExpandedIds(tempExpandedIds);
    setFilteredItems(totalFilteredItems);
    if (pageSize !== null) {
      setItemsToShow(totalFilteredItems.slice(0, rowPerPage));
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
