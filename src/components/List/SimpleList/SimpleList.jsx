import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
  /** data source of list items */
  items: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)).isRequired,
  /** use full height in list */
  isFullHeight: PropTypes.bool,
  /** use large/fat row in list */
  isLargeRow: PropTypes.bool,
  /** i18n strings */
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
    pageOfPagesText: PropTypes.func,
  }),
  /** pageSize */
  pageSize: PropTypes.string,
};

const defaultProps = {
  hasSearch: false,
  buttons: [],
  pageSize: null,
  isLargeRow: false,
  isFullHeight: false,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    pageOfPagesText: page => `Page ${page}`,
  },
};

const SimpleList = ({
  title,
  hasSearch,
  buttons,
  items,
  i18n,
  isFullHeight,
  pageSize,
  isLargeRow,
}) => {
  const [searchValue, setSearchValue] = useState(null);
  const [filteredItems, setFilteredItems] = useState(items);

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

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = id => {
    setSelectedId(selectedId === id ? null : id);
    setSelectedIds(
      selectedId === id ? selectedIds.filter(item => item.id !== id) : [...selectedIds, id]
    );
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
      selectedId={selectedId}
      selectedIds={selectedIds}
      handleSelect={handleSelect}
      isLargeRow={isLargeRow}
    />
  );
};

SimpleList.propTypes = propTypes;
SimpleList.defaultProps = defaultProps;
export default SimpleList;
